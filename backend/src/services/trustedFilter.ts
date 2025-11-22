export async function runFilter(prompt: string, response: string) {
  if (response.includes("harm")) return 0.9; // high severity
  return 0.1;
}