import { ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatStatus(status) {
  if (Array.isArray(status)) return status.filter(Boolean).join(", ");
  return status || "Saved";
}

export default function RecentPrescriptionCard({ prescription }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/prescription/${prescription.id}`)}
      className="group flex w-full items-center justify-between gap-4 rounded-xl px-2 py-4 text-left transition hover:bg-secondary sm:px-3"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <FileText size={20} />
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {prescription.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {prescription.language && <span>{prescription.language}</span>}
            <span>{formatStatus(prescription.status)}</span>
            {prescription.date && <span>{prescription.date}</span>}
          </div>
        </div>
      </div>

      <ChevronRight
        className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
        size={19}
      />
    </button>
  );
}
