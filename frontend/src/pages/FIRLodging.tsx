import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import i18n from "i18next";
import {
  initReactI18next,
  useTranslation,
  I18nextProvider,
} from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  Globe2,
  Sun,
  Moon,
  Send,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

/* =========================================================
   JSON-BASED LOCALIZATION
========================================================= */

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        fileComplaint: "File a Complaint",
        trackStatus: "Track FIR Status",
        information: "Know Your Rights",
        emergency: "Emergency Contacts",
        settings: "Settings",
      },

      sidebar: {
        platform: "Citizen Portal",
        signOut: "Sign out",
      },

      header: {
        kavach: "KAVACH",
        firLodging: "FIR LODGING",
        title: "AI-Assisted FIR Registration",
        translateBtn: "ಕನ್ನಡ",
      },

      content: {
        liveAssistance: "LIVE ASSISTANCE ACTIVE",
        heading: "Tell us what happened.",
        subheading:
          "KAVACH will guide you through each step of your FIR registration.",
        session: "Session",

        languageQuestion: "Which language would you like to continue in?",

        languageInstruction:
          "Please select English or Kannada to begin your FIR registration.",

        greeting:
          "Namaskara. I am KAVACH, your AI-assisted FIR registration system. I will guide you through the process step by step. To begin, may I know your full name?",

        connectionError:
          "Connection error. Please ensure the backend server is running.",

        typing: "KAVACH is typing...",
      },

      language: {
        english: "English",
        kannada: "ಕನ್ನಡ",
      },

      progress: {
        title: "FIR Registration Progress",
        fields: "FIELDS COLLECTED",
        complete: "FIR INFORMATION COMPLETE",
      },

      footer: {
        placeholder: "Type your response, KAVACH will handle the rest.",
        encrypted: "🔒 Encrypted & audit-logged",
      },
    },
  },

  kn: {
    translation: {
      nav: {
        home: "ಮುಖಪುಟ",
        fileComplaint: "ದೂರು ದಾಖಲಿಸಿ",
        trackStatus: "ಎಫ್‌ಐಆರ್ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        information: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
        emergency: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
        settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      },

      sidebar: {
        platform: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
        signOut: "ಸೈನ್ ಔಟ್",
      },

      header: {
        kavach: "ಕವಚ",
        firLodging: "FIR ನೋಂದಣಿ",
        title: "AI-ಸಹಾಯಿತ FIR ನೋಂದಣಿ",
        translateBtn: "English",
      },

      content: {
        liveAssistance: "ನೇರ ಸಹಾಯ ಸಕ್ರಿಯವಾಗಿದೆ",
        heading: "ಏನಾಯಿತು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ.",
        subheading:
          "ನಿಮ್ಮ FIR ನೋಂದಣಿಯ ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ KAVACH ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
        session: "ಸೇಶನ್",

        languageQuestion: "ನೀವು ಯಾವ ಭಾಷೆಯಲ್ಲಿ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?",

        languageInstruction:
          "ನಿಮ್ಮ FIR ನೋಂದಣಿಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",

        greeting:
          "ನಮಸ್ಕಾರ. ನಾನು KAVACH, ನಿಮ್ಮ AI-ಸಹಾಯಿತ FIR ನೋಂದಣಿ ವ್ಯವಸ್ಥೆ. ನಾನು ಪ್ರತಿ ಹಂತದಲ್ಲೂ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ. ಆರಂಭಿಸಲು, ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ತಿಳಿಸುತ್ತೀರಾ?",

        connectionError:
          "ಸಂಪರ್ಕ ದೋಷ. ದಯವಿಟ್ಟು ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",

        typing: "KAVACH ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
      },

      language: {
        english: "English",
        kannada: "ಕನ್ನಡ",
      },

      progress: {
        title: "FIR ನೋಂದಣಿ ಪ್ರಗತಿ",
        fields: "ಸಂಗ್ರಹಿಸಿದ ಕ್ಷೇತ್ರಗಳು",
        complete: "FIR ಮಾಹಿತಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
      },

      footer: {
        placeholder:
          "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ, KAVACH ಬಾಕಿಯನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ...",
        encrypted: "🔒 ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಆಡಿಟ್ ಮಾಡಲಾಗಿದೆ",
      },
    },
  },
};

const i18nInstance = i18n.createInstance();

i18nInstance.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },
});

/* =========================================================
   TYPES
========================================================= */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isGreeting?: boolean;
  isLanguageQuestion?: boolean;
}

