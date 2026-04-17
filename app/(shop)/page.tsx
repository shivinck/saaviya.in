"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  isOffer?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  sizes?: { size: string; stock: number }[];
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  publishedAt?: string;
}

// ─── Skeleton ────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="col-6 col-md-3">
      <div className="skeleton" style={{ height: 280, borderRadius: 8 }} />
      <div className="skeleton mt-2" style={{ height: 18, width: "70%" }} />
      <div className="skeleton mt-1" style={{ height: 16, width: "40%" }} />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const discount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          ((Number(product.comparePrice) - Number(product.price)) /
            Number(product.comparePrice)) *
            100
        )
      : null;

  return (
    <div className="col-6 col-md-3">
      <Link href={`/product/${product.slug}`} className="text-decoration-none text-dark">
        <div className="product-card card h-100">
          <div className="product-img-wrap">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-fit-cover"
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <i className="bi bi-image text-muted fs-1" />
              </div>
            )}
            {discount && (
              <span className="badge-offer position-absolute top-0 start-0 m-2">
                -{discount}%
              </span>
            )}
          </div>
          <div className="card-body p-2">
            <p className="mb-1 small fw-semibold text-truncate">{product.name}</p>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-primary">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <s className="text-muted small">
                  ₹{Number(product.comparePrice).toLocaleString("en-IN")}
                </s>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Hero Slider ─────────────────────────────────────
