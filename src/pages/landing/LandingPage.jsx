import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  Globe2,
  HeartPulse,
  Languages,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScanText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { LandingInput } from "./LandingInput";
import { LandingAccordion } from "./LandingAccordion";
import { submitContactForm } from "@/services/contact";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/* -------------------------------------------------------------------------- */
/* LANGUAGE SHOWCASE                                                          */
/* -------------------------------------------------------------------------- */

const translatedGreetings = [
  {
    lang: "Hindi",
    text: "आपका स्वास्थ्य, आपकी भाषा में",
  },
  {
    lang: "Marathi",
    text: "तुमचं आरोग्य, तुमच्या भाषेत",
  },
  {
    lang: "Tamil",
    text: "உங்கள் ஆரோக்கியம், உங்கள் மொழியில்",
  },
  {
    lang: "Telugu",
    text: "మీ ఆరోగ్యం, మీ భాషలో",
  },
  {
    lang: "Kannada",
    text: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ",
  },
];

function useRotatingIndex(length, intervalMs) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((previous) => (previous + 1) % length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [length, intervalMs]);

  return index;
}

/* -------------------------------------------------------------------------- */
/* HERO                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  const rotatingIndex = useRotatingIndex(
    translatedGreetings.length,
    2600
  );

  const { t } = useLanguage();
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#F8FAF8]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#DCEFE8] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#EAF3EF] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2F6F5E]/15 bg-white px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#2F6F5E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#2F6F5E]" />
              BUILT FOR RURAL INDIA
            </div>

            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight text-[#17212B] md:text-6xl lg:text-7xl">
              {t("Medical advice,")}
              <br />
              <span>{t("explained simply.")}</span>
              <br />
              <span className="text-[#2F6F5E]">
                {t("In the language you speak.")}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#536273] md:text-lg">
              {t(
                "Prescriptions and diagnoses are written for doctors, not patients. Our assistant turns confusing medical text into plain language, then translates it into your regional language — so every patient understands their own care."
              )}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="h-12 rounded-xl bg-[#2F6F5E] px-6 text-white shadow-lg shadow-[#2F6F5E]/20 hover:bg-[#255A4C]"
              >
                {t("Get started")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={scrollToHowItWorks}
                className="h-12 rounded-xl border-[#1F2933]/15 bg-white px-6 text-[#1F2933] hover:bg-[#F2F5F3]"
              >
                {t("See how it works")}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#657383]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2F6F5E]" />
                Regional languages
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2F6F5E]" />
                Prescription OCR
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2F6F5E]" />
                Secure records
              </div>
            </div>
          </div>

          {/* Right medical intelligence card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#DCEFE8]/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[#1F2933]/10 bg-white p-5 shadow-[0_25px_70px_rgba(31,41,51,0.12)] md:p-7">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1F2933]/8 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4EF] text-[#2F6F5E]">
                    <HeartPulse className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#17212B]">
                      RuralCare AI
                    </p>
                    <p className="text-xs text-[#7A8794]">
                      Healthcare communication assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-[#EAF7F1] px-3 py-1.5 text-xs font-semibold text-[#2F6F5E]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F6F5E]" />
                  AI Ready
                </div>
              </div>

              {/* Medical report preview */}
              <div className="mt-6 rounded-2xl border border-[#1F2933]/8 bg-[#F8FAF8] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2F6F5E] shadow-sm">
                      <FileSearch className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#17212B]">
                        Medical report
                      </p>
                      <p className="text-xs text-[#7A8794]">
                        AI-extracted information
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#E8F5EF] px-2.5 py-1 text-xs font-semibold text-[#2F6F5E]">
                    Processed
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    ["Diagnosis", "Medical information extracted"],
                    ["Medicines", "Dosage and instructions identified"],
                    ["Explanation", "Simplified for patients"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#1F2933]/8 bg-white p-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8995A2]">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#344252]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language translation */}
              <div className="mt-5 rounded-2xl bg-[#17212B] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Same message • multiple languages
                  </p>

                  <Languages className="h-5 w-5 text-[#66D6B2]" />
                </div>

                <div className="mt-5 min-h-[82px]">
                  <p
                    key={rotatingIndex}
                    className="font-serif text-2xl leading-relaxed text-white md:text-3xl"
                  >
                    {translatedGreetings[rotatingIndex].text}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-white/55">
                    {translatedGreetings[rotatingIndex].lang}
                  </p>

                  <div className="flex gap-1.5">
                    {translatedGreetings.map((language, index) => (
                      <span
                        key={language.lang}
                        className={`h-1.5 rounded-full transition-all ${
                          index === rotatingIndex
                            ? "w-7 bg-[#E8A33D]"
                            : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-16 grid overflow-hidden rounded-2xl border border-[#1F2933]/8 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ScanText,
              title: "Scan",
              text: "Read prescriptions and reports",
            },
            {
              icon: BrainCircuit,
              title: "Simplify",
              text: "Convert medical terms into plain language",
            },
            {
              icon: Globe2,
              title: "Translate",
              text: "Understand information in your language",
            },
            {
              icon: LockKeyhole,
              title: "Remember",
              text: "Keep your records available later",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 border-b border-[#1F2933]/8 p-5 last:border-b-0 sm:nth-[2]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#2F6F5E]">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#17212B]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-[#7A8794]">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FEATURES                                                                   */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: BrainCircuit,
    title: "Plain-language simplification",
    description:
      "Complex diagnoses and prescriptions are rewritten in everyday words, with important medical terms explained clearly.",
  },
  {
    icon: Globe2,
    title: "Regional language translation",
    description:
      "Understand simplified healthcare information in Hindi, Marathi, Tamil, Telugu, Kannada, and more.",
  },
  {
    icon: ScanText,
    title: "Prescription scanning",
    description:
      "Photograph or upload a prescription, discharge summary, or medical report and extract useful information automatically.",
  },
  {
    icon: FileSearch,
    title: "Personal medical history",
    description:
      "Keep your simplified and translated records organized so you can review previous medical information later.",
  },
];

function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="bg-[#EFF4F0] px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#2F6F5E]">
            WHAT RURALCARE AI DOES
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#17212B] md:text-5xl">
            Healthcare information,
            <br />
            made easier to understand.
          </h2>

          <p className="mt-5 text-base leading-7 text-[#5D6A77]">
            From the moment you upload a document to the moment you understand
            it, RuralCare AI is designed around the patient's experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group rounded-2xl border-[#1F2933]/8 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F3EE] text-[#2F6F5E] transition group-hover:bg-[#2F6F5E] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="font-serif text-3xl text-[#DCE5E0]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-semibold text-[#17212B]">
                    {t(feature.title)}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#667482]">
                    {t(feature.description)}
                  </p>

                  <div className="mt-6 flex items-center text-sm font-semibold text-[#2F6F5E]">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* HOW IT WORKS                                                               */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your document",
    description:
      "Take a photo or upload a PDF of your prescription, lab report, or medical document.",
  },
  {
    number: "02",
    icon: ScanText,
    title: "Extract the information",
    description:
      "OCR reads the document and identifies useful medical information from the uploaded file.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Understand the report",
    description:
      "Medical information is organized and explained using clearer, patient-friendly language.",
  },
  {
    number: "04",
    icon: Languages,
    title: "Choose your language",
    description:
      "Read the explanation in a supported regional language and keep the record for later.",
  },
];

function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-24 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#2F6F5E]">
            SIMPLE FOUR-STEP FLOW
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#17212B] md:text-5xl">
            From document to understanding.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#667482]">
            A straightforward workflow designed for patients, families, ASHA
            workers, and healthcare teams.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(100%_-_12px)] top-9 hidden w-10 border-t border-dashed border-[#2F6F5E]/20 lg:block" />
                )}

                <div className="rounded-2xl border border-[#1F2933]/8 bg-[#F8FAF8] p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl text-[#E8A33D]">
                      {step.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2F6F5E] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-7 text-lg font-semibold text-[#17212B]">
                    {t(step.title)}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#667482]">
                    {t(step.description)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SAFETY / TRUST                                                             */
/* -------------------------------------------------------------------------- */

function TrustSection() {
  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] bg-[#17212B]">
          <div className="grid items-center gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1fr] lg:p-16">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2F6F5E] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="mt-7 font-serif text-4xl leading-tight text-white md:text-5xl">
                Designed around
                <br />
                patient understanding.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                RuralCare AI helps people review and understand their
                healthcare information. It is designed as a communication and
                record-support tool, not as a replacement for a qualified
                clinician.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: LockKeyhole,
                  title: "Private records",
                  text: "Keep your healthcare information organized.",
                },
                {
                  icon: Languages,
                  title: "Regional languages",
                  text: "Make information easier to understand.",
                },
                {
                  icon: Stethoscope,
                  title: "Healthcare focused",
                  text: "Built around prescriptions and medical reports.",
                },
                {
                  icon: MessageCircle,
                  title: "Better communication",
                  text: "Help patients discuss information with clinicians.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <Icon className="h-5 w-5 text-[#66D6B2]" />

                    <h3 className="mt-4 font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

const faqs = [
  {
    q: "Is my medical information kept private?",
    a: "Your prescriptions and reports are used to provide the application's supported processing and communication features. Always review your organization's privacy and data-handling policies before using sensitive medical information.",
  },
  {
    q: "Which languages are supported?",
    a: "The application is designed to support regional languages including Hindi, Marathi, Tamil, Telugu, and Kannada, with additional languages possible as the system expands.",
  },
  {
    q: "Do I need internet access to use this?",
    a: "Yes. An internet connection is currently required to upload documents and process them through the application's backend services.",
  },
  {
    q: "Can a health worker use this on behalf of a patient?",
    a: "Yes. ASHA workers and clinic staff can assist patients by uploading documents and helping them understand the resulting information.",
  },
];

function FAQ() {
  const { t } = useLanguage();

  const translatedFaqs = faqs.map((faq) => ({
    q: t(faq.q),
    a: t(faq.a),
  }));

  return (
    <section id="faq" className="bg-[#EFF4F0] px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#2F6F5E]">
            QUESTIONS
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#17212B] md:text-5xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 rounded-2xl border border-[#1F2933]/8 bg-white p-3 shadow-sm md:p-5">
          <LandingAccordion items={translatedFaqs} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT                                                                     */
/* -------------------------------------------------------------------------- */

function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await submitContactForm(formData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="bg-white px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#2F6F5E]">
              CONTACT
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#17212B] md:text-5xl">
              Let's make healthcare easier to understand.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#667482]">
              Questions about the assistant, partnerships with rural clinics,
              or feedback on the project? We'd like to hear from you.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#2F6F5E]">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm text-[#536273]">
                  support@healthexplained.in
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#2F6F5E]">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm text-[#536273]">
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#2F6F5E]">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm text-[#536273]">
                  Pune, Maharashtra, India
                </span>
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border-[#1F2933]/8 bg-[#F8FAF8] shadow-sm">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="rounded-2xl border border-[#2F6F5E]/15 bg-[#EAF7F1] p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2F6F5E] text-white">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#17212B]">
                    Message sent
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667482]">
                    {t(
                      "Thanks for reaching out — we'll get back to you soon."
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-semibold text-[#17212B]">
                      Get in touch
                    </h3>

                    <p className="mt-1 text-sm text-[#7A8794]">
                      Send us your question or feedback.
                    </p>
                  </div>

                  <LandingInput
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <LandingInput
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Textarea
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-32 resize-none rounded-xl border-[#1F2933]/10 bg-white"
                  />

                  {error && (
                    <p className="text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-[#2F6F5E] font-semibold text-white hover:bg-[#255A4C]"
                  >
                    {loading ? "Sending..." : t("Send message")}
                    {!loading && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FINAL CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#2F6F5E] px-7 py-14 text-center shadow-xl shadow-[#2F6F5E]/15 md:px-12 md:py-16">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="mt-6 font-serif text-4xl leading-tight text-white md:text-5xl">
          Understand your healthcare.
          <br />
          In your language.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/75">
          Upload a medical document and experience a simpler way to review
          healthcare information.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/login")}
          className="mt-8 h-12 rounded-xl bg-white px-7 font-semibold text-[#2F6F5E] hover:bg-[#F2F6F4]"
        >
          Get started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FOOTER                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#1F2933]/8 bg-[#F8FAF8] px-6 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6F5E] text-white">
                <HeartPulse className="h-5 w-5" />
              </div>

              <div>
                <p className="font-serif text-lg text-[#17212B]">
                  RuralCare AI
                </p>
                <p className="text-xs text-[#7A8794]">
                  Healthcare Communication Assistant
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#7A8794]">
              {t("An AI healthcare assistant for rural communities.")}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-[#536273]">
            <a
              href="#features"
              className="transition hover:text-[#2F6F5E]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-[#2F6F5E]"
            >
              How it works
            </a>

            <a
              href="#faq"
              className="transition hover:text-[#2F6F5E]"
            >
              FAQ
            </a>

            <a
              href="#contact"
              className="transition hover:text-[#2F6F5E]"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#1F2933]/8 pt-6 text-xs text-[#8995A2] md:flex-row">
          <p>© 2026 RuralCare AI. All rights reserved.</p>

          <p>
            Healthcare communication support • Not a substitute for
            professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAF8] font-sans text-[#17212B]">
      <Hero />

      <Features />

      <HowItWorks />

      <TrustSection />

      <FAQ />

      <Contact />

      <FinalCTA />

      <Footer />
    </div>
  );
}