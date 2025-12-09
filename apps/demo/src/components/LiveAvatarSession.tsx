// // // "use client";

// // // import React, { useEffect, useRef, useState } from "react";
// // // import {
// // //   LiveAvatarContextProvider,
// // //   useSession,
// // //   useTextChat,
// // //   useVoiceChat,
// // // } from "../liveavatar";
// // // import { SessionState } from "@heygen/liveavatar-web-sdk";
// // // import { useAvatarActions } from "../liveavatar/useAvatarActions";

// // // const Button: React.FC<{
// // //   onClick: () => void;
// // //   disabled?: boolean;
// // //   children: React.ReactNode;
// // // }> = ({ onClick, disabled, children }) => {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       disabled={disabled}
// // //       className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
// // //     >
// // //       {children}
// // //     </button>
// // //   );
// // // };

// // // const LiveAvatarSessionComponent: React.FC<{
// // //   mode: "FULL" | "CUSTOM";
// // //   onSessionStopped: () => void;
// // // }> = ({ mode, onSessionStopped }) => {
// // //   const [message, setMessage] = useState("");
// // //   const [isVideoMuted, setIsVideoMuted] = useState(true);
// // //   const hasGreetedRef = useRef(false);
// // //   const [systemSpecs, setSystemSpecs] = useState<any>(null);

// // //   const {
// // //     sessionState,
// // //     isStreamReady,
// // //     startSession,
// // //     stopSession,
// // //     connectionQuality,
// // //     keepAlive,
// // //     attachElement,
// // //   } = useSession();
  
// // //   const {
// // //     isAvatarTalking,
// // //     isUserTalking,
// // //     isMuted,
// // //     isActive,
// // //     isLoading,
// // //     start,
// // //     stop,
// // //     mute,
// // //     unmute,
// // //   } = useVoiceChat();

// // //   const { interrupt, repeat, startListening, stopListening } =
// // //     useAvatarActions(mode);

// // //   const { sendMessage } = useTextChat(mode);
// // //   const videoRef = useRef<HTMLVideoElement>(null);

// // //   // 1. Fetch System Specs on Mount
// // //   useEffect(() => {
// // //     fetch("/laptop_fulla_specs.json")
// // //       .then((res) => res.json())
// // //       .then((data) => {
// // //         console.log("💻 System Specs Loaded Successfully:", data);
// // //         setSystemSpecs(data);
// // //       })
// // //       .catch((err) => console.error("⚠️ Could not load system specs. Run 'pnpm run electron:dev' to generate them.", err));
// // //   }, []);

// // //   useEffect(() => {
// // //     if (sessionState === SessionState.DISCONNECTED) {
// // //       onSessionStopped();
// // //     }
// // //   }, [sessionState, onSessionStopped]);

// // //   useEffect(() => {
// // //     if (isStreamReady && videoRef.current) {
// // //       attachElement(videoRef.current);
// // //       if (videoRef.current.muted) {
// // //         setIsVideoMuted(true);
// // //       }
// // //     }
// // //   }, [attachElement, isStreamReady]);

// // //   // 2. Handle Welcome Message manually (prevents cut-off)
// // //   useEffect(() => {
// // //     if (isStreamReady && !hasGreetedRef.current) {
// // //       hasGreetedRef.current = true;
// // //       setTimeout(() => {
// // //         // You can customize this message or even inject specs here!
// // //         const greeting = systemSpecs 
// // //           ? `Hello! I see you are using a ${systemSpecs.specifications?.laptop_model || "computer"}. How can I help you today?`
// // //           : "Hello! I am ready to help you.";
          
// // //         repeat(greeting);
// // //       }, 1500); // 1.5s delay to ensure audio buffer is ready
// // //     }
// // //   }, [isStreamReady, repeat, systemSpecs]);

// // //   useEffect(() => {
// // //     if (sessionState === SessionState.INACTIVE) {
// // //       startSession();
// // //     }
// // //   }, [startSession, sessionState]);

// // //   const enableAvatarAudio = () => {
// // //     if (videoRef.current) {
// // //       videoRef.current.muted = false;
// // //       setIsVideoMuted(false);
// // //     }
// // //   };

