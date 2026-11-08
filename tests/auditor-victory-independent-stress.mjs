import fs from 'node:fs';
import assert from 'node:assert';

console.log('================================================================');
console.log('     VICTORY AUDITOR INDEPENDENT FORENSIC STRESS TEST SUITE     ');
console.log('================================================================');

// Import data modules
import {
  INITIAL_COMPETITIONS,
  getPosterOrBulletin,
  isValidDocumentUrl,
  formatDisplayDateRange,
  formatEventDates,
  TIER_CONFIG,
} from '../src/components/competitions/competitions-data.ts';

let checksPassed = 0;
function pass(msg) {
  checksPassed++;
  console.log(`  ✓ PASS: ${msg}`);
}

// -----------------------------------------------------------------------------
// CHECK 1: URL VALIDATION & SCHEME HARDENING
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 1: URL SECURITY & SCHEME SANITIZATION ---');

const dangerousUrls = [
  null,
  undefined,
  '',
  '   ',
  'javascript:alert(1)',
  'JAVASCRIPT:alert(1)',
  'javascript:void(0)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox("xss")',
  'file:///etc/passwd',
  'file:///C:/Windows/win.ini',
  'ftp://anonymous@ftp.example.com/file.pdf',
  'blob:https://example.com/uuid',
  'not a valid url at all',
  'http://',
  'https://',
  '//example.com/path',
  'mailto:test@example.com',
  'tel:+60123456789',
];

for (const url of dangerousUrls) {
  assert.strictEqual(
    isValidDocumentUrl(url),
    false,
    `Dangerous/invalid URL must be rejected: ${url}`
  );
}
pass('All 19 dangerous, malformed, or non-web URL schemes rejected by isValidDocumentUrl');

const validUrls = [
  'https://pesaka.org.my/buletin/pesaka-kebangsaan-2026.pdf',
  'https://selangor2026.com/poster-rasmi-silat-sukma.pdf',
  'https://sukipt.com.my/dokumen/buletin-silat-2026.pdf',
  'http://example.com/bulletin.pdf',
  'https://sub.domain.edu.my/path/to/doc?query=1#hash',
];

for (const url of validUrls) {
  assert.strictEqual(
    isValidDocumentUrl(url),
    true,
    `Valid HTTP/HTTPS URL must be accepted: ${url}`
  );
}
pass('All 5 valid HTTP/HTTPS URLs accepted');

// -----------------------------------------------------------------------------
// CHECK 2: POSTER/BULLETIN DESCRIPTOR RESOLUTION
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 2: POSTER & BULLETIN RESOLUTION / OMISSION ---');

assert.strictEqual(getPosterOrBulletin(null), null);
assert.strictEqual(getPosterOrBulletin(undefined), null);
assert.strictEqual(getPosterOrBulletin({}), null);
assert.strictEqual(getPosterOrBulletin({ posterUrl: '' }), null);
assert.strictEqual(getPosterOrBulletin({ bulletinUrl: '   ' }), null);
assert.strictEqual(getPosterOrBulletin({ posterUrl: 'javascript:alert(1)' }), null);
assert.strictEqual(getPosterOrBulletin({ bulletinUrl: 'data:text/html,...' }), null);
assert.strictEqual(getPosterOrBulletin({ bulletinFileName: 'mock.pdf' }), null);
pass('Falsy, malformed, or mock-only input returns null without error');

// Precedence test: posterUrl takes precedence over bulletinUrl if both present
const dualComp = {
  posterUrl: 'https://example.com/poster.jpg',
  bulletinUrl: 'https://example.com/bulletin.pdf',
};
const dualResult = getPosterOrBulletin(dualComp);
assert.strictEqual(dualResult.type, 'poster');
assert.strictEqual(dualResult.label, 'Poster Rasmi');
assert.strictEqual(dualResult.url, 'https://example.com/poster.jpg');
pass('posterUrl takes precedence over bulletinUrl when both are supplied');

