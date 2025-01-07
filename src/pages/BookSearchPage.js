

import React, { useState, useEffect } from 'react';
import { getBooks, getGenres } from '../services/apiService'; 
import BookCard from '../components/BookCard'; 
import { useNavigate } from 'react-router-dom';

const BookSearchPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState('');
  const [genres, setGenres] = useState(getGenres());
  const [selectedGenre, setSelectedGenre] = useState('Health');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const maxResults = 10;
  const navigate = useNavigate();

  // Handle genre change
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setQueryParams(''); 
  };

  // Handle query change (search text input)
  const handleQueryChange = (e) => {
    setQueryParams(e.target.value);
  };

  // Add book to the backend library
  const handleAddToLibrary = async (book) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
      return;
    }

    const bookData = {
      bookId: book.id,
      title: book.volumeInfo?.title,
      author: book.volumeInfo?.authors?.join(', ') || 'Unknown',
      status: 'Reading', 
    };

    try {
      const response = await fetch('https://backendbookapp-yqmj.onrender.com/api/auth/library', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const updatedLibrary = await response.json(); 
        alert(`${book.volumeInfo.title} has been added to your library!`);
      } else {
        alert('Failed to add book to your library');
      }
    } catch (error) {
      console.error('Error adding book to library:', error);
      alert('An error occurred while adding the book');
    }
  };

  // Fetch books based on query params and genre
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);

    const startIndex = (currentPage - 1) * maxResults;
    const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : '';
    const searchQuery = queryParams.trim() ? `+${queryParams}` : '';

    try {
      const response = await getBooks(searchQuery + genreQuery, startIndex, maxResults);
      if (response.items) {
        setBooks(response.items);
        setTotalResults(response.totalItems || 0);
      } else {
        setBooks([]);
        setTotalResults(0);
      }
    } catch (error) {
      setError('Error fetching books');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books when query, genre, or page changes
  useEffect(() => {
    fetchBooks();
  }, [queryParams, selectedGenre, currentPage]);

  return (
    <div>
      <h1>Search Books</h1>

      <div>
        <input
          type="text"
          placeholder="Search by title or author"
          value={queryParams}
          onChange={handleQueryChange}
        />
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.id} book={book} onAddToLibrary={handleAddToLibrary} />
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * maxResults >= totalResults}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearchPage;
