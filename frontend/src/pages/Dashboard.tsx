/**
 * Dashboard.tsx — Crime Intelligence Dashboard
 * Aesthetics matched to KAVACH platform (CitizenPortal / OfficerDashboard / CaseDetail)
 * Tokens: TEAL #0E8C8C · NAVY #152A43 · BG #EAF2F5 · BORDER #E3E9EC
 */

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import {
  FileText,
  MapPin,
  Building2,
  AlertTriangle,
  Flame,
  Sparkles,
  Activity,
  Shield,
  Clock,
  Cloud,
  BarChart3,
  Brain,
  TrendingUp,
  Search,
  TrendingDown,
  Layers,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  getDashboard,
  getHotspots,
  getZone,
  getAISummary,
  getForecast,
  getPatterns,
  getAnomalies,
  getPatternSummary,
  type DashboardData,
  type Hotspot,
  type ZoneData,
  type AIReport,
  type CrimeForecastResponse,
  type CrimePatternsResponse,
  type AnomalyResponse,
  type PatternSummaryResponse,
} from "../api/analytics";

/* ── Design tokens — unified with all KAVACH pages ── */
const C = {
  navy: "#152A43",
  navySoft: "#2C4260",
  teal: "#0E8C8C",
  tealDark: "#0A6E6E",
  tealLight: "#E1F5F5",
  tealBright: "#26B99A",
  green: "#1F7A5C",
  greenLight: "#E5F6EC",
  orange: "#D97706",
  orangeLight: "#FEF9C3",
  red: "#C0392B",
  redLight: "#FDECEA",
  text: "#152A43",
  muted: "#5B6B7A",
  border: "#E3E9EC",
  bg: "#EAF2F5",
  card: "#FAFCFD",
  white: "#FFFFFF",
};

const RISK_COLOR: Record<string, string> = {
  HIGH: C.red,
  High: C.red,
  MEDIUM: C.orange,
  Medium: C.orange,
  LOW: C.teal,
  Low: C.teal,
};
const RISK_BG: Record<string, string> = {
  HIGH: C.redLight,
  High: C.redLight,
  MEDIUM: C.orangeLight,
  Medium: C.orangeLight,
  LOW: C.tealLight,
  Low: C.tealLight,
};

/* ── Heatmap layer ── */
const HeatmapLayer: React.FC<{
  points: [number, number, number][];
  radius?: number;
  blur?: number;
  maxZoom?: number;
}> = ({ points, radius = 50, blur = 35, maxZoom = 12 }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length) return;
    const layer = (L as any).heatLayer(points, {
      radius,
      blur,
      maxZoom,
      minOpacity: 0.35,
      gradient: {
        0.15: "rgba(14,140,140,0.45)",
        0.5: "rgba(14,140,140,0.85)",
        0.75: "rgba(217,119,6,0.9)",
        1.0: "rgba(192,57,43,1.0)",
      },
    });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, points, radius, blur, maxZoom]);
  return null;
};

/* ── Map controller ── */
const MapController: React.FC<{
  center: [number, number] | null;
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && map)
      map.flyTo(center, zoom, { duration: 1.4, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
};

/* ── Skeleton ── */
const Sk: React.FC<{ h?: string; r?: string; w?: string }> = ({
  h = "18px",
  r = "8px",
  w = "100%",
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: r,
      background: "linear-gradient(90deg,#dde6ea 25%,#eaf2f5 50%,#dde6ea 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

/* ── Card ── */
const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(21,42,67,0.05)",
      boxSizing: "border-box",
      width: "100%",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Risk badge ── */
const RiskBadge: React.FC<{ risk: string }> = ({ risk }) => {
  const n = risk.toUpperCase();
  const col = RISK_COLOR[n] ?? C.muted;
  const bg = RISK_BG[n] ?? C.bg;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: col,
        background: bg,
        border: `1px solid ${col}30`,
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: col,
        }}
      />
      {n} Risk
    </span>
  );
};

/* ── Section label ── */
const SLabel: React.FC<{
  icon: React.ReactNode;
  title: string;
  sub?: string;
}> = ({ icon, title, sub }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "14px",
    }}
  >
    <div
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background: C.tealLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: C.navy,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      {sub && <div style={{ fontSize: "10px", color: C.muted }}>{sub}</div>}
    </div>
  </div>
);

