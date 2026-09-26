import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const ADMIN_EMAIL = "vigneshvignesh5617@gmail.com";

async function main() {
  const password = await bcrypt.hash("Demo@12345", 12);
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { name: "Platform Admin", email: ADMIN_EMAIL, passwordHash: password, role: "ADMIN" }
  });
  const seller = await db.user.upsert({ where: { email: "seller@example.com" }, update: {}, create: { name: "Demo Seller", email: "seller@example.com", passwordHash: password, role: "SELLER" } });
  await db.user.upsert({ where: { email: "customer@example.com" }, update: {}, create: { name: "Demo Customer", email: "customer@example.com", passwordHash: password, role: "CUSTOMER" } });
 const electronics=await db.category.upsert({where:{slug:"electronics"},update:{},create:{name:"Electronics",slug:"electronics"}});
 const fashion=await db.category.upsert({where:{slug:"fashion"},update:{},create:{name:"Fashion",slug:"fashion"}});
 const products=[
  {name:"Classic Watch",slug:"classic-watch-demo",description:"A clean everyday watch for work and weekends.",price:2499,stock:25,sku:"WATCH-001",categoryId:fashion.id,status:"APPROVED" as const,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000"},
  {name:"Wireless Headphones",slug:"wireless-headphones-demo",description:"Comfortable wireless headphones with a modern design.",price:3999,stock:12,sku:"HEAD-001",categoryId:electronics.id,status:"APPROVED" as const,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000"},
  {name:"Pending Demo Product",slug:"pending-demo-product",description:"This product demonstrates the admin approval workflow.",price:1499,stock:8,sku:"PEND-001",categoryId:electronics.id,status:"PENDING_APPROVAL" as const,image:"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1000"}
 ];
 for(const x of products){
  const p=await db.product.upsert({where:{slug:x.slug},update:{},create:{name:x.name,slug:x.slug,description:x.description,price:x.price,stock:x.stock,sku:x.sku,categoryId:x.categoryId,status:x.status,sellerId:seller.id,images:{create:{url:x.image,alt:x.name}}}});
  void p;
 }
 console.log("Seeded demo accounts:", admin.email, seller.email, "customer@example.com");
}
main().finally(() => db.$disconnect());