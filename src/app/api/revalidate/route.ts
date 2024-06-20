import { revalidateSecret } from "@helpers/config";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret != revalidateSecret) {
    return Response.json({
      revalidated: false,
      now: Date.now(),
      message: "Invalid secret",
    });
  }

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
