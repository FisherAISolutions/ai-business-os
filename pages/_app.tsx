// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "../styles/globals.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { supabase } from "../lib/supabaseClient";
import { AuthProvider } from "../lib/auth/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!mounted) return null;

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar session={session} />
          <main className="flex-1 overflow-y-auto p-6">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
