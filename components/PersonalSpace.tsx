"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PersonalData, PersonalItem } from "@/lib/personal";
import Icon from "@/components/Icon";
import { btnPrimary, input, label } from "@/lib/ui";

type SaveStatus = "idle" | "saving" | "saved" | "error";

// Kartu "ruang pribadi" per tahap — checklist & catatan yang dibuat sendiri
// oleh user, terpisah total dari checklist umum di konten markdown (beda
// penyimpanan, beda bingkai visual) supaya jelas ini milik pribadi, bukan
// bagian resmi dari tahapnya.
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
    <section className="not-prose mt-14 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2 px-5 py-3.5">
        <h2 className="flex items-center gap-2.5 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-ink-muted">
          <Icon name="lock" className="h-3.5 w-3.5 text-gold" />
          Ruang pribadi
        </h2>
        {items.length > 0 && (
          <span className="tnum text-xs font-semibold text-ink-muted">
            {doneCount} / {items.length} selesai
          </span>
        )}
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Checklist dan catatan yang kamu buat sendiri untuk tahap ini. Hanya kamu yang bisa melihat dan mengubahnya.
        </p>

        {items.length > 0 && (
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-md border border-line">
            {items.map((item) => {
              const isPending = pendingIds.has(item.id);
              return (
                <li
                  key={item.id}
                  className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60"
                >
                  <span className="relative mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={isPending}
                      onChange={(e) => toggleItem(item.id, e.target.checked)}
                      className="peer h-full w-full cursor-pointer appearance-none rounded border border-line-strong bg-surface transition checked:border-brand checked:bg-brand disabled:cursor-wait"
                    />
                    <Icon
                      name="check"
                      strokeWidth={3}
                      className="pointer-events-none absolute h-3 w-3 text-brand-on opacity-0 transition-opacity peer-checked:opacity-100"
                    />
                  </span>
                  <span
                    className={`flex-1 text-sm leading-relaxed transition-colors ${
                      item.done ? "text-ink-subtle line-through" : "text-ink"
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    disabled={isPending}
                    aria-label={`Hapus item: ${item.text}`}
                    className="shrink-0 rounded p-1 text-ink-subtle opacity-0 transition hover:bg-danger-soft hover:text-danger focus-visible:opacity-100 disabled:cursor-wait group-hover:opacity-100"
                  >
                    <Icon name="x" className="h-3.5 w-3.5" />
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
            placeholder="Tambah item checklist pribadi…"
            maxLength={300}
            className={`${input} min-w-0 flex-1`}
          />
          <button type="submit" disabled={adding || !newText.trim()} className={`${btnPrimary} shrink-0`}>
            <Icon name="plus" className="h-4 w-4" />
            <span className="hidden sm:inline">{adding ? "Menambah…" : "Tambah"}</span>
          </button>
        </form>
        {error && <p className="mt-2 text-xs font-medium text-danger">{error}</p>}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={`notes-${stageSlug}`} className={label}>
              Catatan pribadi
            </label>
            <span className="text-xs text-ink-subtle">
              {notesStatus === "saving" && "Menyimpan…"}
              {notesStatus === "saved" && "Tersimpan"}
              {notesStatus === "error" && <span className="text-danger">Gagal menyimpan, coba lagi</span>}
            </span>
          </div>
          <textarea
            id={`notes-${stageSlug}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={5000}
            rows={5}
            placeholder="Pengingat, ide, atau hal yang hanya relevan buat kamu di tahap ini…"
            className={`${input} mt-2 resize-y leading-relaxed`}
          />
        </div>
      </div>
    </section>
  );
}
