-- ============================================
-- menoo staff portal - Supabase Schema
-- ============================================

-- notices (お知らせ)
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  tag text not null default '',
  created_at timestamptz not null default now()
);

alter table notices enable row level security;
create policy "anon_read_notices" on notices for select to anon using (true);
create policy "anon_insert_notices" on notices for insert to anon with check (true);
create policy "anon_update_notices" on notices for update to anon using (true) with check (true);
create policy "anon_delete_notices" on notices for delete to anon using (true);

-- products (商品)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default '',
  stock integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table products enable row level security;
create policy "anon_read_products" on products for select to anon using (true);
create policy "anon_insert_products" on products for insert to anon with check (true);
create policy "anon_update_products" on products for update to anon using (true) with check (true);
create policy "anon_delete_products" on products for delete to anon using (true);

-- manuals (マニュアル)
create table if not exists manuals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  body text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table manuals enable row level security;
create policy "anon_read_manuals" on manuals for select to anon using (true);
create policy "anon_insert_manuals" on manuals for insert to anon with check (true);
create policy "anon_update_manuals" on manuals for update to anon using (true) with check (true);
create policy "anon_delete_manuals" on manuals for delete to anon using (true);

-- shifts (シフト)
create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  staff_name text not null,
  time_range text not null,
  created_at timestamptz not null default now()
);

alter table shifts enable row level security;
create policy "anon_read_shifts" on shifts for select to anon using (true);
create policy "anon_insert_shifts" on shifts for insert to anon with check (true);
create policy "anon_update_shifts" on shifts for update to anon using (true) with check (true);
create policy "anon_delete_shifts" on shifts for delete to anon using (true);
