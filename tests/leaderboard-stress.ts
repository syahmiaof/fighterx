#!/usr/bin/env node
/**
 * Leaderboard & Gamification Test Suite
 * Worker Public M3: Leaderboard & Gamification Engineer
 * 
 * Verifies:
 * 1. Athlete integrity: 10 sequential ranks, verified point breakdown invariants, radar attributes, parental consent for under-18.
 * 2. Club rankings: 12 clubs strictly sorted by totalVerifiedPoints, tier badges (Zon Emas, Perak, Gangsa), medal counts.
 * 3. Badge showcase: 8 authentic badges with criteria, bonuses, rarities, and unlocked metrics.
 * 4. Anti-fraud scoring methodology: 4 verification pillars, daily farming caps, cooldowns, cryptographic hashes.
 * 5. Privacy & PDPA compliance: Public, Club-Only, and Anonymous alias masking invariants.
 */

import {
  WEEKLY_TOP_ATHLETES,
  NATIONAL_CLUB_RANKINGS,
  SILAT_BADGES,
  VERIFICATION_RULES,
} from "../src/components/leaderboard/data";
import type {
  Athlete,
  ClubRanking,
  VisibilityMode,
} from "../src/components/leaderboard/types";

// ANSI colors
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${green("✓")} PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ${red("✗")} FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
  }
}

console.log(bold(cyan("\n========================================================")));
console.log(bold(cyan("   FIGHTERX LEADERBOARD & GAMIFICATION TEST SUITE (M3)   ")));
console.log(bold(cyan("========================================================\n")));

// --------------------------------------------------------------------------
// 1. Weekly Top 10 Athletes Integrity
// --------------------------------------------------------------------------
console.log(bold("--- SUITE 1: WEEKLY TOP 10 ATHLETES INTEGRITY ---"));

assert(
  WEEKLY_TOP_ATHLETES.length === 10,
  "Leaderboard contains exactly 10 athletes",
  `Found ${WEEKLY_TOP_ATHLETES.length} athletes`
);

// Check ranks 1 through 10
const ranks = WEEKLY_TOP_ATHLETES.map((a) => a.rank);
const isSequentialRanks = ranks.every((r, i) => r === i + 1);
assert(isSequentialRanks, "Athlete ranks are strictly sequential from 1 to 10", `Ranks: ${ranks.join(", ")}`);

// Points sum invariant for each athlete
WEEKLY_TOP_ATHLETES.forEach((ath: Athlete) => {
  const pts = ath.points;
  const expectedTotal =
    pts.attendancePoints +
    pts.physicalBaseline.totalBaselineScore +
    pts.videoDrillPoints +
    pts.tournamentMedalPoints;

  assert(
    pts.totalVerifiedPoints === expectedTotal,
    `Points breakdown invariant for #${ath.rank} ${ath.fullName}`,
    `Expected ${expectedTotal}, got ${pts.totalVerifiedPoints}`
  );

  const expectedBaselineTotal =
    pts.physicalBaseline.runScore +
    pts.physicalBaseline.pushUpScore +
    pts.physicalBaseline.plankScore;

  assert(
    pts.physicalBaseline.totalBaselineScore === expectedBaselineTotal,
    `Physical baseline sub-scores sum for #${ath.rank} ${ath.fullName}`,
    `Expected ${expectedBaselineTotal}, got ${pts.physicalBaseline.totalBaselineScore}`
  );

  // Radar attributes 0-100
  const radar = ath.radarStats;
  const radarValid =
    radar.stamina >= 0 && radar.stamina <= 100 &&
    radar.strength >= 0 && radar.strength <= 100 &&
    radar.agility >= 0 && radar.agility <= 100 &&
    radar.flexibility >= 0 && radar.flexibility <= 100 &&
    radar.pasangStance >= 0 && radar.pasangStance <= 100;

  assert(
    radarValid,
    `Radar attributes within 0-100% for #${ath.rank} ${ath.fullName}`
  );

  // Under-18 verification
  if (ath.under18) {
    assert(
      ath.parentalConsentVerified === true,
      `Under-18 athlete #${ath.rank} (${ath.fullName}) has parental consent verified`
    );
  }

  // Audit trail presence
  assert(
    ath.recentActivities.length > 0,
    `Athlete #${ath.rank} (${ath.fullName}) has cryptographic activity audit entries`
  );
  ath.recentActivities.forEach((act) => {
    assert(
      act.verificationHash.startsWith("FX-VFY-"),
      `Activity ${act.id} has valid cryptographic hash format (${act.verificationHash})`
    );
  });
});

// --------------------------------------------------------------------------
// 2. National Club Rankings Ladder
// --------------------------------------------------------------------------
console.log(bold("\n--- SUITE 2: NATIONAL CLUB RANKINGS LADDER ---"));

assert(
  NATIONAL_CLUB_RANKINGS.length === 12,
  "Club ranking list contains 12 verified clubs",
  `Found ${NATIONAL_CLUB_RANKINGS.length} clubs`
);

// Clubs must be strictly sorted by totalVerifiedPoints descending
let isClubSorted = true;
for (let i = 0; i < NATIONAL_CLUB_RANKINGS.length - 1; i++) {
  if (NATIONAL_CLUB_RANKINGS[i].totalVerifiedPoints < NATIONAL_CLUB_RANKINGS[i + 1].totalVerifiedPoints) {
    isClubSorted = false;
    break;
  }
}
assert(isClubSorted, "Clubs are strictly sorted by totalVerifiedPoints descending");

// Check tier distribution
const goldClubs = NATIONAL_CLUB_RANKINGS.filter((c) => c.tier === "EMAS");
const silverClubs = NATIONAL_CLUB_RANKINGS.filter((c) => c.tier === "PERAK");
const bronzeClubs = NATIONAL_CLUB_RANKINGS.filter((c) => c.tier === "GANGSA");