// // //   const VoiceChatComponents = (
// // //     <>
// // //       <p>Voice Chat Active: {isActive ? "true" : "false"}</p>
// // //       <p>Voice Chat Loading: {isLoading ? "true" : "false"}</p>
// // //       {isActive && <p>Microphone Muted: {isMuted ? "true" : "false"}</p>}
// // //       <Button
// // //         onClick={() => {
// // //           if (isActive) {
// // //             stop();
// // //           } else {
// // //             start();
// // //           }
// // //         }}
// // //         disabled={isLoading}
// // //       >
// // //         {isActive ? "Stop Voice Chat" : "Start Voice Chat"}
// // //       </Button>
// // //       {isActive && (
// // //         <Button
// // //           onClick={() => {
// // //             if (isMuted) {
// // //               unmute();
// // //             } else {
// // //               mute();
// // //             }
// // //           }}
// // //         >
// // //           {isMuted ? "Unmute Mic" : "Mute Mic"}
// // //         </Button>
// // //       )}
// // //     </>
// // //   );

// // //   return (
// // //     <div className="w-[1080px] max-w-full h-full flex flex-col items-center justify-center gap-4 py-4">
// // //       <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center bg-black/10 rounded-lg">
// // //         <video
// // //           ref={videoRef}
// // //           autoPlay
// // //           playsInline
// // //           className="w-full h-full object-contain"
// // //         />
        
// // //         {/* Enable Audio Button */}
// // //         {isVideoMuted && isStreamReady && (
// // //           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
// // //             <button 
// // //               onClick={enableAvatarAudio}
// // //               className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 transition-transform hover:scale-105 animate-pulse"
// // //             >
// // //               🔇 Click to Enable Avatar Sound
// // //             </button>
// // //           </div>
// // //         )}

// // //         <button
// // //           className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-md z-10"
// // //           onClick={() => stopSession()}
// // //         >
// // //           Stop
// // //         </button>
// // //       </div>
// // //       <div className="w-full h-full flex flex-col items-center justify-center gap-4">
// // //         <p>Session state: {sessionState}</p>
// // //         <p>Connection quality: {connectionQuality}</p>
        
// // //         {/* Debug Info for Specs */}
// // //         {systemSpecs && (
// // //           <p className="text-xs text-green-400">
// // //             ✅ Hardware detected: {systemSpecs.specifications?.laptop_model || "Unknown Model"}
// // //           </p>
// // //         )}

