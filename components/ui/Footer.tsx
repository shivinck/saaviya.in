import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 mt-5">
      <div className="container">
        <div className="row g-4 pb-4">

          {/* Brand */}
          <div className="col-md-4">
            <Link href="/" className="text-decoration-none d-inline-block mb-3">
              <Image
                src="/assets/saaviya_logo_2026.png"
                alt="Saaviya Logo"
                width={50}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <p className="text-light opacity-75 small mb-3">
              Your ultimate destination for women&apos;s fashion. Explore the latest trends,
              ethnic wear, western outfits and more at unbeatable prices.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[
                { icon: "bi-instagram", label: "Instagram", href: "#" },
                { icon: "bi-facebook", label: "Facebook", href: "#" },
                { icon: "bi-twitter-x", label: "Twitter", href: "#" },
                { icon: "bi-youtube", label: "YouTube", href: "#" },
                { icon: "bi-pinterest", label: "Pinterest", href: "#" },
              ].map((s) => (
                <a key={s.label} href={s.href} className="text-light opacity-75 fs-5 text-decoration-none footer-social" aria-label={s.label}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-white">Categories</h6>
            <ul className="list-unstyled">
              {[
                { label: "Kurtas", href: "/products/kurtas" },
                { label: "Dresses", href: "/products/dresses" },
                { label: "Tops", href: "/products/tops" },
                { label: "Lehengas", href: "/products/lehengas" },
                { label: "Sarees", href: "/products/sarees" },
                { label: "Ethnic Sets", href: "/products/ethnic-sets" },
              ].map((l) => (
                <li key={l.label} className="mb-1">
                  <Link href={l.href} className="text-light opacity-75 small text-decoration-none footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-white">Shop</h6>
            <ul className="list-unstyled">
              {[
                { label: "New Arrivals", href: "/products/all?sort=newest" },
                { label: "Trending Now", href: "/products/all?trending=true" },
                { label: "Special Offers", href: "/products/all?offer=true" },
                { label: "All Products", href: "/products/all" },
                { label: "Stories", href: "/stories" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <li key={l.label} className="mb-1">
                  <Link href={l.href} className="text-light opacity-75 small text-decoration-none footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-white">My Account</h6>
            <ul className="list-unstyled">
              {[
                { label: "Login / Register", href: "/login" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Wishlist", href: "/account/wishlist" },
                { label: "My Addresses", href: "/account/addresses" },
                { label: "Profile", href: "/account/profile" },
              ].map((l) => (
                <li key={l.label} className="mb-1">
                  <Link href={l.href} className="text-light opacity-75 small text-decoration-none footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-white">Contact Us</h6>
            <ul className="list-unstyled text-light opacity-75 small">
              <li className="mb-2 d-flex gap-2">
                <i className="bi bi-geo-alt-fill text-primary mt-1 flex-shrink-0" />
                <span>12, Fashion Street, Lajpat Nagar, New Delhi - 110024</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill text-primary me-2" />
                <a href="mailto:support@dstore.in" className="text-light opacity-75 text-decoration-none footer-link">support@dstore.in</a>
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill text-primary me-2" />
                <a href="tel:+919876543210" className="text-light opacity-75 text-decoration-none footer-link">+91 98765 43210</a>
              </li>
              <li className="mb-3">
                <i className="bi bi-clock-fill text-primary me-2" />
                Mon-Sat: 9AM-6PM
              </li>
              <li>
                <Link href="/contact" className="btn btn-outline-primary btn-sm w-100">
                  <i className="bi bi-chat-dots me-1" />Send a Message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary mb-0" />

        {/* Policy links row */}
        <div className="py-3 border-bottom border-secondary">
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Contact Us", href: "/contact" },
              { label: "FAQ", href: "/faq" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-light opacity-75 small text-decoration-none footer-link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="py-3 text-center">
          <p className="text-light opacity-75 small mb-0">
            &copy; {year}{" "}
            <span className="text-primary fw-semibold">dstore.in</span>.{" "}
            All rights reserved. Made with{" "}
            <i className="bi bi-heart-fill text-danger small" />{" "}
            in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
