const stripe = require("stripe")(process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY);

// This function creates a payment intent for the Premium Plan subscription
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { amount, email } = JSON.parse(event.body);

    // Validate input
    if (!amount || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing amount or email" }),
      };
    }

    // Create a payment intent for $9.99 (999 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // $9.99 in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "DEV@Deakin Premium Plan - Monthly Subscription",
      metadata: {
        email: email,
        plan: "premium",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error("Stripe error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