// // //         {mode === "FULL" && (
// // //           <p>User talking: {isUserTalking ? "true" : "false"}</p>
// // //         )}
// // //         <p>Avatar talking: {isAvatarTalking ? "true" : "false"}</p>
// // //         {mode === "FULL" && VoiceChatComponents}
// // //         <Button
// // //           onClick={() => {
// // //             keepAlive();
// // //           }}
// // //         >
// // //           Keep Alive
// // //         </Button>
// // //         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
// // //           <Button
// // //             onClick={() => {
// // //               startListening();
// // //             }}
// // //           >
// // //             Start Listening
// // //           </Button>
// // //           <Button
// // //             onClick={() => {
// // //               stopListening();
// // //             }}
// // //           >
// // //             Stop Listening
// // //           </Button>
// // //           <Button
// // //             onClick={() => {
// // //               interrupt();
// // //             }}
// // //           >
// // //             Interrupt
// // //           </Button>
// // //         </div>
// // //         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
// // //           <input
// // //             type="text"
// // //             value={message}
// // //             onChange={(e) => setMessage(e.target.value)}
// // //             className="w-[400px] bg-white text-black px-4 py-2 rounded-md"
// // //             placeholder="Type a message for the avatar to say..."
// // //           />
// // //           <Button
// // //             onClick={() => {
// // //               sendMessage(message);
// // //               setMessage("");
// // //             }}
// // //           >
// // //             Send
// // //           </Button>
// // //           <Button
// // //             onClick={() => {
// // //               repeat(message);
// // //               setMessage("");
// // //             }}
// // //           >
// // //             Repeat
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export const LiveAvatarSession: React.FC<{
// // //   mode: "FULL" | "CUSTOM";
// // //   sessionAccessToken: string;
// // //   onSessionStopped: () => void;
// // // }> = ({ mode, sessionAccessToken, onSessionStopped }) => {
// // //   return (
// // //     <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
// // //       <LiveAvatarSessionComponent
// // //         mode={mode}
// // //         onSessionStopped={onSessionStopped}
// // //       />
// // //     </LiveAvatarContextProvider>
// // //   );
// // // };


































// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   LiveAvatarContextProvider,
//   useSession,
//   useTextChat,
//   useVoiceChat,
// } from "../liveavatar";
// import { SessionState } from "@heygen/liveavatar-web-sdk";
// import { useAvatarActions } from "../liveavatar/useAvatarActions";

// const Button: React.FC<{
//   onClick: () => void;
//   disabled?: boolean;
//   children: React.ReactNode;
// }> = ({ onClick, disabled, children }) => {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
//     >
//       {children}
//     </button>
//   );
// };

// const LiveAvatarSessionComponent: React.FC<{
//   mode: "FULL" | "CUSTOM";
//   onSessionStopped: () => void;
// }> = ({ mode, onSessionStopped }) => {
//   const [message, setMessage] = useState("");
//   const [isVideoMuted, setIsVideoMuted] = useState(true);
  
//   // Ref to ensure we only send the welcome message once
//   const hasGreetedRef = useRef(false);

//   const {
//     sessionState,
//     isStreamReady,
//     startSession,
//     stopSession,
//     connectionQuality,
//     keepAlive,
//     attachElement,
//   } = useSession();
  
//   const {
//     isAvatarTalking,
//     isUserTalking,
//     isMuted,
//     isActive,
//     isLoading,
//     start,
//     stop,
//     mute,
//     unmute,
//   } = useVoiceChat();

//   const { interrupt, repeat, startListening, stopListening } =
//     useAvatarActions(mode);

//   const { sendMessage } = useTextChat(mode);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   // --- REMOVED: Fetching of laptop_fulla_specs.json ---
//   // The avatar is now completely decoupled from the hardware scan data.

//   useEffect(() => {
//     if (sessionState === SessionState.DISCONNECTED) {
//       onSessionStopped();
//     }
//   }, [sessionState, onSessionStopped]);

//   useEffect(() => {
//     if (isStreamReady && videoRef.current) {
//       attachElement(videoRef.current);
//       if (videoRef.current.muted) {
//         setIsVideoMuted(true);
//       }
//     }
//   }, [attachElement, isStreamReady]);

//   // ✅ Handle Welcome Message manually (Standard Greeting Only)
//   useEffect(() => {
//     if (isStreamReady && !hasGreetedRef.current) {
//       hasGreetedRef.current = true;
      
//       // We keep the delay to ensure audio isn't cut off
//       setTimeout(() => {
//         repeat("Hello! I am ready to help you.");
//       }, 1500); 
//     }
//   }, [isStreamReady, repeat]);

//   useEffect(() => {
//     if (sessionState === SessionState.INACTIVE) {
//       startSession();
//     }
//   }, [startSession, sessionState]);

//   const enableAvatarAudio = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = false;
//       setIsVideoMuted(false);
//     }
//   };

//   const VoiceChatComponents = (
//     <>
//       <p>Voice Chat Active: {isActive ? "true" : "false"}</p>
//       <p>Voice Chat Loading: {isLoading ? "true" : "false"}</p>
//       {isActive && <p>Microphone Muted: {isMuted ? "true" : "false"}</p>}
//       <Button
//         onClick={() => {
//           if (isActive) {
//             stop();
//           } else {
//             start();
//           }
//         }}
//         disabled={isLoading}
//       >
//         {isActive ? "Stop Voice Chat" : "Start Voice Chat"}
//       </Button>
//       {isActive && (
//         <Button
//           onClick={() => {
//             if (isMuted) {
//               unmute();
//             } else {
//               mute();
//             }
//           }}
//         >
//           {isMuted ? "Unmute Mic" : "Mute Mic"}
//         </Button>
//       )}
//     </>
//   );

//   return (
//     <div className="w-[1080px] max-w-full h-full flex flex-col items-center justify-center gap-4 py-4">
//       <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center bg-black/10 rounded-lg">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-contain"
//         />
        
//         {/* Enable Audio Button */}
//         {isVideoMuted && isStreamReady && (
//           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
//             <button 
//               onClick={enableAvatarAudio}
//               className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 transition-transform hover:scale-105 animate-pulse"
//             >
//               🔇 Click to Enable Avatar Sound
//             </button>
//           </div>
//         )}

//         <button
//           className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-md z-10"
//           onClick={() => stopSession()}
//         >
//           Stop
//         </button>
//       </div>
//       <div className="w-full h-full flex flex-col items-center justify-center gap-4">
//         <p>Session state: {sessionState}</p>
//         <p>Connection quality: {connectionQuality}</p>
        
//         {/* Removed: Hardware Specs Display */}

//         {mode === "FULL" && (
//           <p>User talking: {isUserTalking ? "true" : "false"}</p>
//         )}
//         <p>Avatar talking: {isAvatarTalking ? "true" : "false"}</p>
//         {mode === "FULL" && VoiceChatComponents}
//         <Button
//           onClick={() => {
//             keepAlive();
//           }}
//         >
//           Keep Alive
//         </Button>
//         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
//           <Button
//             onClick={() => {
//               startListening();
//             }}
//           >
//             Start Listening
//           </Button>
//           <Button
//             onClick={() => {
//               stopListening();
//             }}
//           >
//             Stop Listening
//           </Button>
//           <Button
//             onClick={() => {
//               interrupt();
//             }}
//           >
//             Interrupt
//           </Button>
//         </div>
//         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="w-[400px] bg-white text-black px-4 py-2 rounded-md"
//             placeholder="Type a message for the avatar to say..."
//           />
//           <Button
//             onClick={() => {
//               sendMessage(message);
//               setMessage("");
//             }}
//           >
//             Send
//           </Button>
//           <Button
//             onClick={() => {
//               repeat(message);
//               setMessage("");
//             }}
//           >
//             Repeat
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const LiveAvatarSession: React.FC<{
//   mode: "FULL" | "CUSTOM";
//   sessionAccessToken: string;
//   onSessionStopped: () => void;
// }> = ({ mode, sessionAccessToken, onSessionStopped }) => {
//   return (
//     <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
//       <LiveAvatarSessionComponent
//         mode={mode}
//         onSessionStopped={onSessionStopped}
//       />
//     </LiveAvatarContextProvider>
//   );
// };




































// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   LiveAvatarContextProvider,
// //   useSession,
// //   useTextChat,
// //   useVoiceChat,
// // } from "../liveavatar";
// // import { SessionState } from "@heygen/liveavatar-web-sdk";
// // import { useAvatarActions } from "../liveavatar/useAvatarActions";

// // const Button: React.FC<{
// //   onClick: () => void;
// //   disabled?: boolean;
// //   children: React.ReactNode;
// // }> = ({ onClick, disabled, children }) => {
// //   return (
// //     <button
// //       onClick={onClick}
// //       disabled={disabled}
// //       className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
// //     >
// //       {children}
// //     </button>
// //   );
// // };

// // const LiveAvatarSessionComponent: React.FC<{
// //   mode: "FULL" | "CUSTOM";
// //   onSessionStopped: () => void;
// // }> = ({ mode, onSessionStopped }) => {
// //   const [message, setMessage] = useState("");
// //   const [isVideoMuted, setIsVideoMuted] = useState(true);
  
// //   // Ref to ensure we only send the welcome message once
// //   const hasGreetedRef = useRef(false);
  
// //   // ✅ STATE: Store the system specs
// //   const [systemSpecs, setSystemSpecs] = useState<any>(null);

// //   const {
// //     sessionState,
// //     isStreamReady,
// //     startSession,
// //     stopSession,
// //     connectionQuality,
// //     keepAlive,
// //     attachElement,
// //   } = useSession();
  
// //   const {
// //     isAvatarTalking,
// //     isUserTalking,
// //     isMuted,
// //     isActive,
// //     isLoading,
// //     start,
// //     stop,
// //     mute,
// //     unmute,
// //   } = useVoiceChat();

// //   const { interrupt, repeat, startListening, stopListening } =
// //     useAvatarActions(mode);

// //   const { sendMessage } = useTextChat(mode);
// //   const videoRef = useRef<HTMLVideoElement>(null);

// //   // ✅ 1. Fetch System Specs on Mount
// //   useEffect(() => {
// //     fetch("/laptop_fulla_specs.json")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         console.log("💻 System Specs Loaded:", data);
// //         setSystemSpecs(data);
// //       })
// //       .catch((err) => console.error("⚠️ Could not load system specs:", err));
// //   }, []);

// //   useEffect(() => {
// //     if (sessionState === SessionState.DISCONNECTED) {
// //       onSessionStopped();
// //     }
// //   }, [sessionState, onSessionStopped]);

// //   useEffect(() => {
// //     if (isStreamReady && videoRef.current) {
// //       attachElement(videoRef.current);
// //       if (videoRef.current.muted) {
// //         setIsVideoMuted(true);
// //       }
// //     }
// //   }, [attachElement, isStreamReady]);

// //   // ✅ 2. Welcome Message WITH Laptop Info
// //   useEffect(() => {
// //     if (isStreamReady && !hasGreetedRef.current) {
// //       // Wait until we have specs (or timeout if they fail)
// //       if (systemSpecs !== undefined) {
// //         hasGreetedRef.current = true;
        
// //         setTimeout(() => {
// //           // Construct a dynamic greeting based on the file
// //           let greeting = "Hello! I am ready to help you.";
          
// //           if (systemSpecs && systemSpecs.specifications) {
// //             const model = systemSpecs.specifications.laptop_model || "computer";
// //             const cpu = systemSpecs.specifications.cpu || "unknown processor";
// //             greeting = `Hello! I see you are running on a ${model} with a ${cpu}. How can I assist you with this device today?`;
// //           }
          
// //           console.log("[Avatar] Saying greeting:", greeting);
// //           repeat(greeting);
// //         }, 1500); 
// //       }
// //     }
// //   }, [isStreamReady, repeat, systemSpecs]);

// //   useEffect(() => {
// //     if (sessionState === SessionState.INACTIVE) {
// //       startSession();
// //     }
// //   }, [startSession, sessionState]);

// //   const enableAvatarAudio = () => {
// //     if (videoRef.current) {
// //       videoRef.current.muted = false;
// //       setIsVideoMuted(false);
// //     }
// //   };

// //   const VoiceChatComponents = (
// //     <>
// //       <p>Voice Chat Active: {isActive ? "true" : "false"}</p>
// //       <p>Voice Chat Loading: {isLoading ? "true" : "false"}</p>
// //       {isActive && <p>Microphone Muted: {isMuted ? "true" : "false"}</p>}
// //       <Button
// //         onClick={() => {
// //           if (isActive) {
// //             stop();
// //           } else {
// //             start();
// //           }
// //         }}
// //         disabled={isLoading}
// //       >
// //         {isActive ? "Stop Voice Chat" : "Start Voice Chat"}
// //       </Button>
// //       {isActive && (
// //         <Button
// //           onClick={() => {
// //             if (isMuted) {
// //               unmute();
// //             } else {
// //               mute();
// //             }
// //           }}
// //         >
// //           {isMuted ? "Unmute Mic" : "Mute Mic"}
// //         </Button>
// //       )}
// //     </>
// //   );

// //   return (
// //     <div className="w-[1080px] max-w-full h-full flex flex-col items-center justify-center gap-4 py-4">
// //       <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center bg-black/10 rounded-lg">
// //         <video
// //           ref={videoRef}
// //           autoPlay
// //           playsInline
// //           className="w-full h-full object-contain"
// //         />
        
// //         {isVideoMuted && isStreamReady && (
// //           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
// //             <button 
// //               onClick={enableAvatarAudio}
// //               className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 transition-transform hover:scale-105 animate-pulse"
// //             >
// //               🔇 Click to Enable Avatar Sound
// //             </button>
// //           </div>
// //         )}

// //         <button
// //           className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-md z-10"
// //           onClick={() => stopSession()}
// //         >
// //           Stop
// //         </button>
// //       </div>
// //       <div className="w-full h-full flex flex-col items-center justify-center gap-4">
// //         <p>Session state: {sessionState}</p>
// //         <p>Connection quality: {connectionQuality}</p>
        
// //         {/* ✅ Debug Info: Show detected hardware on screen */}
// //         {systemSpecs && (
// //           <div className="bg-gray-800 p-2 rounded text-xs text-green-400 font-mono">
// //             ✅ Hardware Connected: {systemSpecs.specifications?.laptop_model || "Unknown"} 
// //             ({systemSpecs.specifications?.ram_options || "RAM Unknown"})
// //           </div>
// //         )}

// //         {mode === "FULL" && (
// //           <p>User talking: {isUserTalking ? "true" : "false"}</p>
// //         )}
// //         <p>Avatar talking: {isAvatarTalking ? "true" : "false"}</p>
// //         {mode === "FULL" && VoiceChatComponents}
// //         <Button
// //           onClick={() => {
// //             keepAlive();
// //           }}
// //         >
// //           Keep Alive
// //         </Button>
// //         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
// //           <Button
// //             onClick={() => {
// //               startListening();
// //             }}
// //           >
// //             Start Listening
// //           </Button>
// //           <Button
// //             onClick={() => {
// //               stopListening();
// //             }}
// //           >
// //             Stop Listening
// //           </Button>
// //           <Button
// //             onClick={() => {
// //               interrupt();
// //             }}
// //           >
// //             Interrupt
// //           </Button>
// //         </div>
// //         <div className="w-full h-full flex flex-row items-center justify-center gap-4">
// //           <input
// //             type="text"
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             className="w-[400px] bg-white text-black px-4 py-2 rounded-md"
// //             placeholder="Type a message for the avatar to say..."
// //           />
// //           <Button
// //             onClick={() => {
// //               sendMessage(message);
// //               setMessage("");
// //             }}
// //           >
// //             Send
// //           </Button>
// //           <Button
// //             onClick={() => {
// //               repeat(message);
// //               setMessage("");
// //             }}
// //           >
// //             Repeat
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export const LiveAvatarSession: React.FC<{
// //   mode: "FULL" | "CUSTOM";
// //   sessionAccessToken: string;
// //   onSessionStopped: () => void;
// // }> = ({ mode, sessionAccessToken, onSessionStopped }) => {
// //   return (
// //     <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
// //       <LiveAvatarSessionComponent
// //         mode={mode}
// //         onSessionStopped={onSessionStopped}
// //       />
// //     </LiveAvatarContextProvider>
// //   );
// // };















































// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   LiveAvatarContextProvider,
//   useSession,
//   useTextChat,
//   useVoiceChat,
// } from "../liveavatar";
// import { SessionState } from "@heygen/liveavatar-web-sdk";
// import { useAvatarActions } from "../liveavatar/useAvatarActions";

// // --- Types for Hardware Data ---
// interface LaptopScanData {
//   from_scan: {
//     cpu: string;
//     ram: string;
//     model: string;
//   };
//   specifications: {
//     laptop_model: string;
//     brand: string;
//     cpu: string;
//     gpu: string;
//     ram_options: string;
//     display: string;
//     ports: string[];
//     typical_price_range_in_inr: string;
//   };
// }

// // --- MAIN PAGE COMPONENT ---
// export default function Home() {
//   const [sessionToken, setSessionToken] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [status, setStatus] = useState("Initializing System...");
//   const initialized = useRef(false);

//   const startSession = async () => {
//     setStatus("Establishing Secure Link (Custom Mode)...");
//     try {
//       const res = await fetch("/api/start-custom-session", { method: "POST" });
//       if (!res.ok) throw new Error("Connection Refused");
//       const data = await res.json();
//       setSessionToken(data.session_token);
//       setStatus("Link Established");
//     } catch (error: unknown) {
//       setError((error as Error).message);
//     }
//   };

//   useEffect(() => {
//     if (!initialized.current) {
//       initialized.current = true;
//       startSession();
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#191919] font-mono text-white relative overflow-hidden">
//       <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#111111] rounded-full pointer-events-none" />
//       <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-900/20 rounded-full pointer-events-none" />

//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
//         {!sessionToken ? (
//           <div className="flex flex-col items-center gap-6">
//             <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
//             <div className="text-xl tracking-widest text-teal-400 animate-pulse">
//               {error ? `ERROR: ${error}` : status}
//             </div>
//           </div>
//         ) : (
//           <LiveAvatarSession
//             mode="CUSTOM"
//             sessionAccessToken={sessionToken}
//             onSessionStopped={() => setSessionToken("")}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// // --- AVATAR SESSION COMPONENT ---
// const LiveAvatarSession: React.FC<{
//   mode: "FULL" | "CUSTOM";
//   sessionAccessToken: string;
//   onSessionStopped: () => void;
// }> = ({ mode, sessionAccessToken, onSessionStopped }) => {
//   return (
//     <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
//       <DashboardUI mode={mode} onSessionStopped={onSessionStopped} />
//     </LiveAvatarContextProvider>
//   );
// };

// const DashboardUI: React.FC<{
//   mode: "FULL" | "CUSTOM";
//   onSessionStopped: () => void;
// }> = ({ mode, onSessionStopped }) => {
//   const [data, setData] = useState<LaptopScanData | null>(null);
//   const [message, setMessage] = useState("");
//   const [isVideoMuted, setIsVideoMuted] = useState(true);
//   const hasGreetedRef = useRef(false);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const {
//     sessionState,
//     isStreamReady,
//     startSession,
//     stopSession,
//     attachElement,
//   } = useSession();

//   const {
//     isUserTalking,
//     isAvatarTalking,
//     start,
//     stop,
//     isMuted,
//     unmute,
//     mute
//   } = useVoiceChat();

//   const { repeat, startListening, stopListening } = useAvatarActions(mode);
//   const { sendMessage } = useTextChat(mode);

//   // 1. Fetch Specs
//   useEffect(() => {
//     fetch("/laptop_fulla_specs.json")
//       .then((res) => res.json())
//       .then((json) => setData(json))
//       .catch(() => console.warn("Specs unavailable"));
//   }, []);

//   // 2. Manage Session Lifecycle
//   useEffect(() => {
//     if (sessionState === SessionState.DISCONNECTED) onSessionStopped();
//     if (sessionState === SessionState.INACTIVE) startSession();
//   }, [sessionState, onSessionStopped, startSession]);

//   // 3. Attach Video Stream
//   useEffect(() => {
//     if (isStreamReady && videoRef.current) {
//       attachElement(videoRef.current);
//       if (videoRef.current.muted) setIsVideoMuted(true);
//     }
//   }, [isStreamReady, attachElement]);

//   // 4. ✅ UPDATED: Short, Friendly Greeting (No Specs yet)
//   useEffect(() => {
//     if (isStreamReady && !hasGreetedRef.current) {
//       // We still wait for data to ensure the backend is ready, 
//       // but we don't read it aloud yet.
//       if (data) {
//         hasGreetedRef.current = true;
//         setTimeout(() => {
//           // Pure conversational opening
//           repeat("Hello there! I am Dia, your personal assistant at Croma.");
//         }, 1500);
//       }
//     }
//   }, [isStreamReady, data, repeat]);

//   const toggleMic = () => (isMuted ? unmute() : mute());
//   const enableAudio = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = false;
//       setIsVideoMuted(false);
//     }
//   };

//   return (
//     <main className="w-full max-w-7xl flex flex-col items-center gap-8">
//       <header className="text-center space-y-2">
//         <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-indigo-200 tracking-tighter">
//           CROMA AI ASSISTANT
//         </h1>
//         <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
//           <span className={`w-2 h-2 rounded-full ${sessionState === SessionState.CONNECTED ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`} />
//           STATUS: {sessionState}
//         </div>
//       </header>

//       <div className="w-full flex flex-col items-center gap-6">
        
//         {/* AVATAR CONTAINER */}
//         <div className="relative w-full max-w-3xl aspect-video bg-black/40 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_-15px_rgba(20,184,166,0.3)] group">
//           <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 opacity-50 blur-xl pointer-events-none" />
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-contain relative z-10"
//           />

//           <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             {isVideoMuted && isStreamReady && (
//               <button
//                 onClick={enableAudio}
//                 className="bg-red-500/90 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 backdrop-blur-md animate-pulse"
//               >
//                 🔇 UNMUTE SYSTEM
//               </button>
//             )}

//             <button
//               onClick={toggleMic}
//               className={`px-6 py-2 rounded-full font-bold backdrop-blur-md border ${
//                 !isMuted 
//                   ? "bg-teal-500/20 border-teal-500 text-teal-300" 
//                   : "bg-slate-800/80 border-slate-600 text-slate-400"
//               }`}
//             >
//               {isMuted ? "MIC OFF" : "MIC ON"}
//             </button>

//             <button
//               onMouseDown={startListening}
//               onMouseUp={stopListening}
//               className="bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow-lg backdrop-blur-md active:scale-95 transition-transform"
//             >
//               HOLD TO SPEAK
//             </button>
//           </div>

//           {isAvatarTalking && (
//             <div className="absolute top-4 right-4 px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded text-teal-300 text-xs font-bold animate-pulse z-20">
//               AI SPEAKING
//             </div>
//           )}
//           {isUserTalking && (
//             <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded text-indigo-300 text-xs font-bold animate-pulse z-20">
//               USER LISTENING
//             </div>
//           )}
//         </div>

//         {/* Text Input */}
//         <div className="flex gap-2 w-full max-w-2xl">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                     sendMessage(message);
//                     setMessage("");
//                 }
//             }}
//             placeholder="Talk to Dia..."
//             className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
//           />
//           <button
//             onClick={() => {
//               sendMessage(message);
//               setMessage("");
//             }}
//             className="bg-slate-800 hover:bg-slate-700 text-teal-400 px-6 rounded-lg font-bold transition-colors border border-slate-700"
//           >
//             SEND
//           </button>
//         </div>
//       </div>

//       {/* DASHBOARD GRID */}
//       {data && (
//         <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
//           <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-teal-500/30 transition-colors">
//             <h2 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
//               <span className="w-2 h-2 bg-teal-500 rounded-full"/> PERFORMANCE
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Processor</div>
//                 <div className="text-slate-200 font-medium font-sans">{data.specifications.cpu}</div>
//               </div>
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Graphics</div>
//                 <div className="text-slate-200 font-medium font-sans">{data.specifications.gpu}</div>
//               </div>
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Memory</div>
//                 <div className="text-slate-200 font-medium font-sans">{data.specifications.ram_options}</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
//             <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
//               <span className="w-2 h-2 bg-indigo-500 rounded-full"/> EXPERIENCE
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Display</div>
//                 <div className="text-slate-200 font-medium font-sans">{data.specifications.display}</div>
//               </div>
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">I/O Ports</div>
//                 <ul className="text-slate-300 text-sm list-disc pl-4 mt-1 font-sans">
//                   {data.specifications.ports?.slice(0, 4).map((p, i) => (
//                     <li key={i}>{p}</li>
//                   )) || <li>Standard Ports</li>}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-green-500/30 transition-colors">
//             <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
//               <span className="w-2 h-2 bg-green-500 rounded-full"/> MARKET DATA
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Est. Price</div>
//                 <div className="text-3xl font-bold text-white font-sans">{data.specifications.typical_price_range_in_inr}</div>
//               </div>
//               <div>
//                 <div className="text-slate-500 text-xs uppercase tracking-wider">Availability</div>
//                 <div className="text-orange-400 font-bold animate-pulse text-sm mt-1">⚠ LOW STOCK</div>
//               </div>
//               <div className="text-xs text-slate-600 mt-6 border-t border-slate-800 pt-4">
//                 DETECTED MODEL ID: <span className="font-mono text-slate-400">{data.from_scan.model}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };





























"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useTextChat,
  useVoiceChat,
} from "../liveavatar";
import { useLiveAvatarContext } from "../liveavatar/context";
import { SessionState, AgentEventsEnum } from "@heygen/liveavatar-web-sdk";
import { useAvatarActions } from "../liveavatar/useAvatarActions";

// ✅ EXPORT the component so other files can use it
export const LiveAvatarSession: React.FC<{
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
  const [message, setMessage] = useState("");
  const [lastHeard, setLastHeard] = useState("");
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const hasGreetedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { sessionRef } = useLiveAvatarContext();

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
    isMuted,
    unmute,
    mute
  } = useVoiceChat();

  const { repeat, startListening, stopListening } = useAvatarActions(mode);
  const { sendMessage } = useTextChat(mode);

  // Manage Session Lifecycle
  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) onSessionStopped();
    if (sessionState === SessionState.INACTIVE) startSession();
  }, [sessionState, onSessionStopped, startSession]);

  // Attach Video Stream
  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
      if (videoRef.current.muted) setIsVideoMuted(true);
    }
  }, [isStreamReady, attachElement]);

  // Listen for STT (User Transcription)
  useEffect(() => {
    const session = sessionRef.current;
    if (!session) return;

    const handleTranscription = (event: any) => {
      if (event.text && event.text.trim().length > 0) {
        console.log("🎤 USER SAID:", event.text);
        setLastHeard(event.text);
        sendMessage(event.text);
      }
    };

    session.on(AgentEventsEnum.USER_TRANSCRIPTION, handleTranscription);

    return () => {
      session.off(AgentEventsEnum.USER_TRANSCRIPTION, handleTranscription);
    };
  }, [sessionRef, sendMessage]);

  // Greeting
  useEffect(() => {
    if (isStreamReady && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      setTimeout(() => {
        repeat("Namaste! Welcome to Croma. I'm Dia. May I know your name?");
      }, 1500);
    }
  }, [isStreamReady, repeat]);

  const toggleMic = () => (isMuted ? unmute() : mute());
  const enableAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
    }
  };

  return (
    <main className="w-full max-w-7xl flex flex-col items-center gap-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-indigo-200 tracking-tighter">
          CROMA AI ASSISTANT
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className={`w-2 h-2 rounded-full ${sessionState === SessionState.CONNECTED ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`} />
          STATUS: {sessionState}
        </div>
      </header>

      <div className="w-full flex flex-col items-center gap-6">
        
        {/* AVATAR CONTAINER */}
        <div className="relative w-full max-w-3xl aspect-video bg-black/40 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_-15px_rgba(20,184,166,0.3)] group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 opacity-50 blur-xl pointer-events-none" />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain relative z-10"
          />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isVideoMuted && isStreamReady && (
              <button
                onClick={enableAudio}
                className="bg-red-500/90 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 backdrop-blur-md animate-pulse"
              >
                🔇 UNMUTE SYSTEM
              </button>
            )}

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

            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow-lg backdrop-blur-md active:scale-95 transition-transform select-none"
            >
              HOLD TO SPEAK
            </button>
          </div>

          {/* STATUS OVERLAYS */}
          {isAvatarTalking && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded text-teal-300 text-xs font-bold animate-pulse z-20">
              AI SPEAKING
            </div>
          )}
          
          {/* Transcription UI */}
          {lastHeard && (
            <div className="absolute top-4 left-4 max-w-[50%] px-3 py-2 bg-indigo-900/80 border border-indigo-500/50 rounded-lg text-white text-xs z-20 backdrop-blur-sm">
              <span className="text-indigo-300 font-bold block mb-1">YOU SAID:</span>
              "{lastHeard}"
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
    </main>
  );
};