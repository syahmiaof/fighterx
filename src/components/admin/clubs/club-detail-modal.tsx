"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { AdminClub, SaaSClubSubscriptionStatus } from "@/lib/admin/types";
import { useAdminState } from "@/lib/admin/store";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import {
  Shield,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Building2,
  ChevronRight,
  Activity,
  UserCheck,
} from "lucide-react";

export interface ClubDetailModalProps {
  club: AdminClub | null;
  isOpen: boolean;
  onClose: () => void;
}

const subscriptionBadgeConfig: Record<
  SaaSClubSubscriptionStatus,
  { label: string; variant: AdminBadgeVariant }
> = {
  ACTIVE: { label: "Aktif (RM20/bln)", variant: "success" },
  TRIALING: { label: "Percubaan 30 Hari", variant: "warning" },
  PAST_DUE: { label: "Bayaran Tertunggak", variant: "danger" },
  NOT_STARTED: { label: "Belum Bermula", variant: "neutral" },
  EXPIRED: { label: "Tamat Tempoh", variant: "neutral" },
  CANCELED: { label: "Dibatalkan", variant: "neutral" },
};

export function ClubDetailModal({ club, isOpen, onClose }: ClubDetailModalProps) {
  const { athletes, coaches, subscriptions } = useAdminState();

  // Find associated subscription
  const subscription = useMemo(() => {
    if (!club) return null;
    return (
      subscriptions.find((s) => s.clubId === club.id) ||
      subscriptions.find((s) => s.id === club.subscriptionId) ||
      null
    );
  }, [club, subscriptions]);

  // Find associated coaches
  const associatedCoaches = useMemo(() => {
    if (!club) return [];
    return coaches.filter(
      (c) =>
        c.clubId === club.id ||
        c.clubName.toLowerCase() === club.name.toLowerCase()
    );
  }, [club, coaches]);

  // Find associated athletes
  const associatedAthletes = useMemo(() => {
    if (!club) return [];
    return athletes.filter(
      (a) =>
        a.clubId === club.id ||
        a.clubName.toLowerCase() === club.name.toLowerCase()
    );
  }, [club, athletes]);

  if (!club) return null;

  const subBadge = subscriptionBadgeConfig[club.subscriptionStatus] || {
    label: club.subscriptionStatus,
    variant: "neutral",
  };

  const totalAthletes = club.memberCount || associatedAthletes.length;
  const seniCount = club.seniAthletesCount;
  const olahragaCount = club.olahragaAthletesCount;
  const seniPercent =
    totalAthletes > 0 ? Math.round((seniCount / totalAthletes) * 100) : 50;
  const olahragaPercent = 100 - seniPercent;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FF3845]" />
          <span>Profil Organisasi Kelab</span>
        </div>
      }
      description={`No. Pendaftaran: ${club.registrationNumber} • Didaftarkan: ${new Date(
        club.joinedAt
      ).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`}
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <Link href="/admin/subscriptions">
            <AdminButton
              variant="outline"
              size="sm"
              leftIcon={<CreditCard className="w-4 h-4 text-[#38BDF8]" />}
            >
              Urus Langganan SaaS
            </AdminButton>
          </Link>

          <AdminButton variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </AdminButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="p-4 bg-[#141519] border border-[#27272A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">{club.name}</h3>
              <AdminBadge variant={club.status === "Active" ? "success" : "neutral"} size="sm">
                {club.status}
              </AdminBadge>
            </div>
            <p className="text-xs text-[#96989F] flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#FF3845]" />
              <span>{club.type}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>
                {club.district}, {club.state}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-[10px] uppercase font-semibold text-[#96989F]">
              Status Langganan
            </span>
            <AdminBadge variant={subBadge.variant} size="md" dot>
              {subBadge.label}
            </AdminBadge>
          </div>
        </div>

        {/* Section 1: Membership & Discipline Distribution */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#FF3845]" />
            Keahlian & Agihan Disiplin Silat
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#141519] border border-[#27272A] rounded-lg">
              <span className="text-[10px] text-[#96989F] uppercase">Jumlah Pesilat</span>
              <p className="text-xl font-bold text-white mt-0.5">{totalAthletes}</p>
            </div>
            <div className="p-3 bg-[#141519] border border-[#27272A] rounded-lg">
              <span className="text-[10px] text-[#96989F] uppercase">Jurulatih</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {club.coachCount || associatedCoaches.length}
              </p>
            </div>
            <div className="p-3 bg-[#141519] border border-[#27272A] rounded-lg">
              <span className="text-[10px] text-[#38BDF8] uppercase">Silat Seni</span>
              <p className="text-xl font-bold text-[#38BDF8] mt-0.5">{seniCount}</p>
            </div>
            <div className="p-3 bg-[#141519] border border-[#27272A] rounded-lg">
              <span className="text-[10px] text-[#FF555A] uppercase">Silat Olahraga</span>
              <p className="text-xl font-bold text-[#FF555A] mt-0.5">{olahragaCount}</p>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="p-3.5 bg-[#141519] border border-[#27272A] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#38BDF8] flex items-center gap-1">
                Silat Seni: {seniCount} ({seniPercent}%)
              </span>
              <span className="text-[#FF555A] flex items-center gap-1">
                Silat Olahraga: {olahragaCount} ({olahragaPercent}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#202126] overflow-hidden flex">
              <div
                className="bg-[#38BDF8] h-full transition-all duration-300"
                style={{ width: `${seniPercent}%` }}
              />
              <div
                className="bg-[#FF3845] h-full transition-all duration-300"
                style={{ width: `${olahragaPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#FF3845]" />
            Pegawai Dihubungi & Lokasi Gelanggang
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#141519] border border-[#27272A] rounded-xl text-xs">
            <div>
              <span className="text-[#96989F]">Wakil Kelab / PIC:</span>
              <p className="font-bold text-white mt-0.5">{club.contactPerson}</p>
            </div>
            <div>
              <span className="text-[#96989F]">No. Telefon:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <a href={`tel:${club.phone}`} className="hover:text-white hover:underline">
                  {club.phone}
                </a>
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Alamat Emel:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <a href={`mailto:${club.email}`} className="hover:text-white hover:underline">
                  {club.email}
                </a>
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Disiplin Ditawarkan:</span>
              <p className="font-semibold text-white mt-0.5">{club.discipline}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-[#96989F]">Alamat Penuh Gelanggang:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0 mt-0.5" />
                <span>{club.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Registered Coaches in this Club */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[#FF3845]" />
              Jurulatih Berdaftar ({associatedCoaches.length})
            </span>
            <Link
              href="/admin/coaches"
              className="text-[11px] text-[#FF555A] hover:underline flex items-center gap-0.5 font-normal"
            >
              Semua Jurulatih
              <ChevronRight className="w-3 h-3" />
            </Link>
          </h4>

          {associatedCoaches.length === 0 ? (
            <div className="p-3 bg-[#141519] border border-[#27272A] rounded-xl text-xs text-[#96989F] text-center">
              Belum ada jurulatih ditugaskan untuk kelab ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {associatedCoaches.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-[#141519] border border-[#27272A] rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{c.name}</p>
                    <AdminBadge
                      variant={c.status === "Active" ? "success" : "neutral"}
                      size="sm"
                    >
                      {c.status}
                    </AdminBadge>
                  </div>
                  <p className="text-[11px] text-[#96989F]">{c.certifications.join(" • ")}</p>
                  <p className="text-[11px] text-[#C5C6CA]">
                    Disiplin: <span className="text-white">{c.discipline}</span> •{" "}
                    {c.assignedAthleteIds.length} Atlet
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Subscription Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-[#FF3845]" />
            Status Langganan SaaS (Kadar Tetap RM20/Bulan)
          </h4>

          <div className="p-4 bg-[#141519] border border-[#27272A] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#96989F]">Pelan Semasa:</span>
              <span className="font-bold text-white">FighterX Standard Club — RM20 / bulan</span>
            </div>
            {subscription && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[#96989F]">ID Langganan:</span>
                  <span className="font-mono text-[11px] text-[#C5C6CA]">
                    {subscription.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#96989F]">Tempoh Percubaan 30 Hari:</span>
                  <span className="text-[#E5E5E7]">
                    {new Date(subscription.trialStartDate).toLocaleDateString("ms-MY")} -{" "}
                    {new Date(subscription.trialEndDate).toLocaleDateString("ms-MY")}
                  </span>
                </div>
                {subscription.nextRenewalDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#96989F]">Tarikh Pembaharuan Seterusnya:</span>
                    <span className="font-medium text-[#4ADE80]">
                      {new Date(subscription.nextRenewalDate).toLocaleDateString("ms-MY")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
