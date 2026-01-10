// lib/supabaseServer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies).map(([name, value]) => ({ name, value: value ?? "" }));
      },
      setAll(cookies) {
        // Set cookies on the response so the browser stores them
        cookies.forEach(({ name, value, options }) => {
          // Next API res has setHeader; SSR helper expects cookie serialization,
          // but createServerClient handles it via this callback structure.
          // @supabase/ssr passes standard cookie options.
          const cookie = require("cookie");
          const serialized = cookie.serialize(name, value, options);
          const prev = res.getHeader("Set-Cookie");
          const next = Array.isArray(prev) ? prev.concat(serialized) : prev ? [String(prev), serialized] : [serialized];
          res.setHeader("Set-Cookie", next);
        });
      },
    },
  });
}
