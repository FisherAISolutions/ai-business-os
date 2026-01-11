// pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

function getSiteUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) return envUrl.replace(/\/$/, "");

  // fallback (works on Vercel + local)
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
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return res.status(500).json({ error: "Missing STRIPE_PRICE_ID" });

    // Ensure profile exists + get stripe_customer_id
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = existingProfile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Upsert guarantees a row exists (fixes "no stripe customer on profile")
      const { error: upsertErr } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? existingProfile?.email ?? null,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (upsertErr) {
        return res.status(500).json({ error: `Failed to save Stripe customer: ${upsertErr.message}` });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${siteUrl}/account?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Checkout failed" });
  }
}
