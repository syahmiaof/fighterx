"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  ORGANIZATION_TYPES,
  type ClubRegistrationReceipt,
  type ClubRegistrationRequest,
  type OrganizationType,
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

const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
  "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Putrajaya", "Labuan",
];

const INITIAL_VALUES: ClubRegistrationValues = {
  clubName: "",
  organizationType: "",
  state: "",
  district: "",
  address: "",
  fullName: "",
  position: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

type TextFieldName = Exclude<keyof ClubRegistrationValues, "termsAccepted">;

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="register-field-error" id={id}>{message}</p> : null;
}

function RegisterProgress({ step }: { step: RegisterStep }) {
  const labels = ["Club information", "Representative", "Review & submit"];
  return (
    <div className="register-progress" aria-label={`Step ${step} of 3`}>
      <div className="register-progress-track" aria-hidden="true"><span style={{ width: `${((step - 1) / 2) * 100}%` }} /></div>
      <ol>
        {labels.map((label, index) => {
          const itemStep = (index + 1) as RegisterStep;
          const complete = itemStep < step;
          return (
            <li key={label} className={itemStep === step ? "is-current" : complete ? "is-complete" : ""} aria-current={itemStep === step ? "step" : undefined}>
              <span className="register-step-marker">{complete ? <Check size={13} aria-hidden="true" /> : itemStep}</span>
              <span className="register-step-label">{label}</span>
            </li>
          );
        })}
      </ol>
      <p className="register-step-count">Step {step} <span>of 3</span></p>
    </div>
  );
}

function SummaryGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="register-summary-group">
      <div className="register-summary-heading"><h3>{title}</h3><button type="button" onClick={onEdit}>Edit</button></div>
      {children}
    </section>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="register-summary-row"><dt>{label}</dt><dd>{children}</dd></div>;
}

function SubmittedStatus({ preview, receipt, onBack }: { preview: boolean; receipt?: ClubRegistrationReceipt; onBack: () => void }) {
  return (
    <section className="register-status" aria-labelledby="register-status-title" aria-live="polite">
      <div className="register-status-icon"><Check size={24} aria-hidden="true" /></div>
      {preview && <p className="register-preview-tag">UI PREVIEW · NOT SUBMITTED</p>}
      <h2 id="register-status-title">Registration Submitted</h2>
      <p className="register-status-lead">Your club application is pending approval.</p>
      <div className="register-status-details">
        <p><ShieldCheck size={17} aria-hidden="true" /><span>Approval is required from the central FighterX Admin.</span></p>
        <p><Check size={17} aria-hidden="true" /><span>The 30-day trial starts only after approval and activation.</span></p>
        <p><ArrowRight size={17} aria-hidden="true" /><span>The club representative will receive the next steps.</span></p>
      </div>
      <div className="register-status-price"><strong>RM20 / month</strong><span>per club after the 30-day trial · no initial payment</span></div>
      {receipt && <p className="register-application-reference">Application reference <strong>{receipt.applicationId}</strong></p>}
      {preview && (
        <p className="register-preview-notice" role="note">
          Ini contoh skrin status selepas backend menerima permohonan. Tiada maklumat dihantar atau disimpan; status ini bukan pengesahan pendaftaran sebenar.
        </p>
      )}
      <button className="button button-outline register-return-button" type="button" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> Back to form</button>
    </section>
  );
}

