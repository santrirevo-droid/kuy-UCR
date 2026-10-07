import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";

// Middleware hanya mengecek keberadaan cookie admin (Edge runtime, tanpa
// crypto). Di sini tanda tangannya diverifikasi untuk seluruh halaman /admin.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) redirect("/masuk");
  return <>{children}</>;
}
