"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

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
      aria-label="Keluar"
      title="Keluar"
      className="flex h-7 w-7 items-center justify-center rounded text-ink-subtle transition hover:bg-surface-2 hover:text-danger disabled:opacity-50"
    >
      <Icon name="log-out" className="h-4 w-4" />
    </button>
  );
}
