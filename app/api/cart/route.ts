import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req:Request){
 const u=await getCurrentUser();if(!u||u.role!=="CUSTOMER")return NextResponse.json({error:"Sign in as a customer first"},{status:401});
 const {productId,quantity=1}=await req.json();
 const p=await db.product.findFirst({where:{id:productId,status:"APPROVED"}});
 if(!p)return NextResponse.json({error:"Product unavailable"},{status:404});
 if(quantity<1||quantity>p.stock)return NextResponse.json({error:"Quantity exceeds stock"},{status:400});
 const cart=await db.cart.upsert({where:{userId:u.id},create:{userId:u.id},update:{}});
 const existing=await db.cartItem.findUnique({where:{cartId_productId:{cartId:cart.id,productId}}});
 const next=(existing?.quantity||0)+quantity;if(next>p.stock)return NextResponse.json({error:"Quantity exceeds stock"},{status:400});
 await db.cartItem.upsert({where:{cartId_productId:{cartId:cart.id,productId}},create:{cartId:cart.id,productId,quantity},update:{quantity:next}});
 return NextResponse.json({ok:true});
}
export async function PATCH(req:Request){
 const u=await getCurrentUser();if(!u||u.role!=="CUSTOMER")return NextResponse.json({error:"Unauthorized"},{status:401});
 const {itemId,quantity}=await req.json();
 const item=await db.cartItem.findFirst({where:{id:itemId,cart:{userId:u.id}},include:{product:true}});
 if(!item)return NextResponse.json({error:"Not found"},{status:404});
 if(quantity<=0){await db.cartItem.delete({where:{id:itemId}});return NextResponse.json({ok:true});}
 if(quantity>item.product.stock)return NextResponse.json({error:"Insufficient stock"},{status:400});
 await db.cartItem.update({where:{id:itemId},data:{quantity}});return NextResponse.json({ok:true});
}