# FIGHTERX — Visual Assets V1

These assets are for the selected Silat-only FighterX homepage direction.

## Characters
- `character-duo-hero-transparent.png`: combined Silat Seni male + Silat Olahraga female cutout with alpha. Position above hero background, right or center.
- `character-silat-seni-transparent.png`: male athlete, cutout with transparent alpha.
- `character-silat-olahraga-transparent.png`: female athlete with black hijab and red protection, cutout with transparent alpha.

## Backgrounds
- `bg-hero-desktop.webp` / `bg-hero-mobile.webp`: dark charcoal and crimson cinematic angular backgrounds without text.
- `bg-smoke-crimson.webp`, `bg-silat-mountains.webp`, `bg-fx-angular.webp`, `bg-arena.webp`: alternate thematic backgrounds extracted from generated art reference.
- `bg-section-angled.webp`: section background.

## Transparent UI layers
- `overlay-red-smoke-transparent.png`: atmospheric crimson cloud overlay.
- `overlay-diagonal-slashes-transparent.png`: sports-tech angular lines.
- `overlay-corner-red-transparent.png`: bottom-right background slash.

## Textures and references
- `texture-malay-heritage.webp`, `texture-tenun-gold.webp`, `texture-black-fabric.webp`, `texture-carbon-fiber.webp`
- `homepage-selected-reference.webp`: user-selected homepage mockup for layout/visual inspiration.
- `brand-logo-reference-crop.png`: visual reference only; use the exact official logo supplied separately wherever available.

## Agent IDE usage
Copy this directory to `/public/assets/fighterx/` in Next.js. Preserve the existing functionality, auth, database, routes, and API wiring while redesigning the homepage. Build hero from independently positioned layers, not the full reference screenshot. Use `object-fit:contain` on athlete assets, add a dark gradient under hero copy, and use mobile-specific composition. Keep performance in mind with lazy loading below the fold.

## Brand tokens
Background #08090C, panels #17191E, primary red #E10600, red accent #FF3845, silver #E5E7EB, text white #FFFFFF. These are suggestions to adjust against the official logo.

## Important
Cutouts were algorithmically extracted from generated asset sheets and may need edge cleanup in high-contrast displays. Do not imply the generated textures are an authentic historic Malay textile pattern. Do not treat decorative imagery as sport/rule evidence.

## Silhouette layers
- `silhouette-silat-kick-transparent.png`, `silhouette-silat-stance-transparent.png`, `silhouette-silat-technique-transparent.png`, `silhouette-silat-action-transparent.png`, `silhouette-silat-sparring-transparent.png`: white action silhouettes with real alpha for cards, decor and section dividers.
