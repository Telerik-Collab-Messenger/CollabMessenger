import { leaveChat } from "../../services/chat.services";
import { useNavigate } from "react-router-dom";

export default function Participant({ chatId, participantHandle }) {
  const drawerId = `drawer-${participantHandle}`;

  const navigate = useNavigate();

  const handleLeaveChat = async () => {
    try {
      const result = await leaveChat(chatId, participantHandle);
      if (result.success) {
        // Navigate to ChatsMainView if the chat was deleted or updated successfully
        navigate('/chatsmainview');
      } 

    } catch (error) {
      console.error("Failed to leave chat:", error);
    }
  };

  return (
    <div className="relative bg-base-300 rounded-lg p-4 max-w-[280px] h-[238px] overflow-hidden">
      {/* Container to hold the drawer */}
      <div className="drawer h-full"> 
        {/* Drawer Toggle */}
        <input id={drawerId} type="checkbox" className="drawer-toggle" />

        {/* Content of the container */}
        <div className="flex flex-col h-full justify-between drawer-content">
          {/* Top Section with Avatar */}
          <div className="flex items-start">
            {/* Avatar */}
            <div className="avatar flex-shrink-0">
              <div className="ring-primary ring-offset-base-100 w-32 h-32 rounded-full ring ring-offset-2">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Profile"
                />
              </div>
            </div>
            <div className="ml-3 mt-3">
              <div className="text-base font-semibold">Chat with {participantHandle}</div>
            </div>
          </div>

          {/* Buttons Section at the Bottom Right */}
          <div className="flex flex-col items-end space-y-1.5 mb-1.5">
            <label
              htmlFor={drawerId}
              className="btn btn-primary drawer-button w-16 h-6 text-xs"
            >
              Open Drawer
            </label>
            <label>
            <button
            className="btn btn-secondary w-16 h-6 text-xs"
            onClick={handleLeaveChat}
          >
            Leave Chat
          </button>
            </label>
          </div>
        </div>

        {/* Drawer Side */}
        <div className="drawer-side absolute inset-0 overflow-hidden">
          <label
            htmlFor={drawerId}
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content w-56 p-2">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
            <li>
              <label
                htmlFor={drawerId}
                className="btn btn-primary drawer-button w-full mt-2"
              >
                Close Drawer
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
