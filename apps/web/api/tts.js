/* global Buffer, fetch, process */

const openAiSpeechModel = 'gpt-4o-mini-tts';
const openAiTtsEndpoint = 'https://api.openai.com/v1/audio/speech';
const openAiInstructions =
  'Speak like a warm, friendly English teacher for a child. Use clear pronunciation, gentle energy, and a slightly slower pace.';

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(response, 500, {
      error: 'OPENAI_API_KEY is not configured on the server.',
    });
    return;
  }

  try {
    const { rate, text, voice } = request.body ?? {};

    if (!text || typeof text !== 'string') {
      sendJson(response, 400, { error: 'Missing text.' });
      return;
    }

    const openAiResponse = await fetch(openAiTtsEndpoint, {
      body: JSON.stringify({
        input: text,
        instructions: openAiInstructions,
        model: openAiSpeechModel,
        response_format: 'mp3',
        speed: typeof rate === 'number' ? rate : 0.75,
        voice: typeof voice === 'string' && voice ? voice : 'coral',
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      sendJson(response, openAiResponse.status, {
        error: 'OpenAI TTS request failed.',
        detail: errorText.slice(0, 500),
      });
      return;
    }

    const audioBuffer = Buffer.from(await openAiResponse.arrayBuffer());

    response.statusCode = 200;
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader('Cache-Control', 'no-store');
    response.end(audioBuffer);
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'OpenAI TTS failed.',
    });
  }
}
