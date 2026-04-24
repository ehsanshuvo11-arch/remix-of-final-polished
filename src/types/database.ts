export interface SiteSettings {
  id: string;
  key: string;
  value: Record<string, any>;
  updated_at: string;
}

export interface Service {
  id: string;
  sort_order: number;
  name_en: string;
  name_bn: string;
  desc_en: string;
  desc_bn: string;
}

export interface PortfolioProject {
  id: string;
  sort_order: number;
  title_en: string;
  title_bn: string;
  category_en: string;
  category_bn: string;
  image_url: string;
  case_study_en: string;
  case_study_bn: string;
  hook_en?: string;
  hook_bn?: string;
  pdf_url_en?: string;
  pdf_url_bn?: string;
  mockup_url?: string;
  mockup_urls?: string[];
}

export interface ProcessStep {
  id: string;
  sort_order: number;
  title_en: string;
  title_bn: string;
  desc_en: string;
  desc_bn: string;
}

export interface Stat {
  id: string;
  sort_order: number;
  num: string;
  suffix: string;
  label_en: string;
  label_bn: string;
}

// Hero content from site_settings
export interface HeroContent {
  titleEn: string;
  title2En: string;
  titleBn: string;
  title2Bn?: string;
  eyebrowEn: string;
  eyebrowBn: string;
  subEn: string;
  subBn: string;
  playCtaEn?: string;
  playCtaBn?: string;
  viewWorkEn?: string;
  viewWorkBn?: string;
  startProjectEn?: string;
  startProjectBn?: string;
  scrollEn?: string;
  scrollBn?: string;
}

export interface AboutContent {
  labelEn?: string;
  labelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
  p1En: string;
  p1Bn: string;
  p2En: string;
  p2Bn: string;
  quoteEn?: string;
  quoteBn?: string;
}

export interface ContactContent {
  email: string;
  ig: string;
  fb: string;
  wa: string;
  sectionLabelEn?: string;
  sectionLabelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
  descEn?: string;
  descBn?: string;
  brandPlaceholderEn?: string;
  brandPlaceholderBn?: string;
  emailPlaceholderEn?: string;
  emailPlaceholderBn?: string;
  messagePlaceholderEn?: string;
  messagePlaceholderBn?: string;
  submitLabelEn?: string;
  submitLabelBn?: string;
}

export interface FooterContent {
  brandName: string;
  year: string;
  rightsTextEn?: string;
  rightsTextBn?: string;
}

export interface NavContent {
  aboutEn?: string;
  aboutBn?: string;
  servicesEn?: string;
  servicesBn?: string;
  workEn?: string;
  workBn?: string;
  contactEn?: string;
  contactBn?: string;
}

export interface DiscountContent {
  code: string;
  amount: string;
}

export interface ServicesMetaContent {
  labelEn?: string;
  labelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
}

export interface PortfolioMetaContent {
  labelEn?: string;
  labelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
}

export interface ProcessMetaContent {
  labelEn?: string;
  labelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
}

export interface PuzzleContent {
  imageUrl: string;
  pieceImages?: string[];
  titleEn?: string;
  titleBn?: string;
  introPrefixEn?: string;
  introPrefixBn?: string;
  introSuffixEn?: string;
  introSuffixBn?: string;
  piecesLabelEn?: string;
  piecesLabelBn?: string;
  boardLabelEn?: string;
  boardLabelBn?: string;
  howToPlayLabelEn?: string;
  howToPlayLabelBn?: string;
  instructionsEn?: string;
  instructionsBn?: string;
  attemptsLabelEn?: string;
  attemptsLabelBn?: string;
  shuffleLabelEn?: string;
  shuffleLabelBn?: string;
  solvedTitleEn?: string;
  solvedTitleBn?: string;
  solvedDescEn?: string;
  solvedDescBn?: string;
  copiedEn?: string;
  copiedBn?: string;
}

export interface Transformation {
  id: string;
  created_at?: string;
  project_name: string;
  before_image_url: string;
  after_image_url: string;
  is_active: boolean;
  sort_order?: number;
}

export interface TransformationsMetaContent {
  labelEn?: string;
  labelBn?: string;
  titleLine1En?: string;
  titleLine1Bn?: string;
  titleLine2En?: string;
  titleLine2Bn?: string;
  beforeLabelEn?: string;
  beforeLabelBn?: string;
  afterLabelEn?: string;
  afterLabelBn?: string;
}

export interface ColorsContent {
  blue: string;
  orange: string;
  bg: string;
  text: string;
}

export interface MetaContent {
  title: string;
  desc: string;
  gaId: string;
}
