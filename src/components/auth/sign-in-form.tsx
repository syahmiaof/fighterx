"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ROLE_DESTINATIONS } from "@/lib/auth/auth-contract";
import { uiOnlyAuthGateway } from "@/lib/auth/ui-only-auth";
import type { AppRole } from "@/types/platform";

type FieldErrors = { email?: string; password?: string };
const ROLE_TITLES: Record<AppRole, string> = { ATHLETE: "Athlete", COACH: "Coach", ADMIN: "Admin" };

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) errors.email = "Masukkan alamat e-mel.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = "Semak format alamat e-mel.";
  }

  if (!password) errors.password = "Masukkan kata laluan.";
  return errors;
}

export function SignInForm({ selectedRole }: { selectedRole: AppRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "info">("info");
  const [submitting, setSubmitting] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    setResetNotice(false);

    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessageKind("error");
      setFormMessage("Semak ruangan yang ditandakan sebelum teruskan.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await uiOnlyAuthGateway.signIn({ email: email.trim(), password });
      if (result.status === "authenticated") {
        // The role is returned by the trusted auth server, never by the form.
        const requestedReturn = new URLSearchParams(window.location.search).get("returnTo");
        const safeReturnTo = requestedReturn === "/my-club" ? requestedReturn : undefined;
        window.location.assign(safeReturnTo ?? ROLE_DESTINATIONS[result.role]);
        return;
      }
      if (result.status === "invalid-credentials") {
        setMessageKind("error");
        setFormMessage("E-mel atau kata laluan tak sepadan. Semak maklumat dan cuba lagi.");
        return;
      }
      setMessageKind("info");
      setFormMessage(result.message ?? "Authentication belum disambungkan. Tiada sesi log masuk dicipta.");
    } catch {
      setMessageKind("error");
      setFormMessage("Tak dapat hubungi servis log masuk. Cuba lagi sebentar lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function showResetInfo() {
    setResetNotice(true);
    setFormMessage("");
  }

  return (
    <section className="login-form-panel" id="login-form-panel" aria-labelledby="login-form-title">
      <div className="login-form-heading">
        <span className="login-form-kicker">SECURE ACCOUNT ACCESS</span>
        <h2 id="login-form-title">Sign in as <span>{ROLE_TITLES[selectedRole]}</span></h2>
        <p>Your access will still be verified based on your registered FighterX account.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="login-field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nama@kelab.my"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
            }}
          />
          {errors.email && <p className="login-field-error" id="login-email-error">{errors.email}</p>}
        </div>

        <div className="login-field">
          <div className="login-label-row">
            <label htmlFor="login-password">Password</label>
            <button className="login-forgot" type="button" onClick={showResetInfo}>Forgot password?</button>
          </div>
          <div className="login-password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata laluan"
              value={password}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
              }}
            />
            <button
              className="login-password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {errors.password && <p className="login-field-error" id="login-password-error">{errors.password}</p>}
        </div>

        {resetNotice && (
          <p className="login-inline-notice" role="status">
            Password reset belum tersedia kerana authentication belum disambungkan.
          </p>
        )}
        {formMessage && (
          <p className={`login-form-message is-${messageKind}`} role={messageKind === "error" ? "alert" : "status"}>
            {formMessage}
          </p>
        )}

        <button className="button button-primary login-submit" type="submit" disabled={submitting}>
          {submitting ? <><span className="login-spinner" aria-hidden="true" /> Checking account…</> : "Sign In"}
        </button>
      </form>

      <p className="login-availability">Preview mode · Authentication belum dikonfigurasi</p>
    </section>
  );
}
