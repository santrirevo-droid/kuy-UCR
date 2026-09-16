"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import Icon from "@/components/Icon";
import { btnPrimary, card, input, label } from "@/lib/ui";

export default function ChangePasswordForm({ forced = false }: { forced?: boolean }) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengubah password");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (forced) {
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${card} mt-8 space-y-5 p-6`}>
      <div>
        <label htmlFor="current-password" className={label}>
          Password saat ini
        </label>
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${input} mt-2`}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="new-password" className={label}>
          Password baru
        </label>
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${input} mt-2`}
          required
          minLength={6}
        />
        <p className="mt-2 text-xs text-ink-subtle">Minimal 6 karakter.</p>
      </div>
      <div>
        <label htmlFor="confirm-password" className={label}>
          Konfirmasi password baru
        </label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${input} mt-2`}
          required
          minLength={6}
        />
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {success && (
        <p className="flex items-start gap-2 rounded-md border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
          Password berhasil diubah.{forced && " Mengarahkan ke beranda…"}
        </p>
      )}

      <button disabled={loading} className={`${btnPrimary} w-full`}>
        {loading ? "Menyimpan…" : "Ganti password"}
      </button>
    </form>
  );
}
