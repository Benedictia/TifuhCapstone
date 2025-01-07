import React, { useState, useEffect } from 'react';
import { getBooks } from '../services/apiService';  
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks('JavaScript');
        setBooks(response.items);
      } catch (error) {
        console.error('Error fetching books:', error);
        setAlertMessage('Failed to fetch books. Please try again later.');
        setAlertType('error');
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Absizy Book Discovery!</h1>

      {alertMessage && (
        <div style={{ color: alertType === 'error' ? 'red' : 'green' }}>
          {alertMessage}
        </div>
      )}

      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
             
            />
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
