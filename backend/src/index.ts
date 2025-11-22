import { Hono } from "hono";
import { cors } from "hono/cors";
import incidents from "./routes/incidents";


const app = new Hono();

app.use('/incidents/*', cors());

app.route("/incidents", incidents);


app.get("/health", (c) => c.json({ ok: true }));


export default app;