import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

function escapeXml(str = "") {
  const escapeMap: Record<string, string> = {
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  };
  return str.replace(/[<>&'"]/g, (c) => escapeMap[c] || c);
}

function buildOverlaySvg({ width, height, name, mbti, hp, moves = [], weakness, resistance, retreat, flavorText }: any) {
  const movesSvg = moves.map((m: any, i: number) => {
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

async function composeCard(portraitBuffer: Buffer, cardData: any) {
  // Using process.cwd() ensures it finds the public directory when running in Next.js
  const FRAME_PATH = path.join(process.cwd(), "public", "templates", "card-frame.png");
  // If the template is actually in a top-level templates folder, it would be:
  // const FRAME_PATH = path.join(process.cwd(), "templates", "card-frame.png");
  // Let's assume it's in the root templates directory based on the old server.js path "./templates/card-frame.png"
  const ACTUAL_FRAME_PATH = path.join(process.cwd(), "templates", "card-frame.png");
  
  const CARD_W = 920, CARD_H = 1300;
  const WINDOW = { left: 80, top: 150, width: 760, height: 480 };

  const resizedPortrait = await sharp(portraitBuffer)
    .resize(WINDOW.width, WINDOW.height, { fit: "cover" })
    .toBuffer();

  const overlaySvg = buildOverlaySvg({ width: CARD_W, height: CARD_H, ...cardData });

  return sharp(ACTUAL_FRAME_PATH)
    .resize(CARD_W, CARD_H)
    .composite([
      { input: resizedPortrait, left: WINDOW.left, top: WINDOW.top },
      { input: Buffer.from(overlaySvg), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 });
    }

    const portraitBuffer = Buffer.from(await photo.arrayBuffer());

    const cardBuffer = await composeCard(portraitBuffer, {
      name: formData.get('name') as string || "Unnamed",
      mbti: formData.get('mbti') as string || "????",
      hp: formData.get('hp') as string || "100",
      moves: JSON.parse((formData.get('moves') as string) || "[]"),
      weakness: formData.get('weakness') as string || "-",
      resistance: formData.get('resistance') as string || "-",
      retreat: formData.get('retreat') as string || "-",
      flavorText: formData.get('flavorText') as string || "",
    });

    return new NextResponse(cardBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Card generation failed', detail: err.message }, { status: 500 });
  }
}
