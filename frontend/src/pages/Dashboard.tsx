/**
 * Dashboard.tsx
 *
 * Crime Intelligence Dashboard — Live data from KAVACH backend.
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
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
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
   i18n — translations dictionary
========================================================= */

const translations = {
  en: {
    officerPortal: "OFFICER PORTAL",
    dashboard: "Dashboard",
    bnsSections: "BNS Sections",
    crimeHotspot: "Crime Hotspot",
    explainableAI: "Explainable AI",
    generateReport: "Generate report",
    settings: "Settings",
    signOut: "Sign out",

    platformTitle: "Crime Intelligence Platform",
    liveDataStream: "LIVE DATA STREAM",
    commandOfficer: "Command Officer",
    karnatakaPolice: "Karnataka State Police",

    dashError: "Failed to load dashboard data. Is the backend running?",

    searchPlaceholder: "Search station or district...",
    riskFilter: "Risk Filter:",
    all: "All",
    high: "High",
    medium: "Medium",
    low: "Low",

    firs: "FIRs",
    districts: "Districts",
    stations: "Stations",
    highRisk: "High Risk",

    karnatakaHotspots: "Karnataka Hotspots",
    noStationsMatch: "No stations match search filter",
    riskZone: "Risk Zone",
    active: "Active",
    district: "District",
    karnatakaLabel: "Karnataka",
    selectedZoneCheck: "Selected Zone ✓",
    viewStationIntel: "View Station Intelligence",

    geoDensityHeatmap: "Geospatial Crime Density Heatmap",
    riskStation: "Risk Station",
    totalFIRs: "Total FIRs",
    riskScore: "Risk Score",
    crimeDensityScale: "Crime Density Scale",
    lowLabel: "Low",
    highLabel: "High",

    zoneIntelligence: "Zone Intelligence",
    peakTime: "Peak Time",
    weather: "Weather",

    crimeBreakdown: "Crime Breakdown",
    totalIncidents: "Total Incidents",
    noCrimeBreakdown: "No crime breakdown data available for this station.",

    crimeForecast: "Crime Forecast",
    forecastEngine: "7-Day Predictive Risk Engine",
    forecastRisk: "Forecast Risk",
    confidence: "Confidence",
    forecastPeriod: "Forecast Period",
    expectedCrimes: "Expected Crimes & Probability",
    noExpectedCrimes: "No expected-crime data available.",

    patternAnalysis: "Pattern Analysis",
    detectedPatterns: "Detected Temporal Patterns",
    crime: "Crime",
    peakDay: "Peak Day",
    weekend: "Weekend",
    noPatterns: "No patterns detected for this station.",

    anomalyAlerts: "Anomaly Alerts",
    statisticalDeviations: "Statistical Deviations vs Baseline",
    noAnomalies: "No anomalies detected for this station.",

    selectHotspotZone: "Select a Hotspot Zone",
    selectHotspotInstruction:
      "Click any hotspot station on the left list or map above to load detailed crime forecast, patterns, and anomaly alerts.",

    aiCopilot: "AI Intelligence Copilot",
    patternNarrativeFor: "Pattern Narrative & Groq LLM Intelligence for",
    karnatakaState: "Karnataka State",
    explainablePatternNarrative: "Explainable Pattern Narrative",
    selectStationNarrative: "Select a station to generate pattern narrative.",
    generatingAssessment: "Generating Groq LLM Assessment...",
    runAssessment: "Run Full Groq LLM Intelligence Assessment →",
    fullAssessment: "Full AI Intelligence Assessment",

    language: "ಕನ್ನಡ",
  },

  kn: {
    officerPortal: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    bnsSections: "ಬಿಎನ್‌ಎಸ್ ವಿಭಾಗಗಳು",
    crimeHotspot: "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್",
    explainableAI: "ವಿವರಿಸಬಹುದಾದ ಎಐ",
    generateReport: "ವರದಿ ರಚಿಸಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    signOut: "ಸೈನ್ ಔಟ್",

    platformTitle: "ಅಪರಾಧ ಗುಪ್ತಚರ ವೇದಿಕೆ",
    liveDataStream: "ನೇರ ದತ್ತಾಂಶ ಸ್ಟ್ರೀಮ್",
    commandOfficer: "ಕಮಾಂಡ್ ಅಧಿಕಾರಿ",
    karnatakaPolice: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",

    dashError: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ?",

    searchPlaceholder: "ಠಾಣೆ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಹುಡುಕಿ...",
    riskFilter: "ಅಪಾಯದ ಶೋಧಕ:",
    all: "ಎಲ್ಲಾ",
    high: "ಹೆಚ್ಚು",
    medium: "ಮಧ್ಯಮ",
    low: "ಕಡಿಮೆ",

    firs: "ಎಫ್‌ಐಆರ್‌ಗಳು",
    districts: "ಜಿಲ್ಲೆಗಳು",
    stations: "ಠಾಣೆಗಳು",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",

    karnatakaHotspots: "ಕರ್ನಾಟಕ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    noStationsMatch: "ಹುಡುಕಾಟ ಶೋಧಕಕ್ಕೆ ಯಾವುದೇ ಠಾಣೆಗಳು ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ",
    riskZone: "ಅಪಾಯದ ವಲಯ",
    active: "ಸಕ್ರಿಯ",
    district: "ಜಿಲ್ಲೆ",
    karnatakaLabel: "ಕರ್ನಾಟಕ",
    selectedZoneCheck: "ಆಯ್ಕೆಮಾಡಿದ ವಲಯ ✓",
    viewStationIntel: "ಠಾಣೆ ಗುಪ್ತಚರ ವೀಕ್ಷಿಸಿ",

    geoDensityHeatmap: "ಭೌಗೋಳಿಕ ಅಪರಾಧ ಸಾಂದ್ರತೆ ಹೀಟ್‌ಮ್ಯಾಪ್",
    riskStation: "ಅಪಾಯದ ಠಾಣೆ",
    totalFIRs: "ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು",
    riskScore: "ಅಪಾಯದ ಅಂಕ",
    crimeDensityScale: "ಅಪರಾಧ ಸಾಂದ್ರತೆ ಮಾಪಕ",
    lowLabel: "ಕಡಿಮೆ",
    highLabel: "ಹೆಚ್ಚು",

    zoneIntelligence: "ವಲಯ ಗುಪ್ತಚರ",
    peakTime: "ಗರಿಷ್ಠ ಸಮಯ",
    weather: "ಹವಾಮಾನ",

    crimeBreakdown: "ಅಪರಾಧ ವಿಭಜನೆ",
    totalIncidents: "ಒಟ್ಟು ಘಟನೆಗಳು",
    noCrimeBreakdown: "ಈ ಠಾಣೆಗೆ ಅಪರಾಧ ವಿಭಜನೆ ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ.",

    crimeForecast: "ಅಪರಾಧ ಮುನ್ಸೂಚನೆ",
    forecastEngine: "7-ದಿನದ ಮುನ್ಸೂಚನಾ ಅಪಾಯ ಎಂಜಿನ್",
    forecastRisk: "ಮುನ್ಸೂಚನಾ ಅಪಾಯ",
    confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    forecastPeriod: "ಮುನ್ಸೂಚನಾ ಅವಧಿ",
    expectedCrimes: "ನಿರೀಕ್ಷಿತ ಅಪರಾಧಗಳು ಮತ್ತು ಸಂಭವನೀಯತೆ",
    noExpectedCrimes: "ನಿರೀಕ್ಷಿತ ಅಪರಾಧ ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ.",

    patternAnalysis: "ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ",
    detectedPatterns: "ಪತ್ತೆಯಾದ ತಾತ್ಕಾಲಿಕ ಮಾದರಿಗಳು",
    crime: "ಅಪರಾಧ",
    peakDay: "ಗರಿಷ್ಠ ದಿನ",
    weekend: "ವಾರಾಂತ್ಯ",
    noPatterns: "ಈ ಠಾಣೆಗೆ ಯಾವುದೇ ಮಾದರಿಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",

    anomalyAlerts: "ಅಸಂಗತತೆ ಎಚ್ಚರಿಕೆಗಳು",
    statisticalDeviations: "ಮೂಲಮಟ್ಟದ ವಿರುದ್ಧ ಅಂಕಿಅಂಶ ವಿಚಲನೆಗಳು",
    noAnomalies: "ಈ ಠಾಣೆಗೆ ಯಾವುದೇ ಅಸಂಗತತೆಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",

    selectHotspotZone: "ಹಾಟ್‌ಸ್ಪಾಟ್ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectHotspotInstruction:
      "ವಿವರವಾದ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ, ಮಾದರಿಗಳು ಮತ್ತು ಅಸಂಗತತೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಎಡಭಾಗದ ಪಟ್ಟಿ ಅಥವಾ ನಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಹಾಟ್‌ಸ್ಪಾಟ್ ಠಾಣೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.",

    aiCopilot: "ಎಐ ಗುಪ್ತಚರ ಸಹಾಯಕ",
    patternNarrativeFor: "ಮಾದರಿ ನಿರೂಪಣೆ ಮತ್ತು ಗ್ರೋಕ್ ಎಲ್‌ಎಲ್‌ಎಂ ಗುಪ್ತಚರ",
    karnatakaState: "ಕರ್ನಾಟಕ ರಾಜ್ಯ",
    explainablePatternNarrative: "ವಿವರಿಸಬಹುದಾದ ಮಾದರಿ ನಿರೂಪಣೆ",
    selectStationNarrative: "ಮಾದರಿ ನಿರೂಪಣೆಯನ್ನು ರಚಿಸಲು ಠಾಣೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    generatingAssessment: "ಗ್ರೋಕ್ ಎಲ್‌ಎಲ್‌ಎಂ ಮೌಲ್ಯಮಾಪನವನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    runAssessment: "ಸಂಪೂರ್ಣ ಗ್ರೋಕ್ ಎಲ್‌ಎಲ್‌ಎಂ ಗುಪ್ತಚರ ಮೌಲ್ಯಮಾಪನ ಚಲಾಯಿಸಿ →",
    fullAssessment: "ಸಂಪೂರ್ಣ ಎಐ ಗುಪ್ತಚರ ಮೌಲ್ಯಮಾಪನ",

    language: "English",
  },
} as const;

