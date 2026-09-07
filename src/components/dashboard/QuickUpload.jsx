import { Camera, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickUpload() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Primary action
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            Upload a medical document
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Scan or upload a prescription, lab report, or medical document.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/upload")}
          className="flex min-h-24 items-center gap-3 rounded-xl bg-primary px-4 py-4 text-left text-primary-foreground shadow-sm transition hover:bg-primary-dark"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Camera size={22} />
          </span>
          <span>
            <span className="block text-sm font-semibold">Scan with Camera</span>
            <span className="mt-1 block text-xs text-white/80">
              Capture a clear document photo
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/upload")}
          className="flex min-h-24 items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-4 text-left text-foreground transition hover:border-primary/25 hover:bg-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
            <FileUp size={22} />
          </span>
          <span>
            <span className="block text-sm font-semibold">Upload Document</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Supports images and PDF files
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
