import { NextResponse } from "next/server";
import Stripe from "stripe";

// 1. Initialise Stripe outside the handler so it can be reused efficiently
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any, // The 'as any' fixes the TypeScript error
});

export async function POST(request: Request) {
  try {
    // 2. We dynamically grab the origin URL (localhost:3000 in development)
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // 3. Construct the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp", // Set to British Pounds
            product_data: {
              name: "Standard Tier Deposit",
              description: "50% deposit to begin your portfolio build.",
            },
            // Stripe expects the amount in the smallest currency unit (pence).
            // So, £100.00 is written as 10000.
            unit_amount: 10000, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // 4. Redirect the user back to their dashboard whether they pay or cancel
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
    });

    // 5. Send the secure Stripe URL back to the frontend
    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to initialise checkout session." },
      { status: 500 }
    );
  }
}

