import { useEffect, useState } from "react";

import { AuthForm } from "./components/AuthForm";
import { FollowUpList } from "./components/FollowUpList";
import { LeadForm } from "./components/LeadForm";
import { LeadTable } from "./components/LeadTable";
import { StatCard } from "./components/StatCard";
import { api } from "./lib/api";

export default function App() {
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingLead, setEditingLead] = useState(null);

  async function loadAppData() {
    const [profileData, statsData, leadsData, followUpData] = await Promise.all([
      api.me(),
      api.getDashboardStats(),
      api.getLeads(),
      api.getFollowUps()
    ]);
    setProfile(profileData);
    setStats(statsData);
    setLeads(leadsData);
    setFollowUps(followUpData);
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    loadAppData().catch((err) => {
      setError(err.message);
      localStorage.removeItem("token");
      setToken(null);
    });
  }, [token]);

  async function handleAuthSubmit(form) {
    setLoading(true);
    setError("");
    try {
      const result = mode === "signup" ? await api.signup(form) : await api.login(form);
      localStorage.setItem("token", result.access_token);
      setToken(result.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLeadSubmit(form) {
    setError("");
    try {
      if (editingLead) {
        const payload = { ...form };
        delete payload.follow_up_date;
        await api.updateLead(editingLead.id, payload);
        setEditingLead(null);
      } else {
        await api.createLead(form);
      }
      await loadAppData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLeadDelete(id) {
    try {
      await api.deleteLead(id);
      await loadAppData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFollowUpComplete(id) {
    try {
      await api.updateFollowUp(id, { is_completed: true });
      await loadAppData();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    setStats(null);
    setLeads([]);
    setFollowUps([]);
    setEditingLead(null);
    setError("");
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),_transparent_35%),linear-gradient(135deg,_#07101c,_#16243a)] p-6">
        <AuthForm
          error={error}
          loading={loading}
          mode={mode}
          onSubmit={handleAuthSubmit}
          onToggleMode={() => {
            setError("");
            setMode((current) => (current === "signup" ? "login" : "signup"));
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,_#06101d_0%,_#10233e_55%,_#1c1e1c_100%)] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">{profile?.business_type}</p>
            <h1 className="mt-2 font-display text-4xl text-sand">{profile?.business_name}</h1>
            <p className="mt-2 text-slate-300">Manage inquiries, follow-ups, and conversions from one responsive CRM.</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="rounded-full border border-white/10 bg-panel px-4 py-2 text-sm">
              Plan: <span className="font-semibold uppercase text-orange-200">{profile?.current_plan}</span>
            </div>
            {stats?.show_ads ? (
              <div className="max-w-xs rounded-2xl border border-orange-300/30 bg-orange-500/10 p-4 text-sm text-orange-100">
                <p className="font-semibold">Sponsored banner</p>
                <p className="mt-1">Upgrade to Pro to remove ads and unlock unlimited leads.</p>
              </div>
            ) : profile?.company_logo_url ? (
              <img alt="Company logo" className="h-16 rounded-2xl bg-white p-2" src={profile.company_logo_url} />
            ) : (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">Pro plan active. Add your custom company logo URL in the profile later.</div>
            )}
            <button className="text-sm text-slate-300 underline" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </header>

        {error ? <div className="mb-6 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Leads today" value={stats?.leads_today ?? 0} />
          <StatCard label="Total leads" value={stats?.total_leads ?? 0} hint={stats?.is_free_plan ? `Free limit: ${stats.max_leads}` : "Unlimited on Pro"} />
          <StatCard label="Follow-ups due" value={stats?.followups_due_today ?? 0} />
          <div className="rounded-3xl border border-dashed border-orange-300/40 bg-orange-500/10 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-orange-200">Quick action</p>
            <p className="mt-4 text-2xl font-semibold text-sand">Add lead</p>
            <p className="mt-2 text-sm text-orange-100">Capture inquiries immediately and keep the team moving.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <LeadForm disabled={loading} editingLead={editingLead} onCancel={() => setEditingLead(null)} onSubmit={handleLeadSubmit} />
            <LeadTable leads={leads} onDelete={handleLeadDelete} onEdit={setEditingLead} upgradeRequired={stats?.upgrade_required} />
          </div>
          <FollowUpList followUps={followUps} onComplete={handleFollowUpComplete} />
        </section>
      </div>
    </main>
  );
}
