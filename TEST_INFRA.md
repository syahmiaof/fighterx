# FighterX Coach Portal V1: Test Infrastructure (`TEST_INFRA.md`)

## 1. Overview & Philosophy

The FighterX Coach Portal V1 test suite is an **opaque-box, requirement-driven end-to-end (E2E) testing suite** designed to independently verify the complete functionality, interface contracts, responsive behaviors, SVG mathematics, reactive state operations, and Track A isolation boundaries specified in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Testing Tenets
1. **Opaque-Box Requirement-Driven**: Tests are derived strictly from documented requirements and mathematical specifications rather than internal implementation details.
2. **Deterministic & Self-Contained**: Every test sets up its own state in memory or isolated mock store, runs deterministically, and produces reproducible results.
3. **Progressive Testability**: The test suite can run at any milestone stage. Tests for upcoming milestones report pending status until corresponding modules are implemented, while foundational contracts and available modules are validated immediately.
4. **Zero-Dependency Vector Geometry**: Validates the custom SVG athlete consistency donut chart without requiring external charting packages.
5. **Strict Track A Boundary Enforcement**: Automated verification that Astra's athlete portal code (`src/app/athlete/**`, `src/components/athlete/**`, `src/lib/athlete/**`) remains completely untouched.

---

## 2. 4-Tier Test Architecture

```
+-----------------------------------------------------------------------------------+
| Tier 4: Real-World Coach Scenarios (End-to-End User Journeys)                     |
| - Morning verification triage (3 distinct outcomes: Verify, Correction, Reject)   |
| - Full physical & technical assessment with composite normative scoring           |
| - Competition squad roster selection with weight & readiness audit                |
| - Track A Isolation & Zero-Leakage Attestation                                    |
+-----------------------------------------------------------------------------------+
| Tier 3: Cross-Feature Combinations (Reactive State & Pairwise Propagation)        |
| - Review Submission -> KPI drop, queue count, and athlete profile sync            |
| - Assessment Registration -> Composite calculation & athlete record sync          |
| - Competition Roster Selection -> Squad count and weight validation               |
| - State Reset -> Full restoration to initial seed values                          |
+-----------------------------------------------------------------------------------+
| Tier 2: Boundary & Corner Cases (Extreme Values & Edge Conditions)                |
| - Empty state handling (0 pending submissions, 0 competitions)                    |
| - Zero athletes SVG donut math (division-by-zero protection, 0 Atlet label)       |
| - Zero search results on athletes directory and verification queue                |
| - Invalid submission transitions & out-of-range assessment metric bounds          |
| - Mobile viewport breakpoint (<= 760px) and 4-tab bottom navigation presence      |
| - Restrained motion & prefers-reduced-motion CSS clamp verification               |
+-----------------------------------------------------------------------------------+
| Tier 1: Feature Coverage (Modules A through F, Shell, & Contracts)                |
| - Module A: Dashboard (/coach, Hero, 4 KPIs, SVG Donut, Queue Preview, Actions)   |
| - Module B: Training Verification (/coach/verification, Queue, Filters, Review)   |
| - Module C: Athlete Management (/coach/athletes, Directory, Profile, History)     |
| - Module D: Assessments (/coach/assessments, Physical & Technical Rubrics)        |
| - Module E: Competitions (/coach/competitions, Calendar, Squad Roster)            |
| - Module F: Coach More & Profile (/coach/more, /coach/profile, Reset Demo State)  |
| - App Shell: Layout, Header, Desktop Sidebar (8 items), Mobile 4-Tab Bottom Nav   |
| - Contracts & Store: types.ts, mock-data.ts, store.tsx, adapter.ts                |
+-----------------------------------------------------------------------------------+
```

---

## 3. Directory Layout

All tests are placed within `tests/coach/` to avoid polluting production build targets:

```
tests/coach/
├── types.ts                    # Assertion utilities, color formatters, test interfaces
├── tier1-features.ts           # Tier 1: Feature Coverage (Modules A-F, Contracts, UI)
├── tier2-boundary.ts           # Tier 2: Boundary & Corner Cases (Empty states, Math, Media queries)
├── tier3-combinations.ts       # Tier 3: Pairwise & Reactive State Propagation
├── tier4-scenarios.ts          # Tier 4: Real-World Coach Journeys & Isolation Audit
└── run-coach-e2e.ts            # Unified Master CLI Runner
```

