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

update public.profiles
set role = 'admin', admin_role = 'super_admin', is_active = true
where lower(email) = lower('admin@artindustrialsolution.com')
returning id, email, role, admin_role;

