import { NextResponse, type NextRequest } from "next/server";
import { HANDLERS, clientIp, type FormName } from "@/lib/server/forms";

const MAX_BODY = 6 * 1024 * 1024;

// Form endpoint
export async function POST(req: NextRequest, { params }: { params: Promise<{ form: string }> }) {
  const { form } = await params;
  const handler = HANDLERS[form as FormName];
  if (!handler) return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY) return NextResponse.json({ status: "error", message: "Payload too large" }, { status: 413 });
  const type = req.headers.get("content-type") || "";
  if (!/multipart\/form-data|application\/x-www-form-urlencoded/.test(type))
    return NextResponse.json({ status: "error", message: "Unsupported content type" }, { status: 415 });
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid form data" }, { status: 400 });
  }
  const { state, code } = await handler(fd, clientIp(req.headers));
  return NextResponse.json(state, { status: code });
}
