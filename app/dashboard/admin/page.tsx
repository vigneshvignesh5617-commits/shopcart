import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard(){
 const u=await getCurrentUser(); if(!u||u.role!=="ADMIN")redirect("/login");
 const [customers,sellers,products,pending,orders]=await Promise.all([
  db.user.count({where:{role:"CUSTOMER"}}),db.user.count({where:{role:"SELLER"}}),db.product.count(),
  db.product.count({where:{status:"PENDING_APPROVAL"}}),db.order.count()
 ]);
 return <div className="dashboard"><aside className="sidebar"><h2>Admin</h2><Link href="/dashboard/admin">Overview</Link><Link href="/dashboard/admin/products">Product Approvals</Link><Link href="/">Storefront</Link></aside><main className="main"><div className="section-title"><h1>Admin Dashboard</h1><span className="badge">{u.name}</span></div><div className="grid grid-4">{[["Customers",customers],["Sellers",sellers],["Products",products],["Pending approvals",pending],["Orders",orders]].map(([a,b])=><div className="card" key={String(a)}><div className="muted">{a}</div><div className="stat">{b}</div></div>)}</div><div className="card" style={{marginTop:20}}><h2>Moderation workflow</h2><p className="muted">Seller products enter PENDING_APPROVAL and are hidden from customers until an admin approves them.</p><Link className="btn btn-primary" href="/dashboard/admin/products">Review pending products</Link></div></main></div>;
}