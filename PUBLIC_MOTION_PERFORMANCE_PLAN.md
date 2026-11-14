# FighterX Public Website — Motion, UX & Performance Plan

**Status:** Phase 1 audit and proposal only. No application code, styles, dependencies, routes, or assets were changed. No build/test run was requested or performed. Scope excludes Login, Register Club, My Club, Athlete, Coach, and Admin.

## A. Public pages discovered

- `/` — Homepage
- `/guidelines` — competition rules guide
- `/disciplines` — Silat Seni / Silat Olahraga
- `/competitions` — calendar, competition discovery, and related forms
- `/calendar` — separate route; inspect before consolidating or redirecting
- `/leaderboard` — rankings and details
- `/associations` — association directory and detail modal
- `/moments` — photo and moment feed
- `/knowledge` and `/knowledge/[slug]` — sport-science hub and articles
- `/collaboration` and `/knowledge-hub` are alias/redirect routes, not unique page experiences.

The route tree also contains protected modules; they are intentionally excluded from this proposal.

## B–C. Motion direction, by page and section

Keep the established FighterX language: restrained, short transitions; transform/opacity first; a single reveal per section; no scroll-jacking or animation that delays navigation. Every route should inherit the shared wallpaper and reduced-motion behavior in `rules.md`.

| Page / section | Motion with a distinct purpose |
|---|---|
| **Homepage — hero** | Keep the current authored headline/athlete entrance as the signature sequence. Ensure text and both athlete cutouts resolve together, with a shorter or absent sequence on small screens. Avoid adding a second glow/line effect. |
| **Homepage — workflow / programme highlights** | Reveal each workflow step as one small group; programme cards enter in a compact stagger. Use one-time triggers, without blurring text or replaying on scroll reversal. |
| **Homepage — association strip / athlete spotlight / FAQ / footer** | Keep logo strip motion calm and pausable; spotlight can use a simple image/text handoff; FAQ uses short state feedback only. Avoid running multiple independent loops simultaneously. |
| **Guidelines — intro / metadata** | Preserve the current brief title entrance. Keep rules, scoring and cautions immediately readable; use small one-time section markers only, never animate rule text word-by-word. |
| **Guidelines — scoring / penalties / match flow** | Use a static score comparison and a compact left-to-right match sequence. Animate only an entered step or changed penalty value, not the entire rules page. |
| **Disciplines — Seni / Olahraga** | Treat each discipline as a contrasting, paired reveal: Seni’s controlled form first, Olahraga’s exchange second. Keep the comparison matrix visible and stable. Equipment rows can reveal as grouped sets. |
| **Competitions / Calendar — filters and results** | Animate only the results region when the selected period/filter changes; keep filters responsive and do not replay cards on every keystroke. A month timeline can reveal in chronological groups. |
| **Leaderboard — rankings / detail** | Settle rank bars/markers once on entry. Keep sorting, tabs and comparison data immediate; detail panels can use a short opacity/translate transition. |
| **Associations — search / directory / modal** | Move result rows subtly when filtering; use a short opacity/vertical modal entrance. Preserve focus, keyboard dismissal, and avoid scaling many logos. |
| **Moments — hero / feed / lightbox** | Keep the hero photo-led and visually distinct from the homepage’s word-split intro. Reveal feed batches only as they enter; no autoplay. A shared-image lightbox transition is optional only if keyboard/focus behavior remains intact. |
| **Knowledge — hub / article / calculators** | Let article sections enter as readable blocks. Animate only a result value when its input changes; keep tables and scientific explanations still. |

## D. Performance findings and evidence

**Confirmed from source:**

- Homepage motion is concentrated in `src/components/homepage/home-page.tsx` and uses GSAP, `useGSAP`, `ScrollTrigger`, and `gsap.matchMedia()`. Several below-fold images are marked `priority` in the same file (hero smoke, athlete cutouts, calligraphy); this can compete with the actual above-fold hero for early loading.
- `src/app/globals.css` runs `.hero-smoke` continuously for 48 seconds and several homepage background layers for 54 seconds. This conflicts with `DESIGN.md` (“avoid continuous ambient loops”) and `rules.md` (“do not add continuous ambient effect by default”). Reduced-motion currently forces every animation to `.01ms` and one iteration globally; prefer an explicit settled/static presentation for ambient layers.
- Homepage GSAP sequences animate text with blur/clip/3D transforms in addition to opacity/transform. That broadens paint/compositing work; actual frame cost was not measured.
- Large client boundaries exist: `knowledge-hub-client.tsx` (~73 KB source) and `competitions-client.tsx` (~62 KB source). This identifies candidates for code-splitting, not a measured shipped bundle bottleneck.
- Source image files include programme cutouts around 2.15 MB and 1.28 MB, hero cutouts around 1.76 MB and 1.00 MB, and smoke art around 270 KB. These are source-file sizes; optimized network transfer sizes were not established.
- `transition: all` appears in global CSS; narrow these to the actual changing properties to avoid accidental animation of layout-affecting properties.

**Observed in controlled local browser replay:**

- Homepage and `/disciplines` loaded in isolated Chromium/Edge at desktop and narrow-mobile widths. The 320px `/disciplines` screenshot showed the mobile header, hero and both discipline cards fitting the viewport without visible horizontal overflow in the captured top view. It does not prove every lower section or every target width is clean.
- Local development console reported repeated `/_next/hmr` WebSocket handshake failures (`ERR_INVALID_HTTP_RESPONSE`). This is a dev-server/HMR observation, not evidence of a production failure.
- Browser captures recorded roughly 54–55 requests for the captured homepage window. Because the run is against the development server and retained response sizes/initiators were not available, this count is context only, not a production network budget.

