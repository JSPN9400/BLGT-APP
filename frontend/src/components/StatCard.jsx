export function StatCard({ label, value, hint }) {
  return (
    <div className="surface-card relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
      <p className="relative text-xs uppercase tracking-[0.28em] text-cyan-100/65">{label}</p>
      <p className="relative mt-5 text-4xl font-semibold text-sand">{value}</p>
      {hint ? <p className="relative mt-3 text-sm leading-6 text-slate-300">{hint}</p> : null}
    </div>
  );
}
