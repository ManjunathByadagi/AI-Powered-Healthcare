import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, FileText, Languages, MessageSquare, Pill } from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickUpload from "@/components/dashboard/QuickUpload";
import RecentPrescriptionCard from "@/components/dashboard/RecentPrescriptionCard";
import HealthTipCard from "@/components/dashboard/HealthTipCard";
import { getDashboardSummary } from "@/services/dashboard";

function getRecordDateValue(record) {
  const raw = record?.createdAt || record?.created_at || record?.uploadedAt || record?.date || record?.id;
  const fromId = typeof raw === "string" && raw.startsWith("ocr-") ? raw.replace("ocr-", "") : raw;
  const parsed = new Date(fromId);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export default function Home() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [healthTip, setHealthTip] = useState("");
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const loadDashboard = async () => {
    setLoadingDashboard(true);
    setDashboardError("");
    try {
      const summary = await getDashboardSummary();
      setStats(summary.stats);
      setRecords(summary.records);
      setHealthTip(summary.rawStats?.data?.health_tip || summary.rawStats?.health_tip || "");
    } catch (error) {
      console.error("Dashboard summary failed:", error);
      setStats(null);
      setRecords([]);
      setDashboardError("Dashboard statistics are unavailable. Start the backend and refresh to load real values.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    window.addEventListener("focus", loadDashboard);
    return () => window.removeEventListener("focus", loadDashboard);
  }, []);

  const recentRecords = useMemo(
    () => [...records].sort((a, b) => getRecordDateValue(b) - getRecordDateValue(a)).slice(0, 4),
    [records]
  );

  const statCards = [
    { label: "Total records", value: stats?.totalRecords, icon: FileText },
    { label: "Completed", value: stats?.completed, icon: CheckCircle2 },
    { label: "Medicines", value: stats?.medicines, icon: Pill },
    { label: "Translations", value: stats?.translations, icon: Languages },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      <DashboardHeader />

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
        {dashboardError && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning/10 p-4 text-sm text-foreground">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p>{dashboardError}</p>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon size={17} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">
                  {loadingDashboard ? "..." : item.value ?? "-"}
                </p>
              </div>
            );
          })}
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
          <QuickUpload />
          <div className="grid gap-5">
            <HealthTipCard tip={healthTip} recordsCount={stats?.totalRecords || 0} />
            <section className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <MessageSquare size={20} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Ask your health assistant</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Get plain-language help through the existing assistant experience.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/assistant")}
                    className="mt-4 rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                  >
                    Open assistant
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent medical records</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest saved prescription scans and uploaded documents.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="shrink-0 text-sm font-semibold text-primary transition hover:text-primary-dark"
            >
              View all
            </button>
          </div>

          {recentRecords.length > 0 ? (
            <div className="divide-y divide-border">
              {recentRecords.map((item) => (
                <RecentPrescriptionCard key={item.id} prescription={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-secondary/60 px-4 py-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {loadingDashboard ? "Loading records" : "No saved records yet"}
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Upload or scan your first medical document to build your private record history.
              </p>
              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
              >
                Upload document
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