function HeroSlider({ slides }: { slides: Slide[] }) {
  if (!slides.length) {
    return (
      <div
        className="hero-slide d-flex align-items-center justify-content-center"
        style={{ background: "linear-gradient(135deg,#e91e63 0%,#c2185b 100%)" }}
      >
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold">New Season Collection</h1>
          <p className="lead">Shop the latest trends in women's fashion</p>
          <Link href="/products/all" className="btn btn-light btn-lg mt-3 px-4">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="4000"
    >
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={slide.id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <div
              className="hero-slide d-flex align-items-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="container">
                <div className="col-md-6 text-white">
                  <h1 className="display-5 fw-bold">{slide.title}</h1>
                  {slide.subtitle && <p className="lead">{slide.subtitle}</p>}
                  {slide.link && (
                    <Link href={slide.link} className="btn btn-light btn-lg mt-3 px-4">
                      Explore
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" />
      </button>
    </div>
  );
}

// ─── Product Section ─────────────────────────────────
function ProductSection({
  title,
  products,
  loading,
  viewAllLink,
}: {
  title: string;
  products: Product[];
  loading: boolean;
  viewAllLink: string;
}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">{title}</h2>
          <Link href={viewAllLink} className="btn btn-outline-primary btn-sm px-4">
            View All
          </Link>
        </div>
        <div className="row g-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ───────────────────────────────────────
export default function HomePage() {
  const [heroData, setHeroData] = useState<{ slides: Slide[]; banners: Banner[] }>({
    slides: [],
    banners: [],
  });
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [heroRes, newRes, trendRes, offerRes, blogRes] = await Promise.all([
          fetch("/api/hero-slides"),
          fetch("/api/products?sort=newest&limit=8"),
          fetch("/api/products?trending=true&limit=8"),
          fetch("/api/products?offer=true&limit=8"),
          fetch("/api/blogs?limit=3"),
        ]);

        const [hero, newP, trend, offer, blog] = await Promise.all([
          heroRes.json(),
          newRes.json(),
          trendRes.json(),
          offerRes.json(),
          blogRes.json(),
        ]);

        if (hero.success) setHeroData(hero.data);
        if (newP.success) setNewProducts(newP.data);
        if (trend.success) setTrendingProducts(trend.data);
        if (offer.success) setOfferProducts(offer.data);
        if (blog.success) setBlogs(blog.data);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <>
      {/* Hero */}
      {loading ? (
        <div className="skeleton" style={{ height: 520 }} />
      ) : (
        <HeroSlider slides={heroData.slides} />
      )}

      {/* Banners */}
      {heroData.banners.length > 0 && (
        <section className="py-4 bg-light">
          <div className="container">
            <div className="row g-3">
              {heroData.banners.length >= 2 ? (
                <>
                  {/* First banner spans full width on mobile, half on md */}
                  <div className={heroData.banners.length === 1 ? "col-12" : "col-md-6"}>
                    <Link href={heroData.banners[0].link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                      <Image
                        src={heroData.banners[0].image}
                        alt={heroData.banners[0].title}
                        width={700}
                        height={300}
                        className="img-fluid w-100"
                        style={{ objectFit: "cover", height: 300 }}
                      />
                      <div className="banner-overlay position-absolute bottom-0 start-0 p-3">
                        <span className="fw-bold text-white fs-6">{heroData.banners[0].title}</span>
                      </div>
                    </Link>
                  </div>
                  {/* Remaining banners stacked on the right */}
                  <div className="col-md-6">
                    <div className="row g-3 h-100">
                      {heroData.banners.slice(1).map((banner) => (
                        <div key={banner.id} className={heroData.banners.length <= 3 ? "col-12" : "col-6"}>
                          <Link href={banner.link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                            <Image
                              src={banner.image}
                              alt={banner.title}
                              width={400}
                              height={heroData.banners.length <= 3 ? 138 : 138}
                              className="img-fluid w-100"
                              style={{ objectFit: "cover", height: heroData.banners.length <= 3 ? 138 : 138 }}
                            />
                            <div className="banner-overlay position-absolute bottom-0 start-0 p-2">
                              <span className="fw-semibold text-white small">{banner.title}</span>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-12">
                  <Link href={heroData.banners[0].link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                    <Image
                      src={heroData.banners[0].image}
                      alt={heroData.banners[0].title}
                      width={1200}
                      height={300}
                      className="img-fluid w-100"
                      style={{ objectFit: "cover", height: 300 }}
                    />
                    <div className="banner-overlay position-absolute bottom-0 start-0 p-3">
                      <span className="fw-bold text-white fs-6">{heroData.banners[0].title}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      <ProductSection
        title="New Arrivals"
        products={newProducts}
        loading={loading}
        viewAllLink="/products/all"
      />

      {/* Promo Banner Divider */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg,#e91e63 0%,#9c27b0 100%)" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-2">Summer Sale – Up to 50% Off</h2>
          <p className="mb-4">Limited time offer on selected styles</p>
          <Link href="/products/all?offer=true" className="btn btn-light btn-lg px-5">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Trending */}
      {(trendingProducts.length > 0 || loading) && (
        <ProductSection
          title="Trending Now"
          products={trendingProducts}
          loading={loading}
          viewAllLink="/products/all?trending=true"
        />
      )}

      {/* Offer Products */}
      {(offerProducts.length > 0 || loading) && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">Special Offers</h2>
              <Link href="/products/all?offer=true" className="btn btn-outline-primary btn-sm px-4">
                View All
              </Link>
            </div>
            <div className="row g-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : offerProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: "bi-truck", title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: "bi-shield-check", title: "Secure Payments", desc: "100% safe transactions" },
              { icon: "bi-arrow-repeat", title: "Easy Returns", desc: "7-day return policy" },
              { icon: "bi-headset", title: "24/7 Support", desc: "Dedicated customer care" },
            ].map((f) => (
              <div key={f.title} className="col-6 col-md-3">
                <div className="p-4 rounded-3 bg-light h-100">
                  <i className={`bi ${f.icon} fs-2 text-primary mb-3 d-block`} />
                  <h6 className="fw-bold">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {blogs.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">From Our Blog</h2>
              <Link href="/stories" className="btn btn-outline-primary btn-sm px-4">
                All Posts
              </Link>
            </div>
            <div className="row g-4">
              {blogs.map((b) => (
                <div key={b.id} className="col-md-4">
                  <Link href={`/stories/${b.slug}`} className="text-decoration-none text-dark">
                    <div className="card h-100 border-0 shadow-sm">
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title}
                          width={400}
                          height={220}
                          className="card-img-top"
                          style={{ objectFit: "cover", height: 220 }}
                        />
                      ) : (
                        <div
                          className="card-img-top d-flex align-items-center justify-content-center bg-light"
                          style={{ height: 220 }}
                        >
                          <i className="bi bi-image text-muted fs-1" />
                        </div>
                      )}
                      <div className="card-body">
                        <h6 className="fw-bold">{b.title}</h6>
                        {b.excerpt && (
                          <p className="text-muted small mb-0 text-truncate">{b.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
