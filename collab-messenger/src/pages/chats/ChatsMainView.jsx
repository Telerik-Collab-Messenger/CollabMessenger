import { useState } from "react";
import AllChats from "./AllChats";
import SingleChat from "./SingleChat";
import ExtraInfo from "./ExtraInfo";

export default function ChatsMainView() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [hasScrolledToLastSeen, setHasScrolledToLastSeen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left side with All Chats - fixed at 300px width */}
      <div className="w-[300px] p-4 overflow-y-auto">
        <AllChats onSelectChat={setSelectedChatId} setHasScrolledToLastSeen={setHasScrolledToLastSeen} />
      </div>

      {/* Middle with Single Chat - fixed at 600px width */}
      <div className="w-[1250px] p-4 overflow-y-auto">
        {selectedChatId ? (
          <SingleChat chatId={selectedChatId} hasScrolledToLastSeen={hasScrolledToLastSeen} setHasScrolledToLastSeen={setHasScrolledToLastSeen}/>
        ) : (
          <p>Select a chat to view the messages</p>
        )}
      </div>

      {/* Right side with Extra Info - fixed at 300px width */}
      <div className="w-[300px] p-4 overflow-y-auto">
        <ExtraInfo />
      </div>
    </div>
  );
}

