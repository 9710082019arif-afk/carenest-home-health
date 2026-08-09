import React, { useState } from "react";
import { createLead } from "@/lib/api";
import { trackLeadSubmit } from "@/lib/analytics";
import { toast } from "sonner";
import { SERVICES } from "@/data/content";
import { ArrowRight } from "lucide-react";

const LeadForm = ({
  variant = "inline",
  defaultService = "",
  title = "Talk to a care coordinator",
  defaultCity = "Pune",
}) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: defaultCity,
    service: defaultService,
    message: "",
    urgency: "standard",
  });
  const [loading, setLoading] = useState(false);
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.length < 2 || form.phone.length < 6) {
      toast.error("Please share your name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await createLead({ ...form, source: variant });
      trackLeadSubmit({
        city: form.city,
        service: form.service,
        source: variant,
        urgency: form.urgency,
      });
      toast.success("Thank you. A care coordinator will call you shortly.");
      setForm({
        name: "",
        phone: "",
        email: "",
        city: defaultCity,
        service: defaultService,
        message: "",
        urgency: "standard",
      });
    } catch {
      toast.error("Could not submit — please call +91 9175724546.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} data-testid={`lead-form-${variant}`} className="space-y-3.5">
      {title && (
        <div className="mb-1">
          <div className="overline text-primary/70">Quick enquiry</div>
          <h3 className="font-serif text-2xl md:text-[26px] mt-1.5 leading-tight">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          data-testid={`${variant}-lead-name`}
          value={form.name}
          onChange={(v) => setField("name", v)}
          placeholder="Full name"
        />
        <Field
          data-testid={`${variant}-lead-phone`}
          value={form.phone}
          onChange={(v) => setField("phone", v)}
          placeholder="Phone"
          type="tel"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          data-testid={`${variant}-lead-email`}
          value={form.email}
          onChange={(v) => setField("email", v)}
          placeholder="Email (optional)"
          type="email"
        />
        <Field
          data-testid={`${variant}-lead-city`}
          value={form.city}
          onChange={(v) => setField("city", v)}
          placeholder="City"
        />
      </div>
      <Select
        data-testid={`${variant}-lead-service`}
        value={form.service}
        onChange={(v) => setField("service", v)}
        placeholder="Service required"
      >
        {SERVICES.map((s) => (
          <option key={s.slug} value={s.name}>
            {s.name}
          </option>
        ))}
      </Select>
      <textarea
        data-testid={`${variant}-lead-message`}
        value={form.message}
        onChange={(e) => setField("message", e.target.value)}
        placeholder="Tell us briefly — patient's condition, timing, any preferences"
        rows={3}
        className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      <div className="flex items-center gap-2 flex-wrap">
        {["standard", "urgent", "emergency"].map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setField("urgency", u)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              form.urgency === u
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
            data-testid={`${variant}-lead-urgency-${u}`}
          >
            {u === "standard" ? "Standard · today" : u === "urgent" ? "Urgent · < 4h" : "Emergency · now"}
          </button>
        ))}
      </div>

      <button data-testid={`${variant}-lead-submit`} disabled={loading} type="submit" className="btn-gold w-full mt-1">
        {loading ? (
          "Sending…"
        ) : (
          <>
            Request callback <ArrowRight size={16} />
          </>
        )}
      </button>
      <p className="text-[11px] text-muted-foreground text-center">
        By submitting, you consent to be contacted by our care team.
      </p>
    </form>
  );
};

const Field = ({ value, onChange, placeholder, type = "text", ...rest }) => (
  <input
    {...rest}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
  />
);

const Select = ({ value, onChange, placeholder, children, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none"
  >
    <option value="">{placeholder}</option>
    {children}
  </select>
);

export default LeadForm;
