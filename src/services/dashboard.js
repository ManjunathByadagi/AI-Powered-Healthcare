import apiClient from "@/lib/axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8001/api";

function normalizeStats(payload = {}) {
  const data = payload.data || payload.stats || payload;

  return {
    totalRecords:
      data.total_records ??
      data.total_documents ??
      data.totalDocuments ??
      data.totalPrescriptions ??
      data.total_reports ??
      0,

    completed:
      data.completed ??
      data.completed_documents ??
      data.completedDocuments ??
      data.completedPrescriptions ??
      data.verifiedRecords ??
      data.verified_reports ??
      0,

    medicines:
      data.medicines_count ??
      data.medicinesCount ??
      data.total_medicines_tracked ??
      0,

    translations:
      data.translations_count ??
      data.translationsCount ??
      data.translatedReports ??
      0,
  };
}

function normalizeRecord(record = {}) {
  const status = record.status || record.processingStatus || "Saved";

  return {
    ...record,
    id: record.id,
    title:
      record.title ||
      record.filename ||
      record.medication ||
      record.primary_medication ||
      record.diagnosis ||
      "Medical record",
    language: record.language || "en",
    status,
    date:
      record.date ||
      record.createdAt ||
      record.created_at ||
      record.updatedAt,
  };
}

export async function getDashboardSummary() {
  const [statsResponse, recordsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/dashboard/stats`).then((res) => {
      if (!res.ok) {
        throw new Error(`Stats request failed with ${res.status}`);
      }
      return res.json();
    }),

    fetch(`${API_BASE_URL}/dashboard/recent-prescriptions`).then((res) => {
      if (!res.ok) {
        throw new Error(`Records request failed with ${res.status}`);
      }
      return res.json();
    }),
  ]);

  const recordsPayload =
    recordsResponse.data ||
    recordsResponse.recent_reports ||
    recordsResponse ||
    [];

  return {
    stats: normalizeStats(statsResponse),
    records: Array.isArray(recordsPayload)
      ? recordsPayload.map(normalizeRecord)
      : [],
    rawStats: statsResponse,
  };
}

export async function getAuthenticatedDashboardOverview(token) {
  const response = await apiClient.get("/v1/dashboard", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
}