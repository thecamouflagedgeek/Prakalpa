import { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios'; 
// Extend SpeechRecognition interface for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useVoice() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);

  // 1. Populate available browser voices on mount
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    updateVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // 2. Speak function with locale & voice fallback handling
  const speak = useCallback(
  async (text: string, lang: "en" | "kn" | null = "en") => {
    if (!text || !text.trim()) return;

    if (lang === "kn") {
      setSpeaking(true);
      try {
        const res = await axios.post("http://localhost:8000/api/v1/fir/tts", {
          text,
          language: "kn",
        });
        const audio = new Audio(`data:audio/wav;base64,${res.data.audio_base64}`);
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        await audio.play();
      } catch (e) {
        console.error("Sarvam TTS failed:", e);
        setSpeaking(false);
      }
      return;
    }

    // existing browser speechSynthesis path for English, unchanged
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  },
  [voices]
);

  // 3. Stop speaking execution
  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  // 4. Start speech recognition (Microphone)
  const startListening = useCallback(
    (onFinalTranscript: (text: string) => void, lang: "en" | "kn" = "en") => {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass =
        win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }

      // Clean up existing recognition instance
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "kn" ? "kn-IN" : "en-US";

      recognition.onstart = () => {
        setListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        setTranscript(currentTranscript);

        // If the result is final, trigger the callback
        if (event.results[0].isFinal) {
          onFinalTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    },
    []
  );

  // 5. Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  return {
    listening,
    speaking,
    transcript,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}