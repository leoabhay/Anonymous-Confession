import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://confession-slf8.onrender.com';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyAndFetch(savedPassword);
    }
  }, []);

  const verifyAndFetch = async (pwd) => {
    try {
      await axios.post(`${API_URL}/api/admin/verify`, {}, {
        headers: { 'admin-password': pwd }
      });
      setIsAuthenticated(true);
      sessionStorage.setItem('adminPassword', pwd);
      fetchPendingConfessions(pwd);
    } catch {
      setIsAuthenticated(false);
      sessionStorage.removeItem('adminPassword');
      setMessage({ type: 'error', text: 'Invalid password' });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    verifyAndFetch(password);
  };

  const fetchPendingConfessions = async (pwd = password) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/confessions/pending`, {
        headers: { 'admin-password': pwd }
      });
      setConfessions(response.data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to fetch confessions' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/api/confessions/${id}/approve`, {}, {
        headers: { 'admin-password': password }
      });
      setMessage({ type: 'success', text: 'Confession approved!' });
      fetchPendingConfessions();
    } catch {
      setMessage({ type: 'error', text: 'Failed to approve confession' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/confessions/${id}`, {
        headers: { 'admin-password': password }
      });
      setMessage({ type: 'success', text: 'Confession deleted!' });
      fetchPendingConfessions();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete confession' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('adminPassword');
    setConfessions([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="login-card">
          <h2>Admin Login</h2>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="stats">
        <div className="stat-card">
          <h3>{confessions.length}</h3>
          <p>Pending Confessions</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : confessions.length === 0 ? (
        <div className="empty-state">
          <p>No pending confessions to review</p>
        </div>
      ) : (
        <div className="admin-confessions">
          {confessions.map((confession) => (
            <div key={confession._id} className="admin-confession-card">
              <div className="confession-content">
                <p className="confession-text">{confession.text}</p>
                {confession.imageURL && (
                  <div className="confession-image">
                    <img src={confession.imageURL} alt="Confession" />
                  </div>
                )}
                <div className="confession-meta">
                  <span className="date">
                    {new Date(confession.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="confession-actions">
                <button
                  onClick={() => handleApprove(confession._id)}
                  className="approve-button"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleDelete(confession._id)}
                  className="delete-button"
                >
                  ✕ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;