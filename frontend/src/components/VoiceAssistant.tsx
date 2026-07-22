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
  const {
    listening,
    speaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice();

  // Speak the first message on open
  useEffect(() => {
    setTimeout(() => {
      speak(
        `Case ${caseId} loaded. I am ready to assist. Press the microphone and ask me anything.`,
      );
      setMode("speaking");
    }, 400);
  }, []);

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

  const handleMic = () => {
    if (listening) {
      stopListening();
      return;
    }
    if (speaking) {
      stopSpeaking();
    }

    startListening(async (text) => {
      if (!text.trim()) return;

      setMessages((p) => [
        ...p,
        { role: "officer", content: text, time: now() },
      ]);
      setLoading(true);

      const contextPrompt = `
You are KAVACH AI, a professional police case assistant. 
Be concise — your answer will be spoken aloud. Maximum 3 sentences.
Avoid bullet points or markdown.

Case Context:
- Complaint ID: ${complaint?.complaint_id}
- Incident Type: ${complaint?.incident_type || "Unknown"}
- Date: ${complaint?.incident_date} ${complaint?.incident_time || ""}
- Location: ${complaint?.incident_location || "Unknown"}
- Description: ${complaint?.incident_description || "Not provided"}
- Accused: ${complaint?.accused_description || "Unknown"}
- Witnesses: ${complaint?.witnesses || "None"}
- Evidence: ${complaint?.evidence || "None"}

Officer's question: ${text}`;

      try {
        const res = await axios.post("http://localhost:8000/api/v1/fir/chat", {
          session_id: sessionId.current,
          message: contextPrompt,
          language: "en",
        });

        const reply = res.data.reply;
        setMessages((p) => [...p, { role: "ai", content: reply, time: now() }]);
        speak(reply);
      } catch {
        const err = "Connection error. Please try again.";
        setMessages((p) => [...p, { role: "ai", content: err, time: now() }]);
        speak(err);
      } finally {
        setLoading(false);
      }
    });
  };

  const modeConfig = {
    idle: { label: "Press mic to speak", ring: "#e9e6fb", dot: "#5b52f0" },
    listening: { label: "Listening...", ring: "#fee2e2", dot: "#ef4444" },
    thinking: { label: "Analyzing case...", ring: "#fef9c3", dot: "#d97706" },
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
        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={S.title}>Voice Case Assistant</div>
            <div style={S.sub}>Case {caseId} — AI-powered voice interface</div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              stopListening();
              onClose();
            }}
            style={S.closeBtn}
          >
            <svg
              width="16"
              height="16"
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

        {/* Mic visualizer */}
        <div style={S.visualizer}>
          {/* Outer ring animation */}
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

          {/* Mic button */}
          <button
            onClick={handleMic}
            disabled={loading}
            style={{
              ...S.micBtn,
              background: listening ? "#ef4444" : "#5b52f0",
            }}
          >
            {listening ? (
              // Stop icon
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              // Mic icon
              <svg
                width="22"
                height="22"
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

          {/* Status label */}
          <div style={S.statusLabel}>
            <div style={{ ...S.statusDot, background: cfg.dot }} />
            <span>{cfg.label}</span>
          </div>

          {/* Live transcript */}
          {listening && transcript && (
            <div style={S.liveTranscript}>"{transcript}"</div>
          )}
        </div>

        {/* Waveform bars when speaking */}
        {speaking && (
          <div style={S.waveform}>
            {Array.from({ length: 20 }).map((_, i) => (
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

        {/* Conversation */}
        <div style={S.conversation}>
          <div style={S.convTitle}>Conversation</div>
          <div style={S.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  justifyContent:
                    m.role === "officer" ? "flex-end" : "flex-start",
                }}
              >
                {m.role === "ai" && <div style={S.aiAvatar}>K</div>}
                <div>
                  <div
                    style={m.role === "officer" ? S.officerBubble : S.aiBubble}
                  >
                    {m.content}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9ca3af",
                      marginTop: "2px",
                      textAlign: m.role === "officer" ? "right" : "left",
                    }}
                  >
                    {m.time}
                  </div>
                </div>
                {m.role === "officer" && <div style={S.officerAvatar}>SI</div>}
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
        </div>

        {/* Quick prompts */}
        <div style={S.quickSection}>
          <div style={S.convTitle}>Quick Queries</div>
          <div style={S.quickGrid}>
            {[
              "What IPC sections apply to this case?",
              "What evidence should be collected?",
              "What are the next procedural steps?",
              "Summarize this case for me",
              "Are there any red flags in this complaint?",
              "What is the bail eligibility for this offence?",
            ].map((q) => (
              <button
                key={q}
                onClick={async () => {
                  setMessages((p) => [
                    ...p,
                    { role: "officer", content: q, time: now() },
                  ]);
                  setLoading(true);
                  try {
                    const res = await axios.post(
                      "http://localhost:8000/api/v1/fir/chat",
                      {
                        session_id: sessionId.current,
                        message: `Context: ${JSON.stringify(complaint)}. Question: ${q}. Answer in max 2 sentences, no markdown.`,
                        language: "en",
                      },
                    );
                    const reply = res.data.reply;
                    setMessages((p) => [
                      ...p,
                      { role: "ai", content: reply, time: now() },
                    ]);
                    speak(reply);
                  } finally {
                    setLoading(false);
                  }
                }}
                style={S.quickBtn}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.08);opacity:1} }
        @keyframes wave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
      `}</style>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(10,8,30,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    zIndex: 1000,
    padding: "16px",
  },
  panel: {
    width: "460px",
    height: "calc(100vh - 32px)",
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e9e6fb",
    boxShadow: "0 24px 64px rgba(91,82,240,0.18)",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: {
    padding: "18px 20px",
    borderBottom: "1px solid #f3f0ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexShrink: 0,
  },
  title: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a1a2e",
    letterSpacing: "-0.01em",
  },
  sub: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  closeBtn: {
    background: "#f5f4ff",
    border: "none",
    borderRadius: "7px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
  visualizer: {
    padding: "28px 0 20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "14px",
    flexShrink: 0,
    position: "relative" as const,
  },
  ring: {
    position: "absolute" as const,
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
  ring1: {
    width: "96px",
    height: "96px",
    top: "calc(50% - 48px)",
    left: "calc(50% - 48px)",
  },
  ring2: {
    width: "116px",
    height: "116px",
    top: "calc(50% - 58px)",
    left: "calc(50% - 58px)",
  },
  ring3: {
    width: "136px",
    height: "136px",
    top: "calc(50% - 68px)",
    left: "calc(50% - 68px)",
  },
  micBtn: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(91,82,240,0.35)",
    transition: "transform 0.15s, background 0.2s",
    zIndex: 1,
    animation: "pulse 2.5s ease-in-out infinite",
  },
  statusLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
    marginTop: "8px",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  liveTranscript: {
    fontSize: "12px",
    color: "#5b52f0",
    fontStyle: "italic",
    maxWidth: "320px",
    textAlign: "center" as const,
    lineHeight: "1.5",
  },
  waveform: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    height: "32px",
    padding: "0 20px",
    flexShrink: 0,
  },
  bar: {
    width: "3px",
    borderRadius: "2px",
    background: "#5b52f0",
    opacity: 0.6,
    animation: "wave 0.8s ease-in-out infinite",
  },
  conversation: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    padding: "0 20px",
  },
  convTitle: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    marginBottom: "10px",
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  aiAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    background: "#5b52f0",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  officerAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#eeecfd",
    color: "#5b52f0",
    fontSize: "9px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiBubble: {
    padding: "9px 12px",
    background: "#faf9ff",
    border: "1px solid #e9e6fb",
    borderRadius: "2px 10px 10px 10px",
    fontSize: "12.5px",
    color: "#374151",
    lineHeight: "1.6",
    maxWidth: "320px",
  },
  officerBubble: {
    padding: "9px 12px",
    background: "#eeecfd",
    borderRadius: "10px 10px 2px 10px",
    fontSize: "12.5px",
    color: "#1a1a2e",
    lineHeight: "1.6",
    maxWidth: "280px",
  },
  quickSection: {
    padding: "14px 20px 16px",
    borderTop: "1px solid #f3f0ff",
    flexShrink: 0,
  },
  quickGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  },
  quickBtn: {
    padding: "5px 10px",
    border: "1px solid #e9e6fb",
    borderRadius: "20px",
    background: "#faf9ff",
    color: "#6b7280",
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left" as const,
    lineHeight: "1.4",
  },
};
