/**
 * Dashboard.tsx
 *
 * Crime Intelligence Dashboard — Live data from KAVACH backend.
 * Features:
 *   1. Dashboard KPIs (Statewide Overview)
 *   2. Crime Hotspot Map (Organic Density Heatmap ONLY with flyTo zoom & top-right scale)
 *   3. Zone Intelligence & Sleek 2-Column Metric Card Grid for Crime Breakdown
 *   4. Crime Forecast Card (7-Day Predictive Risk)
 *   5. Pattern Analysis Card (Temporal & Behavioral Patterns)
 *   6. Anomaly Alerts Card (Statistical Spikes & Drops)
 *   7. INNOVATIVE AI COPILOT MODAL (Z-Index 99999, Pristine Rounded Modal Shape & Formatted Markdown Cards)
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
  Flag,
  Activity,
  Shield,
  Clock,
  Cloud,
  BarChart3,
  Brain,
  ArrowRight,
  CheckCircle2,
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

/* =========================================================
   DESIGN TOKENS
========================================================= */

const C = {
  navy: "#061B2B",
  navySoft: "#0B3045",
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  green: "#0E9F83",
  greenBright: "#26B99A",
  greenLight: "#DFF7F1",
  blue: "#278ED1",
  orange: "#E7A448",
  purple: "#795BC6",
  red: "#D85B5B",
  text: "#14232E",
  muted: "#83919A",
  border: "#E3EAED",
  background: "#F4F7F8",
  white: "#FFFFFF",
};

const RISK_COLOR: Record<string, string> = {
  HIGH: C.red,
  High: C.red,
  MEDIUM: C.orange,
  Medium: C.orange,
  LOW: C.greenBright,
  Low: C.greenBright,
};

/* =========================================================
   HEATMAP LAYER
========================================================= */

interface HeatmapLayerProps {
  points: [number, number, number][];
  radius?: number;
  blur?: number;
  maxZoom?: number;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  points,
  radius = 50,
  blur = 35,
  maxZoom = 12,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius,
      blur,
      maxZoom,
      minOpacity: 0.35,
      gradient: {
        0.15: "rgba(38, 185, 154, 0.45)",
        0.45: "rgba(38, 185, 154, 0.85)",
        0.70: "rgba(231, 164, 72, 0.9)",
        0.88: "rgba(121, 91, 198, 0.95)",
        1.00: "rgba(216, 91, 91, 1.0)",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
};

/* =========================================================
   MAP CONTROLLER (FlyTo Zooming)
========================================================= */

interface MapControllerProps {
  center: [number, number] | null;
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.4, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);

  return null;
};

/* =========================================================
   SKELETON COMPONENT
========================================================= */

const Skeleton: React.FC<{ width?: string; height?: string; radius?: string }> = ({
  width = "100%",
  height = "18px",
  radius = "6px",
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, #E8EDEF 25%, #F4F7F8 50%, #E8EDEF 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      boxSizing: "border-box",
    }}
  />
);

/* =========================================================
   CARD COMPONENT
========================================================= */

const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(18,42,57,0.04)",
      boxSizing: "border-box",
      width: "100%",
      ...style,
    }}
  >
    {children}
  </div>
);

/* =========================================================
   RISK BADGE COMPONENT
========================================================= */

const RiskBadge: React.FC<{ risk: string }> = ({ risk }) => {
  const normalized = risk.toUpperCase();
  const color = RISK_COLOR[normalized] ?? C.muted;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color,
        background: `${color}14`,
        border: `1px solid ${color}30`,
        boxSizing: "border-box",
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
      {normalized} Risk
    </span>
  );
};

/* =========================================================
   FORMATTED AI REPORT RENDERER
========================================================= */

