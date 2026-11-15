"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ROLE_DESTINATIONS } from "@/lib/auth/auth-contract";
import { uiOnlyAuthGateway } from "@/lib/auth/ui-only-auth";
import type { AppRole } from "@/types/platform";
import { useLanguage } from "@/lib/i18n";

type FieldErrors = { email?: string; password?: string };
const ROLE_TITLES: Record<AppRole, string> = { ATHLETE: "Athlete", COACH: "Coach", ADMIN: "Admin" };

function validate(email: string, password: string, locale: "en" | "bm"): FieldErrors {
  const errors: FieldErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email = locale === "bm" ? "Masukkan alamat e-mel." : "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = locale === "bm" ? "Semak format alamat e-mel." : "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = locale === "bm" ? "Masukkan kata laluan." : "Please enter your password.";
  }
  return errors;
}

export function SignInForm({ selectedRole }: { selectedRole: AppRole }) {
  const { locale } = useLanguage();
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

    const nextErrors = validate(email, password, locale);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessageKind("error");
      setFormMessage(
        locale === "bm"
          ? "Semak ruangan yang ditandakan sebelum teruskan."
          : "Please check the highlighted fields before proceeding."
      );
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
        setFormMessage(
          locale === "bm"
            ? "E-mel atau kata laluan tak sepadan. Semak maklumat dan cuba lagi."
            : "Invalid email or password. Please verify and try again."
        );
        return;
      }
      setMessageKind("info");
      setFormMessage(
        result.message ??
          (locale === "bm"
            ? "Autentikasi belum disambungkan. Tiada sesi log masuk dicipta."
            : "Authentication not connected yet. No active session created.")
      );
    } catch {
      setMessageKind("error");
      setFormMessage(
        locale === "bm"
          ? "Tak dapat hubungi servis log masuk. Cuba lagi sebentar lagi."
          : "Unable to reach sign in service. Please try again shortly."
      );
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
        <span className="login-form-kicker">
          {locale === "bm" ? "AKSES AKAUN SELAMAT" : "SECURE ACCOUNT ACCESS"}
        </span>
        <h2 id="login-form-title">
          {locale === "bm" ? "Log masuk sebagai " : "Sign in as "}
          <span>{ROLE_TITLES[selectedRole]}</span>
        </h2>
        <p>
          {locale === "bm"
            ? "Akses anda tetap disahkan berdasarkan akaun FighterX yang berdaftar."
            : "Your access will still be verified based on your registered FighterX account."}
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="login-field">
          <label htmlFor="login-email">{locale === "bm" ? "Alamat e-mel" : "Email address"}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={locale === "bm" ? "nama@kelab.my" : "name@club.com"}
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
            <label htmlFor="login-password">{locale === "bm" ? "Kata laluan" : "Password"}</label>
            <button className="login-forgot" type="button" onClick={showResetInfo}>
              {locale === "bm" ? "Lupa kata laluan?" : "Forgot password?"}
            </button>
          </div>
          <div className="login-password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={locale === "bm" ? "Masukkan kata laluan" : "Enter password"}
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
              aria-label={
                showPassword
                  ? (locale === "bm" ? "Sembunyikan kata laluan" : "Hide password")
                  : (locale === "bm" ? "Tunjukkan kata laluan" : "Show password")
              }
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
            {locale === "bm"
              ? "Tetapan semula kata laluan belum tersedia kerana autentikasi belum disambungkan."
              : "Password reset is not available yet as authentication is pending connection."}
          </p>
        )}
        {formMessage && (
          <p className={`login-form-message is-${messageKind}`} role={messageKind === "error" ? "alert" : "status"}>
            {formMessage}
          </p>
        )}

        <button className="button button-primary login-submit" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="login-spinner" aria-hidden="true" />{" "}
              {locale === "bm" ? "Menyemak akaun…" : "Checking account…"}
            </>
          ) : (
            locale === "bm" ? "Log Masuk" : "Sign In"
          )}
        </button>
      </form>

      <p className="login-availability">
        {locale === "bm"
          ? "Mod Pratonton · Autentikasi belum dikonfigurasikan"
          : "Preview mode · Authentication pending configuration"}
      </p>
    </section>
  );
}
