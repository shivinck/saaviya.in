"use client";
import { useEffect, useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFaqs(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filtered =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  // Default FAQs for demo when no data
  const demoFaqs: FaqItem[] = loading
    ? []
    : faqs.length === 0
    ? [
        { id: "1", question: "How do I track my order?", answer: "You can track your order from the My Orders section in your account.", category: "orders" },
        { id: "2", question: "What is the return policy?", answer: "We offer a 7-day return policy on all products. Items must be unused and in original packaging.", category: "returns" },
        { id: "3", question: "How long does delivery take?", answer: "Orders typically take 5-7 business days after payment verification.", category: "shipping" },
        { id: "4", question: "What payment methods are accepted?", answer: "We currently accept UPI payments. Pay by scanning the QR code at checkout.", category: "payment" },
        { id: "5", question: "How do I change my address?", answer: "Go to My Account → Addresses to add or edit your delivery addresses.", category: "account" },
        { id: "6", question: "Can I cancel my order?", answer: "Orders can be cancelled before they are verified. Contact support for assistance.", category: "orders" },
      ]
    : faqs;

  const displayFaqs =
    activeCategory === "all"
      ? demoFaqs
      : demoFaqs.filter((f) => f.category === activeCategory);

  const allCategories = [
    "all",
    ...Array.from(new Set(demoFaqs.map((f) => f.category))),
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Frequently Asked Questions</h1>
        <p className="text-muted">Can't find what you're looking for? Contact our support team.</p>
      </div>

      {/* Category tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              activeCategory === cat ? "btn-primary" : "btn-outline-secondary"
            } text-capitalize`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {displayFaqs.map((faq, idx) => (
                <div key={faq.id} className="accordion-item border-0 mb-2 shadow-sm rounded">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed fw-semibold rounded"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq-${faq.id}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div id={`faq-${faq.id}`} className="accordion-collapse collapse">
                    <div className="accordion-body text-muted">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            {displayFaqs.length === 0 && (
              <p className="text-center text-muted">No FAQs in this category.</p>
            )}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="text-center mt-5 p-5 bg-light rounded-3">
        <h4 className="fw-bold mb-2">Still have questions?</h4>
        <p className="text-muted mb-4">Our support team is here to help you.</p>
        <a href="mailto:support@dstore.in" className="btn btn-primary px-5">
          <i className="bi bi-envelope me-2" />Email Support
        </a>
      </div>
    </div>
  );
}
