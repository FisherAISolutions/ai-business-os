// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthProvider } from "../lib/auth/AuthContext";
import { rokuEvent } from "../lib/roku";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Fire once on initial load
    rokuEvent("PAGE_VIEW");

    // Fire on route changes
    const onRoute = () => {
      // small delay helps ensure loader is attached
      setTimeout(() => rokuEvent("PAGE_VIEW"), 50);
    };

    router.events.on("routeChangeComplete", onRoute);
    return () => {
      router.events.off("routeChangeComplete", onRoute);
    };
  }, [router.events]);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
