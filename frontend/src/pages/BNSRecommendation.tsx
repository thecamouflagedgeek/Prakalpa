// BNSRecommendation.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:8000/api/v1";

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

    pageTitle: "BNS Section Recommendation",
    pageSubtitle: "AI-assisted mapping to Bharatiya Nyaya Sanhita, 2023",

    selectExistingCase: "Select existing case",
    pasteIncidentText: "Paste incident text",

    searchPlaceholder: "Search by Complaint ID, name, or incident type...",

    loadingCases: "Loading cases...",
    noMatchingCases: "No matching cases found.",
    incidentDescriptionPreview: "Incident Description Preview",
    noDescription: "No description on file for this case.",

    pastePlaceholder: "Paste or type the incident description here...",

    analysingBNS: "Analysing against BNS corpus...",
    analyzeRecommend: "Analyze & Recommend Sections",

    suggestedBNS: "Suggested BNS Provisions",
    decisionSupport: "Decision-support only · Officer verification required",

    analysingFIR: "Analysing FIR against BNS corpus…",

    retry: "Retry",

    selectCaseInstruction:
      "Select a case or paste an incident description, then run the analysis to see recommended sections here.",

    noRelevantProvisions: "No sufficiently relevant BNS provisions identified.",

    whySuggested: "WHY SUGGESTED",
    cognizable: "COGNIZABLE",
    bail: "BAIL",

    viewClassification: "View full classification",
    viewClassifications: "View full classifications",

    punishment: "Punishment",
    triableBy: "Triable By",
    bailable: "Bailable",

    variesBySubsection: "Varies by subsection",

    unableToReach:
      "Unable to reach the legal recommendation service. Please try again.",

    match: "match",

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

    pageTitle: "ಬಿಎನ್‌ಎಸ್ ವಿಭಾಗ ಶಿಫಾರಸು",
    pageSubtitle: "ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ, 2023 ಗೆ ಎಐ ಸಹಾಯಿತ ಹೊಂದಾಣಿಕೆ",

    selectExistingCase: "ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪ್ರಕರಣ ಆಯ್ಕೆಮಾಡಿ",
    pasteIncidentText: "ಘಟನೆಯ ಪಠ್ಯವನ್ನು ಅಂಟಿಸಿ",

    searchPlaceholder: "ದೂರು ಸಂಖ್ಯೆ, ಹೆಸರು ಅಥವಾ ಘಟನೆಯ ಮಾದರಿಯಿಂದ ಹುಡುಕಿ...",

    loadingCases: "ಪ್ರಕರಣಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    noMatchingCases: "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಪ್ರಕರಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    incidentDescriptionPreview: "ಘಟನೆಯ ವಿವರಣೆ ಪೂರ್ವವೀಕ್ಷಣೆ",
    noDescription: "ಈ ಪ್ರಕರಣಕ್ಕೆ ಯಾವುದೇ ವಿವರಣೆ ಲಭ್ಯವಿಲ್ಲ.",

    pastePlaceholder: "ಘಟನೆಯ ವಿವರಣೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಅಂಟಿಸಿ...",

    analysingBNS: "ಬಿಎನ್‌ಎಸ್ ದಾಖಲೆಗಳ ವಿರುದ್ಧ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    analyzeRecommend: "ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ವಿಭಾಗಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಿ",

    suggestedBNS: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಬಿಎನ್‌ಎಸ್ ವಿಧಿಗಳು",
    decisionSupport: "ನಿರ್ಧಾರ ಸಹಾಯ ಮಾತ್ರ · ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ",

    analysingFIR: "ಬಿಎನ್‌ಎಸ್ ದಾಖಲೆಗಳ ವಿರುದ್ಧ ಎಫ್‌ಐಆರ್ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…",

    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",

    selectCaseInstruction:
      "ಪ್ರಕರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಘಟನೆಯ ವಿವರಣೆಯನ್ನು ನಮೂದಿಸಿ. ನಂತರ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿದಾಗ ಶಿಫಾರಸು ಮಾಡಲಾದ ವಿಭಾಗಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",

    noRelevantProvisions: "ಸಾಕಷ್ಟು ಸಂಬಂಧಿತ ಬಿಎನ್‌ಎಸ್ ವಿಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    whySuggested: "ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    cognizable: "ಕಾಗ್ನಿಜಬಲ್",
    bail: "ಜಾಮೀನು",

    viewClassification: "ಸಂಪೂರ್ಣ ವರ್ಗೀಕರಣವನ್ನು ವೀಕ್ಷಿಸಿ",
    viewClassifications: "ಸಂಪೂರ್ಣ ವರ್ಗೀಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ",

    punishment: "ಶಿಕ್ಷೆ",
    triableBy: "ವಿಚಾರಣೆ ನಡೆಸುವವರು",
    bailable: "ಜಾಮೀನಿಗೆ ಅರ್ಹ",

    variesBySubsection: "ಉಪವಿಭಾಗದ ಪ್ರಕಾರ ಬದಲಾಗುತ್ತದೆ",

    unableToReach:
      "ಕಾನೂನು ಶಿಫಾರಸು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",

    match: "ಹೊಂದಾಣಿಕೆ",

    language: "English",
  },
} as const;

