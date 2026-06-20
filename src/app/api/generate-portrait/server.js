// server.js
// Minimal Express backend: upload a photo -> AI-stylize the portrait -> composite onto a card template.
//
// Install:
//   npm install express multer openai sharp
//
// Env:
//   OPENAI_API_KEY=sk-...
//
// Run:
//   node server.js

import express from "express";
import multer from "multer";
import sharp from "sharp";
import OpenAI from "openai";
import { toFile } from "openai/uploads";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express.static("public"));
app.post(
    "/api/generate-portrait",
    upload.single("photo"),
    async (req, res) => {
        const portrait = await generatePortrait(
            req.file.buffer
        );

        res.set("Content-Type", "image/png");
        res.send(portrait);
    }
);

// ---------- 1. AI STAGE: photo -> illustrated portrait ----------

const STYLE_PROMPT = `
Redraw this person as a cute chibi/webtoon-style digital illustration in 
a hand-drawn pastel portrait style. Keep the person’s exact skin tone from the 
original photo — do not lighten, whiten, brighten, or change the complexion. 
Preserve the original skin undertones and match the natural face, neck, 
and visible body skin color consistently. Keep the person’s 
recognizable facial features, hairstyle, and skin tone, only stylized. 
Use soft painterly shading, thick clean outlines, big sparkly expressive eyes, 
and simplified rounded features. Warm pastel palette for clothing and background 
only, but keep the skin tone true to the original image. Close-up bust portrait 
framing, plain soft background, no text, no watermark, no border, no card frame.
`.trim();

// --- FREE option: Cloudflare Workers AI (FLUX.2 [klein]) ---
// No infra to manage, no GPU, ~10,000 free neurons/day, no credit card.
// Get CF_ACCOUNT_ID from your Cloudflare dashboard, and CF_API_TOKEN
// from My Profile -> API Tokens -> create token with "Workers AI" permission.
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_MODEL = "@cf/black-forest-labs/flux-2-klein-9b"; // or flux-2-klein-4b for faster/cheaper

console.log("CF_ACCOUNT_ID:", process.env.CF_ACCOUNT_ID);
console.log("CF_API_TOKEN:", process.env.CF_API_TOKEN);

async function generatePortrait(photoBuffer) {
    // Workers AI requires input images under 512x512
    const resized = await sharp(photoBuffer)
        .resize(512, 512, { fit: "inside" })
        .png()
        .toBuffer();

    const form = new FormData();
    form.append("prompt", STYLE_PROMPT);
    form.append("input_image_0", new Blob([resized], { type: "image/png" }), "input.png");
    form.append("width", "1024");
    form.append("height", "1024");

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
            body: form,
        }
    );

    if (!response.ok) {
        throw new Error(`Workers AI request failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    // Standard Workers AI envelope: { result: { image: "<base64 png>" }, success, errors, messages }
    // Double-check the exact field name against current Cloudflare docs before going live —
    // response shapes for newer models occasionally shift.
    return Buffer.from(data.result.image, "base64");
}

// --- Paid alternative kept for reference: OpenAI GPT Image ---
// async function generatePortraitOpenAI(photoBuffer, mimeType = "image/png") {
//     const file = await toFile(photoBuffer, "input.png", { type: mimeType });
//     const result = await openai.images.edit({
//         model: "gpt-image-1.5",
//         image: file,
//         prompt: STYLE_PROMPT,
//         size: "1024x1024",
//     });
//     return Buffer.from(result.data[0].b64_json, "base64");
// }

// ---------- 2. COMPOSITING STAGE: portrait -> finished card ----------

function escapeXml(str = "") {
    return str.replace(/[<>&'"]/g, (c) => ({
        "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
    }[c]));
}

// Builds a text/UI overlay as SVG so stats stay crisp, editable, and don't
// depend on the AI model getting typography right.
function buildOverlaySvg({ width, height, name, mbti, hp, moves = [], weakness, resistance, retreat, flavorText }) {
    const movesSvg = moves.map((m, i) => {
        const y = 760 + i * 130;
        return `
      <text x="120" y="${y}" font-family="Patrick Hand, sans-serif" font-size="30" fill="#2c2c6c">${escapeXml(m.name)}</text>
      <text x="${width - 90}" y="${y}" font-family="Patrick Hand, sans-serif" font-size="30" fill="#2c2c6c" text-anchor="end">${escapeXml(m.cost)}</text>
      <text x="120" y="${y + 36}" font-family="sans-serif" font-size="20" fill="#3a3a5c" width="700">${escapeXml(m.description)}</text>
    `;
    }).join("\n");

    return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="50" rx="25" fill="white" stroke="#2c2c6c" stroke-width="3"/>
      <text x="100" y="54" font-family="sans-serif" font-size="22" fill="#2c2c6c" text-anchor="middle">${escapeXml(mbti)}</text>

      <text x="200" y="65" font-family="Patrick Hand, cursive" font-size="60" fill="#2c2c6c">${escapeXml(name)}</text>

      <text x="${width - 140}" y="60" font-family="sans-serif" font-size="28" fill="#2c2c6c" text-anchor="end">HP ${escapeXml(String(hp))}</text>

      ${movesSvg}

      <text x="120" y="${height - 140}" font-family="sans-serif" font-size="20" fill="#2c2c6c">WEAKNESS  ${escapeXml(weakness)}   RESISTANCE  ${escapeXml(resistance)}   RETREAT  ${escapeXml(retreat)}</text>

      <text x="120" y="${height - 70}" font-family="sans-serif" font-size="18" fill="#3a3a5c" width="700">${escapeXml(flavorText)}</text>
    </svg>
  `;
}

async function composeCard(portraitBuffer, cardData) {
    const FRAME_PATH = "./templates/card-frame.png"; // your blank card background/border, transparent window
    const CARD_W = 920, CARD_H = 1300;
    const WINDOW = { left: 80, top: 150, width: 760, height: 480 }; // matches the photo window in your frame art

    const resizedPortrait = await sharp(portraitBuffer)
        .resize(WINDOW.width, WINDOW.height, { fit: "cover" })
        .toBuffer();

    const overlaySvg = buildOverlaySvg({ width: CARD_W, height: CARD_H, ...cardData });

    return sharp(FRAME_PATH)
        .resize(CARD_W, CARD_H)
        .composite([
            { input: resizedPortrait, left: WINDOW.left, top: WINDOW.top },
            { input: Buffer.from(overlaySvg), left: 0, top: 0 },
        ])
        .png()
        .toBuffer();
}

// ---------- 3. ROUTE ----------

app.post("/api/generate-card", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No photo uploaded" });

        const portrait = await generatePortrait(req.file.buffer, req.file.mimetype);

        const cardBuffer = await composeCard(portrait, {
            name: req.body.name || "Unnamed",
            mbti: req.body.mbti || "????",
            hp: req.body.hp || 100,
            moves: JSON.parse(req.body.moves || "[]"), // [{ name, cost, description }, ...]
            weakness: req.body.weakness || "-",
            resistance: req.body.resistance || "-",
            retreat: req.body.retreat || "-",
            flavorText: req.body.flavorText || "",
        });

        res.set("Content-Type", "image/png");
        res.send(cardBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Card generation failed", detail: err.message });
    }
});

app.listen(4000, () => {
    console.log("Backend running on :4000");
});