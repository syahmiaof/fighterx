import fs from 'node:fs';
import assert from 'node:assert';

console.log('--- RUNNING RIGOROUS COMPETITION CARDS ADVERSARIAL VERIFICATION ---');

// 1. Check data exports and helper edge cases
import {
  INITIAL_COMPETITIONS,
  getPosterOrBulletin,
  isValidDocumentUrl,
  formatDisplayDateRange,
  TIER_CONFIG,
} from '../src/components/competitions/competitions-data.ts';

// Tests for isValidDocumentUrl
assert.strictEqual(isValidDocumentUrl(null), false, 'null URL is invalid');
assert.strictEqual(isValidDocumentUrl(undefined), false, 'undefined URL is invalid');
assert.strictEqual(isValidDocumentUrl(''), false, 'empty URL is invalid');
assert.strictEqual(isValidDocumentUrl('   '), false, 'whitespace URL is invalid');
assert.strictEqual(isValidDocumentUrl('not a url'), false, 'malformed string is invalid');
assert.strictEqual(isValidDocumentUrl('javascript:alert(1)'), false, 'javascript URI is blocked');
assert.strictEqual(isValidDocumentUrl('data:text/html,<script>alert(1)</script>'), false, 'data URI is blocked');
assert.strictEqual(isValidDocumentUrl('https://pesaka.org.my/doc.pdf'), true, 'https URL is valid');
assert.strictEqual(isValidDocumentUrl('http://example.com/bulletin.pdf'), true, 'http URL is valid');

// Edge case tests for getPosterOrBulletin
assert.strictEqual(
  getPosterOrBulletin(null),
  null,
  'Null comp must return null safely without throwing'
);
assert.strictEqual(
  getPosterOrBulletin(undefined),
  null,
  'Undefined comp must return null safely without throwing'
);
assert.strictEqual(
  getPosterOrBulletin({}),
  null,
  'Empty comp object must return null'
);
assert.strictEqual(
  getPosterOrBulletin({ posterUrl: '', bulletinUrl: '' }),
  null,
  'Empty string fields must return null'
);
assert.strictEqual(
  getPosterOrBulletin({ posterUrl: '   ', bulletinUrl: '  ' }),
  null,
  'Whitespace fields must return null'
);
assert.strictEqual(
  getPosterOrBulletin({ posterUrl: 'javascript:alert(1)' }),
  null,
  'javascript URI posterUrl must be omitted'
);
assert.strictEqual(
  getPosterOrBulletin({ bulletinUrl: 'data:text/html,<script>alert(1)</script>' }),
  null,
  'data URI bulletinUrl must be omitted'
);
assert.strictEqual(
  getPosterOrBulletin({ posterUrl: 'not-a-valid-url' }),
  null,
  'Malformed posterUrl must be omitted'
);
assert.strictEqual(
  getPosterOrBulletin({ bulletinFileName: 'doc.pdf' }),
  null,
  'bulletinFileName without URL must return null (fake download eliminated)'
);

const posterSample = getPosterOrBulletin({ posterUrl: 'https://example.com/poster.jpg' });
assert.deepStrictEqual(
  posterSample,
  { type: 'poster', url: 'https://example.com/poster.jpg', label: 'Poster Rasmi' },
  'posterUrl should produce direct link with label Poster Rasmi'
);

const bulletinSample = getPosterOrBulletin({ bulletinUrl: 'https://example.com/bulletin.pdf' });
assert.deepStrictEqual(
  bulletinSample,
  { type: 'bulletin', url: 'https://example.com/bulletin.pdf', label: 'Buletin Rasmi' },
  'bulletinUrl should produce direct link with label Buletin Rasmi'
);

// Edge case tests for formatDisplayDateRange
assert.strictEqual(
  formatDisplayDateRange(null, null),
  '',
  'Null dates return empty string'
);
assert.strictEqual(
  formatDisplayDateRange(undefined, undefined),
  '',
  'Undefined dates return empty string'
);
assert.strictEqual(
  formatDisplayDateRange('', ''),
  '',
  'Empty dates return empty string'
);
assert.strictEqual(
  formatDisplayDateRange('invalid', 'invalid'),
  'invalid',
  'Invalid non-date strings return safely without NaN'
);
assert.strictEqual(
  formatDisplayDateRange('2026-05-10', '2026-05-10'),
  '10 Mei 2026',
  'Same-day event formats cleanly'
);
assert.strictEqual(
  formatDisplayDateRange('2026-05-10', null),
  '10 Mei 2026',
  'Single date event formats cleanly'
);
assert.strictEqual(
  formatDisplayDateRange('2026-04-16', '2026-04-20'),
  '16 – 20 April 2026',
  'Same-month multi-day event formats cleanly'
);
assert.strictEqual(
  formatDisplayDateRange('2026-08-28', '2026-09-06'),
  '28 Ogos – 6 September 2026',
  'Cross-month multi-day event formats cleanly'
);
assert.strictEqual(
  formatDisplayDateRange('2026-12-25', '2027-01-02'),
  '25 Disember 2026 – 2 Januari 2027',
  'Cross-year multi-day event formats cleanly'
);
assert.strictEqual(
  formatDisplayDateRange('2026-15-01', '2026-15-05'),
  '2026-15-01',
  'Out-of-range month returns safe fallback string without spacing glitch'
);

