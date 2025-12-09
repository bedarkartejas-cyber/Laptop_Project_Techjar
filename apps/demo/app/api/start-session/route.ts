// import {
//   API_KEY,
//   API_URL,
//   AVATAR_ID,
//   VOICE_ID,
//   CONTEXT_ID,
//   LANGUAGE,
// } from "../secrets";

// export async function POST() {
//   let session_token = "";
//   let session_id = "";
//   try {
//     const res = await fetch(`${API_URL}/v1/sessions/token`, {
//       method: "POST",
//       headers: {
//         "X-API-KEY": API_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         mode: "FULL",
//         avatar_id: AVATAR_ID,
//         avatar_persona: {
//           voice_id: VOICE_ID,
//           context_id: CONTEXT_ID,
//           language: LANGUAGE,
//         },
//       }),
//     });
//     if (!res.ok) {
//       const resp = await res.json();
//       const errorMessage =
//         resp.data[0].message ?? "Failed to retrieve session token";
//       return new Response(JSON.stringify({ error: errorMessage }), {
//         status: res.status,
//       });
//     }
//     const data = await res.json();

//     session_token = data.data.session_token;
//     session_id = data.data.session_id;
//   } catch (error) {
//     console.error("Error retrieving session token:", error);
//     return new Response(JSON.stringify({ error: (error as Error).message }), {
//       status: 500,
//     });
//   }

//   if (!session_token) {
//     return new Response("Failed to retrieve session token", {
//       status: 500,
//     });
//   }
//   return new Response(JSON.stringify({ session_token, session_id }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// import {
//   API_KEY,
//   API_URL,
//   AVATAR_ID,
//   VOICE_ID,
//   CONTEXT_ID,
//   LANGUAGE,
// } from "../secrets";

// export async function POST() {
//   let session_token = "";
//   let session_id = "";
//   try {
//     const res = await fetch(`${API_URL}/v1/sessions/token`, {
//       method: "POST",
//       headers: {
//         "X-API-KEY": API_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         mode: "FULL",
//         avatar_id: AVATAR_ID,
//         avatar_persona: {
//           voice_id: VOICE_ID,
//           context_id: CONTEXT_ID,
//           language: LANGUAGE,
//         },
//       }),
//     });

//     if (!res.ok) {
//       const resp = await res.json();
//       console.error("HeyGen API Error Details:", JSON.stringify(resp, null, 2));

//       // Robust error message extraction to prevent crashes
//       const errorMessage =
//         resp.message ||
//         resp.error?.message ||
//         (resp.data && Array.isArray(resp.data) && resp.data[0]?.message) ||
//         "Failed to retrieve session token";

//       return new Response(JSON.stringify({ error: errorMessage }), {
//         status: res.status,
//       });
//     }

//     const data = await res.json();
//     session_token = data.data.session_token;
//     session_id = data.data.session_id;
//   } catch (error) {
//     console.error("Error retrieving session token:", error);
//     return new Response(JSON.stringify({ error: (error as Error).message }), {
//       status: 500,
//     });
//   }

//   if (!session_token) {
//     return new Response("Failed to retrieve session token", {
//       status: 500,
//     });
//   }

//   return new Response(JSON.stringify({ session_token, session_id }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }


































import { NextResponse } from "next/server";
import {
  API_KEY,
  API_URL,
  AVATAR_ID,
  VOICE_ID,
  CONTEXT_ID,
  LANGUAGE,
} from "../secrets";

export async function POST() {
  try {
    // 1. Only CREATE the token (Do not start the session here)
    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL",
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: VOICE_ID,
          context_id: CONTEXT_ID,
          language: LANGUAGE,
        },
      }),
    });

    if (!res.ok) {
      const resp = await res.json();
      console.error("Token API Error:", resp);
      
      const errorMessage =
        resp.message ||
        resp.error?.message ||
        (resp.data && Array.isArray(resp.data) && resp.data[0]?.message) ||
        "Failed to retrieve session token";

      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 2. Return ONLY the session token and ID
    // The Client SDK will use this token to perform the "Start" call itself.
    return NextResponse.json({
      session_token: data.data.session_token,
      session_id: data.data.session_id,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}