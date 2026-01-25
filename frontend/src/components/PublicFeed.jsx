import { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicFeed.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://confession-slf8.onrender.com';

function PublicFeed() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/confessions/approved`);
      setConfessions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load confessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">Loading confessions...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Public Confessions</h2>
        <p>Anonymous thoughts from the community</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {confessions.length === 0 ? (
        <div className="empty-state">
          <p>No confessions yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="confessions-grid">
          {confessions.map((confession) => (
            <div key={confession._id} className="confession-card">
              <div className="confession-header">
                <span className="anonymous-badge">Anonymous</span>
                <span className="date">{formatDate(confession.createdAt)}</span>
              </div>
              
              <p className="confession-text">{confession.text}</p>
              
              {confession.imageURL && (
                <div className="confession-image">
                  <img src={confession.imageURL} alt="Confession" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicFeed;