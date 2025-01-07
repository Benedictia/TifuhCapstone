import React, { useState } from 'react';
import '../App.css';

const BookCard = ({ book, onAddToLibrary }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Function to toggle the modal visibility
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Extract the book description
  const description = book.volumeInfo.description || 'No description available.';
  const briefDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

  // Check if the book is free
  const isFree = book.saleInfo?.isFree || false;

  return (
    <div className="book-card">
      <img
        src={book.volumeInfo.imageLinks?.thumbnail}
        alt={book.volumeInfo.title}
        className="book-image"
      />
      <h3>{book.volumeInfo.title}</h3>
      <p><strong>Author(s):</strong> {book.volumeInfo.authors?.join(', ')}</p>
      <p>
        <strong>Description:</strong>
        {briefDescription}
      </p>
      <a href={book.volumeInfo.previewLink} target="_blank" rel="noopener noreferrer">Preview</a>

      {isFree ? <span className="badge free-badge">Free</span> : <span className="badge paid-badge">Paid</span>}

      <div className="actions">
        <button onClick={openModal}>Read More</button> 

      
        {onAddToLibrary && (
          <button onClick={() => onAddToLibrary(book)}>
            Add to My Library
          </button>
        )}
      </div>

      {/* Modal for full description */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>Close</button>
            <div className="modal-body">
              <h2>{book.volumeInfo.title}</h2>
              <p><strong>Author(s):</strong> {book.volumeInfo.authors?.join(', ')}</p>
              <p><strong>Full Description:</strong> {description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
