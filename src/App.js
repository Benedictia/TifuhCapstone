import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookSearchPage from './pages/BookSearchPage';
import MyLibrary from './pages/MyLibrary';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import UserProfilePage from './pages/UserProfilePage';

import './App.css';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);  
    setLoading(false);  
  }, []);

  // Handle user authentication (set state based on login status)
  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
    if (authenticated) {
      const redirectTo = localStorage.getItem('redirectTo') || '/profile';
      navigate(redirectTo);  
      localStorage.removeItem('redirectTo'); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Handle route protection by saving the intended route to redirect to after login
  const protectRoute = (route) => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectTo', route); 
      navigate('/login'); 
    }
  };

  // Show loading spinner while determining auth state
  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <div className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/book-search" className="nav-link">Book Search</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/my-library" className="nav-link">My Library</Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book-search" element={<BookSearchPage />} />
        <Route 
          path="/login" 
          element={<LoginPage onAuthenticate={handleAuthentication} />} 
        />
        <Route path="/register" element={<RegisterPage />} />

       
        <Route 
          path="/profile" 
          element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />} 
        />

        
        <Route 
          path="/my-library" 
          element={isAuthenticated ? <MyLibrary /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
