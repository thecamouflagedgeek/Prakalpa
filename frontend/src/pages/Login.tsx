import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Local translation dictionary so no external setup/files are needed
const translations = {
  en: {
    sideSub: "KARNATAKA STATE POLICE",
    sideHeadline1: "Digital policing,",
    sideHeadline2: "built on trust.",
    sideText:
      "Secure sign-in for citizens filing reports and officers managing cases across every district.",
    districts: "Districts",
    availability: "Availability",
    logoSub: "Karnataka State Police · SCRB",
    citizenPortal: "Citizen Portal",
    officerPortal: "Officer Portal",
    citizenSubtitle: "Report an incident or track your complaint status.",
    officerSubtitle: "Access your case dashboard and manage FIR filings.",
    demoLabel: "Demo",
    citizenHint: "Username: citizen001 · Password: citizen123",
    officerHint: "Username: officer001 · Password: officer123",
    usernameLabel: "Username",
    passwordLabel: "Password",
    citizenPlaceholder: "e.g. citizen001",
    officerPlaceholder: "e.g. officer001",
    passwordPlaceholder: "Enter your password",
    signingIn: "Signing in...",
    signInAs: "Sign in as",
    citizen: "Citizen",
    officer: "Officer",
    errorNotRole: "This account is not a {role} account.",
    errorInvalid: "Invalid username or password.",
    footer: "All sessions are encrypted and audit-logged per SCRB protocol.",
    switchLang: "ಕನ್ನಡ",
  },
  kn: {
    sideSub: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    sideHeadline1: "ಡಿಜಿಟಲ್ ಪೊಲೀಸಿಂಗ್,",
    sideHeadline2: "ನಂಬಿಕೆಯ ತಳಹದಿ.",
    sideText:
      "ವರದಿಗಳನ್ನು ಸಲ್ಲಿಸುವ ನಾಗರಿಕರಿಗೆ ಮತ್ತು ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆಯ ಪ್ರಕರಣಗಳನ್ನು ನಿರ್ವಹಿಸುವ ಅಧಿಕಾರಿಗಳಿಗೆ ಸುರಕ್ಷಿತ ಸೈನ್-ಇನ್.",
    districts: "ಜಿಲ್ಲೆಗಳು",
    availability: "ಲಭ್ಯತೆ",
    logoSub: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ಎಸ್‌ಸಿಆರ್‌ಬಿ",
    citizenPortal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    officerPortal: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    citizenSubtitle:
      "ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    officerSubtitle:
      "ನಿಮ್ಮ ಪ್ರಕರಣದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ ಮತ್ತು ಎಫ್‌ಐಆರ್ ನೋಂದಣಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    demoLabel: "ಡೆಮೋ",
    citizenHint: "ಬಳಕೆದಾರ ಹೆಸರು: citizen001 · ಪಾಸ್‌ವರ್ಡ್: citizen123",
    officerHint: "ಬಳಕೆದಾರ ಹೆಸರು: officer001 · ಪಾಸ್‌ವರ್ಡ್: officer123",
    usernameLabel: "ಬಳಕೆದಾರ ಹೆಸರು",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    citizenPlaceholder: "ಉದಾ: citizen001",
    officerPlaceholder: "ಉದಾ: officer001",
    passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    signingIn: "ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...",
    signInAs: "ಸೈನ್ ಇನ್ ಮಾಡಿ:",
    citizen: "ನಾಗರಿಕ",
    officer: "ಅಧಿಕಾರಿ",
    errorNotRole: "ಈ ಖಾತೆಯು {role} ಖಾತೆಯಾಗಿಲ್ಲ.",
    errorInvalid: "ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.",
    footer:
      "ಎಸ್‌ಸಿಆರ್‌ಬಿ ಶಿಷ್ಟಾಚಾರದಂತೆ ಎಲ್ಲಾ ಸೆಷನ್‌ಗಳನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗುತ್ತದೆ ಮತ್ತು ಆಡಿಟ್-ಲಾಗ್ ಮಾಡಲಾಗುತ್ತದೆ.",
    switchLang: "English",
  },
};