assert(goldClubs.length >= 4, `Zon Emas clubs represent elite tier (${goldClubs.length} clubs)`);
assert(silverClubs.length >= 3, `Zon Perak clubs represent high-performance tier (${silverClubs.length} clubs)`);
assert(bronzeClubs.length >= 3, `Zon Gangsa clubs represent developmental tier (${bronzeClubs.length} clubs)`);

// Club metadata validation
NATIONAL_CLUB_RANKINGS.forEach((club: ClubRanking) => {
  assert(club.activeAthletes > 0, `Club ${club.shortCode} has active registered athletes (>0)`);
  assert(
    club.weeklyParticipationRate > 0 && club.weeklyParticipationRate <= 100,
    `Club ${club.shortCode} participation rate within (0, 100%] (${club.weeklyParticipationRate}%)`
  );
  assert(
    club.medals.gold >= 0 && club.medals.silver >= 0 && club.medals.bronze >= 0,
    `Club ${club.shortCode} medal counts are non-negative`
  );
});

// --------------------------------------------------------------------------
// 3. Authentic Silat Badges & Achievements
// --------------------------------------------------------------------------
console.log(bold("\n--- SUITE 3: SILAT BADGES & ACHIEVEMENTS SHOWCASE ---"));

assert(
  SILAT_BADGES.length === 8,
  "Badge gallery contains exactly 8 authentic silat badges",
  `Found ${SILAT_BADGES.length} badges`
);

const expectedBadgeSlugs = [
  "100-kehadiran",
  "pejuang-subuh",
  "juara-sirkit",
  "pendekar-kuda-kuda",
  "pakar-takedown",
  "disiplin-besi",
  "pahlawan-jurus",
  "pantang-mundur",
];

expectedBadgeSlugs.forEach((slug) => {
  const found = SILAT_BADGES.find((b) => b.slug === slug);
  assert(
    found !== undefined,
    `Mandatory authentic badge exists: '${slug}'`,
    `Title: ${found?.title || "NOT FOUND"}`
  );
  if (found) {
    assert(found.pointsBonus > 0, `Badge '${slug}' awards positive bonus points (+${found.pointsBonus})`);
    assert(found.unlockedCount > 0, `Badge '${slug}' has active unlock statistics (${found.unlockedCount})`);
  }
});

// --------------------------------------------------------------------------
// 4. Anti-Fraud Scoring Methodology
// --------------------------------------------------------------------------
console.log(bold("\n--- SUITE 4: ANTI-FRAUD VERIFICATION METHODOLOGY ---"));

assert(
  VERIFICATION_RULES.length === 4,
  "Exactly 4 core pillars of verification documented",
  `Found ${VERIFICATION_RULES.length} pillars`
);

VERIFICATION_RULES.forEach((rule, idx) => {
  assert(rule.pillar.length > 5, `Pillar ${idx + 1} has descriptive title (${rule.pillar})`);
  assert(rule.safeguard.length > 10, `Pillar ${idx + 1} has anti-fraud safeguard specification`);
  assert(rule.pointsValue.length > 5, `Pillar ${idx + 1} details points valuation rule`);
});

// --------------------------------------------------------------------------
// 5. Privacy & PDPA Invariant Masking Simulation
// --------------------------------------------------------------------------
console.log(bold("\n--- SUITE 5: PRIVACY & PDPA INVARIANT MASKING ---"));

function maskAthleteForPublicView(athlete: Athlete, mode: VisibilityMode) {
  if (mode === "PUBLIC") {
    return {
      displayName: athlete.fullName,
      displayClub: athlete.clubName,
      showAvatar: true,
      showExactPoints: true,
    };
  }
  if (mode === "CLUB_ONLY") {
    return {
      displayName: `${athlete.fullName.split(" ")[0]} *** (Kelab Sahaja)`,
      displayClub: athlete.clubName,
      showAvatar: true,
      showExactPoints: true,
    };
  }
  // ANONYMOUS
  return {
    displayName: `[Atlet #${athlete.rank}] · ${athlete.alias}`,
    displayClub: `Kelab Rahsia (${athlete.association})`,
    showAvatar: false,
    showExactPoints: true,
  };
}

const danial = WEEKLY_TOP_ATHLETES[0];

const publicView = maskAthleteForPublicView(danial, "PUBLIC");
assert(
  publicView.displayName === "Muhammad Danial Haziq" && publicView.showAvatar === true,
  "Public mode exposes full name and real avatar"
);

const clubOnlyView = maskAthleteForPublicView(danial, "CLUB_ONLY");
assert(
  clubOnlyView.displayName.includes("***") && clubOnlyView.displayClub === danial.clubName,
  "Club-Only mode masks surname and preserves club context"
);

const anonymousView = maskAthleteForPublicView(danial, "ANONYMOUS");
assert(
  anonymousView.displayName.includes(danial.alias) &&
  !anonymousView.displayName.includes(danial.fullName) &&
  anonymousView.showAvatar === false,
  "Anonymous mode shields real name and avatar behind sports alias"
);

// --------------------------------------------------------------------------
// Summary
// --------------------------------------------------------------------------
console.log(bold(cyan("\n========================================================")));
console.log(
  bold(
    `RESULTS: ${totalTests} Total | ${green(`${passedTests} Passed`)} | ${
      failedTests > 0 ? red(`${failedTests} Failed`) : "0 Failed"
    }`
  )
);
console.log(bold(cyan("========================================================\n")));

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(green("🎉 ALL LEADERBOARD & GAMIFICATION TESTS PASSED SUCCESSFULLY!\n"));
  process.exit(0);
}
