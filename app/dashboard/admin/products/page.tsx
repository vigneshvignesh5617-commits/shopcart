import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import ProductApproval from "@/components/ProductApproval";

export default async function AdminProducts(){
 const u=await getCurrentUser(); if(!u||u.role!=="ADMIN")redirect("/login");
 const products=await db.product.findMany({where:{status:"PENDING_APPROVAL"},include:{seller:{select:{name:true,email:true}},category:true,images:true},orderBy:{createdAt:"asc"}});
 return <div className="dashboard"><aside className="sidebar"><h2>Admin</h2><a href="/dashboard/admin">Overview</a><a href="/dashboard/admin/products">Product Approvals</a></aside><main className="main"><h1>Product Approvals</h1><p className="muted">Approve only products you want visible in the customer storefront.</p>{products.length===0?<div className="card muted">No pending products.</div>:<div className="grid">{products.map(p=><ProductApproval key={p.id} product={{...p,createdAt:p.createdAt.toISOString()}}/>)}</div>}</main></div>;
}