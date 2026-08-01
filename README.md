# Remix of Final POLISHED

EXECUTIVE INSTRUCTION: I have uploaded my perfect, fresh codebase. DO NOT rebuild the website from scratch. Preserve all existing global styles, typography (Cormorant Garamond, Noto Serif Bengali), and brand colors (Navy-blue #1e3a8a, Off-white #f9fafb, Orange #fb923c). Act as a senior frontend engineer and implement these exact requirements surgically:

1. Button Animation: Apply the exact same CSS/Framer Motion hover animation used on the "play and unlock a bonus" element to the "start a project" button. Do not change the text or box structure, just the animation.

2. Case Study Expansion UI: Redesign the case study display. Default state: Show ONLY the 'Hook' text. Next to it, add a minimal, eye-catchy Orange (#fb923c) button reading "View full case study" (text in off-white). On click, smoothly expand the full content using Framer Motion (animate={{ height: "auto" }}). At the bottom of the expanded content, add a text-only Orange "Show less" button to collapse it. Delete any old "CLICK IMAGE FOR FULL VIEW" buttons.

3. Multi-Language PDF (Admin & Supabase): Upgrade the admin panel to allow uploading TWO separate PDF files (English and Bengali) per case study. Create the necessary Supabase storage buckets and database columns. The frontend must dynamically serve the correct PDF based on the user's active language toggle. CRITICAL: Output the exact raw SQL script for these changes so I can run it in Supabase.

4. Premium Animations & Flow: Add touch-friendly, elegant animations across the site for mobile/tablet users. Update the initial language selection screen so the two language options slide in smoothly from opposite sides. After language selection, use a calm, luxurious transition into the main site. Add elegant, delayed transitions to functional buttons (like "View our work") so they don't abruptly jump to sections, ensuring a premium feel.

5. Portfolio Grid Consistency: Fix the "Recent Projects" grid. Force ALL project images to match the exact dimensions, aspect ratio, and layout of the FIRST project card. They must all be 100% uniform.

6. Extended Admin Controls: Enhance the separate admin panel to easily manage the new dual-PDF uploads and case study texts efficiently.

7. Automatic GitHub Sync: Upon perfect completion, automatically push all code directly to my GitHub repository: polished-showcase-admin-a48ca581.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c4c3faa0-cc08-4b49-b1c2-28599438e3e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
