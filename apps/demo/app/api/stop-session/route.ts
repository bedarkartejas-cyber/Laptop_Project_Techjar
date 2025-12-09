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

//     const res = await fetch(`${API_URL}/v1/sessions`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${session_token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       console.error("Error stopping session:", errorData);
//       return new Response(
//         JSON.stringify({
//           error: errorData.data?.message || "Failed to stop session",
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
//         message: "Session stopped successfully",
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   } catch (error) {
//     console.error("Error stopping session:", error);
//     return new Response(JSON.stringify({ error: "Failed to stop session" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }
























import { NextResponse } from "next/server";
import { API_URL } from "../secrets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, session_token } = body;

    if (!session_token) {
      return NextResponse.json(
        { error: "session_token is required" },
        { status: 400 }
      );
    }

    // Call the correct 'Stop Session' endpoint
    const res = await fetch(`${API_URL}/v1/sessions/stop`, {
      method: "POST", // Changed from DELETE to POST
      headers: {
        "Authorization": `Bearer ${session_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: session_id, // Recommended to pass this
        reason: "USER_CLOSED"   // Good practice to indicate why it stopped
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error stopping session:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to stop session" },
        { status: res.status }
      );
    }

    // Success response matching the documentation
    return NextResponse.json({
      code: 1000,
      data: null,
      message: "Successfully stopped session",
    });

  } catch (error) {
    console.error("Error stopping session:", error);
    return NextResponse.json(
      { error: "Failed to stop session" },
      { status: 500 }
    );
  }
}