/* ── AI report renderer ── */
const renderReport = (text: string) => {
  if (!text) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      {text
        .split(/(?=##\s)/g)
        .filter(Boolean)
        .map((sec, i) => {
          const lines = sec.trim().split("\n");
          const heading = lines[0].replace(/^##\s*/, "").trim();
          const body = lines.slice(1).join("\n").trim() || lines[0];
          return (
            <div
              key={i}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              {heading && (
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: C.teal,
                    marginBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Sparkles size={12} color={C.teal} />
                  {heading}
                </div>
              )}
              <div
                style={{
                  fontSize: "12px",
                  color: C.text,
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}
              >
                {body}
              </div>
            </div>
          );
        })}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════════════ */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);

  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [zoneError, setZoneError] = useState<string | null>(null);

  const [forecast, setForecast] = useState<CrimeForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [patterns, setPatterns] = useState<CrimePatternsResponse | null>(null);
  const [patternsLoading, setPatternsLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<AnomalyResponse | null>(null);
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);
  const [patternSummary, setPatternSummary] =
    useState<PatternSummaryResponse | null>(null);
  const [patternSummaryLoading, setPatternSummaryLoading] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<
    "All" | "High" | "Medium" | "Low"
  >("All");
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(11);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const zonePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch(() =>
        setDashError("Failed to load dashboard. Is the backend running?"),
      )
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => {
    getHotspots()
      .then((data) => {
        setHotspots(data);
        if (data.length) handleHotspotClick(data[0].zone, false);
      })
      .catch(() => setMapError("Failed to load hotspot data."))
      .finally(() => setMapLoading(false));
  }, []);

  const handleHotspotClick = (zone: string, zoom = true) => {
    setSelectedZone(null);
    setForecast(null);
    setPatterns(null);
    setAnomalies(null);
    setPatternSummary(null);
    setAiReport(null);
    setZoneLoading(true);
    setZoneError(null);
    const spot = hotspots.find((h) => h.zone === zone);
    if (spot && zoom) {
      setMapCenter([spot.lat, spot.lng]);
      setMapZoom(11);
    }
    getZone(zone)
      .then(setSelectedZone)
      .catch(() => setZoneError(`Failed to load zone: ${zone}`))
      .finally(() => setZoneLoading(false));
    setForecastLoading(true);
    getForecast(zone)
      .then(setForecast)
      .finally(() => setForecastLoading(false));
    setPatternsLoading(true);
    getPatterns(zone)
      .then(setPatterns)
      .finally(() => setPatternsLoading(false));
    setAnomaliesLoading(true);
    getAnomalies(zone)
      .then(setAnomalies)
      .finally(() => setAnomaliesLoading(false));
    setPatternSummaryLoading(true);
    getPatternSummary(zone)
      .then(setPatternSummary)
      .finally(() => setPatternSummaryLoading(false));
  };

  const handleAIReport = () => {
    if (!selectedZone) return;
    setAiLoading(true);
    getAISummary(selectedZone.zone)
      .then(setAiReport)
      .finally(() => setAiLoading(false));
  };

  const filtered = hotspots.filter((h) => {
    const s =
      h.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase());
    const r =
      riskFilter === "All" || h.risk.toUpperCase() === riskFilter.toUpperCase();
    return s && r;
  });

  const maxCrime = hotspots.length
    ? Math.max(...hotspots.map((h) => h.crime_count))
    : 1;
  const heatPts: [number, number, number][] = filtered.map((h) => [
    h.lat,
    h.lng,
    h.crime_count / maxCrime,
  ]);
  const maxBd = selectedZone?.crime_breakdown.length
    ? Math.max(...selectedZone.crime_breakdown.map((b) => b.count))
    : 1;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Inter','Segoe UI',sans-serif",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulseBtn { 0%,100%{box-shadow:0 0 0 0 rgba(14,140,140,0.4)} 50%{box-shadow:0 0 0 12px rgba(14,140,140,0)} }
        .leaflet-control-attribution { display:none!important }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#C8D8DC;border-radius:4px}
      `}</style>

      {/* ── Topbar ── */}
      <header
        style={{
          height: "54px",
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 4px rgba(21,42,67,0.06)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "7px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.navy,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={13} /> Officer Portal
          </button>
          <div style={{ height: "20px", width: "1px", background: C.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: `linear-gradient(150deg, ${C.teal}, ${C.navy})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={16} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: C.navy,
                  letterSpacing: "-0.01em",
                }}
              >
                KAVACH
              </div>
              <div style={{ fontSize: "9px", color: C.muted, fontWeight: 500 }}>
                Crime Intelligence Platform
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "20px",
              background: C.tealLight,
              color: C.tealDark,
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.teal,
                boxShadow: `0 0 5px ${C.teal}`,
              }}
            />
            LIVE DATA STREAM
          </div>
          <div style={{ height: "20px", width: "1px", background: C.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: C.tealLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${C.teal}30`,
              }}
            >
              <Shield size={14} color={C.teal} />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.navy }}>
                Command Officer
              </div>
              <div style={{ fontSize: "10px", color: C.muted }}>
                Karnataka State Police
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "22px 28px 60px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Error */}
        {dashError && (
          <div
            style={{
              padding: "10px 14px",
              background: C.redLight,
              border: `1px solid ${C.red}30`,
              borderRadius: "8px",
              fontSize: "12px",
              color: C.red,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={13} />
            {dashError}
          </div>
        )}

        {/* ── KPI + search bar ── */}
        <Card style={{ padding: "14px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            {/* Search + filters */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: "8px",
                  padding: "7px 12px",
                  minWidth: "240px",
                }}
              >
                <Search size={13} color={C.muted} />
                <input
                  type="text"
                  placeholder="Search station or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "12px",
                    color: C.text,
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: C.muted,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Risk:
                </span>
                {(["All", "High", "Medium", "Low"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    style={{
                      padding: "4px 11px",
                      borderRadius: "20px",
                      border: "none",
                      background: riskFilter === r ? C.teal : C.bg,
                      color: riskFilter === r ? "#fff" : C.muted,
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI chips */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  icon: <FileText size={13} color={C.teal} />,
                  label: "FIRs",
                  val: dashboard?.total_firs?.toLocaleString("en-IN") ?? "—",
                  col: C.navy,
                },
                {
                  icon: <MapPin size={13} color={C.navySoft} />,
                  label: "Districts",
                  val: dashboard?.districts ?? "—",
                  col: C.navy,
                },
                {
                  icon: <Building2 size={13} color={C.green} />,
                  label: "Stations",
                  val: dashboard?.stations ?? "—",
                  col: C.navy,
                },
                {
                  icon: <AlertTriangle size={13} color={C.red} />,
                  label: "High Risk",
                  val: dashboard?.high_risk_zones ?? "—",
                  col: C.red,
                },
              ].map((k, i, arr) => (
                <React.Fragment key={k.label}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    {k.icon}
                    <div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: C.muted,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {k.label}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: k.col,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {k.val}
                      </div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        height: "24px",
                        width: "1px",
                        background: C.border,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Map section ── */}
        <div
          style={{
            display: "flex",
            gap: "18px",
            width: "100%",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          {/* Station list */}
          <div
            style={{
              width: "340px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: C.navy,
                padding: "0 2px",
              }}
            >
              Karnataka Hotspots{" "}
              <span style={{ color: C.teal }}>({filtered.length})</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxHeight: "560px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {mapLoading ? (
                [1, 2, 3].map((i) => <Sk key={i} h="110px" r="12px" />)
              ) : filtered.length === 0 ? (
                <Card style={{ padding: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: C.muted }}>
                    No stations match filter
                  </div>
                </Card>
              ) : (
                filtered.map((h) => {
                  const isSel = selectedZone?.zone === h.zone;
                  const rCol = RISK_COLOR[h.risk] ?? C.muted;
                  return (
                    <div
                      key={h.zone}
                      onClick={() => handleHotspotClick(h.zone)}
                      style={{
                        background: C.white,
                        border: isSel
                          ? `2px solid ${C.teal}`
                          : `1px solid ${C.border}`,
                        borderRadius: "12px",
                        padding: "14px 16px",
                        cursor: "pointer",
                        boxShadow: isSel
                          ? `0 4px 16px ${C.teal}18`
                          : "0 1px 4px rgba(21,42,67,0.04)",
                        transition: "all 0.18s",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: rCol,
                              boxShadow: `0 0 5px ${rCol}60`,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 700,
                              color: rCol,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {h.risk} Risk
                          </span>
                        </div>
                        {isSel && (
                          <span
                            style={{
                              fontSize: "9px",
                              background: C.tealLight,
                              color: C.tealDark,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: "8px",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: C.navy,
                          marginBottom: "2px",
                        }}
                      >
                        {h.zone}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: C.muted,
                          marginBottom: "10px",
                        }}
                      >
                        {h.district} District, Karnataka
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotspotClick(h.zone);
                        }}
                        style={{
                          width: "100%",
                          padding: "7px",
                          borderRadius: "7px",
                          border: "none",
                          background: isSel ? C.teal : C.bg,
                          color: isSel ? "#fff" : C.navy,
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {isSel
                          ? "Selected Zone ✓"
                          : "View Station Intelligence"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Map */}
          <div style={{ flex: 1, minWidth: "400px" }}>
            <Card
              style={{
                height: "590px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "56px",
                  zIndex: 1000,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.navy,
                }}
              >
                <Flame size={13} color={C.teal} /> Geospatial Crime Density
                Heatmap
              </div>
              {mapError ? (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: C.red,
                    fontSize: "12px",
                  }}
                >
                  {mapError}
                </div>
              ) : mapLoading ? (
                <Sk h="100%" r="12px" />
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <MapContainer
                    center={[15.3173, 75.7139]}
                    zoom={7}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom
                  >
                    <MapController center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution=""
                    />
                    <HeatmapLayer points={heatPts} />
                  </MapContainer>

                  {/* Floating zone card */}
                  {selectedZone && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "18px",
                        left: "18px",
                        zIndex: 1000,
                        background: C.white,
                        borderRadius: "12px",
                        padding: "14px 16px",
                        border: `1px solid ${C.border}`,
                        boxShadow: "0 8px 24px rgba(21,42,67,0.12)",
                        width: "260px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background:
                              RISK_COLOR[selectedZone.risk] ?? C.muted,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            color: RISK_COLOR[selectedZone.risk] ?? C.muted,
                            textTransform: "uppercase",
                          }}
                        >
                          {selectedZone.risk} Risk
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: C.navy,
                          marginBottom: "1px",
                        }}
                      >
                        {selectedZone.zone}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: C.muted,
                          marginBottom: "10px",
                        }}
                      >
                        {selectedZone.district} District
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "7px",
                        }}
                      >
                        {[
                          {
                            label: "Total FIRs",
                            val: selectedZone.crime_count,
                          },
                          {
                            label: "Risk Score",
                            val: `${selectedZone.risk_score}/100`,
                            col: RISK_COLOR[selectedZone.risk],
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            style={{
                              background: C.bg,
                              padding: "7px 10px",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "8px",
                                color: C.muted,
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              {s.label}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: (s as any).col ?? C.navy,
                                fontWeight: 700,
                              }}
                            >
                              {s.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Density legend */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      zIndex: 1000,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${C.border}`,
                      width: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: C.navy,
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Crime Density
                    </div>
                    <div
                      style={{
                        height: "5px",
                        borderRadius: "3px",
                        background: `linear-gradient(to right, rgba(14,140,140,0.6), #D97706, #C0392B)`,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3px",
                        fontSize: "8px",
                        color: C.muted,
                        fontWeight: 600,
                      }}
                    >
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ── Zone intelligence ── */}
        <div
          ref={zonePanelRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            width: "100%",
          }}
        >
          {zoneLoading && (
            <Card style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Sk h="20px" w="200px" /> <Sk h="14px" w="140px" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px",
                    marginTop: "6px",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Sk key={i} h="60px" r="10px" />
                  ))}
                </div>
              </div>
            </Card>
          )}

          {selectedZone && !zoneLoading && (
            <>
              {/* Zone header */}
              <Card style={{ padding: "20px 22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: C.teal,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      Zone Intelligence
                    </div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        color: C.navy,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {selectedZone.zone}
                    </h2>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "12px",
                        color: C.muted,
                      }}
                    >
                      {selectedZone.district} District
                    </p>
                  </div>
                  <RiskBadge risk={selectedZone.risk} />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      label: "Total FIRs",
                      val: selectedZone.crime_count.toLocaleString("en-IN"),
                      icon: <FileText size={13} color={C.teal} />,
                      col: C.navy,
                    },
                    {
                      label: "Risk Score",
                      val: `${selectedZone.risk_score}/100`,
                      icon: (
                        <TrendingUp
                          size={13}
                          color={RISK_COLOR[selectedZone.risk] ?? C.muted}
                        />
                      ),
                      col: RISK_COLOR[selectedZone.risk] ?? C.muted,
                    },
                    {
                      label: "Peak Time",
                      val: selectedZone.peak_time,
                      icon: <Clock size={13} color={C.navySoft} />,
                      col: C.navy,
                    },
                    {
                      label: "Weather",
                      val: selectedZone.common_weather,
                      icon: <Cloud size={13} color={C.orange} />,
                      col: C.navy,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: C.bg,
                        borderRadius: "10px",
                        padding: "11px 14px",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            color: C.muted,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {s.label}
                        </div>
                        {s.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: s.col,
                          fontWeight: 700,
                        }}
                      >
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Crime breakdown */}
              <Card style={{ padding: "20px 22px" }}>
                <SLabel
                  icon={<BarChart3 size={15} color={C.teal} />}
                  title={`Crime Breakdown — ${selectedZone.zone}`}
                  sub={`${selectedZone.crime_breakdown.reduce((s, b) => s + b.count, 0)} total incidents`}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: "10px",
                  }}
                >
                  {selectedZone.crime_breakdown.map((b, i) => {
                    const total = selectedZone.crime_breakdown.reduce(
                      (s, x) => s + x.count,
                      0,
                    );
                    const pct = Math.round((b.count / (total || 1)) * 100);
                    const col = i === 0 ? C.red : i < 3 ? C.orange : C.teal;
                    return (
                      <div
                        key={b.crime}
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                          borderRadius: "10px",
                          padding: "11px 13px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "7px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "7px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 700,
                                color: col,
                                background: `${col}15`,
                                padding: "2px 6px",
                                borderRadius: "5px",
                              }}
                            >
                              #{i + 1}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: C.navy,
                              }}
                            >
                              {b.crime}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {b.count}{" "}
                            <span
                              style={{
                                fontSize: "10px",
                                color: C.muted,
                                fontWeight: 500,
                              }}
                            >
                              ({pct}%)
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: "5px",
                            borderRadius: "3px",
                            background: C.border,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: "3px",
                              background: col,
                              width: `${(b.count / maxBd) * 100}%`,
                              transition: "width 0.5s",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Forecast */}
              <Card style={{ padding: "20px 22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <SLabel
                    icon={<Sparkles size={15} color={C.teal} />}
                    title="Crime Forecast"
                    sub="7-Day Predictive Risk Engine"
                  />
                  {forecast && <RiskBadge risk={forecast.forecast_risk} />}
                </div>
                {forecastLoading ? (
                  <Sk h="60px" />
                ) : forecast ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "10px",
                      }}
                    >
                      {[
                        {
                          label: "Forecast Risk",
                          val: forecast.forecast_risk,
                          col: RISK_COLOR[forecast.forecast_risk] ?? C.navy,
                        },
                        {
                          label: "Confidence",
                          val: `${forecast.confidence}%`,
                          col: C.teal,
                        },
                        {
                          label: "Forecast Period",
                          val: forecast.forecast_period,
                          col: C.navy,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          style={{
                            background: C.bg,
                            padding: "10px 13px",
                            borderRadius: "9px",
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "9px",
                              color: C.muted,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {s.label}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: s.col,
                              fontWeight: 700,
                              marginTop: "3px",
                            }}
                          >
                            {s.val}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: C.navy,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: "8px",
                        }}
                      >
                        Expected Crimes & Probability
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit,minmax(170px,1fr))",
                          gap: "7px",
                        }}
                      >
                        {forecast.expected_crimes.map((ec) => (
                          <div
                            key={ec.crime}
                            style={{
                              padding: "9px 12px",
                              background: C.tealLight,
                              border: `1px solid ${C.teal}20`,
                              borderRadius: "9px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: C.navy,
                              }}
                            >
                              {ec.crime}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: C.teal,
                              }}
                            >
                              {ec.probability}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </Card>

              {/* Patterns */}
              <Card style={{ padding: "20px 22px" }}>
                <SLabel
                  icon={<Layers size={15} color={C.teal} />}
                  title="Pattern Analysis"
                  sub="Detected Temporal Patterns"
                />
                {patternsLoading ? (
                  <Sk h="80px" />
                ) : patterns?.patterns.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
                      gap: "10px",
                    }}
                  >
                    {patterns.patterns.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "13px",
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                          borderRadius: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: C.navy,
                            marginBottom: "8px",
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "6px",
                            fontSize: "11px",
                          }}
                        >
                          {[
                            { label: "Crime", val: p.crime_type, col: C.text },
                            {
                              label: "Peak Day",
                              val: p.peak_day ?? "Weekend",
                              col: C.navySoft,
                            },
                            {
                              label: "Peak Time",
                              val: p.peak_time,
                              col: C.navy,
                            },
                            {
                              label: "Confidence",
                              val: `${p.confidence}%`,
                              col: C.teal,
                            },
                          ].map((r) => (
                            <div key={r.label}>
                              <span
                                style={{
                                  color: C.muted,
                                  display: "block",
                                  fontSize: "10px",
                                }}
                              >
                                {r.label}
                              </span>
                              <strong style={{ color: r.col }}>{r.val}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>

              {/* Anomalies */}
              <Card style={{ padding: "20px 22px" }}>
                <SLabel
                  icon={<AlertTriangle size={15} color={C.red} />}
                  title="Anomaly Alerts"
                  sub="Statistical Deviations vs Baseline"
                />
                {anomaliesLoading ? (
                  <Sk h="70px" />
                ) : anomalies?.anomalies.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                    }}
                  >
                    {anomalies.anomalies.map((a, i) => {
                      const spike = a.type.toLowerCase() === "spike";
                      const col = spike ? C.red : C.teal;
                      const bg = spike ? C.redLight : C.tealLight;
                      return (
                        <div
                          key={i}
                          style={{
                            padding: "12px 14px",
                            background: bg,
                            border: `1px solid ${col}25`,
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "7px",
                                background: `${col}20`,
                                color: col,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {spike ? (
                                <TrendingUp size={14} />
                              ) : (
                                <TrendingDown size={14} />
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  color: C.navy,
                                }}
                              >
                                {a.crime} {a.type}
                              </div>
                              <div style={{ fontSize: "10px", color: C.muted }}>
                                {a.reason}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                color: col,
                              }}
                            >
                              {a.change_percent > 0
                                ? `+${a.change_percent}%`
                                : `${a.change_percent}%`}
                            </span>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontSize: "9px",
                                fontWeight: 700,
                                background: col,
                                color: "#fff",
                              }}
                            >
                              {a.severity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Card>
            </>
          )}

          {!selectedZone && !zoneLoading && !zoneError && (
            <Card style={{ padding: "36px", textAlign: "center" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: C.tealLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Activity size={22} color={C.teal} />
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: C.navy,
                  marginBottom: "5px",
                }}
              >
                Select a Hotspot Zone
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: C.muted,
                  maxWidth: "320px",
                  lineHeight: 1.6,
                  marginInline: "auto",
                }}
              >
                Click any station on the left list or the map above to load
                detailed crime forecast, patterns, and anomaly alerts.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Floating AI button ── */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "11px 20px",
          borderRadius: "30px",
          border: "none",
          background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
          color: "#fff",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: `0 8px 24px ${C.teal}45`,
          animation: "pulseBtn 2.5s infinite",
          letterSpacing: "0.02em",
          fontFamily: "inherit",
        }}
      >
        <Sparkles size={16} color="#fff" />
        AI Intelligence Copilot
        {patternSummary && (
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.85,
            }}
          />
        )}
      </button>

      {/* ── AI Modal ── */}
      {isAiModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(21,42,67,0.55)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setIsAiModalOpen(false)}
        >
          <div
            style={{
              background: C.white,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 24px 56px rgba(21,42,67,0.2)",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px 16px",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: C.tealLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Brain size={20} color={C.teal} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: C.navy,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    AI Intelligence Copilot
                  </h3>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: "11px",
                      color: C.muted,
                    }}
                  >
                    Pattern narrative for{" "}
                    {selectedZone?.zone || "Karnataka State"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: `1px solid ${C.border}`,
                  background: C.bg,
                  color: C.navy,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: C.teal,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Explainable Pattern Narrative
                </div>
                {patternSummaryLoading ? (
                  <Sk h="60px" />
                ) : patternSummary ? (
                  <div
                    style={{
                      padding: "14px 16px",
                      background: C.tealLight,
                      border: `1px solid ${C.teal}25`,
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: C.navy,
                      lineHeight: 1.7,
                    }}
                  >
                    {patternSummary.summary}
                  </div>
                ) : (
                  <div style={{ fontSize: "11px", color: C.muted }}>
                    Select a station to generate pattern narrative.
                  </div>
                )}
              </div>

              <button
                onClick={handleAIReport}
                disabled={aiLoading || !selectedZone}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "9px",
                  border: "none",
                  background: aiLoading ? C.muted : C.teal,
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor:
                    aiLoading || !selectedZone ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  fontFamily: "inherit",
                }}
              >
                <Brain size={15} color="#fff" />
                {aiLoading
                  ? "Generating Groq LLM Assessment..."
                  : "Run Full Groq LLM Intelligence Assessment"}
              </button>

              {aiReport && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: C.green,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "4px",
                    }}
                  >
                    Full AI Intelligence Assessment
                  </div>
                  {renderReport(aiReport.report)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
