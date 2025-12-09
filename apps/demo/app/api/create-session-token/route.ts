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
    // 1. Call the LiveAvatar API to create the token
    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY, // Authenticating with the API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL", // "FULL" mode requires avatar_persona
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: VOICE_ID,
          context_id: CONTEXT_ID,
          language: LANGUAGE,
        },
      }),
    });

    // 2. Handle API Errors
    if (!res.ok) {
      const errorData = await res.json();
      console.error("LiveAvatar API Error:", errorData);
      return NextResponse.json(errorData, { status: res.status });
    }

    // 3. Parse the successful response
    const data = await res.json();

    // 4. Return the exact structure matching the documentation/snippet
    // The API returns: { code: 1000, data: { session_id, session_token }, message: ... }
    return NextResponse.json({
      code: 1000,
      data: {
        session_id: data.data.session_id,
        session_token: data.data.session_token,
      },
      message: "Session token created successfully",
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        code: 500,
        message: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}