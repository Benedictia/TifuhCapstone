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
  });
  const [editingBook, setEditingBook] = useState(null);

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
      .then((response) => response.json())
      .then((data) => setUserLibrary(data.library || [])) // Ensure default empty array
      .catch((error) => console.error('Error fetching library:', error));
  }, [navigate]);

  // Add book to library
  const handleAddBook = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const newBookWithId = { ...newBook, bookId: Date.now(), status: 'yetToStart' };
    fetch('https://backendbookapp-8eur.onrender.com/api/auth/library', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newBookWithId),
    })
      .then((response) => response.json())
      .then((updatedLibrary) => {
        setUserLibrary(updatedLibrary);
        setNewBook({ title: '', author: '', genre: '', description: '', link: '' }); // Clear form after submission
      })
      .catch((error) => console.error('Error adding book:', error));
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
        console.error('Failed to update library');
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  // Handle book deletion
  const handleDeleteBook = (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://backendbookapp-8eur.onrender.com/api/auth/library', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    })
      .then((response) => response.json())
      .then((updatedLibrary) => {
        setUserLibrary(updatedLibrary);
      })
      .catch((error) => console.error('Error deleting book:', error));
  };

  // Handle editing book (you may want to implement editing logic here)
  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      link: book.link,
    });
  };

  return (
    <div>
      <h2>My Book Collection</h2>
      <div>
        <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
        
        {/* The form for adding/editing books */}
        <form onSubmit={handleAddBook}>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Link"
            value={newBook.link}
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
              <button className="delete-btn" onClick={() => handleDeleteBook(book.bookId)}>Delete</button>
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
