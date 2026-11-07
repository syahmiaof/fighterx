# FighterX Page Consistency Rules

These rules apply to every page in the FighterX website. Treat them as persistent product requirements during new page work, redesigns, and refactors.

## Shared background

- Use the same FighterX wallpaper system across all pages: `/assets/fighterx/homepage-bg-desktop.webp` for desktop and `/assets/fighterx/homepage-bg-mobile.webp` for mobile.
- Preserve the responsive breakpoint behavior, background positioning, sizing, and dark overlays established by the homepage so the wallpaper remains legible behind page content.
- New pages should use the shared global background styles or a shared component/token. Do not introduce a different wallpaper, plain page canvas, or page-specific background treatment by default.

## Shared motion language

- Use the same restrained FighterX animation language across pages: short, purposeful entrance and interaction transitions, consistent easing and timing, and transform/opacity-based motion where practical.
- Respect `prefers-reduced-motion`; all content must remain visible and usable when motion is reduced or unavailable.
- Do not add a new animation style, continuous ambient effect, or page-specific motion pattern by default. Reuse the existing shared motion primitives and conventions.

## Exceptions and implementation

- Change the shared wallpaper or animation system only when Syahmi explicitly asks for that change. A page-specific request applies only to the page or element named; keep the shared system consistent everywhere else.
- Before adding a new page, inspect and reuse the existing global styles, shared layout/header, and motion utilities instead of recreating them locally.
- If a requested page needs a layout-specific treatment, keep its content layout distinct while retaining the shared wallpaper and motion language unless the user explicitly overrides either.
- When a shared system changes at the user's request, update this file and the implementation together so future pages follow the new direction.
