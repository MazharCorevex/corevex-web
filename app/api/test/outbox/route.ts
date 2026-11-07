import { NextResponse } from "next/server";
import { TEST_MODE, outbox } from "@/lib/server/email";

export const dynamic = "force-dynamic";

// Test outbox
export async function GET() {
  if (!TEST_MODE) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(outbox());
}

export async function DELETE() {
  if (!TEST_MODE) return NextResponse.json({ error: "Not found" }, { status: 404 });
  outbox().length = 0;
  return NextResponse.json({ cleared: true });
}
