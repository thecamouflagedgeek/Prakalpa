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

const translations = {
  en: {
    dashboard: "Dashboard",
    caseLabel: "CASE",
    firFiledStatus: "FIR Filed",
    underReviewStatus: "Under Review",
    filing: "Filing...",
    fileFir: "Officially File FIR",
    filedSuccess: "FIR filed successfully",
    voiceAssistant: "Voice Assistant",
    caseFile: "Case File",
    citizenComplaintDetails: "Complaint Details",
    complainant: "Complainant",
    victim: "Victim",
    citizen: "Registered Citizen",
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
    inputPlaceholder: "Ask anything about this case...",
    listening: "Listening... speak now",
    loadingCase: "Loading case file...",
    noDesc: "No description provided.",
    noData: "Not provided",
    switchLang: "ಕನ್ನಡ",
    loadingError: "Unable to load this case.",
    filingError: "Unable to file the FIR. Please try again.",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    caseLabel: "ಪ್ರಕರಣ",
    firFiledStatus: "ಎಫ್‌ಐಆರ್ ದಾಖಲಾಗಿದೆ",
    underReviewStatus: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    filing: "ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...",
    fileFir: "ಅಧಿಕೃತ ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಿ",
    filedSuccess: "ಎಫ್‌ಐಆರ್ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ",
    voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
    caseFile: "ಪ್ರಕರಣದ ಫೈಲ್",
    citizenComplaintDetails: "ದೂರಿನ ವಿವರಗಳು",
    complainant: "ದೂರುದಾರರು",
    victim: "ಸಂತ್ರಸ್ತರು",
    citizen: "ನೋಂದಾಯಿತ ನಾಗರಿಕ",
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
    inputPlaceholder: "ಈ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    loadingCase: "ಪ್ರಕರಣದ ಫೈಲ್ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    noDesc: "ಯಾವುದೇ ವಿವರಣೆ ನೀಡಿಲ್ಲ.",
    noData: "ನೀಡಲಾಗಿಲ್ಲ",
    switchLang: "English",
    loadingError: "ಈ ಪ್ರಕರಣವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    filingError: "ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
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
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [error, setError] = useState("");

  const sessionId = useRef(`officer-${id}-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

  useEffect(() => {
    if (!id) return;

    const loadCase = async () => {
      try {
        setError("");

        const response = await axios.get(
          `http://localhost:8000/api/v1/complaints/${id}`,
        );

        setComplaint(response.data);

        if (user?.username) {
          try {
            await axios.patch(
              `http://localhost:8000/api/v1/complaints/${id}/assign`,
              {
                officer_username: user.username,
              },
            );
          } catch {
            console.warn("Case assignment failed.");
          }
        }

        setMessages([
          {
            role: "assistant",
            content:
              "Case loaded successfully. I have reviewed the citizen's complaint. You can ask me about applicable IPC or BNS sections, evidence requirements, similar cases, or the next procedural steps.",
            timestamp: "Just Now",
          },
        ]);
      } catch {
        setError(t.loadingError);
      }
    };

    loadCase();
  }, [id, user?.username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async (text?: string) => {
    const msg = text || input;

    if (!msg.trim() || loading) return;

    setMessages((previous) => [
      ...previous,
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

    const contextPrompt = `
You are KAVACH AI, assisting a police officer reviewing a complaint.

Case Details:
* Complaint ID: ${complaint?.complaint_id || id}
* Complainant: ${complaint?.complainant_name || "Unknown"}
* Victim: ${complaint?.victim_name || "Unknown"}
* Incident Type: ${complaint?.incident_type || "Unknown"}
* Date: ${complaint?.incident_date || "Unknown"} ${
      complaint?.incident_time || ""
    }
* Location: ${complaint?.incident_location || "Unknown"}
* Description: ${complaint?.incident_description || "Not provided"}
* Accused: ${complaint?.accused_description || "Unknown"}
* Witnesses: ${complaint?.witnesses || "None mentioned"}
* Evidence: ${complaint?.evidence || "None mentioned"}

Officer's question:
${msg}

Provide a precise, professional response. If applicable, suggest IPC/BNS sections, evidence requirements, or procedural next steps.
`;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/fir/chat",
        {
          session_id: sessionId.current,
          message: contextPrompt,
          language: lang === "kn" ? "kn" : "en",
        },
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.reply,
          timestamp: "Just Now",
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            lang === "kn"
              ? "ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
              : "Connection error. Please retry.",
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
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = lang === "kn" ? "kn-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const fileFIR = async () => {
    if (!id || filing || filed) return;

    setFiling(true);

    try {
      await axios.patch(
        `http://localhost:8000/api/v1/complaints/${id}/file-fir`,
      );

      setFiled(true);
    } catch {
      alert(t.filingError);
    } finally {
      setFiling(false);
    }
  };

  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return t.noData;
    }

    return String(value);
  };

  if (!complaint) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner} />
          <div>{error || t.loadingCase}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={styles.backBtn}
          >
            <span style={styles.backIcon}>←</span>
            {t.dashboard}
          </button>

          <div style={styles.topbarDivider} />

          <div style={styles.caseIdentity}>
            <span style={styles.caseLabel}>{t.caseLabel}</span>
            <span style={styles.caseId}>{id}</span>
          </div>

          <span
            style={{
              ...styles.statusBadge,
              ...(filed ? styles.statusFiled : styles.statusReview),
            }}
          >
            <span style={styles.statusDot} />
            {filed ? t.firFiledStatus : t.underReviewStatus}
          </span>
        </div>

        <div style={styles.topbarActions}>
          {!filed && (
            <button
              onClick={fileFIR}
              disabled={filing}
              style={{
                ...styles.fileBtn,
                ...(filing ? styles.disabledBtn : {}),
              }}
            >
              <span style={styles.fileIcon}>✓</span>
              {filing ? t.filing : t.fileFir}
            </button>
          )}

          {filed && (
            <span style={styles.filedConfirm}>
              <span>✓</span>
              {t.filedSuccess}
            </span>
          )}

          <button onClick={toggleLanguage} style={styles.langBtn}>
            <GlobeIcon size={14} color={TEAL} />
            {t.switchLang}
          </button>

          <button onClick={() => setVoiceOpen(true)} style={styles.voiceBtn}>
            <MicrophoneIcon size={14} />
            {t.voiceAssistant}
          </button>
        </div>
      </header>

      <main style={styles.body}>
        <section style={styles.casePanel}>
          <div style={styles.panelAccent} />

          <div style={styles.panelHeader}>
            <div>
              <div style={styles.eyebrow}>KAVACH / CASE FILE</div>
              <h1 style={styles.panelTitle}>{t.citizenComplaintDetails}</h1>
            </div>

            <div style={styles.caseNumberBadge}>
              #{complaint.complaint_id || id}
            </div>
          </div>

          <div style={styles.infoGrid}>
            <InfoCard
              label={t.complainant}
              value={getValue(complaint.complainant_name)}
              icon="👤"
            />

            <InfoCard
              label={t.victim}
              value={getValue(complaint.victim_name)}
              icon="◉"
            />

            <InfoCard
              label={t.citizen}
              value={getValue(complaint.citizen_name)}
              icon="◎"
            />

            <InfoCard
              label={t.contact}
              value={getValue(complaint.contact_number)}
              icon="☎"
            />

            <InfoCard
              label={t.incidentType}
              value={getValue(complaint.incident_type)}
              icon="!"
            />

            <InfoCard
              label={t.dateTime}
              value={`${getValue(complaint.incident_date)} ${
                complaint.incident_time || ""
              }`}
              icon="◷"
            />

            <InfoCard
              label={t.location}
              value={getValue(complaint.incident_location)}
              icon="⌖"
              fullWidth
            />

            <InfoCard
              label={t.address}
              value={getValue(complaint.address)}
              icon="⌂"
              fullWidth
            />
          </div>

          <div style={styles.contentDivider} />

          <CaseTextSection
            title={t.incidentDescription}
            value={complaint.incident_description}
            fallback={t.noDesc}
          />

          {complaint.accused_description && (
            <CaseTextSection
              title={t.accusedDescription}
              value={complaint.accused_description}
              fallback={t.noDesc}
            />
          )}

          {complaint.witnesses && (
            <CaseTextSection
              title={t.witnesses}
              value={complaint.witnesses}
              fallback={t.noDesc}
            />
          )}

          {complaint.evidence && (
            <CaseTextSection
              title={t.evidence}
              value={complaint.evidence}
              fallback={t.noDesc}
            />
          )}
        </section>

        <section style={styles.aiPanel}>
          <div style={styles.aiHeader}>
            <div style={styles.aiHeaderIdentity}>
              <div style={styles.aiAvatarLarge}>K</div>

              <div>
                <div style={styles.eyebrow}>KAVACH INTELLIGENCE</div>
                <h2 style={styles.aiTitle}>{t.aiCaseAssistant}</h2>
                <p style={styles.aiSubtitle}>{t.aiChatSub}</p>
              </div>
            </div>

            <div style={styles.activeBadge}>
              <span style={styles.activeDot} />
              {t.active}
            </div>
          </div>

          <div style={styles.quickSection}>
            <div style={styles.quickLabel}>QUICK QUESTIONS</div>

            <div style={styles.quickRow}>
              {[
                t.quickPrompt1,
                t.quickPrompt2,
                t.quickPrompt3,
                t.quickPrompt4,
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => sendQuery(question)}
                  style={styles.quickBtn}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {message.role === "assistant" && (
                  <div style={styles.aiAvatar}>K</div>
                )}

                <div>
                  <div
                    style={
                      message.role === "user"
                        ? styles.userBubble
                        : styles.aiBubble
                    }
                  >
                    {message.content}
                  </div>

                  <div
                    style={{
                      ...styles.messageTime,
                      textAlign: message.role === "user" ? "right" : "left",
                    }}
                  >
                    {message.timestamp}
                  </div>
                </div>

                {message.role === "user" && (
                  <div style={styles.officerAvatar}>SI</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.messageRow}>
                <div style={styles.aiAvatar}>K</div>

                <div style={styles.aiBubble}>
                  <div style={styles.typingDots}>
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        style={{
                          ...styles.typingDot,
                          animationDelay: `${dot * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={styles.inputArea}>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                placeholder={t.inputPlaceholder}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendQuery();
                  }
                }}
              />

              <button
                onClick={startVoice}
                style={{
                  ...styles.iconBtn,
                  ...(listening ? styles.iconBtnActive : {}),
                }}
                title="Voice input"
              >
                <MicrophoneIcon size={16} />
              </button>

              <button
                onClick={() => sendQuery()}
                disabled={loading}
                style={{
                  ...styles.sendBtn,
                  ...(loading ? styles.disabledBtn : {}),
                }}
              >
                <SendIcon />
              </button>
            </div>

            {listening && (
              <p style={styles.listeningText}>
                <span style={styles.listeningDot} />
                {t.listening}
              </p>
            )}
          </div>
        </section>
      </main>

      {voiceOpen && complaint && (
        <VoiceAssistant
          caseId={id!}
          complaint={complaint}
          onClose={() => setVoiceOpen(false)}
        />
      )}

      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: .25;
            transform: scale(.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        * {
          box-sizing: border-box;
        }

        button,
        input {
          font: inherit;
        }

        button {
          transition:
            background .2s ease,
            border-color .2s ease,
            color .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        input:focus {
          border-color: ${TEAL} !important;
          box-shadow: 0 0 0 3px rgba(14, 140, 140, .12);
        }

        @media (max-width: 1050px) {
          .case-details-responsive {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  fullWidth = false,
}: {
  label: string;
  value: string;
  icon: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.infoCard,
        ...(fullWidth ? styles.infoCardFull : {}),
      }}
    >
      <div style={styles.infoIcon}>{icon}</div>

      <div style={styles.infoContent}>
        <div style={styles.infoLabel}>{label}</div>
        <div style={styles.infoValue}>{value}</div>
      </div>
    </div>
  );
}

function CaseTextSection({
  title,
  value,
  fallback,
}: {
  title: string;
  value?: string;
  fallback: string;
}) {
  return (
    <div style={styles.textSection}>
      <div style={styles.textSectionTitle}>
        <span style={styles.sectionMarker} />
        {title}
      </div>

      <p style={styles.textContent}>{value || fallback}</p>
    </div>
  );
}

function GlobeIcon({
  size = 14,
  color = TEAL,
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

function MicrophoneIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
}

function SendIcon() {
  return (
    <svg
      width="15"
      height="15"
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
}

const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const NAVY = "#152A43";
const NAVY_SOFT = "#2C4260";
const BG = "#EAF2F5";
const CARD = "#FFFFFF";
const BORDER = "#E3E9EC";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const TEAL_TINT = "#E1F5F5";
const GREEN = "#1F7A5C";
const RED = "#C94B4B";

const styles = {
  loading: {
    minHeight: "100vh",
    background: BG,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: TEXT,
  } as React.CSSProperties,

  loadingCard: {
    padding: "28px 36px",
    borderRadius: "14px",
    background: CARD,
    border: `1px solid ${BORDER}`,
    boxShadow: "0 12px 34px rgba(21,42,67,.08)",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "14px",
    fontWeight: "600",
    color: NAVY,
  } as React.CSSProperties,

  loadingSpinner: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: `3px solid ${TEAL_TINT}`,
    borderTopColor: TEAL,
    animation: "spin .8s linear infinite",
  } as React.CSSProperties,

  page: {
    minHeight: "100vh",
    background: BG,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: NAVY,
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,

  topbar: {
    minHeight: "68px",
    padding: "12px 28px",
    background: CARD,
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow: "0 2px 12px rgba(21,42,67,.04)",
    flexWrap: "wrap" as const,
    zIndex: 10,
  } as React.CSSProperties,

  topbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  topbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  backBtn: {
    border: "none",
    background: "transparent",
    color: TEXT,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "7px 4px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,

  backIcon: {
    fontSize: "18px",
    color: TEAL,
    lineHeight: 1,
  } as React.CSSProperties,

  topbarDivider: {
    width: "1px",
    height: "22px",
    background: BORDER,
  } as React.CSSProperties,

  caseIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  } as React.CSSProperties,

  caseLabel: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: ".1em",
    color: MUTED,
  } as React.CSSProperties,

  caseId: {
    fontSize: "14px",
    fontWeight: "700",
    color: NAVY,
    letterSpacing: ".02em",
  } as React.CSSProperties,

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  statusReview: {
    color: "#9A6500",
    background: "#FFF7E3",
    border: "1px solid #F0D58C",
  } as React.CSSProperties,

  statusFiled: {
    color: GREEN,
    background: "#E8F6EF",
    border: "1px solid #A9DFC5",
  } as React.CSSProperties,

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#D89A22",
  } as React.CSSProperties,

  fileBtn: {
    padding: "9px 14px",
    background: NAVY,
    color: "#FFFFFF",
    border: "none",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    boxShadow: "0 4px 12px rgba(21,42,67,.14)",
  } as React.CSSProperties,

  fileIcon: {
    fontSize: "14px",
  } as React.CSSProperties,

  filedConfirm: {
    padding: "8px 12px",
    borderRadius: "7px",
    background: "#E8F6EF",
    color: GREEN,
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    gap: "6px",
    alignItems: "center",
  } as React.CSSProperties,

  langBtn: {
    padding: "8px 12px",
    background: TEAL_TINT,
    border: `1px solid ${TEAL}`,
    borderRadius: "7px",
    color: TEAL_DARK,
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  } as React.CSSProperties,

  voiceBtn: {
    padding: "9px 14px",
    background: TEAL,
    border: `1px solid ${TEAL}`,
    borderRadius: "7px",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    boxShadow: "0 4px 12px rgba(14,140,140,.2)",
  } as React.CSSProperties,

  body: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "minmax(360px, 0.9fr) minmax(500px, 1.5fr)",
    gap: "20px",
    padding: "24px 28px",
    minHeight: "calc(100vh - 68px)",
    overflow: "hidden",
  } as React.CSSProperties,

  casePanel: {
    position: "relative",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: "16px",
    padding: "26px",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(21,42,67,.06)",
  } as React.CSSProperties,

  panelAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    borderRadius: "16px 16px 0 0",
    background: `linear-gradient(90deg, ${TEAL}, ${NAVY})`,
  } as React.CSSProperties,

  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "22px",
  } as React.CSSProperties,

  eyebrow: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: ".1em",
    color: TEAL,
    textTransform: "uppercase" as const,
    marginBottom: "6px",
  } as React.CSSProperties,

  panelTitle: {
    margin: 0,
    fontSize: "21px",
    lineHeight: "1.2",
    fontWeight: "750",
    color: NAVY,
    letterSpacing: "-.02em",
  } as React.CSSProperties,

  caseNumberBadge: {
    padding: "7px 10px",
    background: BG,
    color: NAVY_SOFT,
    border: `1px solid ${BORDER}`,
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  } as React.CSSProperties,

  infoCard: {
    minWidth: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px",
    borderRadius: "10px",
    background: "#F8FAFB",
    border: `1px solid ${BORDER}`,
  } as React.CSSProperties,

  infoCardFull: {
    gridColumn: "1 / -1",
  } as React.CSSProperties,

  infoIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: TEAL_TINT,
    color: TEAL_DARK,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  } as React.CSSProperties,

  infoContent: {
    minWidth: 0,
    flex: 1,
  } as React.CSSProperties,

  infoLabel: {
    fontSize: "9px",
    fontWeight: "700",
    color: MUTED,
    letterSpacing: ".06em",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
  } as React.CSSProperties,

  infoValue: {
    fontSize: "12px",
    lineHeight: "1.45",
    color: NAVY,
    fontWeight: "600",
    overflowWrap: "anywhere" as const,
  } as React.CSSProperties,

  contentDivider: {
    height: "1px",
    background: BORDER,
    margin: "22px 0",
  } as React.CSSProperties,

  textSection: {
    marginBottom: "20px",
  } as React.CSSProperties,

  textSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    fontWeight: "700",
    color: NAVY_SOFT,
    textTransform: "uppercase" as const,
    letterSpacing: ".06em",
    marginBottom: "8px",
  } as React.CSSProperties,

  sectionMarker: {
    width: "4px",
    height: "16px",
    borderRadius: "4px",
    background: TEAL,
  } as React.CSSProperties,

  textContent: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.75",
    color: TEXT,
    background: "#F8FAFB",
    border: `1px solid ${BORDER}`,
    borderRadius: "9px",
    padding: "13px",
  } as React.CSSProperties,

  aiPanel: {
    minWidth: 0,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    flexDirection: "column" as const,
    minHeight: 0,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(21,42,67,.06)",
  } as React.CSSProperties,

  aiHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${BORDER}`,
  } as React.CSSProperties,

  aiHeaderIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,

  aiAvatarLarge: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`,
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
    boxShadow: "0 8px 18px rgba(14,140,140,.2)",
  } as React.CSSProperties,

  aiTitle: {
    margin: 0,
    fontSize: "18px",
    color: NAVY,
    fontWeight: "750",
    letterSpacing: "-.02em",
  } as React.CSSProperties,

  aiSubtitle: {
    margin: "4px 0 0",
    fontSize: "11px",
    color: MUTED,
  } as React.CSSProperties,

  activeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 9px",
    borderRadius: "20px",
    background: "#E8F6EF",
    color: GREEN,
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  activeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: GREEN,
    boxShadow: `0 0 0 3px rgba(31,122,92,.12)`,
  } as React.CSSProperties,

  quickSection: {
    padding: "14px 0",
    borderBottom: `1px solid ${BORDER}`,
  } as React.CSSProperties,

  quickLabel: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: ".08em",
    color: MUTED,
    marginBottom: "8px",
  } as React.CSSProperties,

  quickRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "7px",
  } as React.CSSProperties,

  quickBtn: {
    padding: "7px 10px",
    border: `1px solid ${BORDER}`,
    borderRadius: "20px",
    background: "#F8FAFB",
    color: NAVY_SOFT,
    fontSize: "10px",
    fontWeight: "600",
    cursor: "pointer",
  } as React.CSSProperties,

  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    padding: "18px 4px",
  } as React.CSSProperties,

  messageRow: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  } as React.CSSProperties,

  aiAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: TEAL,
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  officerAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#E8EEF3",
    color: NAVY,
    fontSize: "9px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  aiBubble: {
    padding: "11px 13px",
    background: "#F8FAFB",
    border: `1px solid ${BORDER}`,
    borderRadius: "4px 12px 12px 12px",
    fontSize: "12.5px",
    color: NAVY_SOFT,
    lineHeight: "1.65",
    maxWidth: "520px",
  } as React.CSSProperties,

  userBubble: {
    padding: "11px 13px",
    background: TEAL_TINT,
    border: `1px solid rgba(14,140,140,.16)`,
    borderRadius: "12px 12px 4px 12px",
    fontSize: "12.5px",
    color: NAVY,
    lineHeight: "1.65",
    maxWidth: "420px",
  } as React.CSSProperties,

  messageTime: {
    fontSize: "9px",
    color: MUTED,
    marginTop: "4px",
  } as React.CSSProperties,

  typingDots: {
    display: "flex",
    gap: "4px",
  } as React.CSSProperties,

  typingDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: TEAL,
    animation: "blink 1.2s ease-in-out infinite",
  } as React.CSSProperties,

  inputArea: {
    paddingTop: "14px",
    borderTop: `1px solid ${BORDER}`,
  } as React.CSSProperties,

  inputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  } as React.CSSProperties,

  input: {
    flex: 1,
    minWidth: 0,
    padding: "11px 13px",
    border: `1px solid ${BORDER}`,
    borderRadius: "8px",
    fontSize: "12px",
    outline: "none",
    fontFamily: "inherit",
    color: NAVY,
    background: "#F8FAFB",
  } as React.CSSProperties,

  iconBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    border: `1px solid ${BORDER}`,
    background: CARD,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: TEXT,
    flexShrink: 0,
  } as React.CSSProperties,

  iconBtnActive: {
    background: "#FFF0F0",
    borderColor: RED,
    color: RED,
  } as React.CSSProperties,

  sendBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    background: TEAL,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    flexShrink: 0,
  } as React.CSSProperties,

  listeningText: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: "7px 0 0",
    fontSize: "10px",
    color: RED,
    fontWeight: "600",
  } as React.CSSProperties,

  listeningDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: RED,
  } as React.CSSProperties,

  disabledBtn: {
    opacity: 0.6,
    cursor: "not-allowed",
  } as React.CSSProperties,
};
