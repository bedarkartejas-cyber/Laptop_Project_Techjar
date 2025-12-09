"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useTextChat,
  useVoiceChat,
} from "../src/liveavatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { useAvatarActions } from "../src/liveavatar/useAvatarActions";

// --- Types for Hardware Data ---
interface LaptopScanData {
  from_scan: {
    cpu: string;
    ram: string;
    model: string;
  };
  specifications: {
    laptop_model: string;
    brand: string;
    cpu: string;
    gpu: string;
    ram_options: string;
    display: string;
    ports: string[];
    typical_price_range_in_inr: string;
  };
}

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Initializing System...");
  const initialized = useRef(false);

  // 1. Fetch Session Token
  const startSession = async () => {
    setStatus("Establishing Secure Link...");
    try {
      const res = await fetch("/api/start-session", { method: "POST" });
      if (!res.ok) throw new Error("Connection Refused");
      const data = await res.json();
      setSessionToken(data.session_token);
      setStatus("Link Established");
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startSession();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#191919] font-mono text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#111111] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-900/20 rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {!sessionToken ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl tracking-widest text-teal-400 animate-pulse">
              {error ? `ERROR: ${error}` : status}
            </div>
          </div>
        ) : (
          <LiveAvatarSession
            mode="FULL"
            sessionAccessToken={sessionToken}
            onSessionStopped={() => setSessionToken("")}
          />
        )}
      </div>
    </div>
  );
}

// --- AVATAR SESSION COMPONENT (The UI Implementation) ---
const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  sessionAccessToken: string;
  onSessionStopped: () => void;
}> = ({ mode, sessionAccessToken, onSessionStopped }) => {
  return (
    <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
      <DashboardUI mode={mode} onSessionStopped={onSessionStopped} />
    </LiveAvatarContextProvider>
  );
};

const DashboardUI: React.FC<{
  mode: "FULL" | "CUSTOM";
  onSessionStopped: () => void;
}> = ({ mode, onSessionStopped }) => {
  const [data, setData] = useState<LaptopScanData | null>(null);
  const [message, setMessage] = useState("");
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const hasGreetedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
  } = useSession();

  const {
    isUserTalking,
    isAvatarTalking,
    isActive,
    isLoading,
    start,
    stop,
    isMuted,
    unmute,
    mute,
  } = useVoiceChat();

  const { repeat, startListening, stopListening } = useAvatarActions(mode);
  const { sendMessage } = useTextChat(mode);

  // 1. Fetch Specs
  useEffect(() => {
    fetch("/laptop_fulla_specs.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => console.warn("Specs unavailable"));
  }, []);

  // 2. Manage Session Lifecycle
  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) onSessionStopped();
    if (sessionState === SessionState.INACTIVE) startSession();
  }, [sessionState, onSessionStopped, startSession]);

  // 3. Attach Video Stream
  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
      if (videoRef.current.muted) setIsVideoMuted(true);
    }
  }, [isStreamReady, attachElement]);

  // 4. Smart Greeting
  useEffect(() => {
    if (isStreamReady && !hasGreetedRef.current && data) {
      hasGreetedRef.current = true;
      setTimeout(() => {
        const text = `Hello! I see you are using the ${data.specifications.laptop_model}. It features a powerful ${data.specifications.cpu} processor. How can I assist you today?`;
        repeat(text);
      }, 1500);
    }
  }, [isStreamReady, data, repeat]);

  const toggleMic = () => (isMuted ? unmute() : mute());
  const enableAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
    }
  };

  return (
    <main className="w-full max-w-7xl flex flex-col items-center gap-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-indigo-200 tracking-tighter">
          CROMA AI ASSISTANT
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span
            className={`w-2 h-2 rounded-full ${sessionState === SessionState.CONNECTED ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-yellow-500"}`}
          />
          STATUS: {sessionState}
        </div>
      </header>

      {/* Main Interface */}
      <div className="w-full flex flex-col items-center gap-6">
        {/* AVATAR CONTAINER (Replaces Visualizer) */}
        <div className="relative w-full max-w-3xl aspect-video bg-black/40 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_-15px_rgba(20,184,166,0.3)] group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 opacity-50 blur-xl pointer-events-none" />

          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain relative z-10"
          />

          {/* Overlay Controls */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Audio Unlock Button */}
            {isVideoMuted && isStreamReady && (
              <button
                onClick={enableAudio}
                className="bg-red-500/90 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 backdrop-blur-md animate-pulse"
              >
                🔇 UNMUTE SYSTEM
              </button>
            )}

            {/* Mic Control */}
            <button
              onClick={toggleMic}
              className={`px-6 py-2 rounded-full font-bold backdrop-blur-md border ${
                !isMuted
                  ? "bg-teal-500/20 border-teal-500 text-teal-300"
                  : "bg-slate-800/80 border-slate-600 text-slate-400"
              }`}
            >
              {isMuted ? "MIC OFF" : "MIC ON"}
            </button>

            {/* Listening Control */}
            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow-lg backdrop-blur-md active:scale-95 transition-transform"
            >
              HOLD TO SPEAK
            </button>
          </div>

          {/* Active Speaker Indicators */}
          {isAvatarTalking && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded text-teal-300 text-xs font-bold animate-pulse z-20">
              AI SPEAKING
            </div>
          )}
          {isUserTalking && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded text-indigo-300 text-xs font-bold animate-pulse z-20">
              USER LISTENING
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="flex gap-2 w-full max-w-2xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(message);
                setMessage("");
              }
            }}
            placeholder="Type query to override voice module..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            onClick={() => {
              sendMessage(message);
              setMessage("");
            }}
            className="bg-slate-800 hover:bg-slate-700 text-teal-400 px-6 rounded-lg font-bold transition-colors border border-slate-700"
          >
            SEND
          </button>
        </div>
      </div>

      {/* DASHBOARD GRID (Specs) */}
      {data && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* CARD 1: PERFORMANCE */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-teal-500/30 transition-colors">
            <h2 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full" /> PERFORMANCE
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Processor
                </div>
                <div className="text-slate-200 font-medium font-sans">
                  {data.specifications.cpu}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Graphics
                </div>
                <div className="text-slate-200 font-medium font-sans">
                  {data.specifications.gpu}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Memory
                </div>
                <div className="text-slate-200 font-medium font-sans">
                  {data.specifications.ram_options}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: EXPERIENCE */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
            <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" /> EXPERIENCE
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Display
                </div>
                <div className="text-slate-200 font-medium font-sans">
                  {data.specifications.display}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  I/O Ports
                </div>
                <ul className="text-slate-300 text-sm list-disc pl-4 mt-1 font-sans">
                  {data.specifications.ports
                    ?.slice(0, 4)
                    .map((p, i) => <li key={i}>{p}</li>) || (
                    <li>Standard Ports</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* CARD 3: DEAL DETAILS */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-green-500/30 transition-colors">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> MARKET DATA
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Est. Price
                </div>
                <div className="text-3xl font-bold text-white font-sans">
                  {data.specifications.typical_price_range_in_inr}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">
                  Availability
                </div>
                <div className="text-orange-400 font-bold animate-pulse text-sm mt-1">
                  ⚠ LOW STOCK
                </div>
              </div>
              <div className="text-xs text-slate-600 mt-6 border-t border-slate-800 pt-4">
                DETECTED MODEL ID:{" "}
                <span className="font-mono text-slate-400">
                  {data.from_scan.model}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
