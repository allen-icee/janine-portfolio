-- ==============================================================================
-- 1. CREATE ALL TABLES FIRST
-- ==============================================================================

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

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_avatar_url text,
  service text default 'General Feedback',
  preview text not null,
  feedback text not null,
  suggestion text,
  rating int check (rating between 1 and 5),
  project_type text,
  is_verified boolean default false,
  is_approved boolean default false,
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

create table if not exists rate_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  icon_name text,
  note text,
  inclusions text[] default '{}',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table rate_categories add column if not exists inclusions text[] default '{}';

create table if not exists rate_service_groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references rate_categories(id) on delete restrict,
  title text not null,
  description text,
  note text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (category_id, title)
);

create table if not exists rate_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references rate_service_groups(id) on delete restrict,
  name text not null,
  rate_text text not null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (group_id, name)
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

-- ==========================================
-- NEW TABLE 1: Profile Settings (Contacts)
-- ==========================================
create table if not exists profile_settings (
  id uuid primary key default gen_random_uuid(),
  email_primary text,
  email_secondary text,
  phone_primary text,
  phone_secondary text,
  facebook_url text,
  instagram_url text,
  location text,
  updated_at timestamptz default now()
);

-- ==========================================
-- NEW TABLE 2: Professional Journey
-- ==========================================
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

-- ==========================================
-- NEW TABLE 3: Site Analytics (Page Views)
-- ==========================================
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  visitor_id text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_page_views_created_at on page_views(created_at);


-- ==============================================================================
-- 2. INSERT DEFAULT DATA
-- ==============================================================================

insert into portfolio_categories (name, sort_order)
values
  ('Social Media', 0), ('Graphic Design', 1), ('Research', 2),
  ('Data Analytics', 3), ('Documentation', 4), ('Proofs', 5)
on conflict (name) do nothing;

insert into profile_settings (
  email_primary, email_secondary, phone_primary, phone_secondary, 
  facebook_url, instagram_url, location
)
select 
  'janedeqz@gmail.com', 'janine.dequiros.18@gmail.com', 
  '+63 991 688 1778', '+63 967 278 9012', 
  'https://www.facebook.com', 'https://www.instagram.com/deminineinks/', 
  'Tarlac City, Philippines'
where not exists (select 1 from profile_settings);

insert into experience_items (company, role, location, duration, details, sort_order)
select 'Infosys BPM', 'Process Executive & Complaints Resolution Specialist', 'SM Clark, Pampanga', '1 yr 3 mos (Jan ''25 - Feb ''26)', ARRAY['CS100 Top 1 Trainee & Mock Calls Top Trainee', 'Top Agent spanning January 2025 until February 2026', 'Awarded Most Recognizable Agent for consistently doing the extra mile'], 0
where not exists (select 1 from experience_items where company = 'Infosys BPM');

insert into experience_items (company, role, location, duration, details, sort_order)
select 'Freelancer / Commissioner', 'Academic Research Specialist', 'WFH - Tarlac City', '3 yrs 3 mos', ARRAY['Managed various tasks and projects for diverse clients across different regions and grade levels.', 'Primary focus on comprehensive Researches and Thesis documentation.', 'Delivered high-quality art-related commissions, including 2D animations and custom illustrations.'], 1
where not exists (select 1 from experience_items where company = 'Freelancer / Commissioner');


-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

alter table portfolio_items enable row level security;
alter table portfolio_categories enable row level security;
alter table testimonials enable row level security;
alter table inquiries enable row level security;
alter table faqs enable row level security;
alter table services enable row level security;
alter table rate_categories enable row level security;
alter table rate_service_groups enable row level security;
alter table rate_items enable row level security;
alter table admin_profiles enable row level security;
alter table profile_settings enable row level security;
alter table proof_items enable row level security;
alter table education_items enable row level security;
alter table experience_items enable row level security;
alter table client_records enable row level security;
alter table financial_records enable row level security;
alter table page_views enable row level security;


-- ==============================================================================
-- 4. SAFELY DROP ALL EXISTING POLICIES
-- ==============================================================================

