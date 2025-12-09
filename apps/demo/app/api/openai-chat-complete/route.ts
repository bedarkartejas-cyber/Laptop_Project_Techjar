import { OPENAI_API_KEY } from "../secrets";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT =
  "You are a helpful assistant. You are being used in a demo. Please act courteously and helpfully.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      message,
      model = "gpt-4o-mini",
      system_prompt = SYSTEM_PROMPT,
    } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // --- CONNECTING THE JSON FILE TO THE AVATAR ---
    let knowledgeBaseContext = "";
    try {
      // Build the path to the public folder where the script saved the JSON
      const specsPath = path.join(process.cwd(), "public", "laptop_fulla_specs.json");
      
      // Check if file exists before reading
      if (fs.existsSync(specsPath)) {
        const specsData = fs.readFileSync(specsPath, "utf-8");
        
        // Format the data as a system instruction for the AI
        knowledgeBaseContext = `
        
[SYSTEM CONTEXT: CURRENT HARDWARE SPECIFICATIONS]
The following JSON contains real-time specifications of the device you are currently running on.
Use this information to answer any questions the user has about this computer's model, RAM, CPU, or capabilities.
---------------------------------------------------
${specsData}
---------------------------------------------------
[/SYSTEM CONTEXT]
        `;
      } else {
        console.warn("Knowledge base file not found at:", specsPath);
      }
    } catch (err) {
      console.error("Error reading knowledge base:", err);
    }

    // Append the hardware info to the base system prompt
    const finalSystemPrompt = `${system_prompt}\n${knowledgeBaseContext}`;

    // Call OpenAI API
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: finalSystemPrompt }, // The avatar now knows the specs
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to generate response",
          details: errorData,
        }),
        {
          status: res.status,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const data = await res.json();
    const response = data.choices[0].message.content;

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}






























// import { OPENAI_API_KEY } from "../secrets";
// import fs from "fs";
// import path from "path";

// // ✅ UPDATED: Your specific "Dia" Sales Persona
// const BASE_SYSTEM_PROMPT = `
// You are "Dia", a senior sales associate at "Croma".

// ### YOUR GOAL:
// Sell the specific laptop detected in the user's hardware scan using a "Consultative Sales Approach."

// ### GUIDELINES:
// 1. Voice: Friendly, Excited, and High-Energy Indian English accent.
// 2. Style: You are slightly manipulative and very persuasive. Treat the user like a best friend but use emotional hooks ("I'd hate for you to miss this deal!", "Trust me, you need this power."). You are charmingly pushy.
// 3. Critical Rule: NEVER speak for more than 15 seconds. Keep answers short (under 2 sentences) and ALWAYS end with a question to guide the flow.

// ### THE 5-STEP SALES SCRIPT (Follow this flow strictly):

// PHASE 1: OPENING & RAPPORT (If user says "Hello" or starts conversation)
// - Say "Namaste! Welcome to Croma." with high excitement.
// - Immediately ask for the customer's name.

// PHASE 2: DISCOVERY (Needs Assessment)
// - Once you get the name, use it warmly.
// - Ask what they will use the laptop for (Work, Gaming, Travel?).
// - Ask about their priorities (Battery life? Weight? Budget?).

// PHASE 3: PRESENTATION (Feature Matching)
// - PITCH THE DETECTED HARDWARE (Use the specs provided in [PRODUCT DATA] context below).
// - Map features to benefits:
//   - If they said travel -> mention weight/portability.
//   - If they said editing/gaming -> mention the CPU/GPU/RAM from the specs.
//   - If they said battery -> mention the battery specs.

// PHASE 4: HANDLING OBJECTIONS
// - If they mention a competitor or lower price, act slightly shocked/hurt but then pivot.
// - Counter with EMOTION & VALUE: "Oh, but do they care about you like we do?"
// - Highlight warranty and support as the deal-breaker.

// PHASE 5: CLOSING
// - If they seem happy, ask for the sale playfully ("So, should I wrap this up for my favorite customer?").
// - Offer "Free Setup Service" as the final nudge.
// - Ask: "Shall I get this ready for you?"
// `;

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       message,
//       model = "gpt-4o", // Use a smarter model for following complex scripts
//       system_prompt = BASE_SYSTEM_PROMPT,
//     } = body;

//     if (!message) {
//       return new Response(JSON.stringify({ error: "message is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     if (!OPENAI_API_KEY) {
//       return new Response(
//         JSON.stringify({ error: "OpenAI API key not configured" }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // --- KNOWLEDGE BASE INJECTION (Hardware Specs) ---
//     let knowledgeBaseContext = "";
//     try {
//       const specsPath = path.join(process.cwd(), "public", "laptop_fulla_specs.json");
      
//       if (fs.existsSync(specsPath)) {
//         const specsData = fs.readFileSync(specsPath, "utf-8");
//         knowledgeBaseContext = `
        
// [PRODUCT DATA - THE DEVICE TO SELL]
// The following JSON contains the details of the laptop you must sell.
// Only pitch THIS specific laptop model to the user.
// ${specsData}
// [/PRODUCT DATA]
//         `;
//       } else {
//         console.warn("Knowledge base file not found:", specsPath);
//       }
//     } catch (err) {
//       console.error("Error reading knowledge base:", err);
//     }

//     // Combine your Persona with the Hardware Data
//     const finalSystemPrompt = `${system_prompt}\n${knowledgeBaseContext}`;

//     // Call OpenAI API
//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model,
//         messages: [
//           { role: "system", content: finalSystemPrompt },
//           { role: "user", content: message },
//         ],
//       }),
//     });

//     if (!res.ok) {
//       const errorData = await res.text();
//       console.error("OpenAI API error:", errorData);
//       return new Response(
//         JSON.stringify({
//           error: "Failed to generate response",
//           details: errorData,
//         }),
//         { status: res.status, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const data = await res.json();
//     const response = data.choices[0].message.content;

//     return new Response(JSON.stringify({ response }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error generating response:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to generate response" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }