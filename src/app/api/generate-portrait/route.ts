import type { NextRequest } from 'next/server';

const STYLE_PROMPT = `
Redraw this person as a cute chibi/webtoon-style digital illustration in 
a hand-drawn pastel portrait style. Keep the person's exact skin tone from the 
original photo — do not lighten, whiten, brighten, or change the complexion. 
Preserve the original skin undertones and match the natural face, neck, 
    and visible body skin color consistently. Keep the person's
recognizable facial features, hairstyle, and skin tone, only stylized. 
Use soft painterly shading, thick clean outlines, big sparkly expressive eyes, 
and simplified rounded features. Warm pastel palette for clothing and background 
only, but keep the skin tone true to the original image. Close-up bust portrait 
framing, plain soft background, no text, no watermark, no border, no card frame.
`.trim();


const CF_MODEL = '@cf/black-forest-labs/flux-2-klein-9b';

export async function POST(request: NextRequest) {
  try {
    const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
    const CF_API_TOKEN = process.env.CF_API_TOKEN;

    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return Response.json(
        { error: 'CF_ACCOUNT_ID or CF_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const photoFile = formData.get('photo') as File | null;

    if (!photoFile) {
      return Response.json({ error: 'No photo provided' }, { status: 400 });
    }

    // Convert uploaded file to buffer
    const arrayBuffer = await photoFile.arrayBuffer();
    const photoBuffer = Buffer.from(arrayBuffer);

    // Build the form data for Cloudflare Workers AI
    const cfForm = new FormData();
    cfForm.append('prompt', STYLE_PROMPT);
    cfForm.append(
      'input_image_0',
      new Blob([photoBuffer], { type: 'image/png' }),
      'input.png'
    );
    cfForm.append('width', '1024');
    cfForm.append('height', '1024');

    let imageBuffer: Buffer | null = null;
    let cfError: string | null = null;

    try {
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
          body: cfForm,
        }
      );

      if (!cfResponse.ok) {
        cfError = await cfResponse.text();
        console.error('Cloudflare Workers AI error:', cfResponse.status, cfError);
      } else {
        const data = await cfResponse.json();
        if (data.result?.image) {
          imageBuffer = Buffer.from(data.result.image, 'base64');
        } else {
          cfError = 'No image in Workers AI response';
        }
      }
    } catch (err: any) {
      cfError = err.message;
      console.error('Cloudflare fetch failed:', err);
    }

    // FALLBACK to Gemini if Cloudflare failed (e.g., 429 rate limit)
    if (!imageBuffer) {
      console.log('Falling back to Gemini...');
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(`Cloudflare failed (${cfError}) and GEMINI_API_KEY is not configured for fallback.`);
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = photoBuffer.toString('base64');
      const mimeType = photoFile.type || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: STYLE_PROMPT,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new Error('No response from Gemini AI fallback');
      }

      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          break;
        }
      }

      if (!imageBuffer) {
        throw new Error('Gemini AI fallback did not return an image');
      }
    }

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Portrait generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate portrait';
    return Response.json({ error: message }, { status: 500 });
}