export default function Login() {
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [tab, setTab] = useState<"citizen" | "officer">("citizen");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
        username,
        password,
      });
      const { role, name, badge } = res.data;
      if (role !== tab) {
        const roleLabel = tab === "citizen" ? t.citizen : t.officer;
        setError(t.errorNotRole.replace("{role}", roleLabel));
        return;
      }
      setUser({ username, name, role, badge });
      navigate(role === "officer" ? "/officer/dashboard" : "/citizen");
    } catch {
      setError(t.errorInvalid);
    } finally {
      setLoading(false);
    }
  };

  const S = styles(tab);

  return (
    <div style={S.page}>
      {/* decorative side panel */}
      <div style={S.sidePanel}>
        <div style={S.sideBadgeRow}>
          <div style={S.sideShield}>
            <ShieldIcon size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sideTitle}>KAVACH</div>
            <div style={S.sideSub}>{t.sideSub}</div>
          </div>
        </div>
        <div style={S.sideHeadline}>
          {t.sideHeadline1}
          <br />
          {t.sideHeadline2}
        </div>
        <p style={S.sideText}>{t.sideText}</p>
        <div style={S.sideStatsRow}>
          <div>
            <div style={S.sideStatValue}>31</div>
            <div style={S.sideStatLabel}>{t.districts}</div>
          </div>
          <div style={S.sideStatDivider} />
          <div>
            <div style={S.sideStatValue}>24×7</div>
            <div style={S.sideStatLabel}>{t.availability}</div>
          </div>
        </div>
      </div>

      {/* form panel */}
      <div style={S.formPanel}>
        <div style={S.card}>
          <div style={S.headerRow}>
            <div style={S.logoRow}>
              <div style={S.logoIcon}>
                <ShieldIcon size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={S.logoTitle}>KAVACH</div>
                <div style={S.logoSub}>{t.logoSub}</div>
              </div>
            </div>

            {/* Language Switch Button */}
            <button onClick={toggleLanguage} type="button" style={S.langBtn}>
              <GlobeIcon color="#0E8C8C" size={13} />
              {t.switchLang}
            </button>
          </div>

          <div style={S.divider} />

          <div style={S.tabRow}>
            {(["citizen", "officer"] as const).map((tVal) => (
              <button
                key={tVal}
                type="button"
                onClick={() => setTab(tVal)}
                style={S.tab(tVal === tab)}
              >
                {tVal === "citizen" ? t.citizenPortal : t.officerPortal}
              </button>
            ))}
          </div>

          <p style={S.subtitle}>
            {tab === "citizen" ? t.citizenSubtitle : t.officerSubtitle}
          </p>

          <div style={S.hint}>
            <strong style={{ color: "#0A6E6E" }}>{t.demoLabel} — </strong>
            {tab === "citizen" ? t.citizenHint : t.officerHint}
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>{t.usernameLabel}</label>
            <input
              style={S.input}
              placeholder={
                tab === "citizen" ? t.citizenPlaceholder : t.officerPlaceholder
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0E8C8C";
                e.target.style.boxShadow = "0 0 0 3px rgba(14,140,140,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E3E9EC";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>{t.passwordLabel}</label>
            <input
              style={S.input}
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0E8C8C";
                e.target.style.boxShadow = "0 0 0 3px rgba(14,140,140,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E3E9EC";
                e.target.style.boxShadow = "none";
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <p style={S.error}>{error}</p>}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={S.btn}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#0A6E6E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0E8C8C";
            }}
          >
            {loading
              ? t.signingIn
              : `${t.signInAs} ${tab === "citizen" ? t.citizen : t.officer}`}
          </button>

          <p style={S.footer}>{t.footer}</p>
        </div>
      </div>
    </div>
  );
}

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

