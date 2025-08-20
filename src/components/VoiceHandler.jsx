import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function VoiceHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const lastActionAt = useRef(0); // debounce

  // Start continuous listening once
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US", // change to "en-IN" if you prefer
    });
    return () => SpeechRecognition.stopListening();
  }, [browserSupportsSpeechRecognition]);

  // Parse & route on every new transcript chunk
  useEffect(() => {
    if (!transcript) return;

    const text = transcript.toLowerCase().trim();
    const now = Date.now();
    if (now - lastActionAt.current < 1200) return; // 1.2s debounce

    // commands (include a few synonyms)
    const goHome =
      text.includes("home") || text.includes("main") || text.includes("start");
    const goBack = text.includes("back") || text.includes("go back");
    const goNav =
      text.includes("navigate") || text.includes("navigation") || text.includes("route");
    const goDetect =
      text.includes("detect") || text.includes("detection") || text.includes("object");
    const goSOS =
      text.includes("sos") || text.includes("emergency") || text.includes("help");
    const goReport = text.includes("report") || text.includes("report issue");

    if (goHome) {
      navigate("/");
    } else if (goBack) {
      // always return to home for clarity (stable UX)
      if (location.pathname !== "/") navigate("/");
    } else if (goNav) {
      navigate("/navigation");
    } else if (goDetect) {
      navigate("/detection");
    } else if (goSOS) {
      navigate("/sos");
    } else if (goReport) {
      navigate("/report");
    } else {
      return; // no action
    }

    lastActionAt.current = now;
    resetTranscript(); // clear so it doesn’t retrigger
  }, [transcript, navigate, resetTranscript, location]);

  return null; // no UI; purely background listener
}
