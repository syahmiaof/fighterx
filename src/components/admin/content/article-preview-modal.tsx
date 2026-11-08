"use client";

import React from "react";
import type { KnowledgeArticle } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import {
  BookOpen,
  Calendar,
  User,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: KnowledgeArticle | null;
  onEdit: (article: KnowledgeArticle) => void;
  onToggleStatus: (articleId: string) => void;
}

export function ArticlePreviewModal({
  isOpen,
  onClose,
  article,
  onEdit,
  onToggleStatus,
}: ArticlePreviewModalProps) {
  if (!article) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FF3845]" />
          <span className="truncate max-w-lg">{article.title}</span>
        </div>
      }
      description={
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <AdminBadge
            variant={article.status === "PUBLISHED" ? "success" : "warning"}
            size="sm"
          >
            {article.status === "PUBLISHED" ? "Diterbitkan" : "Draf"}
          </AdminBadge>
          <span className="text-xs text-[#96989F]">•</span>
          <span className="text-xs text-[#38BDF8] font-semibold">
            {article.category}
          </span>
          <span className="text-xs text-[#96989F]">•</span>
          <span className="text-xs text-[#C5C6CA]">
            Versi: {article.version}
          </span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto admin-scrollbar pr-1">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FF3845] shrink-0" />
            <div>
              <p className="text-[#96989F]">Sumber Berkuasa</p>
              <p className="font-semibold text-white truncate">
                {article.governingSource}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FBBF24] shrink-0" />
            <div>
              <p className="text-[#96989F]">Kuat Kuasa</p>
              <p className="font-semibold text-white">
                {article.effectiveDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <div>
              <p className="text-[#96989F]">Pengarang</p>
              <p className="font-semibold text-white truncate">{article.author}</p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 bg-[#202126] border border-[#27272A] rounded-xl space-y-1.5">
          <h5 className="text-xs font-bold text-[#E5E5E7] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            Ringkasan Eksekutif
          </h5>
          <p className="text-sm text-[#C5C6CA] leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
            Kandungan Kurikulum Penuh
          </h5>
          <div className="p-4 bg-[#121316] border border-[#27272A] rounded-xl text-sm text-[#E5E5E7] leading-relaxed whitespace-pre-wrap font-sans">
            {article.content}
          </div>
        </div>

        {/* Document URL if any */}
        {article.documentUrl && (
          <div className="p-3 bg-[#17191E] border border-[#27272A] rounded-lg flex items-center justify-between text-xs">
            <span className="text-[#96989F]">
              Pautan Rujukan Dokumen Rasmi:
            </span>
            <a
              href={article.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Buka Lampiran</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
          <AdminButton
            variant={article.status === "PUBLISHED" ? "outline" : "success"}
            size="sm"
            onClick={() => {
              onToggleStatus(article.id);
            }}
          >
            {article.status === "PUBLISHED"
              ? "Tukar kepada Draf"
              : "Terbitkan Sekarang"}
          </AdminButton>

          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(article);
              }}
            >
              Sunting Artikel
            </AdminButton>
            <AdminButton variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </AdminButton>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
