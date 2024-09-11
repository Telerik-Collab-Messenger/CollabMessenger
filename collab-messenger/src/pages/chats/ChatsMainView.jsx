import { useState } from "react";
import AllChats from "./AllChats";
import SingleChat from "./SingleChat";
import ExtraInfo from "./ExtraInfo";

export default function ChatsMainView() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [hasScrolledToLastSeen, setHasScrolledToLastSeen] = useState(false);
  const [chatTopic, setChatTopic] = useState("Casual"); 

  const handleChatTopicChange = (newTopic) => {
    setChatTopic(newTopic);
  };

  return (
    <div className="flex h-screen">
      <div className="w-[300px] p-4 overflow-y-auto">
        <AllChats onSelectChat={setSelectedChatId} setHasScrolledToLastSeen={setHasScrolledToLastSeen} />
      </div>
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
      <div className="w-[300px] p-4 overflow-y-auto">
        <ExtraInfo chatId={selectedChatId} />
      </div>
    </div>
  );
}

