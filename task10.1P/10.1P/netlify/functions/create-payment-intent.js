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
 * Netlify Function: Create Payment Intent
 * Handles POST requests to create a Stripe payment intent for premium plan subscription
 */
export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  // Verify Stripe key is configured
  if (!process.env.STRIPE_SECRET && !process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET or STRIPE_SECRET_KEY environment variable not set');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Payment service not configured. Please contact support.",
        details: "Missing Stripe secret key configuration"
      }),
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
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { amount, email } = body;

    // Validate input
    if (!amount) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing amount parameter" }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing email parameter" }),
      };
    }

    // Create a payment intent for the Premium Plan ($9.99)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 999, // Default to 999 cents ($9.99)
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "DEV@Deakin Premium Plan Subscription",
      metadata: {
        email: email,
        plan: "premium",
        service: "devakin",
      },
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message || "Failed to create payment intent",
      }),
    };
  }
};
