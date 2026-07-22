import { useRef, useState } from "react"

export function useVoice() {
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  const startListening = (onResult: (text: string) => void) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert("Voice input requires Chrome browser.")
      return
    }

    const recognition = new SR()
    recognition.lang = "en-IN"
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setListening(true)
      setTranscript("")
    }

    recognition.onresult = (e: any) => {
      const current = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("")
      setTranscript(current)
      if (e.results[e.results.length - 1].isFinal) {
        onResult(current)
      }
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const speak = (text: string, onDone?: () => void) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    // Pick a clear voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Google")
    ) || voices.find((v) => v.lang.startsWith("en"))
    if (preferred) utterance.voice = preferred

    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => {
      setSpeaking(false)
      onDone?.()
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return {
    listening, speaking, transcript,
    startListening, stopListening, speak, stopSpeaking,
  }
}