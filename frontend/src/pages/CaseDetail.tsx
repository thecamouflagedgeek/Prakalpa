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

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
    recognition.lang = "en-IN";
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
  if (!complaint) return <div style={S.loading}>Loading case...</div>;

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={S.backBtn}
          >
            &#8592; Dashboard
          </button>
          <span style={S.dividerChar}>/</span>
          <span style={S.caseId}>{id}</span>
          <span
            style={{
              ...S.statusBadge,
              ...(filed ? S.statusFiled : S.statusReview),
            }}
          >
            {filed ? "FIR Filed" : "Under Review"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!filed && (
            <button onClick={fileFIR} disabled={filing} style={S.fileBtn}>
              {filing ? "Filing..." : "Officially File FIR"}
            </button>
          )}
          {filed && <span style={S.filedConfirm}>FIR filed successfully</span>}
          <button
            onClick={() => setVoiceOpen(true)}
            style={{
              padding: "7px 16px",
              background: "#eeecfd",
              border: "1px solid #ddd6fe",
              borderRadius: "7px",
              color: "#5b52f0",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
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
            Voice Assistant
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
          <div style={S.sectionTitle}>Citizen Complaint Details</div>

          {[
            { label: "Complainant", value: complaint.citizen_name },
            { label: "Contact", value: complaint.contact_number || "—" },
            { label: "Address", value: complaint.address || "—" },
            { label: "Incident Type", value: complaint.incident_type || "—" },
            {
              label: "Date & Time",
              value: `${complaint.incident_date || "—"} ${complaint.incident_time || ""}`,
            },
            { label: "Location", value: complaint.incident_location || "—" },
          ].map((row) => (
            <div key={row.label} style={S.detailRow}>
              <span style={S.detailLabel}>{row.label}</span>
              <span style={S.detailValue}>{row.value}</span>
            </div>
          ))}

          <div style={S.divider} />

          <div style={S.sectionTitle}>Incident Description</div>
          <p style={S.descText}>
            {complaint.incident_description || "No description provided."}
          </p>

          {complaint.accused_description && (
            <>
              <div style={S.sectionTitle}>Accused Description</div>
              <p style={S.descText}>{complaint.accused_description}</p>
            </>
          )}

          {complaint.witnesses && (
            <>
              <div style={S.sectionTitle}>Witnesses</div>
              <p style={S.descText}>{complaint.witnesses}</p>
            </>
          )}

          {complaint.evidence && (
            <>
              <div style={S.sectionTitle}>Evidence</div>
              <p style={S.descText}>{complaint.evidence}</p>
            </>
          )}
        </div>

        {/* Right: AI Voice Interface */}
        <div style={S.right}>
          <div style={S.chatHeader}>
            <div>
              <div style={S.sectionTitle}>AI Case Assistant</div>
              <div style={S.chatSub}>
                Ask questions about this case using voice or text
              </div>
            </div>
            <div style={S.aiOnline}>
              <div style={S.onlineDot} />
              <span>Active</span>
            </div>
          </div>

          {/* Quick prompts */}
          <div style={S.quickRow}>
            {[
              "What IPC sections apply?",
              "What evidence is needed?",
              "What are the next steps?",
              "Are there similar cases?",
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
                      color: "#9ca3af",
                      marginTop: "3px",
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
                          background: "#5b52f0",
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
              placeholder="Ask anything about this case..."
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
          {listening && <p style={S.listeningText}>Listening... speak now</p>}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.15)} }
      `}</style>
    </div>
  );
}

const accent = "#5b52f0";
const styles = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    color: "#6b7280",
  } as React.CSSProperties,
  page: {
    minHeight: "100vh",
    background: "#f5f4ff",
    fontFamily: "'Inter', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e9e6fb",
    padding: "0 28px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  } as React.CSSProperties,
  backBtn: {
    background: "none",
    border: "none",
    fontSize: "13px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "500",
  } as React.CSSProperties,
  dividerChar: { color: "#d1d5db", fontSize: "14px" } as React.CSSProperties,
  caseId: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1a1a2e",
  } as React.CSSProperties,
  statusBadge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 9px",
    borderRadius: "20px",
  } as React.CSSProperties,
  statusReview: {
    color: "#2563eb",
    background: "#eff6ff",
  } as React.CSSProperties,
  statusFiled: {
    color: "#16a34a",
    background: "#f0fdf4",
  } as React.CSSProperties,
  fileBtn: {
    padding: "7px 18px",
    background: accent,
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  } as React.CSSProperties,
  filedConfirm: {
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: "600",
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
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e9e6fb",
    padding: "20px",
    overflowY: "auto" as const,
  } as React.CSSProperties,
  right: {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e9e6fb",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    marginBottom: "10px",
  } as React.CSSProperties,
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
    gap: "12px",
  } as React.CSSProperties,
  detailLabel: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "500",
    flexShrink: 0,
  } as React.CSSProperties,
  detailValue: {
    fontSize: "12px",
    color: "#1a1a2e",
    fontWeight: "500",
    textAlign: "right" as const,
  } as React.CSSProperties,
  divider: {
    height: "1px",
    background: "#f3f0ff",
    margin: "14px 0",
  } as React.CSSProperties,
  descText: {
    fontSize: "13px",
    color: "#374151",
    lineHeight: "1.7",
    marginBottom: "14px",
  } as React.CSSProperties,
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  } as React.CSSProperties,
  chatSub: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "2px",
  } as React.CSSProperties,
  aiOnline: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#16a34a",
    fontWeight: "600",
  } as React.CSSProperties,
  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 5px #22c55e",
  } as React.CSSProperties,
  quickRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
    marginBottom: "14px",
  } as React.CSSProperties,
  quickBtn: {
    padding: "5px 11px",
    border: "1px solid #e9e6fb",
    borderRadius: "20px",
    background: "#faf9ff",
    color: "#6b7280",
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "500",
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
    borderRadius: "7px",
    background: accent,
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  officerAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#eeecfd",
    color: accent,
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  userBubble: {
    padding: "10px 14px",
    background: "#eeecfd",
    borderRadius: "10px 10px 2px 10px",
    fontSize: "13px",
    color: "#1a1a2e",
    lineHeight: "1.6",
    maxWidth: "400px",
  } as React.CSSProperties,
  aiBubble: {
    padding: "10px 14px",
    background: "#faf9ff",
    border: "1px solid #e9e6fb",
    borderRadius: "2px 10px 10px 10px",
    fontSize: "13px",
    color: "#374151",
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
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    color: "#1a1a2e",
  } as React.CSSProperties,
  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "7px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    flexShrink: 0,
  } as React.CSSProperties,
  iconBtnActive: {
    background: "#fef2f2",
    borderColor: "#fca5a5",
    color: "#ef4444",
  } as React.CSSProperties,
  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "7px",
    background: accent,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  } as React.CSSProperties,
  listeningText: {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "6px",
    fontWeight: "500",
  } as React.CSSProperties,
};
