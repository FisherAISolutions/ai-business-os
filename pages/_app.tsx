import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 overflow-auto">
          <Component {...pageProps} />
        </main>
      </div>
      <Analytics />
    </div>
  );
}
