"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Building2,
  User,
  Swords,
  Award,
  FileCheck2,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  ORGANIZATION_TYPES,
  TRAINING_VENUE_TYPES,
  type ClubRegistrationReceipt,
  type ClubRegistrationRequest,
  type OrganizationType,
  type TrainingVenueType,
  type RegistrationDiscipline,
} from "@/lib/club-registration/contract";
import { uiOnlyClubRegistrationService } from "@/lib/club-registration/ui-only-adapter";
import {
  getRegistrationStepErrors,
  PASSWORD_REQUIREMENTS,
  phoneFormatHint,
  validateRegistrationStep,
  type ClubRegistrationValues,
  type RegisterStep,
  type RegistrationFieldErrors,
} from "@/lib/club-registration/validation";
import { AssociationSelector } from "@/components/register-club/association-selector";
import { SILAT_AFFILIATIONS, resolveAffiliationId } from "@/lib/club-registration/affiliations-data";

const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Labuan",
];

const VENUE_TYPE_LABELS: Record<TrainingVenueType, string> = {
  DOJO: "Gelanggang Sendiri (Dojo Tetap)",
  OUTDOOR: "Gelanggang Terbuka / Padang Awam",
  SCHOOL: "Sekolah / Institusi Pendidikan",
  COMMUNITY_HALL: "Dewan Komuniti / Serbaguna",
};

const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  CLUB: "Kelab Silat (Club)",
  ACADEMY: "Akademi Persilatan (Academy)",
  ASSOCIATION: "Persatuan / Cawangan (Association)",
  OTHER: "Lain-lain Pertubuhan (Other)",
};

const FACILITY_OPTIONS = [
  "Matras Pertandingan (EVA Mat)",
  "Pelindung Badan (Body Protector)",
  "Peralatan Senjata Seni (Golok / Toya)",
  "Sistem Punching Bag / Pad Latihan",
  "Cermin Latihan Teknikal",
];

const INITIAL_VALUES: ClubRegistrationValues = {
  clubName: "",
  registrationNumber: "",
  organizationType: "",
  state: "",
  city: "",
  district: "",
  address: "",
  postalCode: "",

  representativeName: "",
  fullName: "",
  identificationNumber: "",
  phoneNumber: "",
  email: "",
  designation: "",
  position: "",
  password: "",
  confirmPassword: "",

  disciplines: ["SENI", "OLAHRAGA"],
  trainingVenueType: "DOJO",
  weeklySessions: 3,
  trainingSchedule: "Selasa, Khamis & Sabtu (8.00 - 10.30 malam)",
  trainingFacilities: [
    "Matras Pertandingan (EVA Mat)",
    "Pelindung Badan (Body Protector)",
  ],

  associationId: "pesaka-malaysia",
  customAffiliationName: "",

  agreedToTerms: false,
  termsAccepted: false,
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="register-field-error text-xs text-red-400 mt-1" id={id} role="alert">
      {message}
    </p>
  ) : null;
}

const STEP_METADATA: {
  step: RegisterStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { step: 1, label: "Maklumat Kelab", shortLabel: "Kelab", icon: Building2 },
  { step: 2, label: "Wakil & Hubungan", shortLabel: "Wakil", icon: User },
  { step: 3, label: "Disiplin & Gelanggang", shortLabel: "Disiplin", icon: Swords },
  { step: 4, label: "Gabungan Persatuan", shortLabel: "Gabungan", icon: Award },
  { step: 5, label: "Semakan & Hantar", shortLabel: "Semakan", icon: FileCheck2 },
];

