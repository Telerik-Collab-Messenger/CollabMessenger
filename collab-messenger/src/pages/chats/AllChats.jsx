import { useEffect, useState, useContext } from 'react';
import { getAllChats, createChat } from '../../services/chat.services.js';
import { Link, useNavigate } from 'react-router-dom';
//import { ListGroup, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { AppContext } from '../../state/app.context'; 

export default function AllChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext); // Access the user from context
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const allChats = await getAllChats();
        setChats(allChats);
      } catch (err) {
        setError('Failed to load chats.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleNewChatClick = async () => {
    if (!user) {
      alert('Please log in to start a chat');
      return;
    }

    try {
      // Create a new chat with the current user's info This needs work. Should implement the user handle!!
      const newChatId = await createChat(user.handle || user.email || user.displayName || 'Anonymous');
      navigate(`/chat/${newChatId}`);
    } catch (error) {
      console.error('Failed to create a new chat:', error);
      setError('Failed to create a new chat.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Chats</h2>
      <button onClick={handleNewChatClick} className="btn btn-primary mb-4">
        Start New Chat
      </button>
      {chats.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h1m0 4h-1m0-4h.01M12 6h.01" /></svg>
            <span>No chats available.</span>
          </div>
        </div>
      ) : (
        <ul className="list-group space-y-2">
          {chats.map((chat) => (
            <li key={chat.id} className="list-group-item border rounded-lg shadow hover:bg-gray-100">
              <Link to={`/chat/${chat.id}`} className="flex justify-between items-center">
                <span>{chat.author} - {new Date(chat.createdOn).toLocaleString()}</span>
                <span className="badge badge-primary">Likes: {chat.likeCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}