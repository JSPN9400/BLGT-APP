export function FollowUpList({ followUps, onComplete }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-panel/70 p-6">
      <h2 className="font-display text-2xl text-sand">Follow-ups</h2>
      <div className="mt-4 space-y-3">
        {followUps.length === 0 ? <p className="text-slate-300">No follow-ups scheduled yet.</p> : null}
        {followUps.map((followUp) => (
          <div className="rounded-2xl border border-white/10 bg-ink/70 p-4" key={followUp.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{followUp.lead_name}</p>
                <p className="text-sm text-slate-300">Due: {followUp.due_date}</p>
                {followUp.note ? <p className="mt-2 text-sm text-slate-400">{followUp.note}</p> : null}
              </div>
              {!followUp.is_completed ? (
                <button className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-200" onClick={() => onComplete(followUp.id)} type="button">
                  Mark done
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
