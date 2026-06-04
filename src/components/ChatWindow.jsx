import React, { useEffect, useRef, useState } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, onSendMessage, recipientName, isReadOnly = false, currentUserType = 'customer' }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="chat-window-container">
      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-user-avatar">
          {recipientName ? recipientName.charAt(0).toUpperCase() : 'V'}
        </div>
        <div className="chat-user-info">
          <h4 className="chat-user-name">{recipientName || 'Your Vendor'}</h4>
          <span className="chat-user-status">Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages-area">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_type === currentUserType;
            return (
              <div
                key={msg.id || index}
                className={`chat-message-row ${isMe ? 'message-right' : 'message-left'}`}
              >
                <div className={`chat-message-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                  <p className="chat-message-body">{msg.body}</p>
                  <span className="chat-message-time">{formatTime(msg.created_at || msg.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      {!isReadOnly && recipientName && (
        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            className="chat-input-field"
            placeholder="Type your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
