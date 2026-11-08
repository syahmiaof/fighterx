"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { AthleteProfile, AthleteDiscipline, AthleteStatus } from "@/lib/admin/types";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { DisciplineBadge } from "@/components/admin/people/discipline-badge";
import { CoachAthleteAssignmentModal } from "@/components/admin/people/coach-athlete-assignment-modal";
import {
  ArrowLeft,
  UserCheck,
  Award,
  Flame,
  Activity,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Video,
  ShieldCheck,
  Scale,
  Sparkles,
} from "lucide-react";

export interface AthleteProfileViewProps {
  athlete: AthleteProfile;
}

export function AthleteProfileView({ athlete }: AthleteProfileViewProps) {
  const { coaches, assessments, exercises, competitions } = useAdminState();
  const { updateAthleteDiscipline, updateAthleteStatus } = useAdminActions();

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [targetDiscipline, setTargetDiscipline] = useState<AthleteDiscipline>(
    athlete.discipline === "Silat Seni" ? "Silat Olahraga" : "Silat Seni"
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<AthleteStatus>(athlete.status);

  // Find assigned coach details
  const assignedCoach = useMemo(
    () => coaches.find((c) => c.id === athlete.assignedCoachId),
    [coaches, athlete.assignedCoachId]
  );

  // Find assessments for this athlete
  const athleteAssessments = useMemo(
    () => assessments.filter((a) => a.athleteId === athlete.id),
    [assessments, athlete.id]
  );

  // Find competitions where this athlete is on the readiness review roster
  const athleteCompetitions = useMemo(() => {
    return competitions
      .map((comp) => {
        const review = comp.readinessReview.find((r) => r.athleteId === athlete.id);
        return review ? { competition: comp, review } : null;
      })
      .filter(Boolean) as {
      competition: (typeof competitions)[0];
      review: (typeof competitions)[0]["readinessReview"][0];
    }[];
  }, [competitions, athlete.id]);

  // Simulated Weekly Training Attendance Record (M1 to M6)
  const weeklyAttendanceLogs = useMemo(() => {
    const baseRate = athlete.attendanceRate;
    return [
      { week: "Minggu 12 (Semasa)", attended: Math.round((baseRate / 100) * 5), total: 5, rate: baseRate, status: "Lengkap" },
      { week: "Minggu 11", attended: Math.round(((baseRate - 2) / 100) * 5), total: 5, rate: Math.max(50, baseRate - 2), status: "Lengkap" },
      { week: "Minggu 10", attended: Math.round(((baseRate + 3) / 100) * 5), total: 5, rate: Math.min(100, baseRate + 3), status: "Lengkap" },
      { week: "Minggu 9", attended: Math.round(((baseRate - 5) / 100) * 5), total: 5, rate: Math.max(40, baseRate - 5), status: "Lengkap" },
    ];
  }, [athlete.attendanceRate]);

  // Simulated Submissions History based on system exercises
  const simulatedSubmissions = useMemo(() => {
    const relevantExercises = exercises.slice(0, 3);
    return relevantExercises.map((ex, idx) => ({
      id: `sub-${athlete.id}-${idx}`,
      exerciseName: ex.name,
      category: ex.category,
      date: `2026-11-0${6 - idx}`,
      metricResult:
        ex.category === "Cardio / Larian"
          ? "1,480 meter (VO2 Max Target)"
          : ex.category === "Teras / Core"
          ? "120 saat Plank Isometrik"
          : "3 set x 15 reps (Sempurna)",
      verifiedBy: athlete.assignedCoachName || "Jurulatih Skuad",
      verified: true,
      hasVideo: ex.evidenceRequirements.videoRequired,
    }));
  }, [exercises, athlete.id, athlete.assignedCoachName]);

  const handleConfirmDisciplineSwitch = () => {
    updateAthleteDiscipline(athlete.id, targetDiscipline);
    setIsDisciplineModalOpen(false);
  };

  const handleConfirmStatusChange = () => {
    updateAthleteStatus(athlete.id, targetStatus);
    setIsStatusModalOpen(false);
  };

  const initials = athlete.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/athletes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989F] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Atlet</span>
        </Link>
        <span className="text-xs text-[#96989F]">
          ID Atlet: <code className="text-[#E5E5E7]">{athlete.id}</code>
        </span>
      </div>

      {/* Main Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#17191E] via-[#1D1F25] to-[#17191E] border border-[#27272A] rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and Basic Details */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#27272A] to-[#08090B] border-2 border-[#FF3845] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(225,6,0,0.35)] flex-shrink-0">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-white tracking-wide">
                  {athlete.name}
                </h1>
                <DisciplineBadge discipline={athlete.discipline} size="md" />
                {athlete.status === "Active" ? (
                  <AdminBadge variant="success" size="md" dot pulseDot>
                    Aktif
                  </AdminBadge>
                ) : athlete.status === "Injured" ? (
                  <AdminBadge variant="danger" size="md" dot>
                    Kecederaan
                  </AdminBadge>
                ) : (
                  <AdminBadge variant="warning" size="md" dot>
                    {athlete.status}
                  </AdminBadge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#96989F]">
                <span className="text-[#E5E5E7] font-semibold">{athlete.category}</span>
                <span>•</span>
                <span>{athlete.clubName}</span>
                <span>•</span>
                <span className="font-mono">{athlete.icNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
              leftIcon={<UserCheck className="w-4 h-4 text-[#38BDF8]" />}
            >
              Urus Jurulatih
            </AdminButton>

            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setIsDisciplineModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4 text-[#A5B4FC]" />}
            >
              Tukar Disiplin
            </AdminButton>

            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => {
                setTargetStatus(athlete.status);
                setIsStatusModalOpen(true);
              }}
              leftIcon={<Activity className="w-4 h-4 text-[#4ADE80]" />}
            >
              Kemas Kini Status
            </AdminButton>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Kadar Kehadiran</span>
            <Activity className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {athlete.attendanceRate}%
            </span>
            <span className="text-xs text-[#4ADE80] font-semibold">Tinggi</span>
          </div>
          <div className="w-full bg-[#202126] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#22C55E] h-full rounded-full"
              style={{ width: `${athlete.attendanceRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Penyelesaian Mingguan</span>
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {athlete.completionRate}%
            </span>
            <span className="text-xs text-[#96989F]">Modul Latihan</span>
          </div>
          <div className="w-full bg-[#202126] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#38BDF8] h-full rounded-full"
              style={{ width: `${athlete.completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Streak Mingguan</span>
            <Flame className="w-4 h-4 text-[#FF3845]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#FFB020]">
              {athlete.streakWeeks}
            </span>
            <span className="text-xs text-[#96989F]">Minggu Berturut-turut</span>
          </div>
          <p className="text-[11px] text-[#96989F] mt-2">
            Memenuhi syarat konsistensi minimum
          </p>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Tahap Konsistensi</span>
            <Award className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {athlete.consistencyTier}
            </span>
          </div>
          <p className="text-[11px] text-[#96989F] mt-2">
            Klasifikasi komitmen latihan FighterX
          </p>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Profile Attributes & Coach Card */}
        <div className="space-y-6">
          {/* Athlete Profile Details */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF3845]" />
                  <span>Maklumat Peribadi & Kelab</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">No. Kad Pengenalan</span>
                <span className="font-mono text-white">{athlete.icNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Kelab Bersekutu</span>
                <span className="text-white font-medium text-right max-w-[180px] truncate">
                  {athlete.clubName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Disiplin Rasmi</span>
                <DisciplineBadge discipline={athlete.discipline} size="sm" />
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Kategori Bertanding</span>
                <span className="text-white font-medium">{athlete.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#202126]">
                <span className="text-[#96989F]">Tarikh Pendaftaran</span>
                <span className="text-white">
                  {new Date(athlete.registeredAt).toLocaleDateString("ms-MY")}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#96989F]">Status Platform</span>
                <span className="text-white font-semibold">{athlete.status}</span>
              </div>
            </AdminCardContent>
          </AdminCard>

          {/* Assigned Coach Details Card */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#38BDF8]" />
                    <span>Jurulatih Pembimbing</span>
                  </div>
                  <AdminButton
                    variant="ghost"
                    size="xs"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    Tukar
                  </AdminButton>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3">
              {assignedCoach ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#202126] border border-[#38BDF8]/40 flex items-center justify-center font-bold text-white text-xs">
                      {assignedCoach.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {assignedCoach.name}
                      </h4>
                      <p className="text-xs text-[#96989F]">
                        {assignedCoach.clubName}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#202126] rounded-lg border border-[#37383D] space-y-1 text-xs">
                    <span className="text-[10px] text-[#96989F] uppercase tracking-wider block">
                      Persijilan Disahkan:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {assignedCoach.certifications.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-[#96989F] flex items-center justify-between pt-1">
                    <span>Jumlah Atlet Skuad:</span>
                    <span className="text-white font-bold">
                      {assignedCoach.assignedAthleteIds.length} Atlet
                    </span>
                  </div>

                  <Link href={`/admin/coaches/${assignedCoach.id}`}>
                    <AdminButton variant="outline" size="xs" fullWidth>
                      Lihat Profil Lengkap Jurulatih
                    </AdminButton>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-[#96989F]">
                    Atlet ini belum mempunyai jurulatih pembimbing yang ditugaskan.
                  </p>
                  <AdminButton
                    variant="primary"
                    size="xs"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    Tugaskan Jurulatih Sekarang
                  </AdminButton>
                </div>
              )}
            </AdminCardContent>
          </AdminCard>

          {/* Competition Readiness & Medical Clearance Review */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#F59E0B]" />
                  <span>Status Kejohanan & Perubatan</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3 text-xs">
              {athleteCompetitions.length > 0 ? (
                athleteCompetitions.map(({ competition, review }, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#202126] border border-[#37383D] rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white line-clamp-1">
                        {competition.title}
                      </span>
                      <AdminBadge variant="warning" size="sm">
                        {competition.levelBadge}
                      </AdminBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#C5C6CA]">
                      <div>
                        Status Berat: <strong className="text-white">{review.weightStatus}</strong>
                      </div>
                      <div>
                        Skor Kesiapsiagaan:{" "}
                        <strong className="text-[#4ADE80]">
                          {review.readinessScore}%
                        </strong>
                      </div>
                    </div>

                    <div className="pt-1 text-[11px] border-t border-[#27272A] flex items-center justify-between">
                      <span className="text-[#96989F]">Pelepasan Doktor:</span>
                      {review.isCleared ? (
                        <span className="text-[#4ADE80] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dilepaskan
                        </span>
                      ) : (
                        <span className="text-[#F87171] font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Perlu Pemeriksaan
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#96989F] py-2 text-center">
                  Tiada kejohanan aktif dijadualkan untuk atlet ini dalam masa terdekat.
                </div>
              )}

              <div className="p-2.5 bg-[#17191E] border border-[#27272A] rounded text-[11px] text-[#96989F] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Polisi Keselamatan:</strong> Pelepasan perubatan kejohanan memerlukan tandatangan manual pegawai perubatan/jurulatih. Platform melarang sebarang pelepasan automatik.
                </span>
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>

        {/* Right Column (2 cols): Weekly Attendance, Submissions, and Assessments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Training Attendance Record */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4ADE80]" />
                  <span>Rekod Kehadiran Latihan Mingguan (Mikrosiklus)</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              <div className="overflow-x-auto admin-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#202126] text-[#96989F] uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="px-3 py-2">Mikrosiklus / Minggu</th>
                      <th className="px-3 py-2">Sesi Dihadiri</th>
                      <th className="px-3 py-2">Peratusan Kehadiran</th>
                      <th className="px-3 py-2 text-right">Status Komitmen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202126]">
                    {weeklyAttendanceLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#202126]/40">
                        <td className="px-3 py-3 font-semibold text-white">
                          {log.week}
                        </td>
                        <td className="px-3 py-3 text-[#E5E5E7]">
                          {log.attended} daripada {log.total} sesi
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#202126] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  log.rate >= 80 ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                                }`}
                                style={{ width: `${log.rate}%` }}
                              />
                            </div>
                            <span className="font-bold text-white">{log.rate}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <AdminBadge variant="success" size="sm">
                            {log.status}
                          </AdminBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminCardContent>
          </AdminCard>

          {/* Submissions History */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#FF3845]" />
                  <span>Sejarah Penyerahan Bukti Latihan & Video</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3">
              {simulatedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 bg-[#202126] border border-[#27272A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {sub.exerciseName}
                      </span>
                      {sub.hasVideo && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FF3845]/15 border border-[#FF3845]/30 text-[#FF555A] flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video Disahkan
                        </span>
                      )}
                    </div>
                    <div className="text-[#96989F] text-[11px] flex items-center gap-2">
                      <span>Kategori: {sub.category}</span>
                      <span>•</span>
                      <span>Tarikh: {sub.date}</span>
                    </div>
                    <p className="text-[#E5E5E7] font-medium mt-1">
                      Pencapaian: <span className="text-[#4ADE80]">{sub.metricResult}</span>
                    </p>
                  </div>

                  <div className="sm:text-right space-y-1 flex-shrink-0">
                    <AdminBadge variant="success" size="sm">
                      Disahkan oleh {sub.verifiedBy}
                    </AdminBadge>
                    <span className="text-[10px] text-[#96989F] block">
                      Memenuhi standard bukti wajib
                    </span>
                  </div>
                </div>
              ))}
            </AdminCardContent>
          </AdminCard>

          {/* Performance Assessment Radar / Rubric Records */}
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#A5B4FC]" />
                  <span>Rekod Ujian & Penilaian Prestasi Teknikal</span>
                </div>
              </AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3">
              {athleteAssessments.length > 0 ? (
                athleteAssessments.map((ass) => (
                  <div
                    key={ass.id}
                    className="p-4 bg-[#202126] border border-[#37383D] rounded-xl space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {ass.rubricTitle}
                        </h4>
                        <span className="text-[11px] text-[#96989F]">
                          Tarikh: {new Date(ass.date).toLocaleDateString("ms-MY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">
                          {ass.score}/100
                        </span>
                        <AdminBadge
                          variant={
                            ass.ratingTier === "Cemerlang"
                              ? "success"
                              : ass.ratingTier === "Baik"
                              ? "info"
                              : "warning"
                          }
                          size="sm"
                        >
                          {ass.ratingTier}
                        </AdminBadge>
                      </div>
                    </div>

                    {ass.coachNotes && (
                      <div className="p-2.5 bg-[#17191E] rounded-lg border border-[#27272A] text-xs text-[#C5C6CA]">
                        <span className="text-[10px] text-[#96989F] block uppercase font-semibold">
                          Ulasan Jurulatih:
                        </span>
                        {ass.coachNotes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-[#202126]/50 rounded-xl border border-dashed border-[#37383D] space-y-2">
                  <Award className="w-8 h-8 text-[#96989F] mx-auto" />
                  <p className="text-xs text-[#E5E5E7] font-semibold">
                    Belum Ada Rekod Penilaian Rasmi
                  </p>
                  <p className="text-[11px] text-[#96989F] max-w-sm mx-auto">
                    Penilaian baseline fizikal atau teknikal silat akan direkodkan oleh jurulatih mengikut rubrik kebangsaan FighterX.
                  </p>
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
        athleteId={athlete.id}
      />

      {/* Strict Single Discipline Switch Modal */}
      {isDisciplineModalOpen && (
        <AdminModal
          isOpen={isDisciplineModalOpen}
          onClose={() => setIsDisciplineModalOpen(false)}
          title="Tukar Disiplin Rasmi Atlet"
          description={`Peraturan FighterX: Atlet ${athlete.name} hanya boleh didaftarkan di bawah satu disiplin secara eksklusif.`}
          maxWidth="md"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setIsDisciplineModalOpen(false)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleConfirmDisciplineSwitch}
              >
                Sahkan Pertukaran
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs space-y-1">
              <span className="text-[#96989F] block text-[10px] uppercase font-semibold">
                Disiplin Semasa:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">
                  {athlete.discipline}
                </span>
                <DisciplineBadge discipline={athlete.discipline} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">
                Pilih Disiplin Pengganti:
              </label>

              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    targetDiscipline === "Silat Seni"
                      ? "bg-[#202126] border-[#818CF8]"
                      : "bg-[#17191E] border-[#27272A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="athlete-discipline-select"
                      value="Silat Seni"
                      checked={targetDiscipline === "Silat Seni"}
                      onChange={() => setTargetDiscipline("Silat Seni")}
                      className="w-4 h-4 text-[#818CF8]"
                    />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Silat Seni
                      </span>
                      <span className="text-xs text-[#96989F]">
                        Tunggal, Ganda, Regu & Solo Kreatif
                      </span>
                    </div>
                  </div>
                  <DisciplineBadge discipline="Silat Seni" size="sm" />
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    targetDiscipline === "Silat Olahraga"
                      ? "bg-[#202126] border-[#FF3845]"
                      : "bg-[#17191E] border-[#27272A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="athlete-discipline-select"
                      value="Silat Olahraga"
                      checked={targetDiscipline === "Silat Olahraga"}
                      onChange={() => setTargetDiscipline("Silat Olahraga")}
                      className="w-4 h-4 text-[#E10600]"
                    />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Silat Olahraga
                      </span>
                      <span className="text-xs text-[#96989F]">
                        Pertarungan Tanding (Kelas A-J)
                      </span>
                    </div>
                  </div>
                  <DisciplineBadge discipline="Silat Olahraga" size="sm" />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#F87171] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Pendaftaran dwi-disiplin diharamkan. Pertukaran ini akan memindahkan rekod kategori atlet secara eksklusif.
              </span>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && (
        <AdminModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="Kemas Kini Status Penyertaan Atlet"
          description={`Ubah status atlet ${athlete.name}.`}
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
                onClick={handleConfirmStatusChange}
              >
                Simpan
              </AdminButton>
            </>
          }
        >
          <div className="space-y-2">
            {(["Active", "Injured", "Resting", "Suspended"] as AthleteStatus[]).map(
              (st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    targetStatus === st
                      ? "bg-[#202126] border-[#FF3845]"
                      : "bg-[#17191E] border-[#27272A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="athlete-status-choice-detail"
                      value={st}
                      checked={targetStatus === st}
                      onChange={() => setTargetStatus(st)}
                      className="w-4 h-4 text-[#E10600]"
                    />
                    <span className="text-sm font-semibold text-white">
                      {st === "Active"
                        ? "Aktif"
                        : st === "Injured"
                        ? "Kecederaan"
                        : st === "Resting"
                        ? "Rehat"
                        : "Digantung"}
                    </span>
                  </div>
                </label>
              )
            )}
          </div>
        </AdminModal>
      )}
    </div>
  );
}
