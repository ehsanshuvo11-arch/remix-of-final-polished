import type { PortfolioProject, ProcessStep, Service, Stat } from '@/types/database';

export type AdminCollectionTable = 'services' | 'stats' | 'portfolio_projects' | 'process_steps';

type RowLike = Record<string, unknown>;

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => stringValue(item)).filter(Boolean)
    : [];
}

function firstNonEmpty(...values: unknown[]) {
  return values
    .map((value) => stringValue(value).trim())
    .find(Boolean) ?? '';
}

export function isSchemaColumnMismatch(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() ?? '';
  return message.includes('schema cache') || message.includes('does not exist');
}

export function normalizeServiceRow(row: RowLike): Service {
  return {
    id: stringValue(row.id),
    sort_order: numberValue(row.sort_order),
    name_en: firstNonEmpty(row.name_en, row.name),
    name_bn: stringValue(row.name_bn),
    desc_en: firstNonEmpty(row.desc_en, row.description, row.desc),
    desc_bn: stringValue(row.desc_bn),
  };
}

export function normalizeStatRow(row: RowLike): Stat {
  return {
    id: stringValue(row.id),
    sort_order: numberValue(row.sort_order),
    num: stringValue(row.num),
    suffix: stringValue(row.suffix),
    label_en: firstNonEmpty(row.label_en, row.label),
    label_bn: stringValue(row.label_bn),
  };
}

export function normalizeProcessStepRow(row: RowLike): ProcessStep {
  return {
    id: stringValue(row.id),
    sort_order: numberValue(row.sort_order),
    title_en: firstNonEmpty(row.title_en, row.title),
    title_bn: stringValue(row.title_bn),
    desc_en: firstNonEmpty(row.desc_en, row.description, row.desc),
    desc_bn: stringValue(row.desc_bn),
  };
}

export function normalizePortfolioProjectRow(row: RowLike): PortfolioProject {
  const mockupUrls = stringArray(row.mockup_urls);
  const singleMockup = stringValue(row.mockup_url);

  return {
    id: stringValue(row.id),
    sort_order: numberValue(row.sort_order),
    title_en: firstNonEmpty(row.title_en, row.title),
    title_bn: stringValue(row.title_bn),
    category_en: firstNonEmpty(row.category_en, row.category),
    category_bn: stringValue(row.category_bn),
    image_url: stringValue(row.image_url),
    case_study_en: firstNonEmpty(row.case_study_en, row.case_study),
    case_study_bn: stringValue(row.case_study_bn),
    hook_en: firstNonEmpty(row.hook_en, row.hook),
    hook_bn: stringValue(row.hook_bn),
    pdf_url_en: firstNonEmpty(row.pdf_url_en, row.pdf_url),
    pdf_url_bn: stringValue(row.pdf_url_bn),
    mockup_url: firstNonEmpty(singleMockup, mockupUrls[0]),
    mockup_urls: mockupUrls.length ? mockupUrls : (singleMockup ? [singleMockup] : []),
  };
}

export function buildCollectionPayload(
  table: AdminCollectionTable,
  row: RowLike,
  mode: 'localized' | 'legacy' = 'localized',
) {
  switch (table) {
    case 'services': {
      const service = normalizeServiceRow(row);

      if (mode === 'legacy') {
        return {
          sort_order: service.sort_order,
          name: firstNonEmpty(service.name_en, service.name_bn),
          description: firstNonEmpty(service.desc_en, service.desc_bn),
        };
      }

      return {
        sort_order: service.sort_order,
        name_en: service.name_en,
        name_bn: service.name_bn,
        desc_en: service.desc_en,
        desc_bn: service.desc_bn,
      };
    }

    case 'stats': {
      const stat = normalizeStatRow(row);

      if (mode === 'legacy') {
        return {
          sort_order: stat.sort_order,
          num: stat.num,
          suffix: stat.suffix,
          label: firstNonEmpty(stat.label_en, stat.label_bn),
        };
      }

      return {
        sort_order: stat.sort_order,
        num: stat.num,
        suffix: stat.suffix,
        label_en: stat.label_en,
        label_bn: stat.label_bn,
      };
    }

    case 'process_steps': {
      const step = normalizeProcessStepRow(row);

      if (mode === 'legacy') {
        return {
          sort_order: step.sort_order,
          title: firstNonEmpty(step.title_en, step.title_bn),
          description: firstNonEmpty(step.desc_en, step.desc_bn),
        };
      }

      return {
        sort_order: step.sort_order,
        title_en: step.title_en,
        title_bn: step.title_bn,
        desc_en: step.desc_en,
        desc_bn: step.desc_bn,
      };
    }

    case 'portfolio_projects': {
      const project = normalizePortfolioProjectRow(row);

      if (mode === 'legacy') {
        return {
          sort_order: project.sort_order,
          title: firstNonEmpty(project.title_en, project.title_bn),
          category: firstNonEmpty(project.category_en, project.category_bn),
          image_url: project.image_url,
          case_study: firstNonEmpty(project.case_study_en, project.case_study_bn),
          hook: firstNonEmpty(project.hook_en, project.hook_bn),
          pdf_url: firstNonEmpty(project.pdf_url_en, project.pdf_url_bn),
          mockup_url: firstNonEmpty(project.mockup_url, project.mockup_urls?.[0]),
        };
      }

      return {
        sort_order: project.sort_order,
        title_en: project.title_en,
        title_bn: project.title_bn,
        category_en: project.category_en,
        category_bn: project.category_bn,
        image_url: project.image_url,
        case_study_en: project.case_study_en,
        case_study_bn: project.case_study_bn,
        hook_en: project.hook_en ?? '',
        hook_bn: project.hook_bn ?? '',
        pdf_url_en: project.pdf_url_en ?? '',
        pdf_url_bn: project.pdf_url_bn ?? '',
        mockup_url: project.mockup_url ?? '',
        mockup_urls: project.mockup_urls ?? [],
      };
    }
  }
}
