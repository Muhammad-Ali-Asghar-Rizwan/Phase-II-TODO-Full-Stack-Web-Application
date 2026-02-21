import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client'; // Using the project's auth client

const ChatInterface = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user: session } = useSession(); // Get user session from auth client

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get auth token from localStorage
      const authTokenRaw = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      // Parse token from JSON if needed
      let authToken = authTokenRaw;
      if (authTokenRaw) {
        try {
          const parsed = JSON.parse(authTokenRaw);
          authToken = parsed.token || authTokenRaw;
        } catch (e) {
          // If parsing fails, use as-is (already raw token)
        }
      }

      // Send message to backend API
      const response = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }), // Include auth token if available
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: userId || session?.id, // Use provided userId or session user id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to messages
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to UI
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <Head>
        <title>Todo AI Chatbot</title>
      </Head>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>Hello! I'm your AI assistant for managing tasks.</h3>
            <p>You can ask me to:</p>
            <ul>
              <li>Add tasks (e.g., "Add a task to buy groceries")</li>
              <li>View tasks (e.g., "Show me my tasks")</li>
              <li>Update tasks (e.g., "Mark task #1 as completed")</li>
              <li>Delete tasks (e.g., "Delete the meeting task")</li>
            </ul>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isLoading}
          className="send-button"
        >
          Send
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }
        
        .welcome-message {
          margin-bottom: 20px;
          padding: 16px;
          background-color: #f0f8ff;
          border-radius: 8px;
        }
        
        .welcome-message ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        .message {
          margin-bottom: 12px;
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          position: relative;
        }
        
        .user-message {
          align-self: flex-end;
          background-color: #dcf8c6;
          border-bottom-right-radius: 4px;
        }
        
        .ai-message {
          align-self: flex-start;
          background-color: #fff;
          border: 1px solid #eee;
          border-bottom-left-radius: 4px;
        }
        
        .message-timestamp {
          font-size: 0.7em;
          color: #888;
          margin-top: 4px;
          text-align: right;
        }
        
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #888;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        .chat-input-form {
          display: flex;
          padding: 12px;
          border-top: 1px solid #eee;
          background-color: #f9f9f9;
        }
        
        .chat-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 18px;
          outline: none;
        }
        
        .chat-input:focus {
          border-color: #007aff;
        }
        
        .send-button {
          margin-left: 8px;
          padding: 10px 16px;
          background-color: #007aff;
          color: white;
          border: none;
          border-radius: 18px;
          cursor: pointer;
        }
        
        .send-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// Enhanced modern UI for the chat interface
export default function ChatInterface({ userId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user: session } = useSession(); // Get user session from auth client

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get auth token from localStorage
      const authTokenRaw = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

      // Parse token from JSON if needed
      let authToken = authTokenRaw;
      if (authTokenRaw) {
        try {
          const parsed = JSON.parse(authTokenRaw);
          authToken = parsed.token || authTokenRaw;
        } catch (e) {
          // If parsing fails, use as-is (already raw token)
        }
      }

      // Send message to backend API
      const response = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }), // Include auth token if available
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: userId || session?.id, // Use provided userId or session user id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to messages
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to UI
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
      <style jsx>{`
        .chat-container {
          height: 450px;
          display: flex;
          flex-direction: column;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          position: relative;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-message {
          align-self: flex-end;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .ai-message {
          align-self: flex-start;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          color: #374151;
          border-bottom-left-radius: 4px;
        }

        .welcome-message {
          text-align: center;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-radius: 12px;
        }

        .welcome-message h3 {
          color: #1e40af;
          margin-bottom: 1rem;
        }

        .welcome-message ul {
          text-align: left;
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .message-timestamp {
          font-size: 0.65rem;
          color: #9ca3af;
          margin-top: 0.25rem;
          text-align: right;
        }

        .typing-indicator {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        .chat-input-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          outline: none;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-button {
          margin-left: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .send-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3 className="text-lg font-semibold">Hello! I'm your AI Task Assistant</h3>
            <p className="text-sm">I can help you manage your tasks. Try asking me:</p>
            <ul className="text-xs mt-2">
              <li>"Add a task to buy groceries"</li>
              <li>"Show me my pending tasks"</li>
              <li>"Mark task #1 as completed"</li>
              <li>"Delete the meeting task"</li>
            </ul>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message ai-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="send-button flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Send
        </button>
      </form>
    </div>
  );
}