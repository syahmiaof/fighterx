/**
 * Silat Association Directory Types
 * Conforms to PROJECT.md § Interface Contracts
 */

export type AssociationCategory = 
  | "BADAN_INDUK"          // Badan Induk Kebangsaan
  | "PENGASAS_TERAS"       // 4 Anggota Pengasas Teras
  | "PERGURUAN_UTAMA"      // Perguruan & Persatuan Silat Utama Malaysia
  | "ANTARABANGSA";        // Badan Antarabangsa / PERSILAT

export type DisciplineType = "SENI" | "OLAHRAGA";

export interface SilatAssociation {
  id: string;
  name: string;
  shortName: string;
  category: AssociationCategory;
  logoUrl: string;
  state?: string;
  country: string;
  yearEstablished?: number;
  founders?: string;
  headquarters?: string;
  description: string;
  keyPractices?: string[];
  websiteUrl?: string;
  disciplines?: DisciplineType[];
  pesakaAffiliation?: string;
}

export type CategoryFilterKey = "ALL" | AssociationCategory;

export interface CategoryMetadata {
  key: CategoryFilterKey;
  label: string;
  shortLabel: string;
  description: string;
  badgeTone: "gold" | "crimson" | "silver" | "blue";
}
