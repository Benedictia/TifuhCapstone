import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]);

  // Fetch user profile and library data when the component mounts or when the library changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Fetch user profile and library from API
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://backendbookapp-yqmj.onrender.com/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setUserLibrary(data.library); // Set the library when profile is fetched
        } else {
          alert('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]); // The useEffect will run whenever the page loads, checking the authentication token

  return (
    <div>
      <h2>User Profile</h2>
      {profile ? (
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
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
