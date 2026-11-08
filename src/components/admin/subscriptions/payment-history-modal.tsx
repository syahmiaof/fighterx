"use client";

import React, { useState } from "react";
import type {
  SaaSClubSubscription,
  SaaSClubSubscriptionStatus,
  SubscriptionPaymentRecord,
} from "@/lib/admin/types";
import { useAdminActions } from "@/lib/admin/store";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import {
  CreditCard,
  CheckCircle,
  Receipt,
  PlusCircle,
  Info,
} from "lucide-react";

export interface PaymentHistoryModalProps {
  subscription: SaaSClubSubscription | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusBadgeConfig: Record<
  SaaSClubSubscriptionStatus,
  { label: string; variant: AdminBadgeVariant }
> = {
  ACTIVE: { label: "Aktif (RM20/bln)", variant: "success" },
  TRIALING: { label: "Percubaan 30 Hari", variant: "warning" },
  PAST_DUE: { label: "Bayaran Tertunggak", variant: "danger" },
  NOT_STARTED: { label: "Belum Bermula", variant: "neutral" },
  EXPIRED: { label: "Tamat Tempoh", variant: "neutral" },
  CANCELED: { label: "Dibatalkan", variant: "neutral" },
};

const invoiceStatusBadgeConfig: Record<
  "PAID" | "PENDING" | "FAILED",
  { label: string; variant: AdminBadgeVariant }
> = {
  PAID: { label: "Berjaya", variant: "success" },
  PENDING: { label: "Menunggu", variant: "warning" },
  FAILED: { label: "Gagal", variant: "danger" },
};

export function PaymentHistoryModal({
  subscription,
  isOpen,
  onClose,
}: PaymentHistoryModalProps) {
  const { updateSubscriptionStatus } = useAdminActions();
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "FPX_ONLINE_BANKING" | "CARD" | "MANUAL_BANK_TRANSFER"
  >("FPX_ONLINE_BANKING");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!subscription) return null;

  const currentBadge = statusBadgeConfig[subscription.status] || {
    label: subscription.status,
    variant: "neutral",
  };

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    const invoiceNum = `FX-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-4)}`;

    const newPayment: Omit<SubscriptionPaymentRecord, "id"> = {
      invoiceNumber: invoiceNum,
      amount: 20, // Invariant: RM20
      paidAt: new Date().toISOString(),
      paymentMethod: selectedMethod,
      status: "PAID",
      receiptUrl: "#",
    };

