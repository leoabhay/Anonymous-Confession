import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SubmitConfession from './components/SubmitConfession';
import PublicFeed from './components/PublicFeed';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import CommunityGuidelines from './components/CommunityGuidelines';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="logo-link">
              <h1 className="logo">Anonymous Confessions</h1>
            </a>
            <div className="nav-links">
              <Link to="/">Feed</Link>
              <Link to="/submit">Submit Confessions</Link>
              {/* <Link to="/admin">Admin</Link> */}
              <Link to="/guidelines">Guidelines</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PublicFeed />} />
            <Route path="/submit" element={<SubmitConfession />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;