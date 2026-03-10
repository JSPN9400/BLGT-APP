import { useEffect, useState } from "react";

const initialSignup = {
  email: "",
  password: "",
  business_name: "",
  business_type: ""
};

const initialLogin = {
  email: "",
  password: ""
};

export function AuthForm({ mode, onSubmit, loading, error, onToggleMode }) {
  const [form, setForm] = useState(mode === "signup" ? initialSignup : initialLogin);

  useEffect(() => {
    setForm(mode === "signup" ? initialSignup : initialLogin);
  }, [mode]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(3,10,18,0.6)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
      <div className="hidden bg-[linear-gradient(180deg,rgba(248,140,74,0.18),rgba(76,181,177,0.08))] p-10 md:flex md:flex-col md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-100/75">Lead Grid</p>
          <h1 className="mt-5 max-w-md font-display text-5xl leading-tight text-sand">A real lead desk for local business teams.</h1>
          <p className="mt-5 max-w-md text-base text-slate-200">
            Track every enquiry, set follow-ups, and stop working from scattered chats and memory.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm text-slate-300">Capture leads instantly</p>
            <p className="mt-1 text-lg font-semibold text-white">Name, source, service, notes, follow-up.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm text-slate-300">Daily action view</p>
            <p className="mt-1 text-lg font-semibold text-white">See what is due today and what needs attention.</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 md:p-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">Local Business CRM</p>
          <h2 className="mt-3 font-display text-4xl text-sand">{mode === "signup" ? "Create account" : "Welcome back"}</h2>
          <p className="mt-2 text-sm text-slate-300">
            {mode === "signup" ? "Set up your workspace and start capturing leads." : "Log in to manage your live pipeline."}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input className="app-input w-full" name="email" type="email" placeholder="Email" value={form.email} onChange={updateField} required />
          <input className="app-input w-full" name="password" type="password" placeholder="Password" value={form.password} onChange={updateField} required />
        {mode === "signup" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="app-input w-full" name="business_name" placeholder="Business name" value={form.business_name} onChange={updateField} required />
              <input className="app-input w-full" name="business_type" placeholder="Business type" value={form.business_type} onChange={updateField} required />
            </div>
        ) : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
        </button>
        </form>
        <button className="mt-6 text-sm text-accent-soft underline underline-offset-4" onClick={onToggleMode} type="button">
          {mode === "signup" ? "Already have an account? Login" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
