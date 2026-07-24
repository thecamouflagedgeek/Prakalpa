import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import VoiceAssistant from "../components/VoiceAssistant";

interface VoiceMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Translation dictionary for Case Detail page
const translations = {
  en: {
    dashboard: "Dashboard",
    caseLabel: "CASE",
    firFiledStatus: "FIR Filed",
    underReviewStatus: "Under Review",
    filing: "Filing…",
    fileFir: "Officially File FIR",
    filedSuccess: "FIR filed successfully",
    voiceAssistant: "Voice Assistant",
    caseFile: "Case File",
    citizenComplaintDetails: "Citizen Complaint Details",
    complainant: "Complainant",
    contact: "Contact",
    address: "Address",
    incidentType: "Incident Type",
    dateTime: "Date & Time",
    location: "Location",
    incidentDescription: "Incident Description",
    accusedDescription: "Accused Description",
    witnesses: "Witnesses",
    evidence: "Evidence",
    aiCaseAssistant: "AI Case Assistant",
    aiChatSub: "Ask questions about this case using voice or text",
    active: "Active",
    quickPrompt1: "What IPC sections apply?",
    quickPrompt2: "What evidence is needed?",
    quickPrompt3: "What are the next steps?",
    quickPrompt4: "Are there similar cases?",
    inputPlaceholder: "Ask anything about this case…",
    listening: "Listening… speak now",
    loadingCase: "Loading case file…",
    noDesc: "No description provided.",
    switchLang: "ಕನ್ನಡ",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    caseLabel: "ಪ್ರಕರಣ",
    firFiledStatus: "ಎಫ್‌ಐಆರ್ ದಾಖಲಾಗಿದೆ",
    underReviewStatus: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    filing: "ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ…",
    fileFir: "ಅಧಿಕೃತ ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಿ",
    filedSuccess: "ಎಫ್‌ಐಆರ್ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ",
    voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
    caseFile: "ಪ್ರಕರಣದ ಫೈಲ್",
    citizenComplaintDetails: "ನಾಗರಿಕ ದೂರಿನ ವಿವರಗಳು",
    complainant: "ದೂರುದಾರರು",
    contact: "ಸಂಪರ್ಕ",
    address: "ವಿಳಾಸ",
    incidentType: "ಘಟನೆಯ ಮಾದರಿ",
    dateTime: "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
    location: "ಸ್ಥಳ",
    incidentDescription: "ಘಟನೆಯ ವಿವರಣೆ",
    accusedDescription: "ಆರೋಪಿಯ ವಿವರಣೆ",
    witnesses: "ಸಾಕ್ಷಿಗಳು",
    evidence: "ಸಾಕ್ಷ್ಯಾಧಾರ",
    aiCaseAssistant: "ಎಐ ಪ್ರಕರಣ ಸಹಾಯಕ",
    aiChatSub: "ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯವನ್ನು ಬಳಸಿ ಈ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ",
    active: "ಸಕ್ರಿಯವಾಗಿದೆ",
    quickPrompt1: "ಯಾವ ಐಪಿಸಿ ವಿಭಾಗಗಳು ಅನ್ವಯಿಸುತ್ತವೆ?",
    quickPrompt2: "ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಬೇಕಾಗುತ್ತವೆ?",
    quickPrompt3: "ಮುಂದಿನ ಕ್ರಮಗಳೇನು?",
    quickPrompt4: "ಇದೇ ರೀತಿಯ ಪ್ರಕರಣಗಳು ಇವೆಯೇ?",
    inputPlaceholder: "ಈ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ…",
    listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ… ಈಗ ಮಾತನಾಡಿ",
    loadingCase: "ಪ್ರಕರಣದ ಫೈಲ್ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…",
    noDesc: "ಯಾವುದೇ ವಿವರಣೆ ನೀಡಿಲ್ಲ.",
    switchLang: "English",
  },
};

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [complaint, setComplaint] = useState<any>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filing, setFiling] = useState(false);
  const [filed, setFiled] = useState(false);
  const [listening, setListening] = useState(false);
  const sessionId = useRef(`officer-${id}-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/v1/complaints/${id}`).then((r) => {
      setComplaint(r.data);
      // Auto-assign to this officer
      axios.patch(`http://localhost:8000/api/v1/complaints/${id}/assign`, {
        officer_username: user?.username,
      });
      // Seed first AI message with case context
      setMessages([
        {
          role: "assistant",
          content: `Case ${id} loaded. I have reviewed the citizen's complaint. You can ask me anything about this case — applicable IPC/BNS sections, similar past cases, evidence requirements, or next steps.`,
          timestamp: "Just Now",
        },
      ]);
    });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setMessages((p) => [
      ...p,
      {
        role: "user",
        content: msg,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
    setLoading(true);

    // Build context-aware prompt
    const contextPrompt = `
You are KAVACH AI, assisting a police officer reviewing a complaint.

Case Details:
- Complaint ID: ${complaint?.complaint_id}
- Incident Type: ${complaint?.incident_type}
- Date: ${complaint?.incident_date} ${complaint?.incident_time}
- Location: ${complaint?.incident_location}
- Description: ${complaint?.incident_description}
- Accused: ${complaint?.accused_description || "Unknown"}
- Witnesses: ${complaint?.witnesses || "None mentioned"}
- Evidence: ${complaint?.evidence || "None mentioned"}

Officer's question: ${msg}

Provide a precise, professional response. If applicable, suggest IPC/BNS sections, evidence requirements, or procedural next steps.`;

    try {
      const res = await axios.post("http://localhost:8000/api/v1/fir/chat", {
        session_id: sessionId.current,
        message: contextPrompt,
        language: "en",
      });
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: res.data.reply,
          timestamp: "Just Now",
        },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "Connection error. Please retry.",
          timestamp: "Just Now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "kn" ? "kn-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const fileFIR = async () => {
    setFiling(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/complaints/${id}/file-fir`,
      );
      setFiled(true);
    } finally {
      setFiling(false);
    }
  };

  const S = styles;
  if (!complaint) return <div style={S.loading}>{t.loadingCase}</div>;

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={S.backBtn}
          >
            &#8592; {t.dashboard}
          </button>
          <span style={S.dividerChar}>/</span>
          <span style={S.caseId}>
            {t.caseLabel} {id}
          </span>
          <span
            style={{
              ...S.statusBadge,
              ...(filed ? S.statusFiled : S.statusReview),
            }}
          >
            {filed ? t.firFiledStatus : t.underReviewStatus}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!filed && (
            <button onClick={fileFIR} disabled={filing} style={S.fileBtn}>
              {filing ? t.filing : t.fileFir}
            </button>
          )}
          {filed && <span style={S.filedConfirm}>{t.filedSuccess}</span>}

          {/* Header Translation Switcher Button */}
          <button onClick={toggleLanguage} type="button" style={S.langBtn}>
            <GlobeIcon color="#a9812f" size={13} />
            {t.switchLang}
          </button>

          <button onClick={() => setVoiceOpen(true)} style={S.voiceBtn}>
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
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            {t.voiceAssistant}
          </button>
        </div>

        {voiceOpen && complaint && (
          <VoiceAssistant
            caseId={id!}
            complaint={complaint}
            onClose={() => setVoiceOpen(false)}
          />
        )}
      </div>

      <div style={S.body}>
        {/* Left: Case Details */}
        <div style={S.left}>
          <div style={S.folderTab}>{t.caseFile}</div>

          <div style={S.sectionTitle}>{t.citizenComplaintDetails}</div>

          {[
            { label: t.complainant, value: complaint.citizen_name },
            { label: t.contact, value: complaint.contact_number || "—" },
            { label: t.address, value: complaint.address || "—" },
            { label: t.incidentType, value: complaint.incident_type || "—" },
            {
              label: t.dateTime,
              value: `${complaint.incident_date || "—"} ${complaint.incident_time || ""}`,
            },
            { label: t.location, value: complaint.incident_location || "—" },
          ].map((row) => (
            <div key={row.label} style={S.detailRow}>
              <span style={S.detailLabel}>{row.label}</span>
              <span style={S.detailValue}>{row.value}</span>
            </div>
          ))}

          <div style={S.divider} />

          <div style={S.sectionTitle}>{t.incidentDescription}</div>
          <p style={S.descText}>{complaint.incident_description || t.noDesc}</p>

          {complaint.accused_description && (
            <>
              <div style={S.sectionTitle}>{t.accusedDescription}</div>
              <p style={S.descText}>{complaint.accused_description}</p>
            </>
          )}

          {complaint.witnesses && (
            <>
              <div style={S.sectionTitle}>{t.witnesses}</div>
              <p style={S.descText}>{complaint.witnesses}</p>
            </>
          )}

          {complaint.evidence && (
            <>
              <div style={S.sectionTitle}>{t.evidence}</div>
              <p style={S.descText}>{complaint.evidence}</p>
            </>
          )}
        </div>

        {/* Right: AI Voice Interface */}
        <div style={S.right}>
          <div style={S.chatHeader}>
            <div>
              <div style={S.sectionTitle}>{t.aiCaseAssistant}</div>
              <div style={S.chatSub}>{t.aiChatSub}</div>
            </div>
            <div style={S.aiOnline}>
              <div style={S.onlineDot} />
              <span>{t.active}</span>
            </div>
          </div>

          {/* Quick prompts */}
          <div style={S.quickRow}>
            {[
              t.quickPrompt1,
              t.quickPrompt2,
              t.quickPrompt3,
              t.quickPrompt4,
            ].map((q) => (
              <button key={q} onClick={() => sendQuery(q)} style={S.quickBtn}>
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={S.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                {m.role === "assistant" && <div style={S.aiAvatar}>K</div>}
                <div>
                  <div style={m.role === "user" ? S.userBubble : S.aiBubble}>
                    {m.content}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9a9284",
                      marginTop: "3px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      textAlign: m.role === "user" ? "right" : "left",
                    }}
                  >
                    {m.timestamp}
                  </div>
                </div>
                {m.role === "user" && <div style={S.officerAvatar}>SI</div>}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <div style={S.aiAvatar}>K</div>
                <div style={S.aiBubble}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: accent,
                          animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={S.inputRow}>
            <input
              style={S.input}
              placeholder={t.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuery()}
            />
            <button
              onClick={startVoice}
              style={{ ...S.iconBtn, ...(listening ? S.iconBtnActive : {}) }}
              title="Voice input"
            >
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
            </button>
            <button
              onClick={() => sendQuery()}
              disabled={loading}
              style={S.sendBtn}
            >
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
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          {listening && <p style={S.listeningText}>{t.listening}</p>}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.15)} }
      `}</style>
    </div>
  );
}

function GlobeIcon({
  size = 13,
  color = "#a9812f",
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

/* ---- Dossier theme tokens ----
   navy    #1b2340  primary ink / authority
   paper   #f6f3ec  warm page background
   card    #fffdf9  warm white for panels
   caseRed #a3392f  stamp / seal color
   brass   #a9812f  accent, used sparingly
   ink-60  #5b6270  secondary text
*/
const navy = "#1b2340";
const paper = "#f6f3ec";
const card = "#fffdf9";
const caseRed = "#a3392f";
const brass = "#a9812f";
const inkMuted = "#5b6270";
const accent = navy;

const styles = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "'IBM Plex Mono', monospace",
    color: inkMuted,
    background: paper,
  } as React.CSSProperties,
  page: {
    minHeight: "100vh",
    background: paper,
    backgroundImage: `repeating-linear-gradient(0deg, rgba(27,35,64,0.035) 0px, rgba(27,35,64,0.035) 1px, transparent 1px, transparent 34px)`,
    fontFamily: "'Inter', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,
  topbar: {
    background: card,
    borderBottom: `2px dashed #ddd3bd`,
    padding: "0 28px",
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    boxShadow: "0 1px 0 rgba(27,35,64,0.04)",
  } as React.CSSProperties,
  backBtn: {
    background: "none",
    border: "none",
    fontSize: "13px",
    color: inkMuted,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "500",
  } as React.CSSProperties,
  dividerChar: { color: "#cbbfa3", fontSize: "14px" } as React.CSSProperties,
  caseId: {
    fontSize: "13px",
    fontWeight: "700",
    color: navy,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  statusBadge: {
    fontSize: "10.5px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "3px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: "'IBM Plex Mono', monospace",
  } as React.CSSProperties,
  statusReview: {
    color: navy,
    background: "transparent",
    border: `1px solid ${navy}`,
  } as React.CSSProperties,
  statusFiled: {
    color: caseRed,
    background: "transparent",
    border: `2px solid ${caseRed}`,
    transform: "rotate(-4deg)",
    boxShadow: `inset 0 0 0 2px rgba(163,57,47,0.15)`,
    display: "inline-block",
  } as React.CSSProperties,
  fileBtn: {
    padding: "7px 18px",
    background: navy,
    color: paper,
    border: `1px solid ${navy}`,
    borderRadius: "5px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  } as React.CSSProperties,
  filedConfirm: {
    fontSize: "13px",
    color: "#3f7a4d",
    fontWeight: "600",
  } as React.CSSProperties,
  langBtn: {
    padding: "7px 14px",
    background: "transparent",
    border: `1px solid ${brass}`,
    borderRadius: "5px",
    color: brass,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,
  voiceBtn: {
    padding: "7px 16px",
    background: "transparent",
    border: `1px solid ${brass}`,
    borderRadius: "5px",
    color: brass,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,
  body: {
    flex: 1,
    display: "flex",
    gap: "20px",
    padding: "24px 28px",
    overflow: "hidden",
  } as React.CSSProperties,
  left: {
    width: "340px",
    flexShrink: 0,
    background: card,
    borderRadius: "10px",
    border: "1px solid #e7dfc9",
    padding: "34px 20px 20px",
    overflowY: "auto" as const,
    position: "relative" as const,
    boxShadow: "0 2px 10px rgba(27,35,64,0.05)",
  } as React.CSSProperties,
  folderTab: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    background: navy,
    color: paper,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    padding: "5px 12px",
    borderRadius: "0 0 8px 0",
  } as React.CSSProperties,
  right: {
    flex: 1,
    background: card,
    borderRadius: "10px",
    border: "1px solid #e7dfc9",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(27,35,64,0.05)",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: navy,
    fontFamily: "'Source Serif 4', serif",
    letterSpacing: "0.02em",
    marginBottom: "10px",
    borderLeft: `3px solid ${brass}`,
    paddingLeft: "8px",
  } as React.CSSProperties,
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "11px",
    gap: "12px",
    borderBottom: "1px dotted #d8cfb8",
    paddingBottom: "6px",
  } as React.CSSProperties,
  detailLabel: {
    fontSize: "11px",
    color: inkMuted,
    fontWeight: "600",
    flexShrink: 0,
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  detailValue: {
    fontSize: "12.5px",
    color: navy,
    fontWeight: "500",
    textAlign: "right" as const,
  } as React.CSSProperties,
  divider: {
    height: "1px",
    background: "#e7dfc9",
    margin: "16px 0",
  } as React.CSSProperties,
  descText: {
    fontSize: "13.5px",
    color: "#33332e",
    lineHeight: "1.75",
    marginBottom: "14px",
    fontFamily: "'Source Serif 4', serif",
  } as React.CSSProperties,
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  } as React.CSSProperties,
  chatSub: {
    fontSize: "11px",
    color: inkMuted,
    marginTop: "2px",
  } as React.CSSProperties,
  aiOnline: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#3f7a4d",
    fontWeight: "600",
    fontFamily: "'IBM Plex Mono', monospace",
  } as React.CSSProperties,
  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#3f7a4d",
    boxShadow: "0 0 5px #3f7a4d",
  } as React.CSSProperties,
  quickRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
    marginBottom: "14px",
  } as React.CSSProperties,
  quickBtn: {
    padding: "5px 11px",
    border: `1px solid ${brass}`,
    borderRadius: "20px",
    background: "transparent",
    color: brass,
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "600",
  } as React.CSSProperties,
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    marginBottom: "14px",
    padding: "4px 0",
  } as React.CSSProperties,
  aiAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "4px",
    background: navy,
    color: paper,
    fontSize: "11px",
    fontWeight: "700",
    fontFamily: "'IBM Plex Mono', monospace",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transform: "rotate(-3deg)",
    boxShadow: "inset 0 0 0 2px rgba(246,243,236,0.25)",
  } as React.CSSProperties,
  officerAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#efe6cf",
    color: brass,
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "'IBM Plex Mono', monospace",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  userBubble: {
    padding: "10px 14px",
    background: "#efe9db",
    borderRadius: "10px 10px 2px 10px",
    fontSize: "13px",
    color: navy,
    lineHeight: "1.6",
    maxWidth: "400px",
  } as React.CSSProperties,
  aiBubble: {
    padding: "10px 14px",
    background: paper,
    border: "1px dashed #d8cfb8",
    borderRadius: "2px 10px 10px 10px",
    fontSize: "13px",
    color: "#33332e",
    lineHeight: "1.7",
    maxWidth: "480px",
  } as React.CSSProperties,
  inputRow: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
  } as React.CSSProperties,
  input: {
    flex: 1,
    padding: "9px 13px",
    border: "1px solid #d8cfb8",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    color: navy,
    background: paper,
  } as React.CSSProperties,
  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #d8cfb8",
    background: card,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: inkMuted,
    flexShrink: 0,
  } as React.CSSProperties,
  iconBtnActive: {
    background: "#f7e9e7",
    borderColor: caseRed,
    color: caseRed,
  } as React.CSSProperties,
  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    background: navy,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: paper,
    flexShrink: 0,
  } as React.CSSProperties,
  listeningText: {
    fontSize: "11px",
    color: caseRed,
    marginTop: "6px",
    fontWeight: "500",
    fontFamily: "'IBM Plex Mono', monospace",
  } as React.CSSProperties,
};
