import { useState } from 'react';
import axios from 'axios';

const bookOptions = [
  "The Hobbit", "The Lord of the Rings", "Harry Potter and the Sorcerer's Stone",
  "To Kill a Mockingbird", "1984", "Pride and Prejudice", "The Great Gatsby",
  "Moby Dick", "Dracula", "Frankenstein"
];

function App() {
  const [selectedBook, setSelectedBook] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!selectedBook) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/recommend', {
        title: selectedBook
      });
      setRecommendations(res.data);
    } catch (err) {
      alert('Error getting recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📚 Book Recommendation System</h1>
      <label>Select a book: </label>
      <select onChange={(e) => setSelectedBook(e.target.value)} defaultValue="">
        <option value="" disabled>--Choose a Book--</option>
        {bookOptions.map((title, index) => (
          <option key={index}>{title}</option>
        ))}
      </select>

      <button onClick={handleRecommend} style={{ marginLeft: '1rem' }}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        {recommendations.map((rec, index) => (
          <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{rec.title}</h3>
            <p><strong>Author:</strong> {rec.author}</p>
            <p><em>{rec.reason}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
