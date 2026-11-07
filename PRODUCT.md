# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React, Supabase PostgreSQL/Auth/Storage. Chosen from the Product Owner's recommended stack.

## Users

- Silat athletes who need to follow assigned programmes, submit training results and evidence, and understand their verified progress.
- Coaches who review evidence, give feedback, assess assigned athletes, and recommend adjustments within the centrally owned master programme.
- Platform administrators who manage organizations, people, programmes, assignments, assessments, competitions, and knowledge content.
- Clubs evaluating the platform and deciding whether to register.

## Product Purpose

FighterX is a training, management, and performance analytics platform for Silat Seni and Silat Olahraga. Success means clubs can run structured training workflows and athletes can complete and verify training with less coordination overhead.

## Positioning

FighterX connects centrally structured Silat programmes to athlete submissions, coach verification, and performance tracking in one workflow.

## Operating Context

Athletes commonly use phones around training sessions. Coaches review submissions and give feedback. Administrators own the master programme and platform records. Roles are exactly ADMIN, COACH, and ATHLETE.

## Capabilities and Constraints

- Confirmed V1 scope: training management, evidence submission, coach verification, baseline assessment, analytics, competitions, gamification, achievements, weekly top 10, Knowledge Hub, and Lekir Bot.
- Discipline is Silat Seni or Silat Olahraga.
- Admin owns the Master Training Programme; coaches do not have unrestricted programme-edit rights.
- Lekir Bot cannot grant medical clearance, prescribe unsafe loads, or expose data outside the user's authorization.
- Competition rules must carry a governing source, version, effective date, review status, and official document. Unverified rules and scientific prescriptions must not be invented.
- Club fees/payment examples in visual references do not authorize building a finance system.
- Supabase credentials and live services are not present in this workspace yet. Authentication, persistence, and uploads must remain clearly unconfigured until connected.

## Brand Commitments

- Name: FIGHTERX.
- Brand line: TRAIN SMARTER. FIGHT STRONGER.
- The approved visual references and supplied assets in `FighterX_Visual_Assets_V1/` are binding visual source material.
- Preserve the official logo artwork. No standalone official logo file is present; do not invent a replacement mark.

## Evidence on Hand

- Homepage reference: `FighterX_ Train Smarter, Fight Stronger.png` (1448 × 1086) and selected asset reference `FighterX_Visual_Assets_V1/homepage-selected-reference.webp` (1280 × 852).
- Athlete reference: `FighterX Silat Athlete Dashboard.png` (1536 × 1024).
- Coach reference: `FighterX Coach Dashboard Overview.png` (1536 × 1024).
- Admin reference: `FighterX Malay Admin Dashboard.png` (1536 × 1024).
- Silat character cutouts, dark/crimson backplates, transparent red smoke, slash overlays, and Malay-inspired textures are supplied in `FighterX_Visual_Assets_V1/`.
- No verified customer outcomes, athlete performance dataset, legal rules library, or production credentials were supplied. Do not fabricate them.

## Product Principles

- Make the athlete's next training action obvious.
- Keep athlete data limited to authorized relationships.
- Treat verification as the boundary between a submission and a confirmed performance record.
- Keep programme ownership centralized and changes reviewable.
- Label demonstrations and unconfigured integrations honestly.

## Accessibility & Inclusion

The web app must support keyboard navigation, readable contrast, reduced motion, responsive touch targets, and mobile use during training. Silat Olahraga imagery and copy should represent hijab-wearing athletes respectfully.
