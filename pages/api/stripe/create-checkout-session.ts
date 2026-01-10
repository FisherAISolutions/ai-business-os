// pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

function getBaseUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  // Vercel provides VERCEL_URL without protocol
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Fallback for local/dev
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

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return res.status(500).json({ error: "Missing STRIPE_PRICE_ID" });

    const baseUrl = getBaseUrl(req);

    // Get/create Stripe customer and store on profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // Optional: explicitly set card (helps some Stripe setups)
      payment_method_types: ["card"],
      success_url: `${baseUrl}/account?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message ?? "Checkout session failed" });
  }
}
