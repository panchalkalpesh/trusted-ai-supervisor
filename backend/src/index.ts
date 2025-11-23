import { Hono } from "hono";
import { cors } from "hono/cors";
import incidents from "./routes/incidents";


const app = new Hono();

app.use('/incidents/*', cors());

app.route("/incidents", incidents);

app.get("/health", (c) => {
  const timestamp = new Date();
  const app = 'tms-backend';
  return c.json({ app, ok: true, timestamp })
});


export default app;