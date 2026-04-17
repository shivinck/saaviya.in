export default function ShippingPolicyPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      <h1 className="fw-bold mb-1">Shipping Policy</h1>
      <p className="text-muted small mb-4">Last updated: April 2025</p>

      <p>We ship across India. Here is everything you need to know about shipping and delivery at <strong>dstore.in</strong>.</p>

      <div className="row g-3 mb-4">
        {[
          { icon: "bi-truck", title: "Standard Delivery", desc: "5–7 business days", price: "₹79 (Free above ₹999)" },
          { icon: "bi-lightning-charge", title: "Express Delivery", desc: "2–3 business days", price: "₹149" },
          { icon: "bi-gift", title: "Same-Day Delivery", desc: "Delhi NCR only", price: "₹199" },
        ].map((s) => (
          <div key={s.title} className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <i className={`bi ${s.icon} fs-2 text-primary mb-2`} />
              <h6 className="fw-bold">{s.title}</h6>
              <p className="text-muted small mb-1">{s.desc}</p>
              <span className="badge bg-primary bg-opacity-10 text-primary">{s.price}</span>
            </div>
          </div>
        ))}
      </div>

      {[
        {
          title: "Order Processing Time",
          body: "Orders are processed within 24–48 hours on business days (Monday to Saturday). Orders placed on Sundays or public holidays will be processed the next business day.",
        },
        {
          title: "Tracking Your Order",
          body: "Once your order is shipped, you will receive an email with a tracking link. You can also track your order by logging into your account and visiting Order History.",
        },
        {
          title: "Delivery Attempts",
          body: "Our courier partners will attempt delivery up to 3 times. If the delivery fails, the package will be returned to our warehouse and a re-delivery fee may apply.",
        },
        {
          title: "Remote Areas",
          body: "Delivery to remote or hilly areas may take an additional 2–3 days. We currently ship to all states and union territories in India.",
        },
        {
          title: "Shipping Delays",
          body: "During peak seasons (festivals, sale events) or due to unforeseen circumstances (weather, strikes), delivery times may be slightly longer. We appreciate your patience.",
        },
      ].map((s) => (
        <div key={s.title} className="mb-4">
          <h5 className="fw-semibold">{s.title}</h5>
          <p className="text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
