const API_BASE = "http://localhost:3000";

export async function submitPrompt(prompt: string) {
  const res = await fetch(`${API_BASE}/incidents/probe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  return await res.json();
}


export async function getIncidents() {
  const res = await fetch(`${API_BASE}/incidents/all`);
  return await res.json();
}