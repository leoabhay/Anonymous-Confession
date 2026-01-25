import { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import './SubmitConfession.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://confession-slf8.onrender.com';

function SubmitConfession() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const textAreaRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    const cursor = textAreaRef.current.selectionStart;
    const newText = text.slice(0, cursor) + emojiObject.emoji + text.slice(cursor);
    setText(newText);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'Please write your confession' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('text', text);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(`${API_URL}/api/confessions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: response.data.message });
      setText('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit confession' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-container">
      <div className="submit-card">
        <h2>Share Your Confession</h2>
        <p className="subtitle">Your identity will remain completely anonymous</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind? Share your secret..."
              maxLength={1000}
              rows={6}
              disabled={loading}
            />
            <div className="char-count">{text.length}/1000</div>
          </div>

          <div className="emoji-section">
            <button
              type="button"
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={loading}
            >
              😊 Add Emoji
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <div className="image-section">
            <label className="file-input-label">
              📷 Add Image (Optional)
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={removeImage}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !text.trim()}
          >
            {loading ? 'Submitting...' : 'Submit Confession'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitConfession;