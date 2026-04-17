import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { errorResponse, successResponse } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const position = (formData.get("position") as string) || "home";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("image") as File | null;

  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return NextResponse.json(errorResponse("Not found"), { status: 404 });

  let image = existing.image;
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    image = await saveFile(Buffer.from(bytes), imageFile.name, "banners");
  }

  const banner = await prisma.banner.update({
    where: { id },
    data: { title, image, link, position, sortOrder, isActive },
  });
  return NextResponse.json(successResponse(banner));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json(successResponse(null));
}
