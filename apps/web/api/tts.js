/* global Buffer, fetch, process */

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const edgeDefaultVoice = 'en-US-AriaNeural';
const openAiSpeechModel = 'gpt-4o-mini-tts';
const openAiTtsEndpoint = 'https://api.openai.com/v1/audio/speech';
const openAiInstructions =
  'Speak like a warm, friendly English teacher for a child. Use clear pronunciation, gentle energy, and a slightly slower pace.';

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function edgeRateToProsody(rate) {
  if (rate <= 0.76) {
    return '-20%';
  }

  if (rate >= 1.05) {
    return '+10%';
  }

  return '-5%';
}

async function createEdgeAudioBuffer(text, voice, rate) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    typeof voice === 'string' && voice ? voice : edgeDefaultVoice,
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  );

  const { audioStream } = await tts.toStream(text, {
    rate: edgeRateToProsody(typeof rate === 'number' ? rate : 0.75),
  });

  return await new Promise((resolve, reject) => {
    const chunks = [];

    audioStream.on('data', (chunk) => chunks.push(chunk));
    audioStream.on('close', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', reject);
  });
}

async function createOpenAIAudioBuffer(text, voice, rate) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
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
    throw new Error(`OpenAI TTS request failed: ${errorText.slice(0, 500)}`);
  }

  return Buffer.from(await openAiResponse.arrayBuffer());
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const { provider, rate, text, voice } = request.body ?? {};

    if (!text || typeof text !== 'string') {
      sendJson(response, 400, { error: 'Missing text.' });
      return;
    }

    const audioBuffer =
      provider === 'openai'
        ? await createOpenAIAudioBuffer(text, voice, rate)
        : await createEdgeAudioBuffer(text, voice, rate);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader('Cache-Control', 'no-store');
    response.end(audioBuffer);
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'TTS request failed.',
    });
  }
}