/* =========================================================
   DESIGN TOKENS — aligned to the shared app palette
========================================================= */

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";

const C = {
  navy: NAVY,
  navySoft: "#0B3045",
  indigo: TEAL,
  indigoLight: TEAL_TINT,
  green: "#0E9F83",
  greenBright: "#26B99A",
  greenLight: "#DFF7F1",
  blue: "#278ED1",
  orange: "#E7A448",
  purple: "#795BC6",
  red: "#D85B5B",
  text: "#14232E",
  muted: MUTED,
  border: BORDER,
  background: BG_SECTION,
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
        0.7: "rgba(231, 164, 72, 0.9)",
        0.88: "rgba(121, 91, 198, 0.95)",
        1.0: "rgba(216, 91, 91, 1.0)",
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
   MAP CONTROLLER
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
   SKELETON
========================================================= */

const Skeleton: React.FC<{
  width?: string;
  height?: string;
  radius?: string;
}> = ({ width = "100%", height = "18px", radius = "6px" }) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, #E8EDEF 25%, #F4F7F8 50%, #E8EDEF 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      boxSizing: "border-box",
    }}
  />
);

/* =========================================================
   CARD
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
   RISK BADGE
========================================================= */

const RiskBadge: React.FC<{ risk: string; suffix: string }> = ({
  risk,
  suffix,
}) => {
  const normalized = (risk || "").toUpperCase();
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
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
        }}
      />
      {normalized || "UNKNOWN"} {suffix}
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "12px",
      }}
    >
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
   NAV ICONS
