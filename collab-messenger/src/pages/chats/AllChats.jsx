import { useEffect, useState, useContext } from "react";
import {
  calculateUnreadMessages,
  createChat,
  getChatByID,
} from "../../services/chat.services";
import { addChatToUser } from "../../services/user.services"; 
import { AppContext } from "../../state/app.context";
import PropTypes from "prop-types";


export default function AllChats({ onSelectChat, setHasScrolledToLastSeen }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, userData, setAppState } = useContext(AppContext);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (!userData || !userData.chats) {
        setLoading(false);
        return;
      }
      try {
        const chatIds = Object.keys(userData.chats);

        if (chatIds.length === 0) {
          setLoading(false);
          return;
        }
        const chatPromises = chatIds.map(async (chatId) => {
          const chat = await getChatByID(chatId);
          const unreadCount = await calculateUnreadMessages(
            chatId,
            userData.handle
          ); 
          return {
            ...chat,
            unreadCount,
          };
        });

        const userChats = await Promise.all(chatPromises);
        setChats(userChats);
      } catch (error) {
        setError(`Failed to load chats. ${error}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserChats();
  }, [userData]);

  const handleSelectChat = (chatId) => {
    setHasScrolledToLastSeen(false); 
    onSelectChat(chatId);
  };

  const handleNewChatClick = async () => {
    if (!user) {
      alert("Please log in to start a chat");
      return;
    }

    try {
      const newChatId = await createChat(
        userData.handle || user.email || user.displayName || "Anonymous"
      );

      await addChatToUser(userData.handle, newChatId);

      const newChat = await getChatByID(newChatId);
      setChats((prevChats) => [...prevChats, newChat]);

      const updatedChats = userData.chats
        ? { ...userData.chats, [newChatId]: true } 
        : { [newChatId]: true }; 

      setAppState((prev) => ({
        ...prev,
        userData: { ...prev.userData, chats: updatedChats },
      }));

      console.log(
        `updated chats of userData; All user chats IDs: ${Object.values(
          userData.chats
        )}`
      );

      handleSelectChat(newChatId);

    } catch (error) {
      console.error("Failed to create a new chat:", error);
      setError("Failed to create a new chat.");
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">All Chats</h2>
      <button
        onClick={handleNewChatClick}
        className="btn btn-primary mb-2 w-full"
      >
        Start New Chat
      </button>
      <ul className="space-y-2">
        {chats.map((chat) => {
          const isGroupChat = chat.participants && Object.keys(chat.participants).length > 2;
          const chatLabel = chat.isTeamChat
            ? chat.teamName 
            : isGroupChat
            ? 'Group Chat' 
            : "1-on-1"; 
          
          return (
            <li
              key={chat.id}
              className="p-2 rounded-lg border shadow-sm hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{chat.topic || "Casual"}</span>
              {chat.unreadCount > 0 && (
                <span className="badge badge-primary">unread: {chat.unreadCount}</span>
              )} 
            </div>
              <div className="flex justify-between">
                <span>{chatLabel}</span>
                <span className="text-xs">{new Date(chat.createdOn).toLocaleString()}</span>
              </div>
             
            </li>
          );
        })}
      </ul>
    </div>
  );
}

AllChats.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  setHasScrolledToLastSeen: PropTypes.func.isRequired,
};