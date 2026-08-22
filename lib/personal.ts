import { getRedis } from "@/lib/kv";
import { randomUUID } from "node:crypto";

// "Ruang pribadi" per user per tahap — checklist & catatan yang dia buat
// sendiri, terpisah dari checklist umum di konten markdown. Cuma pemiliknya
// yang bisa lihat & edit (dikunci lewat username dari session, bukan input
// user).

export type PersonalItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

export type PersonalData = {
  items: PersonalItem[];
  notes: string;
};

const MAX_ITEMS = 100;
const MAX_TEXT_LENGTH = 300;
const MAX_NOTES_LENGTH = 5000;

function key(username: string, stageSlug: string) {
  return `personal:${username}:${stageSlug}`;
}

function empty(): PersonalData {
  return { items: [], notes: "" };
}

export async function getPersonalData(username: string, stageSlug: string): Promise<PersonalData> {
  try {
    const data = await getRedis().get<PersonalData>(key(username, stageSlug));
    if (!data) return empty();
    return {
      items: Array.isArray(data.items) ? data.items : [],
      notes: typeof data.notes === "string" ? data.notes : "",
    };
  } catch {
    return empty();
  }
}

async function save(username: string, stageSlug: string, data: PersonalData): Promise<void> {
  await getRedis().set(key(username, stageSlug), data);
}

export async function addPersonalItem(username: string, stageSlug: string, text: string): Promise<PersonalItem> {
  const trimmed = text.trim().slice(0, MAX_TEXT_LENGTH);
  if (!trimmed) throw new Error("Teks item tidak boleh kosong");

  const data = await getPersonalData(username, stageSlug);
  if (data.items.length >= MAX_ITEMS) throw new Error("Maksimal 100 item checklist pribadi per tahap");

  const item: PersonalItem = { id: randomUUID(), text: trimmed, done: false, createdAt: Date.now() };
  data.items.push(item);
  await save(username, stageSlug, data);
  return item;
}

export async function togglePersonalItem(
  username: string,
  stageSlug: string,
  id: string,
  done: boolean
): Promise<void> {
  const data = await getPersonalData(username, stageSlug);
  const item = data.items.find((i) => i.id === id);
  if (!item) return;
  item.done = done;
  await save(username, stageSlug, data);
}

export async function deletePersonalItem(username: string, stageSlug: string, id: string): Promise<void> {
  const data = await getPersonalData(username, stageSlug);
  const next = data.items.filter((i) => i.id !== id);
  if (next.length === data.items.length) return;
  data.items = next;
  await save(username, stageSlug, data);
}

export async function setPersonalNotes(username: string, stageSlug: string, notes: string): Promise<void> {
  const data = await getPersonalData(username, stageSlug);
  data.notes = notes.slice(0, MAX_NOTES_LENGTH);
  await save(username, stageSlug, data);
}