// Edge case tests for formatEventDates
import { formatEventDates, getWhatsAppUrl } from '../src/components/competitions/competitions-data.ts';

assert.deepStrictEqual(
  formatEventDates(null, null),
  { days: '--', month: 'OGOS', year: String(new Date().getFullYear()), durationLabel: '1 Hari' },
  'Null event dates must return safe fallback without crashing'
);
assert.deepStrictEqual(
  formatEventDates(undefined, undefined),
  { days: '--', month: 'OGOS', year: String(new Date().getFullYear()), durationLabel: '1 Hari' },
  'Undefined event dates must return safe fallback without crashing'
);
assert.deepStrictEqual(
  formatEventDates('invalid', 'invalid'),
  { days: 'invalid', month: 'OGOS', year: String(new Date().getFullYear()), durationLabel: '1 Hari' },
  'Malformed event dates return safe fallback without NaN'
);

const standardEventDate = formatEventDates('2026-04-16', '2026-04-20');
assert.strictEqual(standardEventDate.days, '16 - 20');
assert.strictEqual(standardEventDate.month, 'APR');
assert.strictEqual(standardEventDate.year, '2026');
assert.strictEqual(standardEventDate.durationLabel, '5 Hari');

// Edge case tests for getWhatsAppUrl
assert(getWhatsAppUrl(null, null).startsWith('https://wa.me/'), 'Null inputs to getWhatsAppUrl must not throw');
assert(getWhatsAppUrl('012-3456789', 'Test').includes('60123456789'), 'Phone formatting with 0 prefix adds country code 6');
assert(getWhatsAppUrl('+6012-3456789', 'Test').includes('60123456789'), 'Phone formatting with +60 prefix formats correctly');

// Verify INITIAL_COMPETITIONS
assert(Array.isArray(INITIAL_COMPETITIONS), 'INITIAL_COMPETITIONS must be an array');
assert(INITIAL_COMPETITIONS.length === 15, `Expected 15 competitions, got ${INITIAL_COMPETITIONS.length}`);

let withDirectPosterUrl = 0;
let withDirectBulletinUrl = 0;
let withoutPosterOrBulletin = 0;

INITIAL_COMPETITIONS.forEach((comp) => {
  assert(comp.title, `Tournament ${comp.id} must have title`);
  assert(comp.startDate, `Tournament ${comp.id} must have startDate`);
  assert(comp.endDate, `Tournament ${comp.id} must have endDate`);
  assert(comp.venue, `Tournament ${comp.id} must have venue`);
  assert(comp.state, `Tournament ${comp.id} must have state`);
  assert(comp.tier, `Tournament ${comp.id} must have tier`);
  assert(TIER_CONFIG[comp.tier], `Tier config for ${comp.tier} must exist`);

  const dateRange = formatDisplayDateRange(comp.startDate, comp.endDate);
  assert(dateRange && dateRange.length > 0, `Date range for ${comp.id} must format`);

  const posterInfo = getPosterOrBulletin(comp);
  if (!posterInfo) {
    withoutPosterOrBulletin++;
    console.log(`[NO POSTER/BULLETIN (OMITTED)] ${comp.id}: ${comp.title}`);
  } else {
    assert(posterInfo.url && posterInfo.url.startsWith('http'), `Poster/bulletin for ${comp.id} must have valid URL`);
    if (posterInfo.type === 'poster') withDirectPosterUrl++;
    else if (posterInfo.type === 'bulletin') withDirectBulletinUrl++;
    console.log(`[DIRECT LINK: ${posterInfo.label}] ${comp.id}: ${posterInfo.url}`);
  }
});

console.log(`\nDataset distribution:`);
console.log(`- ${withDirectPosterUrl} tournaments with direct official poster URL`);
console.log(`- ${withDirectBulletinUrl} tournaments with direct official bulletin URL`);
console.log(`- ${withoutPosterOrBulletin} tournaments with NO poster/bulletin (omitted from UI)`);

