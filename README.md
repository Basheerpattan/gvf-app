# Green Valley Foundation — De-Addiction Center Website

A complete, production-ready web application for the Green Valley Foundation NGO de-addiction center.

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS 3   |
| Database  | Supabase (PostgreSQL) — Free Tier  |
| Auth      | Supabase Auth (Email/Password)     |
| Storage   | Supabase Storage (images bucket)   |
| Icons     | Lucide React                       |
| Forms     | React Hook Form                    |
| Toasts    | React Hot Toast                    |

---

## Features

### Public Site
- **Hero section** with animated statistics and CTA
- **About Us** with values and highlights
- **Achievements / Milestones** with animated counters
- **Gallery** — dynamic images from database with lightbox
- **Team / Staff** — dynamic profiles from database
- **Google-style Reviews** — user-submitted, admin-approved
- **Contact / Enquiry Form** — saves to database

### Admin Panel (`/admin`)
- **Dashboard** with live stats overview
- **Gallery Manager** — upload and delete images (Supabase Storage)
- **Staff Manager** — full CRUD with photo upload
- **Form Builder** — add/edit/delete questions for Inpatient, Outpatient, Follow-up forms
- **Form Submissions** — view all dynamic form responses
- **Enquiries Manager** — view contact enquiries with read/unread status
- **Reviews Manager** — approve or reject submitted reviews
- **Achievements Manager** — CRUD for milestone numbers
- **CCTV Dashboard** — configure and embed live camera feeds

---

## Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- A free [Supabase](https://supabase.com) account

---

### Step 1 — Clone / Navigate to the Project

