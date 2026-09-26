import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import AddToCart from "@/components/AddToCart";

export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const p=await db.product.findUnique({where:{slug},include:{images:true,category:true,seller:{select:{name:true}},reviews:{include:{customer:{select:{name:true}}}}}});
  if(!p || p.status!=="APPROVED") notFound();
  return <main className="container" style={{padding:"40px 0"}}>
    <div className="grid grid-2">
      <div className="card"><img className="product-img" src={p.images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000"} alt={p.name}/></div>
      <div className="card">
        <span className="badge">{p.category.name}</span><h1>{p.name}</h1>
        <p className="muted">{p.description}</p><p>Brand: <b>{p.brand||"Generic"}</b></p>
        <p>Seller: <b>{p.seller.name}</b></p><div className="price">₹{p.price.toLocaleString("en-IN")}</div>
        <p className={p.stock>0?"":"muted"}>{p.stock>0?`${p.stock} in stock`:"Out of stock"}</p>
        <AddToCart productId={p.id} disabled={p.stock===0}/>
        <hr style={{margin:"25px 0",border:0,borderTop:"1px solid #eee"}}/>
        <h3>Reviews</h3>{p.reviews.length===0?<p className="muted">No reviews yet.</p>:p.reviews.map(r=><div key={r.id}><b>{r.customer.name}</b> — {"★".repeat(r.rating)}<p className="muted">{r.comment}</p></div>)}
      </div>
    </div>
  </main>;
}