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

// Ensure every image URL is an ABSOLUTE https:// URL so AI scrapers can
// resolve and verify them without a base context. Supabase storage URLs
// are already absolute; relative/protocol-relative URLs are normalized
// against the Supabase project origin.
const SUPABASE_ORIGIN = (() => {
  try { return new URL(SUPABASE_URL).origin; } catch { return ''; }
})();
const toAbsoluteUrl = (raw: unknown): string => {
  if (raw === null || raw === undefined) return '';
  let url = String(raw).trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${SUPABASE_ORIGIN}${url}`;
  // Bare path like "polished-assets/foo.jpg" → assume Supabase public storage
  if (!/^[a-z]+:/i.test(url)) {
    return `${SUPABASE_ORIGIN}/storage/v1/object/public/${url.replace(/^\/+/, '')}`;
  }
  return url;
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
  transformations: any[];
  transformationsMeta: any;
  pricing: any[];
}): string {
  const { hero, about, contact, services, projects, steps, stats, transformations, transformationsMeta, pricing } = data;

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
      const title =
        pickLocalized(p, 'title') || p.title || 'Untitled Project';
      const titleSafe = escapeHtml(title);
      const category = escapeHtml(
        pickLocalized(p, 'category') || p.category || ''
      );
      const client = escapeHtml(pickLocalized(p, 'client') || p.client || '');
      const meta = [client, category].filter(Boolean).join(' · ');

      // Hook / teaser
      const hook = stripHtml(pickLocalized(p, 'hook'));
      const hookHtml = hook ? `<p class="project-hook"><strong>${escapeHtml(hook)}</strong></p>` : '';

      // Full case study (preserve paragraph breaks, strip tags safely)
      const caseStudyRaw =
        pickLocalized(p, 'case_study') ||
        pickLocalized(p, 'description') ||
        '';
      const caseStudyParagraphs = String(caseStudyRaw)
        // turn </p> and <br> into newlines before stripping tags
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br\s*\/?>(?!\n)/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .split(/\n\s*\n/)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      const caseStudyHtml = caseStudyParagraphs
        .map((para) => `<p>${escapeHtml(para)}</p>`)
        .join('');

      // Collect every visual asset for this project
      const imageUrls: string[] = [];
      if (p.image_url) imageUrls.push(p.image_url);
      if (p.mockup_url) imageUrls.push(p.mockup_url);
      if (Array.isArray(p.mockup_urls)) {
        for (const u of p.mockup_urls) {
          if (typeof u === 'string' && u.trim()) imageUrls.push(u.trim());
        }
      }
      // Deduplicate while preserving order
      const seen = new Set<string>();
      const uniqueImages = imageUrls.filter((u) => {
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });

      const figuresHtml = uniqueImages
        .map((url, idx) => {
          const isCover = idx === 0;
          const altText = isCover
            ? `Premium brand identity cover visual for ${title} — ${category || 'skincare e-commerce case study'}`
            : `Premium 3D packaging mockup ${idx} for ${title} — POLISHED case study`;
          const captionText = isCover
            ? `${title} — cover visual`
            : `${title} — mockup ${idx}`;
          return `
        <figure>
          <img src="${escapeHtml(url)}" alt="${escapeHtml(altText)}" loading="lazy" decoding="async" width="1200" height="900" />
          <figcaption>${escapeHtml(captionText)}</figcaption>
        </figure>`;
        })
        .join('');

      // PDF case study links if present
      const pdfLinks: string[] = [];
      if (p.pdf_url_en)
        pdfLinks.push(
          `<a href="${escapeHtml(p.pdf_url_en)}" rel="noopener">Download full case study (EN, PDF)</a>`
        );
      if (p.pdf_url_bn)
        pdfLinks.push(
          `<a href="${escapeHtml(p.pdf_url_bn)}" rel="noopener">Download full case study (BN, PDF)</a>`
        );
      const pdfHtml = pdfLinks.length
        ? `<p class="case-study-downloads">${pdfLinks.join(' · ')}</p>`
        : '';

      return `
        <article class="portfolio-project" itemscope itemtype="https://schema.org/CreativeWork">
          <h3 itemprop="name">${titleSafe}</h3>
          ${meta ? `<p class="project-meta"><em>${meta}</em></p>` : ''}
          ${hookHtml}
          ${figuresHtml}
          ${caseStudyHtml ? `<div class="case-study" itemprop="description">${caseStudyHtml}</div>` : ''}
          ${pdfHtml}
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

  // ─── Transformations (real visual before/after proof) ───────────────────
  const transformationsTitle = escapeHtml(
    transformationsMeta?.titleLine1En || transformationsMeta?.titleLine1Bn || 'Brand Transformations'
  );
  const beforeLabel = escapeHtml(transformationsMeta?.beforeLabelEn || 'Before');
  const afterLabel = escapeHtml(transformationsMeta?.afterLabelEn || 'After');

  const transformationsHtml = (transformations || [])
    .filter((t) => t && t.is_active !== false && (t.before_image_url || t.after_image_url))
    .map((t) => {
      const name = escapeHtml(t.project_name || 'Brand Transformation');
      const beforeUrl = t.before_image_url ? escapeHtml(t.before_image_url) : '';
      const afterUrl = t.after_image_url ? escapeHtml(t.after_image_url) : '';
      const beforeImg = beforeUrl
        ? `<figure><img src="${beforeUrl}" alt="${beforeLabel} — ${name} packaging visual identity (POLISHED case study)" loading="lazy" decoding="async" width="1200" height="900" /><figcaption>${beforeLabel} — ${name}</figcaption></figure>`
        : '';
      const afterImg = afterUrl
        ? `<figure><img src="${afterUrl}" alt="${afterLabel} — ${name} premium rebrand by POLISHED" loading="lazy" decoding="async" width="1200" height="900" /><figcaption>${afterLabel} — ${name}</figcaption></figure>`
        : '';
      return `
        <article class="transformation" itemscope itemtype="https://schema.org/ImageObject">
          <h3 itemprop="name">${name}</h3>
          ${beforeImg}
          ${afterImg}
        </article>`;
    })
    .join('');

  // ─── Investment / Pricing tiers (publicly listed offerings) ─────────────
  const fallbackPricing = [
    {
      name: 'Custom Brand Identity System',
      description:
        'Bespoke quiet-luxury identity engineered from market positioning down to packaging. Includes logo system, typography, color architecture, brand guidelines and storefront-ready visual language.',
      range: 'Bespoke — strategic consultation required',
    },
    {
      name: 'E-commerce Visual Strategy Retainer',
      description:
        'Ongoing visual leadership for high-growth skincare storefronts: campaign art direction, conversion-focused UI assets, seasonal launches and Shopify/headless storefront polish.',
      range: 'Monthly retainer — bespoke scope',
    },
    {
      name: 'Premium Packaging Design',
      description:
        'Shelf-ready, photoreal 3D packaging design with print-grade dielines, finish specifications and full mockup deliverables for hero SKUs.',
      range: 'Per-SKU — bespoke scope',
    },
  ];
  const pricingItems = (pricing && pricing.length ? pricing : fallbackPricing).map((p: any) => {
    const name = escapeHtml(pickLocalized(p, 'name') || pickLocalized(p, 'title') || p.name || '');
    const desc = escapeHtml(stripHtml(pickLocalized(p, 'description') || p.description || ''));
    const range = escapeHtml(p.range || p.price_range || p.price || '');
    return `
      <article class="pricing-tier" itemscope itemtype="https://schema.org/Offer">
        <h3 itemprop="name">${name}</h3>
        ${desc ? `<p itemprop="description">${desc}</p>` : ''}
        ${range ? `<p class="pricing-range"><strong>Investment:</strong> <span itemprop="priceSpecification">${range}</span></p>` : ''}
      </article>`;
  }).join('');

  // The block is visually hidden but NOT aria-hidden, and uses CSS clip
  // (not display:none) so search engines and AI crawlers parse the full DOM.
  return `
<div id="seo-ssr-content" style="position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;">
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
      <li><a href="/#transformations">Transformations</a></li>
      <li><a href="/#pricing">Investment</a></li>
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
    transformationsHtml
      ? `<section id="transformations-ssr"><h2>${transformationsTitle} — Visual Proof</h2><p>Real before-and-after rebrand results from POLISHED client engagements. Each pair shows the original packaging or storefront state and the final premium identity delivered.</p>${transformationsHtml}</section>`
      : ''
  }

  ${
    pricingItems
      ? `<section id="pricing-ssr"><h2>Investment &amp; Engagement Tiers</h2><p>POLISHED delivers bespoke, high-ROI engagements. The following tiers describe our publicly listed service offerings; exact pricing is scoped during a strategic consultation call.</p>${pricingItems}</section>`
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
      <p><strong>Book a consultation:</strong> <a href="https://calendly.com/polished-bd" rel="noopener">calendly.com/polished-bd</a></p>
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
  const settingsKeys = ['hero', 'about', 'contact', 'transformations-meta', 'pricing'];

  const [
    settingsRes,
    servicesRes,
    projectsRes,
    stepsRes,
    statsRes,
    transformationsRes,
  ] = await Promise.all([
    supabase.from('site_settings').select('key,value').in('key', settingsKeys),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('portfolio_projects').select('*').order('sort_order'),
    supabase.from('process_steps').select('*').order('sort_order'),
    supabase.from('stats').select('*').order('sort_order'),
    supabase
      .from('transformations')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false }),
  ]);

  const settingsMap = new Map<string, any>(
    (settingsRes.data ?? []).map((r: any) => [r.key, r.value])
  );

  // Pricing may live in site_settings under 'pricing' as { tiers: [...] }
  // or as a top-level array. Normalize to an array.
  const pricingSetting = settingsMap.get('pricing');
  let pricing: any[] = [];
  if (Array.isArray(pricingSetting)) pricing = pricingSetting;
  else if (Array.isArray(pricingSetting?.tiers)) pricing = pricingSetting.tiers;
  else if (Array.isArray(pricingSetting?.items)) pricing = pricingSetting.items;

  return {
    hero: settingsMap.get('hero') ?? {},
    about: settingsMap.get('about') ?? {},
    contact: settingsMap.get('contact') ?? {},
    services: servicesRes.data ?? [],
    projects: projectsRes.data ?? [],
    steps: stepsRes.data ?? [],
    stats: statsRes.data ?? [],
    transformations: transformationsRes.data ?? [],
    transformationsMeta: settingsMap.get('transformations-meta') ?? {},
    pricing,
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
