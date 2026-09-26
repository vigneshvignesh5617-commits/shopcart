import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { uploadProductImage } from "@/lib/cloudinary";
import { parseProductInput } from "@/lib/product-validation";

export async function POST(req: Request) {
  const u = await getCurrentUser();
  if (!u || u.role !== "SELLER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const form = await req.formData();
    const image = form.get("image");

    if (!(image instanceof File) || !image.type.startsWith("image/")) {
      return NextResponse.json({ error: "A product image is required" }, { status: 400 });
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 10MB or smaller" }, { status: 400 });
    }

    const rawData = Object.fromEntries(
      ["name", "description", "price", "discount", "stock", "sku", "brand", "categoryId"].map((key) => [key, form.get(key) ?? ""])
    );

    const parsed = parseProductInput(rawData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid product data" }, { status: 400 });
    }

    const data = parsed.data;
    const { secure_url: imageUrl } = await uploadProductImage(Buffer.from(await image.arrayBuffer()));
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const product = await db.product.create({
      data: {
        ...data,
        brand: data.brand ?? undefined,
        slug,
        sellerId: u.id,
        status: "PENDING_APPROVAL",
        images: {
          create: {
            url: imageUrl,
            alt: data.name
          }
        }
      }
    });

    return NextResponse.json({ id: product.id });
  } catch (error: any) {
    if (error?.code === "P2002") {
      const field = Array.isArray(error.meta?.target) ? String(error.meta.target[0]) : "sku";
      const isSku = field === "sku";
      return NextResponse.json(
        {
          error: isSku ? "SKU already exists. Please use a unique value." : "A duplicate value was found. Please update the product details."
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Unable to create product right now. Please try again." }, { status: 400 });
  }
}