**Not confirmed:** route-transition latency, production JS transfer size, image transfer size after Next optimization, Web Vitals, rerender frequency, long tasks, frame rate, and low-end-device GPU cost. No production build/profile was run; don’t treat the source-level risks above as measured regressions.

## E. Responsive audit findings

- Captured `/disciplines` at 320px: the mobile composition is intentional and top-level content fits; continue checking below-fold matrices, equipment filters and controls. Source shows non-wrapping filter groups in `category-comparison-matrix.tsx` and `equipment-breakdown.tsx`, which may clip at 320px; this remains a hypothesis until their scrolled bounds are measured.
- Captures at 360px and 390px were used for page-load observation; no geometry/screenshot comparison was retained, so no stronger pass claim is made.
- 430px, 768px, 1024px and 1440px were not exhaustively inspected across every route. The approved desktop layout is therefore not certified by this planning pass.
- Follow-up must use exact widths 320, 360, 390, 430, 768, 1024 and 1440 on each public route. Record horizontal scroll width, clipped text, card intersections, sticky/header behavior, touch target bounds and reduced-motion rendering. Test a representative long page plus every route-specific modal/filter state without conflating this audit with Antigravity’s button/functionality sweep.

## F. Fixes ranked by impact

1. **High — prioritize only true hero assets.** Remove eager priority from below-fold artwork; preserve priority for the actual LCP asset. Verify transfer sizes and LCP in a production build before selecting formats/quality.
2. **High — stop redundant ambient animation.** Align smoke/background motion with `DESIGN.md` and `rules.md`; keep a static premium layer by default and make reduced-motion fully settled. Only retain continuous drift if owner explicitly confirms the earlier smoke request remains an exception.
3. **High — narrow responsive filter overflow.** At 320–390px, allow filter wrapping/scroll affordance or a compact select where justified; verify the comparison matrix remains legible.
4. **Medium — measure client JS before splitting.** Profile navigation and route chunks; lazy-load isolated heavy article/calculator/competition tools only if the measurement shows a route cost and the interaction remains immediate.
5. **Medium — trim paint-heavy choreography.** Prefer translate/opacity; reserve blur/clip-path/3D transforms for one focal hero beat. Avoid `will-change` as a permanent blanket.
6. **Medium — replace broad `transition: all`.** Transition only the named visual properties and keep input/navigation feedback short.
7. **Low — establish section reveal consistency.** Share timing/easing and cleanup helpers after route-specific concepts are approved; avoid turning every card into the same fade-up.

## G. Performance and accessibility safeguards

- `useGSAP` scoped to component refs; use `gsap.matchMedia()` for reduced motion and breakpoint branches; clean up/revert on route change/unmount.
- Keep semantic text visible before/without JS; do not make route navigation wait for an entrance animation.
- `prefers-reduced-motion: reduce` should disable parallax, ambient loops and large translations while preserving state and content.
- Trigger long-page reveals once; animate transform/opacity; avoid layout reads/writes in loops, excessive blur, pinned scroll sections, and global `will-change`.
- Test keyboard focus, tab order, modal focus containment/return, escape dismissal and touch targets independently from visual animation timing.

## H. Expected implementation files (after approval)

- `src/components/homepage/home-page.tsx` and homepage section components only for approved public-page choreography.
- `src/components/guidelines/guidelines-motion.tsx` and public guidelines components.
- Route-owned components under `src/components/disciplines/`, `competitions/`, `leaderboard/`, `associations/`, `moments/`, and `knowledge/` where motion is justified.
- `src/app/globals.css` only for shared public motion primitives and the identified public background loops/transition rules.
- `rules.md` / `DESIGN.md` only if the owner approves changing the shared motion policy; current plan recommends following the existing no-loop rules.
- No edits to Login, Register Club, My Club or any role portal.

## I. QA and regression strategy

1. Capture before-state desktop reference and screenshots for all seven requested widths; use identical routes/content and preserve the approved desktop composition.
2. Run production build and type checks; inspect route-specific chunks and optimized image requests.
3. Compare route transition start-to-interactive timing, LCP/CLS/INP where available, request counts/bytes, long tasks and animation frame drops before/after. Report the exact browser/device and whether the result is dev or production.
4. Re-run all public routes at 320/360/390/430/768/1024/1440; record overflow and screenshot evidence. Include reduced-motion and keyboard/focus passes.
5. Keep functional button coverage owned by the separate Antigravity QA worktree; merge findings without overlapping code edits.

## J. Risks and integration

- The protected public branch is shared with parallel QA activity. Changes must stay in `feature/public-ui-polish`; coordinate before implementation and do not cherry-pick button-audit edits blindly.
- `rules.md` disallows new page-specific/continuous motion by default, while the older request asked for visible smoke. Resolve that policy explicitly before changing shared background behavior; the current proposal treats the newer persistent rule as controlling.
- Global reduced-motion CSS affects the entire site. Avoid broad edits that could change protected pages; scope any approved implementation to public selectors.
- Dev HMR failures contaminate dev timing; use a production build for reliable navigation/performance conclusions.
- Large image files may already be transformed by Next at delivery. Measure the actual response before recompressing or replacing approved art.

## Approval gate

This is the proposal only. No code was changed and no packages were installed. Wait for explicit Product Owner approval before implementation.

## References

- GSAP React integration: https://gsap.com/resources/React/
- `gsap.matchMedia()`: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Project policy: `rules.md`, `DESIGN.md`
