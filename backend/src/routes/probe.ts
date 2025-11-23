import { Hono } from 'hono';
import { probeModel } from '../services/probeManager.js';
import { runFilter } from '../services/trustedFilter.js';
import { sql } from '../db.js';


const app = new Hono();

app.post('/', async c => {
  const { prompt } = await c.req.json();

  const result = await probeModel(prompt);
  const filter = await runFilter(prompt, result);

  // const dateTimeID = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3); // Format YYYYMMDDHHmmss eg: 20251124003745, 20251202003857

  const insertedRun = await sql`INSERT INTO runs (user_id, prompt_text, model_name, model_version) VALUES (1, ${prompt}, ${result.model}, ${result.model_version}) RETURNING id`;
  const runId = insertedRun[0].id;


  const insertedResp = await sql`INSERT INTO responses (run_id, response_text, tokens, latency) VALUES (${runId}, ${result.response}, ${result.tokens}, ${result.latency}) RETURNING id`;
  const respId = insertedResp[0].id;


  const insertedDec = await sql`INSERT INTO decisions (response_id, severity, reason, rules_matched, classifier_score) VALUES (${respId}, ${filter.severity}, ${filter.reason}, ${filter.rulesMatched.join(',')}, ${filter.classifierScore}) RETURNING id`;
  const decId = insertedDec[0].id;


  await sql`INSERT INTO incidents (decision_id) VALUES (${decId})`;

  return c.json({ success: true, runId, respId, decId });
});


export default app;