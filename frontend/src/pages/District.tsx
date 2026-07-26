// Districts.tsx
//
// KAVACH — Karnataka Districts & Policing, explained
//
// A public-facing informational page: a geographically-accurate map of
// Karnataka's 31 districts, paired with plain-language context about how
// the state's police system is organized. This is intentionally NOT a
// crime-hotspot or risk-monitoring view — it exists to help citizens
// understand their state and its policing structure, not to flag danger.
//
// ---------------------------------------------------------------
// REQUIRED DEPENDENCIES:
//
//   npm install react-simple-maps d3-geo lucide-react
//
// If TypeScript complains about missing types for "react-simple-maps":
//
//   npm install -D @types/react-simple-maps
//
// ---------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @ts-ignore — react-simple-maps types may not be present in every project
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

// @ts-ignore — d3-geo types may not be present in every project
import { geoCentroid } from "d3-geo";

import {
  Search,
  MapPin,
  Users,
  Building2,
  LayoutGrid,
  Clock,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   DESIGN TOKENS
========================================================= */

const C = {
  teal: "#0E8C8C",
  tealDark: "#0A6E6E",
  tealTint: "#E1F5F5",
  navy: "#152A43",
  navySoft: "#2C4260",
  bgSection: "#EAF2F5",
  white: "#FFFFFF",
  text: "#5B6B7A",
  muted: "#8A97A3",
  border: "#E3E9EC",
  iconBlue: "#E3F0FB",
  iconBlueFg: "#2E7FCE",
  iconGreen: "#E5F6EC",
  iconGreenFg: "#25A465",
  iconPurple: "#EFEAFB",
  iconPurpleFg: "#7C5CD9",
  iconOrange: "#FDEEE3",
  iconOrangeFg: "#E07B32",
};

const F = {
  head: "'Poppins', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
};

/* =========================================================
   HEADER ICONS
========================================================= */

const IShield = (p: { color?: string; size?: number }) => (
  <svg
    width={p.size ?? 20}
    height={p.size ?? 20}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
      stroke={p.color ?? C.white}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IGlobe = (p: { color?: string; size?: number }) => (
  <svg
    width={p.size ?? 14}
    height={p.size ?? 14}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke={p.color ?? C.teal} strokeWidth="2" />

    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      stroke={p.color ?? C.teal}
      strokeWidth="2"
    />

    <path
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke={p.color ?? C.teal}
      strokeWidth="2"
    />
  </svg>
);

/* =========================================================
   MAP CONFIGURATION
========================================================= */

const KARNATAKA_GEO_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/states/karnataka.geojson";

const MAP_CENTER: [number, number] = [76.3, 15.05];

const MAP_SCALE = 6500;

/* =========================================================
   TYPES
========================================================= */

type Division = "Bengaluru" | "Mysuru" | "Belagavi" | "Kalaburagi";

type MetricKey = "population" | "stations" | "officers" | "response";

interface ServiceShare {
  name: string;
  share: number;
}

interface DistrictStats {
  name: string;
  division: Division;
  populationLakh: number;
  policeStations: number;
  officerStrength: number;
  avgResponseTime: number;
  serviceTrend: number[];
  topServices: ServiceShare[];
}

/* =========================================================
   DISTRICT REGISTRY
========================================================= */

const DISTRICTS: {
  name: string;
  division: Division;
}[] = [
  { name: "Bagalkot", division: "Belagavi" },
  { name: "Ballari", division: "Kalaburagi" },
  { name: "Belagavi", division: "Belagavi" },
  { name: "Bengaluru Rural", division: "Bengaluru" },
  { name: "Bengaluru Urban", division: "Bengaluru" },
  { name: "Bidar", division: "Kalaburagi" },
  { name: "Chamarajanagar", division: "Mysuru" },
  { name: "Chikkaballapur", division: "Bengaluru" },
  { name: "Chikkamagaluru", division: "Mysuru" },
  { name: "Chitradurga", division: "Bengaluru" },
  { name: "Dakshina Kannada", division: "Mysuru" },
  { name: "Davanagere", division: "Bengaluru" },
  { name: "Dharwad", division: "Belagavi" },
  { name: "Gadag", division: "Belagavi" },
  { name: "Kalaburagi", division: "Kalaburagi" },
  { name: "Hassan", division: "Mysuru" },
  { name: "Haveri", division: "Belagavi" },
  { name: "Kodagu", division: "Mysuru" },
  { name: "Kolar", division: "Bengaluru" },
  { name: "Koppal", division: "Kalaburagi" },
  { name: "Mandya", division: "Mysuru" },
  { name: "Mysuru", division: "Mysuru" },
  { name: "Raichur", division: "Kalaburagi" },
  { name: "Ramanagara", division: "Bengaluru" },
  { name: "Shivamogga", division: "Bengaluru" },
  { name: "Tumakuru", division: "Bengaluru" },
  { name: "Udupi", division: "Mysuru" },
  { name: "Uttara Kannada", division: "Belagavi" },
  { name: "Vijayapura", division: "Belagavi" },
  { name: "Yadgir", division: "Kalaburagi" },
  { name: "Vijayanagara", division: "Kalaburagi" },
];

const DIVISIONS: Division[] = ["Bengaluru", "Mysuru", "Belagavi", "Kalaburagi"];

/* =========================================================
   DIVISIONAL HEADQUARTERS
========================================================= */

const DIVISION_HQ: Record<Division, [number, number]> = {
  Bengaluru: [77.5946, 12.9716],
  Mysuru: [76.6394, 12.2958],
  Belagavi: [74.4977, 15.8497],
  Kalaburagi: [76.8343, 17.3297],
};

/* =========================================================
   GEOJSON ALIASES
========================================================= */

const ALIASES: Record<string, string> = {
  bangalore: "Bengaluru Urban",
  bangalorerural: "Bengaluru Rural",
  bengaluru: "Bengaluru Urban",
  mysore: "Mysuru",
  mangalore: "Dakshina Kannada",
  belgaum: "Belagavi",
  gulbarga: "Kalaburagi",
  bellary: "Ballari",
  bijapur: "Vijayapura",
  shimoga: "Shivamogga",
  tumkur: "Tumakuru",
  chikmagalur: "Chikkamagaluru",
  chickmagalur: "Chikkamagaluru",
  chikballapur: "Chikkaballapur",
  chamrajnagar: "Chamarajanagar",
  chamarajnagara: "Chamarajanagar",
  uttarkannada: "Uttara Kannada",
  northkannada: "Uttara Kannada",
  hubli: "Dharwad",
  hubballi: "Dharwad",
  bagalakote: "Bagalkot",
  koppala: "Koppal",
  raichuru: "Raichur",
  gadaga: "Gadag",
};

/* =========================================================
   DETERMINISTIC ILLUSTRATIVE STATS
========================================================= */

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;

    return h >>> 0;
  };
}

