import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    console.log("PaymentSuccess mounted");
    const sessionId = searchParams.get('session_id');
    console.log("Session ID from URL:", sessionId);
    
    if (!sessionId) {
      console.log("No session ID found");
      setStatus('error');
      setMessage('No session ID found. Payment may not have been processed.');
      return;
    }

    // Verify the session and mark user as premium
    verifySession(sessionId);
  }, [searchParams]);

  const verifySession = async (sessionId) => {
    try {
      console.log("Verifying session:", sessionId);
      
      // Store premium status in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.isPremium = true;
      user.premiumSince = new Date().toISOString();
      user.stripeSessionId = sessionId;
      localStorage.setItem('user', JSON.stringify(user));

      console.log("Premium status saved to localStorage");
      console.log("User data:", user);
      
      setStatus('success');
      setMessage('Payment Successful! Welcome to Premium!');

      // Redirect to home after 3 seconds
      const timer = setTimeout(() => {
        console.log("Redirecting to home");
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error verifying session:', error);
      setStatus('error');
      setMessage('Error processing your payment. Please contact support.');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    },
    container: {
      width: '100%',
      maxWidth: '600px',
    },
    status: {
      background: 'white',
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    spinner: {
      border: '4px solid #f0f0f0',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
    success: {
      color: '#27ae60',
    },
    error: {
      color: '#e74c3c',
    },
    h1: {
      margin: '0 0 1rem 0',
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    p: {
      color: '#666',
      marginBottom: '2rem',
      fontSize: '1rem',
    },
    button: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '0.75rem 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      marginTop: '1rem',
    },
    redirect: {
      color: '#999',
      marginTop: '1rem',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={{ ...styles.status, ...(status === 'success' ? styles.success : status === 'error' ? styles.error : {}) }}>
          {status === 'loading' && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <h1 style={styles.h1}>🎉 {message}</h1>
              <p style={styles.p}>You now have access to all premium features!</p>
              <button 
                onClick={() => navigate('/')} 
                style={styles.button}
                onMouseOver={(e) => e.target.style.background = '#764ba2'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                Go to Home
              </button>
              <p style={styles.redirect}>Redirecting in 3 seconds...</p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <h1 style={{ ...styles.h1, color: '#e74c3c' }}>❌ Payment Error</h1>
              <p style={styles.p}>{message}</p>
              <button 
                onClick={() => navigate('/plans')} 
                style={styles.button}
                onMouseOver={(e) => e.target.style.background = '#764ba2'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
