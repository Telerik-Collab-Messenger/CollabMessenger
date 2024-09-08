<<<<<<< HEAD
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { addChatParticipant, createChatMessage, getChatByID } from '../../services/chat.services';
import { AppContext } from '../../state/app.context';
import UserSearch from '../../components/userSearch/UserSearch';
import Participant from '../../components/chat/Participant';
=======
import { useState, useEffect, useContext } from "react";
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import {
  addChatParticipant,
  createChatMessage,
  getChatByID,
} from "../../services/chat.services";
import { AppContext } from "../../state/app.context";
import UserSearch from "../../components/userSearch/UserSearch";
import Participant from "../../components/chat/Participant";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
>>>>>>> 31b89be0ee79a04f63b13ef1d3c182e3d82dde36

export default function SingleChat( { chatId }) {
  //const { id } = useParams();
  const { userData } = useContext(AppContext);
  const [chat, setChat] = useState(null);
  const [chatParticipants, setChatParticipants] = useState(null); //should check the participant state
  const [messageContent, setMessageContent] = useState("");

  // useEffect(() => {
  //   getChatByID(id)
  //     .then((chatData) => {
  //       setChat(chatData);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch chat:", error);
  //     });
  // }, [id]);

  useEffect(() => {
    if (!chatId) return;

    return onValue(ref(db, `chats/${chatId}`), (snapshot) => {
      const updatedChat = snapshot.val();
      console.log(updatedChat);
      const messagesArray = updatedChat.messages
        ? Object.entries(updatedChat.messages).map(([key, message]) => ({
            id: key,
            ...message,
          }))
        : [];
      setChat({
        ...updatedChat,
        messages: messagesArray,
      });
    });
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    try {
      await createChatMessage(chatId, userData.handle, messageContent);
      setMessageContent("");
      const updatedChat = await getChatByID(chatId);
      setChat(updatedChat);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAddParticipant = async (user) => {
    try {
      await addChatParticipant(chatId, user.handle);
      //const updatedParticipants = await addChatParticipant(id, user.handle);
      // setChat((prevChat) => ({
      //   ...prevChat,
      //   participants: updatedParticipants,
      // }));
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
          <div className="flex flex-wrap gap-4 justify-start">
            {Object.keys(chat.participants).map((participantHandle) => <Participant key={participantHandle} participantHandle={participantHandle} />)}
          </div>
          
          <ul className="list-none p-0">
            {chat.messages.map((msg) => (
              <li
                key={msg.id}
                className="mb-2 p-4 bg-white rounded-lg shadow-md"
              >
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
            <button
              className="btn btn-primary mt-2"
              onClick={handleSendMessage}
            >
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
