import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { RoleSelectionCards } from "@/components/auth/role-selection-cards";

export const metadata: Metadata = {
  title: "Log Masuk · FighterX",
  description: "Pilih portal log masuk rasmi FighterX: Atlet, Coach, atau Pentadbir.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader currentPage="login" />
      <main className="login-page">
        <RoleSelectionCards />
      </main>
    </>
  );
}
