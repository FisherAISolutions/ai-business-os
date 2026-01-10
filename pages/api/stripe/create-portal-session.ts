// pages/api/stripe/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

function getBaseUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers.host;
  return `${proto}://${host}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const supabase = createSupabaseServerClient(req, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({ error: "Not signed in" });

    const baseUrl = getBaseUrl(req);

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    const customerId = profile?.stripe_customer_id;
    if (!customerId) return res.status(400).json({ error: "No Stripe customer on profile" });

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/account`,
    });

    return res.status(200).json({ url: portal.url });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message ?? "Portal session failed" });
  }
}
