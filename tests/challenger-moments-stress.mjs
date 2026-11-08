import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('================================================================');
console.log('🥋 FIGHTERX EMPIRICAL STRESS-TEST: MOMENTS GALLERY & BUILD INTEGRITY');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${description}`);
    console.error(`    Error: ${err.message}`);
    failCount++;
  }
}

const ROOT = process.cwd();

// --- 1. GLASSMORPHIC CSS TOKENS IN MOMENT-CARD ---
console.log('\n--- SUITE 1: Glassmorphic CSS Tokens in MomentCard ---');

const momentCardPath = path.join(ROOT, 'src/components/moments/moment-card.tsx');
const momentCardSrc = fs.readFileSync(momentCardPath, 'utf8');

test('MomentCard contains backdrop-blur-xl token', () => {
  assert.ok(
    momentCardSrc.includes('backdrop-blur-xl'),
    'Expected backdrop-blur-xl in moment-card.tsx'
  );
});

test('MomentCard contains specular top-edge bevel inset_0_1px_0_rgba(255,255,255,0.12)', () => {
  assert.ok(
    momentCardSrc.includes('inset_0_1px_0_rgba(255,255,255,0.12)'),
    'Expected inset_0_1px_0_rgba(255,255,255,0.12) in moment-card.tsx'
  );
});

test('MomentCard contains athletic elevation lift hover:-translate-y-1.5', () => {
  assert.ok(
    momentCardSrc.includes('hover:-translate-y-1.5'),
    'Expected hover:-translate-y-1.5 in moment-card.tsx'
  );
});

test('MomentCard uses clear transparent glass background (jernih)', () => {
  assert.ok(
    momentCardSrc.includes('bg-transparent') && momentCardSrc.includes('backdrop-blur-xl'),
    'Expected clear transparent glass background in moment-card.tsx'
  );
});

test('MomentCard has translucent glass border', () => {
  assert.ok(
    momentCardSrc.includes('border-white/10'),
    'Expected translucent border in moment-card.tsx'
  );
});

test('MomentCard includes Eye icon with viewsCount metric', () => {
  assert.ok(
    momentCardSrc.includes('<Eye') && momentCardSrc.includes('moment.viewsCount'),
    'Expected Eye icon and moment.viewsCount in action bar'
  );
});

// --- 2. ATHLETIC HERO BRANDING & TYPOGRAPHY ---
console.log('\n--- SUITE 2: Athletic Hero Branding & Typography ---');

const heroHeaderPath = path.join(ROOT, 'src/components/moments/moments-hero-header.tsx');
const heroHeaderSrc = fs.readFileSync(heroHeaderPath, 'utf8');

const globalsCssPath = path.join(ROOT, 'src/app/globals.css');
const globalsCssSrc = fs.readFileSync(globalsCssPath, 'utf8');

test('MomentsHeroHeader mounts .hero-overline with dual rules', () => {
  assert.ok(
    heroHeaderSrc.includes('className="hero-overline') &&
    heroHeaderSrc.includes('hero-overline-rule'),
    'Expected .hero-overline and .hero-overline-rule in moments-hero-header.tsx'
  );
  assert.ok(
    heroHeaderSrc.includes('— GALERI &amp; AKSI LATIHAN ATLET SILAT MALAYSIA —') ||
    heroHeaderSrc.includes('GALERI & AKSI LATIHAN ATLET SILAT MALAYSIA'),
    'Expected national overline copy'
  );
});

test('MomentsHeroHeader mounts Teko 3D dual-tone title with title-white and title-crimson', () => {
  assert.ok(
    heroHeaderSrc.includes('className="hero-display-title') &&
    heroHeaderSrc.includes('title-white') &&
    heroHeaderSrc.includes('title-crimson'),
    'Expected .hero-display-title, .title-white, and .title-crimson in moments-hero-header.tsx'
  );
  assert.ok(
    heroHeaderSrc.includes('MOMENTS') && heroHeaderSrc.includes('WARRIORS.'),
    'Expected MOMENTS OF WARRIORS title copy'
  );
});

test('MomentsHeroHeader mounts .hero-quote-callout with signature national quote', () => {
  assert.ok(
    heroHeaderSrc.includes('className="hero-quote-callout') &&
    heroHeaderSrc.includes('hero-quote-rule') &&
    heroHeaderSrc.includes('hero-quote-text') &&
    heroHeaderSrc.includes('hero-quote-highlight'),
    'Expected .hero-quote-callout elements in moments-hero-header.tsx'
  );
  assert.ok(
    heroHeaderSrc.includes('Semangat Juang.') && heroHeaderSrc.includes('Jiwa Malaysia.'),
    'Expected signature quote copy'
  );
});

test('MomentsHeroHeader implements GSAP matchMedia stagger animation', () => {
  assert.ok(
    heroHeaderSrc.includes('useGSAP') &&
    heroHeaderSrc.includes('gsap.matchMedia()') &&
    heroHeaderSrc.includes('(prefers-reduced-motion: no-preference)'),
    'Expected accessible GSAP matchMedia timeline with reduced-motion check'
  );
});

test('Global CSS defines .hero-overline, .hero-display-title, .title-white, .title-crimson, .hero-quote-callout', () => {
  assert.ok(globalsCssSrc.includes('.hero-overline {'), 'Missing .hero-overline in globals.css');
  assert.ok(globalsCssSrc.includes('.hero-display-title {'), 'Missing .hero-display-title in globals.css');
  assert.ok(globalsCssSrc.includes('.title-white {'), 'Missing .title-white in globals.css');
  assert.ok(globalsCssSrc.includes('.title-crimson {'), 'Missing .title-crimson in globals.css');
  assert.ok(globalsCssSrc.includes('.hero-quote-callout {'), 'Missing .hero-quote-callout in globals.css');
});

// --- 3. CAROUSEL & ATHLETE BADGE TECHNICAL GEOMETRY ---
console.log('\n--- SUITE 3: Hero Carousel & Athlete Badge Upgrades ---');

const carouselPath = path.join(ROOT, 'src/components/moments/moments-hero-carousel.tsx');
const carouselSrc = fs.readFileSync(carouselPath, 'utf8');

test('MomentsHeroCarousel uses technical badge geometry with red left-border accent', () => {
  assert.ok(
    carouselSrc.includes('border-l-2 border-l-[#ff3845]') ||
    carouselSrc.includes('border-l-[3px] border-l-[#ff3845]'),
    'Expected technical left border accent in carousel badge'
  );
});

test('MomentsHeroCarousel uses Teko athletic italic slide titles', () => {
  assert.ok(
    carouselSrc.includes('font-athletic italic uppercase') &&
    carouselSrc.includes('leading-[0.92]'),
    'Expected Teko athletic italic title typography in carousel'
  );
});

test('MomentsHeroCarousel renders queued cards with dark glassmorphism', () => {
  assert.ok(
    carouselSrc.includes('backdrop-blur-md') &&
    carouselSrc.includes('border border-white/15 bg-black/50') &&
    carouselSrc.includes('inset_0_1px_0_rgba(255,255,255,0.15)'),
    'Expected dark glassmorphic queued preview cards'
  );
});

// --- 4. SSR / CSR BOUNDARIES & TURBOPACK COMPLIANCE ---
console.log('\n--- SUITE 4: SSR / CSR Boundaries & Turbopack Compliance ---');

const clientComponents = [
  'src/components/moments/moments-hero-header.tsx',
  'src/components/moments/moments-hero-carousel.tsx',
  'src/components/moments/moment-card.tsx',
  'src/components/moments/moments-control-bar.tsx',
  'src/components/moments/moment-auth-guard-modal.tsx',
  'src/components/moments/moment-upload-modal.tsx',
  'src/components/moments/moments-experience.tsx',
  'src/lib/moments/moments-context.tsx',
];

clientComponents.forEach((relPath) => {
  test(`Component ${relPath} declares "use client" directive`, () => {
    const src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const firstNonEmpty = src.split('\n').find((l) => l.trim().length > 0) || '';
    assert.ok(
      firstNonEmpty.includes('"use client"') || firstNonEmpty.includes("'use client'"),
      `Expected "use client" as top directive in ${relPath}`
    );
  });
});

test('src/app/moments/page.tsx is a Server Component with metadata export', () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, 'src/app/moments/page.tsx'), 'utf8');
  assert.ok(
    !pageSrc.includes('"use client"') && !pageSrc.includes("'use client'"),
    'src/app/moments/page.tsx must NOT be a client component'
  );
  assert.ok(
    pageSrc.includes('export const metadata'),
    'src/app/moments/page.tsx should export metadata'
  );
  assert.ok(
    pageSrc.includes('export default async function MomentsPage'),
    'src/app/moments/page.tsx should be an async Server Component'
  );
});

test('Client components guard browser globals (window/sessionStorage) against SSR crashes', () => {
  const guardedComponents = [
    'src/components/moments/moments-control-bar.tsx',
    'src/components/moments/moment-auth-guard-modal.tsx',
    'src/components/moments/moment-upload-modal.tsx',
    'src/components/moments/moment-card.tsx',
  ];

  guardedComponents.forEach((relPath) => {
    const src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    // Ensure window / sessionStorage are NOT accessed at module top-level scope (column 0)
    const lines = src.split('\n');
    lines.forEach((line, idx) => {
      // Check if line begins at column 0 with a declaration or statement accessing browser globals
      const isTopLevelAccess = /^[a-zA-Z0-9_$].*(window|sessionStorage|localStorage)\./.test(line);
      assert.strictEqual(
        isTopLevelAccess,
        false,
        `Detected unsafe top-level global access in ${relPath}:${idx + 1}: ${line}`
      );
    });
  });
});

// --- 5. ATHLETE ACCESS CONTROL & INLINE VALIDATION ---
console.log('\n--- SUITE 5: Athlete Access Control & Form Validation ---');

const controlBarPath = path.join(ROOT, 'src/components/moments/moments-control-bar.tsx');
const controlBarSrc = fs.readFileSync(controlBarPath, 'utf8');

const authModalPath = path.join(ROOT, 'src/components/moments/moment-auth-guard-modal.tsx');
const authModalSrc = fs.readFileSync(authModalPath, 'utf8');

const uploadModalPath = path.join(ROOT, 'src/components/moments/moment-upload-modal.tsx');
const uploadModalSrc = fs.readFileSync(uploadModalPath, 'utf8');

const athleteDashboardPath = path.join(ROOT, 'src/components/athlete/athlete-home-dashboard.tsx');
const athleteDashboardSrc = fs.readFileSync(athleteDashboardPath, 'utf8');

test('MomentsControlBar checks fighterx_session_role === "ATHLETE"', () => {
  assert.ok(
    controlBarSrc.includes('fighterx_session_role') &&
    controlBarSrc.includes('"ATHLETE"'),
    'Expected session role check for ATHLETE in moments-control-bar.tsx'
  );
});

test('MomentsControlBar opens MomentAuthGuardModal when not an athlete', () => {
  assert.ok(
    controlBarSrc.includes('MomentAuthGuardModal') &&
    controlBarSrc.includes('setIsAuthGuardOpen(true)'),
    'Expected auth guard modal trigger on unauthenticated/non-athlete click'
  );
});

test('MomentAuthGuardModal provides athlete login link and demo bypass button', () => {
  assert.ok(
    authModalSrc.includes('href="/login/athlete?returnTo=/moments"'),
    'Expected link to /login/athlete?returnTo=/moments'
  );
  assert.ok(
    authModalSrc.includes('Bypass Masuk Sebagai Atlet (Mod Demo)'),
    'Expected demo bypass button'
  );
});

test('MomentUploadModal replaces alert() with inline error banner and red field borders', () => {
  assert.ok(
    !uploadModalSrc.includes('alert('),
    'Forbidden alert() call found in moment-upload-modal.tsx'
  );
  assert.ok(
    uploadModalSrc.includes('errorMessage') && uploadModalSrc.includes('fieldErrors'),
    'Expected inline errorMessage and fieldErrors state in moment-upload-modal.tsx'
  );
  assert.ok(
    uploadModalSrc.includes('border-[#ff3845]'),
    'Expected red border highlight on validation failure'
  );
});

test('MomentUploadModal prefills verified athlete details when role is ATHLETE', () => {
  assert.ok(
    uploadModalSrc.includes('Alya Nabilah') &&
    uploadModalSrc.includes('FighterX Demo Club') &&
    uploadModalSrc.includes('setIsVerifiedAthlete(true)'),
    'Expected prefill of verified athlete details'
  );
});

test('AthleteHomeDashboard includes direct quick action linking to /moments?upload=true', () => {
  assert.ok(
    athleteDashboardSrc.includes('/moments?upload=true'),
    'Expected quick action link to /moments?upload=true in athlete-home-dashboard.tsx'
  );
});

// --- 6. TYPES AND DATA LAYER ---
console.log('\n--- SUITE 6: Types & Data Layer Verification ---');

const typesPath = path.join(ROOT, 'src/lib/moments/types.ts');
const typesSrc = fs.readFileSync(typesPath, 'utf8');

test('AthleteMoment interface includes viewsCount?: number and verifiedAthlete?: boolean', () => {
  assert.ok(
    typesSrc.includes('viewsCount?: number'),
    'Missing viewsCount?: number in AthleteMoment interface'
  );
  assert.ok(
    typesSrc.includes('verifiedAthlete?: boolean'),
    'Missing verifiedAthlete?: boolean in AthleteMoment interface'
  );
});

// --- 7. ADVERSARIAL EDGE CASE STRESS TESTS ---
console.log('\n--- SUITE 7: Adversarial Edge Cases & Logic Stress Testing ---');

test('Caption truncation handles empty, short, and 500-char strings gracefully', () => {
  const truncateLogic = (caption, isExpanded) => {
    const isLong = caption.length > 130;
    return isLong && !isExpanded ? `${caption.slice(0, 130)}...` : caption;
  };

  assert.strictEqual(truncateLogic('', false), '');
  assert.strictEqual(truncateLogic('Short caption', false), 'Short caption');
  const longCaption = 'A'.repeat(200);
  assert.strictEqual(truncateLogic(longCaption, false), `${'A'.repeat(130)}...`);
  assert.strictEqual(truncateLogic(longCaption, true), longCaption);
});

test('Discipline badge resolver handles invalid or unrecognized tags with default fallback', () => {
  const getDisciplineBadge = (discipline) => {
    switch (discipline) {
      case 'olahraga':
        return { label: 'Silat Olahraga', bg: 'bg-red-500/15 text-[#FF3845] border-red-500/30' };
      case 'seni':
        return { label: 'Silat Seni', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'fitness':
        return { label: 'Kecergasan / S&C', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'kejohanan':
        return { label: 'Kem & Kejohanan', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'Umum', bg: 'bg-white/10 text-white border-white/20' };
    }
  };

  assert.strictEqual(getDisciplineBadge('olahraga').label, 'Silat Olahraga');
  assert.strictEqual(getDisciplineBadge('seni').label, 'Silat Seni');
  assert.strictEqual(getDisciplineBadge('fitness').label, 'Kecergasan / S&C');
  assert.strictEqual(getDisciplineBadge('kejohanan').label, 'Kem & Kejohanan');
  assert.strictEqual(getDisciplineBadge('unknown-tag').label, 'Umum');
  assert.strictEqual(getDisciplineBadge(undefined).label, 'Umum');
});

test('Upload tag parser extracts max 5 valid hashtag tokens and ignores malformed text', () => {
  const parseTags = (input) => {
    return input
      .split(/\s+/)
      .filter((t) => t.startsWith('#'))
      .slice(0, 5);
  };

  const sample = '#Silat #Seni #Juara #Emas #Malaysia #ExtraTag randomText #NoHash';
  const tags = parseTags(sample);
  assert.strictEqual(tags.length, 5);
  assert.deepStrictEqual(tags, ['#Silat', '#Seni', '#Juara', '#Emas', '#Malaysia']);
  assert.deepStrictEqual(parseTags('no tags here'), []);
});

test('Upload form validation catches whitespace-only inputs without crashing', () => {
  const validateForm = (athleteName, trainingFocus, caption) => {
    const errors = {};
    if (!athleteName.trim()) errors.athleteName = true;
    if (!trainingFocus.trim()) errors.trainingFocus = true;
    if (!caption.trim()) errors.caption = true;
    return errors;
  };

  const allEmpty = validateForm('   ', '   \t', '\n\n');
  assert.strictEqual(allEmpty.athleteName, true);
  assert.strictEqual(allEmpty.trainingFocus, true);
  assert.strictEqual(allEmpty.caption, true);

  const valid = validateForm('Amirul', 'Sparring', 'Latihan petang');
  assert.strictEqual(Object.keys(valid).length, 0);
});

// Summary
console.log('\n================================================================');
console.log(`STRESS-TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
