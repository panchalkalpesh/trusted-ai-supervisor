import { request } from 'undici';

const SANDBOX_URL = process.env.UNTRUSTED_SANDBOX_URL || 'http://untrusted_sandbox:5005/query';

export interface ProbeResponse {
    model: string;
    model_version: string;
    response: string;
    tokens: number;
    latency_ms: number;
};

export async function probeModel(prompt: string):Promise<ProbeResponse> {
  const start = Date.now();
  try {
    const res = await request(SANDBOX_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.body.json() as ProbeResponse;

    return {
      model: data.model || 'sandbox',
      model_version: data.model_version || '0.0.0',
      response: data.response || '',
      tokens: data.tokens || Math.max(1, Math.ceil((data.response || '').length / 4)),
      latency_ms: data.latency_ms || (Date.now() - start)
    };
  } catch (err) {
    console.error('probeModel error', err);
    return {
      model: 'unknown',
      model_version: '0.0.0',
      response: `ERROR: ${String(err)}`,
      tokens: 0,
      latency_ms: Date.now() - start
    };
  }
}
