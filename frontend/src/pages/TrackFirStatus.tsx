import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:8000/api/v1";

// ---------- Types ----------

interface Complaint {
  complaint_id: string;
  citizen_username?: string;
  citizen_name: string;
  complainant_name?: string;
  victim_name?: string;
  mode: string; // "form" | "chat"
  incident_type?: string;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  incident_description?: string;
  status: string; // "PENDING" | "UNDER_REVIEW" | "FIR_FILED"
  submitted_at: string;
  assigned_officer?: string | null;
  fir_number?: string | null;
  chat_session_id?: string | null;
  chat_collected_data?: Record<string, unknown> | null;
}

const STATUS_STEPS = [
  { key: "PENDING", label: "Received" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "FIR_FILED", label: "FIR Filed" },
];

function statusIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex(
    (s) => s.key === (status || "").toUpperCase(),
  );
  return idx === -1 ? 0 : idx;
}

function describeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK")
      return "Backend is not reachable. Please try again shortly.";
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.response?.status === 404)
      return "No complaint found with that reference number.";
    if (err.response?.status) return `Request failed (${err.response.status})`;
  }
  return "Something went wrong looking up this complaint.";
}

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------- Component ----------

export default function TrackFIRStatus() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [lookupId, setLookupId] = useState(searchParams.get("id") || "");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Load the citizen's own complaints for the sidebar-style list
  useEffect(() => {
    setListLoading(true);
    axios
      .get<Complaint[]>(`${API_BASE}/complaints/all`)
      .then((res) => {
        const mine = (res.data || []).filter(
          (c) => c.citizen_username === user?.username,
        );
        mine.sort((a, b) =>
          (b.submitted_at || "").localeCompare(a.submitted_at || ""),
        );
        setMyComplaints(mine);
      })
      .catch((err) => setListError(describeError(err)))
      .finally(() => setListLoading(false));
  }, [user?.username]);

  // Deep-link support: /citizen/track?id=CMP-XXXX auto-loads that complaint
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) runLookup(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runLookup = (idOverride?: string) => {
    const id = (idOverride ?? lookupId).trim();
    if (!id) return;

    setLookupLoading(true);
    setLookupError(null);
    setSelected(null);

    axios
      .get<Complaint>(`${API_BASE}/complaints/${encodeURIComponent(id)}`)
      .then((res) => {
        setSelected(res.data);
        setSearchParams({ id });
      })
      .catch((err) => setLookupError(describeError(err)))
      .finally(() => setLookupLoading(false));
  };

  const selectFromList = (c: Complaint) => {
    setSelected(c);
    setLookupId(c.complaint_id);
    setLookupError(null);
    setSearchParams({ id: c.complaint_id });
  };

  const S = styles;

  const navItems = [
    { key: "home", label: "Home", icon: Home, path: "/citizen/dashboard" },
    {
      key: "complaint",
      label: "File a Complaint",
      icon: FileText,
      path: "/citizen",
    },
    {
      key: "track",
      label: "Track FIR Status",
      icon: Search,
      path: "/citizen/track",
    },
    {
      key: "information",
      label: "Know Your Rights",
      icon: LifeBuoy,
      path: "/citizen/information",
    },
    {
      key: "emergency",
      label: "Emergency Contacts",
      icon: Phone,
      path: "/citizen/emergency",
    },
    {
      key: "settings",
      label: "Settings",
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  return (
    <div style={S.page}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>Citizen Portal</div>
          </div>
        </div>

        <nav style={S.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === "track";
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                style={S.navItem(active)}
              >
                <Icon
                  size={16}
                  color={active ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.sidebarUserRow}>
            <div style={S.sidebarAvatar}>
              {(user?.name || "C").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={S.sidebarUserName}>{user?.name || "Citizen"}</div>
              <div style={S.sidebarUserMeta}>{user?.username}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.sidebarLogoutBtn}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarEyebrow}>Citizen Portal</div>
            <div style={S.topbarTitle}>Track FIR Status</div>
            <div style={S.topbarSub}>
              Check progress on complaints filed by Form or Chat with AI
            </div>
          </div>
        </div>

        <div style={S.body}>
          {/* Lookup bar */}
          <div style={S.lookupBar}>
            <input
              style={S.lookupInput}
              placeholder="Enter your complaint reference, e.g. CMP-A1B2C3D4"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runLookup()}
            />
            <button
              style={S.primaryBtn}
              onClick={() => runLookup()}
              disabled={!lookupId.trim() || lookupLoading}
            >
              {lookupLoading ? "Searching…" : "Track"}
            </button>
          </div>

          {lookupError && <div style={S.errorBox}>{lookupError}</div>}

          {/* Detail panel */}
          {selected && <ComplaintDetail complaint={selected} />}

          {!selected && !lookupError && !lookupLoading && (
            <div style={S.emptyState}>
              Enter a complaint reference above, or pick one of your complaints
              below.
            </div>
          )}

          {/* My complaints list */}
          <div style={S.panel}>
            <div style={S.panelTitle}>My Complaints</div>
            <div style={S.panelSubtitle}>
              Everything you've filed, whether by form or AI chat
            </div>

            <div style={{ marginTop: 14 }}>
              {listLoading && (
                <div style={S.loadingState}>Loading your complaints…</div>
              )}
              {listError && <div style={S.errorBox}>{listError}</div>}
              {!listLoading && !listError && myComplaints.length === 0 && (
                <div style={S.emptyState}>
                  You haven't filed any complaints yet.
                </div>
              )}
              {!listLoading && !listError && myComplaints.length > 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {myComplaints.map((c) => (
                    <button
                      key={c.complaint_id}
                      onClick={() => selectFromList(c)}
                      style={S.listRow(
                        selected?.complaint_id === c.complaint_id,
                      )}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <ModeBadge mode={c.mode} />
                        <div style={{ minWidth: 0 }}>
                          <div style={S.listRowId}>{c.complaint_id}</div>
                          <div style={S.listRowMeta}>
                            {c.incident_type || "Incident"} ·{" "}
                            {formatDateTime(c.submitted_at)}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={c.status} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function ModeBadge({ mode }: { mode: string }) {
  const isChat = (mode || "").toLowerCase() === "chat";
  const Icon = isChat ? MessageSquare : ClipboardList;
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: TEAL_TINT,
        color: TEAL_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      title={isChat ? "Filed via Chat with AI" : "Filed via Form"}
    >
      <Icon size={14} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const idx = statusIndex(status);
  const color = idx === 2 ? "#1F7A5C" : idx === 1 ? TEAL_DARK : "#8A97A3";
  const bg = idx === 2 ? "#E5F6EC" : idx === 1 ? TEAL_TINT : BG_SECTION;
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color,
        background: bg,
        padding: "4px 10px",
        borderRadius: 20,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_STEPS[idx].label}
    </span>
  );
}

function StatusTimeline({ status }: { status: string }) {
  const idx = statusIndex(status);
  return (
    <div
      style={{ display: "flex", alignItems: "center", margin: "18px 0 4px" }}
    >
      {STATUS_STEPS.map((step, i) => (
        <div
          key={step.key}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < STATUS_STEPS.length - 1 ? 1 : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i <= idx ? TEAL : "#FFFFFF",
                border: `2px solid ${i <= idx ? TEAL : BORDER}`,
                color: i <= idx ? "#FFFFFF" : "#8A97A3",
              }}
            >
              {i < idx ? (
                <CheckCircle2 size={15} />
              ) : i === idx ? (
                <Clock size={14} />
              ) : null}
            </div>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: i <= idx ? NAVY : "#8A97A3",
                whiteSpace: "nowrap",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: i < idx ? TEAL : BORDER,
                margin: "0 8px 18px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ComplaintDetail({ complaint: c }: { complaint: Complaint }) {
  return (
    <div style={styles.panel}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={styles.panelSubtitle}>Complaint Reference</div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: NAVY,
            }}
          >
            {c.complaint_id}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ModeBadge mode={c.mode} />
          <StatusBadge status={c.status} />
        </div>
      </div>

      <StatusTimeline status={c.status} />

      {c.fir_number && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 14px",
            background: "#E5F6EC",
            border: "1px solid #9FE1CB",
            borderRadius: 8,
            fontSize: 13,
            color: "#1F7A5C",
            fontWeight: 600,
          }}
        >
          FIR Number: {c.fir_number}
        </div>
      )}

      <div style={styles.detailGrid}>
        <DetailCell label="Incident Type" value={c.incident_type} />
        <DetailCell label="Date" value={c.incident_date} />
        <DetailCell label="Location" value={c.incident_location} />
        <DetailCell
          label="Assigned Officer"
          value={c.assigned_officer || "Not yet assigned"}
        />
      </div>

      {c.incident_description && (
        <div style={{ marginTop: 14 }}>
          <div style={styles.panelSubtitle}>Description</div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: TEXT,
              margin: "6px 0 0",
            }}
          >
            {c.incident_description}
          </p>
        </div>
      )}

      {c.mode?.toLowerCase() === "chat" &&
        c.chat_collected_data &&
        Object.keys(c.chat_collected_data).length > 0 && (
          <details style={{ marginTop: 16 }}>
            <summary
              style={{
                fontSize: 11.5,
                color: TEAL_DARK,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              AI-collected information
            </summary>
            <div style={styles.kvGrid}>
              {Object.entries(c.chat_collected_data).map(([k, v]) => (
                <div key={k} style={styles.kvCell}>
                  <div style={styles.kvLabel}>{k.replace(/_/g, " ")}</div>
                  <div style={styles.kvValue}>
                    {v === null || v === undefined ? "—" : String(v)}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
    </div>
  );
}

function DetailCell({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div style={styles.detailCell}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>{value || "—"}</div>
    </div>
  );
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

// ---------- Design tokens (shared) ----------

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";

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
    textTransform: "uppercase" as const,
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
    gap: 11,
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
  sidebarUserRow: {
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
  sidebarUserName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarUserMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarLogoutBtn: {
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
  } as React.CSSProperties,
  topbarEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: TEAL_DARK,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 4,
  } as React.CSSProperties,
  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  topbarSub: {
    fontSize: 12.5,
    color: TEXT,
    marginTop: 3,
  } as React.CSSProperties,

  body: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    maxWidth: 860,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  } as React.CSSProperties,

  lookupBar: { display: "flex", gap: 10 } as React.CSSProperties,
  lookupInput: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: NAVY,
    background: "#FFFFFF",
  } as React.CSSProperties,
  primaryBtn: {
    padding: "12px 20px",
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

  emptyState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
    background: "#FFFFFF",
    border: `1px dashed ${BORDER}`,
    borderRadius: 10,
  } as React.CSSProperties,
  loadingState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
  } as React.CSSProperties,
  errorBox: {
    padding: "12px 14px",
    background: "#FBEBEA",
    color: "#C94B4B",
    fontSize: 12,
    lineHeight: 1.5,
    borderRadius: 8,
  } as React.CSSProperties,

  panel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 20,
  } as React.CSSProperties,
  panelTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  panelSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginTop: 16,
  } as React.CSSProperties,
  detailCell: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px 12px",
  } as React.CSSProperties,
  detailLabel: {
    fontSize: 9.5,
    color: MUTED,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: 3,
  } as React.CSSProperties,
  detailValue: {
    fontSize: 13,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,

  kvGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 8,
    marginTop: 10,
  } as React.CSSProperties,
  kvCell: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    padding: "8px 10px",
  } as React.CSSProperties,
  kvLabel: {
    fontSize: 9,
    color: MUTED,
    textTransform: "capitalize" as const,
    marginBottom: 2,
  } as React.CSSProperties,
  kvValue: {
    fontSize: 12,
    fontWeight: 600,
    color: NAVY,
    wordBreak: "break-word" as const,
  } as React.CSSProperties,

  listRow: (active: boolean): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${active ? TEAL : BORDER}`,
    background: active ? TEAL_TINT : BG_SECTION,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
  }),
  listRowId: {
    fontSize: 12.5,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  listRowMeta: {
    fontSize: 11,
    color: TEXT,
    marginTop: 1,
  } as React.CSSProperties,
};
