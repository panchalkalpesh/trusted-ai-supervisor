export const API_HOST = 'http://localhost:3000'

export async function submitPrompt(prompt: string) {
  const response = fetch(`${API_HOST}/probe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  return (await response).json();
}

export async function getIncidents() {
  const response = fetch(`${API_HOST}/incidents`);
  return (await response).json();
}

export async function getHealth() {
  const response = fetch(`${API_HOST}/health`);
  return (await response).json();
}