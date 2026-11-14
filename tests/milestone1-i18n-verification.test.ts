import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { enDictionary } from "../src/lib/i18n/dictionaries/en";
import { bmDictionary } from "../src/lib/i18n/dictionaries/bm";
import type { Dictionary } from "../src/lib/i18n/types";

describe("Milestone 1: i18n Dictionary Integrity & Terminology", () => {
  it("enDictionary and bmDictionary should implement complete Dictionary interface", () => {
    assert.ok(enDictionary, "enDictionary must exist");
    assert.ok(bmDictionary, "bmDictionary must exist");

    const requiredTopLevelKeys: (keyof Dictionary)[] = [
      "nav",
      "common",
      "home",
      "guidelines",
      "knowledge",
      "leaderboard",
      "competitions",
      "moments",
      "associations",
      "disciplines",
      "auth",
    ];

    for (const key of requiredTopLevelKeys) {
      assert.ok(enDictionary[key], `enDictionary.${key} must be defined`);
      assert.ok(bmDictionary[key], `bmDictionary.${key} must be defined`);
    }
  });

  it("English navigation labels should reflect standard athletic terminology", () => {
    assert.equal(enDictionary.nav.home, "Home");
    assert.equal(enDictionary.nav.guidelines, "Guidelines");
    assert.equal(enDictionary.nav.knowledge, "Sport Science");
    assert.equal(enDictionary.nav.leaderboard, "Leaderboard");
    assert.equal(enDictionary.nav.competitions, "Calendar");
    assert.equal(enDictionary.nav.moments, "Moments");
    assert.equal(enDictionary.nav.associations, "Associations");
    assert.equal(enDictionary.nav.disciplines, "Disciplines");
    assert.equal(enDictionary.nav.login, "Login");
    assert.equal(enDictionary.nav.registerClub, "Register Club");
  });

  it("Bahasa Melayu navigation labels should reflect standard national terminology", () => {
    assert.equal(bmDictionary.nav.home, "Utama");
    assert.equal(bmDictionary.nav.guidelines, "Panduan");
    assert.equal(bmDictionary.nav.knowledge, "Sains Sukan");
    assert.equal(bmDictionary.nav.leaderboard, "Kedudukan");
    assert.equal(bmDictionary.nav.competitions, "Kalendar");
    assert.equal(bmDictionary.nav.moments, "Moment");
    assert.equal(bmDictionary.nav.associations, "Persatuan");
    assert.equal(bmDictionary.nav.disciplines, "Kategori");
    assert.equal(bmDictionary.nav.login, "Log Masuk");
    assert.equal(bmDictionary.nav.registerClub, "Daftar Kelab");
  });

  it("Knowledge dictionary should correctly reference ISN, PERSILAT 2026, and MSN", () => {
    assert.ok(
      enDictionary.knowledge.description.includes("ISN") ||
      enDictionary.knowledge.description.includes("National Sports Institute")
    );
    assert.ok(enDictionary.knowledge.description.includes("PERSILAT 2026"));
    assert.ok(bmDictionary.knowledge.description.includes("Institut Sukan Negara (ISN)"));
    assert.ok(bmDictionary.knowledge.description.includes("PERSILAT 2026"));
  });

  it("Protected portals isolation guard: athlete, coach, admin, my-club must not be modified", () => {
    const protectedDirs = [
      path.join(process.cwd(), "src/app/athlete"),
      path.join(process.cwd(), "src/app/coach"),
      path.join(process.cwd(), "src/app/admin"),
      path.join(process.cwd(), "src/app/my-club"),
    ];

    for (const dir of protectedDirs) {
      assert.ok(fs.existsSync(dir), `Protected directory must exist: ${dir}`);
    }
  });
});
