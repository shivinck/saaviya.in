"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string | null;
  rating: number;
  review: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="d-flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bi ${s <= rating ? "bi-star-fill" : "bi-star"}`}
          style={{ color: "#f59e0b", fontSize: 14 }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm h-100 p-4 testimonial-card">
        <StarRating rating={t.rating} />
        <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
          &ldquo;{t.review}&rdquo;
        </p>
        <div className="d-flex align-items-center gap-3 mt-auto">
          {t.avatar ? (
            <Image
              src={t.avatar}
              alt={t.name}
              width={48}
              height={48}
              className="rounded-circle object-fit-cover border"
              style={{ width: 48, height: 48 }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg,#e91e63,#9c27b0)",
                fontSize: 18,
              }}
            >
              {t.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="fw-semibold mb-0">{t.name}</p>
            <p className="text-muted small mb-0">
              <i className="bi bi-geo-alt-fill text-primary me-1" />
              {t.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTestimonials(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const avg =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

  return (
    <>
      {/* Hero */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg,#e91e63 0%,#9c27b0 100%)" }}
      >
        <div className="container">
          <i className="bi bi-chat-quote-fill display-4 mb-3 d-block opacity-75" />
          <h1 className="fw-bold display-5 mb-2">Customer Testimonials</h1>
          <p className="lead mb-3 opacity-75">
            Real stories from our happy customers across India
          </p>
          {testimonials.length > 0 && (
            <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 rounded-pill px-4 py-2">
              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className="bi bi-star-fill" style={{ color: "#fcd34d", fontSize: 16 }} />
                ))}
              </div>
              <span className="fw-bold fs-5">{avg}</span>
              <span className="opacity-75 small">from {testimonials.length} reviews</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-light border-bottom py-4">
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { icon: "bi-people-fill", value: "10,000+", label: "Happy Customers" },
              { icon: "bi-star-fill", value: avg, label: "Average Rating" },
              { icon: "bi-bag-check-fill", value: "50,000+", label: "Orders Delivered" },
              { icon: "bi-heart-fill", value: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <i className={`bi ${s.icon} text-primary fs-4 d-block mb-1`} />
                <p className="fw-bold fs-5 mb-0">{s.value}</p>
                <p className="text-muted small mb-0">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials grid */}
      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm p-4">
                    <div className="skeleton mb-3" style={{ height: 16, width: "40%" }} />
                    <div className="skeleton mb-2" style={{ height: 14 }} />
                    <div className="skeleton mb-2" style={{ height: 14 }} />
                    <div className="skeleton mb-4" style={{ height: 14, width: "70%" }} />
                    <div className="d-flex gap-3 align-items-center">
                      <div className="skeleton rounded-circle" style={{ width: 48, height: 48 }} />
                      <div className="flex-grow-1">
                        <div className="skeleton mb-1" style={{ height: 14, width: "60%" }} />
                        <div className="skeleton" style={{ height: 12, width: "40%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text fs-1 text-muted d-block mb-3" />
              <p className="text-muted">No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="row g-4">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-light py-5 border-top">
        <div className="container text-center">
          <h3 className="fw-bold mb-2">Shop Now &amp; Experience the Difference</h3>
          <p className="text-muted mb-4">Join thousands of happy customers across India</p>
          <a href="/products/all" className="btn btn-primary btn-lg px-5">
            <i className="bi bi-bag me-2" />Explore Collection
          </a>
        </div>
      </div>
    </>
  );
}
