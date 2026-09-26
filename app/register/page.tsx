"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form,setForm] = useState({name:"",email:"",password:"",role:"CUSTOMER"});
  const [error,setError] = useState("");
  const router = useRouter();
  const change=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e:React.FormEvent){
    e.preventDefault(); setError("");
    const r=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    if(!r.ok){setError((await r.json()).error||"Registration failed");return;}
    router.push("/login");
  }
  return <main className="container" style={{maxWidth:560,padding:"50px 0"}}>
    <div className="card"><h1>Create account</h1>{error&&<div className="alert danger">{error}</div>}
      <form className="form" onSubmit={submit}>
        <div><label>Name</label><input name="name" onChange={change} required/></div>
        <div><label>Email</label><input name="email" type="email" onChange={change} required/></div>
        <div><label>Password</label><input name="password" type="password" minLength={8} onChange={change} required/></div>
        <div><label>Account type</label><select name="role" value={form.role} onChange={change}><option value="CUSTOMER">Customer</option><option value="SELLER">Seller</option></select></div>
        <button className="btn btn-primary">Create account</button>
      </form>
    </div>
  </main>;
}