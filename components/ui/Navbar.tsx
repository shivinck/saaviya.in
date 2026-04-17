"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CartCount {
  count: number;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.data?.length || 0);
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, pathname]);

  useEffect(() => {
    if (user) fetchCartCount();
  }, [user, fetchCartCount, pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCartCount(0);
    router.push("/");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <Image
            src="/assets/saaviya_logo_2026.png"
            alt="Saaviya Logo"
            width={130}
            height={50}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* Search */}
          <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: 400, width: "100%" }} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-search" />
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link" href="/products/all">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/stories">
                Stories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/testimonials">
                Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/faq">
                FAQ
              </Link>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link href="/cart" className="nav-link position-relative px-2">
                <i className="bi bi-bag fs-5" />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            {/* User menu */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1" />
                  {user.name.split(" ")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/account/profile">
                      <i className="bi bi-person me-2" />My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/orders">
                      <i className="bi bi-box me-2" />My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/wishlist">
                      <i className="bi bi-heart me-2" />Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/addresses">
                      <i className="bi bi-geo-alt me-2" />Addresses
                    </Link>
                  </li>
                  {user.role === "ADMIN" && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" href="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2" />Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2" />Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link href="/login" className="btn btn-primary btn-sm px-3">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
