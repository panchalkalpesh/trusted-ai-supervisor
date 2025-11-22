import { Hono } from "hono";
import { probeModel } from "../services/probeManager";
import { runFilter } from "../services/trustedFilter";
import { addToIndex, searchSimilar } from "../services/vectorIndex";


const incidents: any[] = [];


const app = new Hono();


app.post("/probe", async c => {
  const { prompt } = await c.req.json();


  const response = await probeModel(prompt);
  const severity = await runFilter(prompt, response);


  const incident = { id: Date.now(), prompt, response, severity };
  incidents.push(incident);
  addToIndex(incident);


  return c.json(incident);
});


app.get("/all", c => c.json(incidents));


app.post("/similar", async c => {
  const body = await c.req.json();
  return c.json(await searchSimilar(body.prompt));
});


export default app;