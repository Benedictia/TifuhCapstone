import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setUserLibrary(data.library);
        } else if (response.status === 403) {
          // Token expired, log out the user
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          alert('Failed to fetch profile');
        }
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false); 
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <h2>User Profile</h2>
      {isLoading ? (
        <p>Loading your profile...</p>
      ) : profile ? (
        <div>
          <p>Welcome, {profile.name}!</p>

          <h3>Your Library</h3>
          {userLibrary.length > 0 ? (
            <div className="book-list">
              {userLibrary.map((book) => (
                <div key={book.bookId} className="book-card">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p>Status: {book.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No books added to your library yet.</p>
          )}
        </div>
      ) : (
        <p>Failed to load profile.</p>  
      )}
    </div>
  );
};

export default ProfilePage;
