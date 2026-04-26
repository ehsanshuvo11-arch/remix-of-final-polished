/**
 * Vercel Serverless SSR Endpoint
 * ────────────────────────────────────────────────────────────────────────────
 * Intercepts requests to "/" (configured via vercel.json rewrite), fetches
 * LIVE content from Supabase, and injects it as semantic HTML into the built
 * index.html before sending the response. This guarantees AI scrapers and
 * search crawlers always see the exact same live data as human users —
 * without requiring a rebuild when admin content changes.
 *
 * The React app then hydrates on top of #root with full animations intact.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase (server-side, anon key — same RLS as client) ─────────────────
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://tvbnnqmffqtyhgtpwqri.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Ym5ucW1mZnF0eWhndHB3cXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzk4NzAsImV4cCI6MjA5MDgxNTg3MH0.uXnLVmHtVbJy-BytdjG_jCzN0aH8BAXVceqmyKMzjNc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// ─── HTML helpers ──────────────────────────────────────────────────────────
const escapeHtml = (input: unknown): string => {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const stripHtml = (input: unknown): string => {
  if (input === null || input === undefined) return '';
  return String(input).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const pickLocalized = (row: Record<string, any>, base: string): string => {
  return (
    row?.[`${base}_en`] ??
    row?.[base] ??
    row?.[`${base}_bn`] ??
    ''
  );
};

// ─── Build the SSR-injected semantic HTML block ────────────────────────────
function renderSeoBlock(data: {
  hero: any;
  about: any;
  contact: any;
  services: any[];
  projects: any[];
  steps: any[];
  stats: any[];
}): string {
  const { hero, about, contact, services, projects, steps, stats } = data;

  const heroTitle =
    pickLocalized(hero || {}, 'title') ||
    'POLISHED — Premium Visual Identities for E-commerce Skincare Brands';
  const heroTagline =
    pickLocalized(hero || {}, 'tagline') ||
    pickLocalized(hero || {}, 'subtitle') ||
    'Make Your Collection Unmissable!';

  const aboutBody =
    stripHtml(pickLocalized(about || {}, 'body')) ||
    stripHtml(pickLocalized(about || {}, 'description')) ||
    'POLISHED is a specialist branding studio crafting premium, quiet-luxury visual identities exclusively for e-commerce skincare storefronts.';

  const email = contact?.email || 'polished.bd@gmail.com';
  const phone = contact?.phone || contact?.whatsapp || '+8801346288210';

  const servicesHtml = services
    .map((s) => {
      const name = escapeHtml(pickLocalized(s, 'title') || pickLocalized(s, 'name'));
      const desc = escapeHtml(stripHtml(pickLocalized(s, 'description')));
      return `<li><strong>${name}</strong>${desc ? ` — ${desc}` : ''}</li>`;
    })
    .join('');

  const projectsHtml = projects
    .map((p) => {
      const title = escapeHtml(pickLocalized(p, 'title'));
      const client = escapeHtml(pickLocalized(p, 'client') || p.client || '');
      const category = escapeHtml(pickLocalized(p, 'category') || p.category || '');
      const desc = escapeHtml(stripHtml(pickLocalized(p, 'description')));
      const meta = [client, category].filter(Boolean).join(' · ');
      return `
        <article>
          <h3>${title}</h3>
          ${meta ? `<p><em>${meta}</em></p>` : ''}
          ${desc ? `<p>${desc}</p>` : ''}
        </article>`;
    })
    .join('');

  const stepsHtml = steps
    .map((s, i) => {
      const title = escapeHtml(pickLocalized(s, 'title') || pickLocalized(s, 'name'));
      const desc = escapeHtml(stripHtml(pickLocalized(s, 'description')));
      return `<li><strong>${i + 1}. ${title}</strong>${desc ? ` — ${desc}` : ''}</li>`;
    })
    .join('');

  const statsHtml = stats
    .map((s) => {
      const value = escapeHtml(s.value ?? s.number ?? '');
      const label = escapeHtml(pickLocalized(s, 'label'));
      return `<li><strong>${value}</strong> ${label}</li>`;
    })
    .join('');

  return `
<div id="seo-ssr-content" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">
  <header>
    <h1>${escapeHtml(heroTitle)}</h1>
    <p><strong>Tagline:</strong> ${escapeHtml(heroTagline)}</p>
    <p><strong>Location:</strong> Bangladesh · <strong>Serving:</strong> Global e-commerce skincare brands</p>
  </header>

  <nav aria-label="Primary">
    <ul>
      <li><a href="/#about">About</a></li>
      <li><a href="/#services">Services</a></li>
      <li><a href="/#portfolio">Portfolio</a></li>
      <li><a href="/#process">Process</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
  </nav>

  <section id="about-ssr">
    <h2>About POLISHED</h2>
    <p>${escapeHtml(aboutBody)}</p>
    ${statsHtml ? `<ul>${statsHtml}</ul>` : ''}
  </section>

  ${
    servicesHtml
      ? `<section id="services-ssr"><h2>Services</h2><ul>${servicesHtml}</ul></section>`
      : ''
  }

  ${
    projectsHtml
      ? `<section id="portfolio-ssr"><h2>Selected Work &amp; Case Studies</h2>${projectsHtml}</section>`
      : ''
  }

  ${
    stepsHtml
      ? `<section id="process-ssr"><h2>The POLISHED Process</h2><ol>${stepsHtml}</ol></section>`
      : ''
  }

  <section id="contact-ssr">
    <h2>Contact &amp; Booking</h2>
    <address>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>WhatsApp / Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
      <p><strong>Country:</strong> Bangladesh</p>
    </address>
  </section>

  <footer>
    <p>Live SSR snapshot from POLISHED — data fetched from Supabase at request time.
    Sitemap: <a href="/sitemap.xml">/sitemap.xml</a> · LLM brief: <a href="/llms.txt">/llms.txt</a>.</p>
  </footer>
</div>`.trim();
}

// ─── Fetch all live content in parallel ────────────────────────────────────
async function fetchLiveContent() {
  const settingsKeys = ['hero', 'about', 'contact'];

  const [settingsRes, servicesRes, projectsRes, stepsRes, statsRes] =
    await Promise.all([
      supabase.from('site_settings').select('key,value').in('key', settingsKeys),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('portfolio_projects').select('*').order('sort_order'),
      supabase.from('process_steps').select('*').order('sort_order'),
      supabase.from('stats').select('*').order('sort_order'),
    ]);

  const settingsMap = new Map<string, any>(
    (settingsRes.data ?? []).map((r: any) => [r.key, r.value])
  );

  return {
    hero: settingsMap.get('hero') ?? {},
    about: settingsMap.get('about') ?? {},
    contact: settingsMap.get('contact') ?? {},
    services: servicesRes.data ?? [],
    projects: projectsRes.data ?? [],
    steps: stepsRes.data ?? [],
    stats: statsRes.data ?? [],
  };
}

// ─── Read built index.html from the deployed bundle (cached per cold start)
let CACHED_TEMPLATE: string | null = null;
function getTemplate(): string {
  if (CACHED_TEMPLATE) return CACHED_TEMPLATE;
  // On Vercel, the build output for a Vite SPA lives under the project root
  // at `dist/`. The serverless function runs from the project root.
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'public', 'index.html'),
    join(process.cwd(), 'index.html'),
  ];
  for (const p of candidates) {
    try {
      CACHED_TEMPLATE = readFileSync(p, 'utf8');
      return CACHED_TEMPLATE;
    } catch {
      /* try next */
    }
  }
  throw new Error('SSR: could not locate built index.html');
}

// ─── Vercel handler ────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  try {
    const template = getTemplate();
    const data = await fetchLiveContent();
    const seoBlock = renderSeoBlock(data);
    const html = template.replace('<!--SSR-CONTENT-->', seoBlock);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Bots get fresh data; humans get a fast CDN edge cache that revalidates
    // in the background. Tune as needed.
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    );
    res.status(200).send(html);
  } catch (err) {
    // On failure, fall back to the un-injected template so the React app
    // still boots client-side. Bots lose live data but humans see no
    // visible difference.
    console.error('[ssr]', err);
    try {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).send(getTemplate());
    } catch {
      res.status(500).send('SSR error');
    }
  }
}
