"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewProduct({categories}:{categories:{id:string,name:string}[]}){
 const [f,setF]=useState({name:"",description:"",price:"",discount:"0",stock:"1",sku:"",brand:"",categoryId:categories[0]?.id||"",image:null as File|null});
 const [error,setError]=useState(""); const router=useRouter();
 function change(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>){
  const value=e.target.name==="image"&&e.target instanceof HTMLInputElement?e.target.files?.[0]||null:e.target.value;
  setF({...f,[e.target.name]:value});
 }
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");const body=new FormData(e.currentTarget);const r=await fetch("/api/products",{method:"POST",body});const d=await r.json();if(!r.ok){setError(d.error||"Failed");return;}router.push("/dashboard/seller");}
 return <div className="card" style={{maxWidth:850}}>{error&&<div className="alert danger">{error}</div>}<form className="form" onSubmit={submit}>
 <div><label>Product name</label><input name="name" value={f.name} onChange={change} required/></div>
 <div><label>Description</label><textarea name="description" value={f.description} onChange={change} required/></div>
 <div className="grid grid-2"><div><label>Price (INR)</label><input name="price" type="number" min="0" value={f.price} onChange={change} required/></div><div><label>Discount %</label><input name="discount" type="number" min="0" max="100" value={f.discount} onChange={change}/></div><div><label>Stock</label><input name="stock" type="number" min="0" value={f.stock} onChange={change} required/></div><div><label>SKU</label><input name="sku" value={f.sku} onChange={change} required/></div><div><label>Brand</label><input name="brand" value={f.brand} onChange={change}/></div><div><label>Category</label><select name="categoryId" value={f.categoryId} onChange={change}>{categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></div></div>
 <div><label>Product image</label><input name="image" type="file" accept="image/*" onChange={change} required/></div>
 <button className="btn btn-primary">Submit for admin approval</button>
 </form></div>;
}