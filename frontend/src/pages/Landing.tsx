import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      label: "Dashboard",
      active: true,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
      label: "FIR Lodging",
      active: false,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      label: "Analytics",
      active: false,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      label: "Intelligence",
      active: false,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
      label: "Settings",
      active: false,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      label: "Search",
      active: false,
    },
  ];

  return (
    <div style={S.page}>
      {/* ── Sidebar ── */}
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2L3 8v12l11 6 11-6V8L14 2z"
              fill="#00BFA5"
              fillOpacity="0.15"
              stroke="#00BFA5"
              strokeWidth="1.5"
            />
            <path
              d="M14 7l-6 3.5v7L14 21l6-3.5v-7L14 7z"
              fill="#00BFA5"
              fillOpacity="0.3"
            />
            <circle cx="14" cy="14" r="3" fill="#00BFA5" />
          </svg>
        </div>

        <div style={S.platformPill}>
          <div style={S.platformIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4z" />
            </svg>
          </div>
          <span style={S.platformLabel}>Karnataka Police</span>
        </div>

        <div style={S.sidebarDivider} />

        <nav style={S.sidebarNav}>
          {navItems.map((item) => (
            <div key={item.label} style={S.navRow}>
              <span style={{ color: item.active ? "#00BFA5" : "#b0bec5" }}>
                {item.icon}
              </span>
              <span
                style={{
                  ...S.navLabel,
                  color: item.active ? "#00BFA5" : "#90a4ae",
                  fontWeight: item.active ? 600 : 500,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div style={S.sidebarBottom}>
          <div style={S.navRow}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0bec5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={S.navLabel}>Notification</span>
          </div>
          <div style={S.navRow}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0bec5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={S.navLabel}>Help</span>
          </div>
          <div style={S.navRow}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0bec5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={S.navLabel}>My Profile</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={S.main}>
        {/* Greeting Row */}
        <div style={S.greetingRow}>
          <div style={S.avatarLarge}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#90a4ae"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 style={S.greetingTitle}>Good Morning, Officer!</h2>
            <p style={S.greetingSubtitle}>
              Here's an overview of what's happening across Karnataka today.
            </p>
          </div>
        </div>

        {/* Crime Overview Card */}
        <div style={S.hotspotCard}>
          <div style={S.hotspotHeader}>
            <h3 style={S.sectionTitle}>Crime Overview at a Glance</h3>
            <div style={S.toggleTrack}>
              <div style={S.toggleThumb} />
            </div>
          </div>

          <div style={S.hotspotBody}>
            {/* Left stats */}
            <div style={S.hotspotStats}>
              <p style={S.statSmallLabel}>Active FIRs this month</p>
              <h2 style={S.statBig}>38,204</h2>
              <div style={{ marginBottom: "24px" }} />
              <p style={S.statSmallLabel}>Stations covered</p>
              <h3 style={S.statMid}>1,100+</h3>
            </div>

            {/* Karnataka Map SVG */}
            <div style={S.mapWrap}>
              <svg
                viewBox="0 0 560 320"
                style={{ width: "100%", height: "100%" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M160,40 L240,28 L320,35 L400,55 L440,90 L460,140 L450,190 L420,240 L380,280 L320,305 L260,300 L210,270 L170,230 L140,180 L120,130 L130,80 Z"
                  fill="#e8f5f2"
                  stroke="#c8e6df"
                  strokeWidth="1.5"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="460"
                  y2="160"
                  stroke="#d0ece6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
                <line
                  x1="290"
                  y1="35"
                  x2="290"
                  y2="305"
                  stroke="#d0ece6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
                <line
                  x1="200"
                  y1="100"
                  x2="440"
                  y2="100"
                  stroke="#d0ece6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
                <line
                  x1="180"
                  y1="220"
                  x2="430"
                  y2="220"
                  stroke="#d0ece6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />

                <circle
                  cx="310"
                  cy="185"
                  r="28"
                  fill="#00BFA5"
                  fillOpacity="0.18"
                  stroke="#00BFA5"
                  strokeWidth="1.5"
                />
                <circle
                  cx="310"
                  cy="185"
                  r="16"
                  fill="#00BFA5"
                  fillOpacity="0.35"
                />
                <circle cx="310" cy="185" r="7" fill="#00BFA5" />
                <text
                  x="310"
                  y="222"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Bengaluru
                </text>

                <circle
                  cx="252"
                  cy="242"
                  r="16"
                  fill="#00BFA5"
                  fillOpacity="0.15"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="252"
                  cy="242"
                  r="9"
                  fill="#00BFA5"
                  fillOpacity="0.4"
                />
                <circle cx="252" cy="242" r="4" fill="#00BFA5" />
                <text
                  x="252"
                  y="264"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Mysuru
                </text>

                <circle
                  cx="220"
                  cy="115"
                  r="14"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="220"
                  cy="115"
                  r="8"
                  fill="#00BFA5"
                  fillOpacity="0.3"
                />
                <circle cx="220" cy="115" r="3" fill="#00BFA5" />
                <text
                  x="220"
                  y="134"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Hubli
                </text>

                <circle
                  cx="165"
                  cy="210"
                  r="12"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="165"
                  cy="210"
                  r="6"
                  fill="#00BFA5"
                  fillOpacity="0.3"
                />
                <circle cx="165" cy="210" r="3" fill="#00BFA5" />
                <text
                  x="155"
                  y="229"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Mangaluru
                </text>

                <circle
                  cx="190"
                  cy="75"
                  r="10"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="190"
                  cy="75"
                  r="5"
                  fill="#00BFA5"
                  fillOpacity="0.3"
                />
                <circle cx="190" cy="75" r="2.5" fill="#00BFA5" />
                <text
                  x="210"
                  y="70"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Belagavi
                </text>

                <circle
                  cx="390"
                  cy="100"
                  r="11"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="390"
                  cy="100"
                  r="6"
                  fill="#00BFA5"
                  fillOpacity="0.3"
                />
                <circle cx="390" cy="100" r="3" fill="#00BFA5" />
                <text
                  x="405"
                  y="95"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#00897b"
                  fontFamily="Inter,sans-serif"
                >
                  Kalaburagi
                </text>

                <circle
                  cx="300"
                  cy="145"
                  r="8"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="300"
                  cy="145"
                  r="4"
                  fill="#00BFA5"
                  fillOpacity="0.35"
                />
                <circle cx="300" cy="145" r="2" fill="#00BFA5" />

                <circle
                  cx="235"
                  cy="165"
                  r="9"
                  fill="#00BFA5"
                  fillOpacity="0.12"
                  stroke="#00BFA5"
                  strokeWidth="1"
                />
                <circle
                  cx="235"
                  cy="165"
                  r="5"
                  fill="#00BFA5"
                  fillOpacity="0.3"
                />
                <circle cx="235" cy="165" r="2" fill="#00BFA5" />

                <polygon
                  points="360,200 367,215 353,215"
                  fill="#ff7043"
                  fillOpacity="0.7"
                />
                <circle
                  cx="360"
                  cy="200"
                  r="14"
                  fill="#ff7043"
                  fillOpacity="0.08"
                  stroke="#ff7043"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
                <text
                  x="375"
                  y="205"
                  fontSize="8"
                  fill="#e64a19"
                  fontFamily="Inter,sans-serif"
                >
                  Spike forecast
                </text>
              </svg>
            </div>
          </div>

          {/* KPI Strip (same card, below divider) */}
          <div style={S.kpiStrip}>
            {[
              { label: "New complaints", value: "1,284" },
              { label: "Under review", value: "8,521" },
              { label: "FIRs filed", value: "26,058" },
              { label: "Escalations", value: "1,109" },
              { label: "Resolved", value: "11,052" },
            ].map((k) => (
              <div key={k.label} style={S.kpiItem}>
                <p style={S.kpiLabel}>{k.label}</p>
                <p style={S.kpiValue}>{k.value}</p>
              </div>
            ))}
            <button onClick={() => navigate("/login")} style={S.viewMetricsBtn}>
              View Metrics
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={S.bottomRow}>
          {/* Recent Activity */}
          <div style={S.activityCard}>
            <h4 style={S.cardTitle}>Your Recent Activity</h4>
            {[
              {
                icon: "edit",
                color: "#e0f7f4",
                iconColor: "#00BFA5",
                text: 'FIR lodged via voice — "Theft near MG Road"',
                time: "2 min ago",
                highlight: true,
              },
              {
                icon: "search",
                color: "#f3e5f5",
                iconColor: "#8e24aa",
                text: "Serial offender match detected — Case CMP-A91F",
                time: "11 min ago",
                highlight: false,
              },
              {
                icon: "calendar",
                color: "#e8f5e9",
                iconColor: "#43a047",
                text: "Patrol schedule updated — Zone 7 · Bengaluru",
                time: "34 min ago",
                highlight: false,
              },
              {
                icon: "alert",
                color: "#fff3e0",
                iconColor: "#fb8c00",
                text: "Early warning — Festival period spike · Mysuru",
                time: "1 hr ago",
                highlight: false,
              },
              {
                icon: "check",
                color: "#e8f5e9",
                iconColor: "#43a047",
                text: "FIR CMP-B33D09 officially filed — IPC 379 applied",
                time: "2 hr ago",
                highlight: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  ...S.actItem,
                  ...(item.highlight ? S.actItemHighlight : {}),
                }}
              >
                <div style={{ ...S.actIcon, background: item.color }}>
                  {item.icon === "edit" && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
                    </svg>
                  )}
                  {item.icon === "search" && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  )}
                  {item.icon === "calendar" && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )}
                  {item.icon === "alert" && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                  {item.icon === "check" && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div style={S.actContent}>
                  <p style={S.actText}>{item.text}</p>
                  <p style={S.actTime}>{item.time}</p>
                </div>
                <button style={S.actLink}>View</button>
              </div>
            ))}
          </div>

          {/* Crime Category Breakdown */}
          <div style={S.radarCard}>
            <div style={S.radarHeader}>
              <h4 style={S.cardTitle}>Case Category Breakdown</h4>
              <div style={S.radarTabs}>
                <button style={{ ...S.radarTab, ...S.radarTabActive }}>
                  By severity
                </button>
                <button style={S.radarTab}>By zone</button>
              </div>
            </div>

            <div style={S.toggleRow}>
              <span style={S.toggleRowLabel}>Live data</span>
              <div style={S.toggleTrack}>
                <div style={S.toggleThumb} />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 0",
              }}
            >
              <svg
                viewBox="0 0 240 210"
                width="240"
                height="210"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(120,105)">
                  {[52, 36, 20].map((r, i) => (
                    <polygon
                      key={i}
                      points={[0, 1, 2, 3, 4, 5]
                        .map((n) => {
                          const a = ((n * 60 - 90) * Math.PI) / 180;
                          return `${r * Math.cos(a)},${r * Math.sin(a)}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#e0f2f1"
                      strokeWidth="0.8"
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5].map((n) => {
                    const a = ((n * 60 - 90) * Math.PI) / 180;
                    return (
                      <line
                        key={n}
                        x1="0"
                        y1="0"
                        x2={52 * Math.cos(a)}
                        y2={52 * Math.sin(a)}
                        stroke="#e0f2f1"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                  <polygon
                    points="0,-46 38,-20 28,20 -6,44 -40,14 -28,-24"
                    fill="#00BFA5"
                    fillOpacity="0.15"
                    stroke="#00BFA5"
                    strokeWidth="1.8"
                  />
                  <text
                    x="0"
                    y="-60"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Theft
                  </text>
                  <text
                    x="62"
                    y="-26"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Assault
                  </text>
                  <text
                    x="62"
                    y="32"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Cyber
                  </text>
                  <text
                    x="0"
                    y="70"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Fraud
                  </text>
                  <text
                    x="-68"
                    y="32"
                    textAnchor="end"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Vehicle
                  </text>
                  <text
                    x="-68"
                    y="-26"
                    textAnchor="end"
                    fontSize="9"
                    fill="#78909c"
                    fontFamily="Inter,sans-serif"
                  >
                    Missing
                  </text>
                </g>

                <circle
                  cx="20"
                  cy="190"
                  r="5"
                  fill="#00BFA5"
                  fillOpacity="0.35"
                  stroke="#00BFA5"
                  strokeWidth="1.5"
                />
                <text
                  x="30"
                  y="194"
                  fontSize="9"
                  fill="#90a4ae"
                  fontFamily="Inter,sans-serif"
                >
                  Frequent offenders
                </text>
                <circle
                  cx="140"
                  cy="190"
                  r="5"
                  fill="#00BFA5"
                  fillOpacity="0.6"
                />
                <text
                  x="150"
                  y="194"
                  fontSize="9"
                  fill="#90a4ae"
                  fontFamily="Inter,sans-serif"
                >
                  Repeat cases
                </text>
              </svg>
            </div>

            <div style={S.radarBottom}>
              {[
                { label: "Alerts opted in", val: "3,284" },
                { label: "Unresolved cases", val: "1,105" },
                { label: "Repeat offenders", val: "892" },
              ].map((r) => (
                <div key={r.label} style={S.radarStat}>
                  <p style={S.radarStatVal}>{r.val}</p>
                  <p style={S.radarStatLabel}>{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
        button:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
}

const teal = "#00BFA5";
const blue = "#2f8ae0";

const S: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f7f8fa",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  // Sidebar
  sidebar: {
    width: "196px",
    background: "#ffffff",
    borderRight: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    padding: "22px 16px",
    flexShrink: 0,
    position: "sticky" as const,
    top: 0,
    height: "100vh",
  },
  sidebarLogo: { marginBottom: "16px", paddingLeft: "4px" },
  platformPill: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 8px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  platformIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    background: teal,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  platformLabel: { fontSize: "13px", fontWeight: 500, color: "#455a64" },
  sidebarDivider: {
    width: "100%",
    height: "1px",
    background: "#f0f0f0",
    margin: "14px 0",
  },
  sidebarNav: { display: "flex", flexDirection: "column", gap: "2px", flex: 1 },
  navRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "9px 8px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  navLabel: { fontSize: "13px", color: "#90a4ae" },
  sidebarBottom: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  // Main
  main: {
    flex: 1,
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto" as const,
  },

  // Greeting
  greetingRow: { display: "flex", alignItems: "center", gap: "14px" },
  avatarLarge: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#eceff1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #e0e0e0",
    flexShrink: 0,
  },
  greetingTitle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#263238",
    letterSpacing: "-0.02em",
  },
  greetingSubtitle: { fontSize: "13px", color: "#90a4ae", marginTop: "2px" },

  // Crime overview card (single card w/ 3 sections)
  hotspotCard: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
  },
  hotspotHeader: {
    padding: "18px 24px",
    borderBottom: "1px solid #f5f5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "17px",
    fontWeight: "500",
    color: "#263238",
    letterSpacing: "-0.01em",
  },
  toggleTrack: {
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    background: teal,
    position: "relative" as const,
    cursor: "pointer",
    flexShrink: 0,
  },
  toggleThumb: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#fff",
    position: "absolute" as const,
    right: "3px",
    top: "3px",
  },
  hotspotBody: {
    display: "flex",
    gap: "0",
    alignItems: "stretch",
    background: "#fafcfc",
    borderBottom: "1px solid #f5f5f5",
  },
  hotspotStats: {
    padding: "24px 28px",
    borderRight: "1px solid #f0f0f0",
    flexShrink: 0,
    minWidth: "200px",
  },
  statSmallLabel: { fontSize: "12px", color: "#90a4ae", marginBottom: "6px" },
  statBig: {
    fontSize: "36px",
    fontWeight: "500",
    color: "#263238",
    letterSpacing: "-0.03em",
  },
  statMid: {
    fontSize: "26px",
    fontWeight: "500",
    color: teal,
    letterSpacing: "-0.02em",
  },
  mapWrap: { flex: 1, minHeight: "260px", padding: "12px" },

  // KPI Strip (nested inside hotspotCard)
  kpiStrip: {
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    gap: "0",
  },
  kpiItem: {
    flex: 1,
    paddingRight: "24px",
    borderRight: "1px solid #f5f5f5",
    marginRight: "24px",
  },
  kpiLabel: { fontSize: "11px", color: "#90a4ae", marginBottom: "4px" },
  kpiValue: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#263238",
    letterSpacing: "-0.02em",
  },
  viewMetricsBtn: {
    flexShrink: 0,
    padding: "10px 22px",
    background: blue,
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },

  // Bottom row
  bottomRow: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px" },

  // Activity
  activityCard: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #f0f0f0",
    padding: "20px 22px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#263238",
    marginBottom: "16px",
    letterSpacing: "-0.01em",
  },
  actItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 8px",
    borderBottom: "1px solid #f9f9f9",
    borderRadius: "8px",
  },
  actItemHighlight: {
    background: "#f0faf8",
    border: "1px solid #d5f0ea",
  },
  actIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  actContent: { flex: 1, minWidth: 0 },
  actText: {
    fontSize: "12.5px",
    color: "#455a64",
    lineHeight: "1.5",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  actTime: { fontSize: "11px", color: "#b0bec5", marginTop: "2px" },
  actLink: {
    fontSize: "12px",
    color: teal,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "500",
    flexShrink: 0,
  },

  // Radar card
  radarCard: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #f0f0f0",
    padding: "20px 22px",
  },
  radarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  radarTabs: { display: "flex", gap: "12px" },
  radarTab: {
    fontSize: "12px",
    color: "#b0bec5",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },
  radarTabActive: {
    color: teal,
    fontWeight: "500",
    borderBottom: `1.5px solid ${teal}`,
    paddingBottom: "1px",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    marginBottom: "4px",
  },
  toggleRowLabel: { fontSize: "11px", color: "#b0bec5" },
  radarBottom: {
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0 0",
    borderTop: "1px solid #f5f5f5",
  },
  radarStat: { textAlign: "center" as const },
  radarStatVal: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#263238",
    letterSpacing: "-0.01em",
  },
  radarStatLabel: { fontSize: "10px", color: "#b0bec5", marginTop: "2px" },
};
