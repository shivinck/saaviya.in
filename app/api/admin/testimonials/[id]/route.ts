import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { successResponse, errorResponse } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const review = formData.get("review") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";
  const avatarFile = formData.get("avatar") as File | null;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return NextResponse.json(errorResponse("Not found"), { status: 404 });

  let avatar = existing.avatar;
  if (avatarFile && avatarFile.size > 0) {
    const bytes = await avatarFile.arrayBuffer();
    avatar = await saveFile(Buffer.from(bytes), avatarFile.name, "avatars");
  }

  const t = await prisma.testimonial.update({
    where: { id },
    data: { name, location, review, rating, sortOrder, isActive, avatar },
  });
  return NextResponse.json(successResponse(t));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json(successResponse(null));
}
