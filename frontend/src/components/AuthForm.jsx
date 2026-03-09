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
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Local Business CRM</p>
        <h1 className="mt-3 font-display text-4xl text-sand">{mode === "signup" ? "Create account" : "Welcome back"}</h1>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-3" name="email" type="email" placeholder="Email" value={form.email} onChange={updateField} required />
        <input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-3" name="password" type="password" placeholder="Password" value={form.password} onChange={updateField} required />
        {mode === "signup" ? (
          <>
            <input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-3" name="business_name" placeholder="Business name" value={form.business_name} onChange={updateField} required />
            <input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-3" name="business_type" placeholder="Business type" value={form.business_type} onChange={updateField} required />
          </>
        ) : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button className="w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
        </button>
      </form>
      <button className="mt-6 text-sm text-orange-200 underline" onClick={onToggleMode} type="button">
        {mode === "signup" ? "Already have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
  );
}
