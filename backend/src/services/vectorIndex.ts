const DB: any[] = [];

export function addToIndex(item: any) {
  DB.push(item);
}

export async function searchSimilar(prompt: any) {
  return DB.filter(x => (x.run?.prompt_text || '').includes((prompt || '').slice(0, 6)));
}