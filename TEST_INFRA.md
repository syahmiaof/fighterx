# FighterX Public Website Test Infrastructure & Methodology

## 1. Testing Philosophy & Architecture

The FighterX Public Website E2E test suite adheres to a rigorous **4-Tier Opaque-Box Testing Strategy** designed to validate functional requirements, contract invariants, boundary limits, cross-module integration, and end-to-end user journeys without coupling to transient UI rendering artifacts.

All tests are authored in pure TypeScript, execute in a lightweight Node.js/TSX runtime (`npx tsx`), and require zero heavyweight browser automation dependencies. Tests complete in **< 1.6 seconds** across all 30 test cases.

```
+-----------------------------------------------------------------------------------------+
|                    FIGHTERX 4-TIER OPAQUE-BOX TEST ARCHITECTURE                         |
+--------+-----------------------+--------------------------------------------------------+
| Tier   | Designation           | Scope & Verification Focus                             |
+--------+-----------------------+--------------------------------------------------------+
| Tier 1 | Feature Coverage      | Isolated verification of all inventoried public        |
|        | (11 Tests)            | features: Hero composition, Header navigation, Marquee,|
|        |                       | 26 Association Directory, PERSILAT 2026 scoring,       |
|        |                       | Penalties matrix, Jurus rubrics, Disciplines, and      |
|        |                       | 5-Step Club Registration validation.                   |
+--------+-----------------------+--------------------------------------------------------+
| Tier 2 | Boundary & Corner     | Extreme, adversarial, and boundary inputs: zero and    |
|        | (9 Tests)             | negative scores, 5-second grapple timeout rule, DQ     |
|        |                       | triggers, empty/special-char/XSS search queries, phone |
|        |                       | number formats, 5-digit poskod, 12-digit MyKad, and    |
|        |                       | 12-char password complexity rules.                     |
+--------+-----------------------+--------------------------------------------------------+
| Tier 3 | Cross-Feature         | Multi-component integration contracts: association    |
|        | (5 Tests)             | selector mapping to directory, navigation mesh, 5-step |
|        |                       | state persistence, rules vs. disciplines target zones, |
|        |                       | and shared wallpaper CSS token consistency.            |
+--------+-----------------------+--------------------------------------------------------+
| Tier 4 | Real-World Scenarios  | End-to-end simulated user journeys: complete club     |
|        | & Audit (5 Tests)     | coach onboarding, 3-round tournament bout scoring,     |
|        |                       | disqualification escalation, heritage exploration, and |
|        |                       | strict zero-regression portal isolation forensic audit.|
+--------+-----------------------+--------------------------------------------------------+
```

---

## 2. Authoritative Output Derivation Matrix

Every test case derives its expected output from authoritative source specifications:

