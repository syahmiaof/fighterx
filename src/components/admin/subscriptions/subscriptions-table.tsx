"use client";

import React, { useState, useMemo } from "react";
import type {
  SaaSClubSubscription,
  SaaSClubSubscriptionStatus,
} from "@/lib/admin/types";
import { useAdminState } from "@/lib/admin/store";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminSearchFilter } from "@/components/admin/ui/admin-search-filter";
import { PaymentHistoryModal } from "./payment-history-modal";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Receipt,
} from "lucide-react";

type FilterTab = "ALL" | SaaSClubSubscriptionStatus;
type SortOption = "name_asc" | "renewal_asc" | "trial_end";

const statusConfig: Record<
  SaaSClubSubscriptionStatus,
  { label: string; variant: AdminBadgeVariant; dot: boolean }
> = {
  ACTIVE: { label: "Aktif (RM20/bln)", variant: "success", dot: true },
  TRIALING: { label: "Percubaan 30 Hari", variant: "warning", dot: true },
  PAST_DUE: { label: "Bayaran Tertunggak", variant: "danger", dot: true },
  NOT_STARTED: { label: "Belum Mula", variant: "neutral", dot: false },
  EXPIRED: { label: "Tamat Tempoh", variant: "neutral", dot: false },
  CANCELED: { label: "Dibatalkan", variant: "neutral", dot: false },
};