function seededRandom(seedStr: string) {
  let s = xmur3(seedStr)();

  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;

    let t = Math.imul(s ^ (s >>> 15), 1 | s);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/* =========================================================
   SERVICES
========================================================= */

const SERVICE_POOL = [
  "FIR Filing",
  "Character Certificate",
  "Passport Verification",
  "Tenant Verification",
  "Missing Person Registration",
  "Event Permission",
  "NOC Requests",
  "Senior Citizen Registration",
  "Traffic Clearance",
  "Lost & Found Reports",
];

const POPULATION_OVERRIDES: Record<string, number> = {
  "Bengaluru Urban": 96.2,
  Kodagu: 5.5,
};

function populationTier(name: string): number {
  if (POPULATION_OVERRIDES[name]) {
    return POPULATION_OVERRIDES[name];
  }

  const large = [
    "Belagavi",
    "Mysuru",
    "Tumakuru",
    "Ballari",
    "Kalaburagi",
    "Dakshina Kannada",
    "Bengaluru Rural",
    "Dharwad",
    "Vijayapura",
  ];

  const rand = seededRandom(`pop-${name}`);

  if (large.includes(name)) {
    return +(15 + rand() * 8).toFixed(1);
  }

  return +(6 + rand() * 8).toFixed(1);
}

function generateStats(name: string, division: Division): DistrictStats {
  const rand = seededRandom(name);

  const isMetro = name === "Bengaluru Urban";

  const tierFactor = isMetro ? 3.2 : populationTier(name) > 15 ? 1.5 : 1;

  const populationLakh = populationTier(name);

  const policeStations = Math.round((6 + rand() * 14) * tierFactor);

  const officerStrength = Math.round((350 + rand() * 900) * tierFactor);

  const avgResponseTime = +(8 + rand() * 24).toFixed(1);

  const serviceTrend = Array.from({ length: 12 }, () =>
    Math.max(8, Math.round((60 + rand() * 120) * (tierFactor > 1.4 ? 1.6 : 1))),
  );

  const picked = seededShuffle(SERVICE_POOL, rand).slice(0, 3);

  const raw = picked.map(() => 0.3 + rand());

  const sum = raw.reduce((a, b) => a + b, 0);

  const shares = raw.map((v) => Math.round((v / sum) * 100));

  const drift = 100 - shares.reduce((a, b) => a + b, 0);

  shares[0] += drift;

  const topServices: ServiceShare[] = picked.map((service, index) => ({
    name: service,
    share: shares[index],
  }));

  return {
    name,
    division,
    populationLakh,
    policeStations,
    officerStrength,
    avgResponseTime,
    serviceTrend,
    topServices,
  };
}

/* =========================================================
   NAME MATCHING
========================================================= */

function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/district/g, "")
    .replace(/[^a-z]/g, "");
}

