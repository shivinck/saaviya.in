import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(successResponse(banners));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const position = (formData.get("position") as string) || "home";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("image") as File | null;

  if (!title) return NextResponse.json(errorResponse("Title is required"), { status: 400 });

  let image = "/placeholder-banner.jpg";
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const saved = await saveFile(Buffer.from(bytes), imageFile.name, "banners");
    image = saved;
  }

  const banner = await prisma.banner.create({
    data: { title, image, link, position, sortOrder, isActive },
  });
  return NextResponse.json(successResponse(banner), { status: 201 });
}
