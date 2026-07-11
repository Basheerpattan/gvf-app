-- ============================================================
-- Green Valley Foundation — Supabase Schema (Safe Re-run Edition)
-- Run this entire file in your Supabase SQL Editor safely
-- ============================================================

-- 1. TABLES (Safe with if not exists)
create table if not exists gallery (
  id          uuid default gen_random_uuid() primary key,
  url         text not null,
  caption     text,
  created_at  timestamptz default now()
);

create table if not exists staff (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  designation   text not null,
  bio           text,
  photo_url     text,
  display_order int  default 0,
  created_at    timestamptz default now()
);

-- Safe to re-run: adds monthly salary for attendance-based salary calculation
alter table staff add column if not exists monthly_salary numeric default 0;

create table if not exists staff_attendance (
  id          uuid default gen_random_uuid() primary key,
  staff_id    uuid not null references staff(id) on delete cascade,
  date        date not null,
  status      text not null default 'present' check (status in ('present', 'absent', 'half_day', 'leave')),
  notes       text,
  created_at  timestamptz default now(),
  unique (staff_id, date)
);

create table if not exists reviews (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  review      text not null,
  approved    boolean default false,
  created_at  timestamptz default now()
);

create table if not exists enquiries (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  phone         text not null,
  email         text,
  enquiry_type  text,
  message       text not null,
  read          boolean default false,
  created_at    timestamptz default now()
);

create table if not exists appointments (
  id                uuid default gen_random_uuid() primary key,
  name              text not null,
  phone             text not null,
  email             text,
  appointment_type  text not null check (appointment_type in ('inpatient', 'outpatient', 'followup')),
  preferred_date    date,
  notes             text,
  status            text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at        timestamptz default now()
);

-- Safe to re-run: adds the email column for tables created before it existed
alter table appointments add column if not exists email text;

create table if not exists achievements (
  id            uuid default gen_random_uuid() primary key,
  icon          text default 'Trophy',
  value         text not null,
  title         text not null,
  description   text,
  display_order int  default 0
);

-- Safe to re-run: adds optional image for achievement cards
alter table achievements add column if not exists image_url text;

create table if not exists form_questions (
  id            uuid default gen_random_uuid() primary key,
  form_type     text not null check (form_type in ('inpatient', 'outpatient', 'followup')),
  question      text not null,
  field_type    text not null default 'text',
  options       jsonb,
  required      boolean default false,
  display_order int default 0,
  created_at    timestamptz default now()
);

create table if not exists form_submissions (
  id            uuid default gen_random_uuid() primary key,
  form_type     text not null,
  answers       jsonb not null,
  submitted_at  timestamptz default now()
);

create table if not exists site_settings (
  key           text primary key,
  value         text,
  updated_at    timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table gallery          enable row level security;
alter table staff            enable row level security;
alter table reviews          enable row level security;
alter table enquiries        enable row level security;
alter table appointments     enable row level security;
alter table achievements     enable row level security;
alter table form_questions   enable row level security;
alter table form_submissions enable row level security;
alter table site_settings    enable row level security;
alter table staff_attendance enable row level security;

-- ============================================================
-- SAFE CONDITIONAL POLICIES 
-- (Checks if a policy exists before attempting to create it)
-- ============================================================
do $$
begin
    -- PUBLIC READ policies
    if not exists (select 1 from pg_policies where policyname = 'Public can read gallery' and tablename = 'gallery') then
        create policy "Public can read gallery" on gallery for select using (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can read staff' and tablename = 'staff') then
        create policy "Public can read staff" on staff for select using (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can read approved reviews' and tablename = 'reviews') then
        create policy "Public can read approved reviews" on reviews for select using (approved = true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can read achievements' and tablename = 'achievements') then
        create policy "Public can read achievements" on achievements for select using (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can read form questions' and tablename = 'form_questions') then
        create policy "Public can read form questions" on form_questions for select using (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can read site settings' and tablename = 'site_settings') then
        create policy "Public can read site settings" on site_settings for select using (true);
    end if;

    -- PUBLIC WRITE policies
    if not exists (select 1 from pg_policies where policyname = 'Public can submit enquiries' and tablename = 'enquiries') then
        create policy "Public can submit enquiries" on enquiries for insert with check (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can submit appointments' and tablename = 'appointments') then
        create policy "Public can submit appointments" on appointments for insert with check (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can submit reviews' and tablename = 'reviews') then
        create policy "Public can submit reviews" on reviews for insert with check (true);
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Public can submit forms' and tablename = 'form_submissions') then
        create policy "Public can submit forms" on form_submissions for insert with check (true);
    end if;

    -- AUTHENTICATED (Admin) policies
    if not exists (select 1 from pg_policies where policyname = 'Admin full access gallery' and tablename = 'gallery') then
        create policy "Admin full access gallery" on gallery for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access staff' and tablename = 'staff') then
        create policy "Admin full access staff" on staff for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access reviews' and tablename = 'reviews') then
        create policy "Admin full access reviews" on reviews for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access enquiries' and tablename = 'enquiries') then
        create policy "Admin full access enquiries" on enquiries for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access appointments' and tablename = 'appointments') then
        create policy "Admin full access appointments" on appointments for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access achievements' and tablename = 'achievements') then
        create policy "Admin full access achievements" on achievements for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access form_questions' and tablename = 'form_questions') then
        create policy "Admin full access form_questions" on form_questions for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access submissions' and tablename = 'form_submissions') then
        create policy "Admin full access submissions" on form_submissions for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access site_settings' and tablename = 'site_settings') then
        create policy "Admin full access site_settings" on site_settings for all using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Admin full access staff_attendance' and tablename = 'staff_attendance') then
        create policy "Admin full access staff_attendance" on staff_attendance for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- ============================================================
-- Seed default achievements safely (Uses a temporary unique constraint check)
-- ============================================================
-- We add a unique constraint on 'title' temporarily or handle it directly to avoid duplicate seed rows
insert into achievements (icon, value, title, description, display_order) 
select 'Users',  '2000+', 'Patients Treated',     'Individuals successfully treated across all programs', 0
where not exists (select 1 from achievements where title = 'Patients Treated');

insert into achievements (icon, value, title, description, display_order) 
select 'Clock',  '15+',   'Years of Service',      'Consistently delivering quality addiction care', 1
where not exists (select 1 from achievements where title = 'Years of Service');

insert into achievements (icon, value, title, description, display_order) 
select 'Heart',  '98%',   'Recovery Success Rate', 'Of our patients maintain sobriety after 1 year', 2
where not exists (select 1 from achievements where title = 'Recovery Success Rate');

insert into achievements (icon, value, title, description, display_order) 
select 'Award',  '12',    'Awards Won',            'Regional and national recognition for excellence', 3
where not exists (select 1 from achievements where title = 'Awards Won');

insert into achievements (icon, value, title, description, display_order) 
select 'Users',  '50+',   'Expert Staff',          'Certified counselors, doctors and therapists', 4
where not exists (select 1 from achievements where title = 'Expert Staff');

insert into achievements (icon, value, title, description, display_order) 
select 'Star',   '4.9/5', 'Patient Satisfaction',  'Average rating from patient feedback surveys', 5
where not exists (select 1 from achievements where title = 'Patient Satisfaction');