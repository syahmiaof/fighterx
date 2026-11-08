import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import {
  KNOWLEDGE_ARTICLES,
  getArticleBySlug,
  getRelatedArticles,
} from "@/components/knowledge/knowledge-data";
import "@/components/knowledge/knowledge.css";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return KNOWLEDGE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Dijumpai · Sport Science · FighterX",
    };
  }

  return {
    title: `${article.title} · Sport Science · FighterX`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedDate,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.id, article.category);

  return (
    <main className="knowledge-page relative min-h-screen bg-[#08090B] pb-24 overflow-x-hidden">
      {/* Shared Wallpaper System */}
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />

      <SiteHeader currentPage="knowledge" />

      <div className="relative z-10 max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#8E9099] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Laman Utama
          </Link>
          <ChevronRight size={12} />
          <Link href="/knowledge" className="hover:text-white transition-colors">
            Sport Science
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#C5C6CA] font-medium">{article.categoryLabel}</span>
          <ChevronRight size={12} />
          <span className="text-[#FF555C] truncate max-w-[200px] sm:max-w-none">{article.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF555C] hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Sport Science</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="pb-8 border-b border-white/[0.08] mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="category-tag badge-crimson">
              {article.categoryLabel}
            </span>
            <span className="text-xs text-[#8E9099] flex items-center gap-1 font-mono">
              <Clock size={13} /> {article.readTime}
            </span>
            <span className="text-xs text-[#8E9099] font-mono">· Tarikh: {article.publishedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic text-white tracking-wide uppercase leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-[#A8A9B2] mt-3 leading-relaxed">
            {article.subtitle}
          </p>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#7A7C85]">
            <span>Semakan Teknikal: <strong className="text-[#C5C6CA]">{article.reviewedBy}</strong></span>
            <span>{article.citations.length} Rujukan Disahkan</span>
          </div>
        </header>

        {/* Executive Summary */}
        <div className="p-5 sm:p-6 rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] text-[#E0E0E4] text-xs sm:text-sm leading-relaxed mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <strong className="block text-xs font-bold text-[#FF555C] uppercase tracking-wider mb-2">
            Ringkasan Eksekutif Kajian
          </strong>
          <p>{article.summary}</p>
        </div>

        {/* Key Takeaways */}
        <div className="knowledge-tool-container p-6 rounded-2xl mb-10">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF3845]" />
            <span>Poin Kunci &amp; Prinsip Utama</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {article.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="p-3.5 rounded-xl knowledge-frosted-subcard flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-[#FF3845] shrink-0 mt-0.5" />
                <span className="text-xs text-[#C5C6CA] leading-snug">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Article Body Content */}
        <div className="space-y-10 text-xs sm:text-sm text-[#D1D2D7] leading-relaxed">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4 pt-6 border-t border-[#23242B]">
              <h2 className="text-xl sm:text-2xl font-bold font-athletic text-white uppercase tracking-wide">
                {section.heading}
              </h2>

              {section.content.map((p, pIdx) => (
                <p key={pIdx} className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed">
                  {p}
                </p>
              ))}

              {/* Bullet Points */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#B5B6BD]">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx}>{bp}</li>
                  ))}
                </ul>
              )}

              {/* Callout */}
              {section.callout && (
                <div
                  className={`p-4 sm:p-5 rounded-xl border backdrop-blur-md flex items-start gap-3 my-4 ${
                    section.callout.type === "warning"
                      ? "border-[rgba(240,180,40,0.3)] bg-[rgba(240,180,40,0.05)] text-[#ffd24c]"
                      : section.callout.type === "tip"
                      ? "border-emerald-500/30 bg-emerald-500/05 text-emerald-300"
                      : "border-[rgba(255,56,69,0.3)] bg-[rgba(255,56,69,0.05)] text-[#ff858b]"
                  }`}
                >
                  {section.callout.type === "warning" ? (
                    <AlertTriangle size={18} className="text-[#ffd24c] shrink-0 mt-0.5" />
                  ) : (
                    <Info size={18} className="text-[#ff3845] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block text-xs font-bold uppercase tracking-wider mb-1">
                      {section.callout.title}
                    </strong>
                    <p className="text-xs leading-normal">{section.callout.text}</p>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {section.table && (
                <div className="overflow-x-auto rounded-xl border border-white/[0.08] my-4 bg-white/[0.02] backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.05] text-white">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5 font-bold border-b border-white/[0.08]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] bg-transparent">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/[0.03] transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3.5 text-[#B0B1B8]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Citations Section */}
        {article.citations.length > 0 && (
          <div className="pt-10 mt-12 border-t border-white/[0.08]">
            <h3 className="text-sm font-bold text-[#8E9099] uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-[#FF3845]" />
              <span>Sumber Rujukan Saintifik &amp; Teknikal</span>
            </h3>
            <div className="space-y-3">
              {article.citations.map((cit) => (
                <div key={cit.id} className="p-4 rounded-xl knowledge-frosted-subcard text-xs text-[#8E9099]">
                  <strong className="text-white block text-sm mb-1">{cit.title}</strong>
                  <p>
                    {cit.authors} ({cit.year}). <em>{cit.journal}</em>, {cit.volumeOrDetails}.
                  </p>
                  <p className="mt-2 text-[#FF858B] italic bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
                    &ldquo;{cit.keyFinding}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 mt-12 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold font-athletic text-white uppercase tracking-wide mb-4">
              ARTIKEL BERKAITAN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/knowledge/${rel.slug}`}
                  className="p-5 rounded-xl knowledge-frosted-subcard hover:border-[rgba(255,56,69,0.45)] transition-all group block"
                >
                  <span className="category-tag badge-crimson mb-2 inline-block">
                    {rel.categoryLabel}
                  </span>
                  <strong className="text-base font-bold font-athletic text-white group-hover:text-[#FF555C] transition-colors block">
                    {rel.title}
                  </strong>
                  <p className="text-xs text-[#8E9099] mt-1 line-clamp-2">{rel.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
