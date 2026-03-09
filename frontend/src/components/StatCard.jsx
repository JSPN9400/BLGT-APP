export function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-sand">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-300">{hint}</p> : null}
    </div>
  );
}
