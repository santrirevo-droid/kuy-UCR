"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminNav from "@/components/AdminNav";
import Icon from "@/components/Icon";
import { btnPrimary, card, eyebrow, input, label } from "@/lib/ui";

type PublicUser = { username: string; name: string; createdAt: number; mustChangePassword?: boolean };
type Credential = { name: string; username: string; password: string };

// Kredensial hanya tampil sekali setelah dibuat/di-reset — ditonjolkan sebagai
// kartu tersendiri dengan teks monospace supaya gampang disalin & tidak
// tertukar karakternya.
function CredentialCard({ title, cred }: { title: string; cred: Credential }) {
  return (
    <div className="mt-4 rounded-lg border border-success/30 bg-success-soft px-5 py-4">
      <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-success">
        <Icon name="check" className="h-3.5 w-3.5" />
        {title}
      </p>
      <p className="mt-2 text-sm text-ink">
        Sampaikan kredensial ini ke <strong className="font-semibold">{cred.name}</strong> — hanya ditampilkan sekali.
      </p>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {[
          { k: "Username", v: cred.username },
          { k: "Password", v: cred.password },
        ].map((row) => (
          <div key={row.k} className="rounded-md border border-line bg-surface px-3 py-2">
            <dt className="text-[0.6rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{row.k}</dt>
            <dd className="mt-1 select-all font-mono text-sm text-ink">{row.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [created, setCreated] = useState<Credential | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<Credential | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      if (data.error) setDbError(data.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreated(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Gagal membuat user");
        return;
      }
      setCreated({ name: data.user.name, username: data.user.username, password: data.password });
      setName("");
      setUsername("");
      loadUsers();
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(username: string) {
    if (!confirm(`Hapus akun @${username}? Progres checklist-nya ikut terhapus dan tidak bisa dikembalikan.`)) return;
    setDeleting(username);
    try {
      const res = await fetch(`/api/admin/users/${username}`, { method: "DELETE" });
      if (res.ok) loadUsers();
    } finally {
      setDeleting(null);
    }
  }

  async function onResetPassword(u: PublicUser) {
    if (!confirm(`Reset password @${u.username}? Password lamanya langsung tidak berlaku.`)) return;
    setResetting(u.username);
    setResetResult(null);
    try {
      const res = await fetch(`/api/admin/users/${u.username}`, { method: "PUT" });
      const data = await res.json();
      if (res.ok) setResetResult({ name: u.name, username: u.username, password: data.password });
    } finally {
      setResetting(null);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="border-b border-line pb-6">
          <p className={eyebrow}>Manajemen akun</p>
          <h1 className="mt-2.5 font-display text-display-sm font-semibold text-ink">Kelola user</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Buatkan akun untuk tiap peserta rombongan. Akun ini dipakai untuk masuk dan mencentang progres
            persiapannya sendiri di setiap tahap.
          </p>
        </div>

        {dbError && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-warn/35 bg-warn-soft px-5 py-4 text-sm leading-relaxed text-ink">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <span>{dbError}</span>
          </div>
        )}

        <form onSubmit={onCreate} className={`${card} mt-8 p-6`}>
          <h2 className="font-display text-lg font-semibold text-ink">Tambah peserta</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>
                Nama peserta
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className={`${input} mt-2`}
                required
              />
            </div>
            <div>
              <label htmlFor="new-username" className={label}>
                Username
              </label>
              <input
                id="new-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="budi"
                className={`${input} mt-2`}
                required
              />
              <p className="mt-2 text-xs text-ink-subtle">Huruf kecil, tanpa spasi.</p>
            </div>
          </div>
          {createError && (
            <p className="mt-4 flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              {createError}
            </p>
          )}
          <button disabled={creating} className={`${btnPrimary} mt-5`}>
            <Icon name="plus" className="h-4 w-4" />
            {creating ? "Membuat…" : "Buat akun"}
          </button>
        </form>

        {created && <CredentialCard title="Akun dibuat" cred={created} />}
        {resetResult && <CredentialCard title="Password di-reset" cred={resetResult} />}

        <div className="mt-10 flex items-baseline justify-between gap-3 border-b border-line pb-3">
          <h2 className="font-display text-lg font-semibold text-ink">Daftar peserta</h2>
          {!loading && <span className="tnum text-xs font-medium text-ink-subtle">{users.length} akun</span>}
        </div>

        {loading ? (
          <p className="py-6 text-sm text-ink-subtle">Memuat…</p>
        ) : users.length === 0 ? (
          <p className="py-6 text-sm text-ink-subtle">Belum ada akun peserta.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li
                key={u.username}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-2 py-4"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{u.name}</span>
                    {u.mustChangePassword && (
                      <span className="inline-flex items-center gap-1 rounded border border-warn/35 bg-warn-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-warn">
                        <Icon name="clock" className="h-3 w-3" />
                        belum ganti password
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-subtle">@{u.username}</span>
                </span>
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => onResetPassword(u)}
                    disabled={resetting === u.username}
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-surface-2 hover:text-brand disabled:opacity-50"
                  >
                    <Icon name="key" className="h-3.5 w-3.5" />
                    {resetting === u.username ? "Mereset…" : "Reset password"}
                  </button>
                  <button
                    onClick={() => onDelete(u.username)}
                    disabled={deleting === u.username}
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                  >
                    <Icon name="x" className="h-3.5 w-3.5" />
                    {deleting === u.username ? "Menghapus…" : "Hapus"}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
