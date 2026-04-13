

## SQL Fix: Add Missing Columns + Disable RLS

Here is the exact SQL script you need to run in the Supabase SQL Editor. It does **only two things**: adds any missing columns and disables RLS. No triggers, no roles, no ownership changes.

### The SQL Script

```sql
-- =============================================
-- 1. ADD MISSING COLUMNS
-- =============================================

-- site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS key text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS value jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name_en text DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name_bn text DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS desc_en text DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS desc_bn text DEFAULT '';

-- stats
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS num text DEFAULT '0';
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS suffix text DEFAULT '';
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS label_en text DEFAULT '';
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS label_bn text DEFAULT '';

-- portfolio_projects
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS title_en text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS title_bn text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS category_en text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS category_bn text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS case_study_en text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS case_study_bn text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS hook_en text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS hook_bn text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS pdf_url_en text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS pdf_url_bn text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS mockup_url text DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS mockup_urls text[] DEFAULT ARRAY[]::text[];

-- process_steps
ALTER TABLE public.process_steps ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.process_steps ADD COLUMN IF NOT EXISTS title_en text DEFAULT '';
ALTER TABLE public.process_steps ADD COLUMN IF NOT EXISTS title_bn text DEFAULT '';
ALTER TABLE public.process_steps ADD COLUMN IF NOT EXISTS desc_en text DEFAULT '';
ALTER TABLE public.process_steps ADD COLUMN IF NOT EXISTS desc_bn text DEFAULT '';

-- =============================================
-- 2. DISABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps DISABLE ROW LEVEL SECURITY;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
```

### How to use

1. Go to your **Supabase Dashboard → SQL Editor**
2. Paste the entire script above
3. Click **Run**
4. Go to your admin panel and test saving — it should work immediately

No code changes needed in this project. This is purely a database-side fix.

