// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

function buffer(readable: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    readable.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) return res.status(400).send("Missing webhook signature/secret");

  const buf = await buffer(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // must be set on server only
    { auth: { persistSession: false } }
  );

  async function updateByCustomer(customerId: string, patch: any) {
    await admin
      .from("profiles")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("stripe_customer_id", customerId);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string | null;
        if (customerId && session.subscription) {
          // Mark active quickly; subscription events will overwrite with the real status.
          await updateByCustomer(customerId, { subscription_status: "active" });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subAny = event.data.object as any; // <-- avoids TS mismatch
        const customerId = String(subAny.customer);

        const status = String(subAny.status ?? "");
        const periodEndUnix = subAny.current_period_end ? Number(subAny.current_period_end) : null;

        await updateByCustomer(customerId, {
          subscription_status: status || null,
          subscription_current_period_end: periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null,
        });
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Webhook handler failed" });
  }
}
