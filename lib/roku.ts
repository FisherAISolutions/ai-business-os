// lib/roku.ts
export type RokuEvent = "PAGE_VIEW" | "PURCHASE" | "INITIATE_CHECKOUT" | "SUBSCRIBE";

declare global {
  interface Window {
    rkp?: (...args: any[]) => void;
  }
}

export function rokuEvent(ev: RokuEvent) {
  if (typeof window === "undefined") return;

  // If loader hasn’t attached yet, ignore (we also retry from router hook below)
  if (typeof window.rkp !== "function") return;

  try {
    window.rkp("event", ev);
  } catch {
    // ignore
  }
}
