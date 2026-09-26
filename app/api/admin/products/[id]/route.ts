import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const u=await getCurrentUser();if(!u||u.role!=="ADMIN")return NextResponse.json({error:"Forbidden"},{status:403});
 const {id}=await params;
 const body=z.object({action:z.enum(["APPROVE","REJECT"]),rejectionReason:z.string().optional()}).parse(await req.json());
 const p=await db.product.findUnique({where:{id}});if(!p)return NextResponse.json({error:"Not found"},{status:404});
 if(body.action==="REJECT"&&!body.rejectionReason?.trim())return NextResponse.json({error:"Rejection reason required"},{status:400});
 await db.product.update({where:{id},data:{status:body.action==="APPROVE"?"APPROVED":"REJECTED",rejectionReason:body.action==="REJECT"?body.rejectionReason:null}});
 await db.notification.create({data:{userId:p.sellerId,title:`Product ${body.action==="APPROVE"?"approved":"rejected"}`,message:body.action==="APPROVE"?`Your product is now visible to customers.`:`Your product was rejected: ${body.rejectionReason}`}});
 return NextResponse.json({ok:true});
}