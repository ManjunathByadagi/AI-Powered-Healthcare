import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  Camera,
  FileText,
  Sparkles,
  RotateCw,
  SunMedium,
  Contrast,
  Languages,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileCheck2,
  ShieldCheck,
  X,
} from "lucide-react";

import CameraCapture from "./CameraCapture";
import { SAMPLE_PRESCRIPTIONS } from "../utils/samplePrescriptions";

const OCR_LANGUAGES = [
  { code: "eng", name: "English (Default)" },
  { code: "hin", name: "Hindi (हिन्दी)" },
  { code: "mar", name: "Marathi (मराठी)" },
  { code: "tel", name: "Telugu (తెలుగు)" },
  { code: "tam", name: "Tamil (தமிழ்)" },
  { code: "ben", name: "Bengali (বাংলা)" },
  { code: "guj", name: "Gujarati (ગુજરાતી)" },
  { code: "kan", name: "Kannada (ಕನ್ನಡ)" },
  { code: "mal", name: "Malayalam (മലയാളം)" },
  { code: "pan", name: "Punjabi (ਪੰਜਾਬੀ)" },
];

function UploadSection({
  onImageChange,
  onExtract,
  onLoadSample,
  selectedLanguage,
  onLanguageChange,
  imageFilters,
  onFilterChange,
  activeFileName,
  activeFileSize,
  isProcessing,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "application/pdf",
  ];

  const validateAndSend = (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!allowedTypes.includes(file.type) && !isPdf) {
      setError(
        "Please upload an image (JPG, PNG, WebP) or PDF prescription file."
      );
      return;
    }

    // 25 MB limit
    if (file.size > 25 * 1024 * 1024) {
      setError("File size must be less than 25 MB.");
      return;
    }

    setError("");
    onImageChange({ target: { files: [file] } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      validateAndSend(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      validateAndSend(selectedFile);
    }

    // Allows selecting the same file again
    e.target.value = "";
  };

  const handleCameraCapture = (file) => {
    validateAndSend(file);
    setIsCameraModalOpen(false);
  };

  const handleResetFilters = () => {
    onFilterChange({
      rotation: 0,
      grayscale: false,
      highContrast: false,
      invert: false,
    });
  };

  const selectedLanguageName =
    OCR_LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name ||
    "English (Default)";

  return (
    <div className="space-y-5 text-[#17324D]">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="rounded-2xl border border-[#DDE7E2] bg-white p-5 shadow-[0_4px_18px_rgba(23,50,77,0.05)] sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          {/* Title */}
          <div className="flex gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F5F0] text-[#08745B]">
              <FileCheck2 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#17324D] sm:text-2xl">
                Medical Document Scanner
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#60758A]">
                Upload a prescription, medical certificate, lab report, or
                multi-page PDF and extract the medical text automatically.
              </p>
            </div>

          </div>

          {/* Language */}
          <div className="w-full lg:w-auto">

            <div className="flex items-center gap-2 rounded-xl border border-[#DDE7E2] bg-[#F7FAF8] px-3 py-2.5">

              <Languages
                size={17}
                className="shrink-0 text-[#08745B]"
              />

              <span className="whitespace-nowrap text-xs font-semibold text-[#60758A]">
                OCR Language
              </span>

              <select
                value={selectedLanguage || "eng"}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="min-w-[155px] cursor-pointer rounded-lg border border-[#D8E3DE] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#17324D] outline-none transition focus:border-[#08745B] focus:ring-2 focus:ring-[#08745B]/10"
              >
                {OCR_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

            </div>

          </div>
        </div>

        {/* Security / support strip */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#E7EEEB] pt-4">

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F8F5] px-3 py-1.5 text-[11px] font-semibold text-[#08745B]">
            <ShieldCheck size={13} />
            Secure document processing
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8F7] px-3 py-1.5 text-[11px] font-medium text-[#60758A]">
            <FileText size={13} />
            JPG, PNG, WebP & PDF
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8F7] px-3 py-1.5 text-[11px] font-medium text-[#60758A]">
            <ImageIcon size={13} />
            Up to 25 MB
          </span>

        </div>
      </div>


      {/* =========================================================
          QUICK SAMPLES
      ========================================================= */}
      <div className="rounded-2xl border border-[#DDE7E2] bg-white p-5 shadow-[0_4px_18px_rgba(23,50,77,0.04)] sm:p-6">

        <div className="mb-4 flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F5F0] text-[#08745B]">
              <Sparkles size={16} />
            </span>

            <div>
              <h3 className="text-sm font-bold text-[#17324D]">
                Try a sample document
              </h3>

              <p className="text-xs text-[#7A8D9D]">
                Quickly test the OCR pipeline
              </p>
            </div>

          </div>

          <span className="hidden rounded-full bg-[#F1F8F5] px-2.5 py-1 text-[10px] font-bold text-[#08745B] sm:inline-flex">
            INSTANT TEST
          </span>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {SAMPLE_PRESCRIPTIONS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onLoadSample(sample)}
              disabled={isProcessing}
              className="group rounded-xl border border-[#DDE7E2] bg-[#FAFCFB] p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8BC9B4] hover:bg-[#F1F8F5] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >

              <div className="flex items-center justify-between gap-2">

                <span className="rounded-md bg-[#DFF2EA] px-2 py-1 text-[10px] font-bold text-[#08745B]">
                  {sample.badge}
                </span>

                <Sparkles
                  size={13}
                  className="text-[#A1B2BF] transition-colors group-hover:text-[#08745B]"
                />

              </div>

              <p className="mt-2 line-clamp-1 text-xs font-bold text-[#17324D] group-hover:text-[#08745B]">
                {sample.title}
              </p>

              <p className="mt-1 line-clamp-1 text-[11px] text-[#7A8D9D]">
                {sample.patient}
              </p>

            </button>
          ))}

        </div>
      </div>


      {/* =========================================================
          UPLOAD / DRAG DROP
      ========================================================= */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 sm:p-10 ${
          isDragging
            ? "border-[#08745B] bg-[#EAF7F1] shadow-[0_0_0_4px_rgba(8,116,91,0.08)]"
            : "border-[#BFD8CD] bg-[#F9FCFA] hover:border-[#74B99F] hover:bg-[#F5FAF7]"
        }`}
      >

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#E8F5F0]" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#F1F8F5]" />

        <div className="relative">

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#BDE2D3] bg-[#E8F5F0] text-[#08745B] shadow-sm">
            <UploadCloud size={31} strokeWidth={1.8} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-[#17324D]">
            {isDragging
              ? "Drop your document here"
              : "Upload your medical document"}
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6D8293]">
            Drag and drop your prescription, medical slip, certificate, lab
            report, or PDF here. You can also select a file or use your camera.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <label
              className={`inline-flex min-w-[205px] cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition-all ${
                isProcessing
                  ? "cursor-not-allowed bg-[#B8CEC5] text-white"
                  : "bg-[#08745B] text-white hover:bg-[#06664F] hover:shadow-md"
              }`}
            >
              <FileText size={17} />

              <span>
                Choose File
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.bmp,.tiff,.pdf,image/*,application/pdf"
                onChange={handleFileInputChange}
                disabled={isProcessing}
                className="hidden"
              />
            </label>

            <Button
              type="button"
              variant="outline"
              disabled={isProcessing}
              onClick={() => setIsCameraModalOpen(true)}
              className="min-w-[205px] rounded-xl border-[#C9DCD4] bg-white px-5 py-3 text-sm font-bold text-[#17324D] shadow-sm hover:bg-[#F1F8F5] hover:text-[#08745B]"
            >
              <Camera
                size={17}
                className="mr-2 text-[#08745B]"
              />

              Capture with Camera
            </Button>

          </div>

          {/* File information */}
          {activeFileName && (
            <div className="mx-auto mt-5 flex w-fit max-w-full items-center gap-2 rounded-xl border border-[#BDE2D3] bg-[#F1F8F5] px-4 py-2.5 text-left">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#08745B]">
                <CheckCircle2 size={16} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-bold text-[#17324D]">
                  {activeFileName}
                </p>

                {activeFileSize && (
                  <p className="text-[10px] text-[#718696]">
                    {activeFileSize}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-auto mt-4 flex max-w-lg items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs text-red-700">

              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto shrink-0 text-red-400 hover:text-red-700"
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>

            </div>
          )}

        </div>
      </div>


      {/* =========================================================
          IMAGE FILTERS
      ========================================================= */}
      <div className="rounded-2xl border border-[#DDE7E2] bg-white p-4 shadow-[0_4px_18px_rgba(23,50,77,0.04)] sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Label */}
          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F5F0] text-[#08745B]">
              <Contrast size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#17324D]">
                Image enhancement
              </p>

              <p className="mt-0.5 text-xs text-[#7A8D9D]">
                Improve faint handwriting and scanned document quality
              </p>
            </div>

          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  rotation: ((imageFilters?.rotation || 0) + 90) % 360,
                })
              }
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6E2DD] bg-[#F8FAF9] px-3 py-2 text-[11px] font-semibold text-[#526A7B] transition hover:border-[#9CCAB8] hover:bg-[#F1F8F5] hover:text-[#08745B] disabled:opacity-50"
            >
              <RotateCw size={13} />
              Rotate {imageFilters?.rotation || 0}°
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  highContrast: !imageFilters?.highContrast,
                })
              }
              disabled={isProcessing}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                imageFilters?.highContrast
                  ? "border-[#08745B] bg-[#08745B] text-white"
                  : "border-[#D6E2DD] bg-[#F8FAF9] text-[#526A7B] hover:border-[#9CCAB8] hover:bg-[#F1F8F5] hover:text-[#08745B]"
              } disabled:opacity-50`}
            >
              <SunMedium size={13} />
              High Contrast
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  grayscale: !imageFilters?.grayscale,
                })
              }
              disabled={isProcessing}
              className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                imageFilters?.grayscale
                  ? "border-[#08745B] bg-[#08745B] text-white"
                  : "border-[#D6E2DD] bg-[#F8FAF9] text-[#526A7B] hover:border-[#9CCAB8] hover:bg-[#F1F8F5] hover:text-[#08745B]"
              } disabled:opacity-50`}
            >
              Grayscale
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  invert: !imageFilters?.invert,
                })
              }
              disabled={isProcessing}
              className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                imageFilters?.invert
                  ? "border-[#08745B] bg-[#08745B] text-white"
                  : "border-[#D6E2DD] bg-[#F8FAF9] text-[#526A7B] hover:border-[#9CCAB8] hover:bg-[#F1F8F5] hover:text-[#08745B]"
              } disabled:opacity-50`}
            >
              Invert
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isProcessing}
              className="rounded-lg border border-transparent px-3 py-2 text-[11px] font-semibold text-[#8294A2] transition hover:bg-[#F5F7F6] hover:text-[#526A7B] disabled:opacity-50"
            >
              Reset
            </button>

          </div>

        </div>
      </div>


      {/* =========================================================
          OCR ACTION
      ========================================================= */}
      <div className="rounded-2xl border border-[#CFE5DC] bg-[#F1F8F5] p-3 sm:p-4">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#08745B] shadow-sm">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#17324D]">
                Ready to extract medical text?
              </p>

              <p className="text-xs text-[#6D8293]">
                OCR language:{" "}
                <span className="font-semibold text-[#08745B]">
                  {selectedLanguageName}
                </span>
              </p>
            </div>

          </div>

          <Button
            onClick={onExtract}
            disabled={isProcessing}
            className="h-11 w-full rounded-xl bg-[#08745B] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#06664F] hover:shadow-md sm:w-auto"
          >
            <Sparkles
              size={17}
              className={isProcessing ? "mr-2 animate-pulse" : "mr-2"}
            />

            {isProcessing
              ? "Processing document..."
              : "Run OCR & Extract Text"}
          </Button>

        </div>

      </div>


      {/* =========================================================
          CAMERA MODAL
      ========================================================= */}
      {isCameraModalOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraModalOpen(false)}
        />
      )}

    </div>
  );
}

export default UploadSection;