interface LegalClassification {
  schedule_section: string;
  offence: string;
  punishment: string;
  cognizable: string;
  bailable: string;
  triable_by: string;
}

interface LegalRecommendation {
  code: string;
  section: string;
  title: string;
  why_it_applies: string;
  classifications: LegalClassification[];
  retrieval_score?: number;
}

interface RecommendResponse {
  recommendations: LegalRecommendation[];
  disclaimer?: string;
  error?: string;
}

interface Complaint {
  complaint_id: string;
  citizen_name: string;
  incident_type?: string;
  incident_description?: string;
  status: string;
}

type InputMode = "case" | "freetext";

// ---------- Component ----------

export default function BNSRecommendation() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<InputMode>("case");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);
  const [freeText, setFreeText] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "kn">("en");

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((previous) => (previous === "en" ? "kn" : "en"));
  };

  const officerName = user?.name || "Unknown Officer";
  const officerBadge = user?.badge || "";

  useEffect(() => {
    setLoadingCases(true);
    axios
      .get(`${API_BASE}/complaints/all`)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Failed to load complaints:", err))
      .finally(() => setLoadingCases(false));
  }, []);

  const filteredComplaints = useMemo(() => {
    if (!search.trim()) return complaints;
    const q = search.toLowerCase();
    return complaints.filter(
      (c) =>
        c.complaint_id.toLowerCase().includes(q) ||
        (c.citizen_name || "").toLowerCase().includes(q) ||
        (c.incident_type || "").toLowerCase().includes(q),
    );
  }, [complaints, search]);

  const activeDescription =
    mode === "case" ? selectedCase?.incident_description || "" : freeText;

  const handleAnalyze = async () => {
    if (!activeDescription.trim()) return;

    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API_BASE}/legal/recommend`, {
        incident_description: activeDescription,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      console.error("Legal recommendation error:", err);
      setError(t.unableToReach);
    } finally {
      setAnalyzing(false);
    }
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
              path: "/explain",
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
              style={S.navItem(item.key === "cases")}
            >
              <NavIcon
                name={item.icon}
                color={
                  item.key === "cases" ? "#FFFFFF" : "rgba(255,255,255,0.55)"
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
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>{t.pageTitle}</div>
            <div style={S.topbarSub}>{t.pageSubtitle}</div>
          </div>
          <div style={S.officerChipRow}>
            {/* ---- Language Toggle Button ---- */}
            <button onClick={toggleLanguage} type="button" style={S.langBtn}>
              <GlobeIcon size={13} color={TEAL} />
              {t.language}
            </button>

            <span style={S.officerBadge}>{officerBadge}</span>
            <span style={S.officerName}>{officerName}</span>
          </div>
        </div>

        <div style={S.body}>
          {/* ---------- Input panel ---------- */}
          <div style={S.inputPanel}>
            <div style={S.modeToggle}>
              <button
                style={S.modeBtn(mode === "case")}
                onClick={() => {
                  setMode("case");
                  setResult(null);
                  setError("");
                }}
              >
                {t.selectExistingCase}
              </button>
              <button
                style={S.modeBtn(mode === "freetext")}
                onClick={() => {
                  setMode("freetext");
                  setResult(null);
                  setError("");
                }}
              >
                {t.pasteIncidentText}
              </button>
            </div>

            {mode === "case" ? (
              <>
                <input
                  style={S.searchInput}
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loadingCases ? (
                  <div style={S.emptyState}>{t.loadingCases}</div>
                ) : filteredComplaints.length === 0 ? (
                  <div style={S.emptyState}>{t.noMatchingCases}</div>
                ) : (
                  <div style={S.caseList}>
                    {filteredComplaints.map((c) => (
                      <button
                        key={c.complaint_id}
                        style={S.caseRow(
                          selectedCase?.complaint_id === c.complaint_id,
                        )}
                        onClick={() => {
                          setSelectedCase(c);
                          setResult(null);
                          setError("");
                        }}
                      >
                        <div>
                          <span style={S.idChip}>{c.complaint_id}</span>
                          <div style={S.caseName}>{c.citizen_name}</div>
                        </div>
                        <span style={S.caseMeta}>{c.incident_type || "—"}</span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedCase && (
                  <div style={S.previewBox}>
                    <div style={S.previewLabel}>
                      {t.incidentDescriptionPreview}
                    </div>
                    <p style={S.previewText}>
                      {selectedCase.incident_description || t.noDescription}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <textarea
                style={S.freeTextArea}
                placeholder={t.pastePlaceholder}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={10}
              />
            )}

            <button
              style={{
                ...S.analyzeBtn,
                opacity: activeDescription.trim() && !analyzing ? 1 : 0.5,
              }}
              disabled={!activeDescription.trim() || analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? t.analysingBNS : t.analyzeRecommend}
            </button>
          </div>

          {/* ---------- Results panel ---------- */}
          <div style={S.resultsPanel}>
            <div style={S.resultsHeader}>
              <div style={S.resultsTitle}>{t.suggestedBNS}</div>
              <div style={S.aiBadge}>AI</div>
            </div>

            <div style={S.disclaimer}>{t.decisionSupport}</div>

            {analyzing && (
              <div style={S.loadingState}>
                <div style={S.spinner} />
                {t.analysingFIR}
              </div>
            )}

            {!analyzing && error && (
              <div style={S.errorBox}>
                {error}
                <button style={S.retryBtn} onClick={handleAnalyze}>
                  {t.retry}
                </button>
              </div>
            )}

            {!analyzing && !error && !result && (
              <div style={S.emptyResultState}>{t.selectCaseInstruction}</div>
            )}

            {!analyzing &&
              !error &&
              result &&
              result.recommendations.length === 0 && (
                <div style={S.emptyResultState}>{t.noRelevantProvisions}</div>
              )}

            {!analyzing &&
              !error &&
              result &&
              result.recommendations.map((rec, index) => {
                const classifications = rec.classifications || [];
                const cognizableValues = [
                  ...new Set(classifications.map((c) => c.cognizable)),
                ];
                const bailableValues = [
                  ...new Set(classifications.map((c) => c.bailable)),
                ];

                const cognizable =
                  cognizableValues.length === 1
                    ? cognizableValues[0]
                    : t.variesBySubsection;
                const bailable =
                  bailableValues.length === 1
                    ? bailableValues[0]
                    : t.variesBySubsection;

                return (
                  <div key={`${rec.section}-${index}`} style={S.recCard}>
                    <div style={S.recCardTop}>
                      <div>
                        <div style={S.sectionNumber}>
                          {rec.code} § {rec.section}
                        </div>
                        <div style={S.sectionTitle}>{rec.title}</div>
                      </div>
                      <div style={S.rankBadgeGroup}>
                        <span style={S.rankBadge}>#{index + 1}</span>
                        {typeof rec.retrieval_score === "number" && (
                          <span style={S.scoreBadge}>
                            {t.match} {(rec.retrieval_score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={S.whyLabel}>{t.whySuggested}</div>
                    <p style={S.whyText}>{rec.why_it_applies}</p>

                    <div style={S.metaGrid}>
                      <div style={S.metaItem}>
                        <span style={S.metaLabel}>{t.cognizable}</span>
                        <span style={S.metaValue}>{cognizable}</span>
                      </div>
                      <div style={S.metaItem}>
                        <span style={S.metaLabel}>{t.bail}</span>
                        <span style={S.metaValue}>{bailable}</span>
                      </div>
                    </div>

                    {classifications.length > 0 && (
                      <details style={S.detailsBlock}>
                        <summary style={S.detailsSummary}>
                          {classifications.length > 1
                            ? t.viewClassifications
                            : t.viewClassification}{" "}
                          ({classifications.length})
                        </summary>
                        <div style={S.classTable}>
                          {classifications.map((cl, ci) => (
                            <div key={ci} style={S.classRow}>
                              <div style={S.classRowHeader}>
                                {cl.schedule_section} — {cl.offence}
                              </div>
                              <div style={S.classRowGrid}>
                                <div>
                                  <span style={S.classLabel}>
                                    {t.punishment}
                                  </span>
                                  <span style={S.classValue}>
                                    {cl.punishment}
                                  </span>
                                </div>
                                <div>
                                  <span style={S.classLabel}>
                                    {t.cognizable}
                                  </span>
                                  <span style={S.classValue}>
                                    {cl.cognizable}
                                  </span>
                                </div>
                                <div>
                                  <span style={S.classLabel}>{t.bailable}</span>
                                  <span style={S.classValue}>
                                    {cl.bailable}
                                  </span>
                                </div>
                                <div>
                                  <span style={S.classLabel}>
                                    {t.triableBy}
                                  </span>
                                  <span style={S.classValue}>
                                    {cl.triable_by}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}

            {result?.disclaimer && (
              <div style={S.finalDisclaimer}>{result.disclaimer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Icons ----------

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

// ---------- Styles ----------

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
const GREEN = "#1F7A5C";

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
    display: "grid",
    gridTemplateColumns: "minmax(360px, 0.9fr) minmax(440px, 1.2fr)",
    gap: 20,
    padding: "24px 32px",
    minHeight: 0,
    overflow: "hidden",
  } as React.CSSProperties,

  inputPanel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflowY: "auto",
  } as React.CSSProperties,

  modeToggle: {
    display: "flex",
    gap: 8,
    marginBottom: 4,
  } as React.CSSProperties,
  modeBtn: (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${active ? TEAL : BORDER}`,
    background: active ? TEAL_TINT : "#FFFFFF",
    color: active ? TEAL_DARK : TEXT,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  }),

  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: "#374151",
  } as React.CSSProperties,

  emptyState: {
    padding: 24,
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 13,
  } as React.CSSProperties,

  caseList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: "280px",
    overflowY: "auto",
  } as React.CSSProperties,
  caseRow: (active: boolean): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    border: `1px solid ${active ? TEAL : BORDER}`,
    borderRadius: 8,
    background: active ? TEAL_TINT : BG_SECTION,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
  }),
  caseName: { fontSize: 12, color: TEXT, marginTop: 4 } as React.CSSProperties,
  caseMeta: { fontSize: 12, color: TEXT } as React.CSSProperties,
  idChip: {
    fontSize: 11,
    fontWeight: 700,
    color: TEAL_DARK,
    background: TEAL_TINT,
    padding: "3px 8px",
    borderRadius: 5,
    letterSpacing: "0.03em",
  } as React.CSSProperties,

  previewBox: {
    background: "#F8FAFB",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: 14,
  } as React.CSSProperties,
  previewLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: MUTED,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 6,
  } as React.CSSProperties,
  previewText: {
    fontSize: 12.5,
    lineHeight: 1.6,
    color: NAVY_SOFT,
    margin: 0,
  } as React.CSSProperties,

  freeTextArea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: "#374151",
    lineHeight: 1.6,
    resize: "vertical" as const,
  } as React.CSSProperties,

  analyzeBtn: {
    marginTop: "auto",
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    background: TEAL,
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  resultsPanel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 24,
    overflowY: "auto",
  } as React.CSSProperties,

  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  } as React.CSSProperties,
  resultsTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  aiBadge: {
    background: NAVY,
    color: "#FFFFFF",
    padding: "4px 7px",
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 700,
  } as React.CSSProperties,

  disclaimer: {
    fontSize: 10.5,
    color: MUTED,
    background: "#F8FAFB",
    border: `1px dashed ${BORDER}`,
    borderRadius: 7,
    padding: "8px 9px",
    marginBottom: 16,
    lineHeight: 1.5,
  } as React.CSSProperties,

  loadingState: {
    padding: "40px 5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    color: MUTED,
    fontSize: 12,
    textAlign: "center" as const,
  } as React.CSSProperties,

  spinner: {
    width: 22,
    height: 22,
    border: `2px solid ${TEAL_TINT}`,
    borderTop: `2px solid ${TEAL}`,
    borderRadius: "50%",
    animation: "bnsSpin .8s linear infinite",
  } as React.CSSProperties,

  errorBox: {
    padding: 14,
    background: "#FBEBEA",
    color: RED,
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 14,
    borderRadius: 8,
  } as React.CSSProperties,
  retryBtn: {
    display: "block",
    marginTop: 8,
    border: `1px solid ${RED}`,
    background: "transparent",
    color: RED,
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 600,
  } as React.CSSProperties,

  emptyResultState: {
    padding: "40px 10px",
    color: MUTED,
    fontSize: 12.5,
    lineHeight: 1.6,
    textAlign: "center" as const,
  } as React.CSSProperties,

  recCard: {
    border: `1px solid ${BORDER}`,
    borderLeft: `3px solid ${TEAL}`,
    background: "#F8FAFB",
    padding: 16,
    marginBottom: 14,
    borderRadius: "3px 12px 12px 3px",
  } as React.CSSProperties,

  recCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  } as React.CSSProperties,
  sectionNumber: {
    color: TEAL_DARK,
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 3,
  } as React.CSSProperties,
  sectionTitle: {
    color: NAVY,
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 700,
  } as React.CSSProperties,
  rankBadgeGroup: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: 4,
  } as React.CSSProperties,
  rankBadge: {
    color: TEAL,
    fontSize: 11,
    fontWeight: 700,
  } as React.CSSProperties,
  scoreBadge: {
    fontSize: 9.5,
    color: MUTED,
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    padding: "2px 6px",
    borderRadius: 10,
  } as React.CSSProperties,

  whyLabel: {
    fontSize: 9.5,
    letterSpacing: "0.08em",
    color: MUTED,
    fontWeight: 700,
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  whyText: {
    fontSize: 12.5,
    lineHeight: 1.6,
    color: NAVY_SOFT,
    margin: "6px 0 12px",
  } as React.CSSProperties,

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 12,
  } as React.CSSProperties,
  metaItem: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    padding: 9,
    borderRadius: 7,
  } as React.CSSProperties,
  metaLabel: {
    display: "block",
    fontSize: 8.5,
    color: MUTED,
    letterSpacing: "0.06em",
    marginBottom: 3,
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  metaValue: {
    display: "block",
    fontSize: 11.5,
    fontWeight: 700,
    color: NAVY,
    lineHeight: 1.3,
  } as React.CSSProperties,

  detailsBlock: { marginTop: 6 } as React.CSSProperties,
  detailsSummary: {
    fontSize: 11.5,
    color: TEAL_DARK,
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none" as const,
  },
  classTable: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  } as React.CSSProperties,
  classRow: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: 10,
  } as React.CSSProperties,
  classRowHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 8,
  } as React.CSSProperties,
  classRowGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  } as React.CSSProperties,
  classLabel: {
    display: "block",
    fontSize: 9,
    color: MUTED,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    marginBottom: 2,
  } as React.CSSProperties,
  classValue: {
    display: "block",
    fontSize: 11.5,
    color: NAVY_SOFT,
    lineHeight: 1.4,
  } as React.CSSProperties,

  finalDisclaimer: {
    marginTop: 6,
    padding: 12,
    background: BG_SECTION,
    borderRadius: 8,
    fontSize: 11,
    color: TEXT,
    lineHeight: 1.5,
    fontStyle: "italic" as const,
  } as React.CSSProperties,
};
