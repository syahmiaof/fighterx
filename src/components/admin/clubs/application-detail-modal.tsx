"use client";

import React, { useState } from "react";
import type { ClubApplication, ApplicationStatus } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

export interface ApplicationDetailModalProps {
  application: ClubApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (
    appId: string,
    status: ApplicationStatus,
    auditNotes: string[],
    rejectionReason?: string
  ) => { success: boolean; message: string };
}

const statusBadgeConfig: Record<
  ApplicationStatus,
  { label: string; variant: AdminBadgeVariant }
> = {
  PENDING: { label: "Menunggu Kelulusan", variant: "warning" },
  UNDER_REVIEW: { label: "Sedang Disemak", variant: "info" },
  NEEDS_INFORMATION: { label: "Perlu Maklumat", variant: "accent" },
  APPROVED: { label: "Diluluskan", variant: "success" },
  REJECTED: { label: "Ditolak", variant: "danger" },
};

function ApplicationDetailInner({
  application,
  isOpen,
  onClose,
  onReview,
}: {
  application: ClubApplication;
  isOpen: boolean;
  onClose: () => void;
  onReview: (
    appId: string,
    status: ApplicationStatus,
    auditNotes: string[],
    rejectionReason?: string
  ) => { success: boolean; message: string };
}) {
  const [newAuditNote, setNewAuditNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [confirmMode, setConfirmMode] = useState<"approve" | "reject" | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentBadge = statusBadgeConfig[application.status] || {
    label: application.status,
    variant: "neutral",
  };

  const handleApprove = () => {
    setSubmitting(true);
    const notes = newAuditNote.trim()
      ? [
          newAuditNote.trim(),
          `Diluluskan oleh Pentadbir Sistem pada ${new Date().toLocaleDateString("ms-MY")}. Organisasi dan percubaan percuma 30 hari diaktifkan.`,
        ]
      : [
          `Diluluskan oleh Pentadbir Sistem pada ${new Date().toLocaleDateString("ms-MY")}. Organisasi dan percubaan percuma 30 hari diaktifkan.`,
        ];

    const res = onReview(application.id, "APPROVED", notes);
    setSubmitting(false);
    if (res.success) {
      setActionFeedback({
        type: "success",
        message:
          "Permohonan berjaya diluluskan! Kelab telah didaftarkan ke dalam direktori dan percubaan 30 hari telah diaktifkan.",
      });
      setConfirmMode(null);
      setNewAuditNote("");
    } else {
      setActionFeedback({ type: "error", message: res.message });
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setActionFeedback({
        type: "error",
        message: "Sila nyatakan sebab penolakan permohonan terlebih dahulu.",
      });
      return;
    }

    setSubmitting(true);
    const notes = newAuditNote.trim()
      ? [newAuditNote.trim(), `Sebab Penolakan: ${rejectionReason.trim()}`]
      : [`Sebab Penolakan: ${rejectionReason.trim()}`];

    const res = onReview(
      application.id,
      "REJECTED",
      notes,
      rejectionReason.trim()
    );
    setSubmitting(false);
    if (res.success) {
      setActionFeedback({
        type: "success",
        message: "Permohonan telah ditolak dengan catatan sebab penolakan.",
      });
      setConfirmMode(null);
      setNewAuditNote("");
      setRejectionReason("");
    } else {
      setActionFeedback({ type: "error", message: res.message });
    }
  };

  const handleUnderReview = () => {
    setSubmitting(true);
    const notes = newAuditNote.trim()
      ? [newAuditNote.trim(), "Status dikemas kini kepada Sedang Disemak."]
      : ["Status dikemas kini kepada Sedang Disemak."];

    const res = onReview(application.id, "UNDER_REVIEW", notes);
    setSubmitting(false);
    if (res.success) {
      setActionFeedback({
        type: "success",
        message: "Status permohonan kini: Sedang Disemak.",
      });
      setNewAuditNote("");
    } else {
      setActionFeedback({ type: "error", message: res.message });
    }
  };

  const handleNeedsInformation = () => {
    if (!newAuditNote.trim()) {
      setActionFeedback({
        type: "error",
        message:
          "Sila masukkan nota mengenai maklumat atau dokumen yang diperlukan.",
      });
      return;
    }

    setSubmitting(true);
    const notes = [`Permintaan Maklumat: ${newAuditNote.trim()}`];

    const res = onReview(application.id, "NEEDS_INFORMATION", notes);
    setSubmitting(false);
    if (res.success) {
      setActionFeedback({
        type: "success",
        message: "Status dikemas kini kepada Perlu Maklumat Lanjut.",
      });
      setNewAuditNote("");
    } else {
      setActionFeedback({ type: "error", message: res.message });
    }
  };

  const formattedSubmissionDate = new Date(
    application.submittedAt
  ).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#FF3845]" />
          <span>Semakan Permohonan Pendaftaran Kelab</span>
        </div>
      }
      description={`ID Permohonan: ${application.id} • Diterima: ${formattedSubmissionDate}`}
      footer={
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#96989F]">
            <span>Status Terkini:</span>
            <AdminBadge variant={currentBadge.variant} size="sm" dot>
              {currentBadge.label}
            </AdminBadge>
          </div>

          <div className="flex items-center gap-2">
            <AdminButton variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </AdminButton>

            {application.status !== "APPROVED" && (
              <>
                {confirmMode === null ? (
                  <>
                    {application.status === "PENDING" && (
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={handleUnderReview}
                        loading={submitting}
                        leftIcon={<Clock className="w-3.5 h-3.5 text-[#38BDF8]" />}
                      >
                        Semak
                      </AdminButton>
                    )}

                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirmMode("reject")}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Tolak
                    </AdminButton>

                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => setConfirmMode("approve")}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                    >
                      Luluskan Kelab
                    </AdminButton>
                  </>
                ) : confirmMode === "approve" ? (
                  <div className="flex items-center gap-2">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmMode(null)}
                    >
                      Batal
                    </AdminButton>
                    <AdminButton
                      variant="success"
                      size="sm"
                      loading={submitting}
                      onClick={handleApprove}
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                    >
                      Sahkan Kelulusan
                    </AdminButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmMode(null)}
                    >
                      Batal
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      loading={submitting}
                      onClick={handleReject}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Sahkan Penolakan
                    </AdminButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            className={`p-3.5 rounded-lg border flex items-start gap-3 text-xs leading-relaxed ${
              actionFeedback.type === "success"
                ? "bg-[#22C55E]/15 border-[#22C55E]/40 text-[#4ADE80]"
                : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]"
            }`}
          >
            {actionFeedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{actionFeedback.message}</div>
          </div>
        )}

        {/* Confirmation Warning Prompts */}
        {confirmMode === "approve" && (
          <div className="p-4 rounded-xl bg-[#E10600]/15 border border-[#FF3845]/50 text-white space-y-2 admin-panel-enter">
            <div className="flex items-center gap-2 font-bold text-sm text-[#FF555A]">
              <ShieldAlert className="w-4 h-4 text-[#FF3845]" />
              <span>Sahkan Kelulusan Organisasi Kelab</span>
            </div>
            <p className="text-xs text-[#E5E5E7] leading-relaxed">
              Tindakan ini akan secara automatik:
            </p>
            <ul className="text-xs text-[#C5C6CA] list-disc list-inside space-y-1 pl-1">
              <li>
                Mendaftarkan kelab{" "}
                <span className="text-white font-semibold">
                  {application.clubName}
                </span>{" "}
                ke Direktori Kelab Rasmi.
              </li>
              <li>
                Memulakan langganan percubaan percuma{" "}
                <span className="text-[#4ADE80] font-semibold">
                  30 Hari (RM0)
                </span>{" "}
                sebelum kadar RM20/bulan.
              </li>
              <li>
                Mengurangkan kiraan permohonan menunggu kelulusan secara reaktif.
              </li>
            </ul>
          </div>
        )}

        {confirmMode === "reject" && (
          <div className="p-4 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/50 text-white space-y-3 admin-panel-enter">
            <div className="flex items-center gap-2 font-bold text-sm text-[#F87171]">
              <XCircle className="w-4 h-4 text-[#EF4444]" />
              <span>Pengesahan Penolakan Permohonan</span>
            </div>
            <p className="text-xs text-[#E5E5E7] leading-relaxed">
              Sila berikan sebab rasmi penolakan untuk direkodkan dalam log audit pentadbir:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Dokumen pendaftaran ROS tidak sah atau maklumat jurulatih tidak lengkap..."
              rows={3}
              className="w-full p-2.5 bg-[#141519] border border-[#EF4444]/40 rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
            />
          </div>
        )}

        {/* Section 1: Club Information Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#FF3845]" />
            Maklumat Kelab / Organisasi
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#141519] border border-[#27272A] rounded-xl text-xs">
            <div>
              <span className="text-[#96989F]">Nama Kelab:</span>
              <p className="font-bold text-white text-sm mt-0.5">
                {application.clubName}
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Jenis Organisasi:</span>
              <p className="font-semibold text-[#E5E5E7] mt-0.5">
                <span className="inline-block px-2 py-0.5 rounded bg-[#202126] border border-[#37383D]">
                  {application.clubType}
                </span>
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Negeri:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5">
                {application.state}
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Daerah:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5">
                {application.district}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-[#96989F]">Alamat Pendaftaran / Gelanggang:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0 mt-0.5" />
                <span>{application.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Person In Charge (PIC) Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#FF3845]" />
            Maklumat Pemohon / Pegawai Dihubungi (PIC)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#141519] border border-[#27272A] rounded-xl text-xs">
            <div>
              <span className="text-[#96989F]">Nama Penuh:</span>
              <p className="font-bold text-white mt-0.5">{application.picFullName}</p>
            </div>
            <div>
              <span className="text-[#96989F]">Jawatan dalam Kelab:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5">
                {application.picPosition}
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">No. Telefon / WhatsApp:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <a
                  href={`tel:${application.picPhoneNumber}`}
                  className="hover:text-white hover:underline"
                >
                  {application.picPhoneNumber}
                </a>
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Alamat Emel:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <a
                  href={`mailto:${application.picEmail}`}
                  className="hover:text-white hover:underline truncate"
                >
                  {application.picEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Registration Documents */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#FF3845]" />
            Dokumen Pendaftaran & Sokongan ({application.documents.length})
          </h4>

          {application.documents.length === 0 ? (
            <div className="p-4 bg-[#141519] border border-[#27272A] rounded-xl text-xs text-[#96989F] text-center">
              Tiada dokumen sokongan dimuat naik.
            </div>
          ) : (
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-[#141519] border border-[#27272A] rounded-lg hover:border-[#37383D] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#FF3845] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-[#96989F]">
                        Dimuat naik:{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString("ms-MY", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <a
                    href={doc.url}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Pratonton dokumen: ${doc.name}`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#202126] border border-[#37383D] text-[#C5C6CA] hover:text-white hover:bg-[#2A2B32] transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#96989F]" />
                    <span>Muat Turun</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Audit Notes & History */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#FF3845]" />
            Log Catatan Audit Pentadbir ({application.auditNotes.length})
          </h4>

          <div className="p-3.5 bg-[#141519] border border-[#27272A] rounded-xl space-y-2 max-h-40 overflow-y-auto admin-scrollbar">
            {application.auditNotes.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 text-xs py-1.5 border-b border-[#202126] last:border-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF3845] mt-1.5 flex-shrink-0" />
                <p className="text-[#C5C6CA] leading-relaxed flex-1">{note}</p>
              </div>
            ))}
          </div>

          {/* Add New Audit Note Input */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-medium text-[#C5C6CA] flex items-center justify-between">
              <span>Tambah Catatan Audit / Ulasan:</span>
              {application.status === "PENDING" && (
                <button
                  type="button"
                  onClick={handleNeedsInformation}
                  className="text-[11px] text-[#FF555A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  Minta Maklumat Tambahan
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAuditNote}
                onChange={(e) => setNewAuditNote(e.target.value)}
                placeholder="Tulis ulasan semakan dokumen atau keperluan lanjut..."
                className="flex-1 px-3 py-2 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#FF3845] focus:ring-1 focus:ring-[#FF3845]"
              />
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!newAuditNote.trim()) return;
                  onReview(application.id, application.status, [
                    newAuditNote.trim(),
                  ]);
                  setNewAuditNote("");
                  setActionFeedback({
                    type: "success",
                    message: "Catatan audit berjaya ditambah.",
                  });
                }}
                disabled={!newAuditNote.trim()}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Catat
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}

export function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onReview,
}: ApplicationDetailModalProps) {
  if (!application || !isOpen) return null;

  return (
    <ApplicationDetailInner
      key={application.id}
      application={application}
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
    />
  );
}
