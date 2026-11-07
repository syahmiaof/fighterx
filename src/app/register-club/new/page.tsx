import type { Metadata } from "next";
import { RegisterClubFormPage } from "@/components/register-club/register-club-form-page";

export const metadata: Metadata = {
  title: "Register Your Club · FighterX",
  description: "Daftarkan kelab, akademi atau persatuan silat anda bersama FighterX.",
};

export default function NewClubRegistrationPage() {
  return <RegisterClubFormPage />;
}
