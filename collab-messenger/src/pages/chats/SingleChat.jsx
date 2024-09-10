import { useState, useEffect, useContext, useRef } from "react";
import { onValue, ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import { AppContext } from "../../state/app.context";
import UserSearch from "../../components/userSearch/UserSearch";
import Participant from "../../components/chat/Participant";
import {
  createChatMessage,
  addChatParticipant,
} from "../../services/chat.services";

export default function SingleChat({ chatId }) {
  const { userData } = useContext(AppContext);
  const [chat, setChat] = useState(null); // Use chat state to hold all chat data
  const [messageContent, setMessageContent] = useState("");
  const [seenMessages, setSeenMessages] = useState(new Set()); // Track seen messages
  const lastSeenRef = useRef(null);

  // Effect: Fetch and update chat data including messages
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

  // Effect: Update scroll position and handle seen messages
  useEffect(() => {
    if (!chat || !userData.handle) return;

    const userParticipant = chat.participants?.[userData.handle];
    const lastSeenMessageId = userParticipant
      ? userParticipant.lastSeenMessageId
      : null;

    if (lastSeenMessageId) {
      const lastSeenMessage = document.getElementById(lastSeenMessageId);
      if (lastSeenMessage) {
        lastSeenMessage.scrollIntoView({ behavior: "smooth" });
      } else {
        // Scroll to the first unread message if available
        const firstUnreadMessage = chat.messages.find(
          (msg) => !msg.seenBy?.[userData.handle]
        );
        if (firstUnreadMessage) {
          document
            .getElementById(firstUnreadMessage.id)
            ?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [chat, userData.handle]);

  // Effect: Mark messages as seen
  useEffect(() => {
    if (!chat || !userData.handle) return;

    chat.messages.forEach((msg) => {
      if (!msg.seenBy?.[userData.handle] && !seenMessages.has(msg.id)) {
        markMessageAsSeen(msg.id);
        setSeenMessages((prevSeen) => new Set(prevSeen).add(msg.id)); // Add to seen messages
      }
    });
  }, [chat, seenMessages, userData.handle]);


  //mark Message as seen
  // const markMessageAsSeen = (messageId, createdOn) => {
  //   const updates = {};
  //   //const userChatRef = ref(db, `chats/${chatId}/participants/${userData.handle}`);
  //   updates[`chats/${chatId}/messages/${messageId}/seenBy/${userData.handle}`] = true;
  //   updates[`chats/${chatId}/participants/${userData.handle}/lastSeenMessageId`] = messageId;
  //   //updates[`chats/${chatId}/participants/${userData.handle}/lastSeenMessageDate`] = createdOn;

  //   update(ref(db), updates)
  //     .then(() => {
  //       setSeenMessages((prevSeen) => new Set(prevSeen).add(messageId)); // Add to seen messages
  //     })
  //     .catch((error) => console.error("Failed to mark message as seen:", error));
  // };

  // const markMessageAsSeen = (messageId, createdOn) => {
  //   const userChatRef = ref(db, `chats/${chatId}/participants/${userData.handle}`);
  //   update(userChatRef, {
  //     lastSeenMessageId: messageId
  //   });

  //   const messageSeenRef = ref(db, `chats/${chatId}/messages/${messageId}/seenBy/${userData.handle}`);
  //   update(messageSeenRef, true);
  //   //await update(ref(db, `chats/${chatId}/participants`),{ [userHandle]: {'lastSeenMessageId': false, 'timeStamps': false} } );
  //   //await update(ref(db), {[`chats/${id}/id`]: id,});

  //   setSeenMessages((prevSeen) => new Set(prevSeen).add(messageId));
  // };


  // this should be the best one
  const markMessageAsSeen = async (messageId, createdOn) => {
    if (!messageId) return;
    
    try {
      // Prepare the batch of updates
      const updates = {};
      const userChatRef = `chats/${chatId}/participants/${userData.handle}`;
      const messageSeenRef = `chats/${chatId}/messages/${messageId}/seenBy/${userData.handle}`;
    
      // Add the updates for the seen message and last seen message info
      updates[`${messageSeenRef}`] = true;
      updates[`${userChatRef}/lastSeenMessageId`] = messageId;
      //updates[`${userChatRef}/lastSeenMessageDate`] = createdOn;
    
      // Perform the update in Firebase
      await update(ref(db), updates);
  
      // After the update is successful, mark the message as seen locally
      setSeenMessages((prevSeen) => new Set(prevSeen).add(messageId));
    } catch (error) {
      console.error("Failed to mark message as seen:", error);
    }
  };


  // debounce for observer below on order not to send all of the updates to db at once
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  const markMessageAsSeenDebounced = debounce(markMessageAsSeen, 10);

  // Use IntersectionObserver to detect when a message comes into view
  useEffect(() => {
    if (!chat || !userData.handle) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageId = entry.target.getAttribute("data-message-id");
          //const createdOn = entry.target.getAttribute("data-created-on");

          // Check if the message has already been seen by the user
          if (!seenMessages.has(messageId)) {
            //markMessageAsSeen(messageId, createdOn);
            markMessageAsSeenDebounced(messageId);
          }
        }
      });
    });

    // Observe all message elements
    chat.messages.forEach((msg) => {
      const messageElement = document.getElementById(msg.id);
      if (messageElement) {
        observer.observe(messageElement);
      }
    });

    // Clean up the observer
    return () => {
      observer.disconnect();
    };
  }, [chat, seenMessages, userData.handle]);


  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await createChatMessage(chatId, userData.handle, messageContent);
      setMessageContent(""); // Clear the input field after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Mark message as seen
  // const markMessageAsSeen = (messageId) => {
  //   const userChatRef = ref(
  //     db,
  //     `chats/${chatId}/participants/${userData.handle}`
  //   );
  //   update(userChatRef, {
  //     lastSeenMessageId: messageId,
  //   });
  // };

  // Handle adding a participant
  const handleAddParticipant = async (user) => {
    try {
      await addChatParticipant(chatId, user.handle);
    } catch (error) {
      console.error("Failed to add participant:", error);
    }
  };

  return (
    <div className="flex h-full w-full">
      {chat ? (
        <>
          {/* Left side for UserSearch and Messages */}
          <div className="w-3/4 flex flex-col p-4">
            <UserSearch onAddParticipant={handleAddParticipant} />
            <h2 className="text-2xl font-bold mb-4">Chat</h2>

            <ul className="list-none p-0 flex-grow overflow-y-auto">
              {chat.messages.map((msg) => (
                <li
                  key={msg.id}
                  id={msg.id}
                  ref={msg.seenBy?.[userData.handle] ? null : lastSeenRef}
                  className={`mb-2 p-4 rounded-lg shadow-md ${
                    msg.seenBy?.[userData.handle] ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <strong>{msg.author}:</strong> {msg.content} <br />
                  <small className="text-gray-500">
                    {new Date(msg.createdOn).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>

            <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="input input-bordered w-full"
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right side for Participants */}
          <div className="w-1/4 p-4 border-l border-gray-200 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Participants</h3>
            <div className="flex flex-col space-y-4">
              {Object.keys(chat.participants).map((participantHandle) => (
                <Participant
                  key={participantHandle}
                  chatId={chatId}
                  userHandle={userData.handle} /////
                  participantHandle={participantHandle}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>Loading chat...</p>
      )}
    </div>
  );
}
