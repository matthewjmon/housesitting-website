import { useState } from "react";
import axios from "axios";

const CONTACT_INFO = [
  {
    icon: "📞",
    label: "Phone",
    lines: ["Matthew: +27 71 683 8781", "Layla: +27 82 298 2489"],
    color: "bg-primary-100 text-primary-600",
  },
  {
    icon: "✉️",
    label: "Email",
    lines: ["gonubiehousesitting@gmail.com"],
    color: "bg-blue-100   text-blue-600",
  },
  {
    icon: "📍",
    label: "Location",
    lines: ["Gonubie, East London", "Eastern Cape, South Africa"],
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoad] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Please enter a message.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoad(true);
    setApiErr("");
    try {
      await axios.post("/api/contact", form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setApiErr("Something went wrong. Please email or call us directly.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label" aria-hidden="true">
            Get In Touch
          </p>
          <h2 id="contact-heading" className="section-title">
            Have a Question?
          </h2>
          <p className="section-sub mx-auto text-center">
            We'd love to hear from you — we typically respond within a few
            hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: info */}
          <div className="space-y-5">
            <div className="card-mint p-6 sm:p-7">
              <h3 className="font-heading font-semibold text-gray-900 mb-5">
                Contact Information
              </h3>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon, label, lines, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 text-lg`}
                      aria-hidden="true"
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        {label}
                      </p>
                      {lines.map((l) => (
                        <p key={l} className="text-gray-500 text-sm">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-mint p-6">
              <h3 className="font-heading font-semibold text-gray-900 mb-2">
                Response Time
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We typically respond within 2–4 hours during the day. For urgent
                matters, please call us directly.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="card-mint p-6 sm:p-7">
            <h3 className="font-heading font-semibold text-gray-900 mb-5">
              Send Us a Message
            </h3>

            {sent ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-3" aria-hidden="true">
                  ✅
                </div>
                <p className="font-semibold text-gray-900">Message sent!</p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll get back to you within a few hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-4 text-sm"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label">
                    Your Name{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    className={`field-input bg-white ${errors.name ? "border-red-400 focus:ring-red-400" : ""}`}
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="field-label">
                    Email Address{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    className={`field-input bg-white ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="field-label">
                    Phone Number{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    className="field-input bg-white"
                    placeholder="+27 82 123 4567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    type="tel"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="field-label">
                    Message{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <textarea
                    className={`field-textarea bg-white ${errors.message ? "border-red-400 focus:ring-red-400" : ""}`}
                    rows={4}
                    placeholder="Tell us about your house sitting needs…"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {apiErr && (
                  <p className="text-red-500 text-sm" role="alert">
                    {apiErr}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-full py-3 justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
