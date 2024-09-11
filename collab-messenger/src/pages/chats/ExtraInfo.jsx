import { useEffect, useState, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../config/firebase-config";
import TimeStamp from "../../components/chat/TimeStamp";
import { AppContext } from "../../state/app.context";

export default function ExtraInfo({ chatId }) {
  const { userData } = useContext(AppContext);
  const [timeStamps, setTimeStamps] = useState({});

  //console.log (chatId);
  useEffect(() => {
    if (!chatId || !userData?.handle) return;
  
    // Reference to the timestamps in Firebase
    const timeStampRef = ref(db, `chats/${chatId}/participants/${userData.handle}/timeStamps`);
    //console.log (`chats/${chatId}/participants/${userData.handle}/timestamps`);
  
    const unsubscribe = onValue(timeStampRef, (snapshot) => {
      const newData = snapshot.val() || {};
      console.log (newData);
      
      // Check if the new data is different before updating state
      setTimeStamps((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newData)) {
          //console.log('newData is returned');
          return newData;
        }
        return prevState;  // No change in state
      });
    });
  
    // Cleanup the listener when the component unmounts or dependencies change
    return () => unsubscribe();
  }, [chatId, userData?.handle]);
  

  const handleDeleteTimestamp = (messageId) => {
    setTimeStamps((prev) => {
      const newTimestamps = { ...prev };
      delete newTimestamps[messageId];
      return newTimestamps;
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Timestamps</h2>
      {Object.entries(timeStamps).map(([messageId, timestamp]) => (
        <TimeStamp
          key={messageId}
          chatId={chatId}
          messageId={messageId}
          messageDate={timestamp.createdOn}
          title={timestamp.title || ""}
          onDelete={handleDeleteTimestamp}
        />
      ))}
    </div>
  );
}


  //chats/chatId/lastSeen/userData.handle
  //chats/chatId/participants/userData.handle/lastSeenMessageId
  //chats/chatId/messages/messageId/seenBy/userData.handle
  //chats/{chatId}/messages/{messageId}/createdOn