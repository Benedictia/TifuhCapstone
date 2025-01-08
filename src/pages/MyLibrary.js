

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyLibrary = () => {
  const navigate = useNavigate();
  const [userLibrary, setUserLibrary] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    link: '',
    status: 'yetToStart', // Default status for new book
  });
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState(null); 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    }

    // Fetch user library on mount
    fetch('https://backendbookapp-8eur.onrender.com/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch library');
        return response.json();
      })
      .then((data) => setUserLibrary(data.library || [])) 
      .catch((error) => setError(error.message)); 
  }, [navigate]);

  // Add book to library
  const addBook = async (e) => {
    e.preventDefault(); 

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const book = {
      ...newBook,
      bookId: Date.now(), 
      status: 'yetToStart', 
    };

    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/library', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) throw new Error('Failed to add book');

      const data = await response.json();
      console.log('Library Updated:', data);
      setUserLibrary(data); 
      setNewBook({
        title: '',
        author: '',
        genre: '',
        description: '',
        link: '',
        status: 'yetToStart', 
      }); // Reset form
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.message); 
    }
  };

  // Update book status
  const handleStatusChange = async (bookId, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/library/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, status }),
      });

      if (response.ok) {
        const updatedLibrary = await response.json();
        setUserLibrary(updatedLibrary);
      } else {
        throw new Error('Failed to update book status');
      }
    } catch (error) {
      console.error('Error updating book status:', error);
      setError(error.message); 
    }
  };

  // Handle book deletion
  const deleteBook = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://backendbookapp-8eur.onrender.com/api/auth/library/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete book');

      const data = await response.json();
      console.log('Library after deletion:', data);
      setUserLibrary(data); 
    } catch (error) {
      console.error('Error deleting book:', error);
      setError(error.message); 
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      link: book.link,
      status: book.status || 'yetToStart',  
    });
  };

  // Update book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const updatedBook = {
      ...newBook,
      bookId: editingBook.bookId, 
      status: editingBook.status || 'yetToStart', 
    };

    try {
      const response = await fetch('https://backendbookapp-8eur.onrender.com/api/auth/library', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); 
        console.error('Failed to update book. Server response:', errorMessage);
        throw new Error(`Failed to update book: ${response.statusText}`);
      }

      const updatedLibrary = await response.json();
      console.log('Library Updated:', updatedLibrary);

      // Update the UI with the updated library data
      setUserLibrary(updatedLibrary);
      setNewBook({
        title: '',
        author: '',
        genre: '',
        description: '',
        link: '',
        status: 'yetToStart', 
      });
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
      setError(error.message); 
    }
  };

  return (
    <div>
      <h2>My Book Collection</h2>
      {error && <div className="error">{error}</div>} 
      <div>
        <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
        <form onSubmit={editingBook ? handleUpdateBook : addBook}>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title || ''}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author || ''}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre || ''}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newBook.description || ''}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Link"
            value={newBook.link || ''}
            onChange={(e) => setNewBook({ ...newBook, link: e.target.value })}
          />

          <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
        </form>
      </div>

      <div className="book-list">
        {Array.isArray(userLibrary) && userLibrary.length > 0 ? (
          userLibrary.map((book) => (
            <div key={book.bookId} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>Author(s):</strong> {book.author}</p>
              <p>{book.description}</p>

              <div>
                <label>
                  <input
                    type="radio"
                    checked={book.status === 'inProgress'}
                    onChange={() => handleStatusChange(book.bookId, 'inProgress')}
                  />
                  In Progress
                </label>
                <label>
                  <input
                    type="radio"
                    checked={book.status === 'complete'}
                    onChange={() => handleStatusChange(book.bookId, 'complete')}
                  />
                  Complete
                </label>
                <label>
                  <input
                    type="radio"
                    checked={book.status === 'yetToStart'}
                    onChange={() => handleStatusChange(book.bookId, 'yetToStart')}
                  />
                  Yet to Start
                </label>
              </div>
             
              <button className="edit-btn" onClick={() => handleEditBook(book)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteBook(book.bookId)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
