export type Locale = "en" | "bm";

export interface NavDictionary {
  home: string;
  guidelines: string;
  knowledge: string;
  leaderboard: string;
  competitions: string;
  moments: string;
  associations: string;
  disciplines: string;
  login: string;
  registerClub: string;
  allModules: string;
}

export interface CommonDictionary {
  learnMore: string;
  viewAll: string;
  back: string;
  close: string;
  searchPlaceholder: string;
  filterBy: string;
  allCategories: string;
  allStates: string;
  allStatus: string;
  resetFilter: string;
  loading: string;
  error: string;
  verifiedBadge: string;
  nationalMotto: string;
  nationalMottoHighlight: string;
}

export interface HomeDictionary {
  heroOverline: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroQuote: string;
  heroQuoteHighlight: string;
  athleteCreditSeni: {
    name: string;
    title: string;
  };
  athleteCreditOlahraga: {
    name: string;
    title: string;
  };
  features: {
    analyticsTitle: string;
    analyticsBody: string;
    programmesTitle: string;
    programmesBody: string;
    monitoringTitle: string;
    monitoringBody: string;
    managementTitle: string;
    managementBody: string;
  };
  marquee: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  stats: {
    eyebrow: string;
    title: string;
    kpiClubs: string;
    kpiAthletes: string;
    kpiCoaches: string;
    kpiSessions: string;
    chartTitle: string;
    filterAll: string;
    filterOlahraga: string;
    filterSeni: string;
  };
  valueProp: {
    eyebrow: string;
    title: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Cta: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Cta: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Cta: string;
  };
  pesaka: {
    eyebrow: string;
    title: string;
    tag1: string;
    tag2: string;
    tag3: string;
    ctaFormat: string;
    ctaDirectory: string;
    fourFoundersTitle: string;
  };
  spotlight: {
    eyebrow: string;
    title: string;
    subtitle: string;
    roleAthlete: string;
    roleCoach: string;
    roleWasit: string;
  };
  preview: {
    leaderboardOverline: string;
    leaderboardTitle: string;
    calendarOverline: string;
    calendarTitle: string;
    viewAll: string;
    fullLeaderboard: string;
    fullCalendar: string;
  };
  collaboration: {
    overline: string;
    title: string;
    subtitle: string;
    badgeApparel: string;
    badgeGear: string;
  };
  testimonials: {
    overline: string;
    title: string;
    verified: string;
  };
  workflow: {
    title: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
  };
  programmes: {
    title: string;
    seniTitle: string;
    seniDesc: string;
    seniCta: string;
    olahragaTitle: string;
    olahragaDesc: string;
    olahragaCta: string;
  };
  faq: {
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

export interface GuidelinesDictionary {
  overline: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  bulletinNotice: string;
  coreRules: {
    pointsBadge: string;
    pointsTitle: string;
    pointsDesc: string;
    pointsItem1: string;
    pointsItem2: string;
    pointsItem3: string;
    grappleBadge: string;
    grappleTitle: string;
    grappleDesc: string;
    grappleItem1: string;
    grappleItem2: string;
    grappleItem3: string;
    targetBadge: string;
    targetTitle: string;
    targetDesc: string;
    targetItem1: string;
    targetItem2: string;
    targetItem3: string;
    penaltyBadge: string;
    penaltyTitle: string;
    penaltyDesc: string;
    penaltyItem1: string;
    penaltyItem2: string;
    penaltyItem3: string;
  };
  formats: {
    tandingTitle: string;
    tandingRounds: string;
    tandingWeight: string;
    tandingGear: string;
    seniTitle: string;
    seniCategories: string;
    seniTime: string;
    seniWeapon: string;
  };
  flow: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  calculators: {
    title: string;
    subtitle: string;
    tabTanding: string;
    tabJurus: string;
    tanding: {
      title: string;
      desc: string;
      redCorner: string;
      blueCorner: string;
      punch: string;
      kick: string;
      takedown: string;
      grappleTimer: string;
      timerReady: string;
      timerRunning: string;
      timerSuccess: string;
      timerExpired: string;
      startGrapple: string;
      takedownSuccess: string;
      resetTimer: string;
      penalties: string;
      warningReprimand1: string;
      warningReprimand2: string;
      warningOfficial1: string;
      warningOfficial2: string;
      warningOfficial3: string;
      directDq: string;
      resetBout: string;
    };
    jurus: {
      title: string;
      desc: string;
      tunggal: string;
      ganda: string;
      regu: string;
      soloBebas: string;
      accuracy: string;
      expression: string;
      timeDeduction: string;
      weaponDeduction: string;
      totalScore: string;
    };
  };
  dosAndDonts: {
    title: string;
    subtitle: string;
    legalTitle: string;
    illegalTitle: string;
  };
  penalties: {
    title: string;
    subtitle: string;
    dqNoticeTitle: string;
    dqNoticeBody: string;
  };
  checklist: {
    title: string;
    subtitle: string;
    athleteTab: string;
    coachTab: string;
  };
  disclaimer: {
    title: string;
    body: string;
    linkText: string;
  };
}

export interface KnowledgeDictionary {
  overline: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  ctaFramework: string;
  ctaCitations: string;
  accreditationIsn: string;
  accreditationPersilat: string;
  accreditationIoc: string;
  accreditationMsn: string;
  tabs: {
    framework: string;
    articles: string;
    tools: string;
  };
  framework: {
    title: string;
    subtitle: string;
    block1: string;
    block2: string;
    subtabCalendar: string;
    subtabPolicy: string;
    subtabTests: string;
    subtabPriorities: string;
  };
  articles: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    readTime: string;
    verifiedTag: string;
    openReader: string;
    backToHub: string;
    filterAll: string;
  };
  tools: {
    title: string;
    subtitle: string;
    tabPeriodization: string;
    tabWeightCut: string;
    tabSweatRate: string;
    tabStakeholders: string;
  };
  citations: {
    header: string;
    subtitle: string;
    openArchive: string;
  };
}

export interface LeaderboardDictionary {
  overline: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterOlahraga: string;
  filterSeni: string;
  pointsLabel: string;
  emptyTitle: string;
  emptyReset: string;
  loadMore: string;
  detailModal: {
    verifiedPoints: string;
    attendance: string;
    rpeAvg: string;
    evidenceRate: string;
    badgesTitle: string;
    verificationBreakdown: string;
  };
}

export interface CompetitionsDictionary {
  overline: string;
  title: string;
  subtitle: string;
  quote: string;
  searchPlaceholder: string;
  submitEventButton: string;
  tabAll: string;
  tabNational: string;
  tabJunior: string;
  tabOpen: string;
  viewCards: string;
  viewCalendar: string;
  resultsCount: string;
  statusOpen: string;
  statusClosingSoon: string;
  statusUpcoming: string;
  statusClosed: string;
  tierNational: string;
  tierJunior: string;
  tierOpen: string;
  badgeVerified: string;
  badgeUnderReview: string;
  btnRegisterContingent: string;
  btnDetails: string;
  btnWhatsapp: string;
  modalDetails: {
    scheduleTab: string;
    categoriesTab: string;
    officialsTab: string;
    downloadBulletin: string;
  };
  modalRegistration: {
    title: string;
    clubName: string;
    managerName: string;
    phone: string;
    email: string;
    ageCategory: string;
    discipline: string;
    athleteCount: string;
    submit: string;
    successTitle: string;
    refCode: string;
  };
  modalSubmission: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    successTitle: string;
    refCode: string;
  };
}