const styles = (tab: string) => {
  const teal = "#0E8C8C";
  const navy = "#152A43";
  const navySoft = "#2C4260";
  const bgSection = "#EAF2F5";
  const border = "#E3E9EC";
  const text = "#5B6B7A";
  const danger = "#C0392B";

  return {
    page: {
      minHeight: "100vh",
      background: bgSection,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    } as React.CSSProperties,

    sidePanel: {
      flex: "1 1 420px",
      maxWidth: 480,
      background: `linear-gradient(155deg, ${navy} 0%, #0E2438 100%)`,
      color: "#FFFFFF",
      padding: "56px 48px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    } as React.CSSProperties,

    sideBadgeRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    } as React.CSSProperties,

    sideShield: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: `linear-gradient(150deg, ${teal}, ${navy})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    } as React.CSSProperties,

    sideTitle: {
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      fontSize: 19,
      fontWeight: 700,
      letterSpacing: "0.01em",
    } as React.CSSProperties,

    sideSub: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 10,
      letterSpacing: "0.09em",
      color: "rgba(255,255,255,0.55)",
      marginTop: 1,
    } as React.CSSProperties,

    sideHeadline: {
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      fontSize: 34,
      fontWeight: 600,
      lineHeight: 1.25,
      margin: "40px 0 16px 0",
    } as React.CSSProperties,

    sideText: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.72)",
      maxWidth: 320,
      margin: 0,
    } as React.CSSProperties,

    sideStatsRow: {
      display: "flex",
      alignItems: "center",
      gap: 22,
      marginTop: 40,
    } as React.CSSProperties,

    sideStatValue: {
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      fontSize: 24,
      fontWeight: 700,
      color: "#FFFFFF",
    } as React.CSSProperties,

    sideStatLabel: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 11.5,
      color: "rgba(255,255,255,0.6)",
      marginTop: 2,
    } as React.CSSProperties,

    sideStatDivider: {
      width: 1,
      height: 34,
      background: "rgba(255,255,255,0.18)",
    } as React.CSSProperties,

    formPanel: {
      flex: "1 1 480px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    } as React.CSSProperties,

    card: {
      width: "420px",
      maxWidth: "100%",
      background: "#FFFFFF",
      borderRadius: 14,
      padding: 36,
      border: `1px solid ${border}`,
      boxShadow: "0 12px 34px rgba(21,42,67,0.08)",
    } as React.CSSProperties,

    headerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    } as React.CSSProperties,

    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    } as React.CSSProperties,

    logoIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: `linear-gradient(150deg, ${teal}, ${navy})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    } as React.CSSProperties,

    logoTitle: {
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      fontSize: 17,
      fontWeight: 700,
      color: navy,
      letterSpacing: "-0.01em",
    } as React.CSSProperties,

    logoSub: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      color: "#9AA7B0",
      marginTop: 1,
    } as React.CSSProperties,

    langBtn: {
      background: "transparent",
      color: teal,
      border: `1px solid ${teal}`,
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

    divider: {
      height: 1,
      background: border,
      marginBottom: 20,
    } as React.CSSProperties,

    tabRow: {
      display: "flex",
      gap: 6,
      marginBottom: 16,
      background: bgSection,
      padding: 4,
      borderRadius: 8,
    } as React.CSSProperties,

    tab: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "8px 0",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      fontSize: 12.5,
      fontWeight: 600,
      background: active ? "#FFFFFF" : "transparent",
      color: active ? teal : "#8A97A3",
      boxShadow: active ? "0 1px 6px rgba(21,42,67,0.10)" : "none",
      transition: "all 0.15s ease",
    }),

    subtitle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12.5,
      color: text,
      marginBottom: 14,
      lineHeight: 1.6,
    } as React.CSSProperties,

    hint: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 11.5,
      padding: "9px 12px",
      background: bgSection,
      borderRadius: 6,
      color: text,
      marginBottom: 18,
      border: `1px solid ${border}`,
    } as React.CSSProperties,

    fieldGroup: { marginBottom: 14 } as React.CSSProperties,

    label: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      fontWeight: 600,
      color: navySoft,
      display: "block",
      marginBottom: 5,
    } as React.CSSProperties,

    input: {
      width: "100%",
      padding: "10px 12px",
      border: `1px solid ${border}`,
      borderRadius: 7,
      fontSize: 13,
      outline: "none",
      color: navy,
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box" as const,
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    } as React.CSSProperties,

    error: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: danger,
      marginBottom: 12,
    } as React.CSSProperties,

    btn: {
      width: "100%",
      padding: "11px 0",
      background: teal,
      border: "none",
      borderRadius: 7,
      color: "#FFFFFF",
      fontSize: 13.5,
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: 14,
      fontFamily: "'Inter', sans-serif",
      transition: "background 0.15s ease",
    } as React.CSSProperties,

    footer: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      color: "#9AA7B0",
      textAlign: "center" as const,
      lineHeight: 1.5,
      margin: 0,
    } as React.CSSProperties,
  };
};