interface Progress {
  filled: number;
  total: number;
  percent: number;
  collected_data?: Record<string, string>;
}

/* =========================================================
   DESIGN TOKENS
========================================================= */

const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const BG_SECTION = "#EAF2F5";
const BORDER = "#E3E9EC";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const TEAL_TINT = "#E1F5F5";

/* =========================================================
   ICON
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

/* =========================================================
   MAIN COMPONENT
========================================================= */

function FIRLodgingContent() {
  const { t, i18n: currentI18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  /*
   * IMPORTANT:
   * Language starts as null.
   * The page itself still renders normally.
   * Only the CHAT asks the user to choose a language.
   */

  const [language, setLanguage] = useState<"en" | "kn" | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "",
      isLanguageQuestion: true,
      timestamp: "Just Now",
    },
  ]);

  const [input, setInput] = useState("");

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

  /* =========================================================
     LANGUAGE SELECTION INSIDE CHAT
  ========================================================= */

  const handleLanguageSelection = (selectedLanguage: "en" | "kn") => {
    setLanguage(selectedLanguage);

    currentI18n.changeLanguage(selectedLanguage);

    setMessages((prev) => [
      ...prev,

      {
        role: "user",
        content: selectedLanguage === "en" ? "English" : "ಕನ್ನಡ",
        timestamp: "Just Now",
      },

      {
        role: "assistant",
        content: "",
        isGreeting: true,
        timestamp: "Just Now",
      },
    ]);
  };

  /* =========================================================
     HEADER LANGUAGE TOGGLE
  ========================================================= */

  const handleLanguageToggle = () => {
    const nextLanguage = language === "en" ? "kn" : "en";

    setLanguage(nextLanguage);

    currentI18n.changeLanguage(nextLanguage);
  };

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================================================
     SEND FIR MESSAGE
  ========================================================= */

  const sendMessage = async () => {
    if (!input.trim() || loading || language === null) {
      return;
    }

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

        {
          role: "assistant",
          content: reply,
          timestamp: "Just Now",
        },
      ]);

      setProgress(fir_progress);

      setIsComplete(is_complete);
    } catch {
      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",
          content: t("content.connectionError"),
          timestamp: "Just Now",
        },
      ]);
    } finally {
      setLoading(false);

      inputRef.current?.focus();
    }
  };

  /* =========================================================
     DARK MODE COLORS
  ========================================================= */

  const dm = darkMode;

  const C = {
    background: dm ? NAVY_DEEP : BG_SECTION,
    sidebar: dm ? "#111B29" : "#FFFFFF",
    card: dm ? "#172334" : "#FFFFFF",
    border: dm ? "#263547" : BORDER,
    text: dm ? "#F1F5F9" : NAVY,
    muted: dm ? "#94A3B8" : MUTED,
    softText: dm ? "#AEBACA" : TEXT,
  };

  /* =========================================================
     SIDEBAR NAVIGATION
  ========================================================= */

  const navItems = [
    {
      key: "home",
      label: t("nav.home"),
      icon: FileText,
      path: "/citizen/dashboard",
    },
    {
      key: "complaint",
      label: t("nav.fileComplaint"),
      icon: FileText,
      path: "/citizen",
    },
    {
      key: "track",
      label: t("nav.trackStatus"),
      icon: Search,
      path: "/track",
    },
    {
      key: "information",
      label: t("nav.information"),
      icon: LifeBuoy,
      path: "/right",
    },
    {
      key: "emergency",
      label: t("nav.emergency"),
      icon: Phone,
      path: "/emergency",
    },
    {
      key: "settings",
      label: t("nav.settings"),
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  const citizenName = user?.name || "Citizen";

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
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        style={{
          width: "236px",
          minWidth: "236px",
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 18px",
          position: "sticky",
          top: 0,
        }}
      >
        {/* LOGO */}

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
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldIcon size={18} color="#FFFFFF" />
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
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.45)",
                marginTop: "1px",
                textTransform: "uppercase",
              }}
            >
              {t("sidebar.platform")}
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === "complaint";

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13.5px",
                  fontWeight: active ? 600 : 500,
                  background: active ? "rgba(14,140,140,0.22)" : "transparent",
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                  textAlign: "left",
                  width: "100%",
                }}
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

        {/* USER */}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "16px",
            marginTop: "12px",
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
              {citizenName.charAt(0).toUpperCase()}
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
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
                {citizenName}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "1px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.username || ""}
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
            {t("sidebar.signOut")}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

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

              <span
                style={{
                  color: TEAL,
                  fontWeight: 700,
                }}
              >
                {t("header.firLodging")}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontSize: "20px",
                color: dm ? "#FFFFFF" : NAVY,
                fontWeight: 700,
              }}
            >
              {t("header.title")}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* HEADER LANGUAGE TOGGLE */}

            <button
              type="button"
              onClick={handleLanguageToggle}
              disabled={language === null}
              style={{
                padding: "8px 14px",
                borderRadius: "20px",
                border: `1px solid ${TEAL}`,
                background: language === null ? "transparent" : TEAL_TINT,
                color: TEAL_DARK,
                cursor: language === null ? "not-allowed" : "pointer",
                opacity: language === null ? 0.55 : 1,
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Globe2 size={14} />

              {language === null ? "Choose Language" : t("header.translateBtn")}
            </button>

            {/* DARK MODE */}

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
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
              {dm ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* ===================================================
            CHAT DISPLAY
        =================================================== */}

        <section
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "38px clamp(22px, 5vw, 80px)",
            background: C.background,
          }}
        >
          <div
            style={{
              maxWidth: "1050px",
              margin: "0 auto",
            }}
          >
            {/* INTRO */}

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
                    color: C.text,
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
                <strong
                  style={{
                    color: C.text,
                  }}
                >
                  {sessionId.current}
                </strong>
              </div>
            </div>

            {/* PROGRESS */}

            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  {t("progress.title")}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: TEAL,
                    fontWeight: 700,
                  }}
                >
                  {progress.filled}/{progress.total}
                </span>
              </div>

              <div
                style={{
                  height: "6px",
                  borderRadius: "6px",
                  background: dm ? "#263547" : "#E6EEF0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress.percent}%`,
                    height: "100%",
                    background: TEAL,
                    borderRadius: "6px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "10px",
                  color: C.muted,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {t("progress.fields")}
              </div>
            </div>

            {/* CHAT MESSAGES */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.role === "user" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          padding: "14px 18px",
                          background: NAVY,
                          color: "#FFFFFF",
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ShieldIcon size={17} color={TEAL_DARK} />
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
                        <div
                          style={{
                            padding: "16px 20px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: 1.75,
                              color: C.text,
                            }}
                          >
                            {msg.isLanguageQuestion
                              ? t("content.languageQuestion")
                              : msg.isGreeting
                                ? t("content.greeting")
                                : msg.content}
                          </p>

                          {/* =================================
                              LANGUAGE BUTTONS INSIDE CHAT
                          ================================= */}

                          {msg.isLanguageQuestion && (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleLanguageSelection("en")}
                                style={{
                                  padding: "10px 20px",
                                  borderRadius: "8px",
                                  border: `1px solid ${TEAL}`,
                                  background: TEAL,
                                  color: "#FFFFFF",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                🇬🇧 {t("language.english")}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleLanguageSelection("kn")}
                                style={{
                                  padding: "10px 20px",
                                  borderRadius: "8px",
                                  border: `1px solid ${TEAL}`,
                                  background: TEAL_TINT,
                                  color: TEAL_DARK,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                🇮🇳 {t("language.kannada")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    marginLeft: "50px",
                    color: C.muted,
                    fontSize: "13px",
                  }}
                >
                  {t("content.typing")}
                </div>
              )}

              {isComplete && (
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "10px",
                    background: TEAL_TINT,
                    border: `1px solid ${TEAL}`,
                    color: TEAL_DARK,
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {t("progress.complete")}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        </section>

        {/* ===================================================
            INPUT FOOTER
        =================================================== */}

        <footer
          style={{
            background: C.sidebar,
            borderTop: `1px solid ${C.border}`,
            padding: "18px clamp(22px, 5vw, 80px) 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1050px",
              margin: "0 auto",
            }}
          >
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                disabled={language === null || loading}
                placeholder={
                  language === null
                    ? "Select English or Kannada above to begin..."
                    : t("footer.placeholder")
                }
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: C.text,
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  opacity: language === null ? 0.6 : 1,
                }}
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={language === null || loading}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  border: "none",
                  background: language === null || loading ? C.border : TEAL,
                  color: "#FFFFFF",
                  cursor:
                    language === null || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={17} />
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "11px",
                color: C.muted,
              }}
            >
              {t("footer.encrypted")}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default function FIRLodging() {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <FIRLodgingContent />
    </I18nextProvider>
  );
}
