import { Hono } from 'hono';

const app = new Hono();
const SANDBOX_HOST = process.env.SANDBOX_HOST || 'http://localhost:5005';

app.get('/', async c => {
  const timestamp = new Date();
  try {
    const sandboxResponse = await fetch(`${SANDBOX_HOST}/health`);
    const sandbox = (await sandboxResponse.json())?.ok || false;
    return c.json({ backend: true, sandbox, timestamp });
  } catch (err) {
    return c.json({ backend: true, sandbox: false, timestamp });
  }
});


export default app;