========================================================= */

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

/* =========================================================
   MAIN DASHBOARD COMPONENT
========================================================= */

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [lang, setLang] = useState<"en" | "kn">("en");
  const t = translations[lang];
  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "kn" : "en"));

  const officerName = user?.name || t.commandOfficer;
  const officerBadge = user?.badge || "";

  // API state
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
  const [mapZoom, setMapZoom] = useState<number>(11);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const zonePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDashLoading(true);
    getDashboard()
      .then(setDashboard)
      .catch(() => setDashError(t.dashError))
      .finally(() => setDashLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMapLoading(true);
    getHotspots()
      .then((data) => {
        setHotspots(data ?? []);
        if (data && data.length > 0) {
          handleHotspotClick(data[0].zone, false);
        }
      })
      .catch(() => setMapError("Failed to load hotspot data."))
      .finally(() => setMapLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHotspotClick = (zone: string, zoomToStation = true) => {
    setSelectedZone(null);
    setForecast(null);
    setPatterns(null);
    setAnomalies(null);
    setPatternSummary(null);
    setAiReport(null);
    setZoneLoading(true);
    setZoneError(null);

    const spot = hotspots.find((h) => h.zone === zone);
    if (spot && zoomToStation) {
      setMapCenter([spot.lat, spot.lng]);
      setMapZoom(11);
    }

    getZone(zone)
      .then(setSelectedZone)
      .catch(() => setZoneError(`Failed to load zone data for ${zone}.`))
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

  const handleGenerateAIReport = () => {
    if (!selectedZone) return;
    setAiLoading(true);
    getAISummary(selectedZone.zone)
      .then(setAiReport)
      .finally(() => setAiLoading(false));
  };

  const filteredHotspots = (hotspots ?? []).filter((h) => {
    const matchesSearch =
      (h.zone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.district || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk =
      riskFilter === "All" ||
      (h.risk || "").toUpperCase() === riskFilter.toUpperCase();
    return matchesSearch && matchesRisk;
  });

  const maxCrime =
    hotspots.length > 0
      ? Math.max(...hotspots.map((h) => h.crime_count ?? 0))
      : 1;
  const heatmapPoints: [number, number, number][] = filteredHotspots.map(
    (h) => [h.lat, h.lng, (h.crime_count ?? 0) / (maxCrime || 1)],
  );

  const zoneCrimeBreakdown = selectedZone?.crime_breakdown ?? [];
  const maxBreakdown =
    zoneCrimeBreakdown.length > 0
      ? Math.max(...zoneCrimeBreakdown.map((b) => b.count ?? 0))
      : 1;

  const RISK_FILTER_LABEL: Record<"All" | "High" | "Medium" | "Low", string> = {
    All: t.all,
    High: t.high,
    Medium: t.medium,
    Low: t.low,
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14, 140, 140, 0.45); }
          50% { box-shadow: 0 0 0 14px rgba(14, 140, 140, 0); }
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>{t.officerPortal}</div>
          </div>
        </div>

        <nav style={S.navList}>
          {[
            {
              key: "dashboard",
              label: t.dashboard,
              icon: "grid",
              path: "/officer/dashboard",
            },
            {
              key: "cases",
              label: t.bnsSections,
              icon: "case",
              path: "/bns",
            },
            {
              key: "districts",
              label: t.crimeHotspot,
              icon: "map",
              path: "/dash",
            },
            {
              key: "analytics",
              label: t.explainableAI,
              icon: "chart",
              path: "/dash",
            },
            {
              key: "reports",
              label: t.generateReport,
              icon: "bolt",
              path: "/generate-report",
            },
            {
              key: "settings",
              label: t.settings,
              icon: "gear",
              path: "/settings",
            },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              style={S.navItem(
                item.key === "districts" || item.key === "analytics",
              )}
            >
              <NavIcon
                name={item.icon}
                color={
                  item.key === "districts" || item.key === "analytics"
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.55)"
                }
              />
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
            <NavIcon name="logout" color="rgba(255,255,255,0.7)" />
            {t.signOut}
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div style={S.main}>
        <header style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={S.headerLogoIcon}>
              <Shield size={18} color="#FFFFFF" />
            </div>
            <div>
              <div style={S.topbarTitle}>KAVACH</div>
              <div style={S.topbarSub}>{t.platformTitle}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={toggleLanguage} type="button" style={S.langBtn}>
              <GlobeIcon size={13} color={TEAL} />
              {t.language}
            </button>

            <div style={S.liveChip}>
              <span style={S.liveDot} />
              {t.liveDataStream}
            </div>
            <div style={S.divider} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={S.headerAvatar}>
                <Shield size={16} color="#FFFFFF" />
              </div>
              <div>
                <strong style={S.commandOfficerText}>{officerName}</strong>
                <span style={S.commandOfficerSub}>{t.karnatakaPolice}</span>
              </div>
            </div>
          </div>
        </header>

        <div style={S.body}>
          {dashError && (
            <div style={S.errorBanner}>
              <AlertTriangle size={14} />
              {dashError}
            </div>
          )}

          {/* SECTION 1: KPIs */}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  flex: 1,
                }}
              >
                <div style={S.searchBox}>
                  <Search size={14} color={C.muted} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={S.searchInput}
                  />
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={S.riskFilterLabel}>{t.riskFilter}</span>
                  {(["All", "High", "Medium", "Low"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRiskFilter(r)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        border: "none",
                        background: riskFilter === r ? TEAL : C.background,
                        color: riskFilter === r ? C.white : C.muted,
                        fontSize: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {RISK_FILTER_LABEL[r]}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FileText size={14} color={C.blue} />
                  <div>
                    <span style={S.kpiLabel}>{t.firs}</span>
                    <div style={S.kpiValue}>
                      {dashboard?.total_firs?.toLocaleString("en-IN") ?? "—"}
                    </div>
                  </div>
                </div>
                <div style={S.kpiDivider} />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MapPin size={14} color={C.purple} />
                  <div>
                    <span style={S.kpiLabel}>{t.districts}</span>
                    <div style={S.kpiValue}>{dashboard?.districts ?? "—"}</div>
                  </div>
                </div>
                <div style={S.kpiDivider} />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Building2 size={14} color={C.green} />
                  <div>
                    <span style={S.kpiLabel}>{t.stations}</span>
                    <div style={S.kpiValue}>{dashboard?.stations ?? "—"}</div>
                  </div>
                </div>
                <div style={S.kpiDivider} />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <AlertTriangle size={14} color={C.red} />
                  <div>
                    <span style={S.kpiLabel}>{t.highRisk}</span>
                    <div style={{ ...S.kpiValue, color: C.red }}>
                      {dashboard?.high_risk_zones ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 2: MAP */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              width: "100%",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "360px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 4px",
                }}
              >
                <div
                  style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}
                >
                  {t.karnatakaHotspots}{" "}
                  <span style={{ color: TEAL }}>
                    ({filteredHotspots.length})
                  </span>
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
                  [1, 2, 3].map((i) => (
                    <Skeleton key={i} height="120px" radius="16px" />
                  ))
                ) : filteredHotspots.length === 0 ? (
                  <Card style={{ padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: C.muted }}>
                      {t.noStationsMatch}
                    </div>
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
                          border: isSelected
                            ? `2px solid ${TEAL}`
                            : `1px solid ${C.border}`,
                          borderRadius: "16px",
                          padding: "16px 18px",
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 8px 24px rgba(14,140,140,0.12)"
                            : "0 4px 14px rgba(18,42,57,0.03)",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: RISK_COLOR[h.risk] ?? C.muted,
                              }}
                            />
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 800,
                                color: RISK_COLOR[h.risk] ?? C.muted,
                                textTransform: "uppercase",
                              }}
                            >
                              {h.risk} {t.riskZone}
                            </span>
                          </div>
                          {isSelected && (
                            <span
                              style={{
                                fontSize: "9px",
                                background: TEAL_TINT,
                                color: TEAL_DARK,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "10px",
                              }}
                            >
                              {t.active}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 800,
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
                          {h.district} {t.district}, {t.karnatakaLabel}
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
                            background: isSelected ? TEAL : C.background,
                            color: isSelected ? C.white : C.navy,
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {isSelected
                            ? t.selectedZoneCheck
                            : t.viewStationIntel}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card
                style={{
                  height: "600px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div style={S.mapLabel}>
                  <Flame size={14} color={C.green} />
                  {t.geoDensityHeatmap}
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
                  <Skeleton height="100%" radius="16px" />
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
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <HeatmapLayer
                        points={heatmapPoints}
                        radius={50}
                        blur={35}
                        maxZoom={12}
                      />
                    </MapContainer>

                    {selectedZone && (
                      <div style={S.floatingCard}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background:
                                RISK_COLOR[selectedZone.risk] ?? C.muted,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 800,
                              color: RISK_COLOR[selectedZone.risk] ?? C.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            {selectedZone.risk} {t.riskStation}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: C.navy,
                            marginBottom: "2px",
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
                          {selectedZone.district} {t.district}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              background: C.background,
                              padding: "8px 10px",
                              borderRadius: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "8px",
                                color: C.muted,
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              {t.totalFIRs}
                            </span>
                            <div
                              style={{
                                fontSize: "13px",
                                color: C.navy,
                                fontWeight: 800,
                              }}
                            >
                              {selectedZone.crime_count}
                            </div>
                          </div>
                          <div
                            style={{
                              background: C.background,
                              padding: "8px 10px",
                              borderRadius: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "8px",
                                color: C.muted,
                                fontWeight: 700,
                                textTransform: "uppercase",
                              }}
                            >
                              {t.riskScore}
                            </span>
                            <div
                              style={{
                                fontSize: "13px",
                                color: RISK_COLOR[selectedZone.risk] ?? C.muted,
                                fontWeight: 800,
                              }}
                            >
                              {selectedZone.risk_score}/100
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={S.scaleCard}>
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          color: C.navy,
                          marginBottom: "4px",
                        }}
                      >
                        {t.crimeDensityScale}
                      </div>
                      <div
                        style={{
                          height: "6px",
                          borderRadius: "3px",
                          background:
                            "linear-gradient(to right, rgba(38,185,154,0.7), #E7A448, #795BC6, #D85B5B)",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "4px",
                          fontSize: "8px",
                          color: C.muted,
                          fontWeight: 700,
                        }}
                      >
                        <span>{t.lowLabel}</span>
                        <span>{t.highLabel}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* SECTION 3: ZONE INTELLIGENCE */}
          <div
            ref={zonePanelRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {zoneLoading && (
              <Card style={{ padding: "28px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <Skeleton height="24px" width="220px" />
                  <Skeleton height="16px" width="160px" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "14px",
                      marginTop: "8px",
                    }}
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} height="64px" radius="10px" />
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {selectedZone && !zoneLoading && (
              <>
                <Card style={{ padding: "24px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: C.green,
                          letterSpacing: "0.8px",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        {t.zoneIntelligence}
                      </div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          color: C.navy,
                          fontWeight: 800,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {selectedZone.zone}
                      </h2>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "12px",
                          color: C.muted,
                        }}
                      >
                        {selectedZone.district} {t.district}
                      </p>
                    </div>
                    <RiskBadge risk={selectedZone.risk} suffix="Risk" />
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
                      {
                        label: t.totalFIRs,
                        value: (selectedZone.crime_count ?? 0).toLocaleString(
                          "en-IN",
                        ),
                        color: C.blue,
                        icon: <FileText size={15} color={C.blue} />,
                      },
                      {
                        label: t.riskScore,
                        value: `${selectedZone.risk_score ?? 0}/100`,
                        color: RISK_COLOR[selectedZone.risk] ?? C.muted,
                        icon: (
                          <TrendingUp
                            size={15}
                            color={RISK_COLOR[selectedZone.risk] ?? C.muted}
                          />
                        ),
                      },
                      {
                        label: t.peakTime,
                        value: selectedZone.peak_time ?? "—",
                        color: C.purple,
                        icon: <Clock size={15} color={C.purple} />,
                      },
                      {
                        label: t.weather,
                        value: selectedZone.common_weather ?? "—",
                        color: C.orange,
                        icon: <Cloud size={15} color={C.orange} />,
                      },
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "9px",
                              color: C.muted,
                              fontWeight: 700,
                              letterSpacing: "0.6px",
                              textTransform: "uppercase",
                            }}
                          >
                            {s.label}
                          </div>
                          {s.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            color: s.color,
                            fontWeight: 800,
                            marginTop: "4px",
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card style={{ padding: "24px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        color: C.navy,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BarChart3 size={15} color={TEAL} />
                      {t.crimeBreakdown} — {selectedZone.zone}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        color: C.muted,
                        fontWeight: 700,
                      }}
                    >
                      {zoneCrimeBreakdown.reduce(
                        (sum, b) => sum + (b.count ?? 0),
                        0,
                      )}{" "}
                      {t.totalIncidents}
                    </span>
                  </div>

                  {zoneCrimeBreakdown.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: C.muted,
                      }}
                    >
                      {t.noCrimeBreakdown}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {zoneCrimeBreakdown.map((b, i) => {
                        const totalIncidents = zoneCrimeBreakdown.reduce(
                          (sum, item) => sum + (item.count ?? 0),
                          0,
                        );
                        const percent = Math.round(
                          ((b.count ?? 0) / (totalIncidents || 1)) * 100,
                        );
                        const barColor =
                          i === 0 ? C.red : i < 3 ? C.orange : TEAL;
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
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
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
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: C.navy,
                                  }}
                                >
                                  {b.crime}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  color: C.text,
                                }}
                              >
                                {b.count ?? 0}{" "}
                                <span
                                  style={{
                                    fontSize: "10px",
                                    color: C.muted,
                                    fontWeight: 600,
                                  }}
                                >
                                  ({percent}%)
                                </span>
                              </div>
                            </div>
                            <div
                              style={{
                                height: "6px",
                                borderRadius: "3px",
                                background: C.border,
                                width: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: "3px",
                                  background: `linear-gradient(to right, ${barColor}, ${barColor}DD)`,
                                  width: `${((b.count ?? 0) / (maxBreakdown || 1)) * 100}%`,
                                  transition: "width 0.5s ease",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* SECTION 4: FORECAST */}
            {selectedZone && (
              <Card style={{ padding: "24px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Sparkles size={18} color={TEAL} />
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: C.navy,
                        }}
                      >
                        {t.crimeForecast}
                      </div>
                      <span style={{ fontSize: "10px", color: C.muted }}>
                        {t.forecastEngine}
                      </span>
                    </div>
                  </div>
                  {forecast && (
                    <RiskBadge risk={forecast.forecast_risk} suffix="Risk" />
                  )}
                </div>

                {forecastLoading ? (
                  <Skeleton height="60px" />
                ) : forecast ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: C.background,
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            color: C.muted,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {t.forecastRisk}
                        </span>
                        <div
                          style={{
                            fontSize: "15px",
                            color: RISK_COLOR[forecast.forecast_risk] ?? C.navy,
                            fontWeight: 800,
                            marginTop: "2px",
                          }}
                        >
                          {forecast.forecast_risk}
                        </div>
                      </div>
                      <div
                        style={{
                          background: C.background,
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            color: C.muted,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {t.confidence}
                        </span>
                        <div
                          style={{
                            fontSize: "15px",
                            color: TEAL,
                            fontWeight: 800,
                            marginTop: "2px",
                          }}
                        >
                          {forecast.confidence ?? 0}%
                        </div>
                      </div>
                      <div
                        style={{
                          background: C.background,
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            color: C.muted,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {t.forecastPeriod}
                        </span>
                        <div
                          style={{
                            fontSize: "13px",
                            color: C.navy,
                            fontWeight: 700,
                            marginTop: "2px",
                          }}
                        >
                          {forecast.forecast_period ?? "—"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: C.navy,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                          marginBottom: "8px",
                        }}
                      >
                        {t.expectedCrimes}
                      </div>
                      {(forecast.expected_crimes ?? []).length === 0 ? (
                        <div style={{ fontSize: "11px", color: C.muted }}>
                          {t.noExpectedCrimes}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "8px",
                          }}
                        >
                          {(forecast.expected_crimes ?? []).map((ec) => (
                            <div
                              key={ec.crime}
                              style={{
                                padding: "10px 12px",
                                background: TEAL_TINT,
                                border: `1px solid ${TEAL}20`,
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: C.navy,
                                }}
                              >
                                {ec.crime}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  color: TEAL_DARK,
                                }}
                              >
                                {ec.probability}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </Card>
            )}

            {/* SECTION 5: PATTERNS */}
            {selectedZone && (
              <Card style={{ padding: "24px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  <Layers size={18} color={C.purple} />
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: C.navy,
                      }}
                    >
                      {t.patternAnalysis}
                    </div>
                    <span style={{ fontSize: "10px", color: C.muted }}>
                      {t.detectedPatterns}
                    </span>
                  </div>
                </div>

                {patternsLoading ? (
                  <Skeleton height="80px" />
                ) : (patterns?.patterns ?? []).length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {(patterns?.patterns ?? []).map((p, i) => (
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
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: C.navy,
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "6px",
                            fontSize: "10px",
                          }}
                        >
                          <div>
                            <span style={{ color: C.muted, display: "block" }}>
                              {t.crime}
                            </span>
                            <strong style={{ color: C.text }}>
                              {p.crime_type}
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: C.muted, display: "block" }}>
                              {t.peakDay}
                            </span>
                            <strong style={{ color: C.purple }}>
                              {p.peak_day ?? t.weekend}
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: C.muted, display: "block" }}>
                              {t.peakTime}
                            </span>
                            <strong style={{ color: C.navy }}>
                              {p.peak_time}
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: C.muted, display: "block" }}>
                              {t.confidence}
                            </span>
                            <strong style={{ color: C.green }}>
                              {p.confidence}%
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "11px", color: C.muted }}>
                    {t.noPatterns}
                  </div>
                )}
              </Card>
            )}

            {/* SECTION 6: ANOMALIES */}
            {selectedZone && (
              <Card style={{ padding: "24px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  <AlertTriangle size={18} color={C.red} />
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: C.navy,
                      }}
                    >
                      {t.anomalyAlerts}
                    </div>
                    <span style={{ fontSize: "10px", color: C.muted }}>
                      {t.statisticalDeviations}
                    </span>
                  </div>
                </div>

                {anomaliesLoading ? (
                  <Skeleton height="70px" />
                ) : (anomalies?.anomalies ?? []).length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {(anomalies?.anomalies ?? []).map((anom, i) => {
                      const isSpike =
                        (anom.type || "").toLowerCase() === "spike";
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: isSpike
                                  ? `${C.red}20`
                                  : `${C.green}20`,
                                color: isSpike ? C.red : C.green,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {isSpike ? (
                                <TrendingUp size={16} />
                              ) : (
                                <TrendingDown size={16} />
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 800,
                                  color: C.navy,
                                }}
                              >
                                {anom.crime} {anom.type}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: C.muted,
                                  marginTop: "1px",
                                }}
                              >
                                {anom.reason}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 900,
                                color: isSpike ? C.red : C.green,
                              }}
                            >
                              {(anom.change_percent ?? 0) > 0
                                ? `+${anom.change_percent}%`
                                : `${anom.change_percent ?? 0}%`}
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
                ) : (
                  <div style={{ fontSize: "11px", color: C.muted }}>
                    {t.noAnomalies}
                  </div>
                )}
              </Card>
            )}

            {!selectedZone && !zoneLoading && !zoneError && (
              <Card
                style={{ padding: "40px", textAlign: "center", width: "100%" }}
              >
                <Activity
                  size={32}
                  color={C.muted}
                  style={{ marginBottom: "12px" }}
                />
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: C.navy,
                    marginBottom: "6px",
                  }}
                >
                  {t.selectHotspotZone}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: C.muted,
                    maxWidth: "340px",
                    lineHeight: 1.6,
                    marginInline: "auto",
                  }}
                >
                  {t.selectHotspotInstruction}
                </p>
              </Card>
            )}

            {zoneError && !zoneLoading && (
              <Card style={{ padding: "24px", width: "100%" }}>
                <div style={{ fontSize: "12px", color: C.red }}>
                  {zoneError}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING AI COPILOT BUTTON */}
      <button onClick={() => setIsAiModalOpen(true)} style={S.aiFab}>
        <Sparkles size={18} color={C.white} />
        <span>{t.aiCopilot}</span>
        {patternSummary && (
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: C.greenBright,
            }}
          />
        )}
      </button>

      {/* AI COPILOT MODAL */}
      {isAiModalOpen && (
        <div style={S.modalOverlay} onClick={() => setIsAiModalOpen(false)}>
          <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={S.modalIcon}>
                  <Brain size={22} color={TEAL} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 800,
                      color: C.navy,
                    }}
                  >
                    {t.aiCopilot}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "11px",
                      color: C.muted,
                    }}
                  >
                    {t.patternNarrativeFor}{" "}
                    {selectedZone?.zone || t.karnatakaState}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                style={S.modalCloseBtn}
              >
                <X size={16} />
              </button>
            </div>

            <div style={S.modalBody}>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: TEAL,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: "8px",
                  }}
                >
                  {t.explainablePatternNarrative}
                </div>
                {patternSummaryLoading ? (
                  <Skeleton height="60px" />
                ) : patternSummary?.summary ? (
                  <div
                    style={{
                      padding: "16px 18px",
                      background: TEAL_TINT,
                      border: `1px solid ${TEAL}25`,
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: C.navy,
                      lineHeight: 1.7,
                    }}
                  >
                    {patternSummary.summary}
                  </div>
                ) : (
                  <div style={{ fontSize: "11px", color: C.muted }}>
                    {t.selectStationNarrative}
                  </div>
                )}
              </div>

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
                  cursor:
                    aiLoading || !selectedZone ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {aiLoading ? t.generatingAssessment : t.runAssessment}
              </button>

              {aiReport?.report && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: C.green,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: "4px",
                    }}
                  >
                    {t.fullAssessment}
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