| Test ID | Feature Under Test | Authoritative Source | Derived Invariant / Expected Output |
|---|---|---|---|
| `T1-FEAT-01` | Wallpaper System & CSS | `ORIGINAL_REQUEST.md` §R2, Follow-up 00:21:49Z | Desktop/mobile wallpapers exist, 72% opacity, `#08090B` base |
| `T1-FEAT-02` | Homepage Hero Composition | `PROJECT.md` M1, `ORIGINAL_REQUEST.md` §R2 | Bismillah calligraphy, `— THE SILAT ATHLETE PLATFORM —`, slanted headlines, `— "Semangat Juang. Jiwa Malaysia." —` quote, dual athletes, 4 feature strip cards |
| `T1-FEAT-03` | Association Logo Marquee | `PROJECT.md` M1, `ORIGINAL_REQUEST.md` §R2 | Infinite scrolling logo rail, PESAKA Malaysia highlight, link to `/associations` |
| `T1-FEAT-04` | SiteHeader Navigation | `PROJECT.md` M1, § Code Layout | Links to `/`, `/guidelines`, `/associations`, `/disciplines`, `/login`, `/register-club`, accessible mobile toggle |
| `T1-FEAT-05` | 26 Silat Association Registry | `research/silat-association-logos/README.md` | Exactly 26 associations across 4 categories: Badan Induk (4), Pengasas Teras (4), Perguruan Utama (9), Antarabangsa (9) |
| `T1-FEAT-06` | Association Search & Filter | `PROJECT.md` M2, § Interface Contracts | Case-insensitive query, filter by category, accurate category counts (`ALL: 26, BADAN_INDUK: 4, ...`) |
| `T1-FEAT-07` | PERSILAT 2026 Tanding Scoring | `survey_rules_disciplines.md` §2.1 | Pukulan = 1 pt, Tendangan = 2 pts, Jatuhan = 3 pts |
| `T1-FEAT-08` | Penalties & Disciplinary Matrix | `survey_rules_disciplines.md` §2.3 | Teguran 1 = -1 pt, Teguran 2 = -2 pts, Peringatan 1 = -5 pts, Peringatan 2 = -10 pts, Peringatan 3 / Direct DQ = DQ |
| `T1-FEAT-09` | Jurus / Seni Scoring Rubrics | `survey_rules_disciplines.md` §2.4 | Accuracy base, time deduction (-0.05 per 5s over/under 180s), weapon drop (-0.50), boundary exit (-0.05), movement fault (-0.01) |
| `T1-FEAT-10` | Disciplines Deep-Dive Presentation | `survey_rules_disciplines.md` §3 | Seni (Tunggal, Ganda, Regu, Solo Bebas), Olahraga (scoring zones: Dada, Abdomen, Rusuk, Belakang; forbidden: Kepala, Leher, Kemaluan; VAR protocol) |
| `T1-FEAT-11` | 5-Step Club Registration Validation | `PROJECT.md` § Interface Contracts (Contract 3) | 5-step form validation, ROS/SSM reg, MyKad 12 digits, Malaysian phone format, mock receipt `FX-APP-2026-XXXXX` |
| `T2-BOUND-01` | Zero & Negative Scoring Inputs | PERSILAT Mathematical Properties | Negative strike counts clamped to 0; zero strikes with penalties yield negative totalScore without exception |
| `T2-BOUND-02` | 5-Second Grapple Rule | `survey_rules_disciplines.md` §2.1 | Takedown <= 5.0s scores 3 pts; takedown > 5.0s yields 0 pts (referee commands "HENTI") |
| `T2-BOUND-03` | Disqualification Triggers | `survey_rules_disciplines.md` §2.3, §2.6 | Peringatan 3 triggers DQ; Direct DQ triggers DQ; zero weight tolerance weigh-in failure triggers DQ |
| `T2-BOUND-04` | Search Query Sanitization | Adversarial Security Practice | Empty/whitespace returns all 26; HTML/XSS and special symbols handled safely without crashing |
| `T2-BOUND-05` | Malaysian Phone Validation | Malaysian Telecommunications (MCMC) | `+60 1X-XXX XXXX` or `01X-XXXXXXXX` valid; landlines/foreign/short strings rejected |
| `T2-BOUND-06` | Poskod 5-Digit Boundary | Pos Malaysia Standard | Exactly 5 numeric digits valid; 4, 6 digits, or non-numeric rejected |
| `T2-BOUND-07` | MyKad & Passport Boundaries | National Registration Dept (JPN) | 12 numeric digits (with/without hyphens) valid; <6 or >15 alphanumeric rejected |
| `T2-BOUND-08` | Password Security Complexity | Security Best Practice | Min 12 chars with [A-Z], [a-z], [0-9], and symbol; weak/short passwords rejected |
| `T2-BOUND-09` | Jurus Deductions Step Invariant | PERSILAT 2026 Competition Rules | Net score cannot become negative; time penalty steps by 5 seconds |
| `T3-COMB-01` | Association Selector Mapping | `PROJECT.md` M4, § Interface Contracts | All 26 associations mapped in `SILAT_AFFILIATIONS` + `INDEPENDENT` (27 total) |
| `T3-COMB-02` | Public Navigation Mesh | `PROJECT.md` M1-M4 | Uniform route targets across Header, Hero, Marquee, and Pages |
| `T3-COMB-03` | Multi-Step State Persistence | `PROJECT.md` M4 | Steps 1-5 state accumulated cleanly without validation conflict; receipt reflects input values |
| `T3-COMB-04` | Disciplines & Rules Cross-Reference | Domain Invariant Consistency | Scoring zones, forbidden targets, and points match exactly between modules |
| `T3-COMB-05` | Shared Wallpaper Token Consistency | `ORIGINAL_REQUEST.md` §R2 | `homepage-bg-desktop.webp` & `mobile.webp`, 72% opacity, `#08090B` base across layouts |
| `T4-SCEN-01` | Club Coach Registration Journey | Real-World User Scenario | Full onboarding flow of Taiping coach with PSSGM affiliation; receives `FX-APP-2026-XXXXX` receipt |
| `T4-SCEN-02` | Tournament Referee Bout Scoring | Real-World Match Simulation | 3-round bout with strikes, grapple counter-takedown, Teguran 1, Peringatan 1 -> net 15 pts |
| `T4-SCEN-03` | Disqualification Flow | Real-World Disciplinary Scenario | Step-by-step foul escalation to Peringatan 3 DQ; direct DQ for neck slam |
| `T4-SCEN-04` | Heritage Exploration Journey | Real-World Practitioner Scenario | Student searches 4 founding pillars, founding masters (Meor Abdul Rahman, Omardin Mauju, Hanafi Ahmad, Anuar Abdul Wahab) |
| `T4-SCEN-05` | Strict Portal Isolation Audit | `ORIGINAL_REQUEST.md` §R1, Track Isolation | Zero modifications to Coach (`src/app/coach/**`), Athlete (`src/app/athlete/**`), Admin (`src/app/admin/**`); zero DB imports |