    updateSubscriptionStatus(subscription.clubId, "ACTIVE", newPayment);
    setIsSimulatingPayment(false);
    setFeedbackMessage(
      `Pembayaran simulasi RM20.00 (Invois: ${invoiceNum}) berjaya direkodkan. Status langganan kini AKTIF.`
    );
  };

  const handleStatusChange = (newStatus: SaaSClubSubscriptionStatus) => {
    updateSubscriptionStatus(subscription.clubId, newStatus);
    setFeedbackMessage(`Status langganan berjaya dikemas kini kepada ${newStatus}.`);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#FF3845]" />
          <span>Rekod & Sejarah Langganan SaaS</span>
        </div>
      }
      description={`Kelab: ${subscription.clubName} • ID: ${subscription.id}`}
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#96989F]">Tukar Status:</span>
            <select
              value={subscription.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as SaaSClubSubscriptionStatus)
              }
              className="px-2.5 py-1 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF3845] cursor-pointer"
            >
              <option value="ACTIVE">Aktif (ACTIVE)</option>
              <option value="TRIALING">Percubaan (TRIALING)</option>
              <option value="PAST_DUE">Tertunggak (PAST_DUE)</option>
              <option value="EXPIRED">Tamat (EXPIRED)</option>
              <option value="CANCELED">Batal (CANCELED)</option>
            </select>
          </div>

          <AdminButton variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </AdminButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Feedback message banner */}
        {feedbackMessage && (
          <div className="p-3.5 bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#4ADE80] rounded-lg text-xs flex items-center gap-2 font-medium admin-panel-enter">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Subscription Plan Summary Card */}
        <div className="p-4 bg-[#141519] border border-[#27272A] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[#96989F] uppercase font-semibold">
                Pelan Langganan Kelab
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                FighterX Standard — RM20.00 / bulan
              </h3>
            </div>
            <AdminBadge variant={currentBadge.variant} size="md" dot>
              {currentBadge.label}
            </AdminBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#202126] text-xs">
            <div>
              <span className="text-[#96989F]">Percubaan 30 Hari:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5">
                {new Date(subscription.trialStartDate).toLocaleDateString("ms-MY")} -{" "}
                {new Date(subscription.trialEndDate).toLocaleDateString("ms-MY")}
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Tempoh Pengebilan:</span>
              <p className="font-medium text-[#E5E5E7] mt-0.5">
                {subscription.billingPeriodStart
                  ? `${new Date(
                      subscription.billingPeriodStart
                    ).toLocaleDateString("ms-MY")} - ${new Date(
                      subscription.billingPeriodEnd || ""
                    ).toLocaleDateString("ms-MY")}`
                  : "Dalam Tempoh Percubaan"}
              </p>
            </div>
            <div>
              <span className="text-[#96989F]">Pembaharuan Seterusnya:</span>
              <p className="font-medium text-[#4ADE80] mt-0.5">
                {subscription.nextRenewalDate
                  ? new Date(subscription.nextRenewalDate).toLocaleDateString(
                      "ms-MY"
                    )
                  : "Belum ditetapkan"}
              </p>
            </div>
          </div>
        </div>

        {/* Section: Invoices & Payment History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-[#FF3845]" />
              Sejarah Invois & Transaksi ({subscription.paymentHistory.length})
            </h4>

            {/* Quick Simulate Payment Trigger */}
            <div className="flex items-center gap-2">
              <select
                value={selectedMethod}
                onChange={(e) =>
                  setSelectedMethod(
                    e.target.value as "FPX_ONLINE_BANKING" | "CARD" | "MANUAL_BANK_TRANSFER"
                  )
                }
                className="px-2 py-1 bg-[#202126] border border-[#37383D] rounded text-[11px] text-[#C5C6CA] focus:outline-none focus:border-[#FF3845] cursor-pointer"
              >
                <option value="FPX_ONLINE_BANKING">FPX Online Banking</option>
                <option value="CARD">Kad Kredit/Debit</option>
                <option value="MANUAL_BANK_TRANSFER">Pindahan Manual</option>
              </select>

              <AdminButton
                variant="primary"
                size="xs"
                onClick={handleSimulatePayment}
                loading={isSimulatingPayment}
                leftIcon={<PlusCircle className="w-3 h-3" />}
              >
                Rekod Bayaran (RM20)
              </AdminButton>
            </div>
          </div>

          {subscription.paymentHistory.length === 0 ? (
            <div className="p-6 bg-[#141519] border border-[#27272A] rounded-xl text-center space-y-2">
              <Receipt className="w-8 h-8 text-[#96989F] mx-auto opacity-50" />
              <p className="text-xs font-medium text-white">
                Tiada Sejarah Bayaran
              </p>
              <p className="text-[11px] text-[#96989F] max-w-sm mx-auto">
                Kelab ini sedang menikmati tempoh percubaan 30 hari percuma atau belum membuat transaksi pengebilan bulanan pertama.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#27272A] bg-[#141519] admin-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#1C1E24] border-b border-[#27272A] text-[11px] uppercase tracking-wider text-[#96989F] font-semibold">
                  <tr>
                    <th className="px-4 py-3">No. Invois</th>
                    <th className="px-4 py-3">Tarikh</th>
                    <th className="px-4 py-3">Kaedah</th>
                    <th className="px-4 py-3 text-right">Amaun</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202126] text-[#E5E5E7]">
                  {subscription.paymentHistory.map((item) => {
                    const invBadge = invoiceStatusBadgeConfig[item.status] || {
                      label: item.status,
                      variant: "neutral",
                    };
                    return (
                      <tr key={item.id} className="hover:bg-[#1A1C22]/60">
                        <td className="px-4 py-3 font-mono text-white font-medium">
                          {item.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-[#96989F]">
                          {new Date(item.paidAt).toLocaleDateString("ms-MY", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-[#C5C6CA]">
                          {item.paymentMethod.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-white">
                          RM {item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <AdminBadge variant={invBadge.variant} size="sm">
                            {invBadge.label}
                          </AdminBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3.5 bg-[#17191E] border border-[#37383D] rounded-xl flex items-start gap-3 text-xs text-[#96989F] leading-relaxed">
          <Info className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">
              Mod Simulasi SaaS Pentadbir:
            </span>{" "}
            FighterX mengamalkan penetapan harga telus RM20/kelab/bulan dengan 30 hari percubaan percuma. Tiada sambungan gateway luaran sebenar digunakan dalam persekitaran pratonton ini bagi melindungi data transaksi kewangan.
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
