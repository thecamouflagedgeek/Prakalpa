import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [tab, setTab] = useState<"citizen" | "officer">("citizen");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

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
        setError(`This account is not a ${tab} account.`);
        return;
      }
      setUser({ username, name, role, badge });
      navigate(role === "officer" ? "/officer/dashboard" : "/citizen");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const S = styles(tab);

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoIcon}>K</div>
          <div>
            <div style={S.logoTitle}>KAVACH</div>
            <div style={S.logoSub}>Karnataka State Police · SCRB</div>
          </div>
        </div>

        <div style={S.divider} />

        {/* Tab toggle */}
        <div style={S.tabRow}>
          {(["citizen", "officer"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={S.tab(t === tab)}>
              {t === "citizen" ? "Citizen Portal" : "Officer Portal"}
            </button>
          ))}
        </div>

        <p style={S.subtitle}>
          {tab === "citizen"
            ? "Report an incident or track your complaint status."
            : "Access your case dashboard and manage FIR filings."}
        </p>

        {/* Demo credentials */}
        <div style={S.hint}>
          <strong>Demo — </strong>
          {tab === "citizen"
            ? "Username: citizen001 · Password: citizen123"
            : "Username: officer001 · Password: officer123"}
        </div>

        {/* Form */}
        <div style={S.fieldGroup}>
          <label style={S.label}>Username</label>
          <input
            style={S.input}
            placeholder={
              tab === "citizen" ? "e.g. citizen001" : "e.g. officer001"
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#5b52f0")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        <div style={S.fieldGroup}>
          <label style={S.label}>Password</label>
          <input
            style={S.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#5b52f0")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <p style={S.error}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={S.btn}>
          {loading
            ? "Signing in..."
            : `Sign in as ${tab === "citizen" ? "Citizen" : "Officer"}`}
        </button>

        <p style={S.footer}>
          All sessions are encrypted and audit-logged per SCRB protocol.
        </p>
      </div>
    </div>
  );
}

const styles = (tab: string) => {
  const accent = "#5b52f0";
  return {
    page: {
      minHeight: "100vh",
      background: "#f5f4ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
    } as React.CSSProperties,
    card: {
      width: "420px",
      background: "#fff",
      borderRadius: "14px",
      padding: "36px",
      border: "1px solid #e9e6fb",
      boxShadow: "0 4px 24px rgba(91,82,240,0.08)",
    } as React.CSSProperties,
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
    } as React.CSSProperties,
    logoIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      background: accent,
      color: "#fff",
      fontWeight: "800",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    } as React.CSSProperties,
    logoTitle: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#1a1a2e",
      letterSpacing: "-0.02em",
    } as React.CSSProperties,
    logoSub: {
      fontSize: "11px",
      color: "#9ca3af",
      marginTop: "1px",
    } as React.CSSProperties,
    divider: {
      height: "1px",
      background: "#f3f0ff",
      marginBottom: "20px",
    } as React.CSSProperties,
    tabRow: {
      display: "flex",
      gap: "6px",
      marginBottom: "16px",
      background: "#f5f4ff",
      padding: "4px",
      borderRadius: "8px",
    } as React.CSSProperties,
    tab: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "7px 0",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      background: active ? "#fff" : "transparent",
      color: active ? accent : "#9ca3af",
      boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
      transition: "all 0.15s",
    }),
    subtitle: {
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "14px",
      lineHeight: "1.6",
    } as React.CSSProperties,
    hint: {
      fontSize: "11px",
      padding: "8px 12px",
      background: "#f5f4ff",
      borderRadius: "6px",
      color: "#6b7280",
      marginBottom: "18px",
      border: "1px solid #e9e6fb",
    } as React.CSSProperties,
    fieldGroup: { marginBottom: "14px" } as React.CSSProperties,
    label: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#374151",
      display: "block",
      marginBottom: "5px",
    } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "9px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: "7px",
      fontSize: "13px",
      outline: "none",
      color: "#1a1a2e",
      fontFamily: "inherit",
      boxSizing: "border-box" as const,
      transition: "border-color 0.15s",
    } as React.CSSProperties,
    error: {
      fontSize: "12px",
      color: "#dc2626",
      marginBottom: "12px",
    } as React.CSSProperties,
    btn: {
      width: "100%",
      padding: "10px 0",
      background: accent,
      border: "none",
      borderRadius: "7px",
      color: "#fff",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "14px",
      fontFamily: "inherit",
    } as React.CSSProperties,
    footer: {
      fontSize: "11px",
      color: "#9ca3af",
      textAlign: "center" as const,
      lineHeight: "1.5",
    } as React.CSSProperties,
  };
};
