import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY);

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/**
 * Netlify Function: Create Checkout Session
 * Creates a Stripe Checkout session for the Premium Plan subscription
 */
export const handler = async (event, context) => {
  console.log("Checkout session request received");
  console.log("Stripe key available:", !!process.env.STRIPE_SECRET || !!process.env.STRIPE_SECRET_KEY);
  
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { email, tier = "premium", appUrl } = body;

    // Validate input
    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing email parameter" }),
      };
    }

    // Use provided appUrl from frontend, fallback to env variable
    const baseUrl = appUrl || process.env.VITE_APP_URL || "http://localhost:8888";
    console.log("Creating session for email:", email, "tier:", tier, "baseUrl:", baseUrl);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "DEV@Deakin Premium Plan",
              description: "Monthly subscription to premium features",
            },
            unit_amount: 999, // $9.99 in cents
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plans`,
      metadata: {
        email: email,
        tier: tier,
      },
    });

    console.log("Session created:", session.id);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    console.error("Full error:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message || "Failed to create checkout session",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};