// Fallback to bulletinUrl when posterUrl is absent or invalid
const bulletinComp = {
  posterUrl: 'invalid',
  bulletinUrl: 'https://example.com/bulletin.pdf',
};
const bulletinResult = getPosterOrBulletin(bulletinComp);
assert.strictEqual(bulletinResult.type, 'bulletin');
assert.strictEqual(bulletinResult.label, 'Buletin Rasmi');
assert.strictEqual(bulletinResult.url, 'https://example.com/bulletin.pdf');
pass('bulletinUrl resolved cleanly when posterUrl is invalid');

// -----------------------------------------------------------------------------
// CHECK 3: DATE RANGE FORMATTING ROBUSTNESS
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 3: DATE RANGE FORMATTING INVARIANTS ---');

assert.strictEqual(formatDisplayDateRange(null, null), '');
assert.strictEqual(formatDisplayDateRange(undefined, undefined), '');
assert.strictEqual(formatDisplayDateRange('', ''), '');
assert.strictEqual(formatDisplayDateRange('   ', '   '), '');
assert.strictEqual(formatDisplayDateRange('bogus-date', 'bogus-date'), 'bogus-date');
assert.strictEqual(formatDisplayDateRange('2026-99-99', '2026-99-99'), '2026-99-99');
assert.strictEqual(formatDisplayDateRange('2026-04-16', '2026-04-20'), '16 – 20 April 2026');
assert.strictEqual(formatDisplayDateRange('2026-08-28', '2026-09-06'), '28 Ogos – 6 September 2026');
assert.strictEqual(formatDisplayDateRange('2026-12-25', '2027-01-05'), '25 Disember 2026 – 5 Januari 2027');
assert.strictEqual(formatDisplayDateRange('2026-05-10', '2026-05-10'), '10 Mei 2026');
assert.strictEqual(formatDisplayDateRange('2026-05-10', null), '10 Mei 2026');
pass('Date range formatter handles nulls, invalid inputs, same-day, cross-month, and cross-year');

// -----------------------------------------------------------------------------
// CHECK 4: INITIAL_COMPETITIONS INTEGRITY & ESSENTIAL METADATA
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 4: DATASET INTEGRITY & METADATA STRICTNESS ---');

assert(Array.isArray(INITIAL_COMPETITIONS), 'INITIAL_COMPETITIONS must be array');
assert.strictEqual(INITIAL_COMPETITIONS.length, 15, 'Dataset must have 15 competitions');

let posterCount = 0;
let bulletinCount = 0;
let omittedCount = 0;

for (const comp of INITIAL_COMPETITIONS) {
  // R2 requirement checks:
  assert(comp.title && comp.title.trim().length > 0, `${comp.id} must have tournament name`);
  assert(comp.startDate && comp.endDate, `${comp.id} must have start and end dates`);
  assert(comp.venue && comp.venue.trim().length > 0, `${comp.id} must have venue`);
  assert(comp.state && comp.state.trim().length > 0, `${comp.id} must have state`);
  assert(comp.tier && TIER_CONFIG[comp.tier], `${comp.id} must have valid tier`);
  assert(comp.status, `${comp.id} must have status`);

  // Document link check:
  const doc = getPosterOrBulletin(comp);
  if (!doc) {
    omittedCount++;
  } else {
    assert(doc.url.startsWith('https://'), `${comp.id} document link must use https: ${doc.url}`);
    if (doc.type === 'poster') posterCount++;
    if (doc.type === 'bulletin') bulletinCount++;
  }
}

assert.strictEqual(posterCount, 5, 'Exactly 5 tournaments with direct poster');
assert.strictEqual(bulletinCount, 5, 'Exactly 5 tournaments with direct bulletin');
assert.strictEqual(omittedCount, 5, 'Exactly 5 tournaments with poster omitted');
pass(`All 15 tournaments adhere strictly to R2 & R3 (5 poster, 5 bulletin, 5 omitted)`);

