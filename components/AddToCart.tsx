"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCart({productId,disabled}:{productId:string,disabled?:boolean}) {
  const [qty,setQty]=useState(1); const [msg,setMsg]=useState(""); const router=useRouter();
  async function add(){const r=await fetch("/api/cart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId,quantity:qty})}); const d=await r.json(); if(!r.ok){setMsg(d.error||"Please sign in");return;} setMsg("Added to cart"); router.refresh();}
  return <div><div style={{display:"flex",gap:8,margin:"18px 0"}}><button className="btn btn-ghost" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span style={{padding:11}}>{qty}</span><button className="btn btn-ghost" onClick={()=>setQty(qty+1)}>+</button></div><button className="btn btn-primary" disabled={disabled} onClick={add}>Add to Cart</button>{msg&&<span className="muted" style={{marginLeft:10}}>{msg}</span>}</div>;
}