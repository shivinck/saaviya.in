"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  size: string;
  quantity: number;
  product: { name: string; price: string | number; images: string[] };
}

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const screenshotRef = useRef<HTMLInputElement>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=address, 2=payment, 3=success
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const [cartRes, addrRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/addresses"),
      ]);

      if (cartRes.status === 401) {
        router.push("/login?redirect=/checkout");
        return;
      }

      const [cartData, addrData] = await Promise.all([cartRes.json(), addrRes.json()]);

      if (cartData.success) {
        if (!cartData.data.length) {
          router.push("/cart");
          return;
        }
        setCartItems(cartData.data);
      }
      if (addrData.success) {
        setAddresses(addrData.data);
        const def = addrData.data.find((a: Address) => a.isDefault);
        if (def) setSelectedAddress(def.id);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setScreenshot(f);
      setScreenshotPreview(URL.createObjectURL(f));
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    if (!screenshot) {
      setError("Please upload the payment screenshot");
      return;
    }

    setPlacing(true);
    setError("");

    const formData = new FormData();
    formData.append("addressId", selectedAddress);
    formData.append("paymentScreenshot", screenshot);

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.data.orderNumber);
        setStep(3);
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity,
    0
  );
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="container py-5 text-center">
        <div className="d-flex justify-content-center mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 80, height: 80, background: "#d4edda" }}
          >
            <i className="bi bi-check2 text-success fs-1" />
          </div>
        </div>
        <h2 className="fw-bold">Order Placed!</h2>
        <p className="text-muted">Order <strong>#{orderNumber}</strong> is pending payment verification.</p>
        <p className="text-muted">We'll notify you once your payment is verified.</p>
        <div className="d-flex gap-3 justify-content-center mt-4">
          <Link href="/account/orders" className="btn btn-primary px-4">View Orders</Link>
          <Link href="/" className="btn btn-outline-secondary px-4">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <h1 className="h3 fw-bold mb-4">Checkout</h1>

      {/* Steps */}
      <div className="d-flex align-items-center mb-5 gap-2">
        {[
          { n: 1, label: "Address" },
          { n: 2, label: "Payment" },
        ].map(({ n, label }, idx) => (
          <div key={n} className="d-flex align-items-center gap-2">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold`}
              style={{
                width: 36,
                height: 36,
                background: step >= n ? "var(--primary)" : "#dee2e6",
                color: step >= n ? "white" : "#666",
              }}
            >
              {n}
            </div>
            <span className={`small fw-semibold ${step >= n ? "text-primary" : "text-muted"}`}>
              {label}
            </span>
            {idx < 1 && <div className="flex-grow-1 border-top mx-2" style={{ minWidth: 40 }} />}
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Left - Steps */}
        <div className="col-lg-7">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-geo-alt me-2 text-primary" />
                  Delivery Address
                </h5>

                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No addresses saved.</p>
                    <Link href="/account/addresses" className="btn btn-outline-primary">
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="row g-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="col-12">
                        <div
                          className={`rounded-3 p-3 cursor-pointer border ${
                            selectedAddress === address.id
                              ? "border-primary border-2"
                              : "border-light"
                          }`}
                          style={{ cursor: "pointer", background: selectedAddress === address.id ? "#fff0f4" : "#fff" }}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="fw-semibold mb-1">{address.name}</p>
                              <p className="text-muted small mb-0">
                                {address.line1}
                                {address.line2 ? `, ${address.line2}` : ""},{" "}
                                {address.city}, {address.state} – {address.pincode}
                              </p>
                              <p className="text-muted small mt-1">📞 {address.phone}</p>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={selectedAddress === address.id}
                                onChange={() => setSelectedAddress(address.id)}
                              />
                            </div>
                          </div>
                          {address.isDefault && (
                            <span className="badge bg-primary mt-1">Default</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 d-flex gap-2">
                  <Link
                    href="/account/addresses?returnTo=/checkout"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-plus me-1" />Add New Address
                  </Link>
                </div>

                <button
                  className="btn btn-primary w-100 mt-4"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-credit-card me-2 text-primary" />
                    Payment
                  </h5>
                  <button
                    className="btn btn-sm btn-link text-muted text-decoration-none"
                    onClick={() => setStep(1)}
                  >
                    ← Change Address
                  </button>
                </div>

                {/* UPI QR */}
                <div className="text-center p-4 rounded-3 bg-light mb-4">
                  <p className="fw-semibold mb-3">Scan UPI QR Code to Pay</p>
                  {/* Placeholder QR code */}
                  <div
                    className="mx-auto mb-3 rounded d-flex align-items-center justify-content-center bg-white border"
                    style={{ width: 200, height: 200 }}
                  >
                    <div className="text-center">
                      <i className="bi bi-qr-code fs-1 text-dark" />
                      <p className="small text-muted mt-1 mb-0">UPI QR Code</p>
                    </div>
                  </div>
                  <p className="text-muted small">UPI ID: payments@dstore.in</p>
                  <div className="badge bg-warning text-dark px-3 py-2 fs-6">
                    Pay ₹{total.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Upload Payment Screenshot *
                  </label>
                  <div
                    className="border rounded-3 p-4 text-center"
                    style={{ borderStyle: "dashed !important", cursor: "pointer" }}
                    onClick={() => screenshotRef.current?.click()}
                  >
                    {screenshotPreview ? (
                      <div>
                        <Image
                          src={screenshotPreview}
                          alt="Payment screenshot"
                          width={200}
                          height={150}
                          className="rounded mb-2"
                          style={{ objectFit: "cover", maxHeight: 150 }}
                        />
                        <p className="small text-success mb-0">
                          <i className="bi bi-check2-circle me-1" />
                          {screenshot?.name}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <i className="bi bi-cloud-upload fs-1 text-muted" />
                        <p className="text-muted mt-2 mb-0 small">
                          Click to upload payment screenshot
                        </p>
                        <p className="text-muted small">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={screenshotRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleScreenshotChange}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger small py-2">{error}</div>
                )}

                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                  ) : (
                    <><i className="bi bi-bag-check me-2" />Place Order</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Order Summary ({cartItems.length} items)</h6>

              {cartItems.map((item) => (
                <div key={item.id} className="d-flex gap-3 mb-3">
                  <div
                    className="rounded overflow-hidden flex-shrink-0"
                    style={{ width: 56, height: 72, position: "relative" }}
                  >
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 bg-light" />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <p className="small fw-semibold mb-0 text-truncate">{item.product.name}</p>
                    <p className="text-muted small mb-0">Size: {item.size} × {item.quantity}</p>
                    <p className="text-primary small fw-bold mb-0">
                      ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
