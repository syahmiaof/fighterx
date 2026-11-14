"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
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
import { useLanguage } from "@/lib/i18n";

interface AssociationDetailModalProps {
  association: SilatAssociation | null;
  onClose: () => void;
}

const CATEGORY_NAMES_BM: Record<AssociationCategory, string> = {
  BADAN_INDUK: "Badan Induk Kebangsaan (PESAKA)",
  PENGASAS_TERAS: "Anggota Pengasas Teras PESAKA Malaysia",
  PERGURUAN_UTAMA: "Perguruan & Persatuan Silat Utama Malaysia",
  ANTARABANGSA: "Badan & Perguruan Antarabangsa / PERSILAT",
};

const CATEGORY_NAMES_EN: Record<AssociationCategory, string> = {
  BADAN_INDUK: "National Governing Body (PESAKA)",
  PENGASAS_TERAS: "Core Founding Members of PESAKA Malaysia",
  PERGURUAN_UTAMA: "Major Malaysian Silat Lineages & Guilds",
  ANTARABANGSA: "International Governing Body / PERSILAT",
};

export function AssociationDetailModal({
  association,
  onClose,
}: AssociationDetailModalProps) {
  const { dict, locale } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Keyboard navigation & accessibility: Escape to close, focus trap, trigger restoration
  useEffect(() => {
    if (!association) return;

    triggerRef.current = (document.activeElement as HTMLElement) || null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    // Nemo Iris reveal for modal dialog & spec cards stagger
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animCtx: gsap.Context | null = null;
    if (!isReduced && modalRef.current) {
      animCtx = gsap.context(() => {
        gsap.fromTo(
          modalRef.current,
          {
            opacity: 0,
            scale: 0.96,
            clipPath: "inset(0 45% 0 45% round 24px)",
          },
          {
            opacity: 1,
            scale: 1,
            clipPath: "inset(0 0% 0 0% round 16px)",
            duration: 0.55,
            ease: "expo.out",
            clearProps: "clipPath,clip-path",
          }
        );

        const specCards = modalRef.current?.querySelectorAll<HTMLElement>(".spec-card");
        if (specCards && specCards.length > 0) {
          gsap.fromTo(
            specCards,
            { opacity: 0, y: 12, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.05,
              ease: "back.out(1.5)",
              delay: 0.15,
              clearProps: "transform,opacity,scale",
            }
          );
        }
      }, modalRef);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      if (animCtx) animCtx.revert();
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
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
          aria-label={locale === "bm" ? "Tutup maklumat persatuan" : "Close association details"}
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
                alt={locale === "bm" ? `Lambang ${association.name}` : `${association.name} Emblem`}
                width={220}
                height={110}
                className="modal-logo-img"
              />
            </div>
          </div>

          {/* Acronym, Category & Name */}
          <div className="modal-heading-content">
            <div className="modal-meta-pills">
              <span className="modal-category-badge">
                {locale === "bm"
                  ? CATEGORY_NAMES_BM[association.category]
                  : CATEGORY_NAMES_EN[association.category]}
              </span>
              {association.yearEstablished && (
                <span className="modal-year-badge">
                  <Calendar size={13} aria-hidden="true" />
                  {locale === "bm" ? "Ditubuhkan" : "Founded"} {association.yearEstablished}
                </span>
              )}
            </div>

            <h2 id="modal-association-title" className="modal-title">
              {association.name}
            </h2>

            <div className="modal-acronym-subtitle">
              {locale === "bm" ? "Akronim Rasmi:" : "Official Acronym:"}{" "}
              <strong>{association.shortName}</strong>
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
                  <span className="spec-label">
                    {locale === "bm" ? "Pengasas / Tokoh Utama" : "Founder / Key Figures"}
                  </span>
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
                  <span className="spec-label">
                    {locale === "bm" ? "Ibu Pejabat / Padepokan" : "Headquarters / Center"}
                  </span>
                  <span className="spec-value">{association.headquarters}</span>
                </div>
              </div>
            )}

            <div className="spec-card">
              <div className="spec-icon-wrap" aria-hidden="true">
                <MapPin size={16} />
              </div>
              <div className="spec-info">
                <span className="spec-label">
                  {locale === "bm" ? "Negeri & Negara" : "State & Country"}
                </span>
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
                  <span className="spec-label">
                    {locale === "bm" ? "Afiliasi / Status Perundangan" : "Affiliation / Legal Status"}
                  </span>
                  <span className="spec-value">{association.pesakaAffiliation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Narrative Section */}
          <div className="modal-narrative-section">
            <h3 className="section-subheading">
              <Shield size={16} className="subheading-icon" aria-hidden="true" />
              {locale === "bm" ? "Latar Belakang & Sejarah" : "Background & History"}
            </h3>
            <p className="narrative-body-text">{association.description}</p>
          </div>

          {/* Key Practices & Martial Disciplines */}
          {association.keyPractices && association.keyPractices.length > 0 && (
            <div className="modal-practices-section">
              <h3 className="section-subheading">
                <Zap size={16} className="subheading-icon" aria-hidden="true" />
                {locale === "bm" ? "Aliran, Disiplin & Amalan Utama" : "Disciplines & Core Practices"}
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
              <span className="discipline-label">
                {locale === "bm" ? "Disiplin Terlibat:" : "Disciplines Covered:"}
              </span>
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
            <span>
              {locale === "bm" ? "Daftar Kelab Bawah Badan Ini" : "Register Club Under This Body"}
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          {association.websiteUrl && (
            <a
              href={association.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-action-outline"
            >
              <span>{locale === "bm" ? "Laman Rasmi" : "Official Website"}</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            className="modal-action-close"
            onClick={onClose}
          >
            {locale === "bm" ? "Tutup" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
