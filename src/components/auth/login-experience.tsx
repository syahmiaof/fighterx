"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ClipboardCheck, Dumbbell, ShieldCheck } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";
import type { AppRole } from "@/types/platform";

const ACCESS_ROLES: Array<{
  id: AppRole;
  title: string;
  description: string;
  icon: typeof Dumbbell;
}> = [
  {
    id: "ATHLETE",
    title: "Athlete",
    description: "Submit training, track progress, and view assigned programmes.",
    icon: Dumbbell,
  },
  {
    id: "COACH",
    title: "Coach",
    description: "Review athlete submissions, monitor progress, and provide feedback.",
    icon: ClipboardCheck,
  },
  {
    id: "ADMIN",
    title: "Admin",
    description: "Manage clubs, coaches, athletes, and central programmes.",
    icon: ShieldCheck,
  },
];

export function LoginExperience() {
  const [selectedRole, setSelectedRole] = useState<AppRole>("ATHLETE");

  return (
    <div className="login-layout">
      <section className="login-intro" aria-labelledby="login-title">
        <p className="login-eyebrow"><span />FIGHTERX ACCESS</p>
        <h1 id="login-title">Choose your<br /><span>access.</span></h1>
        <p className="login-intro-copy">Satu akaun untuk latihan yang lebih tersusun. Pilih ruang kerja anda untuk terus masuk.</p>

        <div className="login-role-list" role="group" aria-label="Choose your FighterX role">
          {ACCESS_ROLES.map(({ id, title, description, icon: Icon }, index) => {
            const selected = selectedRole === id;
            return (
              <button
                className={`login-role-card${selected ? " is-selected" : ""}`}
                type="button"
                key={id}
                aria-pressed={selected}
                aria-controls="login-form-panel"
                onClick={() => setSelectedRole(id)}
              >
                <span className="login-role-index">0{index + 1}</span>
                <span className="login-role-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="login-role-copy">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
                <span className="login-role-check" aria-hidden="true"><Check size={15} /></span>
              </button>
            );
          })}
        </div>
        <p className="login-role-security"><ShieldCheck size={15} aria-hidden="true" /> Role sebenar tetap disahkan oleh sistem akaun FighterX.</p>
      </section>

      <div className="login-right-column">
        <SignInForm selectedRole={selectedRole} />
        <nav className="login-secondary-actions" aria-label="More FighterX pages">
          <Link href="/register-club">Need a club account? <strong>Register Club</strong><ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/#top">Back to Homepage</Link>
        </nav>
      </div>
    </div>
  );
}
