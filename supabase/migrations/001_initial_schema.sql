-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 001_initial_schema
-- Description: Core tables for spice exporter website
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Helper: auto-update updated_at ──────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── products ────────────────────────────────────────────────────────────────

create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  name_id         text not null,
  name_en         text not null,
  description_id  text not null default '',
  description_en  text not null default '',
  origin_id       text not null default '',
  origin_en       text not null default '',
  category        text not null default 'whole_spice'
                  check (category in ('whole_spice','ground_spice','essential_oil','oleoresin','other')),
  moisture_max    numeric(5,2),
  ash_max         numeric(5,2),
  available_forms text[] not null default '{}',
  min_order_kg    numeric(10,2),
  is_published    boolean not null default false,
  featured        boolean not null default false,
  cover_url       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_slug_idx        on products (slug);
create index if not exists products_category_idx    on products (category);
create index if not exists products_is_published_idx on products (is_published);
create index if not exists products_featured_idx    on products (featured);

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ─── product_images ──────────────────────────────────────────────────────────

create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  url         text not null,
  alt         text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on product_images (product_id);
create index if not exists product_images_position_idx   on product_images (product_id, position);

-- ─── gallery ─────────────────────────────────────────────────────────────────

create table if not exists gallery (
  id          uuid primary key default uuid_generate_v4(),
  url         text not null,
  caption_id  text,
  caption_en  text,
  category    text not null default 'other'
              check (category in ('facility','product','certification','team','other')),
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_category_idx on gallery (category);
create index if not exists gallery_position_idx on gallery (position);

-- ─── inquiries ───────────────────────────────────────────────────────────────

create table if not exists inquiries (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  company     text,
  phone       text,
  product_id  uuid references products (id) on delete set null,
  quantity_kg numeric(10,2),
  message     text not null,
  status      text not null default 'new'
              check (status in ('new','in_progress','replied','closed')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists inquiries_status_idx     on inquiries (status);
create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_product_id_idx on inquiries (product_id);

create trigger inquiries_updated_at
  before update on inquiries
  for each row execute function update_updated_at();

-- ─── site_settings ───────────────────────────────────────────────────────────

create table if not exists site_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       text not null default '',
  label       text not null,
  "group"     text not null default 'general'
              check ("group" in ('general','contact','seo','social','hero')),
  updated_at  timestamptz not null default now()
);

create index if not exists site_settings_group_idx on site_settings ("group");

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_updated_at();

-- Seed default settings
insert into site_settings (key, label, "group", value) values
  ('company_name',   'Company Name',         'general', 'PT Rempah Nusantara'),
  ('tagline_id',     'Tagline (ID)',          'general', 'Rempah Terbaik, Kualitas Dunia'),
  ('tagline_en',     'Tagline (EN)',          'general', 'Finest Spices, World Quality'),
  ('description_id', 'Description (ID)',      'general', 'Eksportir rempah premium dari Indonesia'),
  ('description_en', 'Description (EN)',      'general', 'Premium spice exporter from Indonesia'),
  ('email',          'Contact Email',         'contact', 'info@example.my.id'),
  ('phone',          'Phone',                 'contact', '+62 21 1234567'),
  ('whatsapp',       'WhatsApp',              'contact', '+62 812 3456 7890'),
  ('address_id',     'Address (ID)',          'contact', 'Jakarta, Indonesia'),
  ('address_en',     'Address (EN)',          'contact', 'Jakarta, Indonesia'),
  ('instagram_url',  'Instagram URL',         'social',  ''),
  ('linkedin_url',   'LinkedIn URL',          'social',  ''),
  ('hero_title_id',  'Hero Title (ID)',        'hero',    'Rempah Premium Indonesia'),
  ('hero_title_en',  'Hero Title (EN)',        'hero',    'Premium Indonesian Spices'),
  ('hero_subtitle_id','Hero Subtitle (ID)',    'hero',    'Kualitas ekspor langsung dari sumber'),
  ('hero_subtitle_en','Hero Subtitle (EN)',    'hero',    'Export quality, direct from source'),
  ('hero_video_url', 'Hero Video URL',         'hero',    ''),
  ('og_image_url',   'OG Image URL',           'seo',     '')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table products       enable row level security;
alter table product_images enable row level security;
alter table gallery        enable row level security;
alter table inquiries      enable row level security;
alter table site_settings  enable row level security;

-- ── products: public read, service_role write ─────────────────────────────────

create policy "products_public_select"
  on products for select
  to anon, authenticated
  using (is_published = true);

create policy "products_service_all"
  on products for all
  to service_role
  using (true)
  with check (true);

-- ── product_images: public read for published products ───────────────────────

create policy "product_images_public_select"
  on product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id
        and p.is_published = true
    )
  );

create policy "product_images_service_all"
  on product_images for all
  to service_role
  using (true)
  with check (true);

-- ── gallery: public read ──────────────────────────────────────────────────────

create policy "gallery_public_select"
  on gallery for select
  to anon, authenticated
  using (true);

create policy "gallery_service_all"
  on gallery for all
  to service_role
  using (true)
  with check (true);

-- ── inquiries: anon insert only, service_role full access ────────────────────

create policy "inquiries_anon_insert"
  on inquiries for insert
  to anon, authenticated
  with check (true);

create policy "inquiries_service_all"
  on inquiries for all
  to service_role
  using (true)
  with check (true);

-- ── site_settings: public read, service_role write ───────────────────────────

create policy "site_settings_public_select"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_service_all"
  on site_settings for all
  to service_role
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage buckets
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true, 10485760,  array['image/jpeg','image/png','image/webp','image/avif']),
  ('gallery',  'gallery',  true, 10485760,  array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

-- Public read for both buckets
create policy "products_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'products');

create policy "gallery_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Service role can manage all objects
create policy "storage_service_all"
  on storage.objects for all
  to service_role
  using (true)
  with check (true);
