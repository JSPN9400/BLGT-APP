import { useEffect, useState } from "react";

const defaultLead = {
  name: "",
  phone: "",
  email: "",
  service_interest: "",
  lead_source: "",
  status: "New",
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
    <form className="space-y-4 rounded-3xl border border-white/10 bg-panel/80 p-6" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-sand">{editingLead ? "Edit lead" : "Add lead"}</h2>
        {editingLead ? (
          <button className="text-sm text-orange-200 underline" onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="name" placeholder="Lead name" value={form.name} onChange={handleChange} required />
        <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="email" placeholder="Email (optional)" value={form.email || ""} onChange={handleChange} />
        <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="service_interest" placeholder="Service interest" value={form.service_interest} onChange={handleChange} required />
        <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="lead_source" placeholder="Lead source" value={form.lead_source} onChange={handleChange} required />
        <select className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="status" value={form.status} onChange={handleChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>
        {!editingLead ? <input className="rounded-2xl border border-white/10 bg-ink px-4 py-3" name="follow_up_date" type="date" value={form.follow_up_date || ""} onChange={handleChange} /> : null}
      </div>
      <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-ink px-4 py-3" name="notes" placeholder="Notes" value={form.notes || ""} onChange={handleChange} />
      <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-slate-950" disabled={disabled} type="submit">
        {editingLead ? "Save changes" : "Create lead"}
      </button>
    </form>
  );
}
