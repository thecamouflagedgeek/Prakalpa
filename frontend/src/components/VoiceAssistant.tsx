import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useVoice } from "../hooks/useVoice";

interface Message {
  role: "officer" | "ai";
  content: string;
  time: string;
}

interface Props {
  caseId: string;
  complaint: any;
  onClose: () => void;
}

export default function VoiceAssistant({ caseId, complaint, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Case ${caseId} loaded. I am ready to assist. Press the microphone and ask me anything about this case.`,
      time: now(),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<
    "idle" | "listening" | "thinking" | "speaking"
  >("idle");

  const sessionId = useRef(`voice-${caseId}-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [selectedLang, setSelectedLang] = useState<"en" | "kn" | null>(null);

  const {
    listening,
    speaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice();

  // Dynamic quick queries based on selected language
  const quickQueries = {
    en: [
      "What IPC sections apply to this case?",
      "What evidence should be collected?",
      "What are the next procedural steps?",
      "Summarize this case for me",
      "Are there any red flags in this complaint?",
      "What is the bail eligibility for this offence?",
    ],
    kn: [
      "ಈ ಪ್ರಕರಣಕ್ಕೆ ಯಾವ ಐಪಿಸಿ ಸೆಕ್ಷನ್‌ಗಳು ಅನ್ವಯಿಸುತ್ತವೆ?",
      "ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಸಂಗ್ರಹಿಸಬೇಕು?",
      "ಮುಂದಿನ ಕಾರ್ಯವಿಧಾನದ ಹಂತಗಳು ಯಾವುವು?",
      "ಈ ಪ್ರಕರಣವನ್ನು ನನಗೆ ಸಂಕ್ಷೇಪಿಸಿ",
      "ಈ ದೂರಿನಲ್ಲಿ ಯಾವುದೇ ಪ್ರಮುಖ ಲೋಪಗಳಿವೆಯೇ?",
      "ಈ ಅಪರಾಧಕ್ಕೆ ಜಾಮೀನು ಅರ್ಹತೆ ಇದೆಯೇ?",
    ],
  };

  useEffect(() => {
    if (!selectedLang) return;

    const timer = setTimeout(() => {
      const welcomeMessage =
        selectedLang === "kn"
          ? `ಪ್ರಕರಣ ${caseId} ಲೋಡ್ ಆಗಿದೆ. ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ. ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ.`
          : `Case ${caseId} loaded. I am ready to assist. Press the microphone and ask me anything.`;

      speak(welcomeMessage, selectedLang);
      setMode("speaking");

      setMessages([
        {
          role: "ai",
          content:
            selectedLang === "kn"
              ? `ಪ್ರಕರಣ ${caseId} ಲೋಡ್ ಆಗಿದೆ. ಈ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ.`
              : `Case ${caseId} loaded. I have reviewed the citizen's complaint. Ask me anything about this case.`,
          time: now(),
        },
      ]);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedLang]);

  useEffect(() => {
    if (listening) setMode("listening");
    else if (speaking) setMode("speaking");
    else if (loading) setMode("thinking");
    else setMode("idle");
  }, [listening, speaking, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function now() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const handleClose = () => {
    stopSpeaking();
    stopListening();
    onClose();
  };

  // Centralized prompt builder for context consistency
  const buildContextPrompt = (userQuery: string) => {
    const isKn = selectedLang === "kn";
    return `
You are KAVACH AI, an expert, professional police case assistant.

CRITICAL VOICE RESPONSE RULES:
- Language: Respond STRICTLY in ${isKn ? "Kannada (ಕನ್ನಡ)" : "English"}.
- Length: Maximum 2 to 3 concise sentences.
- Formatting: Absolutely NO markdown, NO bullet points, NO bold text, and NO lists. Plain text only, as it will be spoken directly via Text-to-Speech (TTS).

Case Details:
- Complaint ID: ${complaint?.complaint_id || caseId}
- Incident Type: ${complaint?.incident_type || "Unknown"}
- Date & Time: ${complaint?.incident_date || "Unknown"} ${complaint?.incident_time || ""}
- Location: ${complaint?.incident_location || "Unknown"}
- Description: ${complaint?.incident_description || "Not provided"}
- Accused: ${complaint?.accused_description || "Unknown"}
- Witnesses: ${complaint?.witnesses || "None"}
- Evidence: ${complaint?.evidence || "None"}

Officer's Query:
"${userQuery}"
`;
  };

  const executeQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setMessages((p) => [
      ...p,
      {
        role: "officer",
        content: queryText,
        time: now(),
      },
    ]);

    setLoading(true);

    const contextPrompt = buildContextPrompt(queryText);

    try {
      const res = await axios.post("https://prakalpa-backend.onrender.com/api/v1/fir/chat", {
        session_id: sessionId.current,
        message: contextPrompt,
        language: selectedLang || "en",
      });

      const reply = res.data.reply;

      setMessages((p) => [
        ...p,
        {
          role: "ai",
          content: reply,
          time: now(),
        },
      ]);

      speak(reply, selectedLang);
    } catch {
      const err =
        selectedLang === "kn"
          ? "ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
          : "Connection error. Please try again.";

      setMessages((p) => [
        ...p,
        {
          role: "ai",
          content: err,
          time: now(),
        },
      ]);

      speak(err, selectedLang);
    } finally {
      setLoading(false);
    }
  };

  const handleMic = () => {
    if (listening) {
      stopListening();
      return;
    }

    if (speaking) {
      stopSpeaking();
    }

    startListening(async (text) => {
      await executeQuery(text);
    }, selectedLang || "en");
  };

  const askQuickQuery = async (q: string) => {
    if (speaking) stopSpeaking();
    if (listening) stopListening();
    await executeQuery(q);
  };

  const modeConfig = {
    idle: {
      label: "Press mic to speak",
      ring: "#e9e6fb",
      dot: "#5b52f0",
    },

    listening: {
      label: "Listening...",
      ring: "#fee2e2",
      dot: "#ef4444",
    },

    thinking: {
      label: "Analyzing case...",
      ring: "#fef9c3",
      dot: "#d97706",
    },

    speaking: {
      label: "KAVACH is responding...",
      ring: "#dcfce7",
      dot: "#16a34a",
    },
  };

  const cfg = modeConfig[mode];

  return (
    <div style={S.overlay}>
      <div style={S.panel}>
        <div style={S.header}>
          <div style={S.headerInfo}>
            <div style={S.aiLogo}>
              <span>K</span>
            </div>

            <div>
              <div style={S.title}>Voice Case Assistant</div>

              <div style={S.sub}>
                Case {caseId} · AI-powered voice interface
              </div>
            </div>
          </div>

          <button onClick={handleClose} style={S.closeBtn}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {!selectedLang ? (
          <div style={S.languageGate}>
            <div style={S.languageIcon}>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b52f0"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>

            <div style={S.languageHeading}>
              <h2 style={S.languageHeadingTitle}>Choose your language</h2>

              <p style={S.languageHeadingSubtitle}>
                ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ · Select the language for this session
              </p>
            </div>

            <div style={S.languageOptions}>
              <button
                onClick={() => setSelectedLang("en")}
                style={S.languageCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#5b52f0";
                  e.currentTarget.style.background = "#f8f7ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={S.languageFlag}>🇬🇧</div>

                <div style={S.languageText}>
                  <strong style={S.languageTextStrong}>English</strong>

                  <span style={S.languageTextSpan}>Continue in English</span>
                </div>

                <span style={S.arrow}>→</span>
              </button>

              <button
                onClick={() => setSelectedLang("kn")}
                style={S.languageCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#5b52f0";
                  e.currentTarget.style.background = "#f8f7ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={S.languageFlag}>🇮🇳</div>

                <div style={S.languageText}>
                  <strong style={S.languageTextStrong}>ಕನ್ನಡ</strong>

                  <span style={S.languageTextSpan}>
                    ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ
                  </span>
                </div>

                <span style={S.arrow}>→</span>
              </button>
            </div>

            <p style={S.languageFooter}>
              You can change the language at any time during the session.
            </p>
          </div>
        ) : (
          <div style={S.bodyContent}>
            {/* LEFT SIDE: MIC & WAVEFORM */}
            <div style={S.leftSection}>
              <div style={S.visualizer}>
                <div
                  style={{
                    ...S.ring,
                    ...S.ring3,
                    background: cfg.ring,
                    opacity: mode !== "idle" ? 0.4 : 0,
                  }}
                />

                <div
                  style={{
                    ...S.ring,
                    ...S.ring2,
                    background: cfg.ring,
                    opacity: mode !== "idle" ? 0.6 : 0,
                  }}
                />

                <div
                  style={{
                    ...S.ring,
                    ...S.ring1,
                    background: cfg.ring,
                    opacity: mode !== "idle" ? 0.9 : 0,
                  }}
                />

                <button
                  onClick={handleMic}
                  disabled={loading}
                  style={{
                    ...S.micBtn,
                    background: listening ? "#ef4444" : "#5b52f0",
                  }}
                >
                  {listening ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </button>

                <div style={S.statusLabel}>
                  <div
                    style={{
                      ...S.statusDot,
                      background: cfg.dot,
                    }}
                  />

                  <span>{cfg.label}</span>
                </div>

                {listening && transcript && (
                  <div style={S.liveTranscript}>"{transcript}"</div>
                )}
              </div>

              {speaking && (
                <div style={S.waveform}>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        ...S.bar,
                        animationDelay: `${(i * 0.08) % 0.8}s`,
                        height: `${12 + Math.sin(i) * 10}px`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: CONVERSATION & QUICK QUERIES */}
            <div style={S.rightSection}>
              <div style={S.conversation}>
                <div style={S.convTitle}>Conversation</div>

                <div style={S.messages}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        justifyContent:
                          m.role === "officer" ? "flex-end" : "flex-start",
                      }}
                    >
                      {m.role === "ai" && <div style={S.aiAvatar}>K</div>}

                      <div>
                        <div
                          style={
                            m.role === "officer" ? S.officerBubble : S.aiBubble
                          }
                        >
                          {m.content}
                        </div>

                        <div
                          style={{
                            fontSize: "10px",
                            color: "#9ca3af",
                            marginTop: "3px",
                            textAlign: m.role === "officer" ? "right" : "left",
                          }}
                        >
                          {m.time}
                        </div>
                      </div>

                      {m.role === "officer" && (
                        <div style={S.officerAvatar}>SI</div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div style={S.loadingRow}>
                      <div style={S.aiAvatar}>K</div>

                      <div style={S.aiBubble}>
                        <div style={S.loadingDots}>
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#5b52f0",
                                animation: `blink 1.2s ease-in-out ${
                                  i * 0.2
                                }s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>

              <div style={S.quickSection}>
                <div style={S.convTitle}>Quick Queries</div>

                <div style={S.quickGrid}>
                  {quickQueries[selectedLang || "en"].map((q) => (
                    <button
                      key={q}
                      onClick={() => askQuickQuery(q)}
                      style={S.quickBtn}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: .92;
          }

          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(.4);
          }

          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(10, 8, 30, 0.68)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },

  panel: {
    width: "min(920px, 100%)",
    height: "min(860px, calc(100vh - 48px))",
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid #e9e6fb",
    boxShadow: "0 32px 100px rgba(31, 27, 82, 0.30)",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  header: {
    padding: "24px 30px",
    borderBottom: "1px solid #f0eefb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },

  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  aiLogo: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #5b52f0, #8179ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
    boxShadow: "0 8px 20px rgba(91,82,240,0.25)",
  },

  title: {
    fontSize: "18px",
    fontWeight: "750",
    color: "#1a1a2e",
    letterSpacing: "-0.02em",
  },

  sub: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  },

  closeBtn: {
    background: "#f5f4ff",
    border: "none",
    borderRadius: "10px",
    width: "38px",
    height: "38px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },

  languageGate: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "50px 80px",
    gap: "26px",
  },

  languageIcon: {
    width: "78px",
    height: "78px",
    borderRadius: "22px",
    background: "#eeecfd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  languageHeading: {
    textAlign: "center" as const,
  },

  languageHeadingTitle: {
    fontSize: "25px",
    fontWeight: "750",
    color: "#1a1a2e",
    margin: "0 0 8px",
  },

  languageHeadingSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  languageOptions: {
    width: "100%",
    maxWidth: "620px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  languageCard: {
    width: "100%",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left" as const,
    transition: "all 0.2s ease",
  },

  languageFlag: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f5f3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
  },

  languageText: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    flex: 1,
  },

  languageTextStrong: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a1a2e",
  },

  languageTextSpan: {
    fontSize: "11px",
    color: "#6b7280",
  },

  arrow: {
    fontSize: "20px",
    color: "#5b52f0",
    fontWeight: "600",
  },

  languageFooter: {
    fontSize: "11px",
    color: "#9ca3af",
    textAlign: "center" as const,
  },

  bodyContent: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },

  leftSection: {
    width: "320px",
    borderRight: "1px solid #f0eefb",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    gap: "24px",
    flexShrink: 0,
  },

  rightSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },

  visualizer: {
    padding: "20px 0",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "16px",
    position: "relative" as const,
    width: "100%",
  },

  ring: {
    position: "absolute" as const,
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },

  ring1: {
    width: "110px",
    height: "110px",
    top: "calc(50% - 63px)",
    left: "calc(50% - 55px)",
  },

  ring2: {
    width: "140px",
    height: "140px",
    top: "calc(50% - 78px)",
    left: "calc(50% - 70px)",
  },

  ring3: {
    width: "170px",
    height: "170px",
    top: "calc(50% - 93px)",
    left: "calc(50% - 85px)",
  },

  micBtn: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 32px rgba(91,82,240,0.38)",
    transition: "transform 0.15s, background 0.2s",
    zIndex: 1,
    animation: "pulse 2.5s ease-in-out infinite",
  },

  statusLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    marginTop: "8px",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    transition: "background 0.3s",
  },

  liveTranscript: {
    fontSize: "13px",
    color: "#5b52f0",
    fontStyle: "italic",
    maxWidth: "260px",
    textAlign: "center" as const,
    lineHeight: "1.6",
  },

  waveform: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    height: "36px",
    width: "100%",
  },

  bar: {
    width: "4px",
    borderRadius: "3px",
    background: "#5b52f0",
    opacity: 0.6,
    animation: "wave 0.8s ease-in-out infinite",
  },

  conversation: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    padding: "24px 30px 12px",
  },

  convTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "12px",
    flexShrink: 0,
  },

  messages: {
    flex: 1,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    paddingRight: "6px",
  },

  aiAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    background: "#5b52f0",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  officerAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#eeecfd",
    color: "#5b52f0",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  aiBubble: {
    padding: "12px 16px",
    background: "#faf9ff",
    border: "1px solid #e9e6fb",
    borderRadius: "3px 14px 14px 14px",
    fontSize: "13px",
    color: "#374151",
    lineHeight: "1.65",
    maxWidth: "420px",
  },

  officerBubble: {
    padding: "12px 16px",
    background: "#eeecfd",
    borderRadius: "14px 14px 3px 14px",
    fontSize: "13px",
    color: "#1a1a2e",
    lineHeight: "1.65",
    maxWidth: "380px",
  },

  loadingRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },

  loadingDots: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    padding: "3px 0",
  },

  quickSection: {
    padding: "18px 30px 24px",
    borderTop: "1px solid #f3f0ff",
    flexShrink: 0,
  },

  quickGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },

  quickBtn: {
    padding: "8px 13px",
    border: "1px solid #e9e6fb",
    borderRadius: "20px",
    background: "#faf9ff",
    color: "#6b7280",
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left" as const,
    lineHeight: "1.4",
    transition: "all 0.2s ease",
  },
};
