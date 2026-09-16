"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

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
      className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink-muted transition hover:border-line-strong hover:text-ink disabled:opacity-50"
    >
      <Icon name="log-out" className="h-4 w-4" />
      {loading ? "Keluar…" : "Keluar"}
    </button>
  );
}
