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

    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
      {
        method: 'POST',

        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        body: cfForm,
      }
    );


    if (!cfResponse.ok) {
      const errorText = await cfResponse.text();
      console.error('Cloudflare Workers AI error:', cfResponse.status, errorText);
      throw new Error(`Workers AI request failed: ${cfResponse.status}`);
    }

    const data = await cfResponse.json();

    // Standard Workers AI envelope: { result: { image: "<base64 png>" }, success, errors, messages }
    if (!data.result?.image) {
      console.error('Unexpected CF response:', JSON.stringify(data).slice(0, 500));
      throw new Error('No image in Workers AI response');
    }

    const imageBuffer = Buffer.from(data.result.image, 'base64');

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
}
