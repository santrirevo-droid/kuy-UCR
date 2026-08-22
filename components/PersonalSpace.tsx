"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PersonalData, PersonalItem } from "@/lib/personal";

type SaveStatus = "idle" | "saving" | "saved" | "error";

// Kartu "ruang pribadi" per tahap — checklist & catatan yang dibuat sendiri
// oleh user, terpisah total dari checklist umum di konten markdown (beda
// penyimpanan, beda tampilan garis putus-putus) supaya kelihatan jelas ini
// milik pribadi, bukan bagian resmi tahapnya.
export default function PersonalSpace({
  stageSlug,
  initialData,
}: {
  stageSlug: string;
  initialData: PersonalData;
}) {
  const [items, setItems] = useState<PersonalItem[]>(initialData.items);
  const [notes, setNotes] = useState(initialData.notes);
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notesStatus, setNotesStatus] = useState<SaveStatus>("idle");

  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesInitial = useRef(initialData.notes);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text || adding) return;

    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`/api/personal/${stageSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gagal menambah item");
      setItems((prev) => [...prev, data.item as PersonalItem]);
      setNewText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah item");
    } finally {
      setAdding(false);
    }
  }

  async function toggleItem(id: string, done: boolean) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done } : it)));
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/personal/${stageSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !done } : it)));
    } finally {
      setPendingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }

  async function deleteItem(id: string) {
    const removed = items.find((it) => it.id === id);
    setItems((prev) => prev.filter((it) => it.id !== id));
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/personal/${stageSlug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      if (removed) setItems((prev) => [...prev, removed].sort((a, b) => a.createdAt - b.createdAt));
    } finally {
      setPendingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }

  // Autosave catatan, di-debounce 900ms setelah user berhenti mengetik.
  useEffect(() => {
    if (notes === notesInitial.current) return;
    setNotesStatus("saving");
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/personal/${stageSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });
        if (!res.ok) throw new Error("failed");
        notesInitial.current = notes;
        setNotesStatus("saved");
      } catch {
        setNotesStatus("error");
      }
    }, 900);
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className="not-prose my-8 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-5 shadow-sm dark:border-indigo-800/60 dark:bg-indigo-950/20 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-indigo-900 dark:text-indigo-200">
            🔒 Checklist &amp; Catatan Pribadi
          </h2>
          <p className="mt-0.5 text-sm text-indigo-500/80 dark:text-indigo-400/80">
            Ruangmu sendiri untuk tahap ini — cuma kamu yang bisa lihat &amp; edit bagian ini.
          </p>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
            {doneCount}/{items.length} selesai
          </span>
        )}
      </div>

      {items.length > 0 && (
        <ul className="mt-4 divide-y divide-indigo-100 overflow-hidden rounded-xl border border-indigo-100 bg-white/80 dark:divide-indigo-900/50 dark:border-indigo-900/50 dark:bg-slate-900/50">
          {items.map((item) => {
            const isPending = pendingIds.has(item.id);
            return (
              <li
                key={item.id}
                className="group flex items-center gap-3 px-4 py-2.5 transition hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  disabled={isPending}
                  onChange={(e) => toggleItem(item.id, e.target.checked)}
                  className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-2 border-indigo-300 accent-indigo-500 disabled:cursor-wait disabled:opacity-60 dark:border-indigo-700"
                />
                <span
                  className={`flex-1 text-sm leading-relaxed ${
                    item.done
                      ? "text-slate-400 line-through dark:text-slate-500"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  disabled={isPending}
                  aria-label="Hapus item"
                  className="shrink-0 rounded-full px-2 py-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-wait group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Tambah item checklist pribadimu…"
          maxLength={300}
          className="min-w-0 flex-1 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900"
        />
        <button
          type="submit"
          disabled={adding || !newText.trim()}
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? "Menambah…" : "+ Tambah"}
        </button>
      </form>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor={`notes-${stageSlug}`} className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
            📝 Catatan pribadi
          </label>
          <span className="text-xs text-indigo-400 dark:text-indigo-500">
            {notesStatus === "saving" && "Menyimpan…"}
            {notesStatus === "saved" && "Tersimpan ✓"}
            {notesStatus === "error" && "Gagal menyimpan, coba lagi"}
          </span>
        </div>
        <textarea
          id={`notes-${stageSlug}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={5000}
          rows={4}
          placeholder="Tulis apa saja — pengingat, ide, atau hal yang cuma relevan buat kamu di tahap ini…"
          className="mt-2 w-full resize-y rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900"
        />
      </div>
    </section>
  );
}
