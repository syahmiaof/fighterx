"use client";

import React, { useState } from "react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { LekirBotConfig } from "@/lib/admin/types";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { LekirBotSimulator } from "./lekir-bot-simulator";
import {
  Bot,
  ShieldCheck,
  Lock,
  Activity,
  Sliders,
  Database,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Server,
  KeyRound,
  Save,
} from "lucide-react";

const STANDARD_KNOWLEDGE_SOURCES = [
  "Pangkalan Data Artikel Knowledge Hub",
  "Program Latihan Induk Kebangsaan 2027",
  "Perpustakaan Latihan Silat FighterX",
  "Buku Peraturan PESAKA/PERSILAT 2027",
  "Garis Panduan Pengkondisian & Pemakanan ISN",
];

const DEFAULT_SYSTEM_PROMPT = `Anda ialah Lekir Bot, pembantu kecerdasan buatan rasmi bagi Platform Atlet Silat FighterX.
Peranan anda:
1. Memberikan bimbingan latihan berpandukan Kerangka Latihan Induk FighterX 2027.
2. Menghuraikan peraturan pertandingan Silat Seni dan Silat Olahraga mengikut piawaian PESAKA/PERSILAT 2027.
3. Memberikan panduan sains sukan asas (hidrasi, pemulihan otot, jadual rehat).

PANDUAN KESELAMATAN KETAT:
- DILARANG sama sekali mengeluarkan sebarang pelepasan atau pengesahan perubatan (Medical Clearance). Sebarang status kecederaan mesti merujuk pegawai perubatan atau jurulatih bertauliah.
- DILARANG menetapkan beban latihan melampau tanpa hari rehat yang sah.
- DILARANG mendedahkan maklumat peribadi atau sulit kelab/atlet.`;

