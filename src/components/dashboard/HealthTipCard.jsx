import { HeartPulse } from "lucide-react";

export default function HealthTipCard({ tip = "", recordsCount = 0 }) {
  const fallbackTip = recordsCount > 0
    ? "Keep your uploaded records organized and share them with a licensed clinician when you need medical guidance."
    : "Start by uploading a prescription or report so your medical information is easier to review later.";

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <HeartPulse size={20} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">Health insight</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {tip || fallbackTip}
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            This dashboard supports record review and communication. It is not a diagnosis or treatment plan.
          </p>
        </div>
      </div>
    </section>
  );
}
