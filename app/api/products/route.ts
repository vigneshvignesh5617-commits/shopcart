import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { uploadProductImage } from "@/lib/cloudinary";
import { z } from "zod";

const schema=z.object({name:z.string().min(2),description:z.string().min(10),price:z.coerce.number().nonnegative(),discount:z.coerce.number().min(0).max(100),stock:z.coerce.number().int().nonnegative(),sku:z.string().min(2),brand:z.string().optional(),categoryId:z.string().min(1)});
export async function POST(req:Request){
 const u=await getCurrentUser();if(!u||u.role!=="SELLER")return NextResponse.json({error:"Forbidden"},{status:403});
 try{
    const form=await req.formData();
    const image=form.get("image");
    if(!(image instanceof File)||!image.type.startsWith("image/"))return NextResponse.json({error:"A product image is required"},{status:400});
    if(image.size>10*1024*1024)return NextResponse.json({error:"Image must be 10MB or smaller"},{status:400});
    const b=schema.parse(Object.fromEntries(["name","description","price","discount","stock","sku","brand","categoryId"].map(key=>[key,form.get(key)??""])));
    const {secure_url:imageUrl}=await uploadProductImage(Buffer.from(await image.arrayBuffer()));
  const slug=b.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now();
    const p=await db.product.create({data:{...b,slug,sellerId:u.id,status:"PENDING_APPROVAL",images:{create:{url:imageUrl,alt:b.name}}}});
  return NextResponse.json({id:p.id});
 }catch(e){return NextResponse.json({error:"Invalid product data or duplicate SKU"},{status:400});}
}