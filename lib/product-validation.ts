import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number({ invalid_type_error: "Price is required" }).min(0, "Price cannot be negative"),
  discount: z.coerce.number({ invalid_type_error: "Discount must be a number" }).min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  stock: z.coerce.number({ invalid_type_error: "Stock is required" }).int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  sku: z.string().trim().min(2, "SKU must be at least 2 characters").max(100, "SKU is too long"),
  brand: z.string().trim().max(100, "Brand is too long").optional().or(z.literal("")).transform((value) => (value && value.trim() ? value.trim() : undefined)),
  categoryId: z.string().trim().min(1, "Please select a category")
});

export function parseProductInput(input: Record<string, unknown>) {
  return productSchema.safeParse(input);
}
