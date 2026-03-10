import { useEffect, useRef, useState } from "react";

import { AuthForm } from "./components/AuthForm";
import { FollowUpList } from "./components/FollowUpList";
import { LeadForm } from "./components/LeadForm";
import { LeadTable } from "./components/LeadTable";
import { LeadTrackerPanel } from "./components/LeadTrackerPanel";
import { StatCard } from "./components/StatCard";
import { SubscriptionUpgrade } from "./components/SubscriptionUpgrade";
import { api } from "./lib/api";

const pages = [
  { id: "dashboard", label: "Dashboard", short: "Home" },
  { id: "add-lead", label: "Add Lead", short: "Add" },
  { id: "leads", label: "Lead List", short: "Leads" },
  { id: "followups", label: "Reminders", short: "Tasks" },
  { id: "upgrade", label: "Upgrade", short: "Plan" }
];

const pageCopy = {
  dashboard: {
    eyebrow: "Sales cockpit",
    title: "Run your local lead pipeline from one clean workspace.",
    description: "See what came in today, what needs follow-up, and how close you are to your plan limit."
  },
  "add-lead": {
    eyebrow: "New enquiry",
    title: "Capture a lead before it gets lost.",
    description: "Keep the form simple so anyone in the business can add new enquiries in seconds."
  },
  leads: {
    eyebrow: "Lead records",
    title: "Review and manage every customer conversation.",
    description: "Open a lead, update the status, or remove records that are no longer active."
  },
  followups: {
    eyebrow: "Reminder queue",
    title: "Stay on top of callbacks and pending follow-ups.",
    description: "This page keeps the team focused on what needs action today."
  },
  upgrade: {
    eyebrow: "Billing",
    title: "Choose the plan that matches your lead volume.",
    description: "Upgrade when your team needs more records, branding, and a cleaner dashboard."
  }
};

