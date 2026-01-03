import React, { useMemo, useState } from "react";
import type { FounderProfile } from "../types/business";
import { onboardingQuestions } from "../lib/onboarding/questions";

type Props = {
  onSubmit: (profile: FounderProfile) => void;
  disabled?: boolean;
  defaultValue?: Partial<FounderProfile>;
};

type FormState = {
  [K in keyof FounderProfile]?: any;
};

function clampNumber(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function buildDefaults(defaultValue?: Partial<FounderProfile>): FounderProfile {
  const base: FounderProfile = {
    skills: ["Marketing", "Tech / Development"],
    experienceLevel: "intermediate",
    budget: 2000,
    timePerWeek: 10,
    riskTolerance: "medium",
    goals: "side_hustle",
    location: "USA",
  };

  return {
    skills: defaultValue?.skills ?? base.skills,
    experienceLevel: defaultValue?.experienceLevel ?? base.experienceLevel,
    budget: typeof defaultValue?.budget === "number" ? defaultValue.budget : base.budget,
    timePerWeek: typeof defaultValue?.timePerWeek === "number" ? defaultValue.timePerWeek : base.timePerWeek,
    riskTolerance: defaultValue?.riskTolerance ?? base.riskTolerance,
    goals: defaultValue?.goals ?? base.goals,
    location: (defaultValue?.location ?? base.location).toString(),
  };
}

export default function FounderIntake({ onSubmit, disabled, defaultValue }: Props) {
  const defaults = useMemo(() => buildDefaults(defaultValue), [defaultValue]);

  const [form, setForm] = useState<FormState>({
    skills: defaults.skills,
    experienceLevel: defaults.experienceLevel,
    budget: defaults.budget,
    timePerWeek: defaults.timePerWeek,
    riskTolerance: defaults.riskTolerance,
    goals: defaults.goals,
    location: defaults.location,
  });

  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FounderProfile>(key: K, value: FounderProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: keyof FounderProfile, option: string) {
    const current = (form[key] as string[]) || [];
    const next = current.includes(option)
      ? current.filter((x) => x !== option)
      : [...current, option];
    setForm((prev) => ({ ...prev, [key]: next }));
  }

  function validate(profile: FounderProfile): string | null {
    if (!profile.skills || profile.skills.length < 1) return "Please select at least one skill.";
    if (!profile.experienceLevel) return "Please select your experience level.";
    if (profile.budget < 0) return "Budget cannot be negative.";
    if (profile.timePerWeek <= 0) return "Time per week must be at least 1 hour.";
    if (!profile.riskTolerance) return "Please select your risk tolerance.";
    if (!profile.goals) return "Please select your goal.";
    if (!profile.location || !profile.location.trim()) return "Please enter your location.";
    return null;
  }

  function buildProfile(): FounderProfile {
    const budgetNum = clampNumber(Number(form.budget ?? 0), 0, 1_000_000);
    const timeNum = clampNumber(Number(form.timePerWeek ?? 0), 0, 80);

    return {
      skills: (form.skills as string[])?.length ? (form.skills as string[]) : ["Generalist"],
      experienceLevel: form.experienceLevel as FounderProfile["experienceLevel"],
      budget: Math.floor(budgetNum),
      timePerWeek: Math.floor(timeNum),
      riskTolerance: form.riskTolerance as FounderProfile["riskTolerance"],
      goals: form.goals as FounderProfile["goals"],
      location: String(form.location ?? "").trim() || "USA",
    };
  }

  function handleSubmit() {
    const profile = buildProfile();
    const err = validate(profile);
    setError(err);
    if (err) return;
    onSubmit(profile);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Founder Intake</h2>
          <p className="mt-1 text-sm text-white/60">
            These questions drive your personalized viability report.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
        >
          Generate Ideas →
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {onboardingQuestions.map((q) => (
          <div key={String(q.key)} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-semibold text-white/80">{q.question}</div>

            {q.type === "text" && (
              <input
                disabled={disabled}
                value={String(form[q.key] ?? "")}
                onChange={(e) => setField(q.key, e.target.value as any)}
                placeholder={(q as any).placeholder ?? ""}
                className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
              />
            )}

            {q.type === "number" && (
              <input
                disabled={disabled}
                type="number"
                value={Number(form[q.key] ?? 0)}
                onChange={(e) => setField(q.key, Number(e.target.value) as any)}
                placeholder={(q as any).placeholder ?? ""}
                className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
              />
            )}

            {q.type === "select" && (
              <select
                disabled={disabled}
                value={String(form[q.key] ?? "")}
                onChange={(e) => setField(q.key, e.target.value as any)}
                className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
              >
                {(q.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {q.type === "multiselect" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(q.options ?? []).map((opt) => {
                  const selected = ((form[q.key] as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleMulti(q.key, opt)}
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold transition",
                        selected
                          ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-200"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
                        disabled ? "opacity-60" : "",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {(q as any).helperText && (
              <div className="mt-3 text-xs text-white/50">{(q as any).helperText}</div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
        >
          Generate Ideas →
        </button>
      </div>
    </div>
  );
}
