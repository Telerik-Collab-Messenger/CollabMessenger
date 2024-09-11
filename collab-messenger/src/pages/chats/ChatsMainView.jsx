import { useState } from "react";
import AllChats from "./AllChats";
import SingleChat from "./SingleChat";
import ExtraInfo from "./ExtraInfo";

export default function ChatsMainView() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [hasScrolledToLastSeen, setHasScrolledToLastSeen] = useState(false);
  const [chatTopic, setChatTopic] = useState("Casual"); // State to manage chat topic

  // Callback to handle chat topic changes from SingleChat
  const handleChatTopicChange = (newTopic) => {
    setChatTopic(newTopic);
  };

  return (
    <div className="flex h-screen">
      {/* Left side with All Chats - fixed at 300px width */}
      <div className="w-[300px] p-4 overflow-y-auto">
        <AllChats onSelectChat={setSelectedChatId} setHasScrolledToLastSeen={setHasScrolledToLastSeen} />
      </div>

      {/* Middle with Single Chat - fixed at 600px width */}
      <div className="w-[1250px] p-4 overflow-y-auto">
        {selectedChatId ? (
          <SingleChat chatId={selectedChatId} 
          hasScrolledToLastSeen={hasScrolledToLastSeen} 
          setHasScrolledToLastSeen={setHasScrolledToLastSeen}
          chatTopic={chatTopic}
          onChatTopicChange={handleChatTopicChange}
          />
        ) : (
          <p>Select a chat to view the messages</p>
        )}
      </div>

      {/* Right side with Extra Info - fixed at 300px width */}
      <div className="w-[300px] p-4 overflow-y-auto">
        <ExtraInfo chatId={selectedChatId} />
      </div>
    </div>
  );
}

