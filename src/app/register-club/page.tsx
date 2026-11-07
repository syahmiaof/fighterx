import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ClubAccessGateway } from "@/components/register-club/club-access-gateway";

export const metadata: Metadata = {
  title: "Club Access · FighterX",
  description: "Register a silat club or access your existing FighterX club workspace.",
};

export default function RegisterClubGatewayPage() {
  return <><SiteHeader currentPage="register" /><ClubAccessGateway /></>;
}
