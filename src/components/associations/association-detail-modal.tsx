"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building,
  Calendar,
  ExternalLink,
  MapPin,
  Shield,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import type { AssociationCategory, SilatAssociation } from "@/lib/associations/types";

interface AssociationDetailModalProps {
  association: SilatAssociation | null;
  onClose: () => void;
}

const CATEGORY_NAMES: Record<AssociationCategory, string> = {
  BADAN_INDUK: "Badan Induk Kebangsaan (PESAKA)",
  PENGASAS_TERAS: "Anggota Pengasas Teras PESAKA Malaysia",
  PERGURUAN_UTAMA: "Perguruan & Persatuan Silat Utama Malaysia",
  ANTARABANGSA: "Badan & Perguruan Antarabangsa / PERSILAT",
};

export function AssociationDetailModal({
  association,
  onClose,
}: AssociationDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation & accessibility: Escape to close, focus management
  useEffect(() => {
    if (!association) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [association, onClose]);

  if (!association) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="association-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-association-title"
      >
        {/* Modal Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Tutup maklumat persatuan"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Modal Header Section */}
        <div className="modal-header-section">
          {/* Large Logo Showcase */}
          <div className="modal-logo-stage">
            <div className="modal-logo-glow" aria-hidden="true" />
            <div className="modal-logo-frame">
              <Image
                src={association.logoUrl}
                alt={`Lambang ${association.name}`}
                width={220}
                height={110}
                className="modal-logo-img"
                priority
              />
            </div>
          </div>

          {/* Acronym, Category & Name */}
          <div className="modal-heading-content">
            <div className="modal-meta-pills">
              <span className="modal-category-badge">
                {CATEGORY_NAMES[association.category]}
              </span>
              {association.yearEstablished && (
                <span className="modal-year-badge">
                  <Calendar size={13} aria-hidden="true" />
                  Ditubuhkan {association.yearEstablished}
                </span>
              )}
            </div>

            <h2 id="modal-association-title" className="modal-title">
              {association.name}
            </h2>

            <div className="modal-acronym-subtitle">
              Akronim Rasmi: <strong>{association.shortName}</strong>
            </div>
          </div>
        </div>

        {/* Modal Body: Information Grid & Historical Narrative */}
        <div className="modal-body-scroll">
          {/* Metadata Grid */}
          <div className="modal-spec-grid">
            {association.founders && (
              <div className="spec-card">
                <div className="spec-icon-wrap" aria-hidden="true">
                  <UserCheck size={16} />
                </div>
                <div className="spec-info">
                  <span className="spec-label">Pengasas / Tokoh Utama</span>
                  <span className="spec-value">{association.founders}</span>
                </div>
              </div>
            )}

            {association.headquarters && (
              <div className="spec-card">
                <div className="spec-icon-wrap" aria-hidden="true">
                  <Building size={16} />
                </div>
                <div className="spec-info">
                  <span className="spec-label">Ibu Pejabat / Padepokan</span>
                  <span className="spec-value">{association.headquarters}</span>
                </div>
              </div>
            )}

            <div className="spec-card">
              <div className="spec-icon-wrap" aria-hidden="true">
                <MapPin size={16} />
              </div>
              <div className="spec-info">
                <span className="spec-label">Negeri &amp; Negara</span>
                <span className="spec-value">
                  {association.state ? `${association.state}, ` : ""}{association.country}
                </span>
              </div>
            </div>

            {association.pesakaAffiliation && (
              <div className="spec-card">
                <div className="spec-icon-wrap gold" aria-hidden="true">
                  <Award size={16} />
                </div>
                <div className="spec-info">
                  <span className="spec-label">Afiliasi / Status Perundangan</span>
                  <span className="spec-value">{association.pesakaAffiliation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Narrative Section */}
          <div className="modal-narrative-section">
            <h3 className="section-subheading">
              <Shield size={16} className="subheading-icon" aria-hidden="true" />
              Latar Belakang &amp; Sejarah
            </h3>
            <p className="narrative-body-text">{association.description}</p>
          </div>

          {/* Key Practices & Martial Disciplines */}
          {association.keyPractices && association.keyPractices.length > 0 && (
            <div className="modal-practices-section">
              <h3 className="section-subheading">
                <Zap size={16} className="subheading-icon" aria-hidden="true" />
                Aliran, Disiplin &amp; Amalan Utama
              </h3>
              <div className="practices-tag-grid">
                {association.keyPractices.map((practice) => (
                  <span key={practice} className="modal-practice-tag">
                    {practice}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disciplines Covered */}
          {association.disciplines && association.disciplines.length > 0 && (
            <div className="modal-disciplines-row">
              <span className="discipline-label">Disiplin Terlibat:</span>
              <div className="discipline-badges">
                {association.disciplines.includes("SENI") && (
                  <span className="discipline-pill seni">Silat Seni</span>
                )}
                {association.disciplines.includes("OLAHRAGA") && (
                  <span className="discipline-pill olahraga">Silat Olahraga</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer-actions">
          <Link
            href={`/register-club?association=${encodeURIComponent(association.id)}`}
            className="modal-action-primary"
            onClick={onClose}
          >
            <span>Daftar Kelab Bawah Badan Ini</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          {association.websiteUrl && (
            <a
              href={association.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-action-outline"
            >
              <span>Laman Rasmi</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            className="modal-action-close"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
