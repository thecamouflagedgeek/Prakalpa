import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import i18n from "i18next";
import {
  initReactI18next,
  useTranslation,
  I18nextProvider,
} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// 1. Define Translation Resources
const resources = {
  en: {
    translation: {
      platformTitle: "INTELLIGENCE PLATFORM",
      newSession: "New FIR Session",
      nav: {
        firLodging: "FIR Lodging",
        aiAnalysis: "AI Analysis",
        crimeHotspots: "Crime Hotspots",
        networkGraph: "Network Graph",
        caseHistory: "Case History",
        legalLibrary: "Legal Library",
      },
      records: {
        header: "STATION RECORDS",
        activeCases: "Active Cases",
        firRegistration: "FIR Registration",
        intelligenceFeed: "Intelligence Feed",
        patrolZones: "Patrol Zones",
      },
      security: {
        channel: "SECURE FIR CHANNEL",
        desc: "Your information is encrypted and audit-logged throughout the registration process.",
        completion: "FIR completion",
      },
      header: {
        kavach: "KAVACH",
        firLodging: "FIR LODGING",
        title: "AI-Assisted FIR Registration",
        translateBtn: "Translate (i18n)",
      },
      content: {
        liveAssistance: "LIVE ASSISTANCE ACTIVE",
        heading: "Tell us what happened.",
        subheading:
          "KAVACH will guide you through each step of your FIR registration.",
        session: "Session",
        progressTitle: "FIR Registration Progress",
        fieldsCollected: "FIELDS COLLECTED",
        completeTitle: "FIR INFORMATION COMPLETE",
        exportPdf: "Export PDF",
        submitFir: "Submit FIR",
      },
      footer: {
        placeholder: "Type your response, KAVACH will handle the rest...",
        attach: "Attach",
        linkCase: "Link case",
        uploadDoc: "Upload document",
        encryptedNotice: "🔒 Encrypted & audit-logged",
      },
    },
  },
  kn: {
    translation: {
      platformTitle: "ಇಂಟೆಲಿಜೆನ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
      newSession: "ಹೊಸ FIR ಸೇಶನ್",
      nav: {
        firLodging: "FIR ನೋಂದಣಿ",
        aiAnalysis: "AI ವಿಶ್ಲೇಷಣೆ",
        crimeHotspots: "ಅಪರಾಧ ಪ್ರದೇಶಗಳು",
        networkGraph: "ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್",
        caseHistory: "ಪ್ರಕರಣದ ಇತಿಹಾಸ",
        legalLibrary: "ಕಾನೂನು ಗ್ರಂಥಾಲಯ",
      },
      records: {
        header: "ಠಾಣೆಯ ದಾಖಲೆಗಳು",
        activeCases: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
        firRegistration: "FIR ನೋಂದಣಿ",
        intelligenceFeed: "ಇಂಟೆಲಿಜೆನ್ಸ್ ಫೀಡ್",
        patrolZones: "ಪ್ಯಾಟ್ರೋಲ್ ವಲಯಗಳು",
      },
      security: {
        channel: "ಸುರಕ್ಷಿತ FIR ಚಾನಲ್",
        desc: "ನೋಂದಣಿ ಪ್ರಕ್ರಿಯೆಯುದ್ದಕ್ಕೂ ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗುತ್ತದೆ ಮತ್ತು ಆಡಿಟ್ ಮಾಡಲಾಗುತ್ತದೆ.",
        completion: "FIR ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ",
      },
      header: {
        kavach: "ಕವಚ",
        firLodging: "FIR ನೋಂದಣಿ",
        title: "AI-ಸಹಾಯಿತ FIR ನೋಂದಣಿ",
        translateBtn: "ಭಾಷಾಂತರಿಸಿ (i18n)",
      },
      content: {
        liveAssistance: "ನೇರ ಸಹಾಯ ಸಕ್ರಿಯವಾಗಿದೆ",
        heading: "ಏನಾಯಿತು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ.",
        subheading:
          "ನಿಮ್ಮ FIR ನೋಂದಣಿಯ ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ KAVACH ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
        session: "ಸೇಶನ್",
        progressTitle: "FIR ನೋಂದಣಿ ಪ್ರಗತಿ",
        fieldsCollected: "ಸಂಗ್ರಹಿಸಿದ ಕ್ಷೇತ್ರಗಳು",
        completeTitle: "FIR ಮಾಹಿತಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
        exportPdf: "PDF ರಫ್ತು ಮಾಡಿ",
        submitFir: "FIR ಸಲ್ಲಿಸಿ",
      },
      footer: {
        placeholder:
          "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ, KAVACH ಬಾಕಿಯನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ...",
        attach: "ಲಗತ್ತಿಸಿ",
        linkCase: "ಪ್ರಕರಣ ಲಿಂಕ್ ಮಾಡಿ",
        uploadDoc: "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        encryptedNotice: "🔒 ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಆಡಿಟ್ ಮಾಡಲಾಗಿದೆ",
      },
    },
  },
};

