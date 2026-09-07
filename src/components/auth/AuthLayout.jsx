import {
  HeartPulse,
  ShieldCheck,
  Languages,
  BrainCircuit,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f9f7] text-[#172b24] lg:grid lg:grid-cols-2">

      {/* =========================================================
          LEFT — BRAND / PRODUCT INTRODUCTION
      ========================================================== */}
      <section className="relative hidden overflow-hidden bg-[#176b55] lg:flex">
        
        {/* Decorative background shapes */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-black/5" />
        <div className="absolute right-20 top-24 h-32 w-32 rounded-full border border-white/10" />

        <div className="relative z-10 flex w-full items-center px-12 py-16 xl:px-20">
          <div className="mx-auto w-full max-w-xl">

            {/* Brand */}
            <div className="mb-12 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                <HeartPulse
                  className="h-8 w-8 text-[#176b55]"
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  RuralCare AI
                </h1>

                <p className="mt-1 text-sm text-white/70">
                  Healthcare Communication Assistant
                </p>
              </div>
            </div>

            {/* Main heading */}
            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                AI-powered healthcare
              </p>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Healthcare information,
                <span className="block text-emerald-200">
                  made easier to understand.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75 xl:text-lg">
                Access prescriptions, medical records, OCR results, translations,
                and AI-assisted healthcare communication in one secure place.
              </p>
            </div>

            {/* Feature cards */}
            <div className="mt-10 space-y-4">

              {/* Feature 1 */}
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck
                    className="h-6 w-6 text-emerald-200"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Secure access
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Your healthcare information stays protected behind secure
                    authentication.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-emerald-200" />
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Languages
                    className="h-6 w-6 text-emerald-200"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Regional language support
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Understand medical information in a language that feels
                    comfortable to you.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-emerald-200" />
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <BrainCircuit
                    className="h-6 w-6 text-emerald-200"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    AI-assisted communication
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Turn complex medical information into clearer,
                    easier-to-understand guidance.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-emerald-200" />
              </div>

            </div>

            {/* Security note */}
            <div className="mt-10 flex items-center gap-3 text-sm text-white/60">
              <LockKeyhole className="h-4 w-4" />
              <span>
                Designed for secure healthcare communication
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          RIGHT — AUTHENTICATION AREA
      ========================================================== */}
      <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">

        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#176b55]/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#176b55]/5" />

        <div className="relative z-10 w-full max-w-md">

          {/* Mobile branding */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176b55]">
              <HeartPulse
                className="h-6 w-6 text-white"
                strokeWidth={2.2}
              />
            </div>

            <div>
              <p className="font-bold text-[#172b24]">
                RuralCare AI
              </p>

              <p className="text-xs text-[#6c7d76]">
                Healthcare Communication Assistant
              </p>
            </div>
          </div>


          {/* Login card */}
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-7 shadow-[0_20px_60px_rgba(23,43,36,0.08)] sm:p-9">

            {/* Header */}
            <div className="mb-8">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ef]">
                <LockKeyhole
                  className="h-6 w-6 text-[#176b55]"
                  strokeWidth={2}
                />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172b24]">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6c7d76]">
                {subtitle}
              </p>
            </div>


            {/* Login/Register form */}
            <div>
              {children}
            </div>


            {/* Security information */}
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-[#d9eee4] bg-[#f2faf6] p-3.5">

              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#176b55]" />

              <p className="text-xs leading-5 text-[#567168]">
                Your account helps keep your healthcare records organized and
                protected.
              </p>

            </div>


            {/* Footer */}
            <div className="mt-7 border-t border-[#e7eeea] pt-6">

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#7b8b85]">

                <a
                  href="#"
                  className="transition-colors hover:text-[#176b55]"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="transition-colors hover:text-[#176b55]"
                >
                  Terms of Use
                </a>

                <a
                  href="#"
                  className="transition-colors hover:text-[#176b55]"
                >
                  Support
                </a>

              </div>

              <p className="mt-4 text-center text-xs text-[#9aa8a3]">
                © {new Date().getFullYear()} RuralCare AI
              </p>

            </div>

          </div>

          {/* Bottom trust message */}
          <p className="mt-5 text-center text-xs text-[#87958f]">
            Healthcare communication made simpler for everyone.
          </p>

        </div>
      </section>

    </div>
  );
}