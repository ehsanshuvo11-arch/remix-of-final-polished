

## Premium Mockup Integration

### Overview
Add a `mockup_url` column to the `portfolio_projects` table, a mockup image upload field in the Admin Panel, and render the mockup inside the expanded case study area on the frontend.

### 1. Database Migration

Run this SQL to add the column:

```sql
ALTER TABLE portfolio_projects ADD COLUMN mockup_url text DEFAULT '';
```

### 2. Type Update — `src/types/database.ts`

Add `mockup_url?: string` to the `PortfolioProject` interface.

### 3. Admin Panel — `src/pages/Admin.tsx`

- Add a `mockupRefs` ref object (same pattern as `fileRefs`, `pdfEnRefs`).
- Add a `handleMockupUpload` function that uploads to `portfolio-mockups/` path in `polished-assets` bucket and sets `mockup_url` on the project.
- Add a new upload field after the existing "Project Image" field, labeled "Project Mockup", with the same dashed-border upload UI pattern.
- Update the `addProject` insert to include `mockup_url: ''`.

### 4. Frontend — `src/components/landing/Portfolio.tsx`

- Inside the case study `AnimatePresence` block (lines 180-217), after the case study text and before the PDF link, render the mockup image if `project.mockup_url` exists.
- Design: full-width, rounded-lg corners, subtle shadow, with a small "MOCKUP" label above it. Graceful fallback — nothing renders if no mockup URL.

```text
┌─────────────────────────────────┐
│  CASE STUDY label               │
│  Case study text...             │
│                                 │
│  ┌─────────────────────────┐    │
│  │   MOCKUP (full-width)   │    │
│  │   rounded-lg, shadow    │    │
│  └─────────────────────────┘    │
│                                 │
│  📄 Download PDF                │
│  Show less                      │
└─────────────────────────────────┘
```

### 5. No Changes To
- Collapsed card state (200px height, tilt, grid)
- Framer Motion animations
- Any other section or component

### 6. GitHub Sync
Changes auto-push to the connected `polished-showcase-admin-a48ca581` repo.

