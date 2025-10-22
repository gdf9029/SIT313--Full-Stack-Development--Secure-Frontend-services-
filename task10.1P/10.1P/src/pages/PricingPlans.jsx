import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingPlans.css';

const PricingPlans = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFreePlan = () => {
    alert('You are already on the Free plan!');
  };

  const handlePremiumPlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user email
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        alert('Please log in first to upgrade to Premium');
        navigate('/login');
        return;
      }

      const user = JSON.parse(savedUser);
      const email = user.email || user.displayName || 'user@example.com';

      // Get current app URL (origin + port)
      const currentAppUrl = window.location.origin;
      console.log("Sending app URL to checkout:", currentAppUrl);

      // Create checkout session
      const response = await fetch('/.netlify/functions/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          tier: 'premium',
          appUrl: currentAppUrl,  // Send current app URL
        }),
      });

      const responseBody = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseBody);
          throw new Error(errorData.error || 'Failed to create checkout session');
        } catch (parseError) {
          throw new Error('Payment service error. Please try again.');
        }
      }

      const data = JSON.parse(responseBody);
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="pricing-plans-page">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Select the plan that works best for you</p>
      </div>

      <div className="plans-container">
        {/* Free Plan */}
        <div className="plan-card free-plan">
          <div className="plan-header">
            <h2>Free</h2>
            <div className="price">
              <span className="amount">$0</span>
              <span className="period">/month</span>
            </div>
          </div>
          
          <ul className="features-list">
            <li>✓ Basic post access</li>
            <li>✓ Community support</li>
            <li>✓ Limited posts per month (10)</li>
            <li>✓ Standard themes</li>
            <li>✓ View questions and articles</li>
          </ul>

          <button className="plan-btn free-btn" onClick={handleFreePlan}>
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="plan-card premium-plan">
          <div className="popular-badge">Most Popular</div>
          <div className="plan-header">
            <h2>Premium</h2>
            <div className="price">
              <span className="amount">$9.99</span>
              <span className="period">/month</span>
            </div>
          </div>
          
          <ul className="features-list">
            <li>✓ Unlimited posts</li>
            <li>✓ Custom messages and banners</li>
            <li>✓ Premium themes and customization</li>
            <li>✓ Analytics dashboard</li>
            <li>✓ Content control features</li>
            <li>✓ Priority support (24/7)</li>
            <li>✓ Admin features</li>
            <li>✓ Ad-free experience</li>
            <li>✓ Advanced code editor features</li>
          </ul>

          <button 
            className="plan-btn premium-btn" 
            onClick={handlePremiumPlan}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default PricingPlans;
