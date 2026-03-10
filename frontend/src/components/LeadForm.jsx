import { useEffect, useState } from "react";

const defaultLead = {
  name: "",
  phone: "",
  email: "",
  company_name: "",
  city: "",
  service_interest: "",
  lead_source: "",
  assigned_to: "",
  priority: "Medium",
  budget_amount: "",
  status: "New",
  last_contacted_at: "",
  last_contact_summary: "",
  client_feedback: "",
  next_step: "",
  conversion_notes: "",
  notes: "",
  follow_up_date: ""
};

export function LeadForm({ onSubmit, editingLead, onCancel, disabled }) {
  const [form, setForm] = useState(defaultLead);

  useEffect(() => {
    if (editingLead) {
      setForm({ ...editingLead, follow_up_date: "" });
      return;
    }
    setForm(defaultLead);
  }, [editingLead]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
    if (!editingLead) {
      setForm(defaultLead);
    }
  }

  return (
    <form className="surface-card space-y-5 p-6 md:p-7" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Lead editor</p>
          <h2 className="mt-2 font-display text-3xl text-sand">{editingLead ? "Edit lead" : "Add lead"}</h2>
        </div>
        {editingLead ? (
          <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5" onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
      </div>
      <p className="text-sm text-slate-300">
        {editingLead ? "Update the lead details and save your changes." : "Capture a new enquiry and optionally schedule the first follow-up date."}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="app-input" name="name" placeholder="Lead name" value={form.name} onChange={handleChange} required />
        <input className="app-input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input className="app-input" name="email" placeholder="Email (optional)" value={form.email || ""} onChange={handleChange} />
        <input className="app-input" name="company_name" placeholder="Company / project name" value={form.company_name || ""} onChange={handleChange} />
        <input className="app-input" name="city" placeholder="City / area" value={form.city || ""} onChange={handleChange} />
        <input className="app-input" name="service_interest" placeholder="Service interest" value={form.service_interest} onChange={handleChange} required />
        <input className="app-input" name="lead_source" placeholder="Lead source" value={form.lead_source} onChange={handleChange} required />
        <input className="app-input" name="assigned_to" placeholder="Assigned staff member" value={form.assigned_to || ""} onChange={handleChange} />
        <select className="app-input" name="priority" value={form.priority} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input className="app-input" min="0" name="budget_amount" placeholder="Budget amount" type="number" value={form.budget_amount || ""} onChange={handleChange} />
        <select className="app-input" name="status" value={form.status} onChange={handleChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
          <option>Lost</option>
        </select>
        <input className="app-input" name="last_contacted_at" type="datetime-local" value={form.last_contacted_at || ""} onChange={handleChange} />
        <input className="app-input" name="follow_up_date" type="date" value={form.follow_up_date || ""} onChange={handleChange} />
      </div>
      <textarea className="app-input min-h-24 w-full" name="last_contact_summary" placeholder="Last call or message summary" value={form.last_contact_summary || ""} onChange={handleChange} />
      <textarea className="app-input min-h-24 w-full" name="client_feedback" placeholder="What did the client say?" value={form.client_feedback || ""} onChange={handleChange} />
      <textarea className="app-input min-h-24 w-full" name="next_step" placeholder="Next action for the team" value={form.next_step || ""} onChange={handleChange} />
      <textarea className="app-input min-h-24 w-full" name="conversion_notes" placeholder="Conversion or loss reason" value={form.conversion_notes || ""} onChange={handleChange} />
      <textarea className="app-input min-h-32 w-full" name="notes" placeholder="Notes, customer need, budget, urgency, callback details" value={form.notes || ""} onChange={handleChange} />
      <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-slate-950 shadow-[0_18px_40px_rgba(248,140,74,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70" disabled={disabled} type="submit">
        {disabled ? "Saving..." : editingLead ? "Save changes" : "Create lead"}
      </button>
    </form>
  );
}
