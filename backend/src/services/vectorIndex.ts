let memory: any[] = [];

export function addToIndex(incident: any) { memory.push(incident); }

export async function searchSimilar(prompt: string) {
  return memory.filter(x => (x.run?.prompt_text || '').includes((prompt || '').slice(0, 6)));
}