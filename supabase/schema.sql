create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  admin_role text check (admin_role in ('super_admin', 'product_manager', 'rfq_manager', 'seller_manager', 'content_manager')),
  seller_status text check (seller_status in ('pending', 'approved', 'rejected', 'suspended')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text not null default '';

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
  insert into public.profiles (id, email, full_name, company_name, phone, role, seller_status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    account_role,
    case when account_role = 'seller' then 'pending' else null end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name, company_name, phone, role, seller_status)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(users.raw_user_meta_data->>'full_name', ''),
  coalesce(users.raw_user_meta_data->>'company_name', ''),
  coalesce(users.raw_user_meta_data->>'phone', ''),
  case when users.raw_user_meta_data->>'account_type' = 'seller' then 'seller' else 'customer' end,
  case when users.raw_user_meta_data->>'account_type' = 'seller' then 'pending' else null end
from auth.users as users
on conflict (id) do update
set email = excluded.email;

create or replace function public.set_seller_status(target_user_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_status not in ('pending', 'approved', 'rejected', 'suspended') then
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
  set seller_status = new_status
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