export interface MomentsDictionary {
  overline: string;
  title: string;
  subtitle: string;
  quote: string;
  filterAll: string;
  filterOlahraga: string;
  filterSeni: string;
  filterFitness: string;
  searchPlaceholder: string;
  btnShareMoment: string;
  cheerButton: string;
  emptyTitle: string;
  uploadModal: {
    title: string;
    presetTempur: string;
    presetSeni: string;
    presetFitness: string;
    presetWeapon: string;
    submit: string;
  };
  authModal: {
    overline: string;
    title: string;
    description: string;
    loginButton: string;
    demoButton: string;
  };
}

export interface AssociationsDictionary {
  overline: string;
  title: string;
  subtitle: string;
  quote: string;
  searchPlaceholder: string;
  resultsCount: string;
  btnLearnMore: string;
  filterAll: string;
  filterBadanInduk: string;
  filterPengasas: string;
  filterPerguruanUtama: string;
  filterAntarabangsa: string;
  modal: {
    founded: string;
    founder: string;
    headquarters: string;
    disciplines: string;
    tabHistory: string;
    tabPhilosophy: string;
    tabWeapons: string;
    tabFigures: string;
    officialWebsite: string;
  };
}

export interface DisciplinesDictionary {
  overline: string;
  title: string;
  subtitle: string;
  quote: string;
  cardSeniTitle: string;
  cardSeniDesc: string;
  cardSeniCta: string;
  cardOlahragaTitle: string;
  cardOlahragaDesc: string;
  cardOlahragaCta: string;
  navOverview: string;
  navSeni: string;
  navOlahraga: string;
  navEquipment: string;
  navWeights: string;
  comparison: {
    title: string;
    subtitle: string;
  };
  seni: {
    title: string;
    subtitle: string;
    tunggalTitle: string;
    tunggalDesc: string;
    gandaTitle: string;
    gandaDesc: string;
    reguTitle: string;
    reguDesc: string;
    soloBebasTitle: string;
    soloBebasDesc: string;
  };
  olahraga: {
    title: string;
    subtitle: string;
    strikesTitle: string;
    grappleRuleTitle: string;
    weightTableTitle: string;
  };
  equipment: {
    title: string;
    subtitle: string;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    btnRegister: string;
    btnRules: string;
  };
}

export interface AuthDictionary {
  loginOverline: string;
  loginTitle: string;
  roleAthleteTitle: string;
  roleAthleteDesc: string;
  roleCoachTitle: string;
  roleCoachDesc: string;
  roleAdminTitle: string;
  roleAdminDesc: string;
  bypassButton: string;
  officialLoginButton: string;
  backHome: string;
  roleLoginPage: {
    backToRoleSelection: string;
    loginTitle: string;
    dashboardSubtitle: string;
    bypassHint: string;
  };
  gateway: {
    eyebrow: string;
    title: string;
    subtitle: string;
    registerCardTrial: string;
    registerCardTitle: string;
    registerCardDesc: string;
    registerCardBtn: string;
    myClubCardEyebrow: string;
    myClubCardTitle: string;
    myClubCardDesc: string;
    myClubCardBtn: string;
    boundaryNote: string;
  };
  registerForm: {
    badge: string;
    title: string;
    subtitle: string;
    pricingTrial: string;
    pricingRate: string;
    alreadyRegistered: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
    };
    submitButton: string;
    receiptTitle: string;
    printReceipt: string;
  };
}

export interface Dictionary {
  nav: NavDictionary;
  common: CommonDictionary;
  home: HomeDictionary;
  guidelines: GuidelinesDictionary;
  knowledge: KnowledgeDictionary;
  leaderboard: LeaderboardDictionary;
  competitions: CompetitionsDictionary;
  moments: MomentsDictionary;
  associations: AssociationsDictionary;
  disciplines: DisciplinesDictionary;
  auth: AuthDictionary;
}

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  d: Dictionary;
  dict: Dictionary;
}
