"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { CoachProfile } from "@/lib/admin/types";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { DisciplineBadge } from "@/components/admin/people/discipline-badge";
import { CoachAthleteAssignmentModal } from "@/components/admin/people/coach-athlete-assignment-modal";
import {
  ArrowLeft,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Activity,
  ExternalLink,
  UserX,
  UserPlus,
  Flame,
} from "lucide-react";

export interface CoachProfileViewProps {
  coach: CoachProfile;
}

export function CoachProfileView({ coach }: CoachProfileViewProps) {
  const { athletes } = useAdminState();
  const { updateCoachStatus, assignAthleteCoach } = useAdminActions();

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [unassignAthleteId, setUnassignAthleteId] = useState<string | null>(null);

  // Compute assigned athletes from store
  const assignedAthletes = useMemo(() => {
    return athletes.filter((a) => coach.assignedAthleteIds.includes(a.id));
  }, [athletes, coach.assignedAthleteIds]);

  // Squad performance metrics
  const squadMetrics = useMemo(() => {
    if (assignedAthletes.length === 0) {
      return { avgAttendance: 0, avgCompletion: 0, activeCount: 0 };
    }
    const totalAtt = assignedAthletes.reduce((acc, a) => acc + (a.attendanceRate || 0), 0);
    const totalComp = assignedAthletes.reduce((acc, a) => acc + (a.completionRate || 0), 0);
    const active = assignedAthletes.filter((a) => a.status === "Active").length;

    return {
      avgAttendance: Math.round(totalAtt / assignedAthletes.length),
      avgCompletion: Math.round(totalComp / assignedAthletes.length),
      activeCount: active,
    };
  }, [assignedAthletes]);

  const handleToggleStatus = () => {
    const nextStatus = coach.status === "Active" ? "Inactive" : "Active";
    updateCoachStatus(coach.id, nextStatus);
    setIsStatusModalOpen(false);
  };

  const handleConfirmUnassign = () => {
    if (unassignAthleteId) {
      assignAthleteCoach(unassignAthleteId, "");
      setUnassignAthleteId(null);
    }
  };

  const athleteToUnassign = athletes.find((a) => a.id === unassignAthleteId);

  const initials = coach.name
    .replace("Cikgu ", "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/coaches"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989F] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Jurulatih</span>
        </Link>
        <span className="text-xs text-[#96989F]">
          ID Jurulatih: <code className="text-[#E5E5E7]">{coach.id}</code>
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#17191E] via-[#1D1F25] to-[#17191E] border border-[#27272A] rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#27272A] to-[#08090B] border-2 border-[#38BDF8] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] flex-shrink-0">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-white tracking-wide">
                  {coach.name}
                </h1>
                <DisciplineBadge discipline={coach.discipline} size="md" />
                {coach.status === "Active" ? (
                  <AdminBadge variant="success" size="md" dot pulseDot>
                    Aktif
                  </AdminBadge>
                ) : (
                  <AdminBadge variant="neutral" size="md">
                    Tidak Aktif
                  </AdminBadge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#96989F]">
                <span className="text-[#E5E5E7] font-semibold">{coach.clubName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {coach.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {coach.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <AdminButton
              variant="primary"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Tugaskan Atlet Baharu
            </AdminButton>

            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
              leftIcon={<Activity className="w-4 h-4 text-[#4ADE80]" />}
            >
              Tukar Status
            </AdminButton>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Saiz Skuad Bimbingan</span>
            <Users className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {assignedAthletes.length}
            </span>
            <span className="text-xs text-[#96989F]">Atlet Berdaftar</span>
          </div>
          <p className="text-[11px] text-[#4ADE80] mt-2">
            {squadMetrics.activeCount} atlet bersedia tanding
          </p>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Purata Kehadiran Skuad</span>
            <Activity className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {squadMetrics.avgAttendance}%
            </span>
            <span className="text-xs text-[#4ADE80] font-semibold">Tinggi</span>
          </div>
          <div className="w-full bg-[#202126] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#22C55E] h-full rounded-full"
              style={{ width: `${squadMetrics.avgAttendance}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Penyelesaian Latihan Skuad</span>
            <CheckCircle2 className="w-4 h-4 text-[#A5B4FC]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {squadMetrics.avgCompletion}%
            </span>
            <span className="text-xs text-[#96989F]">Modul Disahkan</span>
          </div>
          <div className="w-full bg-[#202126] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#818CF8] h-full rounded-full"
              style={{ width: `${squadMetrics.avgCompletion}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Kelayakan SPKK</span>
            <Award className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {coach.certifications[0] || "SPKK Berlesen"}
            </span>
          </div>
          <p className="text-[11px] text-[#96989F] mt-2">
            Disahkan oleh ISN & PESAKA
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Certifications & Club Profile */}
        <div className="space-y-6">
          {/* Credentials Card */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FBBF24]" />
                  <span>Persijilan & Tauliah Rasmi</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-2.5">
              {coach.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#202126] border border-[#37383D] rounded-lg flex items-start gap-2.5 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{cert}</span>
                    <span className="text-[11px] text-[#96989F]">
                      Pengiktirafan Institut Sukan Negara / PESAKA
                    </span>
                  </div>
                </div>
              ))}
            </AdminCardContent>
          </AdminCard>

          {/* Club Info & Role Boundary Card */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF3845]" />
                  <span>Maklumat Kelab & Pentadbiran</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Kelab Berdaftar</span>
                <span className="text-white font-medium text-right max-w-[180px] truncate">
                  {coach.clubName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Disiplin Kepakaran</span>
                <DisciplineBadge discipline={coach.discipline} size="sm" />
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Emel Rasmi</span>
                <span className="text-white font-mono">{coach.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Nombor Telefon</span>
                <span className="text-white font-mono">{coach.phone}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#96989F]">Tarikh Mula Bimbingan</span>
                <span className="text-white">
                  {new Date(coach.registeredAt).toLocaleDateString("ms-MY")}
                </span>
              </div>

              <div className="p-3 bg-[#17191E] border border-[#27272A] rounded-lg text-[11px] text-[#96989F] leading-relaxed flex items-start gap-2 mt-2">
                <ShieldCheck className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Perlindungan Integriti Peranan:</strong> Jurulatih bertindak sebagai pembimbing skuad tanpa peranan <code className="text-[#FF555A]">CLUB_ADMIN</code>. Kuasa kelulusan permohonan kelab dan pengurusan langganan kekal eksklusif di tangan Pentadbir Pusat.
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>

        {/* Right Column (2 cols): Assigned Athletes Roster */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                <AdminCardTitle className="text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#38BDF8]" />
                    <span>Roster Atlet Bimbingan ({assignedAthletes.length} Atlet)</span>
                  </div>
                </AdminCardTitle>

                <AdminButton
                  variant="secondary"
                  size="xs"
                  onClick={() => setIsAssignModalOpen(true)}
                  leftIcon={<UserPlus className="w-3.5 h-3.5 text-[#4ADE80]" />}
                >
                  Tugaskan Atlet Baharu
                </AdminButton>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {assignedAthletes.length > 0 ? (
                <div className="space-y-3">
                  {assignedAthletes.map((athlete) => {
                    const aInitials = athlete.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("");

                    return (
                      <div
                        key={athlete.id}
                        className="p-4 bg-[#202126] border border-[#27272A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#37383D]"
                      >
                        {/* Athlete Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#27272A] to-[#141519] border border-[#FF3845]/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {aInitials}
                          </div>
                          <div>
                            <Link
                              href={`/admin/athletes/${athlete.id}`}
                              className="font-bold text-white text-sm hover:text-[#FF3845] transition-colors"
                            >
                              {athlete.name}
                            </Link>
                            <div className="text-[11px] text-[#96989F] flex items-center gap-2">
                              <span>{athlete.category}</span>
                              <span>•</span>
                              <span className="font-mono">{athlete.icNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Discipline and Stats */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <DisciplineBadge discipline={athlete.discipline} size="sm" />

                          <div className="text-right text-xs">
                            <span className="text-[#96989F] block text-[10px]">
                              Kehadiran
                            </span>
                            <span className="font-bold text-white">
                              {athlete.attendanceRate}%
                            </span>
                          </div>

                          <div className="text-right text-xs">
                            <span className="text-[#96989F] block text-[10px]">
                              Streak
                            </span>
                            <span className="font-bold text-[#FFB020] flex items-center gap-1 justify-end">
                              <Flame className="w-3 h-3 text-[#FF3845]" />
                              {athlete.streakWeeks} mg
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                            <AdminButton
                              variant="ghost"
                              size="xs"
                              onClick={() => setUnassignAthleteId(athlete.id)}
                              title="Nyah-tetapkan daripada skuad ini"
                              leftIcon={<UserX className="w-3.5 h-3.5 text-[#F87171]" />}
                            >
                              Nyah-tetap
                            </AdminButton>

                            <Link href={`/admin/athletes/${athlete.id}`}>
                              <AdminButton
                                variant="secondary"
                                size="xs"
                                rightIcon={<ExternalLink className="w-3 h-3" />}
                              >
                                Profil
                              </AdminButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#202126]/50 rounded-xl border border-dashed border-[#37383D] space-y-3">
                  <Users className="w-10 h-10 text-[#96989F] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">
                      Skuad Bimbingan Belum Mempunyai Atlet
                    </h4>
                    <p className="text-xs text-[#96989F] max-w-sm mx-auto">
                      Sila tugaskan atlet daripada kelab yang sama atau atlet berdaftar lain untuk memulakan pemantauan latihan.
                    </p>
                  </div>
                  <AdminButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAssignModalOpen(true)}
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Tugaskan Atlet Sekarang
                  </AdminButton>
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      </div>

      {/* Assignment Modal */}
      <CoachAthleteAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        coachId={coach.id}
      />

      {/* Status Modal */}
      {isStatusModalOpen && (
        <AdminModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="Tukar Status Jurulatih"
          description={`Tukar status akaun dan tugas bimbingan untuk ${coach.name}.`}
          maxWidth="sm"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleToggleStatus}
              >
                Sahkan Pertukaran
              </AdminButton>
            </>
          }
        >
          <div className="space-y-3 text-xs text-[#C5C6CA]">
            <p>
              Status semasa: <strong className="text-white">{coach.status}</strong>
            </p>
            <p>
              Adakah anda pasti ingin menukar status akaun ini kepada{" "}
              <strong className="text-[#FF555A]">
                {coach.status === "Active" ? "Tidak Aktif" : "Aktif"}
              </strong>
              ?
            </p>
          </div>
        </AdminModal>
      )}

      {/* Unassign Confirmation Modal */}
      {unassignAthleteId && (
        <AdminModal
          isOpen={Boolean(unassignAthleteId)}
          onClose={() => setUnassignAthleteId(null)}
          title="Nyah-tetapkan Atlet daripada Skuad"
          description={`Keluarkan atlet ${athleteToUnassign?.name} daripada skuad ${coach.name}.`}
          maxWidth="sm"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setUnassignAthleteId(null)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={handleConfirmUnassign}
                leftIcon={<UserX className="w-4 h-4" />}
              >
                Nyah-tetapkan
              </AdminButton>
            </>
          }
        >
          <div className="space-y-2 text-xs text-[#C5C6CA]">
            <p>
              Tindakan ini akan mengosongkan penugasan jurulatih untuk atlet ini. Atlet akan berstatus <strong className="text-white">&ldquo;Tiada Jurulatih&rdquo;</strong> sehingga ditugaskan semula.
            </p>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
