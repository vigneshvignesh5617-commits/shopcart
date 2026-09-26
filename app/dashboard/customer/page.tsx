import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CustomerDashboard(){
 const u=await getCurrentUser();if(!u||u.role!=="CUSTOMER")redirect("/login");
 const [orders,wishlist]=await Promise.all([db.order.count({where:{customerId:u.id}}),db.wishlist.count({where:{customerId:u.id}})]);
 return <div className="dashboard"><aside className="sidebar"><h2>Customer</h2><Link href="/dashboard/customer">Overview</Link><Link href="/cart">Cart</Link><Link href="/">Shop</Link></aside><main className="main"><h1>Welcome, {u.name}</h1><div className="grid grid-3"><div className="card"><div className="muted">Orders</div><div className="stat">{orders}</div></div><div className="card"><div className="muted">Wishlist</div><div className="stat">{wishlist}</div></div><div className="card"><div className="muted">Account</div><div className="stat">Active</div></div></div></main></div>;
}