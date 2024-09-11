import { useContext, useEffect, useState } from "react";
import { update, ref, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { AppContext } from "../../state/app.context";
import PropTypes from 'prop-types'; 

export default function TimeStamp({ chatId, messageId, messageDate, title: initialTitle, onDelete }) {
  const [title, setTitle] = useState("");
  const { userData } = useContext(AppContext);


  useEffect(() => {
    setTitle(initialTitle);  
  }, [initialTitle]);

  const handleGoClick = () => {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteClick = async () => {
    try {
      await remove(ref(db, `chats/${chatId}/participants/${userData.handle}/timeStamps/${messageId}`));
      if (onDelete) onDelete(messageId); 
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

TimeStamp.propTypes = {
  chatId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  messageDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
}