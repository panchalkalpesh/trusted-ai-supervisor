// Mock sandboxed model
export async function probeModel(prompt: string): Promise<string> {
  if (prompt.includes("harm")) return "Potentially harmful response";
  return "Safe response: echoing " + prompt;
}