function calculateDaysRemaining(endDateISO: string): number {
  const diffMs = new Date(endDateISO).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function SubscriptionsTable() {
  const { subscriptions } = useAdminState();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");

  // Selected subscription for payment modal
  const [selectedSub, setSelectedSub] = useState<SaaSClubSubscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status counts
  const counts = useMemo(() => {
    const res: Record<string, number> = {
      ALL: subscriptions.length,
      ACTIVE: 0,
      TRIALING: 0,
      PAST_DUE: 0,
      NOT_STARTED: 0,
      EXPIRED: 0,
      CANCELED: 0,
    };
    subscriptions.forEach((s) => {
      if (res[s.status] !== undefined) {
        res[s.status]++;
      }
    });
    return res;
  }, [subscriptions]);

  // Filtered subscriptions
  const filteredSubs = useMemo(() => {
    let result = [...subscriptions];

    // Status chip filter
    if (activeTab !== "ALL") {
      result = result.filter((s) => s.status === activeTab);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.clubName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.paymentHistory.some((inv) =>
            inv.invoiceNumber.toLowerCase().includes(q)
          )
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name_asc") {
        return a.clubName.localeCompare(b.clubName);
      }
      if (sortBy === "renewal_asc") {
        const dateA = a.nextRenewalDate ? new Date(a.nextRenewalDate).getTime() : 0;
        const dateB = b.nextRenewalDate ? new Date(b.nextRenewalDate).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "trial_end") {
        return (
          new Date(a.trialEndDate).getTime() - new Date(b.trialEndDate).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [subscriptions, activeTab, searchQuery, sortBy]);

  // Modal active subscription synchronized with store
  const activeModalSub = useMemo(() => {
    if (!selectedSub) return null;
    return subscriptions.find((s) => s.id === selectedSub.id) || selectedSub;
  }, [selectedSub, subscriptions]);

  const handleOpenHistory = (sub: SaaSClubSubscription) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const columns: Column<SaaSClubSubscription>[] = [
    {
      key: "club",
      header: "Kelab & ID Langganan",
      cell: (sub) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-sm hover:text-[#FF3845] transition-colors">
            {sub.clubName}
          </p>
          <p className="text-[11px] font-mono text-[#96989F]">{sub.id}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Pelan & Harga",
      cell: (sub) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-semibold text-white">FighterX Standard</p>
          <p className="text-[11px] text-[#4ADE80] font-bold">
            RM {sub.planPrice}.00 / bulan
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status Langganan",
      cell: (sub) => {
        const conf = statusConfig[sub.status] || {
          label: sub.status,
          variant: "neutral",
          dot: false,
        };
        const daysLeft =
          sub.status === "TRIALING"
            ? calculateDaysRemaining(sub.trialEndDate)
            : null;

        return (
          <div className="space-y-1">
            <AdminBadge variant={conf.variant} size="sm" dot={conf.dot}>
              {conf.label}
            </AdminBadge>
            {daysLeft !== null && (
              <p className="text-[10px] text-[#FBBF24] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{daysLeft} hari berbaki</span>
              </p>
            )}
            {sub.status === "PAST_DUE" && (
              <p className="text-[10px] text-[#F87171] font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Tunggakan belum dijelaskan</span>
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "trial",
      header: "Percubaan 30 Hari",
      cell: (sub) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-medium text-[#E5E5E7] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#96989F]" />
            <span>
              {new Date(sub.trialStartDate).toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
              })}
              {" - "}
              {new Date(sub.trialEndDate).toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="text-[10px] text-[#96989F]">30 Hari Penuh Percuma</p>
        </div>
      ),
    },
    {
      key: "billing",
      header: "Kitaran Pengebilan",
      cell: (sub) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-medium text-[#E5E5E7]">
            {sub.billingPeriodStart ? (
              `${new Date(sub.billingPeriodStart).toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
              })} - ${new Date(sub.billingPeriodEnd || "").toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
              })}`
            ) : (
              <span className="text-[#96989F]">Dalam Percubaan</span>
            )}
          </p>
          <p className="text-[10px] text-[#96989F]">
            Pembaharuan:{" "}
            {sub.nextRenewalDate ? (
              <span className="text-[#4ADE80]">
                {new Date(sub.nextRenewalDate).toLocaleDateString("ms-MY")}
              </span>
            ) : (
              "—"
            )}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Tindakan</span>,
      className: "text-right",
      cell: (sub) => (
        <div className="flex items-center justify-end gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenHistory(sub);
            }}
            leftIcon={<Receipt className="w-3.5 h-3.5 text-[#FF3845]" />}
          >
            Sejarah Invois ({sub.paymentHistory.length})
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <AdminSearchFilter
        placeholder="Cari mengikut nama kelab, ID langganan, atau no. invois..."
        onSearch={setSearchQuery}
        chips={[
          { id: "ALL", label: "Semua", count: counts.ALL },
          { id: "ACTIVE", label: "Aktif", count: counts.ACTIVE },
          { id: "TRIALING", label: "Percubaan", count: counts.TRIALING },
          { id: "PAST_DUE", label: "Tertunggak", count: counts.PAST_DUE },
          { id: "EXPIRED", label: "Tamat", count: counts.EXPIRED },
          { id: "CANCELED", label: "Batal", count: counts.CANCELED },
        ]}
        activeChip={activeTab}
        onChipChange={(chipId) => setActiveTab(chipId as FilterTab)}
      >
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="name_asc">Nama Kelab (A-Z)</option>
            <option value="renewal_asc">Tarikh Pembaharuan Terdekat</option>
            <option value="trial_end">Tamat Percubaan Terdekat</option>
          </select>
        </div>
      </AdminSearchFilter>

      {/* Main Subscriptions Table */}
      <AdminTable
        columns={columns}
        data={filteredSubs}
        keyExtractor={(item) => item.id}
        onRowClick={handleOpenHistory}
        emptyTitle="Tiada Langganan Dijumpai"
        emptyDescription="Tiada rekod langganan yang sepadan dengan carian atau penapis status semasa."
        renderMobileCard={(sub) => {
          const conf = statusConfig[sub.status] || {
            label: sub.status,
            variant: "neutral",
            dot: false,
          };
          const daysLeft =
            sub.status === "TRIALING"
              ? calculateDaysRemaining(sub.trialEndDate)
              : null;

          return (
            <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{sub.clubName}</h4>
                  <p className="text-[11px] font-mono text-[#96989F]">{sub.id}</p>
                </div>
                <AdminBadge variant={conf.variant} size="sm" dot={conf.dot}>
                  {conf.label}
                </AdminBadge>
              </div>

              <div className="text-xs space-y-1 py-2 border-y border-[#202126] text-[#C5C6CA]">
                <p>
                  <span className="text-[#96989F]">Kadar:</span> RM {sub.planPrice}
                  .00 / bulan
                </p>
                {daysLeft !== null && (
                  <p className="text-[#FBBF24]">
                    <span className="text-[#96989F]">Percubaan 30 Hari:</span>{" "}
                    {daysLeft} hari berbaki (Tamat:{" "}
                    {new Date(sub.trialEndDate).toLocaleDateString("ms-MY")})
                  </p>
                )}
                {sub.nextRenewalDate && (
                  <p>
                    <span className="text-[#96989F]">Pembaharuan:</span>{" "}
                    {new Date(sub.nextRenewalDate).toLocaleDateString("ms-MY")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#96989F]">
                  {sub.paymentHistory.length} rekod invois
                </span>
                <AdminButton
                  variant="secondary"
                  size="xs"
                  onClick={() => handleOpenHistory(sub)}
                  leftIcon={<Receipt className="w-3 h-3 text-[#FF3845]" />}
                >
                  Sejarah Invois
                </AdminButton>
              </div>
            </div>
          );
        }}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        subscription={activeModalSub}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
