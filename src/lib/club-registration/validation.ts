import type {
  OrganizationType,
  TrainingVenueType,
  RegistrationDiscipline,
} from "@/lib/club-registration/contract";

export type RegisterStep = 1 | 2 | 3 | 4 | 5;

export type ClubRegistrationValues = {
  // Step 1: Club Information
  clubName: string;
  registrationNumber: string;
  organizationType: OrganizationType | "";
  state: string;
  city: string;
  district?: string; // alias for city
  address: string;
  postalCode: string;

  // Step 2: PIC & Contact
  representativeName: string;
  fullName?: string; // alias
  identificationNumber: string;
  phoneNumber: string;
  email: string;
  designation: string;
  position?: string; // alias
  password: string;
  confirmPassword: string;

  // Step 3: Disciplines & Training Setup
  disciplines: RegistrationDiscipline[];
  trainingVenueType: TrainingVenueType | "";
  weeklySessions: number;
  trainingSchedule: string;
  trainingFacilities: string[];

  // Step 4: Association Affiliation
  associationId: string;
  customAffiliationName?: string;

  // Step 5: Terms & Consent
  agreedToTerms: boolean;
  termsAccepted?: boolean; // alias
};

export type RegistrationFieldErrors = Partial<Record<keyof ClubRegistrationValues | "general", string>>;

export const PASSWORD_REQUIREMENTS_BM = "12 aksara minimum; mesti ada huruf besar, huruf kecil, nombor dan simbol.";
export const PASSWORD_REQUIREMENTS_EN = "Minimum 12 characters; must include uppercase, lowercase, number, and symbol.";
export const PASSWORD_REQUIREMENTS = PASSWORD_REQUIREMENTS_BM;

export function isValidMalaysianPhone(value: string): boolean {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:\+?60|0)?1\d{8,9}$/.test(compact);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

export function isValidIdentityNumber(value: string): boolean {
  const clean = value.replace(/[\s-]/g, "");
  // MyKad: 12 numeric digits
  if (/^\d{12}$/.test(clean)) return true;
  // Foreign passport: alphanumeric 6 to 15 chars
  if (/^[A-Za-z0-9]{6,15}$/.test(clean)) return true;
  return false;
}

