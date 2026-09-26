import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Dashboard(){const u=await getCurrentUser();if(!u)redirect("/login");redirect(`/dashboard/${u.role.toLowerCase()}`)}