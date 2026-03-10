function getStatusClasses(status) {
  if (status === "Converted") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Lost") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  if (status === "Contacted") {
    return "border-cyan-300/25 bg-cyan-400/10 text-cyan-100";
  }

  return "border-orange-300/25 bg-orange-400/10 text-orange-100";
}

function getPriorityClasses(priority) {
  if (priority === "High") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  if (priority === "Low") {
    return "border-slate-300/20 bg-slate-400/10 text-slate-100";
  }

  return "border-yellow-300/25 bg-yellow-400/10 text-yellow-100";
}

function formatDate(value) {
  if (!value) {
    return "No update";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function LeadTable({ leads, onEdit, onDelete, onTrack, selectedLeadId, upgradeRequired }) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Pipeline view</p>
          <h2 className="mt-2 font-display text-3xl text-sand">Lead pipeline</h2>
          <p className="mt-1 text-sm text-slate-300">Track every enquiry from first contact to conversion.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          {leads.length} active record{leads.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Pipeline</th>
              <th className="px-4 py-3">Feedback</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-300" colSpan="6">
                  No leads yet. Add your first lead to start building the pipeline.
                </td>
              </tr>
            ) : null}
            {leads.map((lead) => (
              <tr className="border-t border-white/10 transition hover:bg-white/[0.03]" key={lead.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.company_name || lead.email || "No company"}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-200">{lead.phone}</p>
                  <p className="text-xs text-slate-400">{lead.city || lead.email || "No email"}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(lead.status)}`}>{lead.status}</span>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(lead.priority)}`}>{lead.priority}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300">{lead.service_interest}</p>
                  <p className="mt-1 text-xs text-slate-400">Assigned: {lead.assigned_to || "Unassigned"} • Last touch: {formatDate(lead.last_contacted_at)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-200">{lead.client_feedback || "No feedback yet"}</p>
                  <p className="mt-1 text-xs text-slate-400">{lead.next_step || "No next step recorded"}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${selectedLeadId === lead.id ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100" : "border-white/10 text-white hover:bg-white/10"}`}
                      onClick={() => onTrack(lead)}
                      type="button"
                    >
                      Track
                    </button>
                    <button className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10" onClick={() => onEdit(lead)} type="button">
                      Edit
                    </button>
                    <button className="rounded-full border border-red-300/20 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/10" onClick={() => onDelete(lead.id)} type="button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {upgradeRequired ? <p className="border-t border-white/10 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">Lead limit reached on Free plan. Upgrade to Pro for unlimited leads.</p> : null}
    </div>
  );
}
