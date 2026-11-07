import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterClubForm } from "@/components/register-club/register-club-form";

export function RegisterClubFormPage() {
  return (
    <>
      <SiteHeader currentPage="register" />
      <main className="register-page">
        <div className="register-wrap">
          <section className="register-intro" aria-labelledby="register-title">
            <h1 id="register-title">Register Your Club</h1>
            <p>Daftarkan kelab atau akademi silat anda dan mulakan perjalanan bersama FighterX.</p>
            <div className="register-offer" aria-label="Trial and subscription pricing">
              <div><strong>30 Days Free Trial</strong><span>Starts after approval & activation</span></div>
              <i aria-hidden="true" />
              <div><strong>RM20 <small>/month</small></strong><span>After trial · per club</span></div>
            </div>
            <p className="register-signin">Dah ada akaun? <Link href="/login">Sign In</Link></p>
          </section>
          <RegisterClubForm />
        </div>
      </main>
    </>
  );
}
