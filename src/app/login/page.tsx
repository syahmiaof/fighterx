import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { LoginExperience } from "@/components/auth/login-experience";

export const metadata: Metadata = {
  title: "Sign In · FighterX",
  description: "Sign in to FighterX with your athlete, coach, or administrator account.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader currentPage="login" />
      <main className="login-page">
        <LoginExperience />
      </main>
    </>
  );
}
