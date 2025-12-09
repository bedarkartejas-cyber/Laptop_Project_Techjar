// laptop_res.cjs - OpenAI Version (Latest API)
// Integrated for Gemini Live Assistant Electron App

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// 1. Point dotenv to the root .env file
require("dotenv").config({ path: path.join(process.cwd(), '.env') });

/* -----------------------------------------------------
   INIT OPENAI
----------------------------------------------------- */
let openai = null;

try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        console.log("[ERROR] Missing OPENAI_API_KEY in .env");
        process.exit(1);
    }

    openai = new OpenAI({
        apiKey: key
    });
    console.log("[OK] OpenAI ready");

} catch (e) {
    console.log("[ERROR] OpenAI initialization:", e);
    process.exit(1);
}

/* -----------------------------------------------------
   READ system_hardware_info.json
----------------------------------------------------- */
function readSystemInfo() {
    try {
        // Resolve path to project root
        const inputPath = path.join(process.cwd(), "system_hardware_info.json");
        
        if (!fs.existsSync(inputPath)) {
            throw new Error(`File not found: ${inputPath}`);
        }

        const raw = fs.readFileSync(inputPath, "utf-8");
        const json = JSON.parse(raw);
        const sys = json.system_info;

        return {
            cpu: sys.cpu.model,
            ram: sys.ram.total_gb + " GB",
            model: sys.model
        };
    } catch (err) {
        console.log("[ERROR] Reading system_hardware_info.json:", err.message);
        process.exit(1);
    }
}

/* -----------------------------------------------------
   GET SPECS FROM OPENAI
----------------------------------------------------- */
async function getLaptopDetails(modelName, cpu, ram) {
    try {
        const prompt = `
Research ALL real specifications for laptop model:
"${modelName}"

Use detected hardware for accuracy:
CPU: ${cpu}
RAM: ${ram}

Return STRICT JSON ONLY with this structure:

{
  "laptop_model": "",
  "brand": "",
  "series": "",
  "release_year": "",
  "cpu": "",
  "gpu": "",
  "ram_options": "",
  "max_ram_supported": "",
  "storage_options": "",
  "display": "",
  "battery": "",
  "weight": "",
  "dimensions": "",
  "ports": [],
  "os": "",
  "connectivity": "",
  "webcam": "",
  "keyboard": "",
  "build_quality": "",
  "typical_price_range_in_inr": ""
}

No explanations. No extra text. JSON ONLY.
`;
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Updated to latest optimized model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 800,
            response_format: { type: "json_object" } // Enforce JSON mode
        });

        let text = response.choices[0].message.content.trim();

        // Parse JSON safely
        return JSON.parse(text);

    } catch (err) {
        console.log("[ERROR] OpenAI request:", err);
        return null;
    }
}

/* -----------------------------------------------------
   MAIN FLOW
----------------------------------------------------- */
async function main() {
    console.log("[SCAN] Reading system hardware...");
    const scan = readSystemInfo();

    console.log("[SYSTEM] CPU:", scan.cpu);
    console.log("[SYSTEM] RAM:", scan.ram);
    console.log("[SYSTEM] Model:", scan.model);

    console.log("[OPENAI] Fetching detailed specifications...");
    const specs = await getLaptopDetails(scan.model, scan.cpu, scan.ram);

    const output = {
        from_scan: scan,
        specifications: specs,
        error: specs ? null : "OpenAI lookup failed",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)
    };

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, "laptop_fulla_specs.json");

    fs.writeFileSync(
        outputPath,
        JSON.stringify(output, null, 2),
        "utf-8"
    );
    console.log(`[OK] Saved → ${outputPath}`);
}

main();