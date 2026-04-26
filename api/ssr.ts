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
  if (/^https:\/\//i.test(url)) return url;
  if (/^http:\/\//i.test(url)) return url.replace(/^http:\/\//i, 'https://');
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${SUPABASE_ORIGIN}${url}`;
  // Bare path like "gallery/foo.jpg" → assume the public polished-assets bucket
  if (!/^[a-z]+:/i.test(url)) {
    const path = url.replace(/^\/+/, '');
    const storagePath = path.startsWith('polished-assets/') ? path : `polished-assets/${path}`;
    return `${SUPABASE_ORIGIN}/storage/v1/object/public/${storagePath}`;
  }
  return url;
};

const toAbsoluteHttpsUrl = (raw: unknown): string => {
  const url = toAbsoluteUrl(raw);
  return /^https:\/\//i.test(url) ? url : '';
};

const pickLocalized = (row: Record<string, any>, base: string): string => {
  return (
    row?.[`${base}_en`] ??
    row?.[base] ??
    row?.[`${base}_bn`] ??
    ''
  );
};

const parseJsonLike = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed || !/^[\[{]/.test(trimmed)) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const extractRichObjectText = (input: unknown): string[] => {
  const chunks: string[] = [];
  const visit = (node: unknown) => {
    if (!node) return;
    if (typeof node === 'string') {
      const text = stripHtml(node);
      if (text) chunks.push(text);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node === 'object') {
      const record = node as Record<string, unknown>;
      if (typeof record.text === 'string') chunks.push(record.text);
      if (record.content) visit(record.content);
    }
  };
  visit(input);
  return chunks.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
};

const richTextToParagraphs = (input: unknown): string[] => {
  if (input === null || input === undefined) return [];
  if (typeof input === 'string') {
    const parsed = parseJsonLike(input);
    if (parsed !== input) return richTextToParagraphs(parsed);
  }
  if (typeof input === 'object') {
    return extractRichObjectText(input);
  }

  return String(input)
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>(?!\n)/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split(/\n\s*\n|\n/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

const collectCaseStudyBlocks = (project: Record<string, any>) => {
  const sources = [
    { lang: 'en', value: project.case_study_en ?? project.case_study },
    { lang: 'bn', value: project.case_study_bn },
    { lang: 'en', value: project.description_en ?? project.description },
    { lang: 'bn', value: project.description_bn },
  ];

  const seen = new Set<string>();
  return sources
    .map(({ lang, value }) => {
      const paragraphs = richTextToParagraphs(value).filter((paragraph) => {
        const key = paragraph.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return { lang, paragraphs };
    })
    .filter((block) => block.paragraphs.length > 0);
};

const imageKeyPattern = /(image|img|photo|picture|mockup|gallery|thumbnail|cover|visual|asset|avatar|logo|before|after)/i;
const imageExtensionPattern = /\.(avif|webp|png|jpe?g|gif|svg)(?:[?#].*)?$/i;
const nonImageExtensionPattern = /\.(pdf|mp4|mov|webm|zip|docx?|xlsx?|pptx?)(?:[?#].*)?$/i;

const looksLikeImage = (raw: unknown, keyPath: string[]): boolean => {
  if (typeof raw !== 'string') return false;
  const value = raw.trim();
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return false;
  if (nonImageExtensionPattern.test(value)) return false;
  const keyHint = keyPath.some((key) => imageKeyPattern.test(key));
  return keyHint || imageExtensionPattern.test(value) || /storage\/v1\/object\/public\/polished-assets/i.test(value);
};

const collectImageUrlsFromRecord = (record: Record<string, any>): string[] => {
  const urls: string[] = [];
  const visit = (value: unknown, keyPath: string[]) => {
    if (value === null || value === undefined) return;

    if (typeof value === 'string') {
      const parsed = parseJsonLike(value);
      if (parsed !== value) {
        visit(parsed, keyPath);
        return;
      }
      if (keyPath.some((key) => imageKeyPattern.test(key)) && /[\n,]/.test(value)) {
        const parts = value.split(/[\n,]+/).map((part) => part.trim()).filter(Boolean);
        if (parts.length > 1) {
          parts.forEach((part) => visit(part, keyPath));
          return;
        }
      }
      if (looksLikeImage(value, keyPath)) {
        const absoluteUrl = toAbsoluteHttpsUrl(value);
        if (absoluteUrl) urls.push(absoluteUrl);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, keyPath));
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, next]) => {
        visit(next, [...keyPath, key]);
      });
    }
  };

  visit(record, []);
  return Array.from(new Set(urls));
};

const renderPortfolioProjectsHtml = (projects: any[]): string => {
  return (projects || [])
    .map((p) => {
      const title = pickLocalized(p, 'title') || p.title || '';
      const titleSafe = escapeHtml(title);
      const category = escapeHtml(pickLocalized(p, 'category') || p.category || '');
      const client = escapeHtml(pickLocalized(p, 'client') || p.client || '');
      const meta = [client, category].filter(Boolean).join(' · ');
      const hook = stripHtml(pickLocalized(p, 'hook'));
      const uniqueImages = collectImageUrlsFromRecord(p).filter((url) => /^https:\/\//i.test(url));
      const caseStudyBlocks = collectCaseStudyBlocks(p);

      // This is the forced raw HTML string injection path for AI/non-JS scrapers.
      // Every portfolio image URL discovered from the Supabase row is appended as
      // a literal <img src="https://..."> tag before the response is sent.
      let html = '<article class="portfolio-project" itemscope itemtype="https://schema.org/CreativeWork">';

      if (titleSafe) html += `<h3 itemprop="name">${titleSafe}</h3>`;
      if (meta) html += `<p class="project-meta"><em>${meta}</em></p>`;
      if (hook) html += `<p class="project-hook"><strong>${escapeHtml(hook)}</strong></p>`;

      uniqueImages.forEach((url, imageIndex) => {
        const altText = title
          ? `Premium 3D Mockup for ${title}`
          : 'Premium Mockup';
        const captionText = title
          ? `${title} — mockup ${imageIndex + 1}`
          : `Mockup ${imageIndex + 1}`;
        html += `<figure>`;
        html += `<img src="${escapeHtml(url)}" alt="${escapeHtml(altText)}" itemprop="image" loading="lazy" decoding="async" width="1200" height="900" />`;
        html += `<figcaption>${escapeHtml(captionText)}</figcaption>`;
        html += `</figure>`;
      });

      if (caseStudyBlocks.length) {
        html += '<div class="case-study" itemprop="description">';
        caseStudyBlocks.forEach(({ lang, paragraphs }) => {
          html += `<div class="case-study-language" lang="${escapeHtml(lang)}">`;
          paragraphs.forEach((paragraph) => {
            html += `<p>${escapeHtml(paragraph)}</p>`;
          });
          html += '</div>';
        });
        html += '</div>';
      }

      const pdfLinks: string[] = [];
      if (p.pdf_url_en) {
        pdfLinks.push(`<a href="${escapeHtml(toAbsoluteUrl(p.pdf_url_en))}" rel="noopener">Download full case study (EN, PDF)</a>`);
      }
      if (p.pdf_url_bn) {
        pdfLinks.push(`<a href="${escapeHtml(toAbsoluteUrl(p.pdf_url_bn))}" rel="noopener">Download full case study (BN, PDF)</a>`);
      }
      if (pdfLinks.length) html += `<p class="case-study-downloads">${pdfLinks.join(' · ')}</p>`;

      html += '</article>';
      return html;
    })
    .join('');
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
  testimonials: any[];
}): string {
  const { hero, about, contact, services, projects, steps, stats, transformations, transformationsMeta, pricing, testimonials } = data;

  const heroTitle =
    pickLocalized(hero || {}, 'title');
  const heroTagline =
    pickLocalized(hero || {}, 'tagline') ||
    pickLocalized(hero || {}, 'subtitle');

  const aboutBody =
    stripHtml(pickLocalized(about || {}, 'body')) ||
    stripHtml(pickLocalized(about || {}, 'description'));

  const email = contact?.email || '';
  const phone = contact?.phone || contact?.whatsapp || '';

  const servicesHtml = services
    .map((s) => {
      const name = escapeHtml(pickLocalized(s, 'title') || pickLocalized(s, 'name'));
      const desc = escapeHtml(stripHtml(pickLocalized(s, 'description')));
      return `<li><strong>${name}</strong>${desc ? ` — ${desc}` : ''}</li>`;
    })
    .join('');

  const projectsHtml = renderPortfolioProjectsHtml(projects);

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

  // ─── Transformations (real visual proof) ────────────────────────────────
  const transformationsTitle = escapeHtml(
    transformationsMeta?.titleLine1En || transformationsMeta?.titleLine1Bn || ''
  );
  const beforeLabel = escapeHtml(transformationsMeta?.beforeLabelEn || 'Original visual');
  const afterLabel = escapeHtml(transformationsMeta?.afterLabelEn || 'Final visual');

  const transformationsHtml = (transformations || [])
    .filter((t) => t && t.is_active !== false && (t.before_image_url || t.after_image_url))
    .map((t) => {
      const name = escapeHtml(t.project_name || '');
      const beforeUrl = escapeHtml(toAbsoluteHttpsUrl(t.before_image_url));
      const afterUrl = escapeHtml(toAbsoluteHttpsUrl(t.after_image_url));
      const beforeImg = beforeUrl
        ? `<figure><img src="${beforeUrl}" alt="${beforeLabel}${name ? ` for ${name}` : ''}" loading="lazy" decoding="async" width="1200" height="900" /><figcaption>${beforeLabel}${name ? ` — ${name}` : ''}</figcaption></figure>`
        : '';
      const afterImg = afterUrl
        ? `<figure><img src="${afterUrl}" alt="${afterLabel}${name ? ` for ${name}` : ''}" loading="lazy" decoding="async" width="1200" height="900" /><figcaption>${afterLabel}${name ? ` — ${name}` : ''}</figcaption></figure>`
        : '';
      return `
        <article class="transformation" itemscope itemtype="https://schema.org/ImageObject">
          ${name ? `<h3 itemprop="name">${name}</h3>` : ''}
          ${beforeImg}
          ${afterImg}
        </article>`;
    })
    .join('');

  // ─── Investment / Pricing tiers (STRICTLY from live Supabase data) ──────
  // No hardcoded fallbacks: bots must only see what is actually published.
  const pricingItems = (pricing || []).map((p: any) => {
    const name = escapeHtml(pickLocalized(p, 'name') || pickLocalized(p, 'title') || p.name || '');
    const desc = escapeHtml(stripHtml(pickLocalized(p, 'description') || p.description || ''));
    const range = escapeHtml(
      p.range ||
      p.price_range ||
      p.price ||
      p.investment ||
      p.investment_range ||
      p.budget_range ||
      [p.min_price || p.minimum || p.from, p.max_price || p.maximum || p.to].filter(Boolean).join(' – ')
    );
    const featureSource = p.features || p.deliverables || p.includes || p.items || [];
    const features = (Array.isArray(featureSource) ? featureSource : richTextToParagraphs(featureSource))
      .map((item: any) => stripHtml(typeof item === 'string' ? item : item?.label || item?.name || item?.title || item?.description || ''))
      .filter(Boolean);
    if (!name && !desc && !range && !features.length) return '';
    return `
      <article class="pricing-tier" itemscope itemtype="https://schema.org/Offer">
        ${name ? `<h3 itemprop="name">${name}</h3>` : ''}
        ${desc ? `<p itemprop="description">${desc}</p>` : ''}
        ${range ? `<p class="pricing-range"><strong>Investment:</strong> <span itemprop="priceSpecification">${range}</span></p>` : ''}
        ${features.length ? `<ul>${features.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      </article>`;
  }).join('');

  // ─── Testimonials (STRICTLY from live Supabase data) ────────────────────
  const testimonialsHtml = (testimonials || [])
    .filter((t) => t && t.is_active !== false)
    .map((t: any) => {
      const quote = escapeHtml(stripHtml(pickLocalized(t, 'quote') || pickLocalized(t, 'content') || pickLocalized(t, 'body') || t.quote || ''));
      const author = escapeHtml(t.author_name || t.name || t.client_name || '');
      const role = escapeHtml(t.author_role || t.role || t.title || '');
      const brand = escapeHtml(t.brand_name || t.company || '');
      const avatar = escapeHtml(toAbsoluteHttpsUrl(t.avatar_url || t.image_url));
      if (!quote && !author) return '';
      const byline = [author, role, brand].filter(Boolean).join(' · ');
      return `
        <article class="testimonial" itemscope itemtype="https://schema.org/Review">
          ${avatar ? `<img src="${avatar}" alt="${author || 'Client'} — POLISHED testimonial" loading="lazy" decoding="async" width="200" height="200" />` : ''}
          ${quote ? `<blockquote itemprop="reviewBody">${quote}</blockquote>` : ''}
          ${byline ? `<p class="testimonial-byline" itemprop="author">— ${byline}</p>` : ''}
        </article>`;
    }).join('');

  const contactRows = [
    email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>` : '',
    phone ? `<p><strong>WhatsApp / Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>` : '',
    contact?.calendly ? `<p><strong>Book a consultation:</strong> <a href="${escapeHtml(toAbsoluteUrl(contact.calendly))}" rel="noopener">${escapeHtml(contact.calendly)}</a></p>` : '',
  ].filter(Boolean).join('');

  // JS-enabled humans see the React app only. No-JS bots receive this normal,
  // parseable DOM with live images/text before the client bundle runs.
  return `
<script>document.documentElement.classList.add('js');</script>
<style>html.js #seo-ssr-content{display:none!important}</style>
<main id="seo-ssr-content" data-source="supabase-live-html">
  <header>
    ${heroTitle ? `<h1>${escapeHtml(heroTitle)}</h1>` : ''}
    ${heroTagline ? `<p><strong>Tagline:</strong> ${escapeHtml(heroTagline)}</p>` : ''}
  </header>

  <nav aria-label="Primary">
    <ul>
      <li><a href="/#about">About</a></li>
      <li><a href="/#services">Services</a></li>
      <li><a href="/#portfolio">Portfolio</a></li>
      <li><a href="/#transformations">Transformations</a></li>
      <li><a href="/#pricing">Investment</a></li>
      <li><a href="/#process">Process</a></li>
      <li><a href="/#testimonials">Testimonials</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
  </nav>

  ${aboutBody || statsHtml ? `<section id="about-ssr"><h2>About POLISHED</h2>${aboutBody ? `<p>${escapeHtml(aboutBody)}</p>` : ''}${statsHtml ? `<ul>${statsHtml}</ul>` : ''}</section>` : ''}

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
      ? `<section id="transformations-ssr"><h2>${transformationsTitle || 'Visual Proof'}</h2>${transformationsHtml}</section>`
      : ''
  }

  ${
    pricingItems
      ? `<section id="pricing-ssr"><h2>Investment &amp; Engagement Tiers</h2>${pricingItems}</section>`
      : ''
  }

  ${
    testimonialsHtml
      ? `<section id="testimonials-ssr"><h2>Client Testimonials</h2>${testimonialsHtml}</section>`
      : ''
  }

  ${
    stepsHtml
      ? `<section id="process-ssr"><h2>The POLISHED Process</h2><ol>${stepsHtml}</ol></section>`
      : ''
  }

  ${contactRows ? `<section id="contact-ssr"><h2>Contact &amp; Booking</h2><address>${contactRows}</address></section>` : ''}

  <footer>
    <p>Live SSR snapshot from POLISHED — data fetched from Supabase at request time.
    Sitemap: <a href="/sitemap.xml">/sitemap.xml</a> · LLM brief: <a href="/llms.txt">/llms.txt</a>.</p>
  </footer>
</main>`.trim();
}

// ─── Fetch all live content in parallel ────────────────────────────────────
async function fetchLiveContent() {
  const settingsKeys = ['hero', 'about', 'contact', 'transformations-meta', 'pricing', 'testimonials'];

  const [
    settingsRes,
    servicesRes,
    projectsRes,
    stepsRes,
    statsRes,
    transformationsRes,
    testimonialsRes,
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
    // Testimonials table may not exist in every deployment — swallow errors
    supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .then((r) => r, () => ({ data: [] as any[] })),
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

  // Testimonials may also live in site_settings under 'testimonials'
  const testimonialsSetting = settingsMap.get('testimonials');
  let testimonialsFromSettings: any[] = [];
  if (Array.isArray(testimonialsSetting)) testimonialsFromSettings = testimonialsSetting;
  else if (Array.isArray(testimonialsSetting?.items)) testimonialsFromSettings = testimonialsSetting.items;

  const testimonials =
    (testimonialsRes as any)?.data?.length
      ? (testimonialsRes as any).data
      : testimonialsFromSettings;

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
    testimonials,
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
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(html);
  } catch (err) {
    // On failure, fall back to the un-injected template so the React app
    // still boots client-side. Bots lose live data but humans see no
    // visible difference.
    console.error('[ssr]', err);
    try {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).send(getTemplate());
    } catch {
      res.status(500).send('SSR error');
    }
  }
}
