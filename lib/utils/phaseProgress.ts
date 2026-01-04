// lib/utils/phaseProgress.ts
// Lightweight, client-only phase progress tracking (localStorage).
// This intentionally avoids any app-wide refactors and can be expanded later.

export type PhaseId = "phase1" | "phase2" | "phase3" | "phase4" | "phase5";

export type PhaseProgressState = Record<PhaseId, { completed: boolean; updatedAt: string | null }>;

export const PHASE_PROGRESS_KEY = "ai-business-os:phase-progress";
export const SELECTION_KEY = "ai-business-os:selected-idea";
export const LEGAL_PROGRESS_KEY = "ai-business-os:legal-steps:done:usa";

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

export function readPhaseProgress(): PhaseProgressState {
  if (typeof window === "undefined") return defaultState();

  const stored = safeParse(window.localStorage.getItem(PHASE_PROGRESS_KEY));
  const state = stored ?? defaultState();

  // Phase 1 can always be inferred from having a selected idea.
  const hasSelection = Boolean(window.localStorage.getItem(SELECTION_KEY));
  if (hasSelection && !state.phase1.completed) {
    state.phase1 = { completed: true, updatedAt: state.phase1.updatedAt ?? nowIso() };
    window.localStorage.setItem(PHASE_PROGRESS_KEY, JSON.stringify(state));
  }

  return state;
}

export function writePhaseProgress(state: PhaseProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PHASE_PROGRESS_KEY, JSON.stringify(state));
}

export function setPhaseCompleted(phase: PhaseId, completed: boolean) {
  if (typeof window === "undefined") return;

  const state = readPhaseProgress();
  state[phase] = { completed, updatedAt: nowIso() };
  writePhaseProgress(state);
}

export function getRecommendedPhase(state?: PhaseProgressState): PhaseId {
  const s = state ?? readPhaseProgress();

  if (!s.phase1.completed) return "phase1";
  if (!s.phase2.completed) return "phase2";
  if (!s.phase3.completed) return "phase3";
  if (!s.phase4.completed) return "phase4";
  return "phase5";
}

export function safeParseStringArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function readLegalDoneSteps(): string[] {
  if (typeof window === "undefined") return [];
  return safeParseStringArray(window.localStorage.getItem(LEGAL_PROGRESS_KEY));
}
