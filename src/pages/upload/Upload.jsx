import { useState } from "react";
import Tesseract from "tesseract.js";

import UploadSection from "./components/UploadSection";
import ImagePreview from "./components/ImagePreview";
import OCRResult from "./components/OCRResult";
import Spinner from "./components/Spinner";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import toast from "react-hot-toast";

import { renderPdfToCanvases } from "./utils/pdfProcessor";
import { enhanceImageForOcr, canvasToBlob } from "./utils/imageEnhancer";
import { generateSampleCanvas } from "./utils/samplePrescriptions";


export default function Upload() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [activeFileName, setActiveFileName] = useState("");
  const [activeFileSize, setActiveFileSize] = useState("");

  // Multi-page PDF state
  const [pdfCanvases, setPdfCanvases] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [pageThumbnails, setPageThumbnails] = useState([]);

  // Preprocessing & Image filter state
  const [imageFilters, setImageFilters] = useState({
    rotation: 0,
    grayscale: false,
    highContrast: false,
    invert: false,
  });

  // OCR Execution & Result state
  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const [ocrResult, setOcrResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");


  // ============================================================
  // SAVE SUCCESSFUL UPLOAD TO DASHBOARD
  // ============================================================

  const saveToDashboard = async ({
    title,
    language = "English",
    status = "Completed",
    medicine = "",
    translation = "",
  }) => {
    try {
      const response = await fetch(
        "http://localhost:8001/api/dashboard/records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            language,
            status,
            medicine,
            translation,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Dashboard save failed (${response.status}): ${errorText}`
        );
      }

      const result = await response.json();

      console.log(
        "Dashboard record saved successfully:",
        result
      );

      return true;
    } catch (err) {
      /*
       * Dashboard saving should not break the OCR workflow.
       * The medical document has already been processed successfully.
       */
      console.warn(
        "Could not save record to dashboard:",
        err
      );

      return false;
    }
  };


  // ============================================================
  // EXTRACT MEDICINE INFORMATION FROM BACKEND RESPONSE
  // ============================================================

  const extractMedicineNames = (medicines) => {
    if (!Array.isArray(medicines)) {
      return "";
    }

    return medicines
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (!item || typeof item !== "object") {
          return "";
        }

        return (
          item.name ||
          item.medicine ||
          item.medication ||
          item.primary_medication ||
          ""
        );
      })
      .filter(Boolean)
      .join(", ");
  };


  // ============================================================
  // MASTER FILE SELECTION HANDLER
  // ============================================================

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setImageFile(selectedFile);
    setFileType(selectedFile.type);
    setActiveFileName(selectedFile.name);
    setActiveFileSize(
      (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB"
    );

    setError("");
    setOcrResult("");
    setProgress(0);
    setPdfCanvases([]);
    setPageThumbnails([]);
    setActivePage(0);

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      setImagePreview(null);
      setStatusMessage("Rendering PDF pages for OCR...");

      try {
        const {
          canvases,
          numPages,
          pageThumbnails: thumbs,
        } = await renderPdfToCanvases(
          selectedFile,
          2.5
        );

        setPdfCanvases(canvases);
        setPageThumbnails(thumbs);

        toast.success(
          `Loaded ${numPages} PDF page${
            numPages > 1 ? "s" : ""
          }`
        );
      } catch (err) {
        console.error(
          "PDF render error:",
          err
        );

        toast.error(
          "Could not render PDF. Using direct binary OCR."
        );
      }
    } else {
      const url =
        URL.createObjectURL(selectedFile);

      setImagePreview(url);
    }
  };


  // ============================================================
  // 1-CLICK SAMPLE PRESCRIPTION LOADER
  // ============================================================

  const handleLoadSample = (sample) => {
    setError("");
    setOcrResult("");
    setProgress(0);

    setActiveFileName(sample.title);
    setActiveFileSize("Sample Rx");
    setFileType("image/png");

    const canvas = generateSampleCanvas(sample);

    setPdfCanvases([canvas]);
    setPageThumbnails([
      canvas.toDataURL(
        "image/png",
        0.6
      ),
    ]);

    setActivePage(0);

    setImagePreview(
      canvas.toDataURL("image/png")
    );

    canvasToBlob(canvas).then((blob) => {
      const file = new File(
        [blob],
        `${sample.id}.png`,
        {
          type: "image/png",
        }
      );

      setImageFile(file);
    });

    // Auto load OCR text for instant testing
    setOcrResult(sample.text);

    toast.success(
      `Loaded sample: ${sample.title}`
    );
  };


  // ============================================================
  // FILTER CHANGE HANDLER
  // ============================================================

  const handleFilterChange = (newFilters) => {
    setImageFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };


  // ============================================================
  // MASTER OCR EXTRACTION TRIGGER
  // ============================================================

  const handleExtractText = async () => {
    if (
      !imageFile &&
      (!pdfCanvases ||
        pdfCanvases.length === 0)
    ) {
      toast.error(
        "Please upload an image or PDF prescription first."
      );

      return;
    }

    setLoading(true);
    setProgress(5);

    setStatusMessage(
      "Initializing OCR engine & pre-processing filters..."
    );

    setError("");
    setOcrResult("");

    try {
      // ========================================================
      // STEP 1
      // Attempt Backend High-Performance OCR Pipeline
      // ========================================================

      let backendExtracted = false;

      if (imageFile) {
        try {
          const formData = new FormData();

          formData.append(
            "file",
            imageFile
          );

          const controller =
            new AbortController();

          const timeoutId = setTimeout(
            () => controller.abort(),
            4000
          );

          const response = await fetch(
            "http://localhost:8000/api/medical-history/upload",
            {
              method: "POST",
              body: formData,
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const resJson =
              await response.json();

            if (
              resJson.data &&
              (
                resJson.data.originalOCRText ||
                resJson.data.ocr_text ||
                resJson.data.medicines?.length
              )
            ) {
              const data =
                resJson.data;

              const extractedText =
                data.originalOCRText ||
                data.ocr_text ||
                "";

              // ------------------------------------------------
              // Successful Backend OCR
              // ------------------------------------------------

              if (
                extractedText &&
                extractedText.length > 20
              ) {
                setOcrResult(
                  extractedText
                );

                // Extract medicine names
                const medicines =
                  extractMedicineNames(
                    data.medicines
                  );

                // Extract translation if backend provides it
                const translation =
                  data.translation ||
                  data.translated_text ||
                  data.translatedText ||
                  "";

                // Save successful upload to Dashboard
                await saveToDashboard({
                  title:
                    activeFileName ||
                    imageFile?.name ||
                    "Medical Document",

                  language:
                    data.language ||
                    "English",

                  status:
                    "Completed",

                  medicine:
                    medicines,

                  translation:
                    translation,
                });

                setLoading(false);
                setProgress(100);

                toast.success(
                  "Text extracted via AI OCR pipeline!"
                );

                backendExtracted = true;

                return;
              }
            }
          }
        } catch (err) {
          console.warn(
            "Backend OCR offline, proceeding with client-side OCR engine:",
            err
          );
        }
      }


      // ========================================================
      // STEP 2
      // Client-Side Multi-Page / Canvas OCR Engine
      // ========================================================

      if (backendExtracted) {
        return;
      }

      setProgress(15);

      setStatusMessage(
        "Preparing high-DPI document canvases & contrast enhancement..."
      );

      let canvasesToOcr = [];


      if (
        pdfCanvases &&
        pdfCanvases.length > 0
      ) {
        canvasesToOcr =
          pdfCanvases;
      } else if (
        imagePreview ||
        imageFile
      ) {
        // Create canvas from image element
        const img = new Image();

        img.crossOrigin =
          "anonymous";

        const imgLoaded =
          new Promise(
            (res, rej) => {
              img.onload = () =>
                res();

              img.onerror = (e) =>
                rej(e);
            }
          );

        img.src =
          imagePreview ||
          URL.createObjectURL(
            imageFile
          );

        await imgLoaded;

        // Apply preprocessing filters
        const enhancedCanvas =
          enhanceImageForOcr(
            img,
            {
              rotation:
                imageFilters.rotation,

              grayscale:
                imageFilters.grayscale,

              contrast:
                imageFilters.highContrast
                  ? 1.45
                  : 1.15,

              invert:
                imageFilters.invert,
            }
          );

        canvasesToOcr = [
          enhancedCanvas,
        ];
      }


      if (
        canvasesToOcr.length === 0
      ) {
        throw new Error(
          "No readable image frames available for OCR scanning."
        );
      }


      let aggregatedText = "";

      const totalPages =
        canvasesToOcr.length;


      // ========================================================
      // PROCESS EACH PAGE
      // ========================================================

      for (
        let i = 0;
        i < totalPages;
        i++
      ) {
        const currentCanvas =
          canvasesToOcr[i];

        const pageNum = i + 1;

        setStatusMessage(
          `Scanning page ${pageNum} of ${totalPages} (Language: ${ocrLanguage})...`
        );

        const baseProgress =
          20 +
          Math.round(
            (i / totalPages) *
              70
          );

        setProgress(
          baseProgress
        );


        // Run Tesseract OCR
        const result =
          await Tesseract.recognize(
            currentCanvas,
            ocrLanguage,
            {
              logger: (m) => {
                if (
                  m.status ===
                    "recognizing text" &&
                  m.progress
                ) {
                  const currentStep =
                    Math.round(
                      m.progress *
                        (70 /
                          totalPages)
                    );

                  setProgress(
                    Math.min(
                      95,
                      baseProgress +
                        currentStep
                    )
                  );

                  setStatusMessage(
                    `Scanning page ${pageNum}: Recognizing characters ${Math.round(
                      m.progress * 100
                    )}%`
                  );
                }
              },
            }
          );


        const pageText =
          result.data?.text
            ? result.data.text.trim()
            : "";


        if (pageText) {
          if (totalPages > 1) {
            aggregatedText +=
              `--- PAGE ${pageNum} ---\n` +
              pageText +
              "\n\n";
          } else {
            aggregatedText +=
              pageText +
              "\n";
          }
        }
      }


      // ========================================================
      // FINAL OCR TEXT
      // ========================================================

      const finalCleanText =
        aggregatedText.trim();


      if (
        !finalCleanText ||
        finalCleanText.length < 5
      ) {
        setError(
          "No readable characters could be recognized. Please check the lighting, rotate the image if upside down, or try a clearer prescription photo."
        );

        toast.error(
          "No readable text found"
        );

        setLoading(false);

        return;
      }


      // ========================================================
      // SAVE CLIENT-SIDE OCR RESULT TO DASHBOARD
      // ========================================================

      setProgress(95);

      setStatusMessage(
        "Saving medical document to dashboard..."
      );


      await saveToDashboard({
        title:
          activeFileName ||
          imageFile?.name ||
          "Medical Document",

        language:
          ocrLanguage === "eng"
            ? "English"
            : ocrLanguage,

        status:
          "Completed",

        medicine: "",

        translation: "",
      });


      setOcrResult(
        finalCleanText
      );

      setLoading(false);
      setProgress(100);

      toast.success(
        "OCR medical scan completed successfully!"
      );


    } catch (err) {
      console.error(
        "OCR Extraction Error:",
        err
      );

      setError(
        "Failed to extract text: " +
          (
            err.message ||
            "OCR engine error."
          )
      );

      toast.error(
        "OCR process encountered an error"
      );

      setLoading(false);
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#17324D] pb-28">
      <div className="max-w-4xl mx-auto mt-6 px-4 space-y-6">

        {/* Main Card Wrapper */}
        <Card className="shadow-lg border border-[#DDE5E1] bg-white text-[#17324D] rounded-3xl overflow-hidden">
          <CardContent className="p-5 sm:p-7 space-y-6">

            {/* Upload Section */}
            <UploadSection
              onImageChange={
                handleImageChange
              }

              onExtract={
                handleExtractText
              }

              onLoadSample={
                handleLoadSample
              }

              selectedLanguage={
                ocrLanguage
              }

              onLanguageChange={
                setOcrLanguage
              }

              imageFilters={
                imageFilters
              }

              onFilterChange={
                handleFilterChange
              }

              activeFileName={
                activeFileName
              }

              activeFileSize={
                activeFileSize
              }

              isProcessing={
                loading
              }
            />


            {/* Document / Canvas Preview */}
            <ImagePreview
              image={
                imagePreview
              }

              fileType={
                fileType
              }

              canvases={
                pdfCanvases
              }

              activePage={
                activePage
              }

              onPageChange={
                setActivePage
              }

              pageThumbnails={
                pageThumbnails
              }

              filters={
                imageFilters
              }
            />


            {/* Loading / Progress Animation */}
            {loading && (
              <div className="my-6 p-5 rounded-2xl bg-[#E8F1EE] border border-[#08745B]/30 space-y-3 animate-in fade-in duration-200">

                <Spinner />

                <Progress
                  value={progress}
                  className="h-2.5 bg-[#DDE5E1]"
                />

                <div className="flex items-center justify-between text-xs font-semibold">

                  <span className="text-[#08745B]">
                    {statusMessage ||
                      "Extracting text..."}
                  </span>

                  <span className="text-[#60758A]">
                    {progress}%
                  </span>

                </div>
              </div>
            )}


            {/* Error Notification */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-xs flex items-start gap-2.5 shadow-lg">

                <span className="text-red-600 font-bold text-sm">
                  ⚠️
                </span>

                <div>
                  <p className="font-bold text-red-700">
                    OCR Extraction Notice
                  </p>

                  <p className="mt-0.5">
                    {error}
                  </p>
                </div>

              </div>
            )}


            {/* Structured OCR Results */}
            <OCRResult
              result={ocrResult}
            />

          </CardContent>
        </Card>

      </div>
    </div>
  );
}