// pages/api/stripe/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

function getSiteUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) return envUrl.replace(/\/$/, "");

  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers["x-forwarded-protocol"] as string) ||
    "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host;
  return `${proto}://${host}`.replace(/\/$/, "");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const supabase = createSupabaseServerClient(req, res);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) return res.status(401).json({ error: "Not signed in" });

    const siteUrl = getSiteUrl(req);

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id ?? null;

    // If missing, create it here too (so portal works even before checkout)
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      const { error: upsertErr } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? profile?.email ?? null,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (upsertErr) {
        return res.status(500).json({ error: `Failed to save Stripe customer: ${upsertErr.message}` });
      }
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/account`,
    });

    return res.status(200).json({ url: portal.url });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Portal failed" });
  }
}
