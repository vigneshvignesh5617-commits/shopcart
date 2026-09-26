import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
type HomeProduct = Prisma.ProductGetPayload<{
  include: { images: true; category: true; seller: { select: { name: true } } };
}>;

export default async function Home() {
  let products: HomeProduct[] = [];
  let databaseUnavailable = false;

  try {
    products = await db.product.findMany({
      where: { status: "APPROVED", stock: { gt: 0 } },
      include: { images: true, category: true, seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 12
    });
  } catch {
    databaseUnavailable = true;
  }

  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="badge">Verified multi-vendor marketplace</span>
              <h1>
                Shop smarter.<br />
                Discover <span className="accent">better picks.</span>
              </h1>
              <p className="muted" style={{ maxWidth: 650, fontSize: 18, lineHeight: 1.7 }}>
                Discover products from independent sellers. Every item is reviewed by our team so you can shop with confidence and support trusted creators.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="#products">Shop approved products</Link>
                <Link className="btn btn-secondary" href="/login">Become a seller</Link>
              </div>

              <div className="hero-stats">
                <div className="stat-box">
                  <strong>12k+</strong>
                  <span>happy shoppers</span>
                </div>
                <div className="stat-box">
                  <strong>350+</strong>
                  <span>top sellers</span>
                </div>
                <div className="stat-box">
                  <strong>4.9/5</strong>
                  <span>average rating</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-panel">
                <div className="feature-card">
                  <span className="badge" style={{ width: "fit-content" }}>Trending now</span>
                  <strong>Curated essentials</strong>
                  <span className="muted">Handpicked by local sellers and verified by admin.</span>
                </div>

                <div className="feature-row">
                  <div className="product-swatch">
                    <div>
                      <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Best seller</div>
                      <strong>Premium headset</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="swatch-dot" style={{ background: "#7c3aed" }}></span>
                      <span className="swatch-dot" style={{ background: "#f97316" }}></span>
                    </div>
                  </div>

                  <div className="product-swatch">
                    <div>
                      <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Fast delivery</div>
                      <strong>Free shipping</strong>
                    </div>
                    <span className="price" style={{ fontSize: 18 }}>₹1,999</span>
                  </div>
                </div>

                <div className="floating-pill">
                  <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Customer love</div>
                  <strong>98% satisfaction</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="container">
          <div className="section-title">
            <h2>Latest approved products</h2>
            <span className="muted">{products.length} products</span>
          </div>
          {databaseUnavailable && <div className="card alert warning">Connect MongoDB Atlas in .env to load products.</div>}
          {products.length === 0 ? <div className="card muted">No approved products yet.</div> : (
            <div className="grid grid-4">
              {products.map(p => (
                <Link className="card product-card" href={`/products/${p.slug}`} key={p.id}>
                  <img className="product-img" src={p.images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"} alt={p.name} />
                  <div className="product-meta">
                    <span className="muted">{p.category.name}</span>
                    <span className="badge" style={{ padding: "6px 10px", fontSize: 11 }}>New</span>
                  </div>
                  <h3>{p.name}</h3>
                  <span className="muted">Sold by {p.seller.name}</span>
                  <span className="price">₹{p.price.toLocaleString("en-IN")}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="footer"><div className="container">© 2026 MarketHub</div></footer>
    </>
  );
}