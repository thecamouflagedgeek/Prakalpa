import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Local translations dictionary
const translations = {
  en: {
    portalSub: "OFFICER PORTAL",
    signOut: "Sign out",
    topbarTitle: "Case overview",
    topbarSub: "Karnataka State Police · SCRB digital case registry",
    totalComplaints: "Total Complaints",
    pendingReview: "Pending Review",
    underReview: "Under Review",
    firFiled: "FIR Filed",
    allCases: "All Cases",
    navDashboard: "Dashboard",
    navBNS: "BNS Sections",
    navCrime: "Crime Hotspot",
    navExplain: "Explainable AI",
    navSettings: "Settings",
    navGenerate: "Generate report",
    thId: "Complaint ID",
    thCitizen: "Citizen",
    thType: "Incident Type",
    thLocation: "Location",
    thSubmitted: "Submitted",
    thStatus: "Status",
    thAction: "Action",
    loadingCases: "Loading cases...",
    noComplaints: "No complaints found.",
    reviewCase: "Review Case",
    switchLang: "ಕನ್ನಡ",
  },
  kn: {
    portalSub: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    signOut: "ಸೈನ್ ಔಟ್",
    topbarTitle: "ಪ್ರಕರಣಗಳ ಅವಲೋಕನ",
    topbarSub: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ಎಸ್‌ಸಿಆರ್‌ಬಿ ಡಿಜಿಟಲ್ ಪ್ರಕರಣಗಳ ನೋಂದಣಿ",
    totalComplaints: "ಒಟ್ಟು ದೂರುಗಳು",
    pendingReview: "ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ",
    underReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    firFiled: "ಎಫ್‌ಐಆರ್ ದಾಖಲಾಗಿದೆ",
    allCases: "ಎಲ್ಲಾ ಪ್ರಕರಣಗಳು",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navBNS: "ಬಿಎನ್‌ಎಸ್ (BNS) ವಿಭಾಗಗಳು",
    navCrime: "ಅಪರಾಧ ತೀವ್ರತೆಯ ತಾಣ",
    navExplain: "ವಿವರಿಸಬಹುದಾದ AI",
    navSettings: "ಸಂಯೋಜನೆಗಳು",
    navGenerate: "ವರದಿಯನ್ನು ರಚಿಸಿ",
    thId: "ದೂರು ಸಂಖ್ಯೆ",
    thCitizen: "ನಾಗರಿಕ",
    thType: "ಘಟನೆಯ ಮಾದರಿ",
    thLocation: "ಸ್ಥಳ",
    thSubmitted: "ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ",
    thStatus: "ಸ್ಥಿತಿ",
    thAction: "ಕ್ರಮ",
    loadingCases: "ಪ್ರಕರಣಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    noComplaints: "ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    reviewCase: "ಪ್ರಕರಣ ಪರಿಶೀಲಿಸಿ",
    switchLang: "English",
  },
};

