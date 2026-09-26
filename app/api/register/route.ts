import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/prisma";

const schema=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(8),role:z.enum(["CUSTOMER","SELLER"])});
export async function POST(req:Request){
 try{
  const body=schema.parse(await req.json());
  if(await db.user.findUnique({where:{email:body.email}}))return NextResponse.json({error:"Email already registered"},{status:409});
  const passwordHash=await bcrypt.hash(body.password,12);
  await db.user.create({data:{name:body.name,email:body.email,passwordHash,role:body.role}});
  return NextResponse.json({ok:true});
 }catch(e){return NextResponse.json({error:"Invalid registration data"},{status:400});}
}