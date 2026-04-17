"use client";
import { useState } from "react";

const CONTACT_DETAILS = [
  {
    icon: "bi-geo-alt-fill",
    title: "Our Store",
    lines: ["12, Fashion Street", "Lajpat Nagar, New Delhi – 110024", "India"],
  },
  {
    icon: "bi-envelope-fill",
    title: "Email Us",
    lines: ["support@dstore.in", "orders@dstore.in"],
  },
  {
    icon: "bi-telephone-fill",
    title: "Call Us",
    lines: ["+91 98765 43210", "+91 98765 43211"],
  },
  {
    icon: "bi-clock-fill",
    title: "Working Hours",
    lines: ["Monday – Saturday", "9:00 AM – 6:00 PM IST"],
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResponseMsg(data.data.message);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setResponseMsg("Network error. Please try again.");
    }
  };

  return (
    <>
      {/* Hero */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg,#e91e63 0%,#9c27b0 100%)" }}
      >
        <div className="container">
          <h1 className="fw-bold display-5 mb-2">Contact Us</h1>
          <p className="lead mb-0 opacity-75">We'd love to hear from you. Let us know how we can help.</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">

          {/* Left: Details + Map */}
          <div className="col-lg-5">

            {/* Contact detail cards */}
            <div className="row g-3 mb-4">
              {CONTACT_DETAILS.map((d) => (
                <div key={d.title} className="col-6">
                  <div className="card border-0 shadow-sm h-100 p-3">
                    <i className={`bi ${d.icon} fs-3 text-primary mb-2`} />
                    <h6 className="fw-bold mb-1">{d.title}</h6>
                    {d.lines.map((line) => (
                      <p key={line} className="text-muted small mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="rounded overflow-hidden shadow-sm border" style={{ height: 280 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.234!2d77.2369!3d28.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3b5bef6de13%3A0x7e4c3b0e7e4e3b0e!2sLajpat+Nagar%2C+New+Delhi%2C+Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="dstore.in location"
              />
            </div>

            {/* Social media */}
            <div className="mt-4">
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                {[
                  { icon: "bi-instagram", label: "Instagram", color: "#e1306c" },
                  { icon: "bi-facebook", label: "Facebook", color: "#1877f2" },
                  { icon: "bi-twitter-x", label: "Twitter", color: "#000" },
                  { icon: "bi-youtube", label: "YouTube", color: "#ff0000" },
                  { icon: "bi-pinterest", label: "Pinterest", color: "#bd081c" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="btn btn-outline-secondary btn-sm px-2"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h2 className="fw-bold mb-1 h4">Send us a Message</h2>
              <p className="text-muted small mb-4">Fill out the form and our team will get back to you within 24 hours.</p>

              {status === "success" && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-check-circle-fill fs-5" />
                  <div>
                    <strong>Message sent!</strong>
                    <p className="mb-0 small">{responseMsg}</p>
                  </div>
                </div>
              )}
              {status === "error" && (
                <div className="alert alert-danger small mb-4">
                  <i className="bi bi-exclamation-circle me-2" />{responseMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      className="form-control"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text text-muted small">+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Subject</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order Related</option>
                      <option value="return">Return / Refund</option>
                      <option value="shipping">Shipping Query</option>
                      <option value="product">Product Question</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Message *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      ) : (
                        <><i className="bi bi-send me-2" />Send Message</>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 pt-3 border-top">
                <p className="text-muted small mb-0 text-center">
                  <i className="bi bi-shield-check text-success me-1" />
                  Your details are safe with us. We never share your data with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