---

## 4. How to Run the Tests

The test suite runs directly in the Node.js / TypeScript environment via `npx tsx` without compiling build artifacts:

### Run Full Test Suite (All Tiers)
```bash
npx tsx tests/coach/run-coach-e2e.ts
```

### Run Specific Tiers
```bash
npx tsx tests/coach/run-coach-e2e.ts --tier=1
npx tsx tests/coach/run-coach-e2e.ts --tier=2
npx tsx tests/coach/run-coach-e2e.ts --tier=3
npx tsx tests/coach/run-coach-e2e.ts --tier=4
```

### Verbose Mode
```bash
npx tsx tests/coach/run-coach-e2e.ts --verbose
```

---

## 5. Expected Output Derivation Matrix

Every assertion is derived from authoritative specifications in `ORIGINAL_REQUEST.md` and `PROJECT.md`:

| Requirement | Test Subject | Expected Authoritative Value / Behavior | Source Document |
|-------------|--------------|-----------------------------------------|-----------------|
| R1 / Mod A | Dashboard KPIs | `totalAthletes: 28`, `pendingVerifications: 12`, `verifiedThisWeekRate: 76%`, `upcomingCompetitionsCount: 2` | `PROJECT.md` § Feature 13 |
| R1 / Mod A | SVG Donut Math | 28 athletes: 17 Konsisten (61%), 7 Sederhana (25%), 4 Perlu Perhatian (14%). Segments sum to 100%. Arc angles sum to $360^\circ$. | `survey_design_specs.md` § 7.2 |
| R1 / Mod A | Donut Center | Displays text `28` and `Atlet`. Renders without external charting library dependencies. | `ORIGINAL_REQUEST.md` § R1 |
| R1 / Mod B | Verification Queue | 12 initial pending items. Top 4: Aiman Hakim (Push-up), Nur Alya (Larian 6 Minit), Faiz Irfan (Plank), Siti Humaira (Knee to Wall). | `survey_modules_contracts.md` § 3 |
| R1 / Mod B | Review Action | Status update to `VERIFIED`, `CORRECTION`, or `REJECTED`. Feedback recorded. Decrements pending queue counter. | `PROJECT.md` § Feature 22-23 |
| R1 / Mod C | Athletes Directory | 28 athletes. Filterable by `Silat Seni` (12) and `Silat Olahraga` (16). Search by name. | `PROJECT.md` § Feature 24 |
| R1 / Mod D | Assessment Rubrics | 4 physical metrics (6-min run, push-ups, plank, knee-to-wall) + 4 technical metrics per discipline. Computed rating. | `PROJECT.md` § Feature 27 |
| R1 / Mod E | Competition Hub | Classifications: `Major`, `Development`, `Exposure`. Squad roster selection with weight & readiness status. | `PROJECT.md` § Feature 28-29 |
| R1 / Mod F | Coach More & Reset | Hub with navigation links, profile credentials, and `resetDemoState()` restoring initial seed. | `PROJECT.md` § Feature 30-31 |
| R3 / Shell | App Shell Layout | Root layout in `src/app/coach/layout.tsx` with header, desktop sidebar (>=1121px), and mobile bottom nav (<=760px). | `PROJECT.md` § Feature 7-10 |
| R3 / Nav | Mobile 4-Tab Bar | Exactly 4 tabs: `Dashboard`, `Verifikasi` [badge 12], `Atlet`, `More`. Active tab indicator present. | `ORIGINAL_REQUEST.md` § R3 |
| R3 / CSS | Motion Tokens | Transitions 180ms-280ms. Clamped to 0.01ms / 0s when `prefers-reduced-motion: reduce`. | `survey_design_specs.md` § 8 |
| R3 / Isolation | Track A Isolation | Zero modifications to `src/app/athlete/**`, `src/components/athlete/**`, `src/lib/athlete/**`. No cross-track imports. | `ORIGINAL_REQUEST.md` § R3 |

---

## 6. Exit Codes & CI Integration

- **Exit Code 0**: All executed tests passed cleanly.
- **Exit Code 1**: One or more assertions failed or an unexpected unhandled exception occurred.
- Outputs clean ANSI-colored execution logs with timestamped milestones, timing breakdowns, and detailed assertion failure context.
