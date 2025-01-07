
import React, { useState, useEffect } from 'react';
import { getBooks, getGenres } from '../services/apiService';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const BookSearch = () => {
  const { user, logout } = useAuth();  
  const [books, setBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({ genre: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  // Fetch the list of available genres
  useEffect(() => {
    const fetchGenres = async () => {
      const genresList = await getGenres(); 
      setGenres(genresList);
    };
    fetchGenres();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchCriteria.genre) {
      return; 
    }

    const queryParams = `subject:${searchCriteria.genre}`;

    setIsLoading(true);

    try {
      const response = await getBooks(queryParams);
      setBooks(response);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
   
    return (
      <div>
        <h1>Please log in to search books</h1>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Search for Books by Genre</h1>
     
      <div>
        <h3>Welcome, {user.email}</h3>
        <button onClick={logout}>Logout</button>
      </div>

     
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label>Genre:</label>
          <select
            name="genre"
            value={searchCriteria.genre}
            onChange={handleSearchChange}
          >
            <option value="">Select a Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isLoading}>Search</button>
      </form>

      {isLoading && <p>Loading...</p>}

      
      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;

