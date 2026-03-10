export function SubscriptionUpgrade({ currentPlan, isFreePlan, totalLeads, maxLeads }) {
  const usagePercent = isFreePlan && maxLeads ? Math.min((totalLeads / maxLeads) * 100, 100) : 100;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Subscription plans</p>
            <h3 className="mt-2 font-display text-3xl text-sand">Simple pricing for local teams</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            Current plan: <span className="font-semibold uppercase text-accent-soft">{currentPlan}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Free</p>
            <h4 className="mt-3 text-3xl font-semibold text-white">Rs 0</h4>
            <p className="mt-2 text-sm text-slate-300">Best for very small businesses getting started with structured lead tracking.</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li>Up to 50 leads</li>
              <li>Dashboard stats</li>
              <li>Lead list and follow-up reminders</li>
              <li>Sponsored dashboard slot</li>
            </ul>
            <button className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold ${isFreePlan ? "border border-white/10 bg-white/5 text-slate-300" : "bg-white text-slate-950"}`} type="button">
              {isFreePlan ? "Current plan" : "Downgrade"}
            </button>
          </article>

          <article className="rounded-[28px] border border-accent/40 bg-[linear-gradient(180deg,rgba(248,115,22,0.18),rgba(255,255,255,0.04))] p-5 shadow-[0_24px_70px_rgba(248,115,22,0.18)]">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.22em] text-orange-100">Pro</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-slate-950">Recommended</span>
            </div>
            <h4 className="mt-3 text-3xl font-semibold text-white">Rs 999/mo</h4>
            <p className="mt-2 text-sm text-orange-50/90">For growing teams that want unlimited lead storage and a cleaner branded workspace.</p>
            <ul className="mt-5 space-y-3 text-sm text-orange-50/90">
              <li>Unlimited leads</li>
              <li>No ads on dashboard</li>
              <li>Company logo slot</li>
              <li>Better fit for marketing-heavy businesses</li>
            </ul>
            <button className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold ${isFreePlan ? "bg-white text-slate-950" : "border border-white/20 bg-white/10 text-white"}`} type="button">
              {isFreePlan ? "Upgrade to Pro" : "Current plan"}
            </button>
          </article>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Usage</p>
          <h3 className="mt-2 font-display text-3xl text-sand">Lead capacity</h3>
          <p className="mt-3 text-sm text-slate-300">
            {isFreePlan ? "You are currently using the free plan lead allowance." : "You have unlimited capacity on Pro."}
          </p>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-slate-400">Stored leads</p>
            <p className="mt-2 text-3xl font-semibold text-white">{isFreePlan ? `${totalLeads} / ${maxLeads}` : `${totalLeads}+`}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Why upgrade</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Remove distractions from the dashboard for staff and owners.</div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Support higher lead volume during promotions and ad campaigns.</div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">Add company branding to make the workspace feel like part of the business.</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
