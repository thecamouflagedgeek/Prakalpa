import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const INCIDENT_TYPES_EN = [
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

const INCIDENT_TYPES_KN = [
  "ಕಳವು (Theft)",
  "ದರೋಡೆ (Robbery)",
  "ಹಲ್ಲೆ (Assault)",
  "ಕನ್ನಗಳ್ಳತನ (Burglary)",
  "ವಂಚನೆ (Fraud)",
  "ಸೈಬರ್ ಅಪರಾಧ (Cybercrime)",
  "ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ (Missing Person)",
  "ವಾಹನ ಕಳವು (Vehicle Theft)",
  "ಕಿರುಕುಳ (Harassment)",
  "ಇತರೆ (Other)",
];

const translations = {
  en: {
    pageTitle: "File a Complaint",
    welcome: "Welcome,",
    signOut: "Sign out",
    mode: "Mode",
    formMode: "Form",
    chatMode: "Chat with AI",
    incidentType: "Incident Type *",
    dateOfIncident: "Date of Incident *",
    timeOfIncident: "Time of Incident",
    locationOfIncident: "Location of Incident *",
    locationPlaceholder: "Street, landmark, area, district",
    descriptionOfIncident: "Description of Incident *",
    descPlaceholder: "Describe what happened in as much detail as possible...",
    accusedDescription: "Description of Accused (if known)",
    accusedPlaceholder: "Physical appearance, name if known, vehicle, etc.",
    witnesses: "Witnesses",
    witnessesPlaceholder: "Names and contact numbers",
    evidenceAvailable: "Evidence Available",
    evidencePlaceholder: "CCTV, photos, documents, etc.",
    contactNumber: "Your Contact Number",
    contactPlaceholder: "+91 XXXXX XXXXX",
    address: "Your Address",
    addressPlaceholder: "Residential address",
    submitting: "Submitting...",
    submitComplaint: "Submit Complaint",
    notice:
      "By submitting this form you confirm that the information provided is accurate to the best of your knowledge. False complaints are punishable under IPC Section 182.",
    complaintSubmitted: "Complaint Submitted",
    submittedSub:
      "Your complaint has been received and assigned to the nearest available officer.",
    saveRef: "Save this reference number to track your complaint status.",
    returnHome: "Return to Home",
    fillAlert: "Please fill in incident type, location and description.",
    failAlert: "Submission failed. Please try again.",
    switchLang: "ಕನ್ನಡ",
  },
  kn: {
    pageTitle: "ದೂರು ದಾಖಲಿಸಿ",
    welcome: "ಸ್ವಾಗತ,",
    signOut: "ಹೊರಹೋಗಿ",
    mode: "ವಿಧಾನ",
    formMode: "ನಮೂನೆ",
    chatMode: "ಎಐ ಸಂಭಾಷಣೆ",
    incidentType: "ಘಟನೆಯ ಮಾದರಿ *",
    dateOfIncident: "ಘಟನೆಯ ದಿನಾಂಕ *",
    timeOfIncident: "ಘಟನೆಯ ಸಮಯ",
    locationOfIncident: "ಘಟನೆಯ ಸ್ಥಳ *",
    locationPlaceholder: "ರಸ್ತೆ, ಗುರುತು, ಪ್ರದೇಶ, ಜಿಲ್ಲೆ",
    descriptionOfIncident: "ಘಟನೆಯ ವಿವರಣೆ *",
    descPlaceholder: "ಏನು ಸಂಭವಿಸಿದೆ ಎಂಬುದನ್ನು ಸಾಧ್ಯವಾದಷ್ಟು ವಿವರವಾಗಿ ವಿವರಿಸಿ...",
    accusedDescription: "ಆರೋಪಿಯ ವಿವರಣೆ (ತಿಳಿದಿದ್ದರೆ)",
    accusedPlaceholder: "ಶಾರೀರಿಕ ನೋಟ, ಹೆಸರು, ವಾಹನ ಸಂಖ್ಯೆ ಇತ್ಯಾದಿ",
    witnesses: "ಸಾಕ್ಷಿಗಳು",
    witnessesPlaceholder: "ಹೆಸರುಗಳು ಮತ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು",
    evidenceAvailable: "ಲಭ್ಯವಿರುವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು",
    evidencePlaceholder: "ಸಿಸಿಟಿವಿ, ಫೋಟೋಗಳು, ದಾಖಲೆಗಳು ಇತ್ಯಾದಿ",
    contactNumber: "ನಿಮ್ಮ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
    contactPlaceholder: "+91 XXXXX XXXXX",
    address: "ನಿಮ್ಮ ವಿಳಾಸ",
    addressPlaceholder: "ವಾಸಸ್ಥಳದ ವಿಳಾಸ",
    submitting: "ಸಲ್ಲಿಕೆಯಾಗುತ್ತಿದೆ...",
    submitComplaint: "ದೂರು ಸಲ್ಲಿಸಿ",
    notice:
      "ಈ ನಮೂನೆಯನ್ನು ಸಲ್ಲಿಸುವ ಮೂಲಕ, ನೀಡಲಾದ ಮಾಹಿತಿಯು ನಿಮ್ಮ ಅರಿವಿಗೆ ತಕ್ಕಂತೆ ನಿಖರವಾಗಿದೆ ಎಂದು ನೀವು ದೃಢೀಕರಿಸುತ್ತೀರಿ. ಸುಳ್ಳು ದೂರುಗಳನ್ನು ನೀಡುವುದು ಐಪಿಸಿ ಸೆಕ್ಷನ್ 182 ರ ಅಡಿಯಲ್ಲಿ ಶಿಕ್ಷಾರ್ಹವಾಗಿದೆ.",
    complaintSubmitted: "ದೂರು ಸಲ್ಲಿಕೆಯಾಗಿದೆ",
    submittedSub:
      "ನಿಮ್ಮ ದೂರನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ಹತ್ತಿರದ ಲಭ್ಯವಿರುವ ಅಧಿಕಾರಿಗೆ ವಹಿಸಲಾಗಿದೆ.",
    saveRef:
      "ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಈ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿ.",
    returnHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    fillAlert: "ದಯವಿಟ್ಟು ಘಟನೆಯ ಮಾದರಿ, ಸ್ಥಳ ಮತ್ತು ವಿವರಣೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    failAlert: "ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    switchLang: "English",
  },
};

export default function CitizenPortal() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [mode, setMode] = useState<"form" | "chat">("form");
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[lang];
  const incidentTypes = lang === "kn" ? INCIDENT_TYPES_KN : INCIDENT_TYPES_EN;

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

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
      alert(t.fillAlert);
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
      alert(t.failAlert);
    } finally {
      setLoading(false);
    }
  };

  const S = styles;

  if (submitted) {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: "420px" }}>
          <div style={S.successIcon}>
            <CheckIcon />
          </div>
          <h2 style={S.successTitle}>{t.complaintSubmitted}</h2>
          <p style={S.successSub}>{t.submittedSub}</p>
          <div style={S.idBadge}>{complaintId}</div>
          <p style={S.idHint}>{t.saveRef}</p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.btnOutline}
          >
            {t.returnHome}
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
          <div style={S.headerLeft}>
            <div style={S.logoIcon}>
              <ShieldIcon size={17} color="#FFFFFF" />
            </div>
            <div>
              <div style={S.pageTitle}>{t.pageTitle}</div>
              <div style={S.pageSub}>
                {t.welcome} {user?.name}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Translate Button */}
            <button onClick={toggleLanguage} style={S.translateBtn}>
              <GlobeIcon size={14} color={TEAL} />
              {t.switchLang}
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={S.logoutBtn}
            >
              {t.signOut}
            </button>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={S.modeRow}>
          <span style={S.modeLabel}>{t.mode}</span>
          <div style={S.modeToggle}>
            {(["form", "chat"] as const).map((m) => (
              <button
                key={m}
                onClick={() =>
                  m === "chat" ? navigate("/fir-chat") : setMode(m)
                }
                style={S.modeBtn(m === mode)}
              >
                {m === "form" ? t.formMode : t.chatMode}
              </button>
            ))}
          </div>
        </div>

        <div style={S.divider} />

        {/* Form fields */}
        <div style={S.grid}>
          {/* Incident Type */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>{t.incidentType}</label>
            <div style={S.typeGrid}>
              {incidentTypes.map((typeLabel, idx) => {
                const typeVal = INCIDENT_TYPES_EN[idx];
                return (
                  <button
                    key={typeVal}
                    onClick={() => update("incident_type", typeVal)}
                    style={S.typeBtn(form.incident_type === typeVal)}
                  >
                    {typeLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Time */}
          <div>
            <label style={S.label}>{t.dateOfIncident}</label>
            <input
              style={S.input}
              type="date"
              value={form.incident_date}
              onChange={(e) => update("incident_date", e.target.value)}
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
          <div>
            <label style={S.label}>{t.timeOfIncident}</label>
            <input
              style={S.input}
              type="time"
              value={form.incident_time}
              onChange={(e) => update("incident_time", e.target.value)}
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

          {/* Location */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>{t.locationOfIncident}</label>
            <input
              style={S.input}
              placeholder={t.locationPlaceholder}
              value={form.incident_location}
              onChange={(e) => update("incident_location", e.target.value)}
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

          {/* Description */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>{t.descriptionOfIncident}</label>
            <textarea
              style={S.textarea}
              rows={4}
              placeholder={t.descPlaceholder}
              value={form.incident_description}
              onChange={(e) => update("incident_description", e.target.value)}
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

          {/* Accused */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>{t.accusedDescription}</label>
            <textarea
              style={S.textarea}
              rows={2}
              placeholder={t.accusedPlaceholder}
              value={form.accused_description}
              onChange={(e) => update("accused_description", e.target.value)}
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

          {/* Witnesses + Evidence */}
          <div>
            <label style={S.label}>{t.witnesses}</label>
            <input
              style={S.input}
              placeholder={t.witnessesPlaceholder}
              value={form.witnesses}
              onChange={(e) => update("witnesses", e.target.value)}
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
          <div>
            <label style={S.label}>{t.evidenceAvailable}</label>
            <input
              style={S.input}
              placeholder={t.evidencePlaceholder}
              value={form.evidence}
              onChange={(e) => update("evidence", e.target.value)}
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

          {/* Contact + Address */}
          <div>
            <label style={S.label}>{t.contactNumber}</label>
            <input
              style={S.input}
              placeholder={t.contactPlaceholder}
              value={form.contact_number}
              onChange={(e) => update("contact_number", e.target.value)}
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
          <div>
            <label style={S.label}>{t.address}</label>
            <input
              style={S.input}
              placeholder={t.addressPlaceholder}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
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
        </div>

        <div style={S.divider} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={S.submitBtn}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#0A6E6E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0E8C8C";
          }}
        >
          {loading ? t.submitting : t.submitComplaint}
        </button>

        <p style={S.notice}>{t.notice}</p>
      </div>
    </div>
  );
}

function GlobeIcon({
  size = 14,
  color = "#0E8C8C",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
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

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="#1F7A5C"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const NAVY = "#152A43";
const NAVY_SOFT = "#2C4260";
const BG_SECTION = "#EAF2F5";
const BORDER = "#E3E9EC";
const TEXT = "#5B6B7A";
const TEAL_TINT = "#E1F5F5";

const styles = {
  page: {
    minHeight: "100vh",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: "32px 16px",
    display: "flex",
    justifyContent: "center",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "32px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 12px 34px rgba(21,42,67,0.07)",
    height: "fit-content",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  } as React.CSSProperties,
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  pageTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: NAVY,
    letterSpacing: "-0.01em",
  } as React.CSSProperties,
  pageSub: {
    fontSize: "12px",
    color: "#9AA7B0",
    marginTop: "2px",
  } as React.CSSProperties,
  translateBtn: {
    fontSize: "12px",
    fontWeight: "600",
    color: TEAL,
    background: TEAL_TINT,
    border: `1px solid ${TEAL}`,
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,
  logoutBtn: {
    fontSize: "12px",
    color: TEXT,
    background: "none",
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    height: "fit-content",
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
    color: NAVY_SOFT,
  } as React.CSSProperties,
  modeToggle: {
    display: "flex",
    background: BG_SECTION,
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
    fontFamily: "'Inter', sans-serif",
    background: active ? "#FFFFFF" : "transparent",
    color: active ? TEAL : "#8A97A3",
    boxShadow: active ? "0 1px 4px rgba(21,42,67,0.10)" : "none",
  }),
  divider: {
    height: "1px",
    background: BORDER,
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
    color: NAVY_SOFT,
    display: "block",
    marginBottom: "5px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "9px 11px",
    border: `1px solid ${BORDER}`,
    borderRadius: "7px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    color: NAVY,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "9px 11px",
    border: `1px solid ${BORDER}`,
    borderRadius: "7px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
    color: NAVY,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  } as React.CSSProperties,
  typeGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  } as React.CSSProperties,
  typeBtn: (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: "20px",
    border: `1px solid ${active ? TEAL : BORDER}`,
    background: active ? TEAL_TINT : "#FFFFFF",
    color: active ? TEAL_DARK : "#8A97A3",
    fontSize: "12px",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  }),
  submitBtn: {
    width: "100%",
    padding: "11px 0",
    background: TEAL,
    border: "none",
    borderRadius: "7px",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s ease",
  } as React.CSSProperties,
  notice: {
    fontSize: "11px",
    color: "#9AA7B0",
    marginTop: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
  } as React.CSSProperties,
  successIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#E5F6EC",
    border: "2px solid #9FE1CB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  } as React.CSSProperties,
  successTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: NAVY,
    marginBottom: "8px",
  } as React.CSSProperties,
  successSub: {
    fontSize: "13px",
    color: TEXT,
    marginBottom: "16px",
    lineHeight: "1.6",
  } as React.CSSProperties,
  idBadge: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: TEAL_DARK,
    letterSpacing: "0.05em",
    margin: "0 auto 8px",
    padding: "10px 20px",
    background: TEAL_TINT,
    borderRadius: "8px",
    display: "inline-block",
  } as React.CSSProperties,
  idHint: {
    fontSize: "11px",
    color: "#9AA7B0",
    marginBottom: "20px",
  } as React.CSSProperties,
  btnOutline: {
    padding: "9px 24px",
    border: `1px solid ${TEAL}`,
    background: "transparent",
    borderRadius: "7px",
    color: TEAL_DARK,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
};
