import React, { useState, useEffect } from "react";
import {
  Activity,
  Bed,
  Stethoscope,
  HeartPulse,
  TrendingUp,
  AlertCircle,
  Users,
  ShieldCheck,
  RefreshCw,
  MapPin,
  PhoneCall,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBeds: 120,
    availableBeds: 84,
    icuBeds: 12,
    doctorsOnDuty: 18,
    oxygenStock: "92%",
    totalConsultations: 1420,
    activePatients: 340,
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Dashboard metrics refreshed!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-28">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 pb-10 pt-8 text-white shadow-lg border-b border-emerald-700/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                RuralCare AI • Health Intelligence
              </p>
            </div>
            <h1 className="mt-1 text-3xl font-bold font-serif text-white">
              Rural Hospital Analytics & Capacity
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Real-time monitoring for Primary Health Centers (PHCs) & District Clinics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-emerald-500/50 bg-emerald-950/60 text-white hover:bg-emerald-800 text-xs"
            >
              <RefreshCw size={14} className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Metrics
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6 px-5 -mt-5">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Available Beds */}
          <Card className="border border-slate-700 bg-slate-800 p-4 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">OPD Beds</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Bed size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.availableBeds} <span className="text-xs text-slate-400 font-normal">/ {stats.totalBeds}</span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">70% Capacity Available</p>
          </Card>

          {/* Card 2: Doctors on Duty */}
          <Card className="border border-slate-700 bg-slate-800 p-4 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Doctors Active</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Stethoscope size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.doctorsOnDuty}</p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">6 Tele-Health Ready</p>
          </Card>

          {/* Card 3: ICU Beds */}
          <Card className="border border-slate-700 bg-slate-800 p-4 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">ICU Beds</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <HeartPulse size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.icuBeds}</p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">Emergency Ready</p>
          </Card>

          {/* Card 4: Oxygen Stock */}
          <Card className="border border-slate-700 bg-slate-800 p-4 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Oxygen Reserve</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.oxygenStock}</p>
            <p className="mt-1 text-[11px] text-slate-400">450L Stocked</p>
          </Card>
        </div>

        {/* Analytics Section & Common Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Consultations Analytics */}
          <Card className="col-span-1 md:col-span-2 border border-slate-700 bg-slate-800 p-5 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={20} />
                <h3 className="font-bold text-lg text-white">OPD Patient Flow Analytics</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setTimeframe("week")}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                    timeframe === "week" ? "bg-emerald-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeframe("month")}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                    timeframe === "month" ? "bg-emerald-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Visual Bar Graph Representation */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Monday (OPD Peak)</span>
                  <span className="font-bold text-emerald-400">240 Patients</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Tuesday</span>
                  <span className="font-bold text-emerald-400">195 Patients</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Wednesday</span>
                  <span className="font-bold text-emerald-400">210 Patients</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Thursday (Today)</span>
                  <span className="font-bold text-emerald-400">180 Patients</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Common Disease Prevalence Breakdown */}
          <Card className="border border-slate-700 bg-slate-800 p-5 shadow-lg text-slate-100">
            <h3 className="font-bold text-base text-white mb-3 border-b border-slate-700 pb-2">
              Common Rural Conditions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <span className="font-semibold text-slate-200">Viral Fever & Seasonal Infections</span>
                <span className="font-bold text-emerald-400">38%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <span className="font-semibold text-slate-200">Respiratory & Bronchitis</span>
                <span className="font-bold text-emerald-400">24%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <span className="font-semibold text-slate-200">Diabetes Mellitus</span>
                <span className="font-bold text-emerald-400">18%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <span className="font-semibold text-slate-200">Hypertension</span>
                <span className="font-bold text-emerald-400">12%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Primary Health Centers (PHC) Network */}
        <Card className="border border-slate-700 bg-slate-800 p-5 shadow-lg text-slate-100">
          <h3 className="font-bold text-lg text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
            <MapPin className="text-emerald-400" size={20} /> Primary Healthcare Center (PHC) Network
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Raipur Central PHC</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <p className="text-xs text-slate-400">Distance: 4.2 km • Tele-consultation active</p>
              <div className="pt-2 flex items-center gap-2">
                <a href="tel:108" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                  <PhoneCall size={12} /> Contact Emergency
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Durg Rural Health Clinic</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <p className="text-xs text-slate-400">Distance: 8.5 km • 3 Ambulances ready</p>
              <div className="pt-2 flex items-center gap-2">
                <a href="tel:104" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                  <PhoneCall size={12} /> Helpline 104
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Bilaspur Community Center</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <p className="text-xs text-slate-400">Distance: 12.0 km • Oxygen stock 100%</p>
              <div className="pt-2 flex items-center gap-2">
                <a href="tel:108" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                  <PhoneCall size={12} /> Contact PHC
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
