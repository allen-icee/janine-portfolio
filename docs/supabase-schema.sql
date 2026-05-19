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

create policy "Public can read portfolio items"
  on portfolio_items for select
  using (true);

create policy "Public can read testimonials"
  on testimonials for select
  using (true);

create policy "Public can read proof items"
  on proof_items for select
  using (true);

create policy "Public can read education items"
  on education_items for select
  using (true);

create policy "Public can read experience items"
  on experience_items for select
  using (true);

create policy "Public can read active faqs"
  on faqs for select
  using (is_active = true);

create policy "Public can read active services"
  on services for select
  using (is_active = true);

create policy "Public can read site settings"
  on site_settings for select
  using (true);

create policy "Admins can read own admin profile"
  on admin_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can manage portfolio items"
  on portfolio_items for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage testimonials"
  on testimonials for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage faqs"
  on faqs for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage services"
  on services for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage site settings"
  on site_settings for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage proof items"
  on proof_items for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage education items"
  on education_items for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage experience items"
  on experience_items for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage client records"
  on client_records for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can manage financial records"
  on financial_records for all
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

-- Inquiries should be inserted through Laravel to add validation, rate limiting, and spam checks.
create policy "Admins can read inquiries"
  on inquiries for select
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can update inquiries"
  on inquiries for update
  to authenticated
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()))
  with check (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
