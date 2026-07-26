import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  Home,
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  Users,
  Paperclip,
  MapPin,
  Calendar,
} from "lucide-react";

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
    eyebrow: "Citizen Portal",
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
    fillAlert:
      "Please fill in complainant name, victim name, incident type, location and description.",
    failAlert: "Submission failed. Please try again.",
    complainantName: "Complainant's Name *",
    complainantPlaceholder: "Enter the name of the person filing the complaint",
    victimName: "Victim's Name *",
    victimPlaceholder: "Enter the name of the victim",
    switchLang: "ಕನ್ನಡ",
    sectionComplainant: "Complainant & Victim",
    sectionIncident: "Incident Details",
    sectionAdditional: "Additional Information",
    sectionContact: "Contact Information",
    navHome: "Home",
    navFileComplaint: "File a Complaint",
    navTrackStatus: "Track FIR Status",
    navInformation: "Know Your Rights",
    navEmergency: "Emergency Contacts",
    navSettings: "Settings",
  },
  kn: {
    pageTitle: "ದೂರು ದಾಖಲಿಸಿ",
    eyebrow: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
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
    fillAlert:
      "ದಯವಿಟ್ಟು ದೂರುದಾರರ ಹೆಸರು, ಬಲಿಪಶುವಿನ ಹೆಸರು, ಘಟನೆಯ ಮಾದರಿ, ಸ್ಥಳ ಮತ್ತು ವಿವರಣೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    failAlert: "ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    complainantName: "ದೂರುದಾರರ ಹೆಸರು *",
    complainantPlaceholder: "ದೂರು ಸಲ್ಲಿಸುವ ವ್ಯಕ್ತಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    victimName: "ಬಲಿಪಶುವಿನ ಹೆಸರು *",
    victimPlaceholder: "ಬಲಿಪಶುವಿನ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    switchLang: "English",
    sectionComplainant: "ದೂರುದಾರರು ಮತ್ತು ಬಲಿಪಶು",
    sectionIncident: "ಘಟನೆಯ ವಿವರಗಳು",
    sectionAdditional: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ",
    sectionContact: "ಸಂಪರ್ಕ ಮಾಹಿತಿ",
    navHome: "ಮುಖಪುಟ",
    navFileComplaint: "ದೂರು ದಾಖಲಿಸಿ",
    navTrackStatus: "ಎಫ್‌ಐಆರ್ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    navInformation: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
    navEmergency: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    navSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
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
    complainant_name: user?.name || "",
    victim_name: "",
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
      !form.complainant_name ||
      !form.victim_name ||
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

  // ---- Sidebar (shared between form view and success view) ----
  // NOTE: route paths below are best-guess placeholders — update to match
  // your actual router config for the citizen-facing pages.
  const navItems = [
    { key: "home", label: t.navHome, icon: Home, path: "/citizen/dashboard" },
    {
      key: "complaint",
      label: t.navFileComplaint,
      icon: FileText,
      path: "/citizen/complaint",
    },
    {
      key: "track",
      label: t.navTrackStatus,
      icon: Search,
      path: "/citizen/track",
    },
    {
      key: "information",
      label: t.navInformation,
      icon: LifeBuoy,
      path: "/citizen/information",
    },
    {
      key: "emergency",
      label: t.navEmergency,
      icon: Phone,
      path: "/citizen/emergency",
    },
    {
      key: "settings",
      label: t.navSettings,
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  const Sidebar = (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogoRow}>
        <div style={S.sidebarLogoIcon}>
          <ShieldIcon size={18} color="#FFFFFF" />
        </div>
        <div>
          <div style={S.sidebarLogoTitle}>KAVACH</div>
          <div style={S.sidebarLogoSub}>{t.eyebrow}</div>
        </div>
      </div>

      <nav style={S.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === "complaint";
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              style={S.navItem(active)}
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

      <div style={S.sidebarFooter}>
        <div style={S.sidebarUserRow}>
          <div style={S.sidebarAvatar}>
            {(user?.name || "C").charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={S.sidebarUserName}>{user?.name || "Citizen"}</div>
            <div style={S.sidebarUserMeta}>{user?.username}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={S.sidebarLogoutBtn}
        >
          {t.signOut}
        </button>
      </div>
    </aside>
  );

  if (submitted) {
    return (
      <div style={S.page}>
        {Sidebar}
        <div style={S.main}>
          <div style={S.successWrap}>
            <div style={{ ...S.card, textAlign: "center", maxWidth: "440px" }}>
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
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {Sidebar}

      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarEyebrow}>{t.eyebrow}</div>
            <div style={S.topbarTitle}>{t.pageTitle}</div>
            <div style={S.topbarSub}>
              {t.welcome} {user?.name}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={toggleLanguage} style={S.translateBtn}>
              <GlobeIcon size={14} color={TEAL} />
              {t.switchLang}
            </button>
          </div>
        </div>

        <div style={S.body}>
          <div style={S.card}>
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

            {/* ---------- Section: Complainant & Victim ---------- */}
            <div style={S.section}>
              <div style={S.sectionHead}>
                <Users size={15} color={TEAL_DARK} />
                <span style={S.sectionTitle}>{t.sectionComplainant}</span>
              </div>
              <div style={S.grid}>
                <div>
                  <label style={S.label}>{t.complainantName}</label>
                  <input
                    style={S.input}
                    placeholder={t.complainantPlaceholder}
                    value={form.complainant_name}
                    onChange={(e) => update("complainant_name", e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={S.label}>{t.victimName}</label>
                  <input
                    style={S.input}
                    placeholder={t.victimPlaceholder}
                    value={form.victim_name}
                    onChange={(e) => update("victim_name", e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Section: Incident Details ---------- */}
            <div style={S.section}>
              <div style={S.sectionHead}>
                <FileText size={15} color={TEAL_DARK} />
                <span style={S.sectionTitle}>{t.sectionIncident}</span>
              </div>
              <div style={S.grid}>
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

                <div>
                  <label style={S.label}>
                    <Calendar
                      size={11}
                      style={{ marginRight: 4, verticalAlign: "-1.5px" }}
                    />
                    {t.dateOfIncident}
                  </label>
                  <input
                    style={S.input}
                    type="date"
                    value={form.incident_date}
                    onChange={(e) => update("incident_date", e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
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
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={S.label}>
                    <MapPin
                      size={11}
                      style={{ marginRight: 4, verticalAlign: "-1.5px" }}
                    />
                    {t.locationOfIncident}
                  </label>
                  <input
                    style={S.input}
                    placeholder={t.locationPlaceholder}
                    value={form.incident_location}
                    onChange={(e) =>
                      update("incident_location", e.target.value)
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={S.label}>{t.descriptionOfIncident}</label>
                  <textarea
                    style={S.textarea}
                    rows={4}
                    placeholder={t.descPlaceholder}
                    value={form.incident_description}
                    onChange={(e) =>
                      update("incident_description", e.target.value)
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Section: Additional Information ---------- */}
            <div style={S.section}>
              <div style={S.sectionHead}>
                <Paperclip size={15} color={TEAL_DARK} />
                <span style={S.sectionTitle}>{t.sectionAdditional}</span>
              </div>
              <div style={S.grid}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={S.label}>{t.accusedDescription}</label>
                  <textarea
                    style={S.textarea}
                    rows={2}
                    placeholder={t.accusedPlaceholder}
                    value={form.accused_description}
                    onChange={(e) =>
                      update("accused_description", e.target.value)
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={S.label}>{t.witnesses}</label>
                  <input
                    style={S.input}
                    placeholder={t.witnessesPlaceholder}
                    value={form.witnesses}
                    onChange={(e) => update("witnesses", e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
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
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Section: Contact Information ---------- */}
            <div style={{ ...S.section, marginBottom: 0 }}>
              <div style={S.sectionHead}>
                <Phone size={15} color={TEAL_DARK} />
                <span style={S.sectionTitle}>{t.sectionContact}</span>
              </div>
              <div style={S.grid}>
                <div>
                  <label style={S.label}>{t.contactNumber}</label>
                  <input
                    style={S.input}
                    placeholder={t.contactPlaceholder}
                    value={form.contact_number}
                    onChange={(e) => update("contact_number", e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
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
                      e.target.style.borderColor = TEAL;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,140,140,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={S.divider} />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={S.submitBtn}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = TEAL_DARK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = TEAL;
              }}
            >
              {loading ? t.submitting : t.submitComplaint}
            </button>

            <p style={S.notice}>{t.notice}</p>
          </div>
        </div>
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
const NAVY_DEEP = "#0E2438";
const NAVY_SOFT = "#2C4260";
const BG_SECTION = "#EAF2F5";
const BORDER = "#E3E9EC";
const TEXT = "#5B6B7A";
const TEAL_TINT = "#E1F5F5";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  // ---------- Sidebar ----------
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
    textTransform: "uppercase" as const,
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
  }),
  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    marginTop: 12,
  } as React.CSSProperties,
  sidebarUserRow: {
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
  sidebarUserName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarUserMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarLogoutBtn: {
    width: "100%",
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

  // ---------- Main ----------
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
    alignItems: "flex-start",
    justifyContent: "space-between",
  } as React.CSSProperties,
  topbarEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: TEAL_DARK,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 4,
  } as React.CSSProperties,
  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: "-0.01em",
  } as React.CSSProperties,
  topbarSub: {
    fontSize: 12.5,
    color: TEXT,
    marginTop: 3,
  } as React.CSSProperties,

  body: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 32px 60px",
    display: "flex",
    justifyContent: "center",
  } as React.CSSProperties,

  successWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
  } as React.CSSProperties,

  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "28px 32px 32px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 12px 34px rgba(21,42,67,0.06)",
    height: "fit-content",
  } as React.CSSProperties,

  translateBtn: {
    fontSize: "12px",
    fontWeight: "600",
    color: TEAL,
    background: TEAL_TINT,
    border: `1px solid ${TEAL}`,
    borderRadius: "20px",
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,

  modeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "22px",
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

  // ---------- Sectioned form panels ----------
  section: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderLeft: `3px solid ${TEAL}`,
    borderRadius: "3px 12px 12px 3px",
    padding: "16px 18px 18px",
    marginBottom: "16px",
  } as React.CSSProperties,
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 800,
    color: NAVY,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  } as React.CSSProperties,

  divider: {
    height: "1px",
    background: BORDER,
    margin: "8px 0 20px",
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
    background: "#FFFFFF",
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
    background: "#FFFFFF",
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
    padding: "12px 0",
    background: TEAL,
    border: "none",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "13.5px",
    fontWeight: "700",
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
