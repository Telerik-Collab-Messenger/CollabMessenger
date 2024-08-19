import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
//import { AppContext } from '../state/app.context';
import { createChatMessage, getChatByID } from '../../services/chat.services';
import { AppContext } from '../../state/app.context';

const SingleChat = () => {
  const { id } = useParams(); // Get chat ID from URL
  const { userData } = useContext(AppContext);
  const [chat, setChat] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    // Fetch chat data by ID
    getChatByID(id).then((chatData) => {
      setChat(chatData);
    }).catch((error) => {
      console.error("Failed to fetch chat:", error);
    });
  }, [id]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return; // Prevent sending empty messages
    try {
      await createChatMessage(id, userData.handle, messageContent);
      setMessageContent(''); // Clear input field after sending
      getChatByID(id).then(setChat); // Refresh chat data
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Container>
      {chat ? (
        <>
          <h2>Chat with {chat.author}</h2>
          <ListGroup>
            {chat.messages.map((msg) => (
              <ListGroup.Item key={msg.id}>
                <strong>{msg.author}:</strong> {msg.content} <br />
                <small>{msg.createdOn}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-2" onClick={handleSendMessage}>
              Send
            </Button>
          </Form>
        </>
      ) : (
        <p>Loading chat...</p>
      )}
    </Container>
  );
};

export default SingleChat;
