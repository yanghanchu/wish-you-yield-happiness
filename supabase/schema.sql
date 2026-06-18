create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('WY', 'YYH')),
  display_name text not null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  couple_name text default 'WY 和 YYH',
  site_title text default 'Wish You, Yield Happiness',
  start_date date not null,
  wy_display_name text default 'WY',
  yyh_display_name text default 'YYH',
  allow_guest_request boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists love_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  date date not null,
  author_role text not null check (author_role in ('WY', 'YYH')),
  mood text check (mood in ('开心', '想念', '感动', '甜蜜', '平静', '特别幸福')),
  tags text[] default '{}',
  is_favorite boolean default false,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists record_images (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references love_records(id) on delete cascade,
  image_url text not null,
  storage_path text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists album_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  caption text,
  date date not null,
  author_role text not null check (author_role in ('WY', 'YYH')),
  category text not null check (category in ('日常', '约会', '旅行', '吃饭', '礼物', '截图')),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  related_record_id uuid references love_records(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists anniversaries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  type text not null check (type in ('在一起', '第一次见面', '第一次约会', '生日', '节日', '自定义')),
  repeat text not null default 'none' check (repeat in ('none', 'monthly', 'yearly')),
  note text,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'planning', 'done')),
  target_date date,
  creator_role text not null check (creator_role in ('WY', 'YYH')),
  completed_date date,
  completed_note text,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists wish_images (
  id uuid primary key default gen_random_uuid(),
  wish_id uuid not null references wishes(id) on delete cascade,
  image_url text not null,
  storage_path text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists message_notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author_role text not null check (author_role in ('WY', 'YYH')),
  date date not null,
  theme text not null default 'pink' check (theme in ('pink', 'purple', 'cream')),
  is_pinned boolean default false,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists guest_requests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  access_token text unique,
  token_expires_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  approved_by_role text check (approved_by_role in ('WY', 'YYH')),
  approved_at timestamptz,
  rejected_by uuid references auth.users(id) on delete set null,
  rejected_by_role text check (rejected_by_role in ('WY', 'YYH')),
  rejected_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table app_settings enable row level security;
alter table love_records enable row level security;
alter table record_images enable row level security;
alter table album_photos enable row level security;
alter table anniversaries enable row level security;
alter table wishes enable row level security;
alter table wish_images enable row level security;
alter table message_notes enable row level security;
alter table guest_requests enable row level security;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('WY', 'YYH')
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'app_settings', 'love_records', 'album_photos', 'anniversaries', 'wishes', 'message_notes', 'guest_requests']
  loop
    execute format('drop trigger if exists touch_%I_updated_at on %I', t, t);
    execute format('create trigger touch_%I_updated_at before update on %I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'app_settings', 'love_records', 'record_images', 'album_photos', 'anniversaries', 'wishes', 'wish_images', 'message_notes', 'guest_requests']
  loop
    execute format('drop policy if exists "owners can read %I" on %I', t, t);
    execute format('drop policy if exists "owners can insert %I" on %I', t, t);
    execute format('drop policy if exists "owners can update %I" on %I', t, t);
    execute format('drop policy if exists "owners can delete %I" on %I', t, t);
    execute format('create policy "owners can read %I" on %I for select to authenticated using (public.is_owner())', t, t);
    execute format('create policy "owners can insert %I" on %I for insert to authenticated with check (public.is_owner())', t, t);
    execute format('create policy "owners can update %I" on %I for update to authenticated using (public.is_owner()) with check (public.is_owner())', t, t);
    execute format('create policy "owners can delete %I" on %I for delete to authenticated using (public.is_owner())', t, t);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('love-house', 'love-house', true)
on conflict (id) do nothing;

drop policy if exists "owners can upload love-house files" on storage.objects;
drop policy if exists "owners can update love-house files" on storage.objects;
drop policy if exists "owners can delete love-house files" on storage.objects;
drop policy if exists "public can read love-house files" on storage.objects;

create policy "public can read love-house files"
on storage.objects for select
using (bucket_id = 'love-house');

create policy "owners can upload love-house files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'love-house' and public.is_owner());

create policy "owners can update love-house files"
on storage.objects for update
to authenticated
using (bucket_id = 'love-house' and public.is_owner())
with check (bucket_id = 'love-house' and public.is_owner());

create policy "owners can delete love-house files"
on storage.objects for delete
to authenticated
using (bucket_id = 'love-house' and public.is_owner());
