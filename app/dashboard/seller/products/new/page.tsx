import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import NewProduct from "@/components/NewProduct";

export default async function NewProductPage(){
 const u=await getCurrentUser();if(!u||u.role!=="SELLER")redirect("/login");
 const categories=await db.category.findMany({orderBy:{name:"asc"}});
 return <div className="dashboard"><aside className="sidebar"><h2>Seller</h2><a href="/dashboard/seller">Overview</a><a href="/dashboard/seller/products/new">Add Product</a></aside><main className="main"><h1>Add Product</h1><NewProduct categories={categories}/></main></div>;
}