---

## 3. Directory Layout

```
tests/public/
├── types.ts               # Assertion primitives, ANSI color formatters, test definitions
├── tier1-features.ts      # Tier 1: Feature coverage unit tests (11 tests)
├── tier2-boundary.ts      # Tier 2: Boundary, corner, and adversarial stress tests (9 tests)
├── tier3-combinations.ts  # Tier 3: Cross-feature integration and state persistence (5 tests)
├── tier4-scenarios.ts     # Tier 4: End-to-end simulated user journeys & forensic audit (5 tests)
└── run-public-e2e.ts      # Master CLI test runner executable via npx tsx
```

---

## 4. Test Execution Commands

```bash
# Run the entire 4-tier test suite (30 tests)
npx tsx tests/public/run-public-e2e.ts

# Run an individual tier
npx tsx tests/public/run-public-e2e.ts --tier=1
npx tsx tests/public/run-public-e2e.ts --tier=2
npx tsx tests/public/run-public-e2e.ts --tier=3
npx tsx tests/public/run-public-e2e.ts --tier=4
```

---

## 5. Portal Isolation & Governance Safeguards

The test suite enforces non-negotiable architectural boundaries:
1. **Coach Portal Isolation**: Automated inspection guarantees zero commits or file edits in `src/app/coach/**`, `src/components/coach/**`, or `src/lib/coach/**`.
2. **Athlete Portal Isolation**: Automated inspection guarantees zero commits or file edits in `src/app/athlete/**`, `src/components/athlete/**`, or `src/lib/athlete/**`.
3. **Admin Portal Isolation**: Automated inspection guarantees zero commits or file edits in `src/app/admin/**`, `src/components/admin/**`, or `src/lib/admin/**`.
4. **Zero Backend Persistence**: Verified that no live database connections (`@supabase`, `pg`, `prisma`) are imported into public modules; all client interactions utilize typed mock adapters (`ui-only-adapter.ts`).