```bash
cd C:\Users\PattanNagurBasheer\gvf-app
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**, give it a name (e.g. `gvf-app`), choose a region close to India, and set a strong database password
3. Wait ~2 minutes for the project to be ready

### Step 4 — Create the Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. Paste the entire contents into the editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned."

### Step 5 — Create the Storage Bucket

1. In Supabase, go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Name it exactly: `images`
4. Check **Public bucket** (so uploaded images are publicly accessible)
5. Click **Save**

### Step 6 — Create the Admin User

1. In Supabase, go to **Authentication** → **Users**
2. Click **Invite user** or **Add user**
3. Enter the admin email address (e.g. `admin@greenvalley.org`)
4. Set a strong password
5. Click **Create user**

### Step 7 — Get Your Supabase Keys

1. In Supabase, go to **Settings** → **API**
2. Copy the **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
3. Copy the **anon public** key (a long string starting with `eyJ...`)

### Step 8 — Configure Environment Variables

1. In the project root (`C:\Users\PattanNagurBasheer\gvf-app`), create a new file called `.env`
2. Paste the following, replacing with your actual values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> **Important:** Never commit the `.env` file to git. It is already listed in `.gitignore`.

### Step 9 — Run the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## Available Routes

| Route                  | Description                             |
|------------------------|-----------------------------------------|
| `/`                    | Public home page (all sections)         |
| `/forms`               | Public patient forms page               |
| `/admin`               | Admin login page                        |
| `/admin/dashboard`     | Admin dashboard overview                |
| `/admin/gallery`       | Gallery image management                |
| `/admin/staff`         | Staff profiles management               |
| `/admin/form-builder`  | Dynamic form question editor            |
| `/admin/submissions`   | View patient form submissions           |
| `/admin/enquiries`     | View contact enquiries                  |
| `/admin/reviews`       | Approve/delete reviews                  |
| `/admin/achievements`  | Edit milestone statistics               |
| `/admin/cctv`          | Live CCTV feed dashboard                |

---

## Building for Production

```bash
npm run build
```

The optimized output goes to the `dist/` folder. Deploy to:
- **Vercel** (recommended — free): Connect your GitHub repo and set the environment variables in Vercel dashboard
- **Netlify** (free): Drag and drop the `dist` folder, or connect GitHub
- **Cloudflare Pages** (free): Fastest global CDN

### Deploy to Vercel (Easiest)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase **service_role** key (Settings → API) — **server-only**, used by `api/invite-guardian.js` to create guardian logins. Never prefix this with `VITE_` and never commit it — unlike the anon key, it bypasses Row Level Security entirely.
   - `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` = your Brevo transactional email credentials (used by `api/send-email.js` and `api/send-reminders.js`)
   - `BREVO_SMS_SENDER` = an SMS sender ID approved in your Brevo account — **note:** sending SMS to Indian numbers requires TRAI/DLT template registration in Brevo first, or sends will silently fail to deliver
   - `CRON_SECRET` = any random string — Vercel automatically sends it as `Authorization: Bearer <value>` when triggering the daily reminder cron (`api/send-reminders.js`), which rejects any request without it
4. Click **Deploy** — done! The reminder cron (`vercel.json` → `crons`) will show up under your project's **Cron Jobs** tab and runs daily at 30 2 * * * UTC (~8:00 AM IST), sending a same-day SMS/email reminder for any confirmed appointment or scheduled visit happening the next day.

---

## Using the Admin Panel

### First Login
1. Go to `/admin`
2. Enter the email and password you created in Step 6
3. You will be redirected to the dashboard

### Managing Gallery
- Click **Gallery** in the sidebar
- Click **Upload New Image**, select a file (PNG/JPG, max 5MB), add an optional caption
- Click **Upload Image**
- To delete: hover over any image and click the trash icon

### Managing Staff
- Click **Staff** in the sidebar
- Click **Add Staff** — fill in name, designation, bio, upload a photo
- To edit or delete: use the pencil/trash icons on each card

### Building Forms (Dynamic Form Builder)
- Click **Form Builder** in the sidebar
- Select the tab: **Inpatient**, **Outpatient**, or **Follow-up**
- Click **Add Question**:
  - Enter the question text
  - Select field type: text, textarea, select, radio, checkbox, email, date, etc.
  - For select/radio/checkbox, enter options (one per line)
  - Mark as required if needed
- Questions will instantly appear on the public `/forms` page

### Managing Reviews
- Click **Reviews** in the sidebar
- Pending reviews (submitted by users) appear in the **Pending** tab
- Click **Approve** to publish a review on the public site
- Or click the trash icon to delete

### CCTV Dashboard
- Click **CCTV Monitor** in the sidebar
- Each camera slot has a **Configure** button
- Enter the camera's embeddable URL (e.g. from your NVR, Milestone, Eagle Eye, or IP camera web interface)
- The feed will appear in the camera slot
- Click **Add Camera** to add more slots

---

## Database Tables Reference

| Table              | Purpose                                        |
|--------------------|------------------------------------------------|
| `gallery`          | Image URLs and captions                        |
| `staff`            | Team member profiles                           |
| `reviews`          | User-submitted testimonials (with approval)    |
| `enquiries`        | Contact form submissions                       |
| `achievements`     | Milestone statistics (animated counters)       |
| `form_questions`   | Dynamic form questions per form type           |
| `form_submissions` | Patient form submission data (JSON answers)    |
| `patients`         | Patient intake & case records                  |
| `case_notes`       | Per-patient progress/medical/counseling notes  |
| `patient_visits`   | Scheduled/completed patient visits             |
| `profiles`         | Maps auth user id → role (admin/staff/guardian) |
| `guardian_patients`| Links guardian accounts to the patient(s) they can view (read-only) |

---

## Troubleshooting

**"Missing Supabase environment variables" error**
- Make sure you created the `.env` file (not `.env.example`) with real values

**Images not uploading**
- Check that the `images` bucket exists in Supabase Storage and is set to **Public**
- Check RLS policies were applied by running the SQL schema

**Admin login failing**
- Double-check the email/password you set in Supabase Authentication
- Make sure you're using the same email at `/admin`

**Data not appearing on public site**
- Verify the RLS policies were created by running the SQL schema
- Check the Supabase table has data by viewing it in the Table Editor

---

## Project Structure

```
gvf-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── public/           # Public-facing components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Staff.jsx
│   │   │   ├── Reviews.jsx
│   │   │   ├── DynamicForm.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── admin/            # Admin panel components
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── GalleryManager.jsx
│   │   │   ├── StaffManager.jsx
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── FormSubmissions.jsx
│   │   │   ├── EnquiriesManager.jsx
│   │   │   ├── ReviewsManager.jsx
│   │   │   ├── AchievementsManager.jsx
│   │   │   └── CCTVDashboard.jsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Loader.jsx
│   │       └── StarRating.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Supabase auth state
│   ├── lib/
│   │   └── supabase.js       # Supabase client
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── FormsPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── App.jsx               # Route definitions
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports
├── supabase-schema.sql       # Run this in Supabase SQL Editor
├── .env.example              # Copy to .env and fill in values
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## License

MIT — Free to use and modify for non-commercial NGO purposes.
