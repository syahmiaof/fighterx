import assert from 'node:assert';

console.log('--- RUNNING RIGOROUS E2E LIVE SERVER VALIDATION (PORT 3005) ---');

async function testRoutes() {
  // 1. Validate /competitions
  const compRes = await fetch('http://localhost:3005/competitions');
  assert.strictEqual(compRes.status, 200, '/competitions must return 200');
  const compHtml = await compRes.text();

  assert(compHtml.includes('comp-glass-card'), 'comp-glass-card must be rendered in /competitions');
  assert(compHtml.includes('comp-tier-badge'), 'comp-tier-badge must be rendered in /competitions');
  assert(compHtml.includes('comp-status-badge'), 'comp-status-badge must be rendered in /competitions');
  assert(!compHtml.includes('btn-action-whatsapp'), 'No WhatsApp button on competition cards in /competitions');
  assert(!compHtml.includes('slot-mini-progress'), 'No progress bar bloat in /competitions');

  // Check phone numbers inside card section
  const cardsStart = compHtml.indexOf('pro-events-feed');
  const cardsEnd = compHtml.indexOf('pro-modal-container');
  if (cardsStart !== -1 && cardsEnd !== -1) {
    const cardSection = compHtml.substring(cardsStart, cardsEnd);
    assert(!cardSection.includes('+60'), 'No organizer phone numbers rendered in card feed');
    assert(!cardSection.includes('012-'), 'No phone prefixes in card feed');
    assert(!cardSection.includes('013-'), 'No phone prefixes in card feed');
  }

  // 2. Validate /calendar
  const calRes = await fetch('http://localhost:3005/calendar');
  assert.strictEqual(calRes.status, 200, '/calendar must return 200');
  const calHtml = await calRes.text();

  assert(calHtml.includes('comp-glass-card'), 'comp-glass-card must be rendered in /calendar');
  assert(!calHtml.includes('btn-action-whatsapp'), 'No WhatsApp button in /calendar');
  assert(!calHtml.includes('slot-mini-progress'), 'No progress bar bloat in /calendar');

  // 3. Validate Bulletin & Poster External URLs
  const { INITIAL_COMPETITIONS, getPosterOrBulletin, isValidDocumentUrl } = await import(
    '../src/components/competitions/competitions-data.ts'
  );

  let verifiedUrls = 0;
  for (const comp of INITIAL_COMPETITIONS) {
    const res = getPosterOrBulletin(comp);
    if (res) {
      assert(isValidDocumentUrl(res.url), `URL for ${comp.id} must be valid document URL: ${res.url}`);
      assert(res.url.startsWith('https://'), `URL for ${comp.id} must use secure HTTPS protocol`);
      verifiedUrls++;
    }
  }
  assert.strictEqual(verifiedUrls, 10, 'Expected 10 tournaments with direct external documents');

  console.log(`Successfully verified ${verifiedUrls} secure HTTPS document links.`);
  console.log('--- ALL E2E LIVE SERVER CHECKS PASSED CLEANLY ---');
}

testRoutes().catch((err) => {
  console.error('E2E validation failed:', err);
  process.exit(1);
});
