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

export const PASSWORD_REQUIREMENTS = "12 aksara minimum; mesti ada huruf besar, huruf kecil, nombor dan simbol.";

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

export function phoneFormatHint(value: string): string {
  return isValidMalaysianPhone(value)
    ? "Nombor telefon Malaysia sah diterima."
    : "Contoh format: 012-345 6789 atau +60 12-345 6789.";
}

export function validateRegistrationStep(step: RegisterStep, values: ClubRegistrationValues): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  if (step === 1) {
    if (values.clubName.trim().length < 3) {
      errors.clubName = "Masukkan nama kelab sekurang-kurangnya 3 aksara.";
    }
    if (values.registrationNumber.trim().length < 3) {
      errors.registrationNumber = "Masukkan nombor pendaftaran rasmi (ROS / SSM / PJS).";
    }
    if (!values.organizationType) {
      errors.organizationType = "Sila pilih jenis organisasi.";
    }
    if (!values.state) {
      errors.state = "Sila pilih negeri operasi kelab.";
    }
    const cityVal = (values.city || values.district || "").trim();
    if (cityVal.length < 2) {
      errors.city = "Masukkan bandar atau daerah operasi.";
    }
    if (values.address.trim().length < 8) {
      errors.address = "Masukkan alamat penuh gelanggang atau pusat latihan (min 8 aksara).";
    }
    if (!isValidPostalCode(values.postalCode)) {
      errors.postalCode = "Poskod mesti mengandungi tepat 5 digit angka.";
    }
  }

  if (step === 2) {
    const repName = (values.representativeName || values.fullName || "").trim();
    if (repName.length < 3) {
      errors.representativeName = "Masukkan nama penuh wakil sah sekurang-kurangnya 3 aksara.";
    }
    if (!isValidIdentityNumber(values.identificationNumber)) {
      errors.identificationNumber = "Masukkan no. MyKad sah (12 digit atau XXXXXX-XX-XXXX) atau no. pasport.";
    }
    if (!isValidMalaysianPhone(values.phoneNumber)) {
      errors.phoneNumber = "Masukkan nombor telefon Malaysia yang sah (+60 1X-XXX XXXX).";
    }
    if (!isValidEmail(values.email)) {
      errors.email = "Masukkan alamat e-mel rasmi yang sah.";
    }
    const desig = (values.designation || values.position || "").trim();
    if (desig.length < 2) {
      errors.designation = "Masukkan jawatan dalam organisasi (cth: Guru Utama, Ketua Jurulatih).";
    }
    if (!hasSecurePassword(values.password)) {
      errors.password = PASSWORD_REQUIREMENTS;
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Sila sahkan kata laluan.";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Kata laluan pengesahan tidak sepadan.";
    }
  }

  if (step === 3) {
    if (!values.disciplines || values.disciplines.length === 0) {
      errors.disciplines = "Sila pilih sekurang-kurangnya satu disiplin silat (Seni atau Olahraga).";
    }
    if (!values.trainingVenueType) {
      errors.trainingVenueType = "Sila pilih jenis tempat latihan (Dojo, Dewan, dsb).";
    }
    if (!values.weeklySessions || values.weeklySessions < 1 || values.weeklySessions > 14) {
      errors.weeklySessions = "Masukkan kekerapan sesi latihan seminggu (1 hingga 14 sesi).";
    }
  }

  if (step === 4) {
    if (!values.associationId) {
      errors.associationId = "Sila pilih persatuan atau perguruan naungan kelab (atau pilih Kelab Bebas).";
    }
  }

  if (step === 5) {
    const consent = values.agreedToTerms ?? values.termsAccepted;
    if (!consent) {
      errors.agreedToTerms = "Sila tandakan persetujuan Terma Perkhidmatan & Notis Privasi FighterX.";
    }
  }

  return errors;
}

export function getRegistrationStepErrors(values: ClubRegistrationValues): RegistrationFieldErrors {
  return {
    ...validateRegistrationStep(1, values),
    ...validateRegistrationStep(2, values),
    ...validateRegistrationStep(3, values),
    ...validateRegistrationStep(4, values),
    ...validateRegistrationStep(5, values),
  };
}
