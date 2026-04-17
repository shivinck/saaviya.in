"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  sizes: ProductSize[];
  category?: { name: string; slug: string };
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isOffer?: boolean;
  createdAt?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProduct(d.data);
        } else {
          router.replace("/products/all");
        }
      })
      .catch(() => router.replace("/products/all"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product!.id, size: selectedSize, quantity }),
      });
      if (res.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      } else {
        setError(data.error || "Failed to add to cart");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        setInWishlist(false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product!.id }),
        });
        if (res.ok) setInWishlist(true);
        if (res.status === 401) router.push("/login");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="skeleton" style={{ height: 500, borderRadius: 8 }} />
          </div>
          <div className="col-md-7">
            <div className="skeleton mb-3" style={{ height: 32, width: "70%" }} />
            <div className="skeleton mb-2" style={{ height: 24, width: "30%" }} />
            <div className="skeleton" style={{ height: 100 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          ((Number(product.comparePrice) - Number(product.price)) /
            Number(product.comparePrice)) *
            100
        )
      : null;

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Home</Link></li>
          {product.category && (
            <li className="breadcrumb-item">
              <Link href={`/products/${product.category.slug}`}>{product.category.name}</Link>
            </li>
          )}
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-4 g-md-5">
        {/* Images */}
        <div className="col-md-5">
          <div
            className="rounded overflow-hidden mb-3 position-relative"
            style={{ aspectRatio: "3/4", background: "#f8f9fa" }}
          >
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-fit-cover"
                priority
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <i className="bi bi-image text-muted fs-1" />
              </div>
            )}
            {discount && (
              <span className="badge-offer position-absolute top-0 start-0 m-3">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`p-0 border rounded overflow-hidden ${
                    selectedImage === i ? "border-primary border-2" : "border-light"
                  }`}
                  style={{ width: 64, height: 80, background: "#f8f9fa" }}
                >
                  <Image
                    src={img}
                    alt=""
                    width={64}
                    height={80}
                    className="object-fit-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="col-md-7">
          {product.category && (
            <Link
              href={`/products/${product.category.slug}`}
              className="text-muted small text-uppercase text-decoration-none"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="h3 fw-bold mt-1 mb-3">{product.name}</h1>

          {/* Price */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fs-3 fw-bold text-primary">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <s className="text-muted fs-5">
                ₹{Number(product.comparePrice).toLocaleString("en-IN")}
              </s>
            )}
            {discount && (
              <span className="badge bg-success">{discount}% OFF</span>
            )}
          </div>

          {/* Badges */}
          <div className="d-flex gap-2 mb-4">
            {product.isFeatured && <span className="badge bg-warning text-dark">Featured</span>}
            {product.isTrending && <span className="badge bg-info text-dark">Trending</span>}
            {product.isOffer && <span className="badge bg-danger">Sale</span>}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted mb-4" style={{ lineHeight: "1.7" }}>
              {product.description}
            </p>
          )}

          {/* Size selector */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Select Size</h6>
              {!selectedSize && error && (
                <span className="text-danger small">{error}</span>
              )}
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  className={`size-btn ${selectedSize === s.size ? "selected" : ""}`}
                  disabled={s.stock === 0}
                  onClick={() => {
                    setSelectedSize(s.size);
                    setError("");
                  }}
                  title={s.stock === 0 ? "Out of stock" : `${s.stock} in stock`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <h6 className="fw-bold mb-2">Quantity</h6>
            <div className="d-flex align-items-center gap-3">
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="fw-bold fs-5">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Shipping note */}
          <p className="text-muted small mb-4">
            <i className="bi bi-truck me-2 text-success" />
            Free delivery on orders above ₹999
          </p>

          {/* Actions */}
          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn btn-primary btn-lg px-5 flex-grow-1"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : addedToCart ? (
                <><i className="bi bi-check2 me-2" />Added!</>
              ) : (
                <><i className="bi bi-bag-plus me-2" />Add to Cart</>
              )}
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              title="Add to Wishlist"
            >
              <i className={`bi ${inWishlist ? "bi-heart-fill text-danger" : "bi-heart"}`} />
            </button>
          </div>

          {addedToCart && (
            <div className="alert alert-success mt-3 d-flex align-items-center gap-2 py-2">
              <i className="bi bi-bag-check-fill" />
              Added to cart!
              <Link href="/cart" className="ms-auto text-success fw-semibold text-decoration-none small">
                View Cart →
              </Link>
            </div>
          )}

          {error && !selectedSize && (
            <div className="alert alert-danger mt-3 py-2 small">{error}</div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <span className="text-muted small me-2">Tags:</span>
              {product.tags.map((t) => (
                <span key={t} className="badge bg-light text-dark me-1">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
