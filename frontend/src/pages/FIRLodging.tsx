import { useState, useRef, useEffect } from "react";
import axios from "axios";

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

export default function FIRLodging() {
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      role: "user",
      content: input,
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
        message: input,
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
            "Connection error. Please ensure the server is running and try again.",
          timestamp: "Just Now",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const dm = darkMode;
  const bg = dm ? "#10131a" : "#f5f4ff";
  const sidebar = dm ? "#13161f" : "#ffffff";
  const cardBg = dm ? "#1a1e2b" : "#ffffff";
  const textPrimary = dm ? "#e8eaf0" : "#1a1a2e";
  const textMuted = dm ? "#6b7280" : "#9ca3af";
  const textSub = dm ? "#9ca3af" : "#6b7280";
  const borderCol = dm ? "#23283a" : "#e9e6fb";
  const inputBg = dm ? "#1a1e2b" : "#ffffff";
  const accent = "#5b52f0";
  const accentBg = dm ? "#1e1c3a" : "#eeecfd";
  const accentText = dm ? "#a5a0f8" : "#4338ca";

  const navItems = [
    { label: "FIR Lodging", active: true },
    { label: "AI Analysis", active: false },
    { label: "Crime Hotspots", active: false },
    { label: "Network Graph", active: false },
    { label: "Case History", active: false },
    { label: "Legal Library", active: false },
  ];

  const IconSend = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
  const IconMic = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
  const IconMoon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
  const IconSun = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
  const IconExport = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
  const IconPlus = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
  const IconFolder = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
  const IconFile = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
  const IconEdit = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
  const IconRefresh = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
  const IconDownload = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  const IconLink = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
  const IconShield = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
  const IconMenu = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
  const IconChevron = () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
  const IconCheck = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  const IconStar = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={accent}
      stroke={accent}
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: bg,
        fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        letterSpacing: "-0.01em",
      }}
    >
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "256px",
          background: sidebar,
          borderRight: `1px solid ${borderCol}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            padding: "15px 18px",
            borderBottom: `1px solid ${borderCol}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "0.5px",
              }}
            >
              K
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              KAVACH
            </span>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textMuted,
              display: "flex",
            }}
          >
            <IconMenu />
          </button>
        </div>

        {/* New session */}
        <div style={{ padding: "12px 14px" }}>
          <button
            style={{
              width: "100%",
              padding: "8px 0",
              background: textPrimary,
              borderRadius: "7px",
              border: "none",
              color: dm ? "#10131a" : "#fff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              letterSpacing: "0.01em",
            }}
          >
            <IconPlus /> New Session
          </button>
        </div>

        {/* Nav */}
        <div style={{ padding: "2px 8px" }}>
          <p
            style={{
              fontSize: "10px",
              color: textMuted,
              padding: "4px 10px 5px",
              textTransform: "uppercase",
              letterSpacing: "0.9px",
              margin: 0,
            }}
          >
            Features
          </p>
          {navItems.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "7px 10px",
                borderRadius: "6px",
                marginBottom: "1px",
                background: item.active ? accentBg : "transparent",
                color: item.active ? accentText : textSub,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: item.active ? "600" : "400",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderLeft: item.active
                  ? `2px solid ${accent}`
                  : "2px solid transparent",
                transition: "background 0.12s",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: item.active ? accent : textMuted,
                  flexShrink: 0,
                }}
              />
              {item.label}
            </div>
          ))}
        </div>

        {/* Project tree */}
        <div style={{ padding: "8px 8px 0", marginTop: "6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "3px 10px 5px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.9px",
                margin: 0,
              }}
            >
              Station Records
            </p>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: textMuted,
                display: "flex",
              }}
            >
              <IconPlus />
            </button>
          </div>

          {[
            {
              label: "Active Cases",
              children: ["FIR Registration", "Case #2024-891"],
            },
            { label: "Intelligence Feed", children: [] },
            { label: "Patrol Zones", children: [] },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  color: textSub,
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: textMuted, display: "flex" }}>
                  <IconFolder />
                </span>
                {item.label}
                {item.children.length > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: textMuted,
                      display: "flex",
                    }}
                  >
                    <IconChevron />
                  </span>
                )}
              </div>
              {item.children.map((child) => {
                const isActive = child === "FIR Registration";
                return (
                  <div
                    key={child}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "5px 10px 5px 28px",
                      fontSize: "12px",
                      color: isActive ? accentText : textSub,
                      background: isActive ? accentBg : "transparent",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: isActive ? "500" : "400",
                    }}
                  >
                    <span
                      style={{
                        color: isActive ? accent : textMuted,
                        display: "flex",
                      }}
                    >
                      <IconFile />
                    </span>
                    {child}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Upgrade card */}
        <div
          style={{
            margin: "auto 12px 12px",
            padding: "14px",
            background: accentBg,
            borderRadius: "10px",
            border: `1px solid ${dm ? "#2d2a5e" : "#ddd6fe"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: accent, display: "flex" }}>
              <IconStar />
            </span>
            <span
              style={{ fontSize: "12px", fontWeight: "700", color: accentText }}
            >
              SCRB Command Access
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              color: accentText,
              margin: "0 0 10px",
              lineHeight: "1.6",
              opacity: 0.8,
            }}
          >
            Enable cross-station network analysis and predictive intelligence.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: accentText,
              marginBottom: "6px",
              opacity: 0.8,
            }}
          >
            <span>Current: Station Tier</span>
            <span>
              {progress.filled} / {progress.total}
            </span>
          </div>
          <div
            style={{
              height: "3px",
              background: dm ? "#3d3a7a" : "#c4b5fd",
              borderRadius: "2px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress.percent}%`,
                background: accent,
                borderRadius: "2px",
                transition: "width 0.5s",
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              padding: "7px 0",
              borderRadius: "6px",
              background: accent,
              border: "none",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Request Access
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "0 24px",
            height: "50px",
            borderBottom: `1px solid ${borderCol}`,
            background: sidebar,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: textMuted,
            }}
          >
            <span>KAVACH</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>FIR Lodging</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span
              style={{
                color: textPrimary,
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {sessionId.current}
              <span style={{ display: "flex", color: textMuted }}>
                <IconChevron />
              </span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: textMuted }}>Language</span>
            <button
              onClick={() => setLanguage((l) => (l === "en" ? "kn" : "en"))}
              style={{
                padding: "4px 10px",
                borderRadius: "5px",
                border: `1px solid ${borderCol}`,
                background: "transparent",
                color: textPrimary,
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {language === "en" ? "Kannada" : "English"}
            </button>
            <button
              onClick={() => setDarkMode(!dm)}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                border: `1px solid ${borderCol}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: textSub,
              }}
            >
              {dm ? <IconSun /> : <IconMoon />}
            </button>
            <button
              style={{
                padding: "5px 13px",
                borderRadius: "6px",
                background: textPrimary,
                border: "none",
                color: dm ? "#10131a" : "#fff",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Export <IconExport />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 80px",
            backgroundImage: `radial-gradient(${dm ? "#23283a" : "#c9c4f7"} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "52%",
                      padding: "12px 16px",
                      background: cardBg,
                      borderRadius: "11px",
                      border: `1px solid ${borderCol}`,
                      fontSize: "13.5px",
                      color: textPrimary,
                      lineHeight: "1.65",
                      boxShadow: `0 1px 3px ${dm ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)"}`,
                      fontWeight: "400",
                    }}
                  >
                    {msg.content}
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: accentBg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${dm ? "#2d2a5e" : "#ddd6fe"}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: accentText,
                      }}
                    >
                      SI
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "11px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "9px",
                      background: accent,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#fff", display: "flex" }}>
                      <IconShield />
                    </span>
                  </div>
                  <div
                    style={{
                      maxWidth: "62%",
                      background: cardBg,
                      borderRadius: "11px",
                      border: `1px solid ${borderCol}`,
                      overflow: "hidden",
                      boxShadow: `0 1px 3px ${dm ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <div style={{ padding: "14px 16px" }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: textPrimary,
                          margin: "0 0 8px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        KAVACH AI
                      </p>
                      <p
                        style={{
                          fontSize: "13.5px",
                          color: textPrimary,
                          lineHeight: "1.7",
                          margin: 0,
                          fontWeight: "400",
                        }}
                      >
                        {msg.content}
                      </p>
                    </div>

                    {progress.filled > 0 &&
                      i === messages.length - 1 &&
                      !loading && (
                        <div
                          style={{
                            margin: "0 16px 14px",
                            padding: "10px 13px",
                            background: accentBg,
                            borderRadius: "7px",
                            border: `1px solid ${dm ? "#2d2a5e" : "#ddd6fe"}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "7px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                color: accentText,
                                fontWeight: "600",
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                              }}
                            >
                              FIR Progress
                            </span>
                            <span
                              style={{ fontSize: "11px", color: accentText }}
                            >
                              {progress.filled} of {progress.total} fields
                            </span>
                          </div>
                          <div
                            style={{
                              height: "3px",
                              background: dm ? "#3d3a7a" : "#c4b5fd",
                              borderRadius: "2px",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${progress.percent}%`,
                                background: accent,
                                borderRadius: "2px",
                                transition: "width 0.5s",
                              }}
                            />
                          </div>
                        </div>
                      )}

                    <div
                      style={{
                        padding: "9px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: `1px solid ${borderCol}`,
                      }}
                    >
                      <span style={{ fontSize: "11px", color: textMuted }}>
                        {msg.timestamp}
                      </span>
                      <div style={{ display: "flex", gap: "12px" }}>
                        {[<IconEdit />, <IconDownload />, <IconRefresh />].map(
                          (icon, idx) => (
                            <button
                              key={idx}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: textMuted,
                                display: "flex",
                                padding: 0,
                              }}
                            >
                              {icon}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: accent,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", display: "flex" }}>
                  <IconShield />
                </span>
              </div>
              <div
                style={{
                  padding: "14px 18px",
                  background: cardBg,
                  borderRadius: "11px",
                  border: `1px solid ${borderCol}`,
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: accent,
                      animation: `blink 1.2s ease-in-out ${idx * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {isComplete && (
            <div
              style={{
                alignSelf: "center",
                padding: "18px 24px",
                background: cardBg,
                border: `1px solid ${dm ? "#1a3a2a" : "#bbf7d0"}`,
                borderRadius: "11px",
                textAlign: "center",
                maxWidth: "360px",
                boxShadow: `0 1px 3px ${dm ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#16a34a", display: "flex" }}>
                  <IconCheck />
                </span>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#16a34a",
                    margin: 0,
                  }}
                >
                  All FIR fields collected
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    padding: "7px 16px",
                    borderRadius: "6px",
                    background: dm ? "#1a3a2a" : "#f0fdf4",
                    border: `1px solid ${dm ? "#16a34a" : "#86efac"}`,
                    color: "#16a34a",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Export PDF
                </button>
                <button
                  style={{
                    padding: "7px 16px",
                    borderRadius: "6px",
                    background: accent,
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Submit FIR
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div
          style={{
            background: sidebar,
            borderTop: `1px solid ${borderCol}`,
            padding: "12px 24px 10px",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: textMuted,
              textAlign: "center",
              margin: "0 0 9px",
              letterSpacing: "0.01em",
            }}
          >
            Get access to KAVACH Crime Intelligence — All data is encrypted and
            audit-logged
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: inputBg,
              border: `1px solid ${borderCol}`,
              borderRadius: "9px",
              padding: "9px 12px",
              boxShadow: `0 1px 3px ${dm ? "rgba(0,0,0,0.2)" : "rgba(91,82,240,0.06)"}`,
            }}
          >
            <span
              style={{
                color: accent,
                fontSize: "16px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              &#10022;
            </span>
            <input
              ref={inputRef}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13.5px",
                color: textPrimary,
                fontFamily: "inherit",
              }}
              placeholder={
                language === "en"
                  ? "Type your response, KAVACH will handle the rest"
                  : "ನಿಮ್ಮ ಉತ್ತರ ಟೈಪ್ ಮಾಡಿ..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: textMuted,
                display: "flex",
                padding: "3px",
              }}
            >
              <IconMic />
            </button>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                background:
                  loading || !input.trim()
                    ? dm
                      ? "#23283a"
                      : "#e5e7eb"
                    : accent,
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: loading || !input.trim() ? textMuted : "#fff",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <IconSend />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "14px" }}>
              {[
                { icon: <IconPlus />, label: "Attach" },
                { icon: <IconLink />, label: "Link case" },
                { icon: <IconFile />, label: "Upload document" },
              ].map((item) => (
                <button
                  key={item.label}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "11px",
                    color: textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: "inherit",
                    letterSpacing: "0.01em",
                  }}
                >
                  <span style={{ display: "flex" }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <button
              style={{
                padding: "3px 10px",
                borderRadius: "5px",
                border: `1px solid ${borderCol}`,
                background: "transparent",
                fontSize: "11px",
                color: textSub,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "inherit",
              }}
            >
              Tools <IconChevron />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes blink {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dm ? "#23283a" : "#ddd6fe"}; border-radius: 4px; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
