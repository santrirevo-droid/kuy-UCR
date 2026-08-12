"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutUserButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="text-slate-400 underline-offset-2 transition hover:text-slate-700 hover:underline disabled:opacity-50 dark:hover:text-slate-200"
    >
      Keluar
    </button>
  );
}
