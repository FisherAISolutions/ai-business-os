// lib/roku.ts
declare global {
  interface Window {
    rkp?: (...args: any[]) => void;
  }
}

export function rokuEvent(eventName: "PAGE_VIEW" | "PURCHASE") {
  if (typeof window === "undefined") return;
  if (typeof window.rkp !== "function") return;

  try {
    window.rkp("event", eventName);
  } catch {
    // ignore
  }
}

// Prevent duplicate PURCHASE fires on refresh
export function firePurchaseOnce(storageKey = "roku_purchase_fired") {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(storageKey)) return;

  rokuEvent("PURCHASE");
  window.localStorage.setItem(storageKey, "1");
}
