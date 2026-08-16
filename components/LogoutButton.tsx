"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/masuk");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
    >
      {loading ? "..." : "Keluar"}
    </button>
  );
}
