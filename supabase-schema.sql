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

-- Safe to re-run: tracks whether the day-before reminder (api/send-reminders.js)
-- has already gone out, so a duplicate cron invocation on the same day doesn't re-send
alter table appointments add column if not exists reminder_sent boolean default false;

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

create table if not exists patients (
  id                      uuid default gen_random_uuid() primary key,
  full_name               text not null,
  date_of_birth           date,
  gender                  text,
  phone                   text,
  email                   text,
  address                 text,
  admission_type          text not null default 'inpatient' check (admission_type in ('inpatient', 'outpatient', 'followup')),
  admission_date          date not null default current_date,
  discharge_date          date,
  status                  text not null default 'active' check (status in ('active', 'discharged', 'relapsed')),
  treatment_plan          text,
  emergency_contact_name  text,
  emergency_contact_phone text,
  appointment_id          uuid references appointments(id),
  created_at              timestamptz default now()
);

create table if not exists case_notes (
  id            uuid default gen_random_uuid() primary key,
  patient_id    uuid not null references patients(id) on delete cascade,
  author_email  text,
  note_type     text not null default 'progress' check (note_type in ('progress', 'medical', 'counseling', 'incident', 'discharge')),
  note          text not null,
  created_at    timestamptz default now()
);

create table if not exists patient_visits (
  id             uuid default gen_random_uuid() primary key,
  patient_id     uuid not null references patients(id) on delete cascade,
  scheduled_date date not null,
  visit_type     text not null default 'family_visit' check (visit_type in ('family_visit', 'checkup', 'counseling_session')),
  status         text not null default 'scheduled' check (status in ('scheduled', 'completed', 'missed', 'cancelled')),
  notes          text,
  reminder_sent  boolean default false,
  created_at     timestamptz default now()
);

-- Formalize profiles (already exists in production from manual setup; if-not-exists
-- is a no-op there, but this documents the shape and creates it on fresh installs).
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'staff' check (role in ('admin', 'staff', 'guardian')),
  email      text,
  created_at timestamptz default now()
);
alter table profiles add column if not exists email text;

create table if not exists guardian_patients (
  id           uuid default gen_random_uuid() primary key,
  guardian_id  uuid not null references auth.users(id) on delete cascade,
  patient_id   uuid not null references patients(id) on delete cascade,
  created_at   timestamptz default now(),
  unique (guardian_id, patient_id)
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
alter table patients          enable row level security;
alter table case_notes        enable row level security;
alter table patient_visits    enable row level security;
alter table profiles          enable row level security;
alter table guardian_patients enable row level security;

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

    -- Admin/staff full-access policies for all internal tables are defined
    -- below, scoped through profiles.role (see "ROLE-SCOPED POLICIES" section)
    -- rather than the old blanket auth.role() = 'authenticated' check, since
    -- that would also grant guardians full access to everything.
end
$$;

-- ============================================================
-- ROLE-SCOPED POLICIES (admin/staff full access, guardian read-only)
-- Explicit drop-then-create so re-running this file is safe AND actually
-- replaces any older, leakier policy of the same name from a previous run.
-- ============================================================

-- SECURITY DEFINER: reads profiles.role bypassing RLS. Required because a
-- policy ON profiles that queries profiles from within itself causes
-- Postgres to raise "infinite recursion detected in policy for relation
-- profiles" — every other table's admin/staff policy also needs this same
-- role check, so it's centralized here instead of repeating a raw subquery.
create or replace function public.current_role_is(roles text[]) returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = any(roles))
$$;

drop policy if exists "Admin full access gallery" on gallery;
create policy "Admin/staff full access gallery" on gallery for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access staff" on staff;
create policy "Admin/staff full access staff" on staff for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access reviews" on reviews;
create policy "Admin/staff full access reviews" on reviews for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access enquiries" on enquiries;
create policy "Admin/staff full access enquiries" on enquiries for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access appointments" on appointments;
create policy "Admin/staff full access appointments" on appointments for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access achievements" on achievements;
create policy "Admin/staff full access achievements" on achievements for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access form_questions" on form_questions;
create policy "Admin/staff full access form_questions" on form_questions for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access submissions" on form_submissions;
create policy "Admin/staff full access submissions" on form_submissions for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access site_settings" on site_settings;
create policy "Admin/staff full access site_settings" on site_settings for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin full access staff_attendance" on staff_attendance;
create policy "Admin/staff full access staff_attendance" on staff_attendance for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin/staff full access patients" on patients;
create policy "Admin/staff full access patients" on patients for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin/staff full access case_notes" on case_notes;
create policy "Admin/staff full access case_notes" on case_notes for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin/staff full access patient_visits" on patient_visits;
create policy "Admin/staff full access patient_visits" on patient_visits for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin/staff full access profiles" on profiles;
create policy "Admin/staff full access profiles" on profiles for all using (
  current_role_is(array['admin', 'staff'])
);

drop policy if exists "Admin/staff full access guardian_patients" on guardian_patients;
create policy "Admin/staff full access guardian_patients" on guardian_patients for all using (
  current_role_is(array['admin', 'staff'])
);

-- Guardians can read their own profile row (needed for role lookup after login)
drop policy if exists "Guardian read own profile" on profiles;
create policy "Guardian read own profile" on profiles for select using (id = auth.uid());

-- Guardians can read only the patient(s) they're linked to, and only read
-- (no insert/update/delete) their case notes and visiting schedule.
drop policy if exists "Guardian read own patients" on patients;
create policy "Guardian read own patients" on patients for select using (
  exists (select 1 from guardian_patients gp where gp.patient_id = patients.id and gp.guardian_id = auth.uid())
);

drop policy if exists "Guardian read own case_notes" on case_notes;
create policy "Guardian read own case_notes" on case_notes for select using (
  exists (select 1 from guardian_patients gp where gp.patient_id = case_notes.patient_id and gp.guardian_id = auth.uid())
);

drop policy if exists "Guardian read own patient_visits" on patient_visits;
create policy "Guardian read own patient_visits" on patient_visits for select using (
  exists (select 1 from guardian_patients gp where gp.patient_id = patient_visits.patient_id and gp.guardian_id = auth.uid())
);

-- Guardians can see their own link rows (so the guardian portal doesn't need
-- to query guardian_patients directly beyond what RLS already implies)
drop policy if exists "Guardian read own links" on guardian_patients;
create policy "Guardian read own links" on guardian_patients for select using (guardian_id = auth.uid());

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