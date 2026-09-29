create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  admin_role text check (admin_role in ('super_admin', 'product_manager', 'rfq_manager', 'seller_manager', 'content_manager')),
  buyer_status text check (buyer_status in ('pending', 'approved', 'rejected')),
  seller_status text check (seller_status in ('pending', 'approved', 'rejected', 'suspended')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text not null default '';
alter table public.profiles add column if not exists buyer_status text check (buyer_status in ('pending', 'approved', 'rejected'));

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  account_role text := case
    when new.raw_user_meta_data->>'account_type' = 'seller' then 'seller'
    else 'customer'
  end;
begin
  insert into public.profiles (id, email, full_name, company_name, phone, role, buyer_status, seller_status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    account_role,
    case when account_role = 'customer' then 'pending' else null end,
    case when account_role = 'seller' then 'approved' else null end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name, company_name, phone, role, buyer_status, seller_status)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(users.raw_user_meta_data->>'full_name', ''),
  coalesce(users.raw_user_meta_data->>'company_name', ''),
  coalesce(users.raw_user_meta_data->>'phone', ''),
  case when users.raw_user_meta_data->>'account_type' = 'seller' then 'seller' else 'customer' end,
  case when users.raw_user_meta_data->>'account_type' = 'seller' then null else 'pending' end,
  case when users.raw_user_meta_data->>'account_type' = 'seller' then 'approved' else null end
from auth.users as users
on conflict (id) do update
set email = excluded.email,
    buyer_status = coalesce(public.profiles.buyer_status, case when public.profiles.role = 'customer' and public.profiles.is_active then 'approved' else excluded.buyer_status end),
    seller_status = case
      when public.profiles.role = 'seller' and public.profiles.seller_status = 'pending' then 'approved'
      else coalesce(public.profiles.seller_status, excluded.seller_status)
    end;

create or replace function public.set_seller_status(target_user_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_status is null or new_status not in ('pending', 'approved', 'rejected', 'suspended') then
    raise exception 'Invalid seller status';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
      and admin_role in ('super_admin', 'seller_manager')
  ) then
    raise exception 'Not authorized to manage seller applications';
  end if;

  update public.profiles
  set seller_status = new_status,
      is_active = case when new_status = 'approved' then true when new_status in ('rejected', 'suspended') then false else is_active end
  where id = target_user_id and role = 'seller';
end;
$$;

grant execute on function public.set_seller_status(uuid, text) to authenticated;

drop policy if exists "Users can view their own profile; admins can view all" on public.profiles;
create policy "Users can view their own profile; admins can view all"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their own contact details" on public.profiles;
create policy "Users can update their own contact details"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, company_name, phone) on public.profiles to authenticated;

