create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  summary text not null,
  description text,
  cover_url text,
  media_urls text[] default '{}',
  technologies text[] default '{}',
  outcome text,
  before_url text,
  after_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

insert into portfolio_categories (name, sort_order)
values
  ('Social Media', 0),
  ('Graphic Design', 1),
  ('Research', 2),
  ('Data Analytics', 3),
  ('Documentation', 4),
  ('Proofs', 5)
on conflict (name) do nothing;

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null,
  updated_at timestamptz default now()
);

insert into site_settings (setting_key, setting_value)
values
  (
    'profile',
    '{
      "name": "Janine Dequiros",
      "title": "Virtual Assistant",
      "headline": "Plan and grow, I''ll run the show.",
      "tagline": "I deliver professional, detail-driven support with discretion and efficiency, helping entrepreneurs and professionals achieve their goals and grow with confidence.",
      "email": "janedeqz@gmail.com",
      "secondaryEmail": "janine.dequiros.18@gmail.com",
      "phone": "+63 991 688 1778",
      "secondaryPhone": "+63 967 278 9012",
      "location": "Tarlac City, Philippines",
      "availability": "Available for freelance work",
      "heroImageUrl": "",
      "aboutImageUrl": "",
      "cvUrl": "",
      "facebookUrl": "",
      "instagramUrl": "",
      "linkedinUrl": "",
      "githubUrl": "",
      "whatsappUrl": "",
      "telegramUrl": "",
      "messengerUrl": ""
    }'::jsonb
  )
on conflict (setting_key) do nothing;

insert into site_settings (setting_key, setting_value)
values
  (
    'about',
    '{
      "summary": "I am a results-driven Virtual Assistant with expertise in social media management, graphic design and illustration, virtual research, data analytics, and data management support. With experience in both corporate and freelance environments, I bring structure, precision, and strategic thinking to every project. I create high-quality visual assets, manage brand-aligned digital platforms, and transform complex data into actionable insights that drive informed decisions.",
      "mission": "I operate with a high standard of professionalism, confidentiality, and attention to detail, consistently delivering projects on time and with measurable impact. Whether supporting entrepreneurs, global clients, or academic professionals, I combine creative intelligence with analytical rigor and operational efficiency to help you achieve your goals and elevate your business."
    }'::jsonb
  )
on conflict (setting_key) do nothing;

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_avatar_url text,
  service text not null,
  preview text not null,
  feedback text not null,
  rating int check (rating between 1 and 5),
  project_type text,
  is_verified boolean default true,
  feedback_date date,
  created_at timestamptz default now()
);

create table if not exists proof_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  category text default 'Client Feedback',
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service_needed text not null,
  budget_range text,
  message text not null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  is_active boolean default true
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  professional_background text,
  expertise text[] default '{}',
  tools text[] default '{}',
  icon_name text,
  image_url text,
  price_range text,
  features text[] default '{}',
  tier text,
  sort_order int default 0,
  is_active boolean default true
);

create table if not exists education_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null,
  location text,
  details text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists experience_items (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  duration text,
  details text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists client_records (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_name text,
  service text,
  status text default 'completed',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists financial_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client_records(id) on delete set null,
  record_type text default 'income',
  description text not null,
  amount numeric(12, 2) not null default 0,
  currency text default 'PHP',
  payment_status text default 'paid',
  record_date date default current_date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz default now()
);

alter table portfolio_items enable row level security;
alter table portfolio_categories enable row level security;
alter table testimonials enable row level security;
alter table inquiries enable row level security;
alter table faqs enable row level security;
alter table services enable row level security;
alter table admin_profiles enable row level security;
alter table site_settings enable row level security;
alter table proof_items enable row level security;
alter table education_items enable row level security;
alter table experience_items enable row level security;
alter table client_records enable row level security;
alter table financial_records enable row level security;

-- Safely drop all existing policies before recreating them
drop policy if exists "Public can read portfolio items" on portfolio_items;
drop policy if exists "Public can read portfolio categories" on portfolio_categories;
drop policy if exists "Public can read testimonials" on testimonials;
drop policy if exists "Public can read proof items" on proof_items;
drop policy if exists "Public can read education items" on education_items;
drop policy if exists "Public can read experience items" on experience_items;
drop policy if exists "Public can read active faqs" on faqs;
drop policy if exists "Public can read active services" on services;
drop policy if exists "Public can read site settings" on site_settings;
drop policy if exists "Public can create testimonials" on testimonials;
drop policy if exists "Public can create inquiries" on inquiries;
drop policy if exists "Admins can read own admin profile" on admin_profiles;
drop policy if exists "Admins can manage portfolio items" on portfolio_items;
drop policy if exists "Admins can manage portfolio categories" on portfolio_categories;
drop policy if exists "Admins can manage testimonials" on testimonials;
drop policy if exists "Admins can manage faqs" on faqs;
drop policy if exists "Admins can manage services" on services;
drop policy if exists "Admins can manage site settings" on site_settings;
drop policy if exists "Admins can manage proof items" on proof_items;
drop policy if exists "Admins can manage education items" on education_items;
drop policy if exists "Admins can manage experience items" on experience_items;
drop policy if exists "Admins can manage client records" on client_records;
drop policy if exists "Admins can manage financial records" on financial_records;
drop policy if exists "Admins can read inquiries" on inquiries;
drop policy if exists "Admins can update inquiries" on inquiries;

-- Recreate policies
create policy "Public can read portfolio items" on portfolio_items for select using (true);
create policy "Public can read portfolio categories" on portfolio_categories for select using (true);
create policy "Public can read testimonials" on testimonials for select using (true);
create policy "Public can read proof items" on proof_items for select using (true);
create policy "Public can read education items" on education_items for select using (true);
create policy "Public can read experience items" on experience_items for select using (true);
create policy "Public can read active faqs" on faqs for select using (is_active = true);
create policy "Public can read active services" on services for select using (is_active = true);
create policy "Public can read site settings" on site_settings for select using (true);
create policy "Public can create testimonials" on testimonials for insert with check (true);
create policy "Public can create inquiries" on inquiries for insert with check (true);

create policy "Admins can read own admin profile" on admin_profiles for select to authenticated using (auth.uid() = id);
create policy "Admins can manage portfolio items" on portfolio_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage portfolio categories" on portfolio_categories for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage testimonials" on testimonials for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage faqs" on faqs for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage services" on services for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage site settings" on site_settings for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage proof items" on proof_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage education items" on education_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage experience items" on experience_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage client records" on client_records for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage financial records" on financial_records for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can read inquiries" on inquiries for select to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can update inquiries" on inquiries for update to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio assets" on storage.objects;
drop policy if exists "Admins can upload portfolio assets" on storage.objects;
drop policy if exists "Admins can update portfolio assets" on storage.objects;
drop policy if exists "Admins can delete portfolio assets" on storage.objects;

create policy "Public can read portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Admins can upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid())) with check (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
