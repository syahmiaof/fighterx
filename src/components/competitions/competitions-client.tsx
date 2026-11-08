"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Send,
  CheckCircle2,
  FileText,
  PlusCircle,
  X,
  Phone,
  Mail,
  Grid,
  List,
  RotateCcw,
  Calendar,
  Building2,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  INITIAL_COMPETITIONS,
  MALAYSIAN_STATES,
  TIER_CONFIG,
  DISCIPLINE_CONFIG,
  AGE_CATEGORY_CONFIG,
  CompetitionItem,
  CompetitionTier,
  AgeCategory,
  DisciplineType,
  SanctionStatus,
  getWhatsAppUrl,
  formatEventDates,
  formatDisplayDateRange,
  getPosterOrBulletin,
} from "./competitions-data";
import "./competitions.css";

export function CompetitionsClient() {
  // Main Data State
  const [competitions, setCompetitions] = useState<CompetitionItem[]>(INITIAL_COMPETITIONS);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("Semua Negeri");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<"ALL" | "kebangsaan" | "sirkit_remaja" | "terbuka">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // View Mode: Cards Feed or Monthly Timeline
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");

  // Modals State
  const [selectedComp, setSelectedComp] = useState<CompetitionItem | null>(null);
  const [registeringComp, setRegisteringComp] = useState<CompetitionItem | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [modalTab, setModalTab] = useState<"tentatif" | "berat" | "pegawai">("tentatif");

  // Organizer Submission Multi-Step State
  const [orgStep, setOrgStep] = useState<1 | 2 | 3>(1);
  const [orgForm, setOrgForm] = useState({
    title: "",
    organizer: "",
    tier: "terbuka" as CompetitionTier,
    state: "Selangor",
    city: "Shah Alam",
    venue: "",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    registrationDeadline: "2026-08-25",
    feeAmount: 80,
    totalSlots: 500,
    ageCategories: ["pra_remaja", "remaja", "dewasa"] as AgeCategory[],
    disciplines: ["tanding", "tunggal", "ganda"] as DisciplineType[],
    sanctionStatus: "pesaka_verified" as SanctionStatus,
    contactName: "",
    contactRole: "Pengarah Kejohanan",
    contactPhone: "",
    contactEmail: "",
    description: "",
  });
  const [orgSuccess, setOrgSuccess] = useState<{
    refCode: string;
    compTitle: string;
  } | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    clubName: "",
    managerName: "",
    phone: "",
    email: "",
    ageCategory: "dewasa" as AgeCategory,
    discipline: "tanding" as DisciplineType,
    athleteCount: 1,
    notes: "",
  });
  const [regSuccess, setRegSuccess] = useState<{
    refCode: string;
    compTitle: string;
    totalFee: number;
    athleteCount: number;
  } | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedComp(null);
        setRegisteringComp(null);
        setShowSubmitModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Logic
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      // 1. State Filter
      if (selectedState !== "Semua Negeri" && comp.state !== selectedState) {
        return false;
      }

      // 2. Category Tab Filter
      if (selectedCategoryTab === "kebangsaan") {
        if (comp.tier !== "sukma" && comp.tier !== "sukipt" && comp.tier !== "kebangsaan") {
          return false;
        }
      } else if (selectedCategoryTab === "sirkit_remaja") {
        const isSirkit = comp.tier === "sirkit_negeri";
        const hasRemaja = comp.ageCategories.includes("remaja") || comp.ageCategories.includes("pra_remaja");
        if (!isSirkit && !hasRemaja) return false;
      } else if (selectedCategoryTab === "terbuka") {
        if (comp.tier !== "terbuka" && comp.tier !== "jemputan_kelab") {
          return false;
        }
      }

      // 3. Status Filter
      if (selectedStatus !== "ALL" && comp.status !== selectedStatus) {
        return false;
      }

      // 4. Search Query Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = comp.title.toLowerCase().includes(q);
        const matchesSubtitle = comp.subtitle.toLowerCase().includes(q);
        const matchesOrganizer = comp.organizer.toLowerCase().includes(q);
        const matchesVenue = comp.venue.toLowerCase().includes(q);
        const matchesCity = comp.city.toLowerCase().includes(q);
        const matchesState = comp.state.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesOrganizer && !matchesVenue && !matchesCity && !matchesState) {
          return false;
        }
      }

      return true;
    });
  }, [competitions, searchQuery, selectedState, selectedCategoryTab, selectedStatus]);

  // Group by Month for Timeline View
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, { label: string; items: CompetitionItem[] }>();
    const monthsName = [
      "Januari", "Februari", "Mac", "April", "Mei", "Jun",
      "Julai", "Ogos", "September", "Oktober", "November", "Disember"
    ];

    filteredCompetitions.forEach((comp) => {
      const parts = comp.startDate ? comp.startDate.split("-") : [];
      const year = parts[0] || "2026";
      const month = parts[1] || "01";
      const rawIdx = parseInt(month, 10) - 1;
      const monthIdx = isNaN(rawIdx) || rawIdx < 0 || rawIdx > 11 ? 0 : rawIdx;
      const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
      const label = `${monthsName[monthIdx]} ${year}`;

      if (!map.has(key)) {
        map.set(key, { label, items: [] });
      }
      map.get(key)!.items.push(comp);
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, val]) => ({
        monthKey: key,
        monthLabel: val.label,
        items: val.items,
      }));
  }, [filteredCompetitions]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedState !== "Semua Negeri" ||
    selectedCategoryTab !== "ALL" ||
    selectedStatus !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedState("Semua Negeri");
    setSelectedCategoryTab("ALL");
    setSelectedStatus("ALL");
  };

  const handleOpenRegistration = (comp: CompetitionItem) => {
    setRegisteringComp(comp);
    setRegSuccess(null);
    setRegForm({
      clubName: "",
      managerName: "",
      phone: "",
      email: "",
      ageCategory: comp.ageCategories[0] || "dewasa",
      discipline: comp.disciplines[0] || "tanding",
      athleteCount: 1,
      notes: "",
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringComp) return;

    const refCode = `FX-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalFee = registeringComp.feeAmount * regForm.athleteCount;

    setRegSuccess({
      refCode,
      compTitle: registeringComp.title,
      totalFee,
      athleteCount: regForm.athleteCount,
    });

    // Update slots in local state
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === registeringComp.id
          ? { ...c, filledSlots: Math.min(c.totalSlots, c.filledSlots + regForm.athleteCount) }
          : c
      )
    );
  };

  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `FX-SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComp: CompetitionItem = {
      id: refCode,
      slug: orgForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: orgForm.title,
      subtitle: `Anjuran ${orgForm.organizer}`,
      organizer: orgForm.organizer,
      state: orgForm.state,
      venue: orgForm.venue,
      city: orgForm.city,
      startDate: orgForm.startDate,
      endDate: orgForm.endDate,
      registrationDeadline: orgForm.registrationDeadline,
      feeAmount: Number(orgForm.feeAmount) || 0,
      feeUnit: "RM / atlet",
      totalSlots: Number(orgForm.totalSlots) || 200,
      filledSlots: 1,
      tier: orgForm.tier,
      sanctionStatus: "under_review",
      sanctionRef: `${refCode}/DRAFT`,
      ageCategories: orgForm.ageCategories,
      disciplines: orgForm.disciplines,
      ruleset: "Standard PERSILAT 2026 (Audit FighterX)",
      featured: false,
      status: "open",
      description: orgForm.description || "Permohonan penganjuran kejohanan silat berdaftar.",
      scheduleDays: [
        {
          day: 1,
          dateLabel: orgForm.startDate,
          title: "Pendaftaran & Taklimat Wasit Juri",
          activities: ["Pendaftaran kontinjen", "Taklimat Pengurus Pasukan", "Pemeriksaan gelanggang"],
        },
      ],
      weightClasses: [
        {
          category: "Kategori Terbuka",
          gender: "Terbuka",
          classes: ["Kelas A hingga H"],
        },
      ],
      contactPerson: {
        name: orgForm.contactName || "Urus Setia Penganjur",
        role: orgForm.contactRole,
        phone: orgForm.contactPhone || "+6012-345 6789",
        email: orgForm.contactEmail || "info@kejohanansilat.my",
      },
      bulletinFileName: `Buletin_${refCode}.pdf`,
    };

    setCompetitions((prev) => [newComp, ...prev]);
    setOrgSuccess({
      refCode,
      compTitle: orgForm.title,
    });
  };

  return (
    <div className="competitions-container">
      {/* 1. Hero Header Section (Preserved Exactly as Loved by User) */}
      <header className="competitions-header">
        <div className="competitions-overline">
          <span className="accent-rule" />
          <span className="overline-text">TAKWIM KEJOHANAN PENCAK SILAT KEBANGSAAN 2026 / 2027</span>
          <span className="accent-rule" />
        </div>

        <h1 className="competitions-title">
          <span className="title-white">MALAYSIAN SILAT </span>
          <span className="title-crimson">COMPETITION CALENDAR</span>
        </h1>

        <p className="competitions-narrative">
          Pusat rujukan rasmi takwim kejohanan Pencak Silat seluruh Malaysia: Sukan Malaysia
          (SUKMA), SUKIPT, Kejohanan Remaja Kebangsaan, Sirkit Negeri, dan Terbuka Jemputan
          Kelab berpandukan standard PERSILAT 2026 &amp; pengiktirafan PESAKA.
        </p>

        <div className="competitions-quote">
          <span className="quote-rule" />
          <span className="quote-text">
            — &ldquo;Semangat Juang. <span className="quote-red">Jiwa Malaysia.</span>&rdquo; —
          </span>
          <span className="quote-rule" />
        </div>
      </header>

      {/* ========================================================
          3. UNIFIED COMMAND & FILTER BAR
          (Clean, Professional, Sports Schedule Experience)
          ======================================================== */}
      <section className="pro-command-bar" aria-label="Penapis & Carian Acara">
        {/* Row 1: Search + State Dropdown + Status Dropdown + Hantar Acara Button */}
        <div className="command-bar-row-top">
          <div className="pro-search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kejohanan: SUKMA, UNITEN, Titiwangsa, PESAKA, Shah Alam..."
              className="pro-search-input"
              aria-label="Cari nama kejohanan, penganjur, atau gelanggang"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="search-clear-btn"
                aria-label="Kosongkan carian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="command-selectors-group">
            <div className="pro-select-wrapper">
              <MapPin size={13} className="select-icon" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="pro-select"
                aria-label="Pilih Negeri"
              >
                {MALAYSIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="pro-select-wrapper">
              <Clock size={13} className="select-icon" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pro-select"
                aria-label="Pilih Status Pendaftaran"
              >
                <option value="ALL">Semua Status</option>
                <option value="open">Pendaftaran Dibuka</option>
                <option value="closing_soon">Hampir Tutup</option>
                <option value="upcoming">Akan Datang</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setOrgStep(1);
                setOrgSuccess(null);
                setShowSubmitModal(true);
              }}
              className="btn-submit-event-pill"
              aria-label="Penganjur: Hantar Kejohanan Baru"
            >
              <PlusCircle size={15} />
              <span>+ Hantar Acara</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Tabs + View Switcher + Meta Info */}
        <div className="command-bar-row-bottom">
          <div className="category-tabs-group" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryTab === "ALL"}
              onClick={() => setSelectedCategoryTab("ALL")}
              className={`cat-tab ${selectedCategoryTab === "ALL" ? "is-active" : ""}`}
            >
              Semua Kejohanan <span className="tab-badge">{competitions.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryTab === "kebangsaan"}
              onClick={() => setSelectedCategoryTab("kebangsaan")}
              className={`cat-tab ${selectedCategoryTab === "kebangsaan" ? "is-active" : ""}`}
            >
              🏆 Kebangsaan / SUKMA / SUKIPT
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryTab === "sirkit_remaja"}
              onClick={() => setSelectedCategoryTab("sirkit_remaja")}
              className={`cat-tab ${selectedCategoryTab === "sirkit_remaja" ? "is-active" : ""}`}
            >
              🥋 Sirkit Remaja &amp; Negeri
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryTab === "terbuka"}
              onClick={() => setSelectedCategoryTab("terbuka")}
              className={`cat-tab ${selectedCategoryTab === "terbuka" ? "is-active" : ""}`}
            >
              ⚔️ Terbuka &amp; Kelab
            </button>
          </div>

          <div className="view-mode-switch" role="group" aria-label="Pilihan Paparan">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`mode-btn ${viewMode === "cards" ? "is-active" : ""}`}
              title="Paparan Kad Kronologi"
            >
              <Grid size={13} /> Kad Acara
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`mode-btn ${viewMode === "timeline" ? "is-active" : ""}`}
              title="Paparan Takwim Kalendar Bulanan"
            >
              <List size={13} /> Takwim Bulanan
            </button>
          </div>
        </div>

        {/* Meta / Active Filter Count Bar */}
        <div className="command-meta-bar">
          <span className="results-count-text">
            Memaparkan <strong>{filteredCompetitions.length}</strong> daripada {competitions.length} kejohanan silat berdaftar
          </span>
          {hasActiveFilters && (
            <button type="button" onClick={handleResetFilters} className="btn-reset-filters">
              <RotateCcw size={12} /> Set Semula Penapis
            </button>
          )}
        </div>
      </section>

      {/* ========================================================
          5. TOURNAMENT FEED: CARDS VIEW VS TIMELINE VIEW
          ======================================================== */}
      {filteredCompetitions.length === 0 ? (
        <div className="competitions-empty-state">
          <Calendar className="empty-state-icon" />
          <h2 className="empty-state-title">Tiada Kejohanan Dijumpai</h2>
          <p className="empty-state-text">
            Tiada kejohanan yang sepadan dengan carian atau penapis semasa anda. Sila cuba tukar negeri,
            kategori, atau set semula penapis carian.
          </p>
          <button type="button" onClick={handleResetFilters} className="btn-empty-reset">
            Set Semula Penapis
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* ULTRA-MINIMALIST DARK GLASSMORPHISM TOURNAMENT CARDS FEED */
        <div className="pro-events-feed">
          {filteredCompetitions.map((comp) => {
            const tierInfo = TIER_CONFIG[comp.tier];
            const dateRange = formatDisplayDateRange(comp.startDate, comp.endDate);
            const posterOrBulletin = getPosterOrBulletin(comp);

            const statusText =
              comp.status === "open"
                ? "Pendaftaran Dibuka"
                : comp.status === "closing_soon"
                ? "Hampir Tutup"
                : comp.status === "upcoming"
                ? "Akan Datang"
                : comp.status === "closed"
                ? "Ditutup"
                : "Selesai";

            return (
              <article
                key={comp.id}
                className={`comp-glass-card ${comp.featured ? "is-featured" : ""}`}
                onClick={() => {
                  setModalTab("tentatif");
                  setSelectedComp(comp);
                }}
              >
                {/* 1. Main Content: Header (Tier + Status), Title, and Meta (Date, Venue, State) */}
                <div className="comp-card-main">
                  <div className="comp-card-header">
                    <span className={`comp-tier-badge ${tierInfo.badgeClass}`}>
                      {tierInfo.label}
                    </span>

                    <span className={`comp-status-badge status-${comp.status}`}>
                      <span className="comp-status-dot" aria-hidden="true" />
                      <span>{statusText}</span>
                    </span>
                  </div>

                  <h2 className="comp-card-title">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalTab("tentatif");
                        setSelectedComp(comp);
                      }}
                      className="comp-title-btn"
                      title={`Lihat butiran ${comp.title}`}
                    >
                      {comp.title}
                    </button>
                  </h2>

                  <div className="comp-card-meta">
                    <div className="comp-meta-item">
                      <Calendar size={13} className="comp-meta-icon" aria-hidden="true" />
                      <span className="comp-meta-value">{dateRange}</span>
                    </div>

                    <span className="comp-meta-divider" aria-hidden="true">•</span>

                    <div className="comp-meta-item">
                      <MapPin size={13} className="comp-meta-icon text-[#ff3845]" aria-hidden="true" />
                      <span className="comp-meta-value">
                        {comp.venue}, <strong className="comp-meta-state">{comp.state}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Actions: Direct Poster/Bulletin Link (omitted if unavailable) + Details Trigger */}
                <div className="comp-card-actions">
                  {posterOrBulletin && (
                    <a
                      href={posterOrBulletin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="comp-card-poster-btn"
                      title={`Buka ${posterOrBulletin.label} rasmi`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText size={13} aria-hidden="true" />
                      <span>{posterOrBulletin.label}</span>
                      <ExternalLink size={11} className="comp-btn-icon-ext" aria-hidden="true" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalTab("tentatif");
                      setSelectedComp(comp);
                    }}
                    className="comp-card-details-btn"
                    aria-label={`Lihat butiran ${comp.title}`}
                  >
                    <span>Butiran</span>
                    <ChevronRight size={13} aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* PRO MONTHLY TIMELINE VIEW */
        <div className="pro-timeline-view">
          {groupedByMonth.map(({ monthKey, monthLabel, items }) => (
            <div key={monthKey} className="timeline-month-block">
              <div className="timeline-month-header">
                <div className="month-header-left">
                  <Calendar size={18} className="text-[#FF3845]" />
                  <h2 className="timeline-month-title">{monthLabel}</h2>
                </div>
                <span className="month-event-count">{items.length} Kejohanan Terjadual</span>
              </div>

              <div className="timeline-events-list">
                {items.map((comp) => {
                  const dateInfo = formatEventDates(comp.startDate, comp.endDate);
                  const tierInfo = TIER_CONFIG[comp.tier];
                  const posterOrBulletin = getPosterOrBulletin(comp);

                  const statusText =
                    comp.status === "open"
                      ? "Dibuka"
                      : comp.status === "closing_soon"
                      ? "Hampir Tutup"
                      : comp.status === "upcoming"
                      ? "Akan Datang"
                      : "Ditutup";

                  return (
                    <div key={comp.id} className="timeline-event-row">
                      <div className="timeline-date-cell">
                        <strong className="timeline-date-days">{dateInfo.days}</strong>
                        <span className="timeline-date-state">{comp.state}</span>
                      </div>

                      <div className="timeline-info-cell">
                        <div className="timeline-tier-row">
                          <span className={`comp-tier-badge ${tierInfo.badgeClass}`}>
                            {tierInfo.label}
                          </span>
                          <span className={`comp-status-badge status-${comp.status}`}>
                            <span className="comp-status-dot" aria-hidden="true" />
                            <span>{statusText}</span>
                          </span>
                        </div>
                        <h4 className="timeline-title">
                          <button
                            type="button"
                            onClick={() => {
                              setModalTab("tentatif");
                              setSelectedComp(comp);
                            }}
                            className="comp-title-btn"
                          >
                            {comp.title}
                          </button>
                        </h4>
                        <p className="timeline-venue-org">
                          <MapPin size={11} className="inline mr-1 text-[#ff3845]" />
                          {comp.venue}, <strong>{comp.state}</strong>
                        </p>
                      </div>

                      <div className="timeline-action-cell">
                        {posterOrBulletin && (
                          <a
                            href={posterOrBulletin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="comp-card-poster-btn"
                            title={`Buka ${posterOrBulletin.label} rasmi`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={12} aria-hidden="true" />
                            <span>{posterOrBulletin.label}</span>
                            <ExternalLink size={10} className="comp-btn-icon-ext" aria-hidden="true" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setModalTab("tentatif");
                            setSelectedComp(comp);
                          }}
                          className="comp-card-details-btn"
                          aria-label={`Lihat butiran ${comp.title}`}
                        >
                          <span>Butiran</span>
                          <ChevronRight size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          6. MODAL: DETAIL MODAL DRAWER (Comprehensive Tournament View)
          ======================================================== */}
      {selectedComp && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedComp(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pro-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="pro-modal-header">
              <div className="modal-header-top">
                <span
                  className={`event-tier-badge ${TIER_CONFIG[selectedComp.tier].badgeClass}`}
                >
                  {TIER_CONFIG[selectedComp.tier].label}
                </span>

                {selectedComp.sanctionRef && (
                  <span className="modal-ref-pill">
                    No. Rujukan: {selectedComp.sanctionRef}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedComp(null)}
                  className="pro-modal-close"
                  aria-label="Tutup butiran kejohanan"
                >
                  <X size={16} />
                </button>
              </div>

              <h2 className="modal-title">{selectedComp.title}</h2>
              <p className="modal-subtitle">{selectedComp.subtitle}</p>

              {/* Modal Quick Meta Grid */}
              <div className="modal-quick-meta">
                <div className="quick-meta-item">
                  <CalendarDays size={14} className="text-[#FF3845]" />
                  <div>
                    <small>Tarikh Acara</small>
                    <strong>{selectedComp.startDate} hingga {selectedComp.endDate}</strong>
                  </div>
                </div>

                <div className="quick-meta-item">
                  <MapPin size={14} className="text-[#FF3845]" />
                  <div>
                    <small>Gelanggang &amp; Negeri</small>
                    <strong>{selectedComp.venue}, {selectedComp.state}</strong>
                  </div>
                </div>

                <div className="quick-meta-item">
                  <Building2 size={14} className="text-[#FF3845]" />
                  <div>
                    <small>Penganjur Utama</small>
                    <strong>{selectedComp.organizer}</strong>
                  </div>
                </div>

                <div className="quick-meta-item">
                  <Clock size={14} className="text-[#FF3845]" />
                  <div>
                    <small>Yuran &amp; Status</small>
                    <strong>
                      {selectedComp.feeAmount === 0 ? "Percuma" : `RM ${selectedComp.feeAmount}`} &bull;{" "}
                      {selectedComp.status === "open" ? "Pendaftaran Dibuka" : "Akan Datang"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="modal-tabs-bar" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === "tentatif"}
                  onClick={() => setModalTab("tentatif")}
                  className={`modal-tab ${modalTab === "tentatif" ? "is-active" : ""}`}
                >
                  Tentatif &amp; Atur Cara Harian
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === "berat"}
                  onClick={() => setModalTab("berat")}
                  className={`modal-tab ${modalTab === "berat" ? "is-active" : ""}`}
                >
                  Kategori Berat &amp; Disiplin
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === "pegawai"}
                  onClick={() => setModalTab("pegawai")}
                  className={`modal-tab ${modalTab === "pegawai" ? "is-active" : ""}`}
                >
                  Pegawai &amp; Standard PERSILAT
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="pro-modal-body">
              {modalTab === "tentatif" && (
                <div className="modal-tab-pane">
                  <p className="modal-description-lead">{selectedComp.description}</p>
                  {selectedComp.highlightPrizes && (
                    <div className="prizes-callout-card">
                      <Award size={18} className="text-[#FACC15] flex-shrink-0" />
                      <div>
                        <strong>Ganjaran &amp; Hadiah Kejohanan:</strong>
                        <p>{selectedComp.highlightPrizes}</p>
                      </div>
                    </div>
                  )}

                  <h3 className="section-heading">Tentatif Rasmi Setiap Hari</h3>
                  <div className="itinerary-timeline">
                    {selectedComp.scheduleDays.map((sch) => (
                      <div key={sch.day} className="itinerary-step">
                        <div className="itinerary-badge">Hari {sch.day}</div>
                        <div className="itinerary-content">
                          <h4>
                            {sch.title} <small>({sch.dateLabel})</small>
                          </h4>
                          <ul>
                            {sch.activities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === "berat" && (
                <div className="modal-tab-pane">
                  <h3 className="section-heading">Kategori Umur Dipertandingkan</h3>
                  <div className="age-tags-grid">
                    {selectedComp.ageCategories.map((cat) => (
                      <div key={cat} className="age-info-card">
                        <strong>{AGE_CATEGORY_CONFIG[cat].label}</strong>
                        <span>{AGE_CATEGORY_CONFIG[cat].ageRange}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="section-heading mt-6">Disiplin Silat &amp; Format Perlawanan</h3>
                  <div className="disciplines-grid">
                    {selectedComp.disciplines.map((d) => (
                      <div key={d} className="discipline-info-card">
                        <span className="disc-icon">🥋</span>
                        <div>
                          <strong>{DISCIPLINE_CONFIG[d].label}</strong>
                          <small>{DISCIPLINE_CONFIG[d].isSeni ? "Silat Seni (Standard PERSILAT)" : "Silat Tanding (Combat Contact)"}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="section-heading mt-6">Kelas Berat Tanding</h3>
                  <div className="weight-classes-container">
                    {selectedComp.weightClasses.map((item, idx) => (
                      <div key={idx} className="weight-group">
                        <span className="weight-group-title">
                          {item.category} ({item.gender})
                        </span>
                        <div className="weight-chips-row">
                          {item.classes.map((c, ci) => (
                            <span key={ci} className="weight-chip">{c}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === "pegawai" && (
                <div className="modal-tab-pane">
                  <div className="sanction-cert-box">
                    <ShieldCheck size={28} className="text-[#4ADE80]" />
                    <div>
                      <strong>
                        {selectedComp.sanctionStatus === "pesaka_verified"
                          ? "Disahkan Penuh di Bawah Naungan PESAKA Malaysia"
                          : selectedComp.sanctionStatus === "msn_verified"
                          ? "Kejohanan Rasmi Majlis Sukan Negara (MSN)"
                          : "Dalam Proses Semakan Teknikal FighterX"}
                      </strong>
                      <p>
                        Kejohanan ini mematuhi ketetapan rasmi Buku Peraturan Pertandingan Pencak Silat Antarabangsa
                        (PERSILAT 2026 edisi 69 halaman) dengan sistem semakan bantahan video (VAR) dan panel wasit juri bertauliah.
                      </p>
                    </div>
                  </div>

                  <h3 className="section-heading mt-6">Urus Setia Perhubungan Kejohanan</h3>
                  <div className="contact-person-card">
                    <div className="contact-avatar">
                      <Building2 size={24} />
                    </div>
                    <div className="contact-details">
                      <h4>{selectedComp.contactPerson.name}</h4>
                      <p className="contact-role">{selectedComp.contactPerson.role} &bull; {selectedComp.organizer}</p>
                      <div className="contact-links-row">
                        <a href={`tel:${selectedComp.contactPerson.phone}`} className="contact-link">
                          <Phone size={13} /> {selectedComp.contactPerson.phone}
                        </a>
                        <a href={`mailto:${selectedComp.contactPerson.email}`} className="contact-link">
                          <Mail size={13} /> {selectedComp.contactPerson.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {selectedComp.organizerWebsite && (
                    <div className="website-link-box">
                      <span>Laman Web Rasmi Penganjur:</span>
                      <a href={selectedComp.organizerWebsite} target="_blank" rel="noopener noreferrer">
                        {selectedComp.organizerWebsite} <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Sticky Action Bar */}
            <div className="pro-modal-footer">
              <div className="footer-left-buttons">
                <a
                  href={getWhatsAppUrl(selectedComp.contactPerson.phone, selectedComp.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modal-whatsapp"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Urus Setia</span>
                </a>

                {(() => {
                  const modalDoc = getPosterOrBulletin(selectedComp);
                  if (!modalDoc) return null;
                  return (
                    <a
                      href={modalDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-modal-bulletin"
                      title={`Buka ${modalDoc.label} rasmi`}
                    >
                      <FileText size={14} aria-hidden="true" />
                      <span>{modalDoc.label}</span>
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  );
                })()}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedComp(null);
                  handleOpenRegistration(selectedComp);
                }}
                disabled={selectedComp.status === "closed"}
                className="btn-modal-register"
              >
                <span>Daftar Kontinjen Sekarang</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. MODAL: ORGANIZER SUBMIT EVENT (3-Step Wizard)
          ======================================================== */}
      {showSubmitModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSubmitModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="submit-wizard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wizard-modal-header">
              <div>
                <span className="wizard-badge">PORTAL PENGANJUR KEJOHANAN</span>
                <h2 className="wizard-title">Hantar Kejohanan Silat Anda</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="pro-modal-close"
                aria-label="Tutup borang penganjur"
              >
                <X size={16} />
              </button>
            </div>

            {orgSuccess ? (
              <div className="wizard-success-card">
                <CheckCircle2 size={54} className="text-[#4ADE80] mx-auto mb-3" />
                <h3>Permohonan Acara Berjaya Dihantar!</h3>
                <p>
                  Kejohanan <strong>&ldquo;{orgSuccess.compTitle}&rdquo;</strong> telah dimasukkan ke dalam pangkalan data
                  FighterX dengan status <strong>&ldquo;Dalam Semakan&rdquo;</strong>.
                </p>
                <div className="ref-code-box">
                  <small>No. Rujukan Penganjur</small>
                  <strong>{orgSuccess.refCode}</strong>
                </div>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                  Pasukan teknikal kami akan menyemak pematuhan standard keselamatan PERSILAT 2026 dan
                  menghubungi urus setia melalui WhatsApp dalam tempoh 24 jam.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOrgSuccess(null);
                    setShowSubmitModal(false);
                  }}
                  className="btn-wizard-done"
                >
                  Selesai &amp; Kembali ke Kalendar
                </button>
              </div>
            ) : (
              <div>
                {/* 3 Steps Indicator */}
                <div className="wizard-steps-indicator">
                  <div className={`step-node ${orgStep >= 1 ? "is-active" : ""}`}>
                    <span className="step-circle">{orgStep > 1 ? <Check size={12} /> : "1"}</span>
                    <span>Maklumat Acara</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step-node ${orgStep >= 2 ? "is-active" : ""}`}>
                    <span className="step-circle">{orgStep > 2 ? <Check size={12} /> : "2"}</span>
                    <span>Tarikh &amp; Yuran</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step-node ${orgStep >= 3 ? "is-active" : ""}`}>
                    <span className="step-circle">3</span>
                    <span>Urus Setia</span>
                  </div>
                </div>

                <form onSubmit={handleOrganizerSubmit}>
                  {/* Step 1: Maklumat Asas */}
                  {orgStep === 1 && (
                    <div className="wizard-form-body">
                      <div className="form-group">
                        <label>Nama Rasmi Kejohanan *</label>
                        <input
                          required
                          type="text"
                          placeholder="cth: Kejohanan Silat Remaja Terbuka Selangor 2026"
                          value={orgForm.title}
                          onChange={(e) => setOrgForm({ ...orgForm, title: e.target.value })}
                          className="pro-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Badan Penganjur / Persatuan / Kelab *</label>
                        <input
                          required
                          type="text"
                          placeholder="cth: PESAKA Negeri Selangor / Kelab Silat Gayong"
                          value={orgForm.organizer}
                          onChange={(e) => setOrgForm({ ...orgForm, organizer: e.target.value })}
                          className="pro-input"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Peringkat Kejohanan *</label>
                          <select
                            value={orgForm.tier}
                            onChange={(e) => setOrgForm({ ...orgForm, tier: e.target.value as CompetitionTier })}
                            className="pro-input"
                          >
                            <option value="terbuka">Kejohanan Terbuka (Open)</option>
                            <option value="sirkit_negeri">Sirkit Remaja Negeri</option>
                            <option value="jemputan_kelab">Jemputan Antara Kelab</option>
                            <option value="kebangsaan">Kejohanan Kebangsaan</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Negeri *</label>
                          <select
                            value={orgForm.state}
                            onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
                            className="pro-input"
                          >
                            {MALAYSIAN_STATES.filter((s) => s !== "Semua Negeri").map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Bandar / Daerah *</label>
                          <input
                            required
                            type="text"
                            placeholder="cth: Shah Alam"
                            value={orgForm.city}
                            onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
                            className="pro-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Gelanggang / Stadium Tertutup *</label>
                          <input
                            required
                            type="text"
                            placeholder="cth: Stadium Melawati"
                            value={orgForm.venue}
                            onChange={(e) => setOrgForm({ ...orgForm, venue: e.target.value })}
                            className="pro-input"
                          />
                        </div>
                      </div>

                      <div className="wizard-actions">
                        <button
                          type="button"
                          onClick={() => {
                            if (orgForm.title && orgForm.organizer && orgForm.venue) {
                              setOrgStep(2);
                            } else {
                              alert("Sila lengkapkan nama kejohanan, penganjur, dan venue.");
                            }
                          }}
                          className="btn-wizard-next"
                        >
                          <span>Seterusnya: Tarikh &amp; Yuran</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Tarikh & Pendaftaran */}
                  {orgStep === 2 && (
                    <div className="wizard-form-body">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Tarikh Mula Kejohanan *</label>
                          <input
                            required
                            type="date"
                            value={orgForm.startDate}
                            onChange={(e) => setOrgForm({ ...orgForm, startDate: e.target.value })}
                            className="pro-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Tarikh Tamat Kejohanan *</label>
                          <input
                            required
                            type="date"
                            value={orgForm.endDate}
                            onChange={(e) => setOrgForm({ ...orgForm, endDate: e.target.value })}
                            className="pro-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-3">
                        <div className="form-group">
                          <label>Tarikh Tutup Pendaftaran *</label>
                          <input
                            required
                            type="date"
                            value={orgForm.registrationDeadline}
                            onChange={(e) => setOrgForm({ ...orgForm, registrationDeadline: e.target.value })}
                            className="pro-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Yuran Penyertaan (RM) *</label>
                          <input
                            required
                            type="number"
                            min="0"
                            placeholder="cth: 80 (0 jika percuma)"
                            value={orgForm.feeAmount}
                            onChange={(e) => setOrgForm({ ...orgForm, feeAmount: Number(e.target.value) })}
                            className="pro-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Anggaran Slot Atlet *</label>
                          <input
                            required
                            type="number"
                            min="50"
                            placeholder="cth: 500"
                            value={orgForm.totalSlots}
                            onChange={(e) => setOrgForm({ ...orgForm, totalSlots: Number(e.target.value) })}
                            className="pro-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Ringkasan / Penerangan Acara</label>
                        <textarea
                          rows={3}
                          placeholder="Terangkan format perlawanan, piala pusingan, atau syarat penyertaan..."
                          value={orgForm.description}
                          onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                          className="pro-input"
                        />
                      </div>

                      <div className="wizard-actions">
                        <button type="button" onClick={() => setOrgStep(1)} className="btn-wizard-back">
                          Kembali
                        </button>
                        <button type="button" onClick={() => setOrgStep(3)} className="btn-wizard-next">
                          <span>Seterusnya: Pegawai &amp; Buletin</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Perhubungan & Buletin */}
                  {orgStep === 3 && (
                    <div className="wizard-form-body">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Nama Pegawai Urus Setia *</label>
                          <input
                            required
                            type="text"
                            placeholder="cth: Cikgu Roslan bin Hassan"
                            value={orgForm.contactName}
                            onChange={(e) => setOrgForm({ ...orgForm, contactName: e.target.value })}
                            className="pro-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Jawatan Pegawai *</label>
                          <input
                            required
                            type="text"
                            placeholder="cth: Setiausaha Pengelola / Penyelaras"
                            value={orgForm.contactRole}
                            onChange={(e) => setOrgForm({ ...orgForm, contactRole: e.target.value })}
                            className="pro-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>No. Telefon / WhatsApp Urus Setia *</label>
                          <input
                            required
                            type="tel"
                            placeholder="cth: +6012-345 6789"
                            value={orgForm.contactPhone}
                            onChange={(e) => setOrgForm({ ...orgForm, contactPhone: e.target.value })}
                            className="pro-input"
                          />
                          <small className="field-hint">Atlet &amp; jurulatih akan dapat terus klik WhatsApp nombor ini.</small>
                        </div>

                        <div className="form-group">
                          <label>Emel Rasmi Urus Setia</label>
                          <input
                            type="email"
                            placeholder="cth: silat.selangor@gmail.com"
                            value={orgForm.contactEmail}
                            onChange={(e) => setOrgForm({ ...orgForm, contactEmail: e.target.value })}
                            className="pro-input"
                          />
                        </div>
                      </div>

                      <div className="declaration-box">
                        <ShieldCheck size={20} className="text-[#4ADE80] flex-shrink-0" />
                        <div>
                          <strong>Deklarasi Penganjur FighterX</strong>
                          <p>
                            Saya mengesahkan bahawa kejohanan ini mematuhi standard keselamatan gelanggang,
                            menyediakan pegawai perubatan bertaraf sukan kombat, serta diadili oleh wasit bertauliah.
                          </p>
                        </div>
                      </div>

                      <div className="wizard-actions">
                        <button type="button" onClick={() => setOrgStep(2)} className="btn-wizard-back">
                          Kembali
                        </button>
                        <button type="submit" className="btn-wizard-submit">
                          <Send size={14} />
                          <span>Hantar Acara untuk Semakan</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          8. MODAL: REGISTRATION MODAL (Daftar Kontinjen)
          ======================================================== */}
      {registeringComp && (
        <div
          className="modal-backdrop"
          onClick={() => setRegisteringComp(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pro-modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <div className="modal-header-top">
                <span className="event-tier-badge">PENDAFTARAN ATLET</span>
                <button
                  type="button"
                  onClick={() => setRegisteringComp(null)}
                  className="pro-modal-close"
                  aria-label="Tutup pendaftaran"
                >
                  <X size={16} />
                </button>
              </div>
              <h2 className="modal-title">{registeringComp.title}</h2>
              <p className="modal-subtitle">
                Yuran: {registeringComp.feeAmount === 0 ? "Percuma" : `RM ${registeringComp.feeAmount}`} &bull; Tarikh Tutup: {registeringComp.registrationDeadline}
              </p>
            </div>

            <div className="pro-modal-body">
              {regSuccess ? (
                <div className="wizard-success-card">
                  <CheckCircle2 size={48} className="text-[#4ADE80] mx-auto mb-2" />
                  <h3>Pendaftaran Berjaya Dihantar!</h3>
                  <p>
                    Pasukan anda telah didaftarkan bagi kejohanan <strong>&ldquo;{regSuccess.compTitle}&rdquo;</strong>.
                  </p>
                  <div className="ref-code-box">
                    <small>No. Rujukan Pendaftaran</small>
                    <strong>{regSuccess.refCode}</strong>
                  </div>
                  <div className="receipt-summary">
                    <div><span>Jumlah Pesilat:</span> <strong>{regSuccess.athleteCount} orang</strong></div>
                    <div><span>Anggaran Yuran:</span> <strong>RM {regSuccess.totalFee}</strong></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisteringComp(null)}
                    className="btn-wizard-done mt-4"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="form-group">
                    <label>Nama Kelab / Pasukan / Persatuan *</label>
                    <input
                      required
                      type="text"
                      placeholder="cth: Kelab Silat Gayong Harimau KL"
                      value={regForm.clubName}
                      onChange={(e) => setRegForm({ ...regForm, clubName: e.target.value })}
                      className="pro-input"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Nama Pengurus Pasukan *</label>
                      <input
                        required
                        type="text"
                        placeholder="cth: Cikgu Azman"
                        value={regForm.managerName}
                        onChange={(e) => setRegForm({ ...regForm, managerName: e.target.value })}
                        className="pro-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>No. Telefon Pengurus *</label>
                      <input
                        required
                        type="tel"
                        placeholder="cth: 012-3456789"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="pro-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Kategori Umur Utama *</label>
                      <select
                        value={regForm.ageCategory}
                        onChange={(e) => setRegForm({ ...regForm, ageCategory: e.target.value as AgeCategory })}
                        className="pro-input"
                      >
                        {registeringComp.ageCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {AGE_CATEGORY_CONFIG[cat].label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Bilangan Pesilat Dihantar *</label>
                      <input
                        required
                        type="number"
                        min="1"
                        max="50"
                        value={regForm.athleteCount}
                        onChange={(e) => setRegForm({ ...regForm, athleteCount: Math.max(1, Number(e.target.value)) })}
                        className="pro-input"
                      />
                    </div>
                  </div>

                  <div className="fee-calculation-card">
                    <span>Jumlah Anggaran Yuran:</span>
                    <strong>RM {registeringComp.feeAmount * regForm.athleteCount}</strong>
                  </div>

                  <div className="pro-modal-footer p-0 border-0 pt-3">
                    <button type="button" onClick={() => setRegisteringComp(null)} className="btn-wizard-back">
                      Batal
                    </button>
                    <button type="submit" className="btn-wizard-submit">
                      <CheckCircle2 size={14} />
                      <span>Hantar Borang Pendaftaran</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
