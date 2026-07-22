import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const INCIDENT_TYPES = [
  "Theft",
  "Robbery",
  "Assault",
  "Burglary",
  "Fraud",
  "Cybercrime",
  "Missing Person",
  "Vehicle Theft",
  "Harassment",
  "Other",
];

export default function CitizenPortal() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"form" | "chat">("form");
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    incident_type: "",
    incident_date: "",
    incident_time: "",
    incident_location: "",
    incident_description: "",
    accused_description: "",
    witnesses: "",
    evidence: "",
    contact_number: "",
    address: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (
      !form.incident_type ||
      !form.incident_description ||
      !form.incident_location
    ) {
      alert("Please fill in incident type, location and description.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/complaints/submit",
        {
          citizen_username: user?.username,
          citizen_name: user?.name,
          mode: "form",
          ...form,
        },
      );
      setComplaintId(res.data.complaint_id);
      setSubmitted(true);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const S = styles;

  if (submitted) {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: "420px" }}>
          <div style={S.successIcon}>&#10003;</div>
          <h2 style={S.successTitle}>Complaint Submitted</h2>
          <p style={S.successSub}>
            Your complaint has been received and assigned to the nearest
            available officer.
          </p>
          <div style={S.idBadge}>{complaintId}</div>
          <p
            style={{ fontSize: "11px", color: "#6b7280", marginBottom: "20px" }}
          >
            Save this reference number to track your complaint status.
          </p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.btnOutline}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={S.pageTitle}>File a Complaint</div>
            <div style={S.pageSub}>Welcome, {user?.name}</div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.logoutBtn}
          >
            Sign out
          </button>
        </div>

        {/* Mode toggle */}
        <div style={S.modeRow}>
          <span style={S.modeLabel}>Mode</span>
          <div style={S.modeToggle}>
            {(["form", "chat"] as const).map((m) => (
              <button
                key={m}
                onClick={() =>
                  m === "chat" ? navigate("/fir-chat") : setMode(m)
                }
                style={S.modeBtn(m === mode)}
              >
                {m === "form" ? "Form" : "Chat with AI"}
              </button>
            ))}
          </div>
        </div>

        <div style={S.divider} />

        {/* Form fields */}
        <div style={S.grid}>
          {/* Incident Type */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Incident Type *</label>
            <div style={S.typeGrid}>
              {INCIDENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => update("incident_type", t)}
                  style={S.typeBtn(form.incident_type === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div>
            <label style={S.label}>Date of Incident *</label>
            <input
              style={S.input}
              type="date"
              value={form.incident_date}
              onChange={(e) => update("incident_date", e.target.value)}
            />
          </div>
          <div>
            <label style={S.label}>Time of Incident</label>
            <input
              style={S.input}
              type="time"
              value={form.incident_time}
              onChange={(e) => update("incident_time", e.target.value)}
            />
          </div>

          {/* Location */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Location of Incident *</label>
            <input
              style={S.input}
              placeholder="Street, landmark, area, district"
              value={form.incident_location}
              onChange={(e) => update("incident_location", e.target.value)}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Description of Incident *</label>
            <textarea
              style={S.textarea}
              rows={4}
              placeholder="Describe what happened in as much detail as possible..."
              value={form.incident_description}
              onChange={(e) => update("incident_description", e.target.value)}
            />
          </div>

          {/* Accused */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Description of Accused (if known)</label>
            <textarea
              style={S.textarea}
              rows={2}
              placeholder="Physical appearance, name if known, vehicle, etc."
              value={form.accused_description}
              onChange={(e) => update("accused_description", e.target.value)}
            />
          </div>

          {/* Witnesses + Evidence */}
          <div>
            <label style={S.label}>Witnesses</label>
            <input
              style={S.input}
              placeholder="Names and contact numbers"
              value={form.witnesses}
              onChange={(e) => update("witnesses", e.target.value)}
            />
          </div>
          <div>
            <label style={S.label}>Evidence Available</label>
            <input
              style={S.input}
              placeholder="CCTV, photos, documents, etc."
              value={form.evidence}
              onChange={(e) => update("evidence", e.target.value)}
            />
          </div>

          {/* Contact + Address */}
          <div>
            <label style={S.label}>Your Contact Number</label>
            <input
              style={S.input}
              placeholder="+91 XXXXX XXXXX"
              value={form.contact_number}
              onChange={(e) => update("contact_number", e.target.value)}
            />
          </div>
          <div>
            <label style={S.label}>Your Address</label>
            <input
              style={S.input}
              placeholder="Residential address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </div>

        <div style={S.divider} />

        <button onClick={handleSubmit} disabled={loading} style={S.submitBtn}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

        <p style={S.notice}>
          By submitting this form you confirm that the information provided is
          accurate to the best of your knowledge. False complaints are
          punishable under IPC Section 182.
        </p>
      </div>
    </div>
  );
}

const accent = "#5b52f0";
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f4ff",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "32px 16px",
    display: "flex",
    justifyContent: "center",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#fff",
    borderRadius: "14px",
    padding: "32px",
    border: "1px solid #e9e6fb",
    boxShadow: "0 4px 24px rgba(91,82,240,0.07)",
    height: "fit-content",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  } as React.CSSProperties,
  pageTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    letterSpacing: "-0.02em",
  } as React.CSSProperties,
  pageSub: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "2px",
  } as React.CSSProperties,
  logoutBtn: {
    fontSize: "12px",
    color: "#6b7280",
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
  } as React.CSSProperties,
  modeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  } as React.CSSProperties,
  modeLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
  } as React.CSSProperties,
  modeToggle: {
    display: "flex",
    background: "#f5f4ff",
    padding: "3px",
    borderRadius: "7px",
    gap: "4px",
  } as React.CSSProperties,
  modeBtn: (active: boolean): React.CSSProperties => ({
    padding: "5px 16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    background: active ? "#fff" : "transparent",
    color: active ? accent : "#9ca3af",
    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
  }),
  divider: {
    height: "1px",
    background: "#f3f0ff",
    margin: "20px 0",
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  } as React.CSSProperties,
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#374151",
    display: "block",
    marginBottom: "5px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "9px 11px",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    color: "#1a1a2e",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "9px 11px",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
    color: "#1a1a2e",
  } as React.CSSProperties,
  typeGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  } as React.CSSProperties,
  typeBtn: (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: "20px",
    border: `1px solid ${active ? accent : "#e5e7eb"}`,
    background: active ? "#eeecfd" : "#fff",
    color: active ? accent : "#6b7280",
    fontSize: "12px",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
  }),
  submitBtn: {
    width: "100%",
    padding: "11px 0",
    background: accent,
    border: "none",
    borderRadius: "7px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  } as React.CSSProperties,
  notice: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
  } as React.CSSProperties,
  successIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#f0fdf4",
    border: "2px solid #86efac",
    color: "#16a34a",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  } as React.CSSProperties,
  successTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "8px",
  } as React.CSSProperties,
  successSub: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px",
    lineHeight: "1.6",
  } as React.CSSProperties,
  idBadge: {
    fontSize: "18px",
    fontWeight: "800",
    color: accent,
    letterSpacing: "0.05em",
    margin: "0 auto 8px",
    padding: "10px 20px",
    background: "#eeecfd",
    borderRadius: "8px",
    display: "inline-block",
  } as React.CSSProperties,
  btnOutline: {
    padding: "9px 24px",
    border: `1px solid ${accent}`,
    background: "transparent",
    borderRadius: "7px",
    color: accent,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  } as React.CSSProperties,
};