const renderFormattedReport = (text: string) => {
  if (!text) return null;
  const rawSections = text.split(/(?=##\s)/g).filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
      {rawSections.map((sec, idx) => {
        const lines = sec.trim().split("\n");
        const heading = lines[0].replace(/^##\s*/, "").trim();
        const bodyLines = lines.slice(1).join("\n").trim();
        const content = bodyLines || lines[0];

        return (
          <div
            key={idx}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "16px 18px",
              boxShadow: "0 4px 14px rgba(6, 27, 43, 0.03)",
            }}
          >
            {heading && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: C.indigo,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Sparkles size={14} color={C.indigo} />
                {heading}
              </div>
            )}
            <div
              style={{
                fontSize: "12px",
                color: C.text,
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   MAIN DASHBOARD COMPONENT
========================================================= */

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // API state
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);

  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Selected Zone State
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [zoneError, setZoneError] = useState<string | null>(null);

  // NEW FEATURES API STATES
  const [forecast, setForecast] = useState<CrimeForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const [patterns, setPatterns] = useState<CrimePatternsResponse | null>(null);
  const [patternsLoading, setPatternsLoading] = useState(false);

  const [anomalies, setAnomalies] = useState<AnomalyResponse | null>(null);
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);

  const [patternSummary, setPatternSummary] = useState<PatternSummaryResponse | null>(null);
  const [patternSummaryLoading, setPatternSummaryLoading] = useState(false);

  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  // Map Zoom State
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(11);

  // INNOVATIVE AI MODAL STATE
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Ref for smooth scrolling
  const zonePanelRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard KPIs
  useEffect(() => {
    setDashLoading(true);
    getDashboard()
      .then(setDashboard)
      .catch(() => setDashError("Failed to load dashboard data. Is the backend running?"))
      .finally(() => setDashLoading(false));
  }, []);

  // Fetch hotspots
  useEffect(() => {
    setMapLoading(true);
    getHotspots()
      .then((data) => {
        setHotspots(data);
        if (data && data.length > 0) {
          handleHotspotClick(data[0].zone, false);
        }
      })
      .catch(() => setMapError("Failed to load hotspot data."))
      .finally(() => setMapLoading(false));
  }, []);

  // Handle station click (Triggers ALL Sub-API Calls & Zooms Map)
  const handleHotspotClick = (zone: string, zoomToStation = true) => {
    setSelectedZone(null);
    setForecast(null);
    setPatterns(null);
    setAnomalies(null);
    setPatternSummary(null);
    setAiReport(null);
    setZoneLoading(true);
    setZoneError(null);

    // Zoom Map to Station Location
    const spot = hotspots.find((h) => h.zone === zone);
    if (spot && zoomToStation) {
      setMapCenter([spot.lat, spot.lng]);
      setMapZoom(11);
    }

    // 1. Fetch Zone Data
    getZone(zone)
      .then(setSelectedZone)
      .catch(() => setZoneError(`Failed to load zone data for ${zone}.`))
      .finally(() => setZoneLoading(false));

    // 2. Fetch Forecast
    setForecastLoading(true);
    getForecast(zone)
      .then(setForecast)
      .finally(() => setForecastLoading(false));

    // 3. Fetch Patterns
    setPatternsLoading(true);
    getPatterns(zone)
      .then(setPatterns)
      .finally(() => setPatternsLoading(false));

    // 4. Fetch Anomalies
    setAnomaliesLoading(true);
    getAnomalies(zone)
      .then(setAnomalies)
      .finally(() => setAnomaliesLoading(false));

    // 5. Fetch Explainable Pattern Summary
    setPatternSummaryLoading(true);
    getPatternSummary(zone)
      .then(setPatternSummary)
      .finally(() => setPatternSummaryLoading(false));
  };

  const handleGenerateAIReport = () => {
    if (!selectedZone) return;
    setAiLoading(true);
    getAISummary(selectedZone.zone)
      .then(setAiReport)
      .finally(() => setAiLoading(false));
  };

  // Filtered hotspots list
  const filteredHotspots = hotspots.filter((h) => {
    const matchesSearch =
      h.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || h.risk.toUpperCase() === riskFilter.toUpperCase();
    return matchesSearch && matchesRisk;
  });

  // Heatmap weighted points
  const maxCrime = hotspots.length > 0 ? Math.max(...hotspots.map((h) => h.crime_count)) : 1;
  const heatmapPoints: [number, number, number][] = filteredHotspots.map((h) => [
    h.lat,
    h.lng,
    h.crime_count / maxCrime,
  ]);

  const maxBreakdown =
    selectedZone && selectedZone.crime_breakdown.length > 0
      ? Math.max(...selectedZone.crime_breakdown.map((b) => b.count))
      : 1;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `radial-gradient(circle at 70% 0%, rgba(79, 70, 229, 0.05), transparent 30%), ${C.background}`,
        color: C.text,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        overflowX: "hidden",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* CSS Overrides to hide Leaflet attribution clutter & enable smooth animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.45); }
          50% { box-shadow: 0 0 0 14px rgba(79, 70, 229, 0); }
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      {/* =====================================================
          TOPBAR (Header Nav Bar with Back Button & Status)
      ====================================================== */}
      <header
        style={{
          minHeight: "68px",
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxSizing: "border-box",
          gap: "12px",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${C.border}`,
              background: C.background,
              color: C.navy,
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <ArrowLeft size={14} />
            <span>Officer Portal</span>
          </button>
          <div style={{ height: "24px", width: "1px", background: C.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: C.indigo,
                color: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={18} color={C.white} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: C.navy, letterSpacing: "-0.2px" }}>
                KAVACH
              </div>
              <div style={{ fontSize: "9px", color: C.muted, fontWeight: 600 }}>
                Crime Intelligence Platform
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "20px",
              background: C.greenLight,
              color: C.green,
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.greenBright,
                display: "inline-block",
              }}
            />
            LIVE DATA STREAM
          </div>
          <div style={{ height: "28px", width: "1px", background: C.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: C.navy,
                color: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={16} color={C.white} />
            </div>
            <div>
              <strong style={{ display: "block", fontSize: "11px", color: C.navy }}>Command Officer</strong>
              <span style={{ fontSize: "9px", color: C.muted }}>Karnataka State Police</span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px 32px 60px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Error Banner */}
        {dashError && (
          <div
            style={{
              padding: "12px 16px",
              background: `${C.red}10`,
              border: `1px solid ${C.red}30`,
              borderRadius: "10px",
              fontSize: "11px",
              color: C.red,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={14} />
            {dashError}
          </div>
        )}

        {/* ===================================================
            SECTION 1: DASHBOARD KPIs & TOP CONTROL BAR
        =================================================== */}
        <Card style={{ padding: "16px 22px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              width: "100%",
            }}
          >
            {/* Search Box & Risk Filter Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: C.background,
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                  padding: "8px 14px",
                  minWidth: "260px",
                }}
              >
                <Search size={14} color={C.muted} />
                <input
                  type="text"
                  placeholder="Search station or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "11px",
                    color: C.text,
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Risk Filter:
                </span>
                {(["All", "High", "Medium", "Low"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      border: "none",
                      background: riskFilter === r ? C.indigo : C.background,
                      color: riskFilter === r ? C.white : C.muted,
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard KPI Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={14} color={C.blue} />
                <div>
                  <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>FIRs</span>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>{dashboard?.total_firs.toLocaleString("en-IN") ?? "—"}</div>
                </div>
              </div>
              <div style={{ height: "24px", width: "1px", background: C.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={14} color={C.purple} />
                <div>
                  <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Districts</span>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>{dashboard?.districts ?? "—"}</div>
                </div>
              </div>
              <div style={{ height: "24px", width: "1px", background: C.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Building2 size={14} color={C.green} />
                <div>
                  <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Stations</span>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>{dashboard?.stations ?? "—"}</div>
                </div>
              </div>
              <div style={{ height: "24px", width: "1px", background: C.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={14} color={C.red} />
                <div>
                  <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>High Risk</span>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.red }}>{dashboard?.high_risk_zones ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================
            SECTION 2: CRIME HOTSPOT MAP (HEATMAP ONLY)
        =================================================== */}
        <div style={{ display: "flex", gap: "20px", width: "100%", alignItems: "stretch", flexWrap: "wrap" }}>
          
          {/* Left Column: Station List */}
          <div
            style={{
              width: "360px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}>
                Karnataka Hotspots <span style={{ color: C.indigo }}>({filteredHotspots.length})</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "560px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {mapLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} height="120px" radius="16px" />)
              ) : filteredHotspots.length === 0 ? (
                <Card style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: C.muted }}>No stations match search filter</div>
                </Card>
              ) : (
                filteredHotspots.map((h) => {
                  const isSelected = selectedZone?.zone === h.zone;
                  return (
                    <div
                      key={h.zone}
                      onClick={() => handleHotspotClick(h.zone)}
                      style={{
                        background: C.white,
                        border: isSelected ? `2px solid ${C.indigo}` : `1px solid ${C.border}`,
                        borderRadius: "16px",
                        padding: "16px 18px",
                        cursor: "pointer",
                        boxShadow: isSelected ? "0 8px 24px rgba(79,70,229,0.12)" : "0 4px 14px rgba(18,42,57,0.03)",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: RISK_COLOR[h.risk] ?? C.muted }} />
                          <span style={{ fontSize: "9px", fontWeight: 800, color: RISK_COLOR[h.risk] ?? C.muted, textTransform: "uppercase" }}>
                            {h.risk} Risk Zone
                          </span>
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: "9px", background: C.indigoLight, color: C.indigo, fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>
                            Active
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "14px", fontWeight: 800, color: C.navy, marginBottom: "2px" }}>
                        {h.zone}
                      </div>
                      <div style={{ fontSize: "11px", color: C.muted, marginBottom: "10px" }}>
                        {h.district} District, Karnataka
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotspotClick(h.zone);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "none",
                          background: isSelected ? C.indigo : C.background,
                          color: isSelected ? C.white : C.navy,
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {isSelected ? "Selected Zone ✓" : "View Station Intelligence"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Geospatial Density Map */}
          <div style={{ flex: 1, minWidth: "400px", display: "flex", flexDirection: "column" }}>
            <Card style={{ height: "600px", overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "60px",
                  zIndex: 1000,
                  background: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(12px)",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.navy,
                }}
              >
                <Flame size={14} color={C.green} />
                Geospatial Crime Density Heatmap
              </div>

              {mapError ? (
                <div style={{ padding: "30px", textAlign: "center", color: C.red, fontSize: "12px" }}>
                  {mapError}
                </div>
              ) : mapLoading ? (
                <Skeleton height="100%" radius="16px" />
              ) : (
                <div style={{ height: "100%", width: "100%", position: "relative" }}>
                  <MapContainer
                    center={[15.3173, 75.7139]}
                    zoom={7}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom
                  >
                    <MapController center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <HeatmapLayer points={heatmapPoints} radius={50} blur={35} maxZoom={12} />
                  </MapContainer>

                  {/* Floating Station Overlay Card */}
                  {selectedZone && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        zIndex: 1000,
                        background: C.white,
                        borderRadius: "16px",
                        padding: "16px 18px",
                        border: `1px solid ${C.border}`,
                        boxShadow: "0 12px 36px rgba(6, 27, 43, 0.16)",
                        width: "280px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: RISK_COLOR[selectedZone.risk] ?? C.muted }} />
                        <span style={{ fontSize: "9px", fontWeight: 800, color: RISK_COLOR[selectedZone.risk] ?? C.muted, textTransform: "uppercase" }}>
                          {selectedZone.risk} Risk Station
                        </span>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: C.navy, marginBottom: "2px" }}>
                        {selectedZone.zone}
                      </div>
                      <div style={{ fontSize: "11px", color: C.muted, marginBottom: "10px" }}>
                        {selectedZone.district} District
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div style={{ background: C.background, padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "8px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Total FIRs</span>
                          <div style={{ fontSize: "13px", color: C.navy, fontWeight: 800 }}>{selectedZone.crime_count}</div>
                        </div>
                        <div style={{ background: C.background, padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "8px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Risk Score</span>
                          <div style={{ fontSize: "13px", color: RISK_COLOR[selectedZone.risk] ?? C.muted, fontWeight: 800 }}>{selectedZone.risk_score}/100</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Right Floating Density Scale */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      zIndex: 1000,
                      background: "rgba(255, 255, 255, 0.94)",
                      backdropFilter: "blur(12px)",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${C.border}`,
                      boxShadow: "0 4px 14px rgba(6, 27, 43, 0.08)",
                      width: "170px",
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: 800, color: C.navy, marginBottom: "4px" }}>
                      Crime Density Scale
                    </div>
                    <div
                      style={{
                        height: "6px",
                        borderRadius: "3px",
                        background: "linear-gradient(to right, rgba(38,185,154,0.7), #E7A448, #795BC6, #D85B5B)",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "8px", color: C.muted, fontWeight: 700 }}>
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ===================================================
            SECTION 3: ZONE INTELLIGENCE & 2-COLUMN CRIME BREAKDOWN GRID
        =================================================== */}
        <div ref={zonePanelRef} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", boxSizing: "border-box" }}>
          {zoneLoading && (
            <Card style={{ padding: "28px", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Skeleton height="24px" width="220px" />
                <Skeleton height="16px" width="160px" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginTop: "8px" }}>
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="64px" radius="10px" />)}
                </div>
              </div>
            </Card>
          )}

          {selectedZone && !zoneLoading && (
            <>
              {/* Selected Zone Intelligence Header Card */}
              <Card style={{ padding: "24px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: C.green, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "6px" }}>
                      Zone Intelligence
                    </div>
                    <h2 style={{ margin: 0, fontSize: "22px", color: C.navy, fontWeight: 800, letterSpacing: "-0.5px" }}>{selectedZone.zone}</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: C.muted }}>{selectedZone.district} District</p>
                  </div>
                  <RiskBadge risk={selectedZone.risk} />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "14px",
                    marginTop: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {[
                    { label: "Total FIRs", value: selectedZone.crime_count.toLocaleString("en-IN"), color: C.blue, icon: <FileText size={15} color={C.blue} /> },
                    { label: "Risk Score", value: `${selectedZone.risk_score}/100`, color: RISK_COLOR[selectedZone.risk] ?? C.muted, icon: <TrendingUp size={15} color={RISK_COLOR[selectedZone.risk] ?? C.muted} /> },
                    { label: "Peak Time", value: selectedZone.peak_time, color: C.purple, icon: <Clock size={15} color={C.purple} /> },
                    { label: "Weather", value: selectedZone.common_weather, color: C.orange, icon: <Cloud size={15} color={C.orange} /> },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: C.background,
                        borderRadius: "12px",
                        padding: "12px 16px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: "9px", color: C.muted, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                          {s.label}
                        </div>
                        {s.icon}
                      </div>
                      <div style={{ fontSize: "15px", color: s.color, fontWeight: 800, marginTop: "4px" }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SLEEK 2-COLUMN CRIME BREAKDOWN GRID */}
              <Card style={{ padding: "24px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: C.navy, letterSpacing: "0.8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={15} color={C.indigo} />
                    Crime Breakdown — {selectedZone.zone}
                  </div>
                  <span style={{ fontSize: "10px", color: C.muted, fontWeight: 700 }}>
                    {selectedZone.crime_breakdown.reduce((sum, b) => sum + b.count, 0)} Total Incidents
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {selectedZone.crime_breakdown.map((b, i) => {
                    const totalIncidents = selectedZone.crime_breakdown.reduce((sum, item) => sum + item.count, 0);
                    const percent = Math.round((b.count / (totalIncidents || 1)) * 100);
                    const barColor = i === 0 ? C.red : i < 3 ? C.orange : C.indigo;
                    return (
                      <div
                        key={b.crime}
                        style={{
                          background: C.background,
                          border: `1px solid ${C.border}`,
                          borderRadius: "12px",
                          padding: "12px 14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 800,
                                color: barColor,
                                background: `${barColor}15`,
                                padding: "2px 6px",
                                borderRadius: "6px",
                              }}
                            >
                              #{i + 1}
                            </span>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: C.navy }}>{b.crime}</span>
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 800, color: C.text }}>
                            {b.count} <span style={{ fontSize: "10px", color: C.muted, fontWeight: 600 }}>({percent}%)</span>
                          </div>
                        </div>

                        {/* Embedded Progress Bar Track */}
                        <div style={{ height: "6px", borderRadius: "3px", background: C.border, width: "100%", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              borderRadius: "3px",
                              background: `linear-gradient(to right, ${barColor}, ${barColor}DD)`,
                              width: `${(b.count / maxBreakdown) * 100}%`,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* ===================================================
              SECTION 4: 🔮 CRIME FORECAST
          =================================================== */}
          {selectedZone && (
            <Card style={{ padding: "24px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={18} color={C.indigo} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>Crime Forecast</div>
                    <span style={{ fontSize: "10px", color: C.muted }}>7-Day Predictive Risk Engine</span>
                  </div>
                </div>
                {forecast && <RiskBadge risk={forecast.forecast_risk} />}
              </div>

              {forecastLoading ? (
                <Skeleton height="60px" />
              ) : forecast ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div style={{ background: C.background, padding: "12px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Forecast Risk</span>
                      <div style={{ fontSize: "15px", color: RISK_COLOR[forecast.forecast_risk] ?? C.navy, fontWeight: 800, marginTop: "2px" }}>
                        {forecast.forecast_risk}
                      </div>
                    </div>
                    <div style={{ background: C.background, padding: "12px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Confidence</span>
                      <div style={{ fontSize: "15px", color: C.indigo, fontWeight: 800, marginTop: "2px" }}>
                        {forecast.confidence}%
                      </div>
                    </div>
                    <div style={{ background: C.background, padding: "12px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "9px", color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Forecast Period</span>
                      <div style={{ fontSize: "13px", color: C.navy, fontWeight: 700, marginTop: "2px" }}>
                        {forecast.forecast_period}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: C.navy, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
                      Expected Crimes & Probability
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
                      {forecast.expected_crimes.map((ec) => (
                        <div
                          key={ec.crime}
                          style={{
                            padding: "10px 12px",
                            background: C.indigoLight,
                            border: `1px solid ${C.indigo}20`,
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "11px", fontWeight: 700, color: C.navy }}>{ec.crime}</span>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: C.indigo }}>{ec.probability}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>
          )}

          {/* ===================================================
              SECTION 5: 📊 PATTERN ANALYSIS
          =================================================== */}
          {selectedZone && (
            <Card style={{ padding: "24px", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Layers size={18} color={C.purple} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>Pattern Analysis</div>
                  <span style={{ fontSize: "10px", color: C.muted }}>Detected Temporal Patterns</span>
                </div>
              </div>

              {patternsLoading ? (
                <Skeleton height="80px" />
              ) : patterns && patterns.patterns.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  {patterns.patterns.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "14px",
                        background: C.background,
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}>{p.title}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "10px" }}>
                        <div>
                          <span style={{ color: C.muted, display: "block" }}>Crime</span>
                          <strong style={{ color: C.text }}>{p.crime_type}</strong>
                        </div>
                        <div>
                          <span style={{ color: C.muted, display: "block" }}>Peak Day</span>
                          <strong style={{ color: C.purple }}>{p.peak_day ?? "Weekend"}</strong>
                        </div>
                        <div>
                          <span style={{ color: C.muted, display: "block" }}>Peak Time</span>
                          <strong style={{ color: C.navy }}>{p.peak_time}</strong>
                        </div>
                        <div>
                          <span style={{ color: C.muted, display: "block" }}>Confidence</span>
                          <strong style={{ color: C.green }}>{p.confidence}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>
          )}

          {/* ===================================================
              SECTION 6: 🚨 ANOMALY ALERTS
          =================================================== */}
          {selectedZone && (
            <Card style={{ padding: "24px", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <AlertTriangle size={18} color={C.red} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>Anomaly Alerts</div>
                  <span style={{ fontSize: "10px", color: C.muted }}>Statistical Deviations vs Baseline</span>
                </div>
              </div>

              {anomaliesLoading ? (
                <Skeleton height="70px" />
              ) : anomalies && anomalies.anomalies.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {anomalies.anomalies.map((anom, i) => {
                    const isSpike = anom.type.toLowerCase() === "spike";
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "14px 16px",
                          background: isSpike ? `${C.red}08` : `${C.green}08`,
                          border: `1px solid ${isSpike ? C.red : C.green}25`,
                          borderRadius: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: isSpike ? `${C.red}20` : `${C.green}20`,
                              color: isSpike ? C.red : C.green,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSpike ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}>
                              {anom.crime} {anom.type}
                            </div>
                            <div style={{ fontSize: "10px", color: C.muted, marginTop: "1px" }}>
                              {anom.reason}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "16px", fontWeight: 900, color: isSpike ? C.red : C.green }}>
                            {anom.change_percent > 0 ? `+${anom.change_percent}%` : `${anom.change_percent}%`}
                          </span>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "9px",
                              fontWeight: 800,
                              background: isSpike ? C.red : C.green,
                              color: C.white,
                            }}
                          >
                            {anom.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </Card>
          )}

          {!selectedZone && !zoneLoading && !zoneError && (
            <Card style={{ padding: "40px", textAlign: "center", width: "100%" }}>
              <Activity size={32} color={C.muted} style={{ marginBottom: "12px" }} />
              <div style={{ fontSize: "15px", fontWeight: 700, color: C.navy, marginBottom: "6px" }}>
                Select a Hotspot Zone
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: C.muted, maxWidth: "340px", lineHeight: 1.6, marginInline: "auto" }}>
                Click any hotspot station on the left list or map above to load detailed crime forecast, patterns, and anomaly alerts.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* =====================================================
          INNOVATIVE FLOATING AI COPILOT BUTTON (Z-Index 99999 — ALWAYS ON TOP / AAGE)
      ====================================================== */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 22px",
          borderRadius: "30px",
          border: "none",
          background: `linear-gradient(135deg, ${C.indigo}, #3730A3)`,
          color: C.white,
          fontSize: "12px",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 14px 35px rgba(79, 70, 229, 0.45)",
          animation: "pulseGlow 2.5s infinite",
          letterSpacing: "0.3px",
        }}
      >
        <Sparkles size={18} color={C.white} />
        <span>AI Intelligence Copilot</span>
        {patternSummary && (
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.greenBright }} />
        )}
      </button>

      {/* =====================================================
          INNOVATIVE AI COPILOT MODAL DIALOG (Clean Outer Rounding & Formatted Markdown)
      ====================================================== */}
      {isAiModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 100000,
            background: "rgba(6, 27, 43, 0.65)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
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
              borderRadius: "20px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 25px 65px -12px rgba(6, 27, 43, 0.45)",
              width: "100%",
              maxWidth: "660px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxSizing: "border-box",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 28px 18px",
                borderBottom: `1px solid ${C.border}`,
                background: C.white,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: C.indigoLight,
                    color: C.indigo,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Brain size={22} color={C.indigo} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: C.navy }}>
                    AI Intelligence Copilot
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: C.muted }}>
                    Pattern Narrative & Groq LLM Intelligence for {selectedZone?.zone || "Karnataka State"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: `1px solid ${C.border}`,
                  background: C.background,
                  color: C.navy,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Inner Scrollable Body (Clean Padding & Preserved Outer Rounded Edges) */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Pattern Narrative Box */}
              <div>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.indigo, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
                  Explainable Pattern Narrative
                </div>
                {patternSummaryLoading ? (
                  <Skeleton height="60px" />
                ) : patternSummary ? (
                  <div
                    style={{
                      padding: "16px 18px",
                      background: C.indigoLight,
                      border: `1px solid ${C.indigo}25`,
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: C.navy,
                      lineHeight: 1.7,
                    }}
                  >
                    {patternSummary.summary}
                  </div>
                ) : (
                  <div style={{ fontSize: "11px", color: C.muted }}>Select a station to generate pattern narrative.</div>
                )}
              </div>

              {/* AI Action Trigger Button */}
              <button
                onClick={handleGenerateAIReport}
                disabled={aiLoading || !selectedZone}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: aiLoading ? C.muted : C.navy,
                  color: C.white,
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: aiLoading || !selectedZone ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {aiLoading ? "Generating Groq LLM Assessment..." : "Run Full Groq LLM Intelligence Assessment →"}
              </button>

              {/* Formatted Groq AI Full Report Cards */}
              {aiReport && (
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: C.green, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>
                    Full AI Intelligence Assessment
                  </div>
                  {renderFormattedReport(aiReport.report)}
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
