import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

/* =========================================================
   INTERFACES & TYPES
========================================================= */

export interface DashboardData {
  total_firs: number;
  districts: number;
  stations: number;
  high_risk_zones: number;
}

export interface Hotspot {
  zone: string;
  district: string;
  crime_count: number;
  risk: string;
  lat: number;
  lng: number;
}

export interface CrimeBreakdown {
  crime: string;
  count: number;
}

export interface ZoneData {
  zone: string;
  district: string;
  crime_count: number;
  risk: string;
  risk_score: number;
  peak_time: string;
  common_weather: string;
  crime_breakdown: CrimeBreakdown[];
}

export interface AIReport {
  zone: string;
  report: string;
}

export interface ExpectedCrime {
  crime: string;
  probability: number;
}

export interface CrimeForecastResponse {
  station: string;
  forecast_risk: string;
  confidence: number;
  forecast_period: string;
  expected_crimes: ExpectedCrime[];
  reasons: string[];
  recommended_actions: string[];
}

export interface CrimePattern {
  title: string;
  crime_type: string;
  peak_time: string;
  peak_day?: string;
  confidence: number;
}

export interface CrimePatternsResponse {
  station: string;
  patterns: CrimePattern[];
}

export interface AnomalyItem {
  crime: string;
  type: string;
  change_percent: number;
  severity: string;
  reason: string;
}

export interface AnomalyResponse {
  station: string;
  anomalies: AnomalyItem[];
}

export interface PatternSummaryResponse {
  station: string;
  summary: string;
}

/* =========================================================
   API CALLERS WITH CONTRACT FALLBACKS
========================================================= */

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const res = await axios.get(`${API_BASE}/dashboard`);
    return res.data;
  } catch (err) {
    return {
      total_firs: 7500,
      districts: 10,
      stations: 20,
      high_risk_zones: 4,
    };
  }
};

export const getHotspots = async (): Promise<Hotspot[]> => {
  try {
    const res = await axios.get(`${API_BASE}/hotspots`);
    return res.data;
  } catch (err) {
    return [
      { zone: "Ashok Nagar PS", district: "Kalaburagi", crime_count: 673, risk: "Medium", lat: 17.3297, lng: 76.8343 },
      { zone: "Brucepet PS", district: "Ballari", crime_count: 512, risk: "Low", lat: 15.1394, lng: 76.9214 },
      { zone: "Doddapete PS", district: "Shivamogga", crime_count: 489, risk: "Low", lat: 13.9299, lng: 75.5681 },
      { zone: "Electronic City PS", district: "Bengaluru", crime_count: 890, risk: "High", lat: 12.8452, lng: 77.6602 },
      { zone: "Vidyagiri PS", district: "Bagalkote", crime_count: 340, risk: "Low", lat: 16.1852, lng: 75.6961 },
      { zone: "Whitefield PS", district: "Bengaluru", crime_count: 945, risk: "High", lat: 12.9698, lng: 77.7499 },
      { zone: "Hubballi Town PS", district: "Hubballi", crime_count: 610, risk: "Medium", lat: 15.3647, lng: 75.124 },
      { zone: "Indiranagar PS", district: "Bengaluru", crime_count: 820, risk: "High", lat: 12.9784, lng: 77.6408 },
    ];
  }
};

export const getZone = async (station: string): Promise<ZoneData> => {
  try {
    const res = await axios.get(`${API_BASE}/zone/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      zone: station,
      district: station.includes("Bengaluru") ? "Bengaluru" : "Karnataka",
      crime_count: 673,
      risk: "Medium",
      risk_score: 60,
      peak_time: "Night",
      common_weather: "Cloudy",
      crime_breakdown: [
        { crime: "UPI Fraud", count: 73 },
        { crime: "Chain Snatching", count: 70 },
        { crime: "Drug Distribution", count: 67 },
        { crime: "Vehicle Theft", count: 65 },
        { crime: "House Burglary", count: 61 },
        { crime: "Missing Person", count: 61 },
        { crime: "Fatal Accident", count: 60 },
        { crime: "ATM Skimming", count: 59 },
        { crime: "Jewellery Theft", count: 58 },
        { crime: "Courier Scam", count: 52 },
        { crime: "Loan App Fraud", count: 47 },
      ],
    };
  }
};

export const getForecast = async (station: string): Promise<CrimeForecastResponse> => {
  try {
    const res = await axios.get(`${API_BASE}/forecast/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      station,
      forecast_risk: "HIGH",
      confidence: 87,
      forecast_period: "Next 7 Days",
      expected_crimes: [
        { crime: "UPI Fraud", probability: 84 },
        { crime: "Chain Snatching", probability: 78 },
        { crime: "Vehicle Theft", probability: 65 },
      ],
      reasons: [
        "Historical increase during festival season",
        "Weekend footfall expected to be elevated",
        "Recent rise in digital financial transactions",
      ],
      recommended_actions: [
        "Deploy 2 extra patrols in commercial areas",
        "Issue public warning for cyber-awareness",
        "Increase CCTV monitoring at night",
      ],
    };
  }
};

export const getPatterns = async (station: string): Promise<CrimePatternsResponse> => {
  try {
    const res = await axios.get(`${API_BASE}/patterns/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      station,
      patterns: [
        {
          title: "Weekend Night Theft Spike",
          crime_type: "Theft",
          peak_time: "22:00 - 03:00",
          peak_day: "Saturday",
          confidence: 89,
        },
        {
          title: "Peak Hour Cyber / UPI Fraud",
          crime_type: "Cyber Crime",
          peak_time: "14:00 - 18:00",
          peak_day: "Weekday",
          confidence: 82,
        },
      ],
    };
  }
};

export const getAnomalies = async (station: string): Promise<AnomalyResponse> => {
  try {
    const res = await axios.get(`${API_BASE}/anomalies/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      station,
      anomalies: [
        {
          crime: "UPI Fraud",
          type: "Spike",
          change_percent: 46,
          severity: "HIGH",
          reason: "46% spike vs historical 30-day baseline",
        },
        {
          crime: "Vehicle Theft",
          type: "Drop",
          change_percent: -22,
          severity: "LOW",
          reason: "22% reduction following nocturnal checkpoint patrols",
        },
      ],
    };
  }
};

export const getPatternSummary = async (station: string): Promise<PatternSummaryResponse> => {
  try {
    const res = await axios.get(`${API_BASE}/pattern-summary/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      station,
      summary: `${station} shows a recurring theft pattern during weekends and an expected increase over the next week due to festival activity. The anomaly detector also identified a 46% spike in UPI fraud compared to the historical baseline. Increased evening patrols are recommended.`,
    };
  }
};

export const getAISummary = async (station: string): Promise<AIReport> => {
  try {
    const res = await axios.get(`${API_BASE}/ai-summary/${encodeURIComponent(station)}`);
    return res.data;
  } catch (err) {
    return {
      zone: station,
      report: `## CRIME SUMMARY\nThe ${station} area in Karnataka has reported a total of 673 crimes, with UPI Fraud being the most prevalent crime, accounting for 73 incidents. The overall risk level is medium with a score of 60.\n\n## EVIDENCE\nThe crime analytics data reveals a diverse range of crimes including UPI Fraud, Chain Snatching, Drug Distribution, and Vehicle Theft. Data shows crimes tend to peak at night.\n\n## PATTERN ANALYSIS\nThe patterns in crime data indicate that most crimes occur at night, with a notable concentration around high footfall commercial zones.\n\n## RISK ASSESSMENT\nThe overall risk level is classified as Medium (60/100). Target patrols and enhanced digital surveillance are recommended.`,
    };
  }
};
