import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  CalendarDays,
  Languages,
  UserRound,
  ArrowDownUp,
  SlidersHorizontal,
  Eye,
  Trash2,
  FileText,
  Upload,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------
// Demo records
// ---------------------------------------------------------

const DEFAULT_PRESCRIPTIONS = [
  {
    id: "demo-1",
    date: "26 July 2026",
    medication: "Paracetamol",
    language: "Telugu",
    doctor: "Dr. Kumar",
    status: ["Simplified", "Translated"],
    prescriptionText:
      "Fever and body pain prescription for adults.",
  },
  {
    id: "demo-2",
    date: "20 July 2026",
    medication: "Amoxicillin",
    language: "English",
    doctor: "Dr. Sharma",
    status: ["Translated"],
    prescriptionText:
      "Antibiotic dosage for bacterial infection.",
  },
];

// ---------------------------------------------------------
// Date helper
// ---------------------------------------------------------

function getDateValue(date) {
  if (!date) return 0;

  const parsed = new Date(date);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.getTime();
  }

  return 0;
}

// ---------------------------------------------------------
// Status badge
// ---------------------------------------------------------

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let className =
    "border-slate-200 bg-slate-50 text-slate-600";

  if (normalized === "completed") {
    className =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (normalized === "translated") {
    className =
      "border-blue-200 bg-blue-50 text-blue-700";
  } else if (normalized === "simplified") {
    className =
      "border-violet-200 bg-violet-50 text-violet-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------
// Prescription card
// ---------------------------------------------------------

function PrescriptionHistoryCard({
  prescription,
  onView,
  onDelete,
}) {
  const statuses = Array.isArray(prescription.status)
    ? prescription.status
    : [prescription.status || "Completed"];

  const medication =
    prescription.medication ||
    prescription.title ||
    prescription.diagnosis ||
    "Medical Scan";

  const doctor =
    prescription.doctor ||
    prescription.hospital ||
    "Medical Clinic";

  const language =
    prescription.language || "English";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-emerald-200 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Record information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FileText size={23} />
            </div>

            <div className="min-w-0 flex-1">

              {/* Title + status */}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {medication}
                </h3>

                {statuses.map((status, index) => (
                  <StatusBadge
                    key={`${status}-${index}`}
                    status={status}
                  />
                ))}
              </div>

              {/* Metadata */}
              <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-3">

                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>
                    {prescription.date || "Date unavailable"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Languages
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>{language}</span>
                </div>

                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>{doctor}</span>
                </div>

              </div>

              {/* OCR / prescription text */}
              {(prescription.prescriptionText ||
                prescription.ocrText) && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                  {prescription.prescriptionText ||
                    prescription.ocrText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Eye size={17} />
            View
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>

      </div>
    </article>
  );
}

// ---------------------------------------------------------
// History page
// ---------------------------------------------------------

export default function History() {
  const navigate = useNavigate();

  // -------------------------------------------------------
  // Load saved records
  // -------------------------------------------------------

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(
        "user_prescriptions"
      );

      const savedList = stored
        ? JSON.parse(stored)
        : [];

      if (!Array.isArray(savedList)) {
        return DEFAULT_PRESCRIPTIONS;
      }

      return [...savedList, ...DEFAULT_PRESCRIPTIONS];
    } catch (error) {
      console.error(
        "Failed to load prescription history:",
        error
      );

      return DEFAULT_PRESCRIPTIONS;
    }
  });

  // -------------------------------------------------------
  // Filters
  // -------------------------------------------------------

  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [doctorFilter, setDoctorFilter] =
    useState("All");

  const [sortOrder, setSortOrder] =
    useState("Recent");

  // -------------------------------------------------------
  // Filter records
  // -------------------------------------------------------

  const filteredPrescriptions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    let result = prescriptions.filter((item) => {
      const medication = String(
        item.medication ||
          item.title ||
          item.diagnosis ||
          ""
      ).toLowerCase();

      const doctor = String(
        item.doctor ||
          item.hospital ||
          ""
      ).toLowerCase();

      const prescriptionText = String(
        item.prescriptionText ||
          item.ocrText ||
          item.text ||
          ""
      ).toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        medication.includes(normalizedSearch) ||
        doctor.includes(normalizedSearch) ||
        prescriptionText.includes(normalizedSearch);

      const matchesLanguage =
        languageFilter === "All" ||
        item.language === languageFilter;

      const matchesDate =
        dateFilter === "All" ||
        item.date === dateFilter;

      const itemStatuses = Array.isArray(item.status)
        ? item.status
        : [item.status];

      const matchesStatus =
        statusFilter === "All" ||
        itemStatuses.includes(statusFilter);

      const matchesDoctor =
        doctorFilter === "All" ||
        (item.doctor || item.hospital) ===
          doctorFilter;

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesDate &&
        matchesStatus &&
        matchesDoctor
      );
    });

    // Sort
    result = [...result].sort((a, b) => {
      const dateA = getDateValue(
        a.date || a.created_at || a.createdAt
      );

      const dateB = getDateValue(
        b.date || b.created_at || b.createdAt
      );

      if (sortOrder === "Oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [
    prescriptions,
    search,
    languageFilter,
    dateFilter,
    statusFilter,
    doctorFilter,
    sortOrder,
  ]);

  // -------------------------------------------------------
  // Delete record
  // -------------------------------------------------------

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prescription record?"
    );

    if (!confirmDelete) {
      return;
    }

    setPrescriptions((previous) => {
      const updated = previous.filter(
        (item) => item.id !== id
      );

      // Only persist user-created records.
      const userRecords = updated.filter(
        (item) =>
          typeof item.id === "string" &&
          item.id.startsWith("ocr-")
      );

      localStorage.setItem(
        "user_prescriptions",
        JSON.stringify(userRecords)
      );

      return updated;
    });
  };

  // -------------------------------------------------------
  // Clear filters
  // -------------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setLanguageFilter("All");
    setDateFilter("All");
    setStatusFilter("All");
    setDoctorFilter("All");
    setSortOrder("Recent");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    languageFilter !== "All" ||
    dateFilter !== "All" ||
    statusFilter !== "All" ||
    doctorFilter !== "All" ||
    sortOrder !== "Recent";

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#faf9f6]">

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <FileText size={14} />
                Medical Records
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Prescription & OCR History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your saved prescriptions, scanned
                medical documents, translations, and
                extracted medical information in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <Upload size={18} />
              Upload Record
            </button>

          </div>
        </section>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <SlidersHorizontal
              size={18}
              className="text-emerald-700"
            />
            Search & Filter Records
          </div>

          {/* Search */}
          <div className="relative mt-4">

            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              type="text"
              placeholder="Search prescription, medicine, doctor, or OCR text..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}

          </div>

          {/* Filters */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {/* Language */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Language
              </label>

              <select
                value={languageFilter}
                onChange={(event) =>
                  setLanguageFilter(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="All">
                  All Languages
                </option>
                <option value="Telugu">
                  Telugu
                </option>
                <option value="English">
                  English
                </option>
                <option value="Hindi">
                  Hindi
                </option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Date
              </label>

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="All">
                  All Dates
                </option>
                <option value="26 July 2026">
                  26 July 2026
                </option>
                <option value="20 July 2026">
                  20 July 2026
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="All">
                  All Status
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Simplified">
                  Simplified
                </option>
                <option value="Translated">
                  Translated
                </option>
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Doctor
              </label>

              <select
                value={doctorFilter}
                onChange={(event) =>
                  setDoctorFilter(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="All">
                  All Doctors
                </option>
                <option value="Dr. Kumar">
                  Dr. Kumar
                </option>
                <option value="Dr. Sharma">
                  Dr. Sharma
                </option>
                <option value="Dr. Sushil Jethani">
                  Dr. Sushil Jethani
                </option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Sort
              </label>

              <div className="relative">

                <ArrowDownUp
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                />

                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                >
                  <option value="Recent">
                    Recent
                  </option>
                  <option value="Oldest">
                    Oldest
                  </option>
                </select>

              </div>
            </div>

            {/* Clear */}
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="h-11 w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
              >
                Clear Filters
              </Button>
            </div>

          </div>
        </section>

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div className="mt-7 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Saved Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPrescriptions.length}{" "}
              {filteredPrescriptions.length === 1
                ? "record"
                : "records"}{" "}
              found
            </p>
          </div>

        </div>

        {/* =================================================
            RECORDS
        ================================================= */}

        <section className="mt-4 space-y-4">

          {filteredPrescriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <FileText size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No prescriptions to display
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No medical records match your current
                search and filters. Upload a prescription
                or medical document to start building
                your history.
              </p>

              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <Upload size={17} />
                Upload Record
              </button>

            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <PrescriptionHistoryCard
                key={prescription.id}
                prescription={prescription}
                onView={() =>
                  navigate(
                    `/prescription/${prescription.id}`
                  )
                }
                onDelete={() =>
                  handleDelete(prescription.id)
                }
              />
            ))
          )}

        </section>

      </div>
    </main>
  );
}