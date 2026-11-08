"use client";

import React, { useState, useMemo } from "react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { KnowledgeArticle } from "@/lib/admin/types";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { ArticleModal } from "./article-modal";
import { ArticlePreviewModal } from "./article-preview-modal";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  FileEdit,
  Eye,
  Shield,
  ExternalLink,
} from "lucide-react";

export function KnowledgeHubCMS() {
  const { knowledgeArticles } = useAdminState();
  const { toggleArticleStatus, addArticle, updateArticle } = useAdminActions();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<KnowledgeArticle | null>(null);
  const [articleToPreview, setArticleToPreview] = useState<KnowledgeArticle | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = knowledgeArticles.length;
    const published = knowledgeArticles.filter((a) => a.status === "PUBLISHED").length;
    const drafts = knowledgeArticles.filter((a) => a.status === "DRAFT").length;
    const sourcesSet = new Set(knowledgeArticles.map((a) => a.governingSource));
    return {
      total,
      published,
      drafts,
      sourcesCount: sourcesSet.size,
    };
  }, [knowledgeArticles]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter((art) => {
      if (selectedCategory !== "ALL" && art.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== "ALL" && art.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.governingSource.toLowerCase().includes(q) ||
          art.author.toLowerCase().includes(q) ||
          art.version.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [knowledgeArticles, selectedCategory, selectedStatus, searchQuery]);

  // Save handler (Add or Update)
  const handleSaveArticle = (
    articleData: Omit<KnowledgeArticle, "id">,
    articleId?: string
  ) => {
    if (articleId) {
      updateArticle(articleId, articleData);
      showToast(`Artikel "${articleData.title}" berjaya dikemaskini.`);
    } else {
      addArticle(articleData);
      showToast(`Artikel baharu "${articleData.title}" berjaya ditambah.`);
    }
  };

  // Toggle Status handler
  const handleToggleStatus = (articleId: string) => {
    toggleArticleStatus(articleId);
    showToast("Status penerbitan artikel telah dikemaskini.");
  };

  // Columns for Table view
  const columns: Column<KnowledgeArticle>[] = [
    {
      key: "title",
      header: "Tajuk Artikel & Rujukan",
      cell: (art) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setArticleToPreview(art)}
              className="text-left font-bold text-white text-sm hover:text-[#FF3845] transition-colors cursor-pointer"
            >
              {art.title}
            </button>
            {art.documentUrl && (
              <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#96989F]">
            <span className="text-[#C5C6CA] font-medium">{art.governingSource}</span>
            <span>•</span>
            <span>{art.version}</span>
            <span>•</span>
            <span className="text-[#96989F]">{art.effectiveDate}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori Kurikulum",
      className: "w-48",
      cell: (art) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
          {art.category}
        </span>
      ),
    },
    {
      key: "author",
      header: "Penyedia",
      className: "w-40",
      cell: (art) => (
        <span className="text-xs text-[#C5C6CA]">{art.author}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-36 text-center",
      headerClassName: "text-center",
      cell: (art) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleToggleStatus(art.id)}
            className="cursor-pointer"
            title="Klik untuk ubah status Draf / Diterbitkan"
          >
            <AdminBadge
              variant={art.status === "PUBLISHED" ? "success" : "warning"}
              size="sm"
            >
              {art.status === "PUBLISHED" ? "Diterbitkan" : "Draf"}
            </AdminBadge>
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Tindakan",
      className: "w-36 text-right",
      headerClassName: "text-right",
      cell: (art) => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="xs"
            onClick={() => setArticleToPreview(art)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Lihat
          </AdminButton>
          <AdminButton
            variant="secondary"
            size="xs"
            onClick={() => {
              setArticleToEdit(art);
              setIsCreateModalOpen(true);
            }}
            leftIcon={<FileEdit className="w-3.5 h-3.5" />}
          >
            Sunting
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-xl text-xs text-[#4ADE80] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#96989F] hover:text-white text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Jumlah Artikel</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#E10600]/15 flex items-center justify-center text-[#FF555A]">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Pusat rujukan silat
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Diterbitkan (Live)</p>
              <h3 className="text-2xl font-black text-[#4ADE80] mt-1">
                {stats.published}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#22C55E]/15 flex items-center justify-center text-[#4ADE80]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#4ADE80]">
            Boleh diakses kelab & jurulatih
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Dalam Draf</p>
              <h3 className="text-2xl font-black text-[#FBBF24] mt-1">
                {stats.drafts}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#FBBF24]">
              <FileEdit className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Menunggu semakan teknikal
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Badan Penguasa</p>
              <h3 className="text-2xl font-black text-[#38BDF8] mt-1">
                {stats.sourcesCount} Agensi
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            PESAKA, ISN, FighterX
          </div>
        </AdminCard>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
          <input
            type="text"
            placeholder="Cari artikel mengikut tajuk, sumber, atau pengarang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Diterbitkan Sahaja</option>
            <option value="DRAFT">Draf Sahaja</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#202126] border border-[#27272A] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#E10600] text-white"
                  : "text-[#96989F] hover:text-white"
              }`}
            >
              Jadual
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#E10600] text-white"
                  : "text-[#96989F] hover:text-white"
              }`}
            >
              Kad Grid
            </button>
          </div>

          {/* Add Article CTA */}
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => {
              setArticleToEdit(null);
              setIsCreateModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tambah Artikel
          </AdminButton>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto admin-scrollbar pb-1">
        <span className="text-xs text-[#96989F] whitespace-nowrap">Kategori:</span>
        {[
          "ALL",
          "Peraturan Pertandingan",
          "Sains Sukan & Pemakanan",
          "Panduan Teknikal",
          "Etika & Adab",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#E10600] text-white shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                : "bg-[#17191E] text-[#96989F] border border-[#27272A] hover:text-white"
            }`}
          >
            {cat === "ALL" ? "Semua Kategori" : cat}
          </button>
        ))}
      </div>

      {/* Articles View: Table or Grid */}
      {viewMode === "table" ? (
        <AdminTable
          columns={columns}
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          emptyTitle="Tiada Artikel Kurikulum"
          emptyDescription="Tiada rekod artikel yang sepadan dengan carian atau penapis kategori anda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((art) => (
            <AdminCard
              key={art.id}
              variant="interactive"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#38BDF8]/15 text-[#38BDF8]">
                    {art.category}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(art.id)}
                    className="cursor-pointer"
                  >
                    <AdminBadge
                      variant={art.status === "PUBLISHED" ? "success" : "warning"}
                      size="sm"
                    >
                      {art.status === "PUBLISHED" ? "Diterbitkan" : "Draf"}
                    </AdminBadge>
                  </button>
                </div>

                <h4
                  onClick={() => setArticleToPreview(art)}
                  className="text-base font-bold text-white hover:text-[#FF3845] transition-colors cursor-pointer line-clamp-2"
                >
                  {art.title}
                </h4>

                <p className="text-xs text-[#96989F] mt-2 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#96989F]">
                <span>{art.author}</span>
                <div className="flex items-center gap-1.5">
                  <AdminButton
                    variant="ghost"
                    size="xs"
                    onClick={() => setArticleToPreview(art)}
                  >
                    Lihat
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="xs"
                    onClick={() => {
                      setArticleToEdit(art);
                      setIsCreateModalOpen(true);
                    }}
                  >
                    Sunting
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setArticleToEdit(null);
        }}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
      />

      {/* Preview Modal */}
      <ArticlePreviewModal
        isOpen={!!articleToPreview}
        onClose={() => setArticleToPreview(null)}
        article={articleToPreview}
        onEdit={(art) => {
          setArticleToPreview(null);
          setArticleToEdit(art);
          setIsCreateModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
