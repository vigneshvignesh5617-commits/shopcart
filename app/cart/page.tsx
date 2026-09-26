import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CartClient from "@/components/CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage(){
  const user=await getCurrentUser(); if(!user) redirect("/login");
  const cart=await db.cart.findUnique({where:{userId:user.id},include:{items:{include:{product:{include:{images:true}}}}}});
  return <main className="container" style={{padding:"40px 0"}}><h1>Your Cart</h1><CartClient items={cart?.items||[]}/></main>;
}