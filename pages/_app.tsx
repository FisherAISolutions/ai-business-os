// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthProvider } from "../lib/auth/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
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
