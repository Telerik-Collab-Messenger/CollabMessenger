import { useContext, useEffect, useState } from "react";
import { update, ref, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { AppContext } from "../../state/app.context";

export default function TimeStamp({ chatId, messageId, messageDate, title: initialTitle, onDelete }) {
  const [title, setTitle] = useState("");
  const { userData } = useContext(AppContext);


  useEffect(() => {
    setTitle(initialTitle);  
  }, [initialTitle]);

  // Handle "Go" button click (scroll to the message)
  const handleGoClick = () => {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle "Delete" button click (remove timestamp)
  const handleDeleteClick = async () => {
    try {
      // Remove timestamp from Firebase
      await remove(ref(db, `chats/${chatId}/participants/${userData.handle}/timeStamps/${messageId}`));
      if (onDelete) onDelete(messageId); // Notify parent to remove from UI
    } catch (error) {
      console.error("Failed to delete timestamp:", error);
    }
  };

  // Handle title input change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    update(ref(db, `chats/${chatId}/participants/${userData.handle}/timeStamps/${messageId}`), {
      title: newTitle,
    });
  };

  return (
    <div className="w-[250px] border p-2 mb-2">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter title"
        className="input input-bordered w-full mb-2"
      />
      <p className="text-sm text-gray-500">{new Date(messageDate).toLocaleString()}</p>
      <div className="flex justify-between mt-2">
        <button className="btn btn-primary btn-sm" onClick={handleGoClick}>Go</button>
        <button className="btn btn-error btn-sm" onClick={handleDeleteClick}>Delete</button>
      </div>
    </div>
  );
}