/* =========================================================
   STYLES (matched to shared app shell)
========================================================= */

const S: Record<string, any> = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    background: BG_SECTION,
    color: C.text,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    boxSizing: "border-box",
  },

  sidebar: {
    width: "236px",
    flexShrink: 0,
    background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px",
    position: "sticky",
    top: 0,
    height: "100vh",
  },

  sidebarLogoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 30,
  },
  sidebarLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sidebarLogoTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  sidebarLogoSub: {
    fontSize: 9.5,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.45)",
    marginTop: 1,
  },

  navList: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  navItem: (active: boolean) => ({
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
    textAlign: "left" as const,
    transition: "background 0.15s ease",
    width: "100%",
  }),

  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    marginTop: 12,
  },
  sidebarOfficerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 12,
  },
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
  },
  sidebarOfficerName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sidebarOfficerBadge: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  },
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
  },

  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },

  topbar: {
    minHeight: "68px",
    background: C.white,
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 32px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxSizing: "border-box",
    gap: "12px",
    flexWrap: "wrap",
    width: "100%",
  },
  headerLogoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: TEAL,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 800,
    color: NAVY,
    letterSpacing: "-0.2px",
  },
  topbarSub: { fontSize: 9, color: MUTED, fontWeight: 600 },

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
  },

  liveChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 20,
    background: "#DFF7F1",
    color: "#0E9F83",
    fontSize: 10,
    fontWeight: 700,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#26B99A",
    display: "inline-block",
  },
  divider: { height: 28, width: 1, background: BORDER },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: NAVY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  commandOfficerText: { display: "block", fontSize: 11, color: NAVY },
  commandOfficerSub: { fontSize: 9, color: MUTED },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "24px 32px 60px",
    width: "100%",
    boxSizing: "border-box",
  },

  errorBanner: {
    padding: "12px 16px",
    background: "#D85B5B10",
    border: "1px solid #D85B5B30",
    borderRadius: 10,
    fontSize: 11,
    color: "#D85B5B",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "8px 14px",
    minWidth: 260,
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 11,
    color: C.text,
    width: "100%",
    fontFamily: "inherit",
  },
  riskFilterLabel: {
    fontSize: 10,
    color: MUTED,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  kpiLabel: {
    fontSize: 9,
    color: MUTED,
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },
  kpiValue: { fontSize: 13, fontWeight: 800, color: NAVY },
  kpiDivider: { height: 24, width: 1, background: BORDER },

  mapLabel: {
    position: "absolute",
    top: 16,
    left: 60,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(12px)",
    padding: "6px 14px",
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
  },

  floatingCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1000,
    background: C.white,
    borderRadius: 16,
    padding: "16px 18px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 12px 36px rgba(21,42,67,0.16)",
    width: 280,
    boxSizing: "border-box",
  },

  scaleCard: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(12px)",
    padding: "8px 12px",
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    boxShadow: "0 4px 14px rgba(21,42,67,0.08)",
    width: 170,
  },

  aiFab: {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 22px",
    borderRadius: 30,
    border: "none",
    background: `linear-gradient(135deg, ${TEAL}, ${NAVY})`,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 14px 35px rgba(14,140,140,0.45)",
    animation: "pulseGlow 2.5s infinite",
    letterSpacing: "0.3px",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 100000,
    background: "rgba(21, 42, 67, 0.65)",
    backdropFilter: "blur(14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
  },

  modalCard: {
    background: C.white,
    borderRadius: 20,
    border: `1px solid ${BORDER}`,
    boxShadow: "0 25px 65px -12px rgba(21, 42, 67, 0.45)",
    width: "100%",
    maxWidth: 660,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
    position: "relative",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 28px 18px",
    borderBottom: `1px solid ${BORDER}`,
    background: C.white,
  },

  modalIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: TEAL_TINT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: `1px solid ${BORDER}`,
    background: BG_SECTION,
    color: NAVY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  modalBody: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
};

export default Dashboard;
