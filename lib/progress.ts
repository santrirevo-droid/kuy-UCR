import { getRedis } from "@/lib/kv";

function key(username: string, stageSlug: string) {
  return `progress:${username}:${stageSlug}`;
}

export async function getStageProgress(username: string, stageSlug: string): Promise<number[]> {
  try {
    const members = (await getRedis().smembers(key(username, stageSlug))) as string[] | null;
    return (members ?? []).map(Number).filter((n) => Number.isInteger(n));
  } catch {
    return [];
  }
}

export async function setItemDone(username: string, stageSlug: string, index: number, done: boolean): Promise<void> {
  const redis = getRedis();
  const k = key(username, stageSlug);
  if (done) {
    await redis.sadd(k, String(index));
  } else {
    await redis.srem(k, String(index));
  }
}

// Jumlah item checklist ('- [ ]' / '- [x]') di sebuah markdown.
export function countChecklistItems(markdown: string): number {
  const matches = markdown.match(/^\s*[-*]\s+\[[ xX]\]/gm);
  return matches ? matches.length : 0;
}