export function hasSecurePassword(value: string): boolean {
  return (
    value.length >= 12 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function phoneFormatHint(value: string, locale: "en" | "bm" = "bm"): string {
  if (locale === "en") {
    return isValidMalaysianPhone(value)
      ? "Valid Malaysian phone number."
      : "Example format: 012-345 6789 or +60 12-345 6789.";
  }
  return isValidMalaysianPhone(value)
    ? "Nombor telefon Malaysia sah diterima."
    : "Contoh format: 012-345 6789 atau +60 12-345 6789.";
}

export function validateRegistrationStep(
  step: RegisterStep,
  values: ClubRegistrationValues,
  locale: "en" | "bm" = "bm"
): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};
  const isEn = locale === "en";

  if (step === 1) {
    if (values.clubName.trim().length < 3) {
      errors.clubName = isEn
        ? "Enter club name of at least 3 characters."
        : "Masukkan nama kelab sekurang-kurangnya 3 aksara.";
    }
    if (values.registrationNumber.trim().length < 3) {
      errors.registrationNumber = isEn
        ? "Enter official registration number (ROS / SSM / PJS)."
        : "Masukkan nombor pendaftaran rasmi (ROS / SSM / PJS).";
    }
    if (!values.organizationType) {
      errors.organizationType = isEn
        ? "Please select organization type."
        : "Sila pilih jenis organisasi.";
    }
    if (!values.state) {
      errors.state = isEn
        ? "Please select operating state."
        : "Sila pilih negeri operasi kelab.";
    }
    const cityVal = (values.city || values.district || "").trim();
    if (cityVal.length < 2) {
      errors.city = isEn
        ? "Enter city or district."
        : "Masukkan bandar atau daerah operasi.";
    }
    if (values.address.trim().length < 8) {
      errors.address = isEn
        ? "Enter full address of training venue (min 8 characters)."
        : "Masukkan alamat penuh gelanggang atau pusat latihan (min 8 aksara).";
    }
    if (!isValidPostalCode(values.postalCode)) {
      errors.postalCode = isEn
        ? "Postal code must contain exactly 5 digits."
        : "Poskod mesti mengandungi tepat 5 digit angka.";
    }
  }

  if (step === 2) {
    const repName = (values.representativeName || values.fullName || "").trim();
    if (repName.length < 3) {
      errors.representativeName = isEn
        ? "Enter representative full name (at least 3 characters)."
        : "Masukkan nama penuh wakil sah sekurang-kurangnya 3 aksara.";
    }
    if (!isValidIdentityNumber(values.identificationNumber)) {
      errors.identificationNumber = isEn
        ? "Enter valid NRIC number (12 digits) or passport number."
        : "Masukkan no. MyKad sah (12 digit atau XXXXXX-XX-XXXX) atau no. pasport.";
    }
    if (!isValidMalaysianPhone(values.phoneNumber)) {
      errors.phoneNumber = isEn
        ? "Enter a valid Malaysian phone number (+60 1X-XXX XXXX)."
        : "Masukkan nombor telefon Malaysia yang sah (+60 1X-XXX XXXX).";
    }
    if (!isValidEmail(values.email)) {
      errors.email = isEn
        ? "Enter a valid official email address."
        : "Masukkan alamat e-mel rasmi yang sah.";
    }
    const desig = (values.designation || values.position || "").trim();
    if (desig.length < 2) {
      errors.designation = isEn
        ? "Enter position in organization (e.g. Head Coach, Secretary)."
        : "Masukkan jawatan dalam organisasi (cth: Guru Utama, Ketua Jurulatih).";
    }
    if (!hasSecurePassword(values.password)) {
      errors.password = isEn ? PASSWORD_REQUIREMENTS_EN : PASSWORD_REQUIREMENTS_BM;
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = isEn
        ? "Please confirm your password."
        : "Sila sahkan kata laluan.";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = isEn
        ? "Confirmation password does not match."
        : "Kata laluan pengesahan tidak sepadan.";
    }
  }

  if (step === 3) {
    if (!values.disciplines || values.disciplines.length === 0) {
      errors.disciplines = isEn
        ? "Please select at least one silat discipline (Seni or Olahraga)."
        : "Sila pilih sekurang-kurangnya satu disiplin silat (Seni atau Olahraga).";
    }
    if (!values.trainingVenueType) {
      errors.trainingVenueType = isEn
        ? "Please select training venue type."
        : "Sila pilih jenis tempat latihan (Dojo, Dewan, dsb).";
    }
    if (!values.weeklySessions || values.weeklySessions < 1 || values.weeklySessions > 14) {
      errors.weeklySessions = isEn
        ? "Enter weekly training frequency (1 to 14 sessions)."
        : "Masukkan kekerapan sesi latihan seminggu (1 hingga 14 sesi).";
    }
  }

  if (step === 4) {
    if (!values.associationId) {
      errors.associationId = isEn
        ? "Please select an association affiliation (or choose Independent Club)."
        : "Sila pilih persatuan atau perguruan naungan kelab (atau pilih Kelab Bebas).";
    }
  }

  if (step === 5) {
    const consent = values.agreedToTerms ?? values.termsAccepted;
    if (!consent) {
      errors.agreedToTerms = isEn
        ? "Please agree to the Terms of Service & FighterX Privacy Notice."
        : "Sila tandakan persetujuan Terma Perkhidmatan & Notis Privasi FighterX.";
    }
  }

  return errors;
}

export function getRegistrationStepErrors(
  values: ClubRegistrationValues,
  locale: "en" | "bm" = "bm"
): RegistrationFieldErrors {
  return {
    ...validateRegistrationStep(1, values, locale),
    ...validateRegistrationStep(2, values, locale),
    ...validateRegistrationStep(3, values, locale),
    ...validateRegistrationStep(4, values, locale),
    ...validateRegistrationStep(5, values, locale),
  };
}
