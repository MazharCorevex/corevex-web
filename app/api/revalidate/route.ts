import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity webhook
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "disabled" }, { status: 404 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: { current?: string } }>(req, secret);
    if (!isValidSignature) return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ error: "missing type" }, { status: 400 });
    revalidateTag(body._type, "max");
    const s = body.slug?.current;
    if (body._type === "article") revalidatePath(s ? `/insights/${s}/` : "/insights/");
    if (body._type === "caseStudy") revalidatePath(s ? `/work/${s}/` : "/work/");
    return NextResponse.json({ revalidated: body._type });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