function getInitials(name) {
  if (!name) {
    return "LG";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authLoading, setAuthLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [savingInteraction, setSavingInteraction] = useState(false);
  const [completingFollowUpId, setCompletingFollowUpId] = useState(null);
  const [error, setError] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const leadFormRef = useRef(null);

  async function loadAppData({ preserveSession = false } = {}) {
    setAppLoading(true);
    if (!preserveSession) {
      setError("");
    }

    try {
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
      setSelectedLeadId((current) => current ?? leadsData[0]?.id ?? null);
    } catch (err) {
      setError(err.message);
      if (!preserveSession) {
        localStorage.removeItem("token");
        setToken(null);
      }
    } finally {
      setAppLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    loadAppData();
  }, [token]);

  async function handleAuthSubmit(form) {
    setAuthLoading(true);
    setError("");

    try {
      const result = mode === "signup" ? await api.signup(form) : await api.login(form);
      localStorage.setItem("token", result.access_token);
      setToken(result.access_token);
      setCurrentPage("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLeadSubmit(form) {
    setError("");
    setSavingLead(true);

    try {
      if (editingLead) {
        const payload = { ...form };
        delete payload.follow_up_date;
        await api.updateLead(editingLead.id, payload);
        setEditingLead(null);
        setCurrentPage("leads");
      } else {
        await api.createLead(form);
        setCurrentPage("leads");
      }
      await loadAppData({ preserveSession: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingLead(false);
    }
  }

  async function handleLeadDelete(id) {
    try {
      await api.deleteLead(id);
      if (selectedLeadId === id) {
        setSelectedLeadId(null);
      }
      await loadAppData({ preserveSession: true });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFollowUpComplete(id) {
    setCompletingFollowUpId(id);

    try {
      await api.updateFollowUp(id, { is_completed: true });
      await loadAppData({ preserveSession: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCompletingFollowUpId(null);
    }
  }

  async function handleAddInteraction(leadId, form) {
    setSavingInteraction(true);
    setError("");

    try {
      await api.addLeadInteraction(leadId, {
        ...form,
        contacted_at: form.contacted_at ? new Date(form.contacted_at).toISOString() : null
      });
      setSelectedLeadId(leadId);
      await loadAppData({ preserveSession: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingInteraction(false);
    }
  }

  function focusLeadForm() {
    setEditingLead(null);
    setCurrentPage("add-lead");
    requestAnimationFrame(() => {
      leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleLeadEdit(lead) {
    setEditingLead(lead);
    setSelectedLeadId(lead.id);
    setCurrentPage("add-lead");
    requestAnimationFrame(() => {
      leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleTrackLead(lead) {
    setSelectedLeadId(lead.id);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    setStats(null);
    setLeads([]);
    setFollowUps([]);
    setEditingLead(null);
    setCurrentPage("dashboard");
    setError("");
  }

  function renderDashboardPage() {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard hint="fresh enquiries recorded since midnight" label="Leads today" value={stats?.leads_today ?? 0} />
          <StatCard hint={stats?.is_free_plan ? `Free plan limit: ${stats?.max_leads ?? 0}` : "Unlimited lead storage on Pro"} label="Total pipeline" value={stats?.total_leads ?? 0} />
          <StatCard hint="leads already contacted and moved forward" label="Contacted" value={stats?.contacted_leads ?? 0} />
          <StatCard hint="callbacks and check-ins due today" label="Follow-ups due" value={stats?.followups_due_today ?? 0} />
          <div className="surface-card flex flex-col justify-between p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/65">Quick action</p>
              <h3 className="mt-3 font-display text-3xl text-sand">Add a lead</h3>
              <p className="mt-2 text-sm text-slate-300">Capture walk-ins, calls, WhatsApp enquiries, or form submissions immediately.</p>
            </div>
            <button className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100" onClick={focusLeadForm} type="button">
              Open lead form
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="surface-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Overview</p>
                <h3 className="mt-2 font-display text-3xl text-sand">Business activity</h3>
              </div>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10" onClick={() => setCurrentPage("leads")} type="button">
                View all leads
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">New</p>
                <p className="mt-2 text-3xl font-semibold text-white">{leads.filter((lead) => lead.status === "New").length}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">Contacted</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats?.contacted_leads ?? leads.filter((lead) => lead.status === "Contacted").length}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">Converted</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats?.converted_leads ?? leads.filter((lead) => lead.status === "Converted").length}</p>
              </div>
            </div>

            <div className="mt-6">
              <LeadTable
                leads={leads.slice(0, 5)}
                onDelete={handleLeadDelete}
                onEdit={handleLeadEdit}
                onTrack={handleTrackLead}
                selectedLeadId={selectedLeadId}
                upgradeRequired={stats?.upgrade_required}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Today</p>
              <h3 className="mt-2 font-display text-3xl text-sand">{getTodayLabel()}</h3>
              <p className="mt-3 text-sm text-slate-300">Use this page as a daily operating view for the business owner or front-desk team.</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm text-slate-400">Plan</p>
                  <p className="mt-1 text-lg font-semibold uppercase text-accent-soft">{profile?.current_plan}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm text-slate-400">Capacity</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {stats?.is_free_plan ? `${stats?.total_leads ?? 0} / ${stats?.max_leads ?? 0}` : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>

            <FollowUpList completingId={completingFollowUpId} followUps={followUps.slice(0, 4)} onComplete={handleFollowUpComplete} />
          </div>
        </section>
      </div>
    );
  }

  function renderCurrentPage() {
    if (currentPage === "add-lead") {
      return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_340px]">
          <div ref={leadFormRef}>
            <LeadForm disabled={savingLead} editingLead={editingLead} onCancel={() => setEditingLead(null)} onSubmit={handleLeadSubmit} />
          </div>
          <div className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Tips</p>
            <h3 className="mt-2 font-display text-3xl text-sand">Make lead entry easy.</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Use the customer name and phone first. Extra details can be added later.</div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Set the source clearly so you know whether calls, ads, or referrals are working.</div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Add a follow-up date for every serious enquiry to reduce missed conversions.</div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === "leads") {
      const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null;

      return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <LeadTable
            leads={leads}
            onDelete={handleLeadDelete}
            onEdit={handleLeadEdit}
            onTrack={handleTrackLead}
            selectedLeadId={selectedLeadId}
            upgradeRequired={stats?.upgrade_required}
          />
          <LeadTrackerPanel lead={selectedLead} onAddInteraction={handleAddInteraction} saving={savingInteraction} />
        </div>
      );
    }

    if (currentPage === "followups") {
      return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <FollowUpList completingId={completingFollowUpId} followUps={followUps} onComplete={handleFollowUpComplete} />
          <div className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Reminder workflow</p>
            <h3 className="mt-2 font-display text-3xl text-sand">Daily follow-up rhythm</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Start the day by clearing overdue reminders.</div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Update leads after every call so the pipeline stays accurate.</div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Mark items done immediately to avoid duplicate follow-ups.</div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === "upgrade") {
      return <SubscriptionUpgrade currentPlan={profile?.current_plan} isFreePlan={stats?.is_free_plan} totalLeads={stats?.total_leads ?? 0} maxLeads={stats?.max_leads ?? 0} />;
    }

    return renderDashboardPage();
  }

  if (!token) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app px-4 py-10 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,140,74,0.25),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(76,181,177,0.18),_transparent_24%)]" />
        <AuthForm
          error={error}
          loading={authLoading}
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

  const activePage = pageCopy[currentPage];

  return (
    <main className="min-h-screen bg-app px-4 py-4 text-white md:px-6 md:py-6">
      <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface-card hidden flex-col justify-between gap-6 p-5 xl:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-slate-950 shadow-[0_16px_40px_rgba(248,140,74,0.35)]">
                {getInitials(profile?.business_name)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">Lead Grid</p>
                <h1 className="font-display text-2xl text-sand">{profile?.business_name}</h1>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/60">Workspace</p>
              <p className="mt-2 text-lg font-semibold text-white">{profile?.business_type}</p>
              <p className="mt-1 text-sm text-slate-300">Simple daily CRM for owners and staff who just need clear actions.</p>
            </div>

            <nav className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    currentPage === page.id ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentPage(page.id)}
                  type="button"
                >
                  {page.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Plan</p>
              <p className="mt-2 text-lg font-semibold uppercase text-accent-soft">{profile?.current_plan}</p>
              <p className="mt-1 text-sm text-slate-300">{stats?.is_free_plan ? `${stats?.total_leads ?? 0} of ${stats?.max_leads ?? 0} leads used` : "Unlimited lead capacity"}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10" onClick={() => loadAppData({ preserveSession: true })} type="button">
                Refresh
              </button>
              <button className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-300/40 hover:text-red-200" onClick={logout} type="button">
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="surface-card overflow-hidden p-5 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.36em] text-cyan-100/65">{activePage.eyebrow}</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-sand md:text-5xl">{activePage.title}</h2>
                <p className="mt-4 text-base text-slate-300">{activePage.description}</p>
                {api.isDemoMode ? (
                  <div className="mt-4 inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100">
                    Demo mode on GitHub Pages. Data is stored in this browser only.
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:hidden">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      currentPage === page.id ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                    onClick={() => setCurrentPage(page.id)}
                    type="button"
                  >
                    {page.short}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {error ? <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          {appLoading ? <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">Refreshing dashboard data...</div> : null}

          {renderCurrentPage()}
        </div>
      </div>
    </main>
  );
}
