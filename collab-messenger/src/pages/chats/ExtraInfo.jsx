export default function ExtraInfo() {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Extra Info</h2>
        <p>Here you can place any extra information.
            Timestamps
        </p>
        {/* Time Stamp Implementation */}
      </div>
    );
  }
  

  //chats/chatId/lastSeen/userData.handle
  //chats/chatId/participants/userData.handle/lastSeenMessageId
  //chats/chatId/messages/messageId/seenBy/userData.handle
  //chats/{chatId}/messages/{messageId}/createdOn