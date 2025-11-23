import { Hono } from "hono";
import { probeModel } from "../services/probeManager";
import { runFilter } from "../services/trustedFilter";
import { addToIndex, searchSimilar } from "../services/vectorIndex";

const app = new Hono();

const incidents: any[] = [];

// POST /incidents/probe -> { prompt }
app.post('/probe', async c => {
  const body = await c.req.json();
  const prompt = body.prompt || '';

  // Query the sandboxed untrusted model
  const start = Date.now();
  const modelResp = await probeModel(prompt);
  const latency = Date.now() - start;

  // Run the trusted filter
  const filterDecision = await runFilter(prompt, modelResp.response);

  // Build in-memory records
  const runId = Date.now();
  const responseId = runId + 1;
  const decisionId = runId + 2;
  const incidentId = runId + 3;

  const run = {
    id: runId,
    user_id: null,
    prompt_text: prompt,
    model_name: modelResp.model,
    model_version: modelResp.model_version,
    created_at: new Date().toISOString()
  };

  const response = {
    id: responseId,
    run_id: runId,
    response_text: modelResp.response,
    tokens: modelResp.tokens,
    latency_ms: modelResp.latency_ms || latency,
    created_at: new Date().toISOString()
  };

  const decision = {
    id: decisionId,
    response_id: responseId,
    severity: filterDecision.severity,
    reason: filterDecision.reason,
    rules_matched: filterDecision.rulesMatched,
    classifier_score: filterDecision.classifierScore,
    created_at: new Date().toISOString()
  };

  const incident = {
    id: incidentId,
    decision_id: decisionId,
    status: 'open',
    assigned_to: null,
    notes: ''
  };

  incidents.push({ run, response, decision, incident });
  addToIndex({ run, response, decision, incident });

  return c.json({ run, response, decision, incident });
});

// POST /incidents/similar -> { prompt }
app.post("/similar", async c => {
  const body = await c.req.json();
  return c.json(await searchSimilar(body.prompt));
});


app.get('/all', c => c.json(incidents));

export default app;
