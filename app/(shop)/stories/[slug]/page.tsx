"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  tags: string[];
  publishedAt?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBlog(d.data);
        else router.replace("/stories");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="skeleton mb-4" style={{ height: 360, borderRadius: 8 }} />
        <div className="skeleton mb-3" style={{ height: 32, width: "70%" }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container py-5">
      <article className="mx-auto" style={{ maxWidth: 780 }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/stories">Stories</Link></li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>{blog.title}</li>
          </ol>
        </nav>

        {/* Tags */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {blog.tags.map((t) => (
            <span key={t} className="badge bg-light text-dark border">{t}</span>
          ))}
        </div>

        <h1 className="fw-bold lh-sm mb-3">{blog.title}</h1>

        {/* Meta */}
        <div className="d-flex align-items-center gap-3 text-muted small mb-4">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
              style={{ width: 32, height: 32 }}
            >
              {blog.author[0]}
            </div>
            <span>{blog.author}</span>
          </div>
          {blog.publishedAt && (
            <span><i className="bi bi-calendar3 me-1" />{formatDate(blog.publishedAt)}</span>
          )}
        </div>

        {/* Featured Image */}
        {blog.image && (
          <div className="rounded-3 overflow-hidden mb-5" style={{ height: 360 }}>
            <Image
              src={blog.image}
              alt={blog.title}
              width={780}
              height={360}
              className="w-100"
              style={{ objectFit: "cover", height: 360 }}
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content text-muted"
          style={{ lineHeight: "1.85", fontSize: "1.05rem" }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back */}
        <div className="mt-5 pt-4 border-top">
          <Link href="/stories" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2" />Back to Stories
          </Link>
        </div>
      </article>
    </div>
  );
}
