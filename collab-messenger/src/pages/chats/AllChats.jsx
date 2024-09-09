import { useEffect, useState, useContext } from 'react';
import { calculateUnreadMessages, createChat, getChatByID } from '../../services/chat.services';
import { addChatToUser } from '../../services/user.services';  // Import the function
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../state/app.context'; 

export default function AllChats({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserChats = async () => { 
      if (!userData || !userData.chats) {
        setLoading(false);
        //alert('No available chats'); //this breaks the code for some reason
        return;
      }
      try {
        //const chatIds = Object.values(userData.chats);
        const chatIds = Object.keys(userData.chats); 

        if (chatIds.length === 0) {
          setLoading(false); 
          return;
        }

        //const chatPromises = chatIds.map(chatId => getChatByID(chatId));
        const chatPromises = chatIds.map(async chatId => {
          const chat = await getChatByID(chatId);
          const unreadCount = await calculateUnreadMessages(chatId, userData.handle); // Await the unread count calculation
          return {
            ...chat,
            unreadCount
          };
        });

        const userChats = await Promise.all(chatPromises);
        //console.log (`user chats ${userChats}`)
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

  const handleNewChatClick = async () => {
    if (!user) {
      alert('Please log in to start a chat');
      return;
    }

    try {
      const newChatId = await createChat(userData.handle || user.email || user.displayName || 'Anonymous');

      // Add the new chat ID to the user's chat list in Firebase
      await addChatToUser(userData.handle, newChatId);

        // Fetch the new chat data 
      const newChat = await getChatByID(newChatId);

       // Update the local 'chats' state with the newly created chat
      setChats((prevChats) => [...prevChats, newChat]);

      // Update the app state to include the new chat
      //const updatedChats = { ...userData.chats, newChatId }; // TODO: to check!! the new chat is not added
      //const updatedChats = userData.chats ? { ...userData.chats, [newChatId]: newChatId } : { [newChatId]: newChatId };
      const updatedChats = userData.chats 
        ? { ...userData.chats, [newChatId]: true }  // Update with chatId: true
        : { [newChatId]: true };  // Initialize with new chat

      setAppState(prev => ({
        ...prev,
        userData: { ...prev.userData, chats: updatedChats }
      }));

      console.log (`updated chats of userData; All user chats IDs: ${Object.values (userData.chats)}`);
      
      // Navigate to the new chat
      navigate(`/chat/${newChatId}`);//TODO to fix since this has different implementation 
    } catch (error) {
      console.error('Failed to create a new chat:', error);
      setError('Failed to create a new chat.');
    }
  };
//TODO fixing new comment counter
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
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
            </svg>
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
                d="M13 16h-1v-4h1m0 4h-1m0-4h.01M12 6h.01"
              />
            </svg>
            <span>No chats available.</span>
          </div>
        </div>
      ) : (
        <ul className="list-group space-y-2">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="list-group-item border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex justify-between">
                <span>
                  {chat.author} - {new Date(chat.createdOn).toLocaleString()}
                </span>
              </div>
                {chat.unreadCount > 0 && (
                <span className="badge badge-primary">{chat.unreadCount}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) 
}

