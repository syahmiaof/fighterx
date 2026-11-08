"use client";

import React, { useState } from "react";
import type { KnowledgeArticle } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: Omit<KnowledgeArticle, "id">, articleId?: string) => void;
  articleToEdit?: KnowledgeArticle | null;
}

function ArticleForm({
  articleToEdit,
  onClose,
  onSave,
}: {
  articleToEdit?: KnowledgeArticle | null;
  onClose: () => void;
  onSave: (articleData: Omit<KnowledgeArticle, "id">, articleId?: string) => void;
}) {
  const [title, setTitle] = useState(articleToEdit ? articleToEdit.title : "");
  const [slug, setSlug] = useState(articleToEdit ? articleToEdit.slug : "");
  const [category, setCategory] = useState<
    | "Peraturan Pertandingan"
    | "Sains Sukan & Pemakanan"
    | "Panduan Teknikal"
    | "Etika & Adab"
  >(articleToEdit ? articleToEdit.category : "Peraturan Pertandingan");
  const [governingSource, setGoverningSource] = useState(
    articleToEdit
      ? articleToEdit.governingSource
      : "PESAKA Malaysia & PERSILAT"
  );
  const [version, setVersion] = useState(
    articleToEdit ? articleToEdit.version : "Edisi 2027 v1.0"
  );
  const [effectiveDate, setEffectiveDate] = useState(
    articleToEdit ? articleToEdit.effectiveDate : "1 Januari 2027"
  );
  const [summary, setSummary] = useState(
    articleToEdit ? articleToEdit.summary : ""
  );
  const [content, setContent] = useState(
    articleToEdit ? articleToEdit.content : ""
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    articleToEdit ? articleToEdit.status : "PUBLISHED"
  );
  const [author, setAuthor] = useState(
    articleToEdit ? articleToEdit.author : "Admin FighterX"
  );
  const [documentUrl, setDocumentUrl] = useState(
    articleToEdit?.documentUrl || ""
  );
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when title changes (if new)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tajuk artikel adalah mandatori.");
      return;
    }
    if (!summary.trim()) {
      setError("Ringkasan artikel adalah mandatori.");
      return;
    }
    if (!content.trim()) {
      setError("Kandungan artikel adalah mandatori.");
      return;
    }
    if (!author.trim()) {
      setError("Nama pengarang / penerbit adalah mandatori.");
      return;
    }

    const payload: Omit<KnowledgeArticle, "id"> = {
      title: title.trim(),
      slug: slug.trim() || `artikel-${Date.now()}`,
      category,
      governingSource: governingSource.trim() || "FighterX Curriculum Unit",
      version: version.trim() || "v1.0",
      effectiveDate: effectiveDate.trim() || "Sesi 2027",
      summary: summary.trim(),
      content: content.trim(),
      status,
      author: author.trim(),
      documentUrl: documentUrl.trim() || undefined,
    };

    onSave(payload, articleToEdit ? articleToEdit.id : undefined);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar pr-1">
      {error && (
        <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-lg text-xs text-[#F87171]">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Tajuk Artikel <span className="text-[#FF3845]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="cth. Buku Panduan Rasmi Peraturan Pertandingan Silat Olahraga & Seni 2027"
          className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
        />
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Kategori Kurikulum <span className="text-[#FF3845]">*</span>
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | "Peraturan Pertandingan"
                  | "Sains Sukan & Pemakanan"
                  | "Panduan Teknikal"
                  | "Etika & Adab"
              )
            }
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="Peraturan Pertandingan">Peraturan Pertandingan</option>
            <option value="Sains Sukan & Pemakanan">Sains Sukan & Pemakanan</option>
            <option value="Panduan Teknikal">Panduan Teknikal</option>
            <option value="Etika & Adab">Etika & Adab</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Status Penerbitan
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "DRAFT" | "PUBLISHED")
            }
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="PUBLISHED">PUBLISHED (Diterbitkan untuk semua kelab)</option>
            <option value="DRAFT">DRAFT (Draf dalam semakan)</option>
          </select>
        </div>
      </div>

      {/* Governing Source & Version */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Sumber Berkuasa
          </label>
          <input
            type="text"
            value={governingSource}
            onChange={(e) => setGoverningSource(e.target.value)}
            placeholder="cth. PESAKA / PERSILAT / ISN"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Versi Dokumen
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="cth. Edisi 2027 v2.1"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Tarikh Kuat Kuasa
          </label>
          <input
            type="text"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            placeholder="cth. 1 Januari 2027"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>
      </div>

      {/* Author & Document URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Pengarang / Pegawai Penyedia <span className="text-[#FF3845]">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="cth. Jawatankuasa Teknikal PESAKA"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Pautan Lampiran PDF / Dokumen (Pilihan)
          </label>
          <input
            type="text"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            placeholder="https://... atau # (fail rasmi)"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Ringkasan Eksekutif <span className="text-[#FF3845]">*</span>
        </label>
        <textarea
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Ringkasan ringkas untuk panduan cepat jurulatih dan atlet..."
          className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600] resize-none"
        />
      </div>

      {/* Content Body */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Kandungan Terperinci (Format Teks & Markdown) <span className="text-[#FF3845]">*</span>
        </label>
        <textarea
          rows={7}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="# Bab 1: Pengenalan&#10;&#10;Huraian protokol latihan, batasan pergerakan, dan rubrik pemarkahan rasmi..."
          className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] font-mono focus:outline-none focus:border-[#E10600] resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#27272A]">
        <AdminButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          Batal
        </AdminButton>
        <AdminButton type="submit" variant="primary" size="sm">
          {articleToEdit ? "Simpan Perubahan" : "Terbitkan Artikel"}
        </AdminButton>
      </div>
    </form>
  );
}

export function ArticleModal({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
}: ArticleModalProps) {
  if (!isOpen) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        articleToEdit ? "Sunting Artikel Kurikulum" : "Cipta Artikel Kurikulum Baharu"
      }
      description="Pusat Sumber Rasmi & Kurikulum Silat FighterX (Peraturan PESAKA/PERSILAT, Pemakanan ISN, Panduan Teknikal)."
      maxWidth="2xl"
    >
      <ArticleForm
        key={articleToEdit ? articleToEdit.id : "new-article"}
        articleToEdit={articleToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </AdminModal>
  );
}
