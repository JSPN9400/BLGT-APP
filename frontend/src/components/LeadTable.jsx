export function LeadTable({ leads, onEdit, onDelete, upgradeRequired }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr className="border-t border-white/10" key={lead.id}>
                <td className="px-4 py-3">
                  <p>{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.email || "No email"}</p>
                </td>
                <td className="px-4 py-3">{lead.phone}</td>
                <td className="px-4 py-3">{lead.service_interest}</td>
                <td className="px-4 py-3">{lead.lead_source}</td>
                <td className="px-4 py-3">{lead.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button className="text-orange-200 underline" onClick={() => onEdit(lead)} type="button">
                      Edit
                    </button>
                    <button className="text-red-300 underline" onClick={() => onDelete(lead.id)} type="button">
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
