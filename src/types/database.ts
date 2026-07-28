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

export interface EvolutionContent {
  before_image_url?: string;
  after_image_url?: string;
  title_en?: string;
  title_bn?: string;
  subtitle_en?: string;
  subtitle_bn?: string;
  before_label_en?: string;
  before_label_bn?: string;
  after_label_en?: string;
  after_label_bn?: string;
}

export interface Inquiry {
  id: string;
  created_at?: string;
  client_name: string;
  brand_name: string;
  email: string;
  store_url?: string | null;
  budget_range: string;
  project_details: string;
  status: 'new' | 'contacted' | 'archived' | string;
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

export interface TestimonialItem {
  id: string;
  quote_en: string;
  quote_bn: string;
  name: string;
  role_en: string;
  role_bn: string;
}

export interface TestimonialsContent {
  labelEn?: string;
  labelBn?: string;
  headingEn?: string;
  headingBn?: string;
  subEn?: string;
  subBn?: string;
  items?: TestimonialItem[];
}

export interface UILabelsContent {
  // Portfolio buttons
  portfolioClickExpandEn?: string;
  portfolioClickExpandBn?: string;
  portfolioClickCollapseEn?: string;
  portfolioClickCollapseBn?: string;
  portfolioViewCaseStudyEn?: string;
  portfolioViewCaseStudyBn?: string;
  portfolioHideCaseStudyEn?: string;
  portfolioHideCaseStudyBn?: string;
  portfolioViewMockupsEn?: string;
  portfolioViewMockupsBn?: string;

  // Navbar (BN labels are currently hardcoded)
  navAboutBn?: string;
  navServicesBn?: string;
  navEvolutionEn?: string;
  navEvolutionBn?: string;
  navWorkBn?: string;
  navContactBn?: string;

  // LeadForm — Bengali intro
  leadFormIntroTitleBn?: string;
  leadFormIntroDescBn?: string;

  // LeadForm — progress
  leadFormStepOfEn?: string; // supports {n} and {total}
  leadFormStepOfBn?: string;
  leadFormStepBrandEn?: string;
  leadFormStepBrandBn?: string;
  leadFormStepVisionEn?: string;
  leadFormStepVisionBn?: string;
  leadFormStepContactEn?: string;
  leadFormStepContactBn?: string;

  // LeadForm — Step 1
  leadFormStep1EyebrowEn?: string;
  leadFormStep1EyebrowBn?: string;
  leadFormStep1TitleEn?: string;
  leadFormStep1TitleBn?: string;
  leadFormNameEn?: string;
  leadFormNameBn?: string;
  leadFormBrandNameEn?: string;
  leadFormBrandNameBn?: string;
  leadFormStoreUrlEn?: string;
  leadFormStoreUrlBn?: string;

  // LeadForm — Step 2
  leadFormStep2EyebrowEn?: string;
  leadFormStep2EyebrowBn?: string;
  leadFormStep2TitleEn?: string;
  leadFormStep2TitleBn?: string;
  leadFormBudgetLabelEn?: string;
  leadFormBudgetLabelBn?: string;
  leadFormProjectPlaceholderEn?: string;
  leadFormProjectPlaceholderBn?: string;
  budget1En?: string; budget1Bn?: string;
  budget2En?: string; budget2Bn?: string;
  budget3En?: string; budget3Bn?: string;
  budget4En?: string; budget4Bn?: string;

  // LeadForm — Step 3
  leadFormStep3EyebrowEn?: string;
  leadFormStep3EyebrowBn?: string;
  leadFormStep3TitleEn?: string;
  leadFormStep3TitleBn?: string;
  leadFormEmailPlaceholderEn?: string;
  leadFormEmailPlaceholderBn?: string;
  leadFormReassuranceEn?: string;
  leadFormReassuranceBn?: string;

  // LeadForm — buttons + thank you
  leadFormBackEn?: string;
  leadFormBackBn?: string;
  leadFormContinueEn?: string;
  leadFormContinueBn?: string;
  leadFormSubmitEn?: string;
  leadFormSubmitBn?: string;
  leadFormSendingEn?: string;
  leadFormSendingBn?: string;
  leadFormReceivedEn?: string;
  leadFormReceivedBn?: string;
  leadFormThankTitleEn?: string;
  leadFormThankTitleBn?: string;
  leadFormThankSubEn?: string;
  leadFormThankSubBn?: string;
  leadFormResetEn?: string;
  leadFormResetBn?: string;
}
