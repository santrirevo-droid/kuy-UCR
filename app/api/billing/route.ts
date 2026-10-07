import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { isValidBill, isValidMonth, setPayment } from "@/lib/billing";

// Tandai satu tagihan (nomor HP / WiFi) lunas atau belum untuk satu bulan.
// Hanya admin.
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Hanya admin yang bisa mengubah tagihan" }, { status: 401 });

  let body: { billId?: unknown; month?: unknown; paid?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { billId, month, paid } = body;
  if (typeof billId !== "string" || !isValidBill(billId) || typeof month !== "string" || !isValidMonth(month) || typeof paid !== "boolean") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  try {
    const paidAt = await setPayment(billId, month, paid);
    return NextResponse.json({ ok: true, paidAt });
  } catch {
    return NextResponse.json({ error: "Database belum terhubung" }, { status: 503 });
  }
}