// -----------------------------------------------------------------------------
// CHECK 5: PRERENDERED HTML VALIDATION (/competitions & /calendar)
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 5: GENERATED HTML AUDIT ---');

const compHtmlPath = '.next/server/app/competitions.html';
const calHtmlPath = '.next/server/app/calendar.html';

assert(fs.existsSync(compHtmlPath), 'competitions.html must exist in .next build output');
assert(fs.existsSync(calHtmlPath), 'calendar.html must exist in .next build output');

const compHtml = fs.readFileSync(compHtmlPath, 'utf8');
const calHtml = fs.readFileSync(calHtmlPath, 'utf8');

for (const [name, html] of [['/competitions', compHtml], ['/calendar', calHtml]]) {
  // Check R1 Dark Glassmorphism classes
  assert(html.includes('comp-glass-card'), `${name} must include comp-glass-card`);
  assert(html.includes('comp-tier-badge'), `${name} must include comp-tier-badge`);
  assert(html.includes('comp-status-badge'), `${name} must include comp-status-badge`);
  assert(html.includes('comp-card-details-btn'), `${name} must include comp-card-details-btn`);

  // Check R2 Strict Omission of bloat
  assert(!html.includes('btn-action-whatsapp'), `${name} MUST NOT contain WhatsApp buttons on cards`);
  assert(!html.includes('slot-mini-progress'), `${name} MUST NOT contain progress bars`);
  assert(!html.includes('event-fee-slot-card'), `${name} MUST NOT contain fee slot cards`);

  // Find all comp-glass-card blocks in HTML
  const cardRegex = /<article class="comp-glass-card[\s\S]*?<\/article>/g;
  const cards = html.match(cardRegex) || [];
  assert.strictEqual(cards.length, 15, `${name} must prerender exactly 15 competition cards`);

  let renderedPosters = 0;
  for (let i = 0; i < cards.length; i++) {
    const cardHtml = cards[i];
    const comp = INITIAL_COMPETITIONS[i];

    // Must have title, venue, state
    const escapedTitle = comp.title
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&#x27;')
      .replace(/"/g, '&quot;');
    assert(cardHtml.includes(escapedTitle), `Card ${i} must display tournament title: ${escapedTitle}`);
    assert(cardHtml.includes(comp.state), `Card ${i} must display state: ${comp.state}`);
    assert(cardHtml.includes('comp-tier-badge'), `Card ${i} must have tier badge`);
    assert(cardHtml.includes('comp-status-badge'), `Card ${i} must have status badge`);

    // Strictly NO phone numbers on cards
    if (comp.contactPerson && comp.contactPerson.phone) {
      assert(
        !cardHtml.includes(comp.contactPerson.phone),
        `Card ${i} for ${comp.id} must NOT contain contact phone ${comp.contactPerson.phone}`
      );
    }
    assert(!cardHtml.includes('+60'), `Card ${i} must not contain phone international prefix`);
    assert(!cardHtml.includes('slot-mini-progress'), `Card ${i} must not have progress bar`);
    assert(!cardHtml.includes('btn-action-whatsapp'), `Card ${i} must not have WhatsApp button`);

    // Document link: if comp has poster/bulletin, it MUST be rendered with direct URL
    const doc = getPosterOrBulletin(comp);
    if (doc) {
      assert(
        cardHtml.includes('comp-card-poster-btn'),
        `Card ${i} for ${comp.id} must have poster button`
      );
      assert(
        cardHtml.includes(`href="${doc.url}"`),
        `Card ${i} for ${comp.id} must have direct link to ${doc.url}`
      );
      assert(
        cardHtml.includes('target="_blank"') && cardHtml.includes('rel="noopener noreferrer"'),
        `Card ${i} link must have target="_blank" and rel="noopener noreferrer"`
      );
      renderedPosters++;
    } else {
      // Must be completely omitted
      assert(
        !cardHtml.includes('comp-card-poster-btn'),
        `Card ${i} for ${comp.id} must OMIT poster button completely`
      );
    }
  }

  assert.strictEqual(renderedPosters, 10, `${name} must render exactly 10 direct poster/bulletin links (5 omitted)`);

  pass(`${name} HTML verified: 15 cards, exact 10 direct external links, 5 omitted, zero phone numbers, zero progress bars`);
}

// -----------------------------------------------------------------------------
// CHECK 6: CSS SPECIFICATION & DESIGN TOKENS
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 6: CSS DESIGN TOKENS & RESPONSIVENESS ---');

const css = fs.readFileSync('src/components/competitions/competitions.css', 'utf8');

// R1 Glassmorphism checks
assert(css.includes('.comp-glass-card {'), 'comp-glass-card definition must exist');
assert(css.includes('background: rgba(14, 16, 22, 0.55);'), 'Dark translucent background must be rgba(14, 16, 22, 0.55)');
assert(css.includes('backdrop-filter: blur(14px);'), 'backdrop-filter: blur(14px) must exist');
assert(css.includes('-webkit-backdrop-filter: blur(14px);'), '-webkit-backdrop-filter: blur(14px) must exist');
assert(css.includes('border: 1px solid rgba(255, 255, 255, 0.08);'), 'Translucent border rgba(255, 255, 255, 0.08) must exist');
assert(css.includes('border-radius: 12px;'), 'border-radius: 12px must exist');
assert(css.includes('box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);'), 'Soft glassmorphic box-shadow must exist');

// Hover & featured states
assert(css.includes('.comp-glass-card:hover {'), 'Hover state must exist');
assert(css.includes('background: rgba(20, 23, 32, 0.72);'), 'Hover background must be rgba(20, 23, 32, 0.72)');
assert(css.includes('.comp-glass-card.is-featured {'), 'Featured card styling must exist');
assert(css.includes('.comp-glass-card.is-featured:hover {'), 'Featured hover override must exist');
assert(css.includes('border-left-color: rgba(255, 56, 69, 0.95);'), 'Featured red left accent preserved on hover');

// Responsive rules
assert(css.includes('@media (max-width: 768px)'), 'Mobile responsive query (<768px) must exist');
assert(css.includes('flex-direction: column;'), 'Mobile card stacks vertically');
assert(css.includes('touch-action: manipulation;'), 'Mobile touch action manipulation enabled');

// Empty state
assert(css.includes('.competitions-empty-state {'), 'competitions-empty-state must exist');
assert(css.includes('font-family: var(--font-display), Teko, sans-serif;'), 'Empty state must use Teko display font');

pass('CSS design tokens, dark glassmorphism, hover states, mobile media queries, and empty state verified');

// -----------------------------------------------------------------------------
// CHECK 7: ERROR BOUNDARY ARCHITECTURE
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 7: ERROR BOUNDARIES ---');

assert(fs.existsSync('src/app/competitions/error.tsx'), 'src/app/competitions/error.tsx must exist');
assert(fs.existsSync('src/app/calendar/error.tsx'), 'src/app/calendar/error.tsx must exist');

const compError = fs.readFileSync('src/app/competitions/error.tsx', 'utf8');
const calError = fs.readFileSync('src/app/calendar/error.tsx', 'utf8');

assert(compError.includes('"use client";'), 'Competitions error boundary must be client component');
assert(calError.includes('"use client";'), 'Calendar error boundary must be client component');
assert(compError.includes('reset: () => void'), 'Competitions error boundary must receive reset callback');
assert(calError.includes('reset: () => void'), 'Calendar error boundary must receive reset callback');
assert(compError.includes('competitions-empty-state'), 'Competitions error boundary uses dark glassmorphic container');
assert(calError.includes('competitions-empty-state'), 'Calendar error boundary uses dark glassmorphic container');

pass('Route-level error boundaries verified for both /competitions and /calendar');

console.log('\n================================================================');
console.log(`ALL ${checksPassed} INDEPENDENT INVARIANTS VERIFIED CLEANLY — NO DEFECTS FOUND`);
console.log('================================================================');
