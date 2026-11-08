import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { RoleLoginCard } from "@/components/auth/role-login-card";
import type { AppRole } from "@/types/platform";

const SLUG_TO_ROLE: Record<string, AppRole> = {
  athlete: "ATHLETE",
  atlet: "ATHLETE",
  coach: "COACH",
  jurulatih: "COACH",
  admin: "ADMIN",
  pentadbir: "ADMIN",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const mappedRole = SLUG_TO_ROLE[role.toLowerCase()];

  if (!mappedRole) {
    return {
      title: "Log Masuk · FighterX",
    };
  }

  const roleName = mappedRole === "ATHLETE" ? "Atlet" : mappedRole === "COACH" ? "Coach" : "Admin";

  return {
    title: `Log Masuk ${roleName} · FighterX`,
    description: `Halaman log masuk rasmi ${roleName} platform FighterX.`,
  };
}

export default async function RoleLoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const mappedRole = SLUG_TO_ROLE[role.toLowerCase()];

  if (!mappedRole) {
    notFound();
  }

  return (
    <>
      <SiteHeader currentPage="login" />
      <main className="login-page">
        <RoleLoginCard role={mappedRole} />
      </main>
    </>
  );
}
