import { useEffect, useState, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../config/firebase-config";
import TimeStamp from "../../components/chat/TimeStamp";
import { AppContext } from "../../state/app.context";
import PropTypes from "prop-types";

export default function ExtraInfo({ chatId }) {
  const { userData } = useContext(AppContext);
  const [timeStamps, setTimeStamps] = useState({});

  useEffect(() => {
    if (!chatId || !userData?.handle) return;

    const timeStampRef = ref(db, `chats/${chatId}/participants/${userData.handle}/timeStamps`);

    const unsubscribe = onValue(timeStampRef, (snapshot) => {
      const newData = snapshot.val() || {};
      console.log (newData);
      
      setTimeStamps((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevState;  
      });
    });

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

ExtraInfo.propTypes = {
  chatId: PropTypes.string.isRequired,  
};