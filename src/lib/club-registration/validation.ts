import type { OrganizationType } from "@/lib/club-registration/contract";

export type RegisterStep = 1 | 2 | 3;

export type ClubRegistrationValues = {
  clubName: string;
  organizationType: OrganizationType | "";
  state: string;
  district: string;
  address: string;
  fullName: string;
  position: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

export type RegistrationFieldErrors = Partial<Record<keyof ClubRegistrationValues, string>>;

export const PASSWORD_REQUIREMENTS = "12 aksara minimum; mesti ada huruf besar, huruf kecil, nombor dan simbol.";

function isValidMalaysianPhone(value: string): boolean {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:\+?60|0)?1\d{8,9}$/.test(compact);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasSecurePassword(value: string): boolean {
  return value.length >= 12 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function validateRegistrationStep(step: RegisterStep, values: ClubRegistrationValues): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  if (step === 1) {
    if (values.clubName.trim().length < 2) errors.clubName = "Masukkan nama kelab atau organisasi.";
    if (!values.organizationType) errors.organizationType = "Pilih jenis organisasi.";
    if (!values.state) errors.state = "Pilih negeri.";
    if (values.district.trim().length < 2) errors.district = "Masukkan daerah.";
    if (values.address.trim().length < 8) errors.address = "Masukkan alamat penuh kelab.";
  }

  if (step === 2) {
    if (values.fullName.trim().length < 2) errors.fullName = "Masukkan nama penuh wakil.";
    if (values.position.trim().length < 2) errors.position = "Masukkan jawatan dalam kelab.";
    if (!isValidMalaysianPhone(values.phoneNumber)) errors.phoneNumber = "Masukkan nombor Malaysia, contoh +60 12-345 6789.";
    if (!isValidEmail(values.email)) errors.email = "Masukkan alamat e-mel yang sah.";
    if (!hasSecurePassword(values.password)) errors.password = PASSWORD_REQUIREMENTS;
    if (!values.confirmPassword) errors.confirmPassword = "Sahkan kata laluan.";
    else if (values.confirmPassword !== values.password) errors.confirmPassword = "Kata laluan tak sepadan.";
  }

  if (step === 3 && !values.termsAccepted) {
    errors.termsAccepted = "Setujui Terma & Notis Privasi untuk teruskan preview ini.";
  }

  return errors;
}

export function getRegistrationStepErrors(values: ClubRegistrationValues): RegistrationFieldErrors {
  return {
    ...validateRegistrationStep(1, values),
    ...validateRegistrationStep(2, values),
    ...validateRegistrationStep(3, values),
  };
}

export function phoneFormatHint(value: string): string {
  return isValidMalaysianPhone(value) ? "Nombor Malaysia diterima." : "Contoh format: 012-345 6789 atau +60 12-345 6789.";
}
