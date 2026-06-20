import { NextResponse } from 'next/server';
import sharp from 'sharp';

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

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_MODEL = "@cf/black-forest-labs/flux-2-klein-9b";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 });
    }

    const photoBuffer = Buffer.from(await photo.arrayBuffer());

    // Workers AI requires input images under 512x512
    const resized = await sharp(photoBuffer)
      .resize(512, 512, { fit: "inside" })
      .png()
      .toBuffer();

    const cfForm = new FormData();
    cfForm.append("prompt", STYLE_PROMPT);
    cfForm.append("input_image_0", new Blob([resized as any], { type: "image/png" }), "input.png");
    cfForm.append("width", "1024");
    cfForm.append("height", "1024");

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        body: cfForm,
      }
    );

    if (!response.ok) {
      throw new Error(`Workers AI request failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const imageBuffer = Buffer.from(data.result.image, "base64");

    return new NextResponse(imageBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Portrait generation failed', detail: err.message }, { status: 500 });
  }
}
