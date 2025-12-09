// import { API_URL } from "../secrets";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { session_token } = body;

//     if (!session_token) {
//       return new Response(
//         JSON.stringify({ error: "session_token is required" }),
//         {
//           status: 400,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );
//     }

//     const res = await fetch(`${API_URL}/v1/sessions/keep-alive`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${session_token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       console.error("Error keeping session alive:", errorData);
//       return new Response(
//         JSON.stringify({
//           error: errorData.data?.message || "Failed to keep session alive",
//         }),
//         {
//           status: res.status,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Session kept alive successfully",
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   } catch (error) {
//     console.error("Error keeping session alive:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to keep session alive" }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   }
// }



































import { NextResponse } from "next/server";
import { API_URL } from "../secrets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, session_token } = body;

    // Validate that we have the necessary credentials to keep the session alive
    if (!session_id || !session_token) {
      return NextResponse.json(
        { error: "Missing session_id or session_token" },
        { status: 400 }
      );
    }

    // Call the LiveAvatar API to refresh the session timeout
    const res = await fetch(`${API_URL}/v1/sessions/keep-alive`, {
      method: "POST",
      headers: {
        // Authorization uses the Session Token (JWT), not the API Key
        "Authorization": `Bearer ${session_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: session_id,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Keep Alive API Error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to keep session alive" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Return success response matching the documentation
    return NextResponse.json({
      code: 1000,
      data: null,
      message: "Success",
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}