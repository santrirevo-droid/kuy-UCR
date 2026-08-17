"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminNav from "@/components/AdminNav";

type PublicUser = { username: string; name: string; createdAt: number; mustChangePassword?: boolean };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [created, setCreated] = useState<{ name: string; username: string; password: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<{ name: string; username: string; password: string } | null>(null);

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
    <div className="min-h-screen bg-orange-50/40 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <AdminNav />

        <h1 className="mt-6 font-heading text-2xl font-extrabold text-slate-900 dark:text-white">👥 Kelola User</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Buatkan akun untuk tiap peserta rombongan. Mereka pakai akun ini untuk masuk & mencentang progres
          persiapannya sendiri di setiap tahap.
        </p>

        {dbError && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
            ⚠️ {dbError}
          </div>
        )}

        <form
          onSubmit={onCreate}
          className="mt-6 space-y-3 rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama peserta</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="budi (huruf kecil, tanpa spasi)"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900"
                required
              />
            </div>
          </div>
          {createError && <p className="text-sm text-red-600 dark:text-red-400">{createError}</p>}
          <button
            disabled={creating}
            className="rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
          >
            {creating ? "Membuat..." : "+ Buat akun"}
          </button>
        </form>

        {created && (
          <div className="mt-4 rounded-2xl border-2 border-teal-300 bg-teal-50 p-4 text-sm text-teal-900 dark:border-teal-700 dark:bg-teal-950/30 dark:text-teal-100">
            ✅ Akun <strong>{created.name}</strong> dibuat. Sampaikan kredensial ini ke pesertanya (hanya tampil sekali):
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-sm">
              <span className="rounded bg-white/70 px-2 py-1 dark:bg-slate-900/70">username: {created.username}</span>
              <span className="rounded bg-white/70 px-2 py-1 dark:bg-slate-900/70">password: {created.password}</span>
            </div>
          </div>
        )}

        {resetResult && (
          <div className="mt-4 rounded-2xl border-2 border-teal-300 bg-teal-50 p-4 text-sm text-teal-900 dark:border-teal-700 dark:bg-teal-950/30 dark:text-teal-100">
            ✅ Password <strong>{resetResult.name}</strong> di-reset. Sampaikan ke pesertanya (hanya tampil sekali):
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-sm">
              <span className="rounded bg-white/70 px-2 py-1 dark:bg-slate-900/70">username: {resetResult.username}</span>
              <span className="rounded bg-white/70 px-2 py-1 dark:bg-slate-900/70">password: {resetResult.password}</span>
            </div>
          </div>
        )}

        <h2 className="mt-8 font-heading text-lg font-bold text-slate-800 dark:text-slate-100">
          Daftar peserta {!loading && `(${users.length})`}
        </h2>
        {loading ? (
          <p className="mt-2 text-sm text-slate-400">Memuat...</p>
        ) : users.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Belum ada akun peserta.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {users.map((u) => (
              <li
                key={u.username}
                className="flex items-center justify-between rounded-xl border border-orange-100 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/70"
              >
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                  {u.name}
                  {u.mustChangePassword && (
                    <span
                      title="Belum ganti password default"
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                      ⏳ belum ganti password
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">@{u.username}</span>
                  <button
                    onClick={() => onResetPassword(u)}
                    disabled={resetting === u.username}
                    className="text-xs font-semibold text-orange-500 transition hover:text-orange-700 disabled:opacity-50 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    {resetting === u.username ? "..." : "Reset password"}
                  </button>
                  <button
                    onClick={() => onDelete(u.username)}
                    disabled={deleting === u.username}
                    className="text-xs font-semibold text-red-500 transition hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {deleting === u.username ? "..." : "Hapus"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
