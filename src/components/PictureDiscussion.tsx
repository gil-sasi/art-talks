import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtworkById } from '../hooks/useArtAPI';
import { useChat } from '../hooks/useChat';
import { UI_TEXT } from '../constants';
import BackButton from './BackButton';
import type { RouteParams } from '../types';
import './PictureDiscussion.css';

/**
 * Picture discussion component showing artwork details and chat interface
 */
const PictureDiscussion: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const artworkId = Number(id);

  const { artwork: artPiece, loading, error } = useArtworkById(artworkId);

  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    isTyping, 
    messagesEndRef, 
    handleSubmit, 
    canSend
  } = useChat([], artPiece?.id);

  if (loading) {
    return (
      <div className="discussion-container">
        <div className="loading-message" role="status">
          <p>Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discussion-container">
        <div className="error-message" role="alert">
          <h2>Error loading artwork: {error}</h2>
          <BackButton onClick={() => navigate('/')}>
            {UI_TEXT.BACK_TO_GALLERY}
          </BackButton>
        </div>
      </div>
    );
  }

  if (!artPiece) {
    return (
      <div className="discussion-container">
        <div className="error-message" role="alert">
          <h2>{UI_TEXT.ARTWORK_NOT_FOUND}</h2>
          <BackButton onClick={() => navigate('/')}>
            {UI_TEXT.BACK_TO_GALLERY}
          </BackButton>
        </div>
      </div>
    );
  }

  return (
    <main className="discussion-container" role="main">
      <header className="discussion-header">
        <BackButton 
          onClick={() => navigate('/')}
          aria-label={UI_TEXT.BACK_TO_GALLERY}
        >
          {UI_TEXT.BACK_TO_GALLERY}
        </BackButton>
        <h1>{UI_TEXT.APP_TITLE}</h1>
      </header>

      <div className="discussion-content">
        <section className="artwork-section" aria-label="Artwork details">
          <div className="artwork-header">
            <div className="artwork-details">
              <h2 className="artwork-title">{artPiece.title}</h2>
              <p className="artwork-artist">by {artPiece.artist}</p>
            </div>
          </div>
          <div className="artwork-display">
            <img 
              src={artPiece.imageUrl} 
              alt={`${artPiece.title} by ${artPiece.artist}`}
              className="artwork-image"
            />
          </div>
        </section>

        <section className="chat-section" aria-label="Discussion chat">
          <div className="chat-header">
            <h3>{UI_TEXT.DISCUSSION_TITLE}</h3>
          </div>
          
          <div 
            className="chat-messages" 
            role="log" 
            aria-live="polite" 
            aria-label="Chat messages"
          >
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isOwnMessage ? 'message-own' : 'message-other'}`}
                role="article"
              >
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <time className="message-time" dateTime={message.timestamp.toISOString()}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </time>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message message-other typing-indicator" aria-label="Someone is typing">
                <div className="message-header">
                  <span className="message-sender">ArtCritic</span>
                </div>
                <div className="message-text">
                  <span className="typing-dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <label htmlFor="message-input" className="visually-hidden">
              Type your message
            </label>
            <input
              id="message-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={UI_TEXT.MESSAGE_PLACEHOLDER}
              className="chat-input"
              maxLength={500}
              aria-describedby="message-counter"
            />
            <div id="message-counter" className="visually-hidden">
              {newMessage.length} of 500 characters
            </div>
            <button 
              type="submit" 
              className="send-button"
              disabled={!canSend}
              aria-label={`${UI_TEXT.SEND_BUTTON} message`}
            >
              {UI_TEXT.SEND_BUTTON}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default PictureDiscussion;
