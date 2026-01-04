// components/LegalFormsBoard.tsx
import React, { useEffect, useMemo, useState } from "react";

type FormLink = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type Column = {
  id: string;
  title: string;
  items: FormLink[];
};

type Props = {
  storageKey: string;
  businessType?: string;
};

function safeParseSet(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((x) => typeof x === "string"));
    return new Set();
  } catch {
    return new Set();
  }
}

function makeId(prefix: string, title: string) {
  return `${prefix}:${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

/**
 * USA-only starter set.
 * We’re not “auto-detecting state forms” yet — we give high-signal official starting points
 * and a checklist workflow that feels real and usable.
 */
function getUSAColumns(businessType?: string): Column[] {
  const type = (businessType || "Business").toLowerCase();

  const fundamentals: FormLink[] = [
    {
      id: makeId("fundamentals", "Choose business name / availability"),
      title: "Check business name availability (state)",
      description: "Find your state's business registry search and confirm the name is available.",
      url: "https://www.sba.gov/business-guide/launch-your-business/choose-your-business-name",
    },
    {
      id: makeId("fundamentals", "Get EIN"),
      title: "Get an EIN (IRS)",
      description: "Free EIN application from the IRS (used for taxes, banking, payroll).",
      url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    },
    {
      id: makeId("fundamentals", "Open business bank account"),
      title: "Open a business bank account",
      description: "Most banks require EIN + formation docs (LLC/Corp) and an operating agreement.",
      url: "https://www.sba.gov/business-guide/launch-your-business/open-business-bank-account",
    },
  ];

  const formation: FormLink[] = [
    {
      id: makeId("formation", "Form your entity with your state"),
      title: "Form your entity with your state (LLC/Corp filing)",
      description:
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp). This is state-specific.",
      url: "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
    },
    {
      id: makeId("formation", "Operating agreement / bylaws"),
      title: type.includes("llc") ? "Create an Operating Agreement" : "Create bylaws / organizational docs",
      description:
        "Internal governance docs. Some banks ask for it; it also keeps things clean and professional.",
      url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure",
    },
    {
      id: makeId("formation", "Business licenses and permits"),
      title: "Check licenses & permits (federal/state/local)",
      description:
        "Depending on your industry and location, you may need permits or professional licensing.",
      url: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits",
    },
  ];

  const taxAndOps: FormLink[] = [
    {
      id: makeId("tax", "Register for state taxes"),
      title: "Register for state taxes",
      description: "Sales tax, payroll tax, and other state registrations (varies by state).",
      url: "https://www.sba.gov/business-guide/manage-your-business/pay-taxes",
    },
    {
      id: makeId("tax", "Understand federal taxes"),
      title: "Understand federal taxes (SBA)",
      description: "Learn what tax filings apply based on your business structure.",
      url: "https://www.sba.gov/business-guide/manage-your-business/pay-taxes",
    },
    {
      id: makeId("ops", "Basic contracts"),
      title: "Set up basic contracts (client/service agreement)",
      description: "Have a simple contract template ready before taking money from clients.",
      url: "https://www.sba.gov/business-guide/manage-your-business/prepare-your-business-contracts",
    },
  ];

  return [
    { id: "col-1", title: "Start Here", items: fundamentals },
    { id: "col-2", title: "Formation", items: formation },
    { id: "col-3", title: "Taxes + Ops", items: taxAndOps },
  ];
}

export default function LegalFormsBoard({ storageKey, businessType }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  // Load done
  useEffect(() => {
    if (typeof window === "undefined") return;
    setDone(safeParseSet(window.localStorage.getItem(storageKey)));
  }, [storageKey]);

  // Persist done
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(done)));
  }, [done, storageKey]);

  const columns = useMemo(() => getUSAColumns(businessType), [businessType]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openAndMark(item: FormLink) {
    // Mark immediately; link opens in new tab
    toggle(item.id);
    window.open(item.url, "_blank", "noopener,noreferrer");
  }

  const total = columns.reduce((acc, c) => acc + c.items.length, 0);
  const completed = Array.from(done).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Legal Forms & Official Links</h2>
          <p className="mt-1 text-sm text-white/60">
            USA starter workflow. Click a card to open the official page and mark it done.
          </p>
          {businessType ? (
            <p className="mt-1 text-xs text-white/50">
              Tailored to: <span className="text-white/70">{businessType}</span>
            </p>
          ) : null}
        </div>

        <div className="w-full sm:w-[320px]">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progress</span>
            <span>
              {Math.min(completed, total)}/{total} ({pct}%)
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal board */}
      <div className="mt-5 overflow-x-auto pb-3">
        <div className="flex gap-4 min-w-max">
          {columns.map((col) => (
            <div
              key={col.id}
              className="w-[280px] sm:w-[340px] shrink-0 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">{col.title}</h3>
                <span className="text-xs text-white/50">
                  {col.items.filter((i) => done.has(i.id)).length}/{col.items.length}
                </span>
              </div>

              <div className="space-y-3">
                {col.items.map((item) => {
                  const isDone = done.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={[
                        "rounded-xl border p-3 transition",
                        isDone
                          ? "border-emerald-400/30 bg-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold",
                                isDone
                                  ? "border-emerald-400/40 text-emerald-200 bg-emerald-500/10"
                                  : "border-white/15 text-white/60 bg-white/5",
                              ].join(" ")}
                            >
                              {isDone ? "✓" : "•"}
                            </span>
                            <p className="text-sm font-semibold text-white/90 truncate">
                              {item.title}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-white/60">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <button
                          onClick={() => openAndMark(item)}
                          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400"
                        >
                          Open link
                        </button>

                        <button
                          onClick={() => toggle(item.id)}
                          className={[
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                            isDone
                              ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                              : "bg-white/10 text-white/70 hover:bg-white/15",
                          ].join(" ")}
                        >
                          {isDone ? "Mark not done" : "Mark done"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