function LekirBotSettingsInner({
  lekirBotConfig,
  onSaveConfig,
}: {
  lekirBotConfig: LekirBotConfig;
  onSaveConfig: (payload: Partial<LekirBotConfig>) => void;
}) {
  // Local Form State initialized directly from props
  const [isBotActive, setIsBotActive] = useState(lekirBotConfig.isBotActive);
  const [modelIdentifier, setModelIdentifier] = useState(lekirBotConfig.modelIdentifier);
  const [systemPrompt, setSystemPrompt] = useState(lekirBotConfig.systemPrompt);
  const [safetyThresholds, setSafetyThresholds] = useState(lekirBotConfig.safetyThresholds);
  const [allowedSources, setAllowedSources] = useState<string[]>(lekirBotConfig.allowedSources);
  const [autoReviewEnabled, setAutoReviewEnabled] = useState(lekirBotConfig.autoReviewEnabled);
  const [temperature, setTemperature] = useState(lekirBotConfig.temperature);
  const [maxTokens, setMaxTokens] = useState(lekirBotConfig.maxTokens);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save handler
  const handleSave = () => {
    const payload: Partial<LekirBotConfig> = {
      isBotActive,
      modelIdentifier: modelIdentifier.trim() || "Lekir-V1-Core",
      systemPrompt: systemPrompt.trim(),
      safetyThresholds,
      allowedSources,
      autoReviewEnabled,
      temperature,
      maxTokens,
    };

    onSaveConfig(payload);
    showToast("Konfigurasi dasar Lekir Bot telah berjaya dikemaskini.");
  };

  // Reset Prompt Handler
  const handleResetPrompt = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    showToast("Arahan sistem telah dipulihkan kepada teks lalai FighterX 2027.");
  };

  // Toggle Source Handler
  const handleToggleSource = (sourceName: string) => {
    setAllowedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((s) => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  // Calculated Prompt Stats
  const charCount = systemPrompt.length;
  const estimatedTokens = Math.round(charCount / 4);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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

      {/* AI Health Status & Master Toggle Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Master Bot Status Card */}
        <AdminCard glow={isBotActive ? "red" : "none"} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#96989F]">
                Enjin Utama AI
              </span>
              <AdminBadge variant={isBotActive ? "success" : "danger"} size="sm" pulseDot={isBotActive}>
                {isBotActive ? "Aktif (Online)" : "Dinyahaktif (Offline)"}
              </AdminBadge>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Lekir Bot Assistant
                </h3>
                <p className="text-xs text-[#96989F]">{modelIdentifier}</p>
              </div>
            </div>
            <p className="text-xs text-[#C5C6CA] mt-3 leading-relaxed">
              Membimbing atlet dan jurulatih berpandukan buku peraturan rasmi PESAKA 2027 dan protokol sains sukan ISN.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#27272A] flex items-center justify-between">
            <span className="text-xs text-[#96989F]">Suis Kuasa Bot:</span>
            <button
              type="button"
              onClick={() => setIsBotActive(!isBotActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isBotActive
                  ? "bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/40 hover:bg-[#EF4444]/30"
                  : "bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]/40 hover:bg-[#22C55E]/30"
              }`}
            >
              {isBotActive ? "Nyahaktifkan Bot" : "Aktifkan Bot"}
            </button>
          </div>
        </AdminCard>

        {/* AI Health Indicators */}
        <AdminCard glow="subtle" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#96989F]">
                Status Kesihatan & Operasi AI
              </span>
              <Activity className="w-4 h-4 text-[#4ADE80]" />
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5C6CA]">Purata Latensi Respons</span>
                <span className="font-mono font-bold text-[#4ADE80]">142 ms</span>
              </div>
              <div className="w-full h-1.5 bg-[#202126] rounded-full overflow-hidden">
                <div className="h-full bg-[#4ADE80] w-[95%]" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5C6CA]">Kadar Masa Beroperasi (Uptime)</span>
                <span className="font-mono font-bold text-white">99.98%</span>
              </div>
              <div className="w-full h-1.5 bg-[#202126] rounded-full overflow-hidden">
                <div className="h-full bg-[#38BDF8] w-[99%]" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5C6CA]">Pematuhan Sekatan Keselamatan</span>
                <span className="font-mono font-bold text-[#4ADE80]">100% (Tiada Pelanggaran)</span>
              </div>
              <div className="w-full h-1.5 bg-[#202126] rounded-full overflow-hidden">
                <div className="h-full bg-[#4ADE80] w-full" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272A] text-[11px] text-[#96989F] flex items-center justify-between">
            <span>Penyegerakan Terakhir:</span>
            <span className="font-mono text-white">
              {new Date(lekirBotConfig.lastUpdated).toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </AdminCard>

        {/* STRICT SECURITY: Server-Side API Key Binding Masked Placeholder */}
        <AdminCard glow="subtle" className="flex flex-col justify-between border-l-4 border-[#38BDF8]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Kawalan Keselamatan Kunci API
              </span>
              <AdminBadge variant="info" size="sm">
                Server-Side Only
              </AdminBadge>
            </div>

            <div className="mt-3 space-y-2">
              <label className="block text-[11px] font-semibold text-[#96989F]">
                Pemboleh Ubah Persekitaran Rahsia (Environment Secret):
              </label>
              <div className="relative">
                <input
                  type="password"
                  readOnly
                  value="GEMINI_PRO_SECURE_SERVER_KEY_INJECTED_AT_RUNTIME_NO_CLIENT_LEAK"
                  className="w-full px-3 py-2 bg-[#121316] border border-[#27272A] rounded-lg text-xs font-mono text-[#96989F] cursor-not-allowed select-none"
                />
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#96989F]" />
              </div>
              <p className="text-[11px] text-[#4ADE80] flex items-center gap-1 font-mono">
                <Server className="w-3 h-3" />
                <span>[BOUND_TO_SERVER_ENV: GEMINI_API_KEY]</span>
              </p>
            </div>

            <p className="text-[11px] text-[#C5C6CA] mt-3 leading-relaxed">
              <strong className="text-white">Kawalan Keselamatan Ketat:</strong> Kunci API persendirian AI tidak sekali-kali didedahkan pada kod pelayar, borang, atau storan tempatan (localStorage). Semua panggilan model dilaksanakan secara selamat di pelayan bahagian belakang (server-side runtime).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272A] text-[10px] text-[#96989F]">
            Status: Dilindungi oleh Polisi Zero-Exposure FighterX
          </div>
        </AdminCard>
      </div>

      {/* Safety Thresholds Guardrails */}
      <AdminCard glow="subtle" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF3845]" />
              Dasar & Penapis Keselamatan Sukan (Safety Thresholds)
            </h4>
            <p className="text-xs text-[#96989F] mt-0.5">
              Menghalang bot daripada membuat tindakan yang membahayakan atlet atau melanggar etika sukan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Medical Block */}
          <div className="p-4 bg-[#202126] border border-[#27272A] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Sekat Pelepasan Perubatan
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    safetyThresholds.blockMedicalClearancePrescription
                      ? "bg-[#4ADE80]"
                      : "bg-[#EF4444]"
                  }`}
                />
              </div>
              <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
                Menghalang AI daripada mengeluarkan pengesahan kelayakan bertanding (Medical Clearance) bagi pesilat cedera. Pelepasan WAJIB melalui pengesahan manusia.
              </p>
            </div>
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#27272A]">
              <span className="text-[11px] text-[#C5C6CA] font-semibold">
                Kuat Kuasa Sekatan
              </span>
              <input
                type="checkbox"
                checked={safetyThresholds.blockMedicalClearancePrescription}
                onChange={(e) =>
                  setSafetyThresholds({
                    ...safetyThresholds,
                    blockMedicalClearancePrescription: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
              />
            </label>
          </div>

          {/* Unsafe Loads Block */}
          <div className="p-4 bg-[#202126] border border-[#27272A] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Sekat Beban Latihan Melampau
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    safetyThresholds.blockUnsafeTrainingLoads
                      ? "bg-[#4ADE80]"
                      : "bg-[#EF4444]"
                  }`}
                />
              </div>
              <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
                Menghalang bot daripada mencadangkan rutin 7 hari berterusan tanpa rehat atau intensiti berbahaya yang melebihi ambang kardiovaskular atlet.
              </p>
            </div>
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#27272A]">
              <span className="text-[11px] text-[#C5C6CA] font-semibold">
                Kuat Kuasa Sekatan
              </span>
              <input
                type="checkbox"
                checked={safetyThresholds.blockUnsafeTrainingLoads}
                onChange={(e) =>
                  setSafetyThresholds({
                    ...safetyThresholds,
                    blockUnsafeTrainingLoads: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
              />
            </label>
          </div>

          {/* Unauthorized Data Disclosure */}
          <div className="p-4 bg-[#202126] border border-[#27272A] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Sekat Pendedahan Data Sulit
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    safetyThresholds.blockUnauthorizedDataExposure
                      ? "bg-[#4ADE80]"
                      : "bg-[#EF4444]"
                  }`}
                />
              </div>
              <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
                Menapis maklumat sulit seperti nombor kad pengenalan (IC), butiran kewangan kelab, atau rekod peribadi daripada dipaparkan dalam perbualan terbuka.
              </p>
            </div>
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#27272A]">
              <span className="text-[11px] text-[#C5C6CA] font-semibold">
                Kuat Kuasa Sekatan
              </span>
              <input
                type="checkbox"
                checked={safetyThresholds.blockUnauthorizedDataExposure}
                onChange={(e) =>
                  setSafetyThresholds({
                    ...safetyThresholds,
                    blockUnauthorizedDataExposure: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
              />
            </label>
          </div>
        </div>
      </AdminCard>

      {/* Allowed Knowledge Sources & Hyperparameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Allowed Knowledge Sources */}
        <AdminCard glow="subtle" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#38BDF8]" />
                Sumber Kurikulum Dibenarkan (RAG Sources)
              </h4>
              <p className="text-xs text-[#96989F] mt-0.5">
                Bot hanya dibenarkan merujuk dan memetik dokumen daripada sumber rasmi ini.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {STANDARD_KNOWLEDGE_SOURCES.map((source) => {
              const isChecked = allowedSources.includes(source);
              return (
                <label
                  key={source}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#202126] border-[#38BDF8]/40 text-white"
                      : "bg-[#17191E] border-[#27272A] text-[#96989F]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSource(source)}
                      className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
                    />
                    <span className="text-xs font-semibold">{source}</span>
                  </div>
                  {isChecked && (
                    <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      Aktif
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="p-3 bg-[#121316] border border-[#27272A] rounded-lg">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReviewEnabled}
                onChange={(e) => setAutoReviewEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
              />
              <div>
                <span className="text-xs font-bold text-white">
                  Semakan Awal Automatik (Auto-Review Submissions)
                </span>
                <p className="text-[11px] text-[#96989F]">
                  Lekir Bot menjalankan analisis kualiti awal sebelum jurulatih mengesahkan video latihan.
                </p>
              </div>
            </label>
          </div>
        </AdminCard>

        {/* Hyperparameters & Model Config */}
        <AdminCard glow="subtle" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FBBF24]" />
                Parameter Model & Penalaan (Hyperparameters)
              </h4>
              <p className="text-xs text-[#96989F] mt-0.5">
                Kawalan kestabilan output dan had panjang token respons model.
              </p>
            </div>
          </div>

          {/* Model ID */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
              Pengecam Model (Model Identifier)
            </label>
            <input
              type="text"
              value={modelIdentifier}
              onChange={(e) => setModelIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#C5C6CA]">
                Ketepatan / Ketetapan (Temperature: {temperature})
              </label>
              <span className="text-[11px] text-[#96989F]">
                {temperature <= 0.3 ? "Ketat & Konsisten" : "Kreatif & Bebas"}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#E10600] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#96989F] mt-1">
              <span>0.0 (Fakta Peraturan)</span>
              <span>0.5 (Seimbang)</span>
              <span>1.0 (Kreatif)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
              Had Token Maksimum (Max Tokens)
            </label>
            <input
              type="number"
              min="256"
              max="4096"
              step="128"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
            />
            <p className="text-[11px] text-[#96989F] mt-1">
              Had panjang huraian bagi setiap jawapan yang dihasilkan (256 - 4,096 tokens).
            </p>
          </div>
        </AdminCard>
      </div>

      {/* System Instructions / Prompt Engineering */}
      <AdminCard glow="subtle" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF3845]" />
              Arahan Sistem Utama (System Prompt Instructions)
            </h4>
            <p className="text-xs text-[#96989F] mt-0.5">
              Konteks asas, nada percakapan, batasan etika dan mandat peranan Lekir Bot.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#96989F]">
              {charCount} aksara (~{estimatedTokens} token)
            </span>
            <AdminButton
              variant="ghost"
              size="xs"
              onClick={handleResetPrompt}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Pulihkan Asal
            </AdminButton>
          </div>
        </div>

        <div>
          <textarea
            rows={10}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full px-4 py-3 bg-[#121316] border border-[#27272A] rounded-xl text-sm font-mono text-white leading-relaxed focus:outline-none focus:border-[#E10600] resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-[#96989F]">
            Sebarang perubahan pada prompt akan berkuat kuasa serta-merta bagi semua pengguna platform.
          </p>

          <AdminButton
            variant="primary"
            size="md"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Simpan Konfigurasi Lekir Bot
          </AdminButton>
        </div>
      </AdminCard>

      {/* Interactive Simulator / Playground */}
      <LekirBotSimulator
        config={{
          ...lekirBotConfig,
          isBotActive,
          modelIdentifier,
          systemPrompt,
          safetyThresholds,
          allowedSources,
          autoReviewEnabled,
          temperature,
          maxTokens,
        }}
      />
    </div>
  );
}

export function LekirBotSettings() {
  const { lekirBotConfig } = useAdminState();
  const { updateLekirBotConfig } = useAdminActions();

  return (
    <LekirBotSettingsInner
      key={lekirBotConfig.lastUpdated || "default-lekir"}
      lekirBotConfig={lekirBotConfig}
      onSaveConfig={updateLekirBotConfig}
    />
  );
}
