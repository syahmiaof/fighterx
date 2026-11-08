"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { AssociationCategory, SilatAssociation } from "@/lib/associations/types";

interface AssociationCardProps {
  association: SilatAssociation;
  onSelect: (association: SilatAssociation) => void;
}

const CATEGORY_BADGE_CONFIG: Record<
  AssociationCategory,
  { label: string; className: string }
> = {
  BADAN_INDUK: {
    label: "Badan Induk",
    className: "badge-gold",
  },
  PENGASAS_TERAS: {
    label: "4 Pengasas Teras",
    className: "badge-crimson",
  },
  PERGURUAN_UTAMA: {
    label: "Perguruan Utama",
    className: "badge-silver",
  },
  ANTARABANGSA: {
    label: "PERSILAT / Dunia",
    className: "badge-blue",
  },
};

export function AssociationCard({ association, onSelect }: AssociationCardProps) {
  const categoryConfig = CATEGORY_BADGE_CONFIG[association.category];

  return (
    <article
      className="association-card"
      onClick={() => onSelect(association)}
      tabIndex={0}
      role="button"
      aria-label={`Lihat profil penuh ${association.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(association);
        }
      }}
    >
      {/* Top Header: Category Pill & Acronym */}
      <div className="card-top-row">
        <span className={`category-tag ${categoryConfig.className}`}>
          {categoryConfig.label}
        </span>
        <span className="acronym-tag">{association.shortName}</span>
      </div>

      {/* Logo Showcase Container - Frosted Glass Frame */}
      <div className="card-logo-box">
        <div className="logo-radial-glow" aria-hidden="true" />
        <div className="logo-image-frame">
          <Image
            src={association.logoUrl}
            alt={`Lambang rasmi ${association.name}`}
            width={160}
            height={80}
            className="association-logo-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* Official Association Title */}
      <div className="card-title-section">
        <h3 className="card-official-name" title={association.name}>
          {association.name}
        </h3>
      </div>

      {/* Location Meta */}
      <div className="card-meta-chips">
        <span className="meta-chip location-chip">
          <MapPin size={11} className="meta-icon" aria-hidden="true" />
          <span>{association.state ? `${association.state}, ` : ""}{association.country}</span>
        </span>
      </div>

      {/* Action CTA Bar */}
      <div className="card-action-bar">
        <span className="card-action-text">Lihat Profil &amp; Sejarah</span>
        <span className="card-action-arrow" aria-hidden="true">
          <ArrowRight size={13} />
        </span>
      </div>
    </article>
  );
}
