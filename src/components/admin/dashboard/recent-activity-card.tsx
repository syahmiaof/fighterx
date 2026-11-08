"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export function RecentActivityCard() {
  const [viewMode, setViewMode] = useState<"FEES" | "AUDIT">("FEES");

  // Representative fee/subscription records matching mockup
  const subscriptionRecords = [
    {
      id: "rec-1",
      name: "Aiman Hakim",
      club: "Gelanggang TVETMARA Besut",
      amount: "RM20",
      date: "8 Mac 2027",
      status: "PAID",
      statusLabel: "Dibayar",
      icon: CheckCircle,
      iconColor: "text-[#4ADE80]",
    },
    {
      id: "rec-2",
      name: "Siti Humaira",
      club: "Pusaka Gayong Kuala Terengganu",
      amount: "RM20",
      date: "8 Mac 2027",
      status: "TRIAL",
      statusLabel: "Percubaan Aktif",
      icon: CheckCircle,
      iconColor: "text-[#4ADE80]",
    },
    {
      id: "rec-3",
      name: "Faiz Irfan",
      club: "Akademi Silat Laksamana Pahang",
      amount: "RM20",
      date: "Menunggu",
      status: "PENDING",
      statusLabel: "Menunggu FPX",
      icon: Clock,
      iconColor: "text-[#FBBF24]",
    },
    {
      id: "rec-4",
      name: "Nur Alya",
      club: "Kelab Silat Helang Putih",
      amount: "RM20",
      date: "Tertunggak",
      status: "PAST_DUE",
      statusLabel: "Lewat Bayar",
      icon: XCircle,
      iconColor: "text-[#F87171]",
    },
  ];

  // Platform Audit Activity Log
  const auditLogs = [
    {
      id: "log-1",
      title: "Kelab Baru Diluluskan",
      desc: "Gelanggang TVETMARA Besut telah diaktifkan ke dalam direktori.",
      timestamp: "Hari ini, 10:45 AM",
      icon: Building,
      iconColor: "text-[#4ADE80]",
    },
    {
      id: "log-2",
      title: "Pendaftaran 4 Atlet Baru",
      desc: "Silat Olahraga Kelas C & Silat Seni Tunggal didaftarkan.",
      timestamp: "Semalam, 4:15 PM",
      icon: UserPlus,
      iconColor: "text-[#60A5FA]",
    },
    {
      id: "log-3",
      title: "Kemas Kini Rubrik Ujian",
      desc: "Bateri Ujian Kecergasan Fizikal ISN 2027 dikemaskini.",
      timestamp: "5 Mac 2027",
      icon: ShieldCheck,
      iconColor: "text-[#FF3845]",
    },
  ];

  return (
    <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#22C55E]/15 text-[#4ADE80]">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Rekod Yuran & Langganan (Bulan Ini)
            </h3>
            <p className="text-xs text-[#96989F]">
              Kemas kini status pembayaran yuran bulanan RM20/kelab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "FEES" ? "AUDIT" : "FEES")}
            className="text-[11px] px-2 py-1 bg-[#202126] hover:bg-[#282A32] text-[#C5C6CA] rounded border border-[#27272A] transition-colors"
          >
            {viewMode === "FEES" ? "Log Audit" : "Yuran"}
          </button>

          <Link
            href="/admin/subscriptions"
            className="text-xs font-bold text-[#FF555A] hover:text-[#FF3845] flex items-center gap-1 transition-colors group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Content depending on viewMode */}
      <div className="space-y-2 flex-1">
        {viewMode === "FEES" ? (
          subscriptionRecords.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#202126] border border-[#27272A] hover:border-[#37383D] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 ${item.iconColor} flex-shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#96989F] truncate">
                      {item.club}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div className="text-xs sm:text-sm font-bold font-mono text-white">
                    {item.amount}
                  </div>
                  <div
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.status === "PAID" || item.status === "TRIAL"
                        ? "bg-[#22C55E]/15 text-[#4ADE80]"
                        : item.status === "PENDING"
                        ? "bg-[#F59E0B]/15 text-[#FBBF24]"
                        : "bg-[#EF4444]/15 text-[#F87171]"
                    }`}
                  >
                    {item.date}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          auditLogs.map((log) => {
            const Icon = log.icon;
            return (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#202126] border border-[#27272A] flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#17191E] border border-[#27272A] mt-0.5">
                  <Icon className={`w-4 h-4 ${log.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {log.title}
                  </div>
                  <div className="text-[11px] text-[#96989F] mt-0.5">
                    {log.desc}
                  </div>
                  <div className="text-[10px] text-[#696A71] mt-1 font-mono">
                    {log.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#96989F]">
        <span>Yuran SaaS: <strong>RM20 / kelab / bulan</strong></span>
        <span>Kadar Pembayaran: <strong className="text-[#4ADE80]">85.7%</strong></span>
      </div>
    </div>
  );
}
