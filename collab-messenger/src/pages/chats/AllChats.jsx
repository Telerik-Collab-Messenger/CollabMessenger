import React, { useEffect, useState, useContext } from 'react';
import { getAllChats, createChat } from '../../services/chat.services.js';
import { Link, useNavigate } from 'react-router-dom';
import { ListGroup, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { AppContext } from '../../state/app.context'; // Assuming you have a user context

export default function AllChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext); // Access the user from context
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const allChats = await getAllChats();
        setChats(allChats);
      } catch (err) {
        setError('Failed to load chats.');
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
      // Create a new chat with the current user's info
      const newChatId = await createChat(user.handle || user.email || user.displayName || 'Anonymous');
      // Navigate to the new chat page
      navigate(`/chat/${newChatId}`);
    } catch (error) {
      console.error('Failed to create a new chat:', error);
      setError('Failed to create a new chat.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2>All Chats</h2>
      <Button onClick={handleNewChatClick} variant="primary" className="mb-3">
        Start New Chat
      </Button>
      {chats.length === 0 ? (
        <Alert variant="info">No chats available.</Alert>
      ) : (
        <ListGroup>
          {chats.map((chat) => (
            <ListGroup.Item key={chat.id}>
              <Link to={`/chat/${chat.id}`}>
                {chat.author} - {new Date(chat.createdOn).toLocaleString()}
                <span style={{ float: 'right' }}>Likes: {chat.likeCount}</span>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
