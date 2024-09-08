import { useState } from "react";
import AllChats from "./AllChats";
import SingleChat from "./SingleChat";

export default function ChatsMainView() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="flex">
      {/* Left side with All Chats */}
      <div className="w-1/2 p-4">
        <AllChats onSelectChat={setSelectedChatId} />
      </div>

      {/* Right side with Single Chat */}
      <div className="w-1/2 p-4">
        {selectedChatId ? (
          <SingleChat chatId={selectedChatId} />
        ) : (
          <p>Select a chat to view the messages</p>
        )}
      </div>

      {/* Extra information or frame */}
      <div>
        <p>Frame for extra info</p>
      </div>
    </div>
  );
}
