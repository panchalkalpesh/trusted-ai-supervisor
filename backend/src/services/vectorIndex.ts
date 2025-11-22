let db: any[] = [];


export function addToIndex(incident: any) {
  db.push(incident);
}


export async function searchSimilar(prompt: string) {
  return db.filter(x => x.prompt.includes(prompt.slice(0, 4)));
}