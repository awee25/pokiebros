-- =============================================
-- POKEMON STORE - SUPABASE SCHEMA
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- Categories
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  stock integer not null default 0,
  category_id uuid references categories(id) on delete set null,
  image_url text,
  is_preorder boolean default false,
  preorder_release_date date,
  preorder_limit integer,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_address text not null,
  customer_notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','payment_requested','paid','shipped','completed','cancelled')),
  subtotal decimal(10,2) not null,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  is_preorder boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- SEED DATA: Default categories
-- =============================================
insert into categories (name) values
  ('Booster Packs'),
  ('Booster Boxes'),
  ('Elite Trainer Boxes'),
  ('Single Cards'),
  ('Sealed Products'),
  ('Accessories'),
  ('Bundles')
on conflict (name) do nothing;

-- =============================================
-- FUNCTION: Auto-update updated_at
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Public can read active products and categories.
-- Orders are only accessible server-side (service role).
-- =============================================
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for products
create policy "Public can view active products"
  on products for select using (active = true);

-- Public read for categories
create policy "Public can view categories"
  on categories for select using (true);

-- Orders: only service role (no public policies)
-- (your API routes use the service role key)

-- =============================================
-- FUNCTION: Decrement stock safely
-- =============================================
create or replace function decrement_stock(product_id uuid, qty integer)
returns void as $$
begin
  update products
  set stock = greatest(0, stock - qty)
  where id = product_id and is_preorder = false;
end;
$$ language plpgsql security definer;
