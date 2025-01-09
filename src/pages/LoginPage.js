


import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check if the user is already logged in 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');  
    }
  }, [navigate]);

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Call the onAuthenticate function to update the parent component
        onAuthenticate(true); 

        // Navigate to profile page after successful login
        navigate('/profile');
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Request Password Reset function
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail, // Send the email for password reset request
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('If the email is registered, a password reset link has been sent.');
        setShowModal(false); // Close the modal after sending the request
      } else {
        alert(data.msg || 'An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Submit the new password after token validation
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    if (resetPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token'); 
    const newPassword = resetPassword; 
  
    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token, 
          newPassword: newPassword, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Your password has been reset successfully.');
        // Reset password fields after successful reset
        setResetPassword('');
        setConfirmPassword('');
      } else {
        alert(data.msg || 'An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="login-container" style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="login-form" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} 
            />
          </div>
          <div className="remember-forgot" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" onClick={() => setShowModal(true)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Forgot password?</button>
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Login</button>
        </form>
      </div>

      {/* Modal for Password Reset */}
      {showModal && (
        <div className="modal" style={{
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '5px', width: '100%', maxWidth: '400px' }}>
            <h3>Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="resetEmail">Enter your email</label>
                <input 
                  type="email" 
                  id="resetEmail" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Send Reset Link
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '0.75rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px'
                }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
