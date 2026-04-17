"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  isOffer?: boolean;
  sizes?: { size: string; stock: number }[];
  category?: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

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
    <div className="col-6 col-md-4 col-lg-3">
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

export default function ProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = params.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (categorySlug && categorySlug !== "all") sp.set("category", categorySlug);
      if (search) sp.set("search", search);
      if (searchParams.get("trending")) sp.set("trending", "true");
      if (searchParams.get("offer")) sp.set("offer", "true");
      sp.set("sort", sort);
      sp.set("page", String(page));

      const res = await fetch(`/api/products?${sp}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, search, sort, page, searchParams]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => d.success && setCategories(d.data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateSort = (s: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("sort", s);
    sp.delete("page");
    router.push(`?${sp}`);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Categories</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <Link
                    href="/products/all"
                    className={`text-decoration-none small ${
                      categorySlug === "all" ? "text-primary fw-bold" : "text-dark"
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id} className="mb-1">
                    <Link
                      href={`/products/${c.slug}`}
                      className={`text-decoration-none small ${
                        categorySlug === c.slug ? "text-primary fw-bold" : "text-dark"
                      }`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h4 fw-bold mb-0">
                {categorySlug === "all"
                  ? search
                    ? `Search: "${search}"`
                    : "All Products"
                  : categories.find((c) => c.slug === categorySlug)?.name || "Products"}
              </h1>
              {!loading && (
                <p className="text-muted small mb-0">{pagination.total} products</p>
              )}
            </div>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={sort}
              onChange={(e) => updateSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="row g-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="skeleton" style={{ height: 280, borderRadius: 8 }} />
                  <div className="skeleton mt-2" style={{ height: 16, width: "70%" }} />
                  <div className="skeleton mt-1" style={{ height: 16, width: "40%" }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-bag-x fs-1 text-muted" />
              <h5 className="mt-3 text-muted">No products found</h5>
              <Link href="/products/all" className="btn btn-primary mt-3">
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <nav className="mt-5">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => {
                          const sp = new URLSearchParams(searchParams.toString());
                          sp.set("page", String(page - 1));
                          router.push(`?${sp}`);
                        }}
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => {
                            const sp = new URLSearchParams(searchParams.toString());
                            sp.set("page", String(p));
                            router.push(`?${sp}`);
                          }}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page >= pagination.pages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => {
                          const sp = new URLSearchParams(searchParams.toString());
                          sp.set("page", String(page + 1));
                          router.push(`?${sp}`);
                        }}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