create table if not exists public.site_config (
  config_key text primary key,
  config_value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table public.site_config enable row level security;

drop policy if exists "Anyone can read public site configuration" on public.site_config;
create policy "Anyone can read public site configuration"
on public.site_config for select to anon, authenticated
using (true);

create or replace function public.save_site_config(p_key text, p_value jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
begin
  select admin_role into actor_role
  from public.profiles
  where id = auth.uid() and role = 'admin' and is_active = true;

  if actor_role is null then
    raise exception 'Active administrator access is required';
  end if;

  if p_key not in (
    'website_settings', 'categories', 'products', 'services', 'industries',
    'vendor_documents', 'social_media', 'homepage_sections', 'promotional_offer'
  ) then
    raise exception 'Unsupported site configuration key';
  end if;

  if p_key in ('products', 'categories') and actor_role not in ('super_admin', 'product_manager') then
    raise exception 'Product manager access is required';
  end if;

  if p_key not in ('products', 'categories') and actor_role not in ('super_admin', 'content_manager') then
    raise exception 'Content manager access is required';
  end if;

  insert into public.site_config (config_key, config_value, updated_at, updated_by)
  values (p_key, p_value, now(), auth.uid())
  on conflict (config_key) do update
    set config_value = excluded.config_value,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by;
end;
$$;

revoke all on public.site_config from anon, authenticated;
grant select on public.site_config to anon, authenticated;
revoke all on function public.save_site_config(text, jsonb) from public, anon;
grant execute on function public.save_site_config(text, jsonb) to authenticated;

create or replace function public.manage_admin_role(p_email text, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_is_super_admin boolean;
begin
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and admin_role = 'super_admin'
      and is_active = true
  ) into actor_is_super_admin;

  if not actor_is_super_admin then
    raise exception 'Super administrator access is required';
  end if;

  if p_role not in ('none', 'product_manager', 'rfq_manager', 'seller_manager', 'content_manager') then
    raise exception 'Unsupported administrator role';
  end if;

  update public.profiles
  set role = case when p_role = 'none' then 'customer' else 'admin' end,
      admin_role = case when p_role = 'none' then null else p_role end
  where lower(email) = lower(trim(p_email))
    and role in ('customer', 'admin')
    and coalesce(admin_role, '') <> 'super_admin';

  if not found then
    raise exception 'No eligible registered buyer account found for that email';
  end if;
end;
$$;

revoke all on function public.manage_admin_role(text, text) from public, anon;
grant execute on function public.manage_admin_role(text, text) to authenticated;

create or replace function public.admin_manage_account(p_user_id uuid, p_action text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
begin
  select admin_role into actor_role
  from public.profiles
  where id = auth.uid() and role = 'admin' and is_active = true;

  if actor_role is null or actor_role not in ('super_admin', 'seller_manager') then
    raise exception 'Seller manager or super administrator access is required';
  end if;

  if p_action = 'approve_buyer' then
    update public.profiles
    set buyer_status = 'approved', is_active = true
    where id = p_user_id and role = 'customer' and buyer_status = 'pending';
  elsif p_action = 'reject_buyer' then
    update public.profiles
    set buyer_status = 'rejected', is_active = false
    where id = p_user_id and role = 'customer' and buyer_status = 'pending';
  elsif p_action = 'reactivate_buyer' then
    update public.profiles
    set buyer_status = 'approved', is_active = true
    where id = p_user_id and role = 'customer' and is_active = false;
  elsif p_action = 'deactivate' then
    update public.profiles
    set is_active = false,
        buyer_status = case when role = 'customer' then 'rejected' else buyer_status end,
        seller_status = case when role = 'seller' then 'suspended' else seller_status end
    where id = p_user_id
      and id <> auth.uid()
      and role in ('customer', 'seller');
  else
    raise exception 'Unsupported account action';
  end if;

  if not found then
    raise exception 'No eligible buyer or seller account found';
  end if;
end;
$$;

revoke all on function public.admin_manage_account(uuid, text) from public, anon;
grant execute on function public.admin_manage_account(uuid, text) to authenticated;

create table if not exists public.marketplace_rfqs (
  id text primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  owner_role text not null check (owner_role in ('customer', 'seller')),
  status text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_offers (
  id text primary key,
  rfq_id text not null references public.marketplace_rfqs (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  status text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_orders (
  id text primary key,
  rfq_id text not null references public.marketplace_rfqs (id) on delete cascade,
  offer_id text not null references public.marketplace_offers (id),
  customer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.marketplace_rfqs enable row level security;
alter table public.marketplace_offers enable row level security;
alter table public.marketplace_orders enable row level security;

drop policy if exists "Participants can read RFQs" on public.marketplace_rfqs;
create policy "Participants can read RFQs"
on public.marketplace_rfqs for select to authenticated
using (
  exists (select 1 from public.profiles actor where actor.id = auth.uid() and actor.is_active)
  and (
    owner_id = auth.uid()
    or public.is_admin()
    or (
      owner_role = 'seller'
      and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'customer' and p.buyer_status = 'approved')
    )
    or (
      owner_role = 'customer'
      and status in ('Submitted', 'Offers Received')
      and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'seller' and p.seller_status = 'approved')
    )
  )
);

drop policy if exists "RFQ participants can read offers" on public.marketplace_offers;
create policy "RFQ participants can read offers"
on public.marketplace_offers for select to authenticated
using (
  exists (select 1 from public.profiles actor where actor.id = auth.uid() and actor.is_active)
  and (
    seller_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.marketplace_rfqs r where r.id = rfq_id and r.owner_id = auth.uid())
  )
);

drop policy if exists "Order participants can read orders" on public.marketplace_orders;
create policy "Order participants can read orders"
on public.marketplace_orders for select to authenticated
using (
  exists (select 1 from public.profiles actor where actor.id = auth.uid() and actor.is_active)
  and (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin())
);

revoke all on public.marketplace_rfqs, public.marketplace_offers, public.marketplace_orders from anon, authenticated;
grant select on public.marketplace_rfqs, public.marketplace_offers, public.marketplace_orders to authenticated;

create or replace function public.save_marketplace_record(p_type text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles%rowtype;
  existing_rfq public.marketplace_rfqs%rowtype;
  existing_offer public.marketplace_offers%rowtype;
  rfq_owner uuid;
  rfq_owner_role text;
  item_id text;
  new_status text;
begin
  select * into actor from public.profiles where id = auth.uid() and is_active = true;
  if actor.id is null then
    raise exception 'Active account required';
  end if;

  if p_type = 'rfq' then
    item_id := p_data->>'id';
    select * into existing_rfq from public.marketplace_rfqs where id = item_id for update;
    new_status := coalesce(p_data->>'status', 'Submitted');

    if existing_rfq.id is null then
      if p_data->>'customerId' <> auth.uid()::text
        or p_data->>'createdByRole' <> actor.role
        or not ((actor.role = 'customer' and actor.buyer_status = 'approved') or (actor.role = 'seller' and actor.seller_status = 'approved')) then
        raise exception 'Approved account can only create its own RFQ';
      end if;
      insert into public.marketplace_rfqs (id, owner_id, owner_role, status, data)
      values (item_id, auth.uid(), actor.role, new_status, p_data);
    else
      if existing_rfq.owner_id <> auth.uid()
        and not (actor.role = 'admin' and actor.admin_role in ('super_admin', 'rfq_manager'))
        and not (
          new_status = 'Seller Confirmed'
          and actor.role = 'seller'
          and actor.seller_status = 'approved'
          and exists (
            select 1 from public.marketplace_offers o
            where o.rfq_id = existing_rfq.id and o.seller_id = auth.uid() and o.status = 'confirmed'
          )
        ) then
        raise exception 'Only the RFQ owner or an administrator can update this RFQ';
      end if;
      if existing_rfq.owner_id = auth.uid()
        and (p_data->>'customerId' <> existing_rfq.owner_id::text
          or p_data->>'createdByRole' <> existing_rfq.owner_role) then
        raise exception 'RFQ ownership cannot be changed';
      end if;
      if actor.role = 'admin' and actor.admin_role not in ('super_admin', 'rfq_manager') then
        raise exception 'RFQ manager access is required';
      end if;
      update public.marketplace_rfqs
        set status = new_status,
          data = p_data || jsonb_build_object('customerId', existing_rfq.owner_id, 'createdByRole', existing_rfq.owner_role),
          updated_at = now()
      where id = item_id;
    end if;

  elsif p_type = 'offer' then
    item_id := p_data->>'id';
    select * into existing_offer from public.marketplace_offers where id = item_id for update;
    item_id := p_data->>'rfqId';
    select owner_id, owner_role into rfq_owner, rfq_owner_role from public.marketplace_rfqs where id = item_id;
    if rfq_owner is null then raise exception 'RFQ not found'; end if;
    item_id := p_data->>'id';
    new_status := p_data->>'status';

    if existing_offer.id is null then
      if p_data->>'sellerId' <> auth.uid()::text or rfq_owner = auth.uid()
        or p_data->>'bidderRole' <> actor.role
        or not (
          (rfq_owner_role = 'customer' and actor.role = 'seller' and actor.seller_status = 'approved')
          or (rfq_owner_role = 'seller' and actor.role = 'customer' and actor.buyer_status = 'approved')
        ) then
        raise exception 'Only an approved seller or buyer can respond to the opposite account RFQ';
      end if;
      insert into public.marketplace_offers (id, rfq_id, seller_id, status, data)
      values (item_id, p_data->>'rfqId', auth.uid(), new_status, p_data);
      update public.marketplace_rfqs
      set status = 'Offers Received', data = jsonb_set(data, '{status}', '"Offers Received"'::jsonb), updated_at = now()
      where id = p_data->>'rfqId' and status = 'Submitted';
    else
      select owner_id, owner_role into rfq_owner, rfq_owner_role from public.marketplace_rfqs where id = existing_offer.rfq_id;
      if rfq_owner = auth.uid()
        and ((actor.role = 'customer' and actor.buyer_status = 'approved' and rfq_owner_role = 'customer')
          or (actor.role = 'seller' and actor.seller_status = 'approved' and rfq_owner_role = 'seller')) then
        if new_status not in ('counter_offered', 'selected', 'rejected') then
          raise exception 'RFQ owner action is not allowed for this response';
        end if;
        if new_status = 'counter_offered' and (coalesce((p_data->>'counterPrice')::numeric, 0) <= 0 or existing_offer.status <> 'pending') then
          raise exception 'A valid counteroffer can only be sent against a pending offer';
        end if;
        if new_status in ('selected', 'rejected') and existing_offer.status not in ('pending', 'counter_offered') then
          raise exception 'This offer is no longer available';
        end if;
        update public.marketplace_offers
        set status = new_status,
            data = p_data || jsonb_build_object(
              'id', existing_offer.id,
              'rfqId', existing_offer.rfq_id,
              'sellerId', existing_offer.seller_id,
              'bidderRole', coalesce(existing_offer.data->>'bidderRole', 'seller')
            ),
            updated_at = now()
        where id = existing_offer.id;
        if new_status = 'selected' then
          update public.marketplace_offers
          set status = 'rejected', data = jsonb_set(data, '{status}', '"rejected"'::jsonb), updated_at = now()
          where rfq_id = existing_offer.rfq_id and id <> existing_offer.id and status in ('pending', 'counter_offered');
          update public.marketplace_rfqs
          set status = 'Seller Selected',
              data = jsonb_set(jsonb_set(data, '{status}', '"Seller Selected"'::jsonb), '{selectedSellerOfferId}', to_jsonb(existing_offer.id)),
              updated_at = now()
          where id = existing_offer.rfq_id;
        end if;
      elsif existing_offer.seller_id = auth.uid()
        and coalesce(existing_offer.data->>'bidderRole', 'seller') = actor.role
        and ((actor.role = 'seller' and actor.seller_status = 'approved') or (actor.role = 'customer' and actor.buyer_status = 'approved')) then
        if not ((existing_offer.status = 'counter_offered' and new_status in ('selected', 'pending'))
          or (existing_offer.status = 'selected' and new_status = 'confirmed')) then
          raise exception 'Respondent action is not allowed for this offer';
        end if;
        if existing_offer.status = 'counter_offered' and new_status = 'selected' then
          p_data := p_data || jsonb_build_object('totalPrice', (existing_offer.data->>'counterPrice')::numeric);
        end if;
        update public.marketplace_offers
        set status = new_status,
            data = p_data || jsonb_build_object(
              'id', existing_offer.id,
              'rfqId', existing_offer.rfq_id,
              'sellerId', existing_offer.seller_id,
              'bidderRole', coalesce(existing_offer.data->>'bidderRole', 'seller')
            ),
            updated_at = now()
        where id = existing_offer.id;
        if new_status = 'selected' then
          update public.marketplace_offers
          set status = 'rejected', data = jsonb_set(data, '{status}', '"rejected"'::jsonb), updated_at = now()
          where rfq_id = existing_offer.rfq_id and id <> existing_offer.id and status in ('pending', 'counter_offered');
          update public.marketplace_rfqs
          set status = 'Seller Selected',
              data = jsonb_set(jsonb_set(data, '{status}', '"Seller Selected"'::jsonb), '{selectedSellerOfferId}', to_jsonb(existing_offer.id)),
              updated_at = now()
          where id = existing_offer.rfq_id;
        elsif new_status = 'confirmed' then
          update public.marketplace_rfqs
          set status = 'Seller Confirmed', data = jsonb_set(data, '{status}', '"Seller Confirmed"'::jsonb), updated_at = now()
          where id = existing_offer.rfq_id;
        end if;
      else
        raise exception 'Only the RFQ owner or assigned seller can update this offer';
      end if;
    end if;

  elsif p_type = 'order' then
    item_id := p_data->>'id';
    if actor.role <> 'seller' or actor.seller_status <> 'approved' or p_data->>'sellerId' <> auth.uid()::text then
      raise exception 'Only the assigned approved seller can create a fulfillment record';
    end if;
    if not exists (
      select 1 from public.marketplace_offers o
      join public.marketplace_rfqs r on r.id = o.rfq_id
      where o.id = p_data->>'offerId' and o.rfq_id = p_data->>'rfqId'
        and o.seller_id = auth.uid() and o.status = 'confirmed'
        and r.owner_id = (p_data->>'customerId')::uuid
    ) then
      raise exception 'The seller offer must be confirmed before dispatch';
    end if;
    insert into public.marketplace_orders (id, rfq_id, offer_id, customer_id, seller_id, data)
    values (item_id, p_data->>'rfqId', p_data->>'offerId', p_data->>'customerId', auth.uid(), p_data)
    on conflict (id) do update set data = excluded.data;
  else
    raise exception 'Unsupported marketplace record type';
  end if;
end;
$$;

revoke all on function public.save_marketplace_record(text, jsonb) from public, anon;
grant execute on function public.save_marketplace_record(text, jsonb) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
      alter publication supabase_realtime add table public.profiles;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_config') then
      alter publication supabase_realtime add table public.site_config;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'marketplace_rfqs') then
      alter publication supabase_realtime add table public.marketplace_rfqs;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'marketplace_offers') then
      alter publication supabase_realtime add table public.marketplace_offers;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'marketplace_orders') then
      alter publication supabase_realtime add table public.marketplace_orders;
    end if;
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_manage_site_asset(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
      and (
        admin_role = 'super_admin'
        or (split_part(object_name, '/', 1) = 'branding' and admin_role = 'content_manager')
        or (split_part(object_name, '/', 1) = 'products' and admin_role = 'product_manager')
      )
  );
$$;

revoke all on function public.can_manage_site_asset(text) from public, anon;
grant execute on function public.can_manage_site_asset(text) to authenticated;

drop policy if exists "Public can view site assets" on storage.objects;
create policy "Public can view site assets"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site-assets');

drop policy if exists "Authorized admins upload site assets" on storage.objects;
create policy "Authorized admins upload site assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and public.can_manage_site_asset(name));

drop policy if exists "Authorized admins update site assets" on storage.objects;
create policy "Authorized admins update site assets"
on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and public.can_manage_site_asset(name))
with check (bucket_id = 'site-assets' and public.can_manage_site_asset(name));

drop policy if exists "Authorized admins delete site assets" on storage.objects;
create policy "Authorized admins delete site assets"
on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and public.can_manage_site_asset(name));

update public.profiles
set role = 'admin', admin_role = 'super_admin', is_active = true
where lower(email) = lower('admin@artindustrialsolution.com')
returning id, email, role, admin_role;