drop policy if exists "Public can read portfolio items" on portfolio_items;
drop policy if exists "Public can read portfolio categories" on portfolio_categories;
drop policy if exists "Public can read testimonials" on testimonials;
drop policy if exists "Public can read proof items" on proof_items;
drop policy if exists "Public can read education items" on education_items;
drop policy if exists "Public can read experience items" on experience_items;
drop policy if exists "Public can read active faqs" on faqs;
drop policy if exists "Public can read active services" on services;
drop policy if exists "Public can read active rate categories" on rate_categories;
drop policy if exists "Public can read active rate groups" on rate_service_groups;
drop policy if exists "Public can read active rate items" on rate_items;
drop policy if exists "Public can read profile settings" on profile_settings;
drop policy if exists "Public can create testimonials" on testimonials;
drop policy if exists "Public can create inquiries" on inquiries;

drop policy if exists "Admins can read own admin profile" on admin_profiles;
drop policy if exists "Admins can manage portfolio items" on portfolio_items;
drop policy if exists "Admins can manage portfolio categories" on portfolio_categories;
drop policy if exists "Admins can manage testimonials" on testimonials;
drop policy if exists "Admins can manage faqs" on faqs;
drop policy if exists "Admins can manage services" on services;
drop policy if exists "Admins can manage rate categories" on rate_categories;
drop policy if exists "Admins can manage rate groups" on rate_service_groups;
drop policy if exists "Admins can manage rate items" on rate_items;
drop policy if exists "Admins can manage profile settings" on profile_settings;
drop policy if exists "Admins can manage proof items" on proof_items;
drop policy if exists "Admins can manage education items" on education_items;
drop policy if exists "Admins can manage experience items" on experience_items;
drop policy if exists "Admins can manage client records" on client_records;
drop policy if exists "Admins can manage financial records" on financial_records;
drop policy if exists "Admins can read inquiries" on inquiries;
drop policy if exists "Admins can update inquiries" on inquiries;
drop policy if exists "Admins can delete inquiries" on inquiries;


-- ==============================================================================
-- 5. RECREATE ALL POLICIES
-- ==============================================================================

-- Public
create policy "Public can read portfolio items" on portfolio_items for select using (true);
create policy "Public can read portfolio categories" on portfolio_categories for select using (true);
create policy "Public can read testimonials" on testimonials for select using (is_approved = true);
create policy "Public can read proof items" on proof_items for select using (true);
create policy "Public can read education items" on education_items for select using (true);
create policy "Public can read experience items" on experience_items for select using (true);
create policy "Public can read active faqs" on faqs for select using (is_active = true);
create policy "Public can read active services" on services for select using (is_active = true);
create policy "Public can read active rate categories" on rate_categories for select using (is_active = true);
create policy "Public can read active rate groups" on rate_service_groups for select using (is_active = true);
create policy "Public can read active rate items" on rate_items for select using (is_active = true);
create policy "Public can read profile settings" on profile_settings for select using (true);
create policy "Public can create testimonials" on testimonials for insert with check (is_approved = false and is_verified = false);
create policy "Public can create inquiries" on inquiries for insert with check (true);
create policy "Public can record page views" on page_views for insert with check (true);

-- Admin
create policy "Admins can read own admin profile" on admin_profiles for select to authenticated using (auth.uid() = id);
create policy "Admins can manage portfolio items" on portfolio_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage portfolio categories" on portfolio_categories for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage testimonials" on testimonials for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage faqs" on faqs for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage services" on services for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage rate categories" on rate_categories for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage rate groups" on rate_service_groups for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage rate items" on rate_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage profile settings" on profile_settings for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage proof items" on proof_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage education items" on education_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage experience items" on experience_items for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage client records" on client_records for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can manage financial records" on financial_records for all to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can read inquiries" on inquiries for select to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can update inquiries" on inquiries for update to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can delete inquiries" on inquiries for delete to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can read page views" on page_views for select to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can delete page views" on page_views for delete to authenticated using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));


-- ==============================================================================
-- 6. STORAGE BUCKET FIXES
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets', 'portfolio-assets', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio assets" on storage.objects;
drop policy if exists "Admins can upload portfolio assets" on storage.objects;
drop policy if exists "Admins can update portfolio assets" on storage.objects;
drop policy if exists "Admins can delete portfolio assets" on storage.objects;

create policy "Public can read portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Admins can upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
create policy "Admins can delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));