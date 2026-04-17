"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  author: string;
  tags: string[];
  publishedAt?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?limit=12")
      .then((r) => r.json())
      .then((d) => d.success && setBlogs(d.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Our Stories</h1>
        <p className="text-muted">Fashion tips, style guides, and trend reports</p>
      </div>

      {loading ? (
        <div className="row g-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-md-4">
              <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
              <div className="skeleton mt-2" style={{ height: 24, width: "80%" }} />
              <div className="skeleton mt-1" style={{ height: 16, width: "60%" }} />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal fs-1 text-muted" />
          <h5 className="mt-3 text-muted">No stories yet</h5>
        </div>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-md-4">
              <Link href={`/stories/${blog.slug}`} className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm product-card">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
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
                    <div className="d-flex gap-2 mb-2 flex-wrap">
                      {blog.tags.slice(0, 2).map((t) => (
                        <span key={t} className="badge bg-light text-dark border">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h5 className="fw-bold lh-sm mb-2">{blog.title}</h5>
                    {blog.excerpt && (
                      <p className="text-muted small mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center pb-3 px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                        style={{ width: 28, height: 28, fontSize: 12 }}
                      >
                        {blog.author[0]}
                      </div>
                      <span className="small text-muted">{blog.author}</span>
                    </div>
                    <span className="small text-muted">{formatDate(blog.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
