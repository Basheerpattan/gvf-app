-- ============================================================
-- Green Valley Foundation — Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Gallery table
create table if not exists gallery (
  id          uuid default gen_random_uuid() primary key,
  url         text not null,
  caption     text,
  created_at  timestamptz default now()
);

-- Staff table
create table if not exists staff (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  designation   text not null,
  bio           text,
  photo_url     text,
  display_order int  default 0,
  created_at    timestamptz default now()
);

-- Reviews table
create table if not exists reviews (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  review      text not null,
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- Enquiries (contact form submissions)
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

-- Achievements / milestones
create table if not exists achievements (
  id            uuid default gen_random_uuid() primary key,
  icon          text default 'Trophy',
  value         text not null,
  title         text not null,
  description   text,
  display_order int  default 0
);

-- Dynamic form questions
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

-- Form submissions
create table if not exists form_submissions (
  id            uuid default gen_random_uuid() primary key,
  form_type     text not null,
  answers       jsonb not null,
  submitted_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table gallery          enable row level security;
alter table staff            enable row level security;
alter table reviews          enable row level security;
alter table enquiries        enable row level security;
alter table achievements     enable row level security;
alter table form_questions   enable row level security;
alter table form_submissions enable row level security;

-- PUBLIC READ policies (for public site)
create policy "Public can read gallery"       on gallery          for select using (true);
create policy "Public can read staff"         on staff            for select using (true);
create policy "Public can read approved reviews" on reviews       for select using (approved = true);
create policy "Public can read achievements"  on achievements     for select using (true);
create policy "Public can read form questions" on form_questions  for select using (true);

-- PUBLIC WRITE policies (form submissions, reviews, enquiries)
create policy "Public can submit enquiries"   on enquiries        for insert with check (true);
create policy "Public can submit reviews"     on reviews          for insert with check (true);
create policy "Public can submit forms"       on form_submissions for insert with check (true);

-- AUTHENTICATED (Admin) — full access to everything
create policy "Admin full access gallery"     on gallery          for all using (auth.role() = 'authenticated');
create policy "Admin full access staff"       on staff            for all using (auth.role() = 'authenticated');
create policy "Admin full access reviews"     on reviews          for all using (auth.role() = 'authenticated');
create policy "Admin full access enquiries"   on enquiries        for all using (auth.role() = 'authenticated');
create policy "Admin full access achievements" on achievements    for all using (auth.role() = 'authenticated');
create policy "Admin full access form_questions" on form_questions for all using (auth.role() = 'authenticated');
create policy "Admin full access submissions" on form_submissions for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed default achievements (optional)
-- ============================================================
insert into achievements (icon, value, title, description, display_order) values
  ('Users',  '2000+', 'Patients Treated',     'Individuals successfully treated across all programs', 0),
  ('Clock',  '15+',   'Years of Service',      'Consistently delivering quality addiction care', 1),
  ('Heart',  '98%',   'Recovery Success Rate', 'Of our patients maintain sobriety after 1 year', 2),
  ('Award',  '12',    'Awards Won',            'Regional and national recognition for excellence', 3),
  ('Users',  '50+',   'Expert Staff',          'Certified counselors, doctors and therapists', 4),
  ('Star',   '4.9/5', 'Patient Satisfaction',  'Average rating from patient feedback surveys', 5)
on conflict do nothing;