const CANONICAL_NORMALIZED: Record<string, string> = DISTRICTS.reduce(
  (acc, district) => {
    acc[normalize(district.name)] = district.name;

    return acc;
  },
  {} as Record<string, string>,
);

function resolveDistrictName(raw: string): string | null {
  const n = normalize(raw);

  if (!n) {
    return null;
  }

  if (CANONICAL_NORMALIZED[n]) {
    return CANONICAL_NORMALIZED[n];
  }

  if (ALIASES[n]) {
    return ALIASES[n];
  }

  for (const key of Object.keys(CANONICAL_NORMALIZED)) {
    if (key.length > 3 && (n.includes(key) || key.includes(n))) {
      return CANONICAL_NORMALIZED[key];
    }
  }

  for (const key of Object.keys(ALIASES)) {
    if (key.length > 3 && (n.includes(key) || key.includes(n))) {
      return ALIASES[key];
    }
  }

  return null;
}

const GEO_NAME_KEYS = [
  "district",
  "DISTRICT",
  "District",
  "dtname",
  "DTNAME",
  "NAME_2",
  "name_2",
  "name",
  "NAME",
  "dt_name",
];

function extractRawGeoName(
  properties: Record<string, unknown> | undefined,
): string {
  if (!properties) {
    return "";
  }

  for (const key of GEO_NAME_KEYS) {
    const value = properties[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  const fallback = Object.entries(properties).find(
    ([key, value]) =>
      typeof value === "string" &&
      (value as string).length > 2 &&
      !/^(id|iso|type|code)/i.test(key),
  );

  return fallback ? (fallback[1] as string) : "";
}

/* =========================================================
   METRICS
========================================================= */

const METRICS: Record<
  MetricKey,
  {
    label: string;
    shortLabel: string;
    get: (d: DistrictStats) => number;
    format: (n: number) => string;
  }
> = {
  population: {
    label: "Population",
    shortLabel: "Population",
    get: (d) => d.populationLakh,
    format: (n) => `${n.toFixed(1)} L`,
  },

  stations: {
    label: "Police Stations",
    shortLabel: "Stations",
    get: (d) => d.policeStations,
    format: (n) => `${n}`,
  },

  officers: {
    label: "Officer Strength",
    shortLabel: "Officers",
    get: (d) => d.officerStrength,
    format: (n) => n.toLocaleString("en-IN"),
  },

  response: {
    label: "Avg. Response Time",
    shortLabel: "Response",
    get: (d) => d.avgResponseTime,
    format: (n) => `${n.toFixed(1)} min`,
  },
};

/* =========================================================
   COLOR SCALE
========================================================= */

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");

  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);

  const r = Math.round(ar + (br - ar) * t);

  const g = Math.round(ag + (bg - ag) * t);

  const bch = Math.round(ab + (bb - ab) * t);

  return `rgb(${r}, ${g}, ${bch})`;
}

function magnitudeColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));

  return lerpColor(C.tealTint, C.tealDark, clamped);
}

/* =========================================================
   COUNT-UP HOOK
========================================================= */

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Districts() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith("kn") ? "en" : "kn";

    i18n.changeLanguage(nextLang);
  };

  /*
   * FIX:
   * The navigation array is defined as navItems
   * and the exact same variable is used below.
   *
   * This prevents:
   * Uncaught ReferenceError:
   * navItems is not defined
   */
  const navItems = [
    {
      key: "home",
      label: t("nav.home"),
      path: "/",
    },

    {
      key: "about",
      label: t("nav.about"),
      path: "/about",
    },

    {
      key: "districts",
      label: t("nav.districts"),
      path: "/dis",
    },
  ];

  const [metric, setMetric] = useState<MetricKey>("officers");

  const [divisionFilter, setDivisionFilter] = useState<Division | "All">("All");

  const [search, setSearch] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);

  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({
    coordinates: MAP_CENTER,
    zoom: 1,
  });

  const statsByName = useMemo(() => {
    const map = new Map<string, DistrictStats>();

    DISTRICTS.forEach((district) => {
      map.set(district.name, generateStats(district.name, district.division));
    });

    return map;
  }, []);

  const allStats = useMemo(
    () => Array.from(statsByName.values()),
    [statsByName],
  );

  const metricConfig = METRICS[metric];

  const { min, max } = useMemo(() => {
    const values = allStats.map((district) => metricConfig.get(district));

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [allStats, metricConfig]);

  function magnitude(district: DistrictStats): number {
    const value = metricConfig.get(district);

    if (max === min) {
      return 0.5;
    }

    return (value - min) / (max - min);
  }

  const directoryList = useMemo(() => {
    let list = [...allStats];

    if (divisionFilter !== "All") {
      list = list.filter((district) => district.division === divisionFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      list = list.filter((district) =>
        district.name.toLowerCase().includes(query),
      );
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [allStats, divisionFilter, search]);

  const statewide = useMemo(() => {
    const totalStations = allStats.reduce(
      (sum, district) => sum + district.policeStations,
      0,
    );

    const totalOfficers = allStats.reduce(
      (sum, district) => sum + district.officerStrength,
      0,
    );

    return {
      totalStations,
      totalOfficers,
    };
  }, [allStats]);

  const animatedOfficers = useCountUp(statewide.totalOfficers);

  const selectedStats = selectedDistrict
    ? statsByName.get(selectedDistrict) || null
    : null;

  const zoomIn = () =>
    setPosition((current) => ({
      ...current,
      zoom: Math.min(6, +(current.zoom * 1.5).toFixed(2)),
    }));

  const zoomOut = () =>
    setPosition((current) => ({
      ...current,
      zoom: Math.max(1, +(current.zoom / 1.5).toFixed(2)),
    }));

  const resetView = () =>
    setPosition({
      coordinates: MAP_CENTER,
      zoom: 1,
    });

  return (
    <div
      style={{
        background: C.white,
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
          }

          a:focus-visible,
          button:focus-visible {
            outline: 2px solid ${C.teal};
            outline-offset: 2px;
          }

          @media (max-width: 980px) {
            .dz-nav {
              display: none !important;
            }

            .dz-hero h1 {
              font-size: 30px !important;
            }

            .dz-stats {
              flex-direction: column !important;
            }

            .dz-stats > div {
              border-right: none !important;
              border-bottom: 1px solid ${C.border};
            }

            .dz-body {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: C.white,
          boxShadow: scrolled ? "0 2px 14px rgba(21,42,67,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: `linear-gradient(150deg, ${C.teal}, ${C.navy})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IShield size={18} />
            </div>

            <span
              style={{
                fontFamily: F.head,
                fontSize: 19,
                fontWeight: 700,
                color: C.navy,
                letterSpacing: "0.01em",
              }}
            >
              KAVACH
            </span>
          </div>

          {/* NAVIGATION */}

          <nav
            className="dz-nav"
            style={{
              display: "flex",
              gap: 32,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                style={{
                  fontFamily: F.body,
                  fontSize: 13.5,
                  color: C.navySoft,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* HEADER ACTIONS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                background: "transparent",
                color: C.teal,
                border: `1px solid ${C.teal}`,
                borderRadius: 24,
                padding: "8px 16px",
                fontFamily: F.body,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IGlobe color={C.teal} size={14} />

              {t("nav.switch_lang")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: 24,
                padding: "10px 22px",
                fontFamily: F.body,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("nav.get_in_touch")}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="dz-hero"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "64px 28px 0",
        }}
      >
        <div
          style={{
            fontFamily: F.body,
            fontSize: 12,
            fontWeight: 700,
            color: C.teal,
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          KARNATAKA · 31 DISTRICTS · 4 POLICE DIVISIONS
        </div>

        <h1
          style={{
            fontFamily: F.head,
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
            color: C.navy,
            maxWidth: 640,
          }}
        >
          Understanding Karnataka and{" "}
          <span
            style={{
              color: C.teal,
            }}
          >
            how its police system works.
          </span>
        </h1>

        <p
          style={{
            fontFamily: F.body,
            fontSize: 15,
            lineHeight: 1.75,
            color: C.text,
            margin: "18px 0 0 0",
            maxWidth: 560,
          }}
        >
          Karnataka Police is organized across 31 districts grouped into four
          divisions — Bengaluru, Mysuru, Belagavi, and Kalaburagi. This page is
          a plain-language guide to that structure: how many stations and
          officers serve each district, and what citizens most often use police
          services for. It's built to inform, not to alarm.
        </p>
      </section>

      {/* =====================================================
          STATS BAR
      ===================================================== */}

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 28px",
          position: "relative",
          top: 20,
        }}
      >
        <div
          className="dz-stats"
          style={{
            background: C.white,
            borderRadius: 12,
            boxShadow: "0 16px 40px rgba(21,42,67,0.10)",
            border: `1px solid ${C.border}`,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            icon={<LayoutGrid size={20} color={C.iconBlueFg} />}
            bg={C.iconBlue}
            value="31"
            label="Districts"
          />

          <StatCard
            icon={<MapPin size={20} color={C.iconGreenFg} />}
            bg={C.iconGreen}
            value="4"
            label="Police divisions"
          />

          <StatCard
            icon={<Building2 size={20} color={C.iconPurpleFg} />}
            bg={C.iconPurple}
            value={`${statewide.totalStations.toLocaleString("en-IN")}+`}
            label="Police stations"
          />

          <StatCard
            icon={<Users size={20} color={C.iconOrangeFg} />}
            bg={C.iconOrange}
            value={animatedOfficers.toLocaleString("en-IN")}
            label="Officers statewide"
            last
          />
        </div>
      </section>

      {/* =====================================================
          EXPLORE SECTION
      ===================================================== */}

      <section
        style={{
          background: C.bgSection,
          marginTop: 56,
          padding: "70px 28px 60px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: 34,
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: 12,
                fontWeight: 700,
                color: C.teal,
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              DISTRICT DIRECTORY
            </div>

            <h2
              style={{
                fontFamily: F.head,
                fontSize: 26,
                fontWeight: 600,
                color: C.navy,
                margin: 0,
                maxWidth: 520,
              }}
            >
              Explore Karnataka,{" "}
              <span
                style={{
                  color: C.teal,
                }}
              >
                district by district
              </span>
            </h2>

            <p
              style={{
                fontFamily: F.body,
                fontSize: 13.5,
                color: C.text,
                maxWidth: 560,
                margin: "10px 0 0",
                lineHeight: 1.7,
              }}
            >
              Pick a lens on the map — population, stations, officer strength,
              or average response time — then browse or search the directory to
              learn about a specific district.
            </p>
          </div>

          <div
            className="dz-body"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: 22,
            }}
          >
            {/* =================================================
                MAP PANEL
            ================================================= */}

            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 16px rgba(21,42,67,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: F.head,
                      fontSize: 15,
                      fontWeight: 600,
                      color: C.navy,
                    }}
                  >
                    Karnataka police presence map
                  </div>

                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 11.5,
                      color: C.text,
                      marginTop: 3,
                    }}
                  >
                    Shaded by {metricConfig.label.toLowerCase()} · markers show
                    divisional headquarters
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                  }}
                >
                  <IconButton onClick={zoomIn} label="Zoom in">
                    <ZoomIn size={14} color={C.navySoft} />
                  </IconButton>

                  <IconButton onClick={zoomOut} label="Zoom out">
                    <ZoomOut size={14} color={C.navySoft} />
                  </IconButton>

                  <IconButton onClick={resetView} label="Reset view">
                    <RotateCcw size={13} color={C.navySoft} />
                  </IconButton>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                {(Object.keys(METRICS) as MetricKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMetric(key)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1px solid ${metric === key ? C.teal : C.border}`,
                      background: metric === key ? C.tealTint : C.white,
                      color: metric === key ? C.tealDark : C.text,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: F.body,
                    }}
                  >
                    {METRICS[key].shortLabel}
                  </button>
                ))}
              </div>

              <div
                style={{
                  position: "relative",
                  flex: 1,
                  minHeight: 380,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: C.bgSection,
                }}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    center: MAP_CENTER,
                    scale: MAP_SCALE,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    minZoom={1}
                    maxZoom={6}
                    onMoveEnd={(pos: {
                      coordinates: [number, number];
                      zoom: number;
                    }) => setPosition(pos)}
                  >
                    <Geographies geography={KARNATAKA_GEO_URL}>
                      {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo) => {
                          const rawName = extractRawGeoName(geo.properties);

                          const matched = resolveDistrictName(rawName);

                          const stats = matched
                            ? statsByName.get(matched)
                            : null;

                          const fill = stats
                            ? magnitudeColor(magnitude(stats))
                            : C.border;

                          const isSelected =
                            matched !== null && matched === selectedDistrict;

                          const isHovered =
                            matched !== null && matched === hoveredDistrict;

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={(evt: any) => {
                                setHoveredDistrict(matched);

                                setTooltip({
                                  x: evt.clientX,
                                  y: evt.clientY,
                                  name: matched || rawName || "Unmapped area",
                                });
                              }}
                              onMouseMove={(evt: any) => {
                                setTooltip((current) =>
                                  current
                                    ? {
                                        ...current,
                                        x: evt.clientX,
                                        y: evt.clientY,
                                      }
                                    : current,
                                );
                              }}
                              onMouseLeave={() => {
                                setHoveredDistrict(null);

                                setTooltip(null);
                              }}
                              onClick={() =>
                                matched && setSelectedDistrict(matched)
                              }
                              style={{
                                default: {
                                  fill,
                                  stroke: isSelected ? C.tealDark : C.white,
                                  strokeWidth: isSelected ? 1.8 : 0.7,
                                  outline: "none",
                                  cursor: matched ? "pointer" : "default",
                                  filter: isHovered
                                    ? "brightness(1.06)"
                                    : "none",
                                  transition:
                                    "fill 0.4s ease, filter 0.15s ease",
                                },

                                hover: {
                                  fill,
                                  stroke: C.teal,
                                  strokeWidth: 1.4,
                                  outline: "none",
                                },

                                pressed: {
                                  fill,
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {DIVISIONS.map((division) => (
                      <Marker
                        key={division}
                        coordinates={DIVISION_HQ[division]}
                      >
                        <circle
                          r={3}
                          fill={C.navy}
                          stroke={C.white}
                          strokeWidth={1}
                        />

                        <text
                          textAnchor="middle"
                          y={-8}
                          style={{
                            fontFamily: F.body,
                            fontSize: 7,
                            fontWeight: 600,
                            fill: C.navy,
                          }}
                        >
                          {division}
                        </text>
                      </Marker>
                    ))}
                  </ZoomableGroup>
                </ComposableMap>

                {tooltip && (
                  <div
                    style={{
                      position: "fixed",
                      left: tooltip.x + 12,
                      top: tooltip.y + 12,
                      zIndex: 100,
                      pointerEvents: "none",
                      background: C.navy,
                      color: C.white,
                      padding: "7px 10px",
                      borderRadius: 6,
                      fontFamily: F.body,
                      fontSize: 11,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    {tooltip.name}
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 10,
                    fontFamily: F.body,
                    fontSize: 9.5,
                    color: C.muted,
                  }}
                >
                  Illustrative projection · not to survey scale
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: 10.5,
                    color: C.text,
                    fontWeight: 600,
                  }}
                >
                  Lower
                </span>

                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${C.tealTint}, ${C.tealDark})`,
                  }}
                />

                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: 10.5,
                    color: C.text,
                    fontWeight: 600,
                  }}
                >
                  Higher
                </span>
              </div>
            </div>

            {/* =================================================
                SIDE COLUMN
            ================================================= */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Panel>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  <Search size={14} color={C.muted} />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search a district…"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: 13,
                      fontFamily: F.body,
                      color: C.navy,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {(["All", ...DIVISIONS] as (Division | "All")[]).map(
                    (division) => (
                      <button
                        key={division}
                        type="button"
                        onClick={() => setDivisionFilter(division)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          border: `1px solid ${
                            divisionFilter === division ? C.teal : C.border
                          }`,
                          background:
                            divisionFilter === division ? C.tealTint : C.white,
                          color:
                            divisionFilter === division ? C.tealDark : C.text,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: F.body,
                        }}
                      >
                        {division}
                      </button>
                    ),
                  )}
                </div>
              </Panel>

              {selectedStats ? (
                <DistrictDetail
                  stats={selectedStats}
                  onClose={() => setSelectedDistrict(null)}
                  metric={metric}
                />
              ) : (
                <Panel>
                  <PanelTitle icon={<Info size={14} color={C.teal} />}>
                    How Karnataka Police is organized
                  </PanelTitle>

                  <ol
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {[
                      [
                        "State",
                        "Director General of Police (DGP), headquartered in Bengaluru",
                      ],
                      [
                        "Division",
                        "4 divisions — Bengaluru, Mysuru, Belagavi, Kalaburagi",
                      ],
                      [
                        "District",
                        "31 districts, each led by a Superintendent or Commissioner",
                      ],
                      [
                        "Police station",
                        "The local unit citizens interact with directly",
                      ],
                    ].map(([tier, description], index) => (
                      <li
                        key={tier}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: C.tealTint,
                            color: C.tealDark,
                            fontFamily: F.head,
                            fontSize: 11,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </span>

                        <div>
                          <div
                            style={{
                              fontFamily: F.head,
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.navy,
                            }}
                          >
                            {tier}
                          </div>

                          <div
                            style={{
                              fontFamily: F.body,
                              fontSize: 12,
                              color: C.text,
                              lineHeight: 1.5,
                            }}
                          >
                            {description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Panel>
              )}

              <Panel>
                <PanelTitle icon={<Building2 size={14} color={C.teal} />}>
                  District directory
                </PanelTitle>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                >
                  {directoryList.map((district) => (
                    <button
                      key={district.name}
                      type="button"
                      onClick={() => setSelectedDistrict(district.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 10px",
                        borderRadius: 8,
                        border: `1px solid ${
                          selectedDistrict === district.name ? C.teal : C.border
                        }`,
                        background:
                          selectedDistrict === district.name
                            ? C.tealTint
                            : C.bgSection,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontFamily: F.body,
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: C.navy,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {district.name}
                      </span>

                      <span
                        style={{
                          fontFamily: F.body,
                          fontSize: 11.5,
                          color: C.text,
                        }}
                      >
                        {metricConfig.format(metricConfig.get(district))}
                      </span>

                      <ChevronRight size={14} color={C.muted} />
                    </button>
                  ))}

                  {directoryList.length === 0 && (
                    <div
                      style={{
                        padding: "16px 4px",
                        fontSize: 12,
                        color: C.muted,
                        textAlign: "center",
                        fontFamily: F.body,
                      }}
                    >
                      No districts match this search.
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          </div>

          <div
            style={{
              fontFamily: F.body,
              fontSize: 11,
              color: C.muted,
              lineHeight: 1.6,
              marginTop: 24,
              maxWidth: 760,
            }}
          >
            <Info
              size={12}
              color={C.muted}
              style={{
                marginRight: 6,
                verticalAlign: -2,
              }}
            />
            Figures shown are illustrative estimates for demonstration purposes
            and do not represent verified government statistics.
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   SUBCOMPONENTS
========================================================= */

function StatCard({
  icon,
  bg,
  value,
  label,
  last,
}: {
  icon: React.ReactNode;
  bg: string;
  value: string;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "26px 30px",
        borderRight: last ? "none" : `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 24,
            fontWeight: 600,
            color: C.navy,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.text,
            marginTop: 2,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        border: `1px solid ${C.border}`,
        background: C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 18,
      }}
    >
      {children}
    </div>
  );
}

function PanelTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: F.head,
        fontSize: 13.5,
        fontWeight: 600,
        color: C.navy,
        marginBottom: 12,
      }}
    >
      {icon}
      {children}
    </div>
  );
}

function DistrictDetail({
  stats,
  onClose,
  metric,
}: {
  stats: DistrictStats;
  onClose: () => void;
  metric: MetricKey;
}) {
  return (
    <Panel>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <PanelTitle icon={<MapPin size={14} color={C.teal} />}>
          {stats.name}
        </PanelTitle>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close district detail"
          style={{
            border: "none",
            background: "transparent",
            fontSize: 20,
            lineHeight: 1,
            color: C.muted,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          fontFamily: F.body,
          fontSize: 10.5,
          fontWeight: 700,
          color: C.tealDark,
          letterSpacing: "0.05em",
          marginBottom: 14,
        }}
      >
        {stats.division.toUpperCase()} DIVISION
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <DetailCell
          icon={<Users size={13} color={C.muted} />}
          label="Population"
          value={`${stats.populationLakh.toFixed(1)} L`}
        />

        <DetailCell
          icon={<Building2 size={13} color={C.muted} />}
          label="Stations"
          value={`${stats.policeStations}`}
        />

        <DetailCell
          icon={<ShieldCheck size={13} color={C.muted} />}
          label="Officers"
          value={stats.officerStrength.toLocaleString("en-IN")}
        />

        <DetailCell
          icon={<Clock size={13} color={C.muted} />}
          label="Response"
          value={`${stats.avgResponseTime.toFixed(1)} min`}
        />
      </div>

      <Sparkline data={stats.serviceTrend} />

      <div
        style={{
          fontFamily: F.body,
          fontSize: 10,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 700,
          marginTop: 10,
          marginBottom: 8,
        }}
      >
        Most requested services
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {stats.topServices.map((service) => (
          <div key={service.name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: F.body,
                fontSize: 11.5,
                color: C.navySoft,
                marginBottom: 3,
                fontWeight: 600,
              }}
            >
              <span>{service.name}</span>

              <span>{service.share}%</span>
            </div>

            <div
              style={{
                height: 6,
                borderRadius: 4,
                background: C.bgSection,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 4,
                  width: `${service.share}%`,
                  background: `linear-gradient(90deg, ${C.teal}, ${C.tealDark})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: F.body,
          fontSize: 11,
          color: C.muted,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Currently shaded by{" "}
        <strong
          style={{
            color: C.navySoft,
          }}
        >
          {METRICS[metric].label}
        </strong>{" "}
        on the map
        <ArrowRight size={12} color={C.muted} />
      </div>
    </Panel>
  );
}

function DetailCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: C.bgSection,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: F.body,
          fontSize: 9.5,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 3,
        }}
      >
        {icon}
        {label}
      </div>

      <div
        style={{
          fontFamily: F.head,
          fontSize: 13,
          fontWeight: 700,
          color: C.navy,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const width = 260;
  const height = 56;
  const padding = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);

    const y =
      height - padding - ((value - min) / range) * (height - padding * 2);

    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;

  const areaPath = `${linePath} L${
    width - padding
  },${height} L${padding},${height} Z`;

  return (
    <div
      style={{
        margin: "4px 0 10px",
      }}
    >
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="districtSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity={0.35} />

            <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#districtSparkGrad)" stroke="none" />

        <path
          d={linePath}
          fill="none"
          stroke={C.tealDark}
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          fontFamily: F.body,
          fontSize: 9.5,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginTop: 2,
        }}
      >
        Citizen service requests, last 12 months
      </div>
    </div>
  );
}