export function RegisterClubForm() {
  const [step, setStep] = useState<RegisterStep>(1);
  const [values, setValues] = useState<ClubRegistrationValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{ preview: boolean; receipt?: ClubRegistrationReceipt } | null>(null);
  const submittingRef = useRef(false);

  function updateText(field: TextFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validateStep() {
    const nextErrors = validateRegistrationStep(step, values);
    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep() || step >= 3) return;
    setStep((current) => (current + 1) as RegisterStep);
    setSubmitError("");
  }

  function goBack() {
    if (step > 1) setStep((current) => (current - 1) as RegisterStep);
    setSubmitError("");
  }

  function editStep(nextStep: RegisterStep) {
    setStep(nextStep);
    setErrors({});
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!validateStep()) return;

    const allErrors = getRegistrationStepErrors(values);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const earliestInvalid = ([1, 2, 3] as const).find((candidate) => Object.keys(validateRegistrationStep(candidate, values)).length > 0) ?? 1;
      setStep(earliestInvalid);
      return;
    }

    if (!values.organizationType || !values.termsAccepted) return;
    const request: ClubRegistrationRequest = {
      club: {
        name: values.clubName.trim(),
        type: values.organizationType as OrganizationType,
        state: values.state,
        district: values.district.trim(),
        address: values.address.trim(),
      },
      applicant: {
        fullName: values.fullName.trim(),
        position: values.position.trim(),
        phoneNumber: values.phoneNumber.trim(),
        email: values.email.trim(),
        password: values.password,
      },
      termsAccepted: true,
    };

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const registration = await uiOnlyClubRegistrationService.register(request);
      if (registration.status === "accepted") {
        setResult({ preview: false, receipt: registration.receipt });
        setValues((current) => ({ ...current, password: "", confirmPassword: "" }));
      } else if (registration.status === "preview-only") {
        setResult({ preview: true });
        setValues((current) => ({ ...current, password: "", confirmPassword: "" }));
      } else {
        setSubmitError(registration.message);
      }
    } catch {
      setSubmitError("Permohonan tak dapat diproses. Semak sambungan dan cuba lagi.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (result) {
    return <SubmittedStatus preview={result.preview} receipt={result.receipt} onBack={() => setResult(null)} />;
  }

  const organizationTypeLabels: Record<OrganizationType, string> = {
    CLUB: "Club",
    ACADEMY: "Academy",
    ASSOCIATION: "Association",
    OTHER: "Other",
  };

  return (
    <section className="register-form-shell" aria-label="Club registration form">
      <RegisterProgress step={step} />
      <form className="register-form" onSubmit={step === 3 ? handleSubmit : (event) => { event.preventDefault(); goNext(); }} noValidate>
        <div className="register-step-panel" key={step}>
          {step === 1 && (
            <>
              <div className="register-form-heading"><h2>Club information</h2><p>Details organisasi yang akan menggunakan satu akaun langganan.</p></div>
              <div className="register-fields-grid">
                <div className="register-field register-field-wide">
                  <label htmlFor="register-club-name">Club / Organization Name</label>
                  <input id="register-club-name" name="clubName" autoComplete="organization" value={values.clubName} onChange={(event) => updateText("clubName", event.target.value)} aria-invalid={Boolean(errors.clubName)} aria-describedby={errors.clubName ? "register-club-name-error" : undefined} placeholder="Contoh: Akademi Silat FighterX" />
                  <FieldError id="register-club-name-error" message={errors.clubName} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-org-type">Organization Type</label>
                  <select id="register-org-type" name="organizationType" value={values.organizationType} onChange={(event) => updateText("organizationType", event.target.value as OrganizationType | "")} aria-invalid={Boolean(errors.organizationType)} aria-describedby={errors.organizationType ? "register-org-type-error" : undefined}>
                    <option value="">Pilih jenis organisasi</option>
                    {ORGANIZATION_TYPES.map((type) => <option value={type} key={type}>{organizationTypeLabels[type]}</option>)}
                  </select>
                  <FieldError id="register-org-type-error" message={errors.organizationType} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-state">State</label>
                  <select id="register-state" name="state" value={values.state} onChange={(event) => updateText("state", event.target.value)} aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? "register-state-error" : undefined}>
                    <option value="">Pilih negeri</option>
                    {MALAYSIAN_STATES.map((state) => <option value={state} key={state}>{state}</option>)}
                  </select>
                  <FieldError id="register-state-error" message={errors.state} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-district">District</label>
                  <input id="register-district" name="district" autoComplete="address-level2" value={values.district} onChange={(event) => updateText("district", event.target.value)} aria-invalid={Boolean(errors.district)} aria-describedby={errors.district ? "register-district-error" : undefined} placeholder="Contoh: Larut Matang" />
                  <FieldError id="register-district-error" message={errors.district} />
                </div>
                <div className="register-field register-field-wide">
                  <label htmlFor="register-address">Club Address</label>
                  <textarea id="register-address" name="address" autoComplete="street-address" rows={3} value={values.address} onChange={(event) => updateText("address", event.target.value)} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "register-address-error" : undefined} placeholder="Alamat penuh lokasi kelab" />
                  <FieldError id="register-address-error" message={errors.address} />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="register-form-heading"><h2>Representative information</h2><p>Wakil kelab untuk dihubungi tentang permohonan ini.</p></div>
              <div className="register-fields-grid">
                <div className="register-field">
                  <label htmlFor="register-full-name">Full Name</label>
                  <input id="register-full-name" name="fullName" autoComplete="name" value={values.fullName} onChange={(event) => updateText("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "register-full-name-error" : undefined} placeholder="Nama penuh" />
                  <FieldError id="register-full-name-error" message={errors.fullName} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-position">Position in Club</label>
                  <input id="register-position" name="position" autoComplete="organization-title" value={values.position} onChange={(event) => updateText("position", event.target.value)} aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? "register-position-error" : undefined} placeholder="Contoh: Setiausaha" />
                  <FieldError id="register-position-error" message={errors.position} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-phone">Phone Number</label>
                  <input id="register-phone" name="phoneNumber" type="tel" inputMode="tel" autoComplete="tel" value={values.phoneNumber} onChange={(event) => updateText("phoneNumber", event.target.value)} aria-invalid={Boolean(errors.phoneNumber)} aria-describedby={errors.phoneNumber ? "register-phone-error register-phone-hint" : "register-phone-hint"} placeholder="+60 12-345 6789" />
                  <p className="register-field-hint" id="register-phone-hint">{phoneFormatHint(values.phoneNumber)}</p>
                  <FieldError id="register-phone-error" message={errors.phoneNumber} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-email">Email Address</label>
                  <input id="register-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={values.email} onChange={(event) => updateText("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} placeholder="nama@kelab.my" />
                  <FieldError id="register-email-error" message={errors.email} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-password">Password</label>
                  <div className="register-password-wrap">
                    <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.password} onChange={(event) => updateText("password", event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-hint register-password-error" : "register-password-hint"} placeholder="Cipta kata laluan" />
                    <button className="register-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>
                  </div>
                  <p className="register-field-hint" id="register-password-hint">{PASSWORD_REQUIREMENTS}</p>
                  <FieldError id="register-password-error" message={errors.password} />
                </div>
                <div className="register-field">
                  <label htmlFor="register-confirm-password">Confirm Password</label>
                  <div className="register-password-wrap">
                    <input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={values.confirmPassword} onChange={(event) => updateText("confirmPassword", event.target.value)} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined} placeholder="Ulang kata laluan" />
                    <button className="register-password-toggle" type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword((current) => !current)}>{showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>
                  </div>
                  <FieldError id="register-confirm-password-error" message={errors.confirmPassword} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="register-form-heading"><h2>Review & submit</h2><p>Pastikan butiran betul sebelum hantar permohonan.</p></div>
              <div className="register-review">
                <SummaryGroup title="Club information" onEdit={() => editStep(1)}>
                  <dl>
                    <SummaryRow label="Organization">{values.clubName}</SummaryRow>
                    <SummaryRow label="Type">{values.organizationType ? organizationTypeLabels[values.organizationType] : "—"}</SummaryRow>
                    <SummaryRow label="Location">{[values.district, values.state].filter(Boolean).join(", ")}</SummaryRow>
                    <SummaryRow label="Address">{values.address}</SummaryRow>
                  </dl>
                </SummaryGroup>
                <SummaryGroup title="Representative" onEdit={() => editStep(2)}>
                  <dl>
                    <SummaryRow label="Name & position">{[values.fullName, values.position].filter(Boolean).join(" · ")}</SummaryRow>
                    <SummaryRow label="Phone">{values.phoneNumber}</SummaryRow>
                    <SummaryRow label="Email">{values.email}</SummaryRow>
                  </dl>
                </SummaryGroup>
              </div>
              <details className="register-terms-details">
                <summary>Trial, pricing & privacy terms</summary>
                <ul>
                  <li>One subscription covers one club.</li>
                  <li>The 30-day trial starts only after central admin approval and activation.</li>
                  <li>RM20 per club per month applies after the trial. No payment is collected with this application.</li>
                  <li>Club membership and training data are designed to stay isolated by organization.</li>
                  <li>Only ADMIN, COACH and ATHLETE roles are supported. Applicant permissions will be assigned securely during backend integration.</li>
                </ul>
                <p>Notis privasi penuh perlu diterbitkan dan dipautkan sebelum permohonan live diaktifkan.</p>
              </details>
              <div className="register-consent-row">
                <input id="register-terms" type="checkbox" checked={values.termsAccepted} onChange={(event) => {
                  setValues((current) => ({ ...current, termsAccepted: event.target.checked }));
                  setErrors((current) => ({ ...current, termsAccepted: undefined }));
                }} aria-invalid={Boolean(errors.termsAccepted)} aria-describedby={errors.termsAccepted ? "register-terms-error" : undefined} />
                <label htmlFor="register-terms">Saya bersetuju dengan Terma & Notis Privasi FighterX.</label>
              </div>
              <FieldError id="register-terms-error" message={errors.termsAccepted} />
            </>
          )}
        </div>

        {submitError && <p className="register-submit-error" role="alert">{submitError}</p>}

        <div className={`register-form-actions${step === 1 ? " is-first-step" : ""}`}>
          {step > 1 ? <button className="button button-outline" type="button" onClick={goBack}><ArrowLeft size={16} aria-hidden="true" /> Back</button> : <span className="register-step-note"><LockKeyhole size={14} aria-hidden="true" /> No payment at registration</span>}
          {step < 3 ? (
            <button className="button button-primary" type="button" onClick={goNext}>Next step <ArrowRight size={16} aria-hidden="true" /></button>
          ) : (
            <button className="button button-primary" type="submit" disabled={submitting}>
              {submitting ? <><span className="register-spinner" aria-hidden="true" /> Preparing preview…</> : <>Submit Registration <ArrowRight size={16} aria-hidden="true" /></>}
            </button>
          )}
        </div>
        {step === 3 && <p className="register-preview-caption">Frontend preview only · Application details are not sent or saved.</p>}
      </form>
    </section>
  );
}
