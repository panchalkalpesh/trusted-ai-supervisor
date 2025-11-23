
const port = process.env.PORT || 5005;

const MODEL_META = {
  model_name: 'sandbox-llm-v0',
  model_version: '0.1.0',
  max_tokens: 1024
};

function simulateTokens(text) {
  // naive token estimate: 1 token ~= 4 chars
  return Math.max(1, Math.ceil((text || '').length / 4));
}

async function handleQuery(request) {
  const { prompt } = await request.json() || {};
  const start = Date.now();

  // Simulate latency (random small delay)
  const latency = 50 + Math.floor(Math.random() * 150);
  await new Promise(r => setTimeout(r, latency));

  // safe simulated responses:
  let responseText = `Echo: ${prompt || ''}`;

  // examples of safe blocking wording for demo
  const low = (prompt || '').toLowerCase();
  if (low.includes('harm') || low.includes('weapon') || low.includes('explosive')) {
    responseText = "I cannot assist with harmful or dangerous instructions.";
  } else if (low.includes('jailbreak')) {
    responseText = "This appears to be an attempt to bypass safety controls.";
  }

  const tokens = simulateTokens(responseText);
  const elapsed = Date.now() - start;

  return Response.json({
    model: MODEL_META.model_name,
    model_version: MODEL_META.model_version,
    response: responseText,
    tokens,
    latency: elapsed
  });
}

function handleHealth() {
  const app = 'tms-sandbox';
  const timestamp = new Date();
  return Response.json({ app, ok: true, timestamp });
}


// Use Bun.serve to create the HTTP server
const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/query' && req.method === 'POST') {
      return handleQuery(req);
    }
    if (url.pathname === '/health' && req.method === 'GET') {
      return handleHealth();
    }
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Sandbox listening on ${server.port}`);
