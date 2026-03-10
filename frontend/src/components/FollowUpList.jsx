function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function FollowUpList({ followUps, onComplete, completingId }) {
  return (
    <div className="surface-card h-fit p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Action queue</p>
      <h2 className="mt-2 font-display text-3xl text-sand">Follow-ups</h2>
      <p className="mt-2 text-sm text-slate-300">Keep pending conversations moving before they go cold.</p>
      <div className="mt-4 space-y-3">
        {followUps.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
            No follow-ups scheduled yet.
          </div>
        ) : null}
        {followUps.map((followUp) => (
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4" key={followUp.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className={`mt-1 h-3 w-3 rounded-full ${followUp.is_completed ? "bg-emerald-400" : "bg-accent"}`} />
                <div>
                  <p className="font-semibold text-white">{followUp.lead_name}</p>
                  <p className="text-sm text-slate-300">Due: {formatDate(followUp.due_date)}</p>
                  {followUp.note ? <p className="mt-2 text-sm text-slate-400">{followUp.note}</p> : null}
                </div>
              </div>
              {!followUp.is_completed ? (
                <button className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-200 disabled:opacity-60" disabled={completingId === followUp.id} onClick={() => onComplete(followUp.id)} type="button">
                  {completingId === followUp.id ? "Updating..." : "Mark done"}
                </button>
              ) : (
                <span className="text-xs text-emerald-300">Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
