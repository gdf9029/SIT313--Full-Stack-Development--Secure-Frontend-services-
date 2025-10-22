import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

// Replace 'your_stripe_publishable_key' with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51SJqkBB3sYHo3boASkZiCcKhhxoKhRb5MM9nu9pwd9pByDRp1MPb3Q1CFLDQOw07jDykCLgGqBNJIyN3B0vV3g4X008lqsWqLX');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 999,
          email: email,
        }),
      });

      // Read response body once as text first
      const responseBody = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseBody);
          setError(errorData.error || `Payment error: ${response.status}`);
        } catch (parseError) {
          console.error('Response text:', responseBody);
          setError(`Payment server error: ${response.status}. Please check that environment variables are configured.`);
        }
        setLoading(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        console.error('Response text:', responseBody);
        setError('Payment server returned invalid response. Please try again.');
        setLoading(false);
        return;
      }

      const { clientSecret } = data;

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        alert('Payment successful! Welcome to Premium! 🎉');
        // Store premium status in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.isPremium = true;
        user.premiumSince = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to home after success
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setError('Payment requires additional verification. Please complete the authentication.');
        setLoading(false);
      } else {
        setError('Payment processing failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Complete Your Payment</h2>
      <p className="plan-info">Premium Plan - $9.99/month</p>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Card Details</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={!stripe || loading || !email} className="pay-button">
        {loading ? 'Processing...' : 'Pay $9.99'}
      </button>

      <button
        type="button"
        className="cancel-button"
        onClick={() => navigate('/plans')}
      >
        Cancel
      </button>
    </form>
  );
};

const Payment = () => {
  return (
    <div className="payment-page">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Payment;
