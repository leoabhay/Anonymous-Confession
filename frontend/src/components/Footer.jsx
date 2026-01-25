import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo-section">
                    <a href="/" className="logo-link">
                        <h3>Anonymous Confessions</h3>
                    </a>
                    <p>A safe space to share your thoughts anonymously.</p>
                </div>
                <div className="footer-links-container">
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Feed</Link></li>
                            <li><Link to="/submit">Submit Confessions</Link></li>
                            <li><Link to="/guidelines">Guidelines</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/guidelines">Privacy Policy</Link></li>
                            <li><Link to="/guidelines">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Anonymous Confessions. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;