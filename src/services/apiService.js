// Function to fetch books from the Google Books API
export const getBooks = async (queryParams = 'JavaScript', startIndex = 0, maxResults = 10) => {
  try {
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const url = `${baseUrl}?q=${encodeURIComponent(queryParams)}&startIndex=${startIndex}&maxResults=${maxResults}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();

    return {
      items: data.items || [],
      totalItems: data.totalItems || 0,
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error; 
  }
};

// Function to get the available genres for search
export const getGenres = () => {
  return [
    'Nutrition',
    'Pregnancy',
    'Science',
    'Free',
    'Parenting',
    'History',
    'Technology',
    'Programming',
    'Romance',
    'Health',
    'Travel',
  ];
};

