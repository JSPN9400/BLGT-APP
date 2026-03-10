import { useEffect, useState } from "react";

const defaultInteraction = {
  channel: "Call",
  direction: "Outbound",
  outcome: "Follow Up",
  message: "",
  client_response: "",
  contacted_at: ""
};

function formatDateTime(value) {
  if (!value) {
    return "Not contacted yet";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function LeadTrackerPanel({ lead, onAddInteraction, saving }) {
  const [form, setForm] = useState(defaultInteraction);

  useEffect(() => {
    setForm(defaultInteraction);
  }, [lead?.id]);

  if (!lead) {
    return (
      <div className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Lead tracking</p>
        <h3 className="mt-2 font-display text-3xl text-sand">Open one lead</h3>
        <p className="mt-3 text-sm text-slate-300">Select a lead from the list to review contact history, customer feedback, and next action.</p>
      </div>
    );
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onAddInteraction(lead.id, form);
    setForm(defaultInteraction);
  }

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Lead tracking</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-display text-3xl text-sand">{lead.name}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {lead.company_name || "Direct customer"}{lead.city ? ` • ${lead.city}` : ""}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">{lead.status}</span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phone</p>
            <p className="mt-2 text-sm text-white">{lead.phone}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
            <p className="mt-2 text-sm text-white">{lead.email || "No email shared"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Assigned to</p>
            <p className="mt-2 text-sm text-white">{lead.assigned_to || "Unassigned"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Last contacted</p>
            <p className="mt-2 text-sm text-white">{formatDateTime(lead.last_contacted_at)}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Client feedback</p>
            <p className="mt-2 text-sm text-slate-200">{lead.client_feedback || "No feedback captured yet."}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Next step</p>
            <p className="mt-2 text-sm text-slate-200">{lead.next_step || "No next action recorded yet."}</p>
          </div>
          {lead.conversion_notes ? (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Conversion notes</p>
              <p className="mt-2 text-sm text-emerald-50">{lead.conversion_notes}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Communication log</p>
        <h3 className="mt-2 font-display text-3xl text-sand">Track messages and calls</h3>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <select className="app-input" name="channel" onChange={handleChange} value={form.channel}>
              <option>Call</option>
              <option>WhatsApp</option>
              <option>Email</option>
              <option>SMS</option>
              <option>Meeting</option>
              <option>Other</option>
            </select>
            <select className="app-input" name="direction" onChange={handleChange} value={form.direction}>
              <option>Outbound</option>
              <option>Inbound</option>
            </select>
            <select className="app-input" name="outcome" onChange={handleChange} value={form.outcome}>
              <option>No Response</option>
              <option>Interested</option>
              <option>Follow Up</option>
              <option>Negotiating</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <input className="app-input" name="contacted_at" onChange={handleChange} type="datetime-local" value={form.contacted_at} />
          </div>
          <textarea className="app-input min-h-24 w-full" name="message" onChange={handleChange} placeholder="What did your team send or say?" value={form.message} />
          <textarea className="app-input min-h-24 w-full" name="client_response" onChange={handleChange} placeholder="What did the client say?" value={form.client_response} />
          <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-70" disabled={saving} type="submit">
            {saving ? "Saving..." : "Add interaction"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {(lead.interactions || []).length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              No communication history yet. Add the first call, email, or WhatsApp update here.
            </div>
          ) : null}
          {(lead.interactions || []).map((interaction) => (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4" key={interaction.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white">{interaction.channel}</span>
                <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs text-cyan-100">{interaction.direction}</span>
                <span className="rounded-full border border-orange-300/20 px-3 py-1 text-xs text-orange-100">{interaction.outcome}</span>
                <span className="text-xs text-slate-400">{formatDateTime(interaction.contacted_at)}</span>
              </div>
              {interaction.message ? <p className="mt-3 text-sm text-slate-200">Team note: {interaction.message}</p> : null}
              {interaction.client_response ? <p className="mt-2 text-sm text-slate-300">Client said: {interaction.client_response}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
