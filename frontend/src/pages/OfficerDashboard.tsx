import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending Review", color: "#d97706", bg: "#fef9c3" },
  UNDER_REVIEW: { label: "Under Review", color: "#2563eb", bg: "#eff6ff" },
  FIR_FILED: { label: "FIR Filed", color: "#16a34a", bg: "#f0fdf4" },
};

export default function OfficerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/complaints/all")
      .then((r) => setComplaints(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  const counts = {
    ALL: complaints.length,
    PENDING: complaints.filter((c) => c.status === "PENDING").length,
    UNDER_REVIEW: complaints.filter((c) => c.status === "UNDER_REVIEW").length,
    FIR_FILED: complaints.filter((c) => c.status === "FIR_FILED").length,
  };

  const S = styles;

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={S.logoRow}>
          <div style={S.logoIcon}>K</div>
          <div>
            <span style={S.logoTitle}>KAVACH</span>
            <span style={S.logoDivider}>/</span>
            <span style={S.logoSub}>Officer Dashboard</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={S.officerBadge}>{user?.badge}</span>
          <span style={S.officerName}>{user?.name}</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.logoutBtn}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={S.body}>
        {/* Stats */}
        <div style={S.statsRow}>
          {[
            { label: "Total Complaints", value: counts.ALL, color: "#5b52f0" },
            {
              label: "Pending Review",
              value: counts.PENDING,
              color: "#d97706",
            },
            {
              label: "Under Review",
              value: counts.UNDER_REVIEW,
              color: "#2563eb",
            },
            { label: "FIR Filed", value: counts.FIR_FILED, color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={S.filterRow}>
          {["ALL", "PENDING", "UNDER_REVIEW", "FIR_FILED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={S.filterBtn(f === filter)}
            >
              {f === "ALL" ? "All Cases" : STATUS_CONFIG[f]?.label}
              <span style={S.filterCount}>
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={S.tableCard}>
          <table style={S.table}>
            <thead>
              <tr>
                {[
                  "Complaint ID",
                  "Citizen",
                  "Incident Type",
                  "Location",
                  "Submitted",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={S.emptyCell}>
                    Loading cases...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={S.emptyCell}>
                    No complaints found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={c.complaint_id} style={S.tr}>
                      <td style={S.td}>
                        <span style={S.idChip}>{c.complaint_id}</span>
                      </td>
                      <td style={S.td}>{c.citizen_name}</td>
                      <td style={S.td}>{c.incident_type || "—"}</td>
                      <td
                        style={{
                          ...S.td,
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.incident_location || "—"}
                      </td>
                      <td style={S.td}>
                        {new Date(c.submitted_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={S.td}>
                        <span
                          style={{
                            ...S.statusChip,
                            color: st.color,
                            background: st.bg,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td style={S.td}>
                        <button
                          onClick={() =>
                            navigate(`/officer/case/${c.complaint_id}`)
                          }
                          style={S.reviewBtn}
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const accent = "#5b52f0";
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f4ff",
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e9e6fb",
    padding: "0 32px",
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  } as React.CSSProperties,
  logoIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    background: accent,
    color: "#fff",
    fontWeight: "800",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  logoTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a1a2e",
  } as React.CSSProperties,
  logoDivider: {
    fontSize: "14px",
    color: "#d1d5db",
    margin: "0 6px",
  } as React.CSSProperties,
  logoSub: { fontSize: "13px", color: "#6b7280" } as React.CSSProperties,
  officerBadge: {
    fontSize: "11px",
    padding: "3px 8px",
    background: "#eeecfd",
    color: accent,
    borderRadius: "5px",
    fontWeight: "600",
  } as React.CSSProperties,
  officerName: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500",
  } as React.CSSProperties,
  logoutBtn: {
    fontSize: "12px",
    color: "#6b7280",
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
  } as React.CSSProperties,
  body: { padding: "28px 32px" } as React.CSSProperties,
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginBottom: "24px",
  } as React.CSSProperties,
  statCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "18px 20px",
    border: "1px solid #e9e6fb",
  } as React.CSSProperties,
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  } as React.CSSProperties,
  statLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "2px",
    fontWeight: "500",
  } as React.CSSProperties,
  filterRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "16px",
  } as React.CSSProperties,
  filterBtn: (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "6px",
    border: `1px solid ${active ? accent : "#e5e7eb"}`,
    background: active ? "#eeecfd" : "#fff",
    color: active ? accent : "#6b7280",
    fontSize: "12px",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }),
  filterCount: {
    fontSize: "11px",
    padding: "1px 6px",
    background: "rgba(0,0,0,0.06)",
    borderRadius: "10px",
  } as React.CSSProperties,
  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #e9e6fb",
    overflow: "hidden",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,
  th: {
    padding: "11px 16px",
    textAlign: "left" as const,
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    borderBottom: "1px solid #f3f0ff",
    background: "#faf9ff",
  } as React.CSSProperties,
  tr: { borderBottom: "1px solid #f3f0ff" } as React.CSSProperties,
  td: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#374151",
  } as React.CSSProperties,
  emptyCell: {
    padding: "32px",
    textAlign: "center" as const,
    color: "#9ca3af",
    fontSize: "13px",
  } as React.CSSProperties,
  idChip: {
    fontSize: "11px",
    fontWeight: "700",
    color: accent,
    background: "#eeecfd",
    padding: "3px 8px",
    borderRadius: "5px",
    letterSpacing: "0.03em",
  } as React.CSSProperties,
  statusChip: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 9px",
    borderRadius: "20px",
  } as React.CSSProperties,
  reviewBtn: {
    padding: "5px 12px",
    background: accent,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  } as React.CSSProperties,
};