export default function OfficerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [activeNav, setActiveNav] = useState("dashboard");

  const t = translations[lang];

  const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    PENDING: { label: t.pendingReview, color: "#B45309", bg: "#FDEEE3" },
    UNDER_REVIEW: { label: t.underReview, color: "#2E7FCE", bg: "#E3F0FB" },
    FIR_FILED: { label: t.firFiled, color: "#1F7A5C", bg: "#E5F6EC" },
  };

  const NAV_ITEMS = [
    { key: "dashboard", label: t.navDashboard, icon: "grid" },
    { key: "cases", label: t.navBNS, icon: "case" },
    { key: "districts", label: t.navCrime, icon: "map" },
    { key: "explain", label: t.navExplain, icon: "chart" },
    { key: "reports", label: t.navGenerate, icon: "bolt" },
    { key: "settings", label: t.navSettings, icon: "gear" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/complaints/all")
      .then((r) => setComplaints(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

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
      {/* ---------------- SIDEBAR ---------------- */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>{t.portalSub}</div>
          </div>
        </div>

        <nav style={S.navList}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                if (item.key === "districts") {
                  navigate("/dash");
                } else if (item.key === "reports") {
                  navigate("/generate-report");
                } else if (item.key === "cases") {
                  navigate("/bns");
                } else if (item.key === "explain") navigate("/explain");
                else if (item.key === "settings") {
                  navigate("/settings");
                }
                else {
                  setActiveNav(item.key);
                }
              }}
              style={S.navItem(item.key === activeNav)}
            >
              <NavIcon
                name={item.icon}
                color={
                  item.key === activeNav ? "#FFFFFF" : "rgba(255,255,255,0.55)"
                }
              />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.sidebarOfficerRow}>
            <div style={S.sidebarAvatar}>
              {(user?.name || "O").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={S.sidebarOfficerName}>{user?.name}</div>
              <div style={S.sidebarOfficerBadge}>{user?.badge}</div>
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
            <NavIcon name="logout" color="rgba(255,255,255,0.7)" />
            {t.signOut}
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>{t.topbarTitle}</div>
            <div style={S.topbarSub}>{t.topbarSub}</div>
          </div>
          <div style={S.officerChipRow}>
            {/* Header Language Switcher Button */}
            <button onClick={toggleLanguage} type="button" style={S.langBtn}>
              <GlobeIcon color="#0E8C8C" size={13} />
              {t.switchLang}
            </button>

            <span style={S.officerBadge}>{user?.badge}</span>
            <span style={S.officerName}>{user?.name}</span>
          </div>
        </div>

        <div style={S.body}>
          {/* Stats */}
          <div style={S.statsRow}>
            {[
              {
                label: t.totalComplaints,
                value: counts.ALL,
                color: "#0E8C8C",
                bg: "#E1F5F5",
              },
              {
                label: t.pendingReview,
                value: counts.PENDING,
                color: "#B45309",
                bg: "#FDEEE3",
              },
              {
                label: t.underReview,
                value: counts.UNDER_REVIEW,
                color: "#2E7FCE",
                bg: "#E3F0FB",
              },
              {
                label: t.firFiled,
                value: counts.FIR_FILED,
                color: "#1F7A5C",
                bg: "#E5F6EC",
              },
            ].map((s) => (
              <div key={s.label} style={S.statCard}>
                <div style={{ ...S.statIconTile, background: s.bg }}>
                  <div style={{ ...S.statIconDot, background: s.color }} />
                </div>
                <div>
                  <div style={{ ...S.statValue, color: "#152A43" }}>
                    {s.value}
                  </div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={S.filterRow}>
            {["ALL", "PENDING", "UNDER_REVIEW", "FIR_FILED"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={S.filterBtn(f === filter)}
              >
                {f === "ALL" ? t.allCases : STATUS_CONFIG[f]?.label}
                <span style={S.filterCount(f === filter)}>
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
                    t.thId,
                    t.thCitizen,
                    t.thType,
                    t.thLocation,
                    t.thSubmitted,
                    t.thStatus,
                    t.thAction,
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
                      {t.loadingCases}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={S.emptyCell}>
                      {t.noComplaints}
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
                          {new Date(c.submitted_at).toLocaleDateString(
                            lang === "kn" ? "kn-IN" : "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
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
                            type="button"
                            onClick={() =>
                              navigate(`/officer/case/${c.complaint_id}`)
                            }
                            style={S.reviewBtn}
                          >
                            {t.reviewCase}
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

function GlobeIcon({
  size = 13,
  color = "#0E8C8C",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

function NavIcon({ name, color }: { name: string; color: string }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none" as const,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect
            x="4"
            y="4"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="13"
            y="4"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="4"
            y="13"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="13"
            y="13"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
        </svg>
      );
    case "case":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="8"
            width="18"
            height="12"
            rx="1.5"
            stroke={color}
            strokeWidth="1.7"
          />
          <path
            d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
            stroke={color}
            strokeWidth="1.7"
          />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path
            d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 4v14M15 6v14" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path
            d="M4 20V10M11 20V4M18 20v-7"
            stroke={color}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
          <path
            d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
            stroke={color}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path
            d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path
            d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 16l4-4-4-4M19 12H9"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEXT = "#5B6B7A";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  /* ---------- sidebar ---------- */
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
    transition: "background 0.15s ease",
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
    display: "flex",
    alignItems: "center",
    gap: 10,
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

  /* ---------- main ---------- */
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

  langBtn: {
    background: "transparent",
    color: TEAL,
    border: `1px solid ${TEAL}`,
    borderRadius: 20,
    padding: "5px 12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  } as React.CSSProperties,

  officerBadge: {
    fontSize: 11,
    padding: "4px 9px",
    background: "#E1F5F5",
    color: "#0A6E6E",
    borderRadius: 5,
    fontWeight: 600,
  } as React.CSSProperties,

  officerName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  } as React.CSSProperties,

  body: { padding: "28px 32px" } as React.CSSProperties,

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 24,
  } as React.CSSProperties,

  statCard: {
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "18px 20px",
    border: `1px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    gap: 14,
  } as React.CSSProperties,

  statIconTile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  statIconDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  } as React.CSSProperties,

  statValue: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  } as React.CSSProperties,

  statLabel: {
    fontSize: 11.5,
    color: TEXT,
    marginTop: 2,
    fontWeight: 500,
  } as React.CSSProperties,

  filterRow: {
    display: "flex",
    gap: 6,
    marginBottom: 16,
  } as React.CSSProperties,

  filterBtn: (active: boolean): React.CSSProperties => ({
    padding: "7px 14px",
    borderRadius: 7,
    border: `1px solid ${active ? "#0E8C8C" : BORDER}`,
    background: active ? "#E1F5F5" : "#FFFFFF",
    color: active ? "#0A6E6E" : TEXT,
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'Inter', sans-serif",
  }),

  filterCount: (active: boolean): React.CSSProperties => ({
    fontSize: 11,
    padding: "1px 7px",
    background: active ? "rgba(10,110,110,0.14)" : "rgba(21,42,67,0.06)",
    borderRadius: 20,
  }),

  tableCard: {
    background: "#FFFFFF",
    borderRadius: 12,
    border: `1px solid ${BORDER}`,
    overflow: "hidden",
  } as React.CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,

  th: {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontSize: 11,
    fontWeight: 600,
    color: "#8A97A3",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    borderBottom: `1px solid ${BORDER}`,
    background: BG_SECTION,
  } as React.CSSProperties,

  tr: { borderBottom: `1px solid ${BORDER}` } as React.CSSProperties,

  td: {
    padding: "13px 16px",
    fontSize: 13,
    color: "#374151",
  } as React.CSSProperties,

  emptyCell: {
    padding: "32px",
    textAlign: "center" as const,
    color: "#9AA7B0",
    fontSize: 13,
  } as React.CSSProperties,

  idChip: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0A6E6E",
    background: "#E1F5F5",
    padding: "3px 8px",
    borderRadius: 5,
    letterSpacing: "0.03em",
  } as React.CSSProperties,

  statusChip: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    borderRadius: 20,
  } as React.CSSProperties,

  reviewBtn: {
    padding: "6px 12px",
    background: TEAL,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
};
