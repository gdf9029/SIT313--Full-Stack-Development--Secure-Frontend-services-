import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingPlans.css';

const PricingPlans = () => {
  const navigate = useNavigate();

  const handleFreePlan = () => {
    alert('You are already on the Free plan!');
  };

  const handlePremiumPlan = () => {
    navigate('/payment');
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

          <button className="plan-btn premium-btn" onClick={handlePremiumPlan}>
            Upgrade to Premium
          </button>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default PricingPlans;