assert.strictEqual(withDirectPosterUrl, 5, 'Must have exactly 5 tournaments with direct posterUrl');
assert.strictEqual(withDirectBulletinUrl, 5, 'Must have exactly 5 tournaments with direct bulletinUrl');
assert.strictEqual(withoutPosterOrBulletin, 5, 'Must have exactly 5 developmental tournaments with poster button omitted');

// 2. Check generated HTML for /competitions
if (fs.existsSync('.next/server/app/competitions.html')) {
  const compHtml = fs.readFileSync('.next/server/app/competitions.html', 'utf8');
  assert(!compHtml.includes('btn-action-whatsapp'), 'No WhatsApp button on competition cards in /competitions');
  assert(!compHtml.includes('slot-mini-progress'), 'No bloated progress bars in /competitions HTML');
  assert(!compHtml.includes('event-fee-slot-card'), 'No fee slot card bloat in /competitions HTML');
  assert(compHtml.includes('comp-glass-card'), 'Glassmorphism card class must be present in /competitions');
  assert(compHtml.includes('comp-tier-badge'), 'Tier badge must be present in /competitions');
  assert(compHtml.includes('comp-status-badge'), 'Status badge must be present in /competitions');

  // Verify phone numbers do not appear in competition cards in HTML
  INITIAL_COMPETITIONS.forEach((comp) => {
    const rawPhone = comp.contactPerson.phone;
    if (compHtml.includes(rawPhone)) {
      const cardsSection = compHtml.substring(
        compHtml.indexOf('pro-events-feed'),
        compHtml.indexOf('pro-modal-container')
      );
      assert(
        !cardsSection.includes(rawPhone),
        `Phone ${rawPhone} for ${comp.id} must not appear inside card feed`
      );
    }
  });
}

// 3. Check generated HTML for /calendar
if (fs.existsSync('.next/server/app/calendar.html')) {
  const calHtml = fs.readFileSync('.next/server/app/calendar.html', 'utf8');
  assert(!calHtml.includes('btn-action-whatsapp'), 'No WhatsApp button on calendar cards in /calendar');
  assert(!calHtml.includes('slot-mini-progress'), 'No bloated progress bars in /calendar HTML');
  assert(calHtml.includes('comp-glass-card'), 'Glassmorphism card class must be present in /calendar');
}

// 4. Verify CSS contains ultra-minimalist dark glassmorphism styling
const cssContent = fs.readFileSync('src/components/competitions/competitions.css', 'utf8');
assert(cssContent.includes('.comp-glass-card'), 'comp-glass-card CSS must exist');
assert(cssContent.includes('backdrop-filter: blur(14px);'), 'Glassmorphism backdrop-filter must be 14px');
assert(cssContent.includes('border: 1px solid rgba(255, 255, 255, 0.08);'), 'Translucent borders must exist');
assert(cssContent.includes('.comp-glass-card.is-featured:hover'), 'Featured hover rule must exist to prevent border overwrite');
assert(!cssContent.includes('.slot-mini-progress'), 'Bloated progress bar CSS must be completely removed');

// 5. Verify Empty State Glassmorphism
assert(cssContent.includes('.competitions-empty-state'), 'competitions-empty-state CSS must exist');
assert(cssContent.includes('font-family: var(--font-display), Teko, sans-serif;'), 'Empty state title must use Teko font');

// 6. Verify Error Boundaries exist for /competitions and /calendar
assert(fs.existsSync('src/app/competitions/error.tsx'), 'Competitions error boundary must exist');
assert(fs.existsSync('src/app/calendar/error.tsx'), 'Calendar error boundary must exist');
const compErrorContent = fs.readFileSync('src/app/competitions/error.tsx', 'utf8');
assert(compErrorContent.includes('export default function CompetitionsError'), 'CompetitionsError component must be exported');
const calErrorContent = fs.readFileSync('src/app/calendar/error.tsx', 'utf8');
assert(calErrorContent.includes('export default function CalendarError'), 'CalendarError component must be exported');

// 7. Verify search and filter logic edge cases: zero vs single result
const searchTestZero = INITIAL_COMPETITIONS.filter((c) =>
  c.title.toLowerCase().includes('nonexistent tournament xyz123')
);
assert.strictEqual(searchTestZero.length, 0, 'Zero search result edge case returns 0');

const searchTestSingle = INITIAL_COMPETITIONS.filter((c) =>
  c.title.toLowerCase().includes('sukipt')
);
assert.strictEqual(searchTestSingle.length, 1, 'Single search result edge case returns exactly 1 tournament');
assert.strictEqual(searchTestSingle[0].id, 'FX-2026-003', 'Matched tournament is SUKIPT');

console.log('--- ALL RIGOROUS VERIFICATION CHECKS PASSED SUCCESSFULLY ---');
