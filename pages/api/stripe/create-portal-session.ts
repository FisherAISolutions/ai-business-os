// pages/api/stripe/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: NextApiRequest): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const parts = h.split(" ");
  if (parts.length !== 2) return null;
  if (parts[0].toLowerCase() !== "bearer") return null;
  return parts[1];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "Not signed in" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase.auth.getUser(token);
  const user = data?.user;

  if (error || !user) return res.status(401).json({ error: "Not signed in" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  if (!siteUrl) return res.status(500).json({ error: "Missing NEXT_PUBLIC_SITE_URL" });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id;
  if (!customerId) return res.status(400).json({ error: "No Stripe customer on profile" });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/account`,
  });

  return res.status(200).json({ url: portal.url });
}
