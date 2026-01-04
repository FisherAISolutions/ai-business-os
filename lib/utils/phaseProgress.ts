// lib/utils/phaseProgress.ts
// Client-only phase progress tracking using localStorage.
// Progress is tied to the current selected idea so "Done" doesn't stick forever
// when users switch to a different business idea.

export type PhaseId = "phase1" | "phase2" | "phase3" | "phase4" | "phase5";

export type PhaseProgressState = Record<PhaseId, { completed: boolean; updatedAt: string | null }>;

export const PHASE_PROGRESS_KEY = "ai-business-os:phase-progress";
export const PHASE_PROGRESS_EVENT = "ai-business-os:phase-progress-updated";

// Keys already used by your app
export const SELECTION_KEY = "ai-business-os:selected-idea";

// NEW: used to detect when the user changes the selected idea
const PROGRESS_CONTEXT_KEY = "ai-business-os:phase-progress:context";

function nowIso() {
  return new Date().toISOString();
}

function defaultState(): PhaseProgressState {
  return {
    phase1: { completed: false, updatedAt: null },
    phase2: { completed: false, updatedAt: null },
    phase3: { completed: false, updatedAt: null },
    phase4: { completed: false, updatedAt: null },
    phase5: { completed: false, updatedAt: null },
  };
}

function safeParse(raw: string | null): PhaseProgressState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const out = defaultState();
    (Object.keys(out) as PhaseId[]).forEach((k) => {
      const node = (parsed as any)[k];
      if (node && typeof node === "object") {
        out[k] = {
          completed: Boolean((node as any).completed),
          updatedAt: typeof (node as any).updatedAt === "string" ? (node as any).updatedAt : null,
        };
      }
    });

    return out;
  } catch {
    return null;
  }
}

function emitProgressUpdated() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(PHASE_PROGRESS_EVENT));
  } catch {
    // ignore
  }
}

function getSelectionContext(): string | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SELECTION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    // Create a stable "fingerprint" that changes when the user changes ideas
    const founderLoc = parsed?.founder?.location || "";
    const ideaName = parsed?.idea?.name || "";
    const createdAt = parsed?.createdAt || "";
    const savedAt = parsed?.savedAt || "";

    // Enough to detect meaningful changes without relying on random IDs
    return JSON.stringify({
      ideaName,
      founderLoc,
      createdAt,
      savedAt,
    });
  } catch {
    return null;
  }
}

function ensureContextIsCurrent(state: PhaseProgressState): PhaseProgressState {
  if (typeof window === "undefined") return state;

  const currentCtx = getSelectionContext();
  const storedCtx = window.localStorage.getItem(PROGRESS_CONTEXT_KEY);

  // If we have a selection and the context changed, reset phases 2–5.
  // Keep phase1 inferred by selection.
  if (currentCtx && storedCtx && storedCtx !== currentCtx) {
    const reset = defaultState();

    // Phase 1 is complete if an idea is selected
    reset.phase1 = { completed: true, updatedAt: nowIso() };

    window.localStorage.setItem(PHASE_PROGRESS_KEY, JSON.stringify(reset));
    window.localStorage.setItem(PROGRESS_CONTEXT_KEY, currentCtx);
    emitProgressUpdated();
    return reset;
  }

  // If we have a selection and no stored context yet, set it.
  if (currentCtx && !storedCtx) {
    window.localStorage.setItem(PROGRESS_CONTEXT_KEY, currentCtx);
  }

  return state;
}

export function readPhaseProgress(): PhaseProgressState {
  if (typeof window === "undefined") return defaultState();

  const stored = safeParse(window.localStorage.getItem(PHASE_PROGRESS_KEY));
  let state = stored ?? defaultState();

  // Reset if the user switched ideas (context changed)
  state = ensureContextIsCurrent(state);

  // Phase 1 is "done" if an idea is selected.
  const hasSelection = Boolean(window.localStorage.getItem(SELECTION_KEY));
  if (hasSelection && !state.phase1.completed) {
    state.phase1 = { completed: true, updatedAt: state.phase1.updatedAt ?? nowIso() };
    window.localStorage.setItem(PHASE_PROGRESS_KEY, JSON.stringify(state));

    // Also store context if missing
    const ctx = getSelectionContext();
    if (ctx) window.localStorage.setItem(PROGRESS_CONTEXT_KEY, ctx);

    emitProgressUpdated();
  }

  return state;
}

export function writePhaseProgress(state: PhaseProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PHASE_PROGRESS_KEY, JSON.stringify(state));

  // Keep context up to date whenever we write progress
  const ctx = getSelectionContext();
  if (ctx) window.localStorage.setItem(PROGRESS_CONTEXT_KEY, ctx);

  emitProgressUpdated();
}

export function setPhaseCompleted(phase: PhaseId, completed: boolean) {
  if (typeof window === "undefined") return;

  const state = readPhaseProgress();
  state[phase] = { completed, updatedAt: nowIso() };
  writePhaseProgress(state);
}

export function getRecommendedPhase(state?: PhaseProgressState): PhaseId {
  const s = state ?? (typeof window === "undefined" ? defaultState() : readPhaseProgress());

  if (!s.phase1.completed) return "phase1";
  if (!s.phase2.completed) return "phase2";
  if (!s.phase3.completed) return "phase3";
  if (!s.phase4.completed) return "phase4";
  return "phase5";
}
