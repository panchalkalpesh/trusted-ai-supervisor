import { Hono } from 'hono';
import { sql } from '../db.js';

const app = new Hono();


app.get('/', async c => {
  const rows = await sql`
  SELECT i.id as incident_id, d.severity, r.prompt_text, rs.response_text, d.reason
  FROM incidents i
  JOIN decisions d ON d.id = i.decision_id
  JOIN responses rs ON rs.id = d.response_id
  JOIN runs r ON r.id = rs.run_id
  ORDER BY i.id DESC
  `;


  return c.json(rows);
});


export default app;