// 2. Safely Initialize i18n Instance Outside Render Lifecycle
const i18nInstance = i18n.createInstance();
i18nInstance.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  keySeparator: ".",
  interpolation: { escapeValue: false },
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface Progress {
  filled: number;
  total: number;
  percent: number;
  collected_data?: Record<string, string>;
}

// Icon Helper Component
const Icon = ({
  children,
  size = 17,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

// ---------- KAVACH design tokens (shared across pages) ----------
const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";

function FIRLodgingContent() {
  const { t, i18n: currentI18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaskara. I am KAVACH, your AI-assisted FIR registration system. I will guide you through the process step by step. To begin, may I know your full name?",
      timestamp: "Just Now",
    },
  ]);

  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "kn">("en");
  const [progress, setProgress] = useState<Progress>({
    filled: 0,
    total: 11,
    percent: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sessionId = useRef(`FIR-${Date.now().toString().slice(-8)}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "kn" : "en";
    setLanguage(nextLang);
    currentI18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    const userMsg: Message = {
      role: "user",
      content: currentInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/fir/chat", {
        session_id: sessionId.current,
        message: currentInput,
        language,
      });

      const { reply, fir_progress, is_complete } = res.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: "Just Now" },
      ]);
      setProgress(fir_progress);
      setIsComplete(is_complete);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection error. Please ensure the backend server is running.",
          timestamp: "Just Now",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const dm = darkMode;
  const C = {
    navy: NAVY,
    teal: TEAL,
    tealLight: TEAL_TINT,
    tealSoft: TEAL_TINT,
    white: "#ffffff",
    background: dm ? NAVY_DEEP : BG_SECTION,
    sidebar: dm ? "#111b29" : "#ffffff",
    card: dm ? "#172334" : "#ffffff",
    border: dm ? "#263547" : BORDER,
    text: dm ? "#f1f5f9" : NAVY,
    muted: dm ? "#94a3b8" : MUTED,
    softText: dm ? "#aebaca" : TEXT,
  };

  // NOTE: paths below are best-guess placeholders — update to match your
  // actual router config. "AI Analysis" and "Legal Library" are mapped to
  // the Explainable AI and BNS Section Recommender pages since those are
  // the closest existing equivalents.
  const navItems = [
    { label: t("nav.firLodging"), active: true, path: "/officer/fir-lodging" },
    { label: t("nav.aiAnalysis"), active: false, path: "/officer/explain" },
    { label: t("nav.crimeHotspots"), active: false, path: "/dash" },
    {
      label: t("nav.networkGraph"),
      active: false,
      path: "/officer/network-graph",
    },
    {
      label: t("nav.caseHistory"),
      active: false,
      path: "/officer/case-history",
    },
    {
      label: t("nav.legalLibrary"),
      active: false,
      path: "/bns-recommendation",
    },
  ];

  const officerName = user?.name || "Unknown Officer";
  const officerBadge = user?.badge || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        background: C.background,
        color: C.text,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "270px",
          minWidth: "270px",
          minHeight: "100vh",
          background: dm
            ? C.sidebar
            : `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 8px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={17}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </Icon>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              KAVACH
            </div>
            <div
              style={{
                fontSize: "9.5px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.08em",
                marginTop: "2px",
              }}
            >
              {t("platformTitle")}
            </div>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            border: "none",
            background: TEAL,
            color: "#FFFFFF",
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "24px",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 10px 22px rgba(14,140,140,0.25)",
          }}
        >
          <Icon size={16}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </Icon>
          {t("newSession")}
        </button>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              margin: "0 10px 10px",
              textTransform: "uppercase",
            }}
          >
            Platform
          </p>

          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "3px",
                border: "none",
                color: item.active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                background: item.active
                  ? "rgba(14,140,140,0.22)"
                  : "transparent",
                fontSize: "13.5px",
                fontWeight: item.active ? 600 : 500,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: item.active ? TEAL : "rgba(255,255,255,0.35)",
                  flexShrink: 0,
                }}
              />
              {item.label}
            </button>
          ))}

          {/* SECURITY CARD */}
          <div
            style={{
              marginTop: "auto",
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(14,140,140,0.14)",
              border: `1px solid rgba(14,140,140,0.3)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: TEAL,
                fontSize: "11.5px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              <Icon size={15}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </Icon>
              {t("security.channel")}
            </div>
            <p
              style={{
                fontSize: "10.5px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                marginBottom: "12px",
              }}
            >
              {t("security.desc")}
            </p>
            <div
              style={{
                height: "5px",
                borderRadius: "5px",
                background: "rgba(255,255,255,0.12)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress.percent}%`,
                  background: TEAL,
                  borderRadius: "5px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "7px",
              }}
            >
              <span>{t("security.completion")}</span>
              <span>
                {progress.filled}/{progress.total}
              </span>
            </div>
          </div>
        </div>

        {/* OFFICER FOOTER */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 8px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {(officerName || "O").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {officerName}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "1px",
                }}
              >
                {officerBadge}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{
              width: "100%",
              padding: "9px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            height: "92px",
            minHeight: "92px",
            background: C.sidebar,
            borderBottom: `1px solid ${C.border}`,
            padding: "0 38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: C.muted,
                marginBottom: "7px",
              }}
            >
              <span>{t("header.kavach")}</span>
              <span>/</span>
              <span style={{ color: TEAL, fontWeight: 700 }}>
                {t("header.firLodging")}
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontSize: "20px",
                color: NAVY,
                fontWeight: 700,
              }}
            >
              {t("header.title")}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* LANGUAGE TOGGLE BUTTON */}
            <button
              onClick={handleLanguageToggle}
              style={{
                padding: "8px 14px",
                borderRadius: "20px",
                border: `1px solid ${TEAL}`,
                background: TEAL_TINT,
                color: TEAL_DARK,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Icon size={14}>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </Icon>
              {language === "en" ? "Kannada" : "English"}
            </button>

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDarkMode(!dm)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: `1px solid ${C.border}`,
                background: C.card,
                color: C.softText,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={16}>
                {dm ? (
                  <circle cx="12" cy="12" r="5" />
                ) : (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                )}
              </Icon>
            </button>
          </div>
        </header>

        {/* CHAT DISPLAY */}
        <section
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "38px clamp(22px, 5vw, 80px)",
            background: C.background,
          }}
        >
          <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
            {/* INTRO TITLE */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "28px",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: TEAL,
                    fontSize: "11px",
                    fontWeight: 800,
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: TEAL,
                    }}
                  />
                  {t("content.liveAssistance")}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: NAVY,
                  }}
                >
                  {t("content.heading")}
                </h2>
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "13.5px",
                    color: C.muted,
                  }}
                >
                  {t("content.subheading")}
                </p>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  color: C.softText,
                  fontSize: "12px",
                }}
              >
                {t("content.session")}{" "}
                <strong style={{ color: C.text }}>{sessionId.current}</strong>
              </div>
            </div>

            {/* CHAT MESSAGES */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          padding: "14px 18px",
                          background: NAVY,
                          color: "#fff",
                          borderRadius: "16px 16px 4px 16px",
                          fontSize: "14px",
                          lineHeight: 1.7,
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "13px",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "11px",
                          background: TEAL_TINT,
                          color: TEAL_DARK,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={17}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </Icon>
                      </div>
                      <div
                        style={{
                          maxWidth: "75%",
                          background: C.card,
                          border: `1px solid ${C.border}`,
                          borderRadius: "16px 16px 16px 5px",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ padding: "16px 20px" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: 1.75,
                              color: C.text,
                            }}
                          >
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        </section>

        {/* INPUT FOOTER */}
        <footer
          style={{
            background: C.sidebar,
            borderTop: `1px solid ${C.border}`,
            padding: "18px clamp(22px, 5vw, 80px) 20px",
          }}
        >
          <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "14px",
                padding: "10px 12px 10px 16px",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t("footer.placeholder")}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: C.text,
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  border: "none",
                  background: loading || !input.trim() ? C.border : TEAL,
                  color: "#fff",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={17}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </Icon>
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Export Component Context Wrapper
export default function FIRLodging() {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <FIRLodgingContent />
    </I18nextProvider>
  );
}
