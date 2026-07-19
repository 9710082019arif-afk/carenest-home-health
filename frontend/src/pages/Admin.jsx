import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Lock, LogOut, RefreshCw, Users, CalendarCheck, Mail, Briefcase, Newspaper } from "lucide-react";

const TOKEN_KEY = "carenest_admin_token";

export const AdminLogin = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(TOKEN_KEY)) setRedirect(true);
  }, []);
  if (redirect) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/admin/verify`, { headers: { "X-Admin-Token": token } });
      if (!r.ok) throw new Error("Invalid token");
      localStorage.setItem(TOKEN_KEY, token);
      toast.success("Signed in.");
      setRedirect(true);
    } catch { toast.error("Invalid admin token."); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <PageHeader eyebrow="Admin" title="Sign in" subtitle="Enter your admin token to view enquiries." crumbs={[{ label: "Admin" }]} />
      <section className="container-lux pb-24 max-w-md">
        <form onSubmit={submit} className="rounded-3xl border border-border/70 bg-card/70 p-8 shadow-lux space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Lock size={20}/></div>
          <div>
            <div className="overline text-accent">Restricted</div>
            <h2 className="font-serif text-2xl mt-2">Admin token</h2>
          </div>
          <input
            data-testid="admin-token-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            placeholder="Paste admin token"
            className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            autoFocus
          />
          <button data-testid="admin-login-submit" disabled={loading || !token} className="btn-primary w-full disabled:opacity-40">
            {loading ? "Verifying…" : "Sign in"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">Your token is stored only in this browser.</p>
        </form>
      </section>
    </Layout>
  );
};

const TABS = [
  { key: "leads", label: "Leads", icon: Users, path: "/leads" },
  { key: "appointments", label: "Appointments", icon: CalendarCheck, path: "/appointments" },
  { key: "contacts", label: "Contacts", icon: Mail, path: "/admin/contacts" },
  { key: "careers", label: "Careers", icon: Briefcase, path: "/admin/careers" },
  { key: "newsletter", label: "Newsletter", icon: Newspaper, path: "/admin/newsletter" },
];

export const AdminDashboard = () => {
  const [token, setToken] = useState(() => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : "") || "");
  const [tab, setTab] = useState("leads");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const authFetch = (path) => fetch(`${API_BASE}${path}`, { headers: { "X-Admin-Token": token } });

  const load = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const tabDef = TABS.find((t) => t.key === tab);
      const [rs, ss] = await Promise.all([authFetch(tabDef.path), authFetch("/admin/stats")]);
      if (rs.status === 401) { localStorage.removeItem(TOKEN_KEY); setToken(""); return; }
      const data = await rs.json();
      const s = await ss.json();
      setRows(data || []); setStats(s);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }, [tab, token]);

  useEffect(() => { load(); }, [load]);

  if (!token) return <Navigate to="/admin" replace />;

  const signOut = () => { localStorage.removeItem(TOKEN_KEY); setToken(""); };

  return (
    <Layout>
      <PageHeader
        eyebrow="Admin"
        title="Enquiries dashboard"
        subtitle="All leads, appointments and contact messages that came through the site."
        crumbs={[{ label: "Admin" }]}
      />
      <section className="container-lux pb-24">
        {/* stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Leads (all-time)" value={stats.leads_total} sub={`+${stats.leads_last_7d} in last 7 days`} />
            <StatCard label="Appointments" value={stats.appointments_total} sub={`+${stats.appointments_last_7d} in last 7 days`} />
            <StatCard label="Contact messages" value={stats.contacts_total} />
            <StatCard label="Newsletter subs" value={stats.newsletter_total} />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} data-testid={`admin-tab-${key}`} onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${tab === key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                <Icon size={14}/> {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="admin-refresh" onClick={load} className="btn-ghost h-9"><RefreshCw size={14}/> Refresh</button>
            <button data-testid="admin-signout" onClick={signOut} className="btn-outline h-9"><LogOut size={14}/> Sign out</button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <Head tab={tab} />
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={8}>Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={8}>No records yet.</td></tr>
                ) : rows.map((r) => (
                  <Row key={r.id || r.email} row={r} tab={tab} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const StatCard = ({ label, value, sub }) => (
  <div className="rounded-3xl border border-border/70 bg-card/60 p-5">
    <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    <div className="font-serif text-3xl mt-2 text-primary">{value ?? "—"}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

const Th = ({ children }) => <th className="px-4 py-3 font-semibold tracking-wide text-xs uppercase text-muted-foreground">{children}</th>;

const Head = ({ tab }) => {
  const cols = {
    leads: ["When", "Name", "Phone", "City", "Service", "Urgency", "Message"],
    appointments: ["When", "Patient", "Phone", "City", "Service", "Date", "Status"],
    contacts: ["When", "Name", "Email", "Phone", "Subject", "Message"],
    careers: ["When", "Name", "Phone", "Role", "Experience", "City"],
    newsletter: ["When", "Email"],
  }[tab];
  return <tr>{cols.map((c) => <Th key={c}>{c}</Th>)}</tr>;
};

const fmtDate = (s) => {
  try { return new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch { return s || "—"; }
};

const Td = ({ children }) => <td className="px-4 py-3 align-top">{children ?? "—"}</td>;

const Row = ({ row, tab }) => {
  if (tab === "leads") return (
    <tr className="border-t border-border/60"><Td>{fmtDate(row.created_at)}</Td><Td>{row.name}</Td><Td><a className="text-primary hover:underline" href={`tel:${row.phone}`}>{row.phone}</a></Td><Td>{row.city}</Td><Td>{row.service}</Td><Td><span className={`text-xs font-semibold ${row.urgency === 'emergency' ? 'text-destructive' : row.urgency === 'urgent' ? 'text-accent-foreground' : 'text-muted-foreground'}`}>{row.urgency}</span></Td><Td><span className="text-xs text-muted-foreground">{row.message || "—"}</span></Td></tr>
  );
  if (tab === "appointments") return (
    <tr className="border-t border-border/60"><Td>{fmtDate(row.created_at)}</Td><Td>{row.patient_name}</Td><Td><a className="text-primary hover:underline" href={`tel:${row.phone}`}>{row.phone}</a></Td><Td>{row.city}</Td><Td>{row.service}</Td><Td>{row.preferred_date} {row.preferred_time}</Td><Td>{row.status}</Td></tr>
  );
  if (tab === "contacts") return (
    <tr className="border-t border-border/60"><Td>{fmtDate(row.created_at)}</Td><Td>{row.name}</Td><Td><a href={`mailto:${row.email}`} className="text-primary hover:underline">{row.email}</a></Td><Td>{row.phone}</Td><Td>{row.subject}</Td><Td className="max-w-xs"><span className="text-xs text-muted-foreground">{row.message}</span></Td></tr>
  );
  if (tab === "careers") return (
    <tr className="border-t border-border/60"><Td>{fmtDate(row.created_at)}</Td><Td>{row.name}</Td><Td><a className="text-primary hover:underline" href={`tel:${row.phone}`}>{row.phone}</a></Td><Td>{row.role}</Td><Td>{row.experience_years}</Td><Td>{row.city}</Td></tr>
  );
  if (tab === "newsletter") return (
    <tr className="border-t border-border/60"><Td>{fmtDate(row.created_at)}</Td><Td>{row.email}</Td></tr>
  );
  return null;
};
