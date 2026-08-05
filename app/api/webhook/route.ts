import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

// 2. Initialize Supabase Admin (Bypasses RLS to safely update orders)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    // 3. Verify the message is actually from Stripe and not a hacker
    event = stripe.webhooks.constructEvent(
      payload,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // 4. If the payment was successful, update the database!
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      // Find the user by the email they used at checkout
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", customerEmail)
        .single();

      if (user) {
        // Update their order status
        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "in progress" })
          .eq("user_id", user.id);
          
        console.log(`✅ Order updated for: ${customerEmail}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}