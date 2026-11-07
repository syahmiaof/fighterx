# Athlete Portal Frontend Handoff

## Gate 1: Athlete Home

- Route: `/athlete`.
- This gate is limited to the athlete home dashboard. Training, Progress, and More remain unavailable and are not implemented routes.
- The dashboard currently uses a clearly marked, non-persistent preview adapter. Its sample profile and records are fictional UI data, not an authenticated account or club record.
- Empty assessment, competition, and announcement states are shown when no corresponding preview data is available; no performance score is fabricated.
- The route is a frontend preview only. It does not enforce authentication, athlete role, or club/organization isolation.

## Backend Dependencies

- Provide a server-verified session and role, then resolve the athlete's active organization membership on the server.
- Scope programme assignments, training submissions, verification records, assessments, competition entries, and announcements to that membership.
- Define authoritative status transitions, due-date/time-zone rules, recovery/rest/exemption records, and coach feedback.
- Replace the preview adapter with a typed authenticated service; never persist credentials or trust client-supplied role or organization identifiers.

## Review Boundary

Gate 2 (Training) and later athlete areas must wait for explicit Product Owner approval after Gate 1 review.
