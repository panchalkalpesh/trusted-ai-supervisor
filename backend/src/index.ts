import { Hono } from "hono";
import { cors } from "hono/cors";
import incidents from "./routes/incidents";
import probe from "./routes/probe";
import health from "./routes/health";


const app = new Hono();

app.use('/*', cors());

app.route("/incidents", incidents);

app.route('/probe', probe)

app.route("/health", health);

export default app;