// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createSupabaseServerClient(req, res);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(200).json({ user: null, subscription: { active: false, status: null, currentPeriodEnd: null } });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_current_period_end")
    .eq("id", user.id)
    .maybeSingle();

  const status = profile?.subscription_status ?? null;
  const active = status === "active" || status === "trialing";

  return res.status(200).json({
    user: { id: user.id, email: user.email },
    subscription: {
      active,
      status,
      currentPeriodEnd: profile?.subscription_current_period_end ?? null,
    },
  });
}
