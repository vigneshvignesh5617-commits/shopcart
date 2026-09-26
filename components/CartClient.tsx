"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Item={id:string;quantity:number;product:{id:string;name:string;price:number;stock:number;images:{url:string}[]}};
export default function CartClient({items:initial}:{items:Item[]}){
 const [items,setItems]=useState(initial); const router=useRouter();
 async function update(id:string,quantity:number){const r=await fetch("/api/cart",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:id,quantity})}); if(r.ok){setItems(x=>x.map(i=>i.id===id?{...i,quantity}:i).filter(i=>i.quantity>0));router.refresh();}}
 const total=items.reduce((s,i)=>s+i.product.price*i.quantity,0);
 if(!items.length)return <div className="card muted">Your cart is empty.</div>;
 return <div className="grid grid-2"><div className="grid">{items.map(i=><div className="card" style={{display:"flex",gap:15,alignItems:"center"}} key={i.id}><img src={i.product.images[0]?.url} style={{width:90,height:90,objectFit:"cover",borderRadius:10}}/><div style={{flex:1}}><h3>{i.product.name}</h3><div className="price">₹{i.product.price}</div><div style={{display:"flex",gap:8,marginTop:8}}><button className="btn btn-ghost" onClick={()=>update(i.id,i.quantity-1)}>−</button><span>{i.quantity}</span><button className="btn btn-ghost" onClick={()=>update(i.id,Math.min(i.product.stock,i.quantity+1))}>+</button></div></div></div>)}</div><div className="card"><h2>Summary</h2><p>Subtotal <b style={{float:"right"}}>₹{total.toLocaleString("en-IN")}</b></p><p>Shipping <b style={{float:"right"}}>₹0</b></p><hr/><h2>Total <span style={{float:"right"}}>₹{total.toLocaleString("en-IN")}</span></h2><button className="btn btn-primary" style={{width:"100%"}}>Proceed to Checkout</button></div></div>;
}