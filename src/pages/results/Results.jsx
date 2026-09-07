import { useState } from "react";
import {
  Sparkles,
  Building2,
  Stethoscope,
  UserRound,
  HeartPulse,
  CalendarDays,
  Activity,
  Pill,
  Pencil,
  Copy,
  Volume2,
  Download,
  Bookmark,
  HelpCircle,
  Globe2,
  FileText,
  CheckCircle2,
  Clipboard,
} from "lucide-react";

export default function Results() {
  const [activeTab, setActiveTab] = useState("structured");
  const [saved, setSaved] = useState(false);

  const report = {
    title: "Hospital Discharge Summary",
    subtitle: "AI-Extracted & Structured Clinical Information",
    accuracy: 84,
    hospital: "CITY CARE MULTISPECIALITY HOSPITAL",
    doctor: "Consultant: Dr. Anil Sharma",
    patient: "Information",
    patientAge: "1 Years",
    patientId: "UH202600123",
    diagnosis: "Chest pain",
    date: "10-07-2026",
    status: "Prescription Active",
    bloodPressure: "150/95 mmHg",
  };

  const medicines = [
    {
      name: "Blood glucose fasting /dl",
      strength: "210 mg",
      form: "Tablet",
      dosage: "1-0-0",
      timing: "After Meals",
      duration: "5 Days",
      instructions: "Take after meals with water for 5 Days.",
    },
    {
      name: "Creatinine /dl",
      strength: "1.1 mg",
      form: "Tablet",
      dosage: "1-0-0",
      timing: "After Meals",
      duration: "5 Days",
      instructions: "Take after meals with water for 5 Days.",
    },
  ];

  const handleCopy = async () => {
    const text = `
Hospital Discharge Summary
Hospital: ${report.hospital}
Doctor: ${report.doctor}
Diagnosis: ${report.diagnosis}
Date: ${report.date}
Blood Pressure: ${report.bloodPressure}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.log("Copy unavailable");
    }
  };

  const handleListen = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const text = `
        ${report.title}.
        Hospital ${report.hospital}.
        ${report.doctor}.
        Diagnosis ${report.diagnosis}.
        Blood pressure ${report.bloodPressure}.
      `;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleDownload = () => {
    const content = `
HOSPITAL DISCHARGE SUMMARY

Hospital:
${report.hospital}

Attending Doctor:
${report.doctor}

Patient:
${report.patient}

Patient ID:
${report.patientId}

Diagnosis:
${report.diagnosis}

Date:
${report.date}

Status:
${report.status}

Clinical Vital:
Blood Pressure: ${report.bloodPressure}

PRESCRIBED MEDICINES

${medicines
  .map(
    (medicine, index) => `
${index + 1}. ${medicine.name}
Strength: ${medicine.strength}
Form: ${medicine.form}
Dosage: ${medicine.dosage}
Timing: ${medicine.timing}
Duration: ${medicine.duration}
Instructions: ${medicine.instructions}
`
  )
  .join("\n")}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "medical-report.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="rounded-3xl border border-[#DCE8E3] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F4EE] text-[#08745B]">
                <Sparkles size={27} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-[#17324D] sm:text-3xl">
                    {report.title}
                  </h1>

                  <div className="flex items-center gap-2 rounded-full border border-[#BFE6D6] bg-[#EFFAF6] px-3 py-1.5">
                    <CheckCircle2 size={15} className="text-[#079669]" />
                    <span className="text-xs font-bold text-[#08745B]">
                      OCR {report.accuracy}%
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-[#6B8197] sm:text-base">
                  {report.subtitle}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={Pencil} label="Edit Record" />

              <ActionButton
                icon={Copy}
                label="Copy"
                onClick={handleCopy}
              />

              <ActionButton
                icon={Volume2}
                label="Listen"
                onClick={handleListen}
              />

              <ActionButton
                icon={Download}
                label="Download"
                onClick={handleDownload}
              />

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#079669] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#067D57]"
              >
                <Bookmark
                  size={17}
                  fill={saved ? "currentColor" : "none"}
                />
                {saved ? "Saved" : "Save to History"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-7 flex flex-wrap gap-2 border-t border-[#E5ECE9] pt-5">
            <TabButton
              active={activeTab === "structured"}
              icon={FileText}
              label="Structured Medical Record"
              onClick={() => setActiveTab("structured")}
            />

            <TabButton
              active={activeTab === "explainer"}
              icon={HelpCircle}
              label="Plain-Language AI Explainer"
              onClick={() => setActiveTab("explainer")}
            />

            <TabButton
              active={activeTab === "translation"}
              icon={Globe2}
              label="Regional Translation"
              onClick={() => setActiveTab("translation")}
            />

            <TabButton
              active={activeTab === "ocr"}
              icon={Clipboard}
              label="Raw OCR Inspector"
              onClick={() => setActiveTab("ocr")}
            />
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === "structured" && (
          <div className="mt-5 space-y-5">

            {/* Hospital + Doctor */}
            <div className="grid gap-5 lg:grid-cols-2">

              <InfoCard
                icon={Building2}
                label="Hospital / Clinic / Medical Center"
                value={report.hospital}
                highlight
              />

              <InfoCard
                icon={Stethoscope}
                label="Attending Doctor / Physician"
                value={report.doctor}
              />

            </div>

            {/* Patient / Diagnosis / Date */}
            <div className="grid gap-5 md:grid-cols-3">

              <SmallInfoCard
                icon={UserRound}
                label="Patient Details"
                title={report.patient}
                description={`${report.patientAge} • ID: ${report.patientId}`}
              />

              <SmallInfoCard
                icon={HeartPulse}
                label="Diagnosis & Findings"
                title={report.diagnosis}
                accent
              />

              <SmallInfoCard
                icon={CalendarDays}
                label="Date & Fitness Status"
                title={report.date}
                description={report.status}
                accent
              />

            </div>

            {/* Clinical Vitals */}
            <section className="rounded-3xl border border-[#DCE8E3] bg-white p-5 shadow-sm sm:p-6">
              <SectionTitle
                icon={Activity}
                title="Recorded Clinical Vitals"
              />

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <VitalCard
                  label="Blood Pressure"
                  value={report.bloodPressure}
                />
              </div>
            </section>

            {/* Medicines */}
            <section className="rounded-3xl border border-[#DCE8E3] bg-white p-5 shadow-sm sm:p-6">
              <SectionTitle
                icon={Pill}
                title="Prescribed Medicines & Dosage Schedule"
              />

              <div className="mt-5 space-y-3">
                {medicines.map((medicine, index) => (
                  <MedicineCard
                    key={`${medicine.name}-${index}`}
                    medicine={medicine}
                    index={index + 1}
                  />
                ))}
              </div>
            </section>

          </div>
        )}

        {activeTab === "explainer" && (
          <section className="mt-5 rounded-3xl border border-[#DCE8E3] bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F4EE] text-[#08745B]">
                <HelpCircle size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#17324D]">
                  Plain-Language Explanation
                </h2>

                <p className="mt-3 leading-7 text-[#60778D]">
                  This report contains information extracted from your
                  uploaded medical document. The identified diagnosis is{" "}
                  <strong className="text-[#17324D]">
                    {report.diagnosis}
                  </strong>
                  . Your recorded blood pressure is{" "}
                  <strong className="text-[#17324D]">
                    {report.bloodPressure}
                  </strong>
                  .
                </p>

                <div className="mt-5 rounded-2xl border border-[#BFE6D6] bg-[#EFFAF6] p-4 text-sm leading-6 text-[#365F53]">
                  This explanation is provided for easier understanding of
                  the extracted medical information. It is not a diagnosis
                  or treatment recommendation.
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "translation" && (
          <section className="mt-5 rounded-3xl border border-[#DCE8E3] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F4EE] text-[#08745B]">
                <Globe2 size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#17324D]">
                  Regional Translation
                </h2>

                <p className="text-sm text-[#71859A]">
                  Choose a language to view the extracted information.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["English", "Hindi", "Kannada", "Tamil", "Telugu"].map(
                (language) => (
                  <button
                    key={language}
                    type="button"
                    className="rounded-xl border border-[#D7E4DF] px-4 py-2 text-sm font-semibold text-[#36566D] transition hover:border-[#079669] hover:bg-[#EFFAF6] hover:text-[#08745B]"
                  >
                    {language}
                  </button>
                )
              )}
            </div>
          </section>
        )}

        {activeTab === "ocr" && (
          <section className="mt-5 rounded-3xl border border-[#DCE8E3] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F4EE] text-[#08745B]">
                <FileText size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#17324D]">
                  Raw OCR Inspector
                </h2>

                <p className="text-sm text-[#71859A]">
                  Original extracted text from the uploaded document.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#DCE8E3] bg-[#F8FAF9] p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-[#40586E]">
{`Hospital: ${report.hospital}
Doctor: ${report.doctor}
Patient: ${report.patient}
Patient ID: ${report.patientId}
Diagnosis: ${report.diagnosis}
Date: ${report.date}
Blood Pressure: ${report.bloodPressure}`}
              </pre>
            </div>
          </section>
        )}

        {/* Footer note */}
        <div className="mt-5 rounded-2xl border border-[#DCE8E3] bg-[#EFFAF6] p-4 text-center text-xs leading-5 text-[#527568]">
          RuralCare AI organizes extracted medical information for easier
          review. Always consult a qualified healthcare professional for
          diagnosis and treatment decisions.
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-[#D9E5E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#36566D] transition hover:border-[#079669] hover:bg-[#EFFAF6] hover:text-[#08745B]"
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#079669] text-white shadow-sm"
          : "border border-transparent bg-[#F3F7F5] text-[#62798E] hover:bg-[#E8F4EF] hover:text-[#08745B]"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

function InfoCard({ icon: Icon, label, value, highlight = false }) {
  return (
    <section
      className={`rounded-3xl border p-6 shadow-sm ${
        highlight
          ? "border-[#BFE6D6] bg-gradient-to-br from-[#EFFAF6] to-white"
          : "border-[#DCE8E3] bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F4EE] text-[#079669]">
          <Icon size={25} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#688196]">
            {label}
          </p>

          <h2 className="mt-2 text-xl font-bold leading-7 text-[#17324D]">
            {value}
          </h2>
        </div>
      </div>
    </section>
  );
}

function SmallInfoCard({
  icon: Icon,
  label,
  title,
  description,
  accent = false,
}) {
  return (
    <section className="rounded-3xl border border-[#DCE8E3] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon
          size={21}
          className={accent ? "text-[#079669]" : "text-[#08745B]"}
        />

        <p className="text-xs font-bold uppercase tracking-wider text-[#70869A]">
          {label}
        </p>
      </div>

      <h3
        className={`mt-4 text-lg font-bold ${
          accent ? "text-[#079669]" : "text-[#17324D]"
        }`}
      >
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm text-[#71859A]">{description}</p>
      )}
    </section>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F4EE] text-[#079669]">
        <Icon size={20} />
      </div>

      <h2 className="text-lg font-bold text-[#17324D]">{title}</h2>
    </div>
  );
}

function VitalCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#DCE8E3] bg-[#F7FAF9] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#71869A]">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-[#17324D]">{value}</p>
    </div>
  );
}

function MedicineCard({ medicine, index }) {
  return (
    <div className="rounded-2xl border border-[#DCE8E3] bg-[#F8FAF9] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-sm font-bold text-[#08745B]">
            {index}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#17324D]">
                {medicine.name}
              </h3>

              <span className="rounded-lg bg-[#E5F4EE] px-2.5 py-1 text-xs font-bold text-[#079669]">
                {medicine.strength}
              </span>

              <span className="rounded-lg bg-[#E9EEF2] px-2.5 py-1 text-xs font-semibold text-[#657B8F]">
                {medicine.form}
              </span>
            </div>

            <p className="mt-2 text-sm text-[#647B90]">
              Instructions:{" "}
              <span className="font-semibold text-[#08745B]">
                {medicine.instructions}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <span className="rounded-full border border-[#A9DFC9] bg-[#ECFAF4] px-3 py-1.5 text-xs font-bold text-[#08745B]">
            Dosage: {medicine.dosage}
          </span>

          <span className="rounded-full bg-[#E9EEF2] px-3 py-1.5 text-xs font-semibold text-[#526B80]">
            {medicine.timing}
          </span>

          <span className="rounded-full bg-[#E9EEF2] px-3 py-1.5 text-xs font-semibold text-[#526B80]">
            {medicine.duration}
          </span>
        </div>

      </div>
    </div>
  );
}