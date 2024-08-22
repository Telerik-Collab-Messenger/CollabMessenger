import React, { useState, useEffect, useContext } from 'react';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { addChatParticipant, createChatMessage, getChatByID } from '../../services/chat.services';
import { AppContext } from '../../state/app.context';
import UserSearch from '../../components/userSearch/UserSearch';

export default function SingleChat () {
  const { id } = useParams(); 
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
    if (!messageContent.trim()) return; 
    try {
      await createChatMessage(id, userData.handle, messageContent);
      setMessageContent(''); 
      getChatByID(id).then(setChat); 
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAddParticipant = async (user) => {
    try {
      const updatedParticipants = await addChatParticipant(id, user.handle);
      setChat((prevChat) => ({
        ...prevChat,
        participants: updatedParticipants,
      }));
    } catch (error) {
      console.error("Failed to add participant:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {chat ? (
        <>
          <UserSearch onAddParticipant={handleAddParticipant} />
          <h2 className="text-2xl font-bold mb-4">Chat with {chat.author}</h2>
          <ul className="list-none p-0">
            {chat.messages.map((msg) => (
              <li key={msg.id} className="mb-2 p-4 bg-white rounded-lg shadow-md">
                <strong>{msg.author}:</strong> {msg.content} <br />
                <small className="text-gray-500">{msg.createdOn}</small>
              </li>
            ))}
          </ul>
          <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
            <div className="form-control">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <button className="btn btn-primary mt-2" onClick={handleSendMessage}>
              Send
            </button>
          </form>
        </>
      ) : (
        <p>Loading chat...</p>
      )}
    </div>
  );
}
