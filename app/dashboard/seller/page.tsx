import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SellerDashboard(){
 const u=await getCurrentUser(); if(!u||u.role!=="SELLER")redirect("/login");
 const [total,pending,approved,rejected]=await Promise.all([
  db.product.count({where:{sellerId:u.id}}),db.product.count({where:{sellerId:u.id,status:"PENDING_APPROVAL"}}),
  db.product.count({where:{sellerId:u.id,status:"APPROVED"}}),db.product.count({where:{sellerId:u.id,status:"REJECTED"}})
 ]);
 return <div className="dashboard"><aside className="sidebar"><h2>Seller</h2><Link href="/dashboard/seller">Overview</Link><Link href="/dashboard/seller/products/new">Add Product</Link><Link href="/">Storefront</Link></aside><main className="main"><div className="section-title"><h1>Seller Dashboard</h1><Link className="btn btn-primary" href="/dashboard/seller/products/new">+ Add product</Link></div><div className="grid grid-4">{[["My products",total],["Pending",pending],["Approved",approved],["Rejected",rejected]].map(([a,b])=><div className="card" key={String(a)}><div className="muted">{a}</div><div className="stat">{b}</div></div>)}</div><div className="card" style={{marginTop:20}}><h2>Approval process</h2><p className="muted">New products are private until an administrator approves them. Rejected products include a reason and can be edited/resubmitted.</p></div></main></div>;
}