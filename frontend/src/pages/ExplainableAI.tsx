// ExplainableAI.tsx
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:8000/api/v1";

// ---------- Types ----------

/** Shapes of dashboard.py / patterns.py / anomaly.py / zone.py / forecast.py
 * outputs aren't visible from the frontend, so these payloads are rendered
 * generically (see <Register/> below) instead of guessed field-by-field. */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };
type JsonRecord = Record<string, JsonValue>;

interface AiSummaryResponse {
  summary: string;
}

interface AiReportResponse {
  station: string;
  report: string;
  analytics: JsonRecord;
}

interface Fetchable<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

const initialFetchable = <T,>(): Fetchable<T> => ({
  data: null,
  loading: false,
  error: "",
});

// ---------- Component ----------

export default function ExplainableAI() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const officerName = user?.name || "Unknown Officer";
  const officerBadge = user?.badge || "";

  const [station, setStation] = useState("");
  const [submittedStation, setSubmittedStation] = useState("");

  // Station-scoped — loaded together, rendered together, on one page
  const [forecast, setForecast] =
    useState<Fetchable<JsonValue>>(initialFetchable());
  const [zone, setZone] = useState<Fetchable<JsonValue>>(initialFetchable());
  const [patterns, setPatterns] =
    useState<Fetchable<JsonValue>>(initialFetchable());
  const [anomalies, setAnomalies] =
    useState<Fetchable<JsonValue>>(initialFetchable());

  // AI assessment
  const [summary, setSummary] =
    useState<Fetchable<AiSummaryResponse>>(initialFetchable());
  const [report, setReport] =
    useState<Fetchable<AiReportResponse>>(initialFetchable());
  const [showEvidence, setShowEvidence] = useState(false);

  const runStationReport = useCallback((stationName: string) => {
    if (!stationName.trim()) return;
    setSubmittedStation(stationName.trim());

    const load = (path: string, setter: (v: Fetchable<JsonValue>) => void) => {
      setter({ data: null, loading: true, error: "" });
      axios
        .get(`${API_BASE}${path}`)
        .then((res) => setter({ data: res.data, loading: false, error: "" }))
        .catch((err) =>
          setter({ data: null, loading: false, error: describeError(err) }),
        );
    };

    load(`/forecast/${encodeURIComponent(stationName.trim())}`, setForecast);
    load(`/zone/${encodeURIComponent(stationName.trim())}`, setZone);
    load(`/patterns/${encodeURIComponent(stationName.trim())}`, setPatterns);
    load(`/anomalies/${encodeURIComponent(stationName.trim())}`, setAnomalies);

    // Reset any previous AI output — it belongs to the old station
    setSummary(initialFetchable());
    setReport(initialFetchable());
    setShowEvidence(false);
  }, []);

  const runSummary = () => {
    if (!submittedStation) return;
    setSummary({ data: null, loading: true, error: "" });
    axios
      .post(
        `${API_BASE}/pattern-summary/${encodeURIComponent(submittedStation)}`,
      )
      .then((res) => setSummary({ data: res.data, loading: false, error: "" }))
      .catch((err) =>
        setSummary({ data: null, loading: false, error: describeError(err) }),
      );
  };

  const runReport = () => {
    if (!submittedStation) return;
    setReport({ data: null, loading: true, error: "" });
    axios
      .post(`${API_BASE}/ai-summary/${encodeURIComponent(submittedStation)}`)
      .then((res) => setReport({ data: res.data, loading: false, error: "" }))
      .catch((err) =>
        setReport({ data: null, loading: false, error: describeError(err) }),
      );
  };

  const S = styles;

  return (
    <div style={S.page}>
      <style>{keyframes}</style>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>OFFICER PORTAL</div>
          </div>
        </div>

        <nav style={S.navList}>
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              path: "/officer/dashboard",
            },
            {
              key: "cases",
              label: "BNS Sections",
              path: "/bns-recommendation",
            },
            { key: "districts", label: "Crime Hotspot", path: "/dash" },
            {
              key: "analytics",
              label: "Explainable AI",
              path: "/officer/explain",
            },
            {
              key: "reports",
              label: "Generate report",
              path: "/generate-report",
            },
            { key: "settings", label: "Settings", path: "/settings" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              style={S.navItem(item.key === "analytics")}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.sidebarOfficerRow}>
            <div style={S.sidebarAvatar}>
              {(officerName || "O").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={S.sidebarOfficerName}>{officerName}</div>
              <div style={S.sidebarOfficerBadge}>{officerBadge}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.logoutBtn}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>Explainable AI</div>
            <div style={S.topbarSub}>
              Station intelligence, grounded in the analytics that produced it
            </div>
          </div>
          <div style={S.officerChipRow}>
            <span style={S.officerBadge}>{officerBadge}</span>
            <span style={S.officerName}>{officerName}</span>
          </div>
        </div>

        <div style={S.body}>
          {/* ---------- Station lookup ---------- */}
          <div style={S.stationBar}>
            <input
              style={S.stationInput}
              placeholder="Station name, e.g. Jayanagar PS"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runStationReport(station);
              }}
            />
            <button
              style={S.primaryBtn}
              onClick={() => runStationReport(station)}
              disabled={!station.trim()}
            >
              Load station report
            </button>
          </div>

          {!submittedStation && (
            <div style={S.emptyState}>
              Enter a station above to pull its forecast, zone summary,
              patterns, and anomalies together.
            </div>
          )}

          {/* ---------- Zone / Patterns / Anomalies — one page, one grid ---------- */}
          {submittedStation && (
            <>
              <Panel
                title="Forecast"
                subtitle={`Projected case volume — ${submittedStation}`}
              >
                <FetchState state={forecast} />
                {forecast.data != null &&
                  !forecast.loading &&
                  !forecast.error && <Register data={forecast.data} />}
              </Panel>

              <div style={S.threeCol}>
                <Panel title="Zone Summary" subtitle="Jurisdictional breakdown">
                  <FetchState state={zone} />
                  {zone.data != null && !zone.loading && !zone.error && (
                    <Register data={zone.data} />
                  )}
                </Panel>

                <Panel title="Patterns" subtitle="Recurring MO & timing">
                  <FetchState state={patterns} />
                  {patterns.data != null &&
                    !patterns.loading &&
                    !patterns.error && <Register data={patterns.data} />}
                </Panel>

                <Panel title="Anomalies" subtitle="Deviation from baseline">
                  <FetchState state={anomalies} />
                  {anomalies.data != null &&
                    !anomalies.loading &&
                    !anomalies.error && <Register data={anomalies.data} />}
                </Panel>
              </div>

              {/* ---------- AI Assessment ---------- */}
              <div style={S.aiSection}>
                <div style={S.aiSectionHead}>
                  <div>
                    <div style={S.resultsTitle}>AI Assessment</div>
                    <div style={S.disclaimer}>
                      Generated by llama-3.3-70b-versatile from{" "}
                      {submittedStation}'s analytics only · decision-support,
                      officer verification required
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={S.secondaryBtn}
                      onClick={runSummary}
                      disabled={summary.loading}
                    >
                      {summary.loading ? "Summarizing…" : "Pattern summary"}
                    </button>
                    <button
                      style={S.primaryBtn}
                      onClick={runReport}
                      disabled={report.loading}
                    >
                      {report.loading ? "Drafting…" : "Full report"}
                    </button>
                  </div>
                </div>

                {(summary.loading || summary.error || summary.data) && (
                  <div style={S.aiCard}>
                    <div style={S.aiCardLabel}>Pattern Summary</div>
                    <FetchState state={summary} />
                    {summary.data && !summary.loading && (
                      <p style={S.summaryText}>{summary.data.summary}</p>
                    )}
                  </div>
                )}

                {(report.loading || report.error || report.data) && (
                  <div style={S.aiCard}>
                    <div style={S.aiCardLabel}>
                      Operational Intelligence Report
                    </div>
                    <FetchState state={report} />
                    {report.data && !report.loading && (
                      <>
                        <p style={S.reportText}>{report.data.report}</p>
                        <button
                          style={S.evidenceToggle}
                          onClick={() => setShowEvidence((s) => !s)}
                        >
                          {showEvidence
                            ? "Hide evidence used"
                            : "Show evidence used"}
                        </button>
                        {showEvidence && (
                          <div style={S.evidenceBox}>
                            <Register data={report.data.analytics} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Shared bits ----------

function describeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK")
      return "AI engine or backend is not reachable.";
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.response?.status) return `Request failed (${err.response.status})`;
  }
  return "Something went wrong loading this data.";
}

function FetchState({ state }: { state: Fetchable<unknown> }) {
  if (state.loading) {
    return (
      <div style={styles.loadingState}>
        <div style={styles.spinner} />
        Loading…
      </div>
    );
  }
  if (state.error) {
    return <div style={styles.errorBox}>{state.error}</div>;
  }
  return null;
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>{title}</div>
      <div style={styles.panelSubtitle}>{subtitle}</div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

/** Flat objects of primitives render as a label/value grid; anything nested
 * (arrays of records, nested objects) renders as an indented list so it's
 * still readable without knowing the exact schema ahead of time. */
function Register({ data }: { data: JsonValue }) {
  if (data === null || data === undefined) {
    return <div style={styles.emptyState}>No data returned.</div>;
  }

  if (typeof data !== "object") {
    return <div style={styles.registerValue}>{String(data)}</div>;
  }

  const entries = Array.isArray(data)
    ? data.map((v, i) => [String(i), v] as const)
    : Object.entries(data);

  if (entries.length === 0) {
    return <div style={styles.emptyState}>No data returned.</div>;
  }

  const isFlat = entries.every(([, v]) => v === null || typeof v !== "object");

  if (isFlat && !Array.isArray(data)) {
    return (
      <div style={styles.registerGrid}>
        {entries.map(([k, v]) => (
          <div key={k} style={styles.registerCell}>
            <div style={styles.registerLabel}>{formatLabel(k)}</div>
            <div style={styles.registerValue}>
              {v === null ? "—" : String(v)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.registerNested}>
      {entries.map(([k, v]) => (
        <div key={k} style={styles.nestedRow}>
          <div style={styles.registerLabel}>{formatLabel(k)}</div>
          {v !== null && typeof v === "object" ? (
            <div style={styles.nestedIndent}>
              <Register data={v} />
            </div>
          ) : (
            <div style={styles.registerValue}>
              {v === null ? "—" : String(v)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ShieldIcon({
  size = 20,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------- Styles (matching KAVACH's navy/teal system) ----------

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const NAVY_SOFT = "#2C4260";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const RED = "#C94B4B";

const keyframes = `@keyframes xaiSpin { to { transform: rotate(360deg); } }`;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  sidebar: {
    width: "236px",
    flexShrink: 0,
    background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px",
    position: "sticky" as const,
    top: 0,
    height: "100vh",
  } as React.CSSProperties,

  sidebarLogoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 30,
  } as React.CSSProperties,
  sidebarLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarLogoTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#FFFFFF",
  } as React.CSSProperties,
  sidebarLogoSub: {
    fontSize: 9.5,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.45)",
    marginTop: 1,
  } as React.CSSProperties,

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
  } as React.CSSProperties,
  navItem: (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    fontWeight: active ? 600 : 500,
    background: active ? "rgba(14,140,140,0.22)" : "transparent",
    color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
    textAlign: "left",
  }),

  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    marginTop: 12,
  } as React.CSSProperties,
  sidebarOfficerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 12,
  } as React.CSSProperties,
  sidebarAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarOfficerName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarOfficerBadge: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  } as React.CSSProperties,
  logoutBtn: {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "none",
    borderRadius: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  topbar: {
    background: "#FFFFFF",
    borderBottom: `1px solid ${BORDER}`,
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,
  topbarSub: {
    fontSize: 12.5,
    color: TEXT,
    marginTop: 2,
  } as React.CSSProperties,
  officerChipRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } as React.CSSProperties,
  officerBadge: {
    fontSize: 11,
    padding: "4px 9px",
    background: TEAL_TINT,
    color: TEAL_DARK,
    borderRadius: 5,
    fontWeight: 600,
  } as React.CSSProperties,
  officerName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  } as React.CSSProperties,

  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    padding: "24px 32px",
    overflowY: "auto",
  } as React.CSSProperties,

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  } as React.CSSProperties,
  threeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 18,
  } as React.CSSProperties,

  panel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 18,
    minWidth: 0,
  } as React.CSSProperties,
  panelTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  panelSubtitle: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 2,
  } as React.CSSProperties,

  stationBar: { display: "flex", gap: 10 } as React.CSSProperties,
  stationInput: {
    flex: 1,
    padding: "11px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: "#374151",
    background: "#FFFFFF",
  } as React.CSSProperties,
  primaryBtn: {
    padding: "11px 18px",
    borderRadius: 8,
    border: "none",
    background: TEAL,
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  secondaryBtn: {
    padding: "11px 18px",
    borderRadius: 8,
    border: `1px solid ${TEAL}`,
    background: "#FFFFFF",
    color: TEAL_DARK,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  emptyState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
    background: "#FFFFFF",
    border: `1px dashed ${BORDER}`,
    borderRadius: 10,
  },

  loadingState: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: MUTED,
    fontSize: 12,
    padding: "10px 2px",
  } as React.CSSProperties,
  spinner: {
    width: 16,
    height: 16,
    border: `2px solid ${TEAL_TINT}`,
    borderTop: `2px solid ${TEAL}`,
    borderRadius: "50%",
    animation: "xaiSpin .8s linear infinite",
  } as React.CSSProperties,
  errorBox: {
    padding: "10px 12px",
    background: "#FBEBEA",
    color: RED,
    fontSize: 12,
    lineHeight: 1.5,
    borderRadius: 8,
  } as React.CSSProperties,

  registerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 8,
  } as React.CSSProperties,
  registerCell: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 10px",
  } as React.CSSProperties,
  registerLabel: {
    fontSize: 9.5,
    color: MUTED,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: 3,
  },
  registerValue: {
    fontSize: 13,
    fontWeight: 600,
    color: NAVY,
    wordBreak: "break-word" as const,
  },
  registerNested: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  } as React.CSSProperties,
  nestedRow: {
    borderBottom: `1px solid ${BORDER}`,
    paddingBottom: 8,
  } as React.CSSProperties,
  nestedIndent: {
    marginTop: 6,
    marginLeft: 10,
    borderLeft: `2px solid ${TEAL_TINT}`,
    paddingLeft: 10,
  } as React.CSSProperties,

  aiSection: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 18,
  } as React.CSSProperties,
  aiSectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    flexWrap: "wrap" as const,
    marginBottom: 14,
  },
  resultsTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  disclaimer: {
    fontSize: 11,
    color: MUTED,
    marginTop: 4,
    maxWidth: "48ch",
    lineHeight: 1.5,
  } as React.CSSProperties,

  aiCard: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
  } as React.CSSProperties,
  aiCardLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: TEAL_DARK,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13.5,
    lineHeight: 1.7,
    color: NAVY_SOFT,
    margin: 0,
  } as React.CSSProperties,
  reportText: {
    fontSize: 13.5,
    lineHeight: 1.75,
    color: NAVY_SOFT,
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },

  evidenceToggle: {
    marginTop: 12,
    border: `1px solid ${BORDER}`,
    background: "#FFFFFF",
    color: TEXT,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 11.5,
    fontWeight: 600,
  } as React.CSSProperties,
  evidenceBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px dashed ${BORDER}`,
  } as React.CSSProperties,
};