function RegisterProgress({ step }: { step: RegisterStep }) {
  return (
    <div className="register-progress border-b border-[#37383d] bg-[#0c0d11] px-4 py-5 sm:px-8" aria-label={`Langkah ${step} daripada 5`}>
      <div className="relative mb-4 hidden sm:block">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-[#2d2e35]" aria-hidden="true">
          <span
            className="block h-full bg-red-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
        </div>
        <ol className="relative z-10 flex justify-between list-none p-0 m-0">
          {STEP_METADATA.map((item) => {
            const isCurrent = item.step === step;
            const isComplete = item.step < step;
            const Icon = item.icon;
            return (
              <li
                key={item.step}
                className="flex flex-col items-center"
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    isCurrent
                      ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-900/50 ring-4 ring-red-950"
                      : isComplete
                      ? "border-red-700 bg-red-900/80 text-white"
                      : "border-[#45464b] bg-[#16171b] text-neutral-400"
                  }`}
                >
                  {isComplete ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} />}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold tracking-wide ${
                    isCurrent ? "text-white" : isComplete ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile step bar */}
      <div className="flex sm:hidden items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
            {step}
          </span>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {STEP_METADATA[step - 1].label}
            </p>
            <p className="text-[10px] text-neutral-400">Langkah {step} daripada 5</p>
          </div>
        </div>
        <div className="w-24 h-1.5 rounded-full bg-[#2d2e35] overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryGroup({
  title,
  stepNumber,
  onEdit,
  children,
}: {
  title: string;
  stepNumber: RegisterStep;
  onEdit: (step: RegisterStep) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="register-summary-group rounded-lg border border-[#3e3f44] bg-[#101115] p-4 transition-colors hover:border-[#52535a]">
      <div className="flex items-center justify-between border-b border-[#2d2e35] pb-2.5 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 flex items-center justify-center text-[10px]">
            {stepNumber}
          </span>
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onEdit(stepNumber)}
          className="text-xs font-semibold text-red-400 hover:text-red-300 underline underline-offset-4 cursor-pointer"
        >
          Kemaskini
        </button>
      </div>
      {children}
    </section>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-1 sm:gap-3 py-1 text-xs">
      <dt className="text-neutral-400 font-medium">{label}</dt>
      <dd className="text-white font-semibold m-0 break-words">{children}</dd>
    </div>
  );
}

function SubmittedStatus({
  receipt,
  onReset,
}: {
  receipt?: ClubRegistrationReceipt;
  onReset: () => void;
}) {
  const appId = receipt?.applicationId || "FX-APP-2026-98124";
  const clubName = receipt?.clubName || "Kelab Silat";
  const repName = receipt?.representativeName || "Wakil Kelab";
  const association = receipt?.associationName || "PESAKA Malaysia";

  return (
    <section
      className="register-status mx-auto my-8 max-w-2xl rounded-xl border border-red-500/40 bg-gradient-to-b from-[#18191f] to-[#0c0d10] p-6 sm:p-10 text-center shadow-2xl shadow-black/80"
      aria-labelledby="register-status-title"
      aria-live="polite"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400">
        <Check size={32} strokeWidth={2.5} aria-hidden="true" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300 mb-3">
        <ShieldCheck size={14} /> STATUS: PENDING_APPROVAL
      </div>

      <h2
        id="register-status-title"
        className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white"
        style={{ fontFamily: "var(--font-athletic)" }}
      >
        Pendaftaran Kelab Diterima
      </h2>

      <p className="mt-2 text-sm text-neutral-300">
        Permohonan pendaftaran kelab anda telah berjaya dimuat naik ke dalam sistem FighterX.
      </p>

      {/* Official Receipt Card */}
      <div className="mt-6 rounded-lg border border-[#3e3f44] bg-[#0f1014] p-5 text-left">
        <div className="flex items-center justify-between border-b border-[#2d2e35] pb-3 mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              No. Rujukan Permohonan
            </p>
            <p className="text-lg font-mono font-bold text-red-400">{appId}</p>
          </div>
          <span className="rounded bg-red-950/60 border border-red-700/50 px-2.5 py-1 text-xs font-semibold text-red-300">
            FighterX Platform
          </span>
        </div>

        <dl className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <dt className="text-neutral-400">Nama Kelab:</dt>
            <dd className="font-semibold text-white text-right">{clubName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-400">Wakil Berdaftar:</dt>
            <dd className="font-semibold text-white text-right">{repName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-400">Gabungan Silat:</dt>
            <dd className="font-semibold text-white text-right">{association}</dd>
          </div>
          <div className="flex justify-between border-t border-[#2d2e35] pt-2">
            <dt className="text-neutral-400">Tempoh Percubaan:</dt>
            <dd className="font-semibold text-emerald-400 text-right">
              30 Hari Percuma (Bermula selepas pengaktifan)
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-400">Yuran Langganan:</dt>
            <dd className="font-semibold text-white text-right">
              RM20 / bulan (selepas tamat percubaan percuma)
            </dd>
          </div>
        </dl>
      </div>

      {/* Guidelines details */}
      <div className="mt-6 space-y-2 text-left text-xs text-neutral-300">
        <p className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-red-400 flex-none mt-0.5" />
          <span>
            <strong>Pengesahan Pentadbir Pusat:</strong> Pihak FighterX akan menyemak maklumat pendaftaran ROS/SSM/PJS dalam tempoh 1-2 hari bekerja.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <Check size={16} className="text-emerald-400 flex-none mt-0.5" />
          <span>
            <strong>Tiada Pembayaran Awal:</strong> Anda tidak dikenakan sebarang caj semasa pendaftaran. Pembayaran langganan bermula selepas tamat 30 hari percubaan.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <Sparkles size={16} className="text-amber-400 flex-none mt-0.5" />
          <span>
            <strong>Akses Ruang Kerja:</strong> Pautan pengaktifan akaun jurulatih dan pentadbir kelab akan dihantar ke e-mel rasmi wakil.
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#45464b] bg-[#1c1d23] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#252730] transition-colors cursor-pointer"
        >
          <Printer size={15} /> Cetak Resit Permohonan
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-md shadow-red-900/40 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} /> Daftar Kelab Baharu
        </button>
      </div>
    </section>
  );
}

export function RegisterClubForm() {
  const searchParams = useSearchParams();
  const urlAssociation = searchParams ? searchParams.get("association") : null;
  const [step, setStep] = useState<RegisterStep>(1);
  const [values, setValues] = useState<ClubRegistrationValues>(() => {
    if (urlAssociation) {
      const resolved = resolveAffiliationId(urlAssociation);
      return { ...INITIAL_VALUES, associationId: resolved || INITIAL_VALUES.associationId };
    }
    return INITIAL_VALUES;
  });
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receiptResult, setReceiptResult] = useState<ClubRegistrationReceipt | null>(null);
  const submittingRef = useRef(false);

  function updateField<K extends keyof ClubRegistrationValues>(
    field: K,
    val: ClubRegistrationValues[K]
  ) {
    setValues((prev) => {
      const next = { ...prev, [field]: val };
      // Keep aliases in sync
      if (field === "clubName") next.clubName = String(val);
      if (field === "representativeName") {
        next.representativeName = String(val);
        next.fullName = String(val);
      }
      if (field === "designation") {
        next.designation = String(val);
        next.position = String(val);
      }
      if (field === "city") {
        next.city = String(val);
        next.district = String(val);
      }
      if (field === "agreedToTerms") {
        next.agreedToTerms = Boolean(val);
        next.termsAccepted = Boolean(val);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  }

  function toggleDiscipline(disc: RegistrationDiscipline) {
    const current = values.disciplines || [];
    let updated: RegistrationDiscipline[];
    if (current.includes(disc)) {
      if (current.length === 1) return; // Keep at least one
      updated = current.filter((d) => d !== disc);
    } else {
      updated = [...current, disc];
    }
    updateField("disciplines", updated);
  }

  function toggleFacility(facility: string) {
    const current = values.trainingFacilities || [];
    const updated = current.includes(facility)
      ? current.filter((f) => f !== facility)
      : [...current, facility];
    updateField("trainingFacilities", updated);
  }

  function validateCurrentStep() {
    const stepErrors = validateRegistrationStep(step, values);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (step < 5) {
      setStep((current) => (current + 1) as RegisterStep);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((current) => (current - 1) as RegisterStep);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }

  function jumpToStep(targetStep: RegisterStep) {
    setStep(targetStep);
    setErrors({});
    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!validateCurrentStep()) return;

    const allErrors = getRegistrationStepErrors(values);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Find first failing step
      const firstInvalidStep = ([1, 2, 3, 4, 5] as const).find(
        (s) => Object.keys(validateRegistrationStep(s, values)).length > 0
      );
      if (firstInvalidStep) {
        setStep(firstInvalidStep);
      }
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      const request: ClubRegistrationRequest = {
        clubName: values.clubName.trim(),
        registrationNumber: values.registrationNumber.trim(),
        organizationType: values.organizationType as OrganizationType,
        state: values.state,
        city: values.city.trim(),
        address: values.address.trim(),
        postalCode: values.postalCode.trim(),

        representativeName: values.representativeName.trim(),
        identificationNumber: values.identificationNumber.trim(),
        email: values.email.trim(),
        phone: values.phoneNumber.trim(),
        designation: values.designation.trim(),
        password: values.password,

        disciplines: values.disciplines,
        trainingVenueType: values.trainingVenueType as TrainingVenueType,
        weeklySessions: values.weeklySessions,

        associationId: values.associationId,
        agreedToTerms: values.agreedToTerms,

        // Legacy format compatibility
        club: {
          name: values.clubName.trim(),
          type: values.organizationType as OrganizationType,
          state: values.state,
          district: values.city.trim(),
          address: values.address.trim(),
        },
        applicant: {
          fullName: values.representativeName.trim(),
          position: values.designation.trim(),
          phoneNumber: values.phoneNumber.trim(),
          email: values.email.trim(),
          password: values.password,
        },
        termsAccepted: true,
      };

      const result = await uiOnlyClubRegistrationService.register(request);
      if (result.status === "accepted" && result.receipt) {
        setReceiptResult(result.receipt);
        setValues((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else if (result.status === "preview-only" && result.receipt) {
        setReceiptResult(result.receipt);
      } else {
        setSubmitError(
          result.status === "error" || result.status === "unavailable"
            ? result.message
            : "Permohonan tidak dapat diproses. Sila cuba sebentar lagi."
        );
      }
    } catch {
      setSubmitError("Ralat sambungan. Sila pastikan sambungan internet aktif dan cuba lagi.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function handleReset() {
    setReceiptResult(null);
    setStep(1);
    setValues(INITIAL_VALUES);
    setErrors({});
  }

  if (receiptResult) {
    return <SubmittedStatus receipt={receiptResult} onReset={handleReset} />;
  }

  const selectedAffiliationObj = SILAT_AFFILIATIONS.find(
    (a) => a.id === values.associationId
  );

  return (
    <section
      className="register-form-shell rounded-xl border border-[#3e3f44] bg-gradient-to-b from-[#14161b] to-[#0c0d10] shadow-2xl shadow-black/70 overflow-hidden"
      aria-label="Borang Pendaftaran Kelab FighterX"
    >
      <RegisterProgress step={step} />

      <form
        className="register-form p-5 sm:p-8"
        onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}
        noValidate
      >
        <div className="register-step-panel min-h-[380px]">
          {/* STEP 1: Club Information */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#2d2e35] pb-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Langkah 1 daripada 5
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-display font-bold text-white uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-athletic)" }}
                >
                  Maklumat Asas Kelab
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Masukkan butiran rasmi kelab, akademi, atau persatuan silat anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-club-name" className="text-xs font-semibold text-neutral-300">
                    Nama Rasmi Kelab / Akademi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-club-name"
                    type="text"
                    value={values.clubName}
                    onChange={(e) => updateField("clubName", e.target.value)}
                    placeholder="Contoh: Akademi Silat Gayong Warisan Perkasa"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.clubName)}
                    aria-describedby={errors.clubName ? "reg-club-name-err" : undefined}
                  />
                  <FieldError id="reg-club-name-err" message={errors.clubName} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-org-number" className="text-xs font-semibold text-neutral-300">
                    No. Pendaftaran (ROS / SSM / PJS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-org-number"
                    type="text"
                    value={values.registrationNumber}
                    onChange={(e) => updateField("registrationNumber", e.target.value)}
                    placeholder="Contoh: PPM-012-10-14022018 / PJS/01/2020"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.registrationNumber)}
                    aria-describedby={errors.registrationNumber ? "reg-org-number-err" : undefined}
                  />
                  <FieldError id="reg-org-number-err" message={errors.registrationNumber} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-org-type" className="text-xs font-semibold text-neutral-300">
                    Jenis Organisasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-org-type"
                    value={values.organizationType}
                    onChange={(e) => updateField("organizationType", e.target.value as OrganizationType)}
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.organizationType)}
                    aria-describedby={errors.organizationType ? "reg-org-type-err" : undefined}
                  >
                    <option value="">Pilih Jenis Organisasi</option>
                    {ORGANIZATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {ORGANIZATION_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                  <FieldError id="reg-org-type-err" message={errors.organizationType} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-state" className="text-xs font-semibold text-neutral-300">
                    Negeri Operasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-state"
                    value={values.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.state)}
                    aria-describedby={errors.state ? "reg-state-err" : undefined}
                  >
                    <option value="">Pilih Negeri</option>
                    {MALAYSIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <FieldError id="reg-state-err" message={errors.state} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-city" className="text-xs font-semibold text-neutral-300">
                    Bandar / Daerah <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    value={values.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Contoh: Shah Alam / Petaling Jaya"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "reg-city-err" : undefined}
                  />
                  <FieldError id="reg-city-err" message={errors.city} />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-address" className="text-xs font-semibold text-neutral-300">
                    Alamat Lengkap Gelanggang / Pusat Latihan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reg-address"
                    rows={3}
                    value={values.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="No. lot, jalan, kawasan perumahan / komersial"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none resize-y"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "reg-address-err" : undefined}
                  />
                  <FieldError id="reg-address-err" message={errors.address} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-poskod" className="text-xs font-semibold text-neutral-300">
                    Poskod (5 digit angka) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-poskod"
                    type="text"
                    maxLength={5}
                    inputMode="numeric"
                    value={values.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, ""))}
                    placeholder="Contoh: 40000"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none font-mono"
                    aria-invalid={Boolean(errors.postalCode)}
                    aria-describedby={errors.postalCode ? "reg-poskod-err" : undefined}
                  />
                  <FieldError id="reg-poskod-err" message={errors.postalCode} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PIC & Representative */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#2d2e35] pb-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Langkah 2 daripada 5
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-display font-bold text-white uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-athletic)" }}
                >
                  Wakil Sah Kelab (PIC)
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Maklumat Guru Utama, Jurulatih Utama atau Setiausaha yang bertanggungjawab menguruskan akaun kelab.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="reg-rep-name" className="text-xs font-semibold text-neutral-300">
                    Nama Penuh Wakil (Mengikut MyKad) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-rep-name"
                    type="text"
                    value={values.representativeName}
                    onChange={(e) => updateField("representativeName", e.target.value)}
                    placeholder="Contoh: Farid bin Ahmad"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.representativeName)}
                    aria-describedby={errors.representativeName ? "reg-rep-name-err" : undefined}
                  />
                  <FieldError id="reg-rep-name-err" message={errors.representativeName} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-mykad" className="text-xs font-semibold text-neutral-300">
                    No. MyKad / Pasport <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-mykad"
                    type="text"
                    value={values.identificationNumber}
                    onChange={(e) => updateField("identificationNumber", e.target.value)}
                    placeholder="Contoh: 880512-10-5431"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none font-mono"
                    aria-invalid={Boolean(errors.identificationNumber)}
                    aria-describedby={errors.identificationNumber ? "reg-mykad-err" : undefined}
                  />
                  <FieldError id="reg-mykad-err" message={errors.identificationNumber} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="text-xs font-semibold text-neutral-300">
                    Nombor Telefon Bimbit (Malaysia) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    inputMode="tel"
                    value={values.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none font-mono"
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={errors.phoneNumber ? "reg-phone-err reg-phone-hint" : "reg-phone-hint"}
                  />
                  <p className="text-[11px] text-neutral-400" id="reg-phone-hint">
                    {phoneFormatHint(values.phoneNumber)}
                  </p>
                  <FieldError id="reg-phone-err" message={errors.phoneNumber} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-xs font-semibold text-neutral-300">
                    Alamat E-mel Rasmi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoCapitalize="none"
                    value={values.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="nama@kelab.my"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "reg-email-err" : undefined}
                  />
                  <FieldError id="reg-email-err" message={errors.email} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-designation" className="text-xs font-semibold text-neutral-300">
                    Jawatan Dalam Kelab <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-designation"
                    type="text"
                    value={values.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    placeholder="Contoh: Guru Utama / Ketua Jurulatih"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.designation)}
                    aria-describedby={errors.designation ? "reg-designation-err" : undefined}
                  />
                  <FieldError id="reg-designation-err" message={errors.designation} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="text-xs font-semibold text-neutral-300">
                    Kata Laluan Portal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Cipta kata laluan keselamatan"
                      className="w-full min-h-[44px] pl-3.5 pr-10 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "reg-password-err reg-pass-hint" : "reg-pass-hint"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                      aria-label={showPassword ? "Sembunyikan kata laluan" : "Tunjukkan kata laluan"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400" id="reg-pass-hint">
                    {PASSWORD_REQUIREMENTS}
                  </p>
                  <FieldError id="reg-password-err" message={errors.password} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="reg-confirm-password" className="text-xs font-semibold text-neutral-300">
                    Sahkan Kata Laluan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative max-w-sm">
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Ulang kata laluan"
                      className="w-full min-h-[44px] pl-3.5 pr-10 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? "reg-confirm-password-err" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                      aria-label={showConfirmPassword ? "Sembunyikan kata laluan" : "Tunjukkan kata laluan"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError id="reg-confirm-password-err" message={errors.confirmPassword} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Disciplines & Venue */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#2d2e35] pb-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Langkah 3 daripada 5
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-display font-bold text-white uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-athletic)" }}
                >
                  Disiplin Silat & Tempat Latihan
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Pilih cabang silat yang ditawarkan dan spesifikasi gelanggang latihan mingguan.
                </p>
              </div>

              {/* Disciplines Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Disiplin Silat Ditawarkan (Pilih Sekurang-kurangnya Satu) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => toggleDiscipline("SENI")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      values.disciplines.includes("SENI")
                        ? "border-red-500 bg-red-950/30 shadow-md ring-1 ring-red-500/80"
                        : "border-[#3e3f44] bg-[#121316] hover:border-neutral-500"
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-[#0b0c0f] border border-[#3e3f44] flex items-center justify-center text-red-400 flex-none">
                      <Award size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Silat Seni (Artistic)</span>
                        {values.disciplines.includes("SENI") && (
                          <span className="text-red-400"><Check size={16} strokeWidth={3} /></span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Tunggal (100 jurus baku), Ganda (tempur koreografi), Regu (sinkronisasi 3 pesilat) & Solo Bebas.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => toggleDiscipline("OLAHRAGA")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      values.disciplines.includes("OLAHRAGA")
                        ? "border-red-500 bg-red-950/30 shadow-md ring-1 ring-red-500/80"
                        : "border-[#3e3f44] bg-[#121316] hover:border-neutral-500"
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-[#0b0c0f] border border-[#3e3f44] flex items-center justify-center text-red-400 flex-none">
                      <Swords size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Silat Olahraga (Tanding Combat)</span>
                        {values.disciplines.includes("OLAHRAGA") && (
                          <span className="text-red-400"><Check size={16} strokeWidth={3} /></span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Pertarungan tanding sentuhan penuh mengikut zon mata, tangkapan 5 saat, sapuan & jatuhan.
                      </p>
                    </div>
                  </div>
                </div>
                <FieldError id="reg-disciplines-err" message={errors.disciplines} />
              </div>

              {/* Training Venue & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="reg-venue-type" className="text-xs font-semibold text-neutral-300">
                    Jenis Tempat Latihan (Venue) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-venue-type"
                    value={values.trainingVenueType}
                    onChange={(e) => updateField("trainingVenueType", e.target.value as TrainingVenueType)}
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white focus:border-red-500 focus:outline-none"
                    aria-invalid={Boolean(errors.trainingVenueType)}
                    aria-describedby={errors.trainingVenueType ? "reg-venue-err" : undefined}
                  >
                    <option value="">Pilih Jenis Tempat Latihan</option>
                    {TRAINING_VENUE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {VENUE_TYPE_LABELS[v]}
                      </option>
                    ))}
                  </select>
                  <FieldError id="reg-venue-err" message={errors.trainingVenueType} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-sessions" className="text-xs font-semibold text-neutral-300">
                    Kekerapan Sesi Seminggu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-sessions"
                    type="number"
                    min={1}
                    max={14}
                    value={values.weeklySessions}
                    onChange={(e) => updateField("weeklySessions", parseInt(e.target.value, 10) || 1)}
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    aria-invalid={Boolean(errors.weeklySessions)}
                    aria-describedby={errors.weeklySessions ? "reg-sessions-err" : undefined}
                  />
                  <FieldError id="reg-sessions-err" message={errors.weeklySessions} />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-schedule" className="text-xs font-semibold text-neutral-300">
                    Jadual Latihan Mingguan (Ringkasan)
                  </label>
                  <input
                    id="reg-schedule"
                    type="text"
                    value={values.trainingSchedule}
                    onChange={(e) => updateField("trainingSchedule", e.target.value)}
                    placeholder="Contoh: Isnin, Rabu, Jumaat (8.00 - 10.00 malam)"
                    className="w-full min-h-[44px] px-3.5 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Facilities Checklist */}
                <div className="sm:col-span-2 space-y-2 pt-2">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Kemudahan & Peralatan Tersedia di Gelanggang
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {FACILITY_OPTIONS.map((facility) => {
                      const checked = values.trainingFacilities.includes(facility);
                      return (
                        <label
                          key={facility}
                          className={`flex items-center gap-2 p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                            checked
                              ? "border-red-500/70 bg-red-950/20 text-white"
                              : "border-[#3e3f44] bg-[#0e0f12] text-neutral-400 hover:border-neutral-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFacility(facility)}
                            className="rounded accent-red-600"
                          />
                          <span>{facility}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Association Affiliation Selector */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="border-b border-[#2d2e35] pb-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Langkah 4 daripada 5
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-display font-bold text-white uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-athletic)" }}
                >
                  Pilihan Gabungan Persatuan
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Pilih badan induk negeri atau perguruan silat naungan kelab daripada direktori 26 persatuan Silat Malaysia & Antarabangsa, atau pilih Kelab Bebas.
                </p>
              </div>

              <AssociationSelector
                selectedId={values.associationId}
                onSelect={(id) => updateField("associationId", id)}
                error={errors.associationId}
              />
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#2d2e35] pb-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Langkah 5 daripada 5
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-display font-bold text-white uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-athletic)" }}
                >
                  Semakan Maklumat & Pengesahan
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Sila semak ketepatan semua maklumat sebelum menghantar permohonan pendaftaran kelab anda.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <SummaryGroup title="Maklumat Kelab" stepNumber={1} onEdit={jumpToStep}>
                  <dl className="divide-y divide-[#23242a]">
                    <SummaryRow label="Nama Kelab">{values.clubName || "—"}</SummaryRow>
                    <SummaryRow label="No. Pendaftaran">{values.registrationNumber || "—"}</SummaryRow>
                    <SummaryRow label="Jenis Organisasi">
                      {values.organizationType ? ORGANIZATION_TYPE_LABELS[values.organizationType] : "—"}
                    </SummaryRow>
                    <SummaryRow label="Lokasi">
                      {[values.city, values.state, values.postalCode].filter(Boolean).join(", ")}
                    </SummaryRow>
                    <SummaryRow label="Alamat">{values.address || "—"}</SummaryRow>
                  </dl>
                </SummaryGroup>

                <SummaryGroup title="Wakil Sah (PIC)" stepNumber={2} onEdit={jumpToStep}>
                  <dl className="divide-y divide-[#23242a]">
                    <SummaryRow label="Nama Wakil">{values.representativeName || "—"}</SummaryRow>
                    <SummaryRow label="No. MyKad">{values.identificationNumber || "—"}</SummaryRow>
                    <SummaryRow label="Jawatan">{values.designation || "—"}</SummaryRow>
                    <SummaryRow label="Telefon">{values.phoneNumber || "—"}</SummaryRow>
                    <SummaryRow label="E-mel">{values.email || "—"}</SummaryRow>
                  </dl>
                </SummaryGroup>

                <SummaryGroup title="Disiplin & Gelanggang" stepNumber={3} onEdit={jumpToStep}>
                  <dl className="divide-y divide-[#23242a]">
                    <SummaryRow label="Disiplin">
                      <div className="flex flex-wrap gap-1">
                        {values.disciplines.map((d) => (
                          <span
                            key={d}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800"
                          >
                            {d === "SENI" ? "Silat Seni" : "Silat Olahraga"}
                          </span>
                        ))}
                      </div>
                    </SummaryRow>
                    <SummaryRow label="Jenis Tempat">
                      {values.trainingVenueType ? VENUE_TYPE_LABELS[values.trainingVenueType] : "—"}
                    </SummaryRow>
                    <SummaryRow label="Kekerapan">{values.weeklySessions} sesi seminggu</SummaryRow>
                    <SummaryRow label="Jadual">{values.trainingSchedule || "—"}</SummaryRow>
                  </dl>
                </SummaryGroup>

                <SummaryGroup title="Gabungan Persatuan" stepNumber={4} onEdit={jumpToStep}>
                  <div className="flex items-center gap-3 py-1">
                    {selectedAffiliationObj && (
                      <div className="w-10 h-10 rounded bg-[#0b0c0f] border border-[#3e3f44] flex items-center justify-center p-1 flex-none overflow-hidden">
                        <Image
                          src={selectedAffiliationObj.logoUrl}
                          alt={selectedAffiliationObj.shortName}
                          width={36}
                          height={36}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {selectedAffiliationObj ? selectedAffiliationObj.shortName : "Kelab Bebas"}
                      </p>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">
                        {selectedAffiliationObj ? selectedAffiliationObj.name : "Tiada gabungan rasmi"}
                      </p>
                    </div>
                  </div>
                </SummaryGroup>
              </div>

              {/* Pricing & Free Trial Terms Box */}
              <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-950/20 via-[#15171d] to-[#15171d] p-4 text-xs">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-red-400 flex-none mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Pakej Langganan Kelab FighterX
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
                      <li>
                        <strong>Percubaan 30 Hari Percuma:</strong> Tempoh percubaan hanya bermula secara rasmi setelah akaun diluluskan dan diaktifkan oleh Pentadbir Pusat FighterX.
                      </li>
                      <li>
                        <strong>Yuran Selepas Percubaan:</strong> RM20 / bulan bagi setiap kelab selepas tamat 30 hari percubaan percuma.
                      </li>
                      <li>
                        <strong>Tanpa Pembayaran Awal:</strong> Tiada butiran kad kredit atau pembayaran diminta pada peringkat pendaftaran ini.
                      </li>
                      <li>
                        <strong>Pengasingan Data & Privasi:</strong> Data pendaftaran pesilat, program latihan dan profil jurulatih diasingkan mengikut standard keselamatan organisasi FighterX.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#3e3f44] bg-[#0c0d10] cursor-pointer hover:border-neutral-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={values.agreedToTerms}
                    onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-red-600 flex-none cursor-pointer"
                    aria-invalid={Boolean(errors.agreedToTerms)}
                    aria-describedby={errors.agreedToTerms ? "reg-terms-err" : undefined}
                  />
                  <span className="text-xs text-neutral-300 leading-relaxed">
                    Saya mengesahkan bahawa saya merupakan wakil yang diberi kuasa bagi pihak kelab ini dan bersetuju dengan{" "}
                    <strong className="text-white">Terma Perkhidmatan</strong> serta{" "}
                    <strong className="text-white">Notis Privasi FighterX</strong>.
                  </span>
                </label>
                <FieldError id="reg-terms-err" message={errors.agreedToTerms} />
              </div>
            </div>
          )}
        </div>

        {submitError && (
          <div className="mt-4 p-3 rounded-md border border-red-500/50 bg-red-950/40 text-red-200 text-xs">
            {submitError}
          </div>
        )}

        {/* Form Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-[#37383d] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md border border-[#45464b] bg-[#1a1b20] px-4 py-2.5 text-xs font-bold text-neutral-200 hover:bg-[#23242c] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
              <LockKeyhole size={13} className="text-red-400" />
              Pendaftaran selamat tanpa bayaran awal
            </span>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-md shadow-red-950/50 transition-all cursor-pointer ml-auto"
            >
              Langkah Seterusnya <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-700 px-7 py-2.5 text-xs font-bold text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-950/60 transition-all cursor-pointer disabled:opacity-60 ml-auto"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses Pendaftaran…
                </>
              ) : (
                <>
                  Hantar Pendaftaran Kelab <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
