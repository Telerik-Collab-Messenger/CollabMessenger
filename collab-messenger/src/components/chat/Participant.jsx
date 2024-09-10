import { leaveChat } from "../../services/chat.services";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getUserByHandle } from "../../services/user.services";

export default function Participant({ chatId, participantHandle }) {
  const [participant, setParticipant] = useState(null);
  const drawerId = `drawer-${participantHandle}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByHandle(participantHandle);
        if (user) {
          setParticipant(user);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [participantHandle]);

  const handleLeaveChat = async () => {
    try {
      const result = await leaveChat(chatId, participantHandle);
      if (result.success) {
        navigate('/chatsmainview');
      } 
    } catch (error) {
      console.error("Failed to leave chat:", error);
    }
  };

  return (
    <div className="relative bg-base-300 rounded-lg p-4 max-w-[280px] h-[238px] overflow-hidden">
      <div className="drawer h-full"> 
        <input id={drawerId} type="checkbox" className="drawer-toggle" />

        <div className="flex flex-col h-full justify-between drawer-content">
          <div className="flex items-start">
            <div className="avatar flex-shrink-0">
              <div className="ring-primary ring-offset-base-100 w-32 h-32 rounded-full ring ring-offset-2">
                <img
                  src={participant?.photoURL || '/img/newDefaultUserIMG.jpeg'}
                  alt="Profile"
                  onError={(e) => {
                    console.log('Error loading image:', e);
                    e.target.src = '/img/newDefaultUserIMG.jpeg';
                  }}
                />
              </div>
            </div>
            <div className="ml-3 mt-3">
              <div className="text-base font-semibold">Chat with {participantHandle}</div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1.5 mb-1.5">
            <label
              htmlFor={drawerId}
              className="btn btn-primary drawer-button w-16 h-6 text-xs"
            >
              Open Drawer
            </label>
            <button
              className="btn btn-secondary w-16 h-6 text-xs"
              onClick={handleLeaveChat}
            >
              Leave Chat
            </button>
          </div>
        </div>

        <div className="drawer-side absolute inset-0 overflow-hidden">
          <label
            htmlFor={drawerId}
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content w-56 p-2">
            {participant && (
              <>
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">First Name:</span>
                <span>{participant.firstName || 'N/A'}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">Last Name:</span>
                <span>{participant.lastName || 'N/A'}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">Phone Number:</span>
                <span>{participant.phoneNumber || 'N/A'}</span>
              </div>
              <label
                htmlFor={drawerId}
                className="btn btn-primary drawer-button w-full mt-2"
              >
                Close Drawer
              </label>
            </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// old working code

// import { leaveChat } from "../../services/chat.services";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from 'react';
// import { getUserByHandle } from "../../services/user.services";

// export default function Participant({ chatId, participantHandle}) {
//   const [participantPhotoURL, setParticipantPhotoURL] = useState(null);
//   const drawerId = `drawer-${participantHandle}`;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = await getUserByHandle(participantHandle);
//         if (user) {
//           setParticipantPhotoURL(user.photoURL); 
//         } else {
//           console.error('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [participantHandle]);

//   const handleLeaveChat = async () => {
//     try {
//       const result = await leaveChat(chatId, participantHandle);
//       if (result.success) {
//         // Navigate to ChatsMainView if the chat was deleted or updated successfully
//         navigate('/chatsmainview');
//       } 

//     } catch (error) {
//       console.error("Failed to leave chat:", error);
//     }
//   };

//   return (
//     <div className="relative bg-base-300 rounded-lg p-4 max-w-[280px] h-[238px] overflow-hidden">
//       {/* Container to hold the drawer */}
//       <div className="drawer h-full"> 
//         {/* Drawer Toggle */}
//         <input id={drawerId} type="checkbox" className="drawer-toggle" />

//         {/* Content of the container */}
//         <div className="flex flex-col h-full justify-between drawer-content">
//           {/* Top Section with Avatar */}
//           <div className="flex items-start">
//             {/* Avatar */}
//             <div className="avatar flex-shrink-0">
//               <div className="ring-primary ring-offset-base-100 w-32 h-32 rounded-full ring ring-offset-2">
//               <img
//                   src={participantPhotoURL || '/img/newDefaultUserIMG.jpeg'}
//                   alt="Profile"
//                   onError={(e) => {
//                     console.log('Error loading image:', e);
//                     e.target.src = '/img/newDefaultUserIMG.jpeg';
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="ml-3 mt-3">
//               <div className="text-base font-semibold">Chat with {participantHandle}</div>
//             </div>
//           </div>

//           {/* Buttons Section at the Bottom Right */}
//           <div className="flex flex-col items-end space-y-1.5 mb-1.5">
//             <label
//               htmlFor={drawerId}
//               className="btn btn-primary drawer-button w-16 h-6 text-xs"
//             >
//               Open Drawer
//             </label>
//             <label>
//             <button
//             className="btn btn-secondary w-16 h-6 text-xs"
//             onClick={handleLeaveChat}
//           >
//             Leave Chat
//           </button>
//             </label>
//           </div>
//         </div>

//         {/* Drawer Side */}
//         <div className="drawer-side absolute inset-0 overflow-hidden">
//           <label
//             htmlFor={drawerId}
//             aria-label="close sidebar"
//             className="drawer-overlay"
//           ></label>
//           <ul className="menu bg-base-200 text-base-content w-56 p-2">
//             {/* Sidebar content here */}
//             <li>
//               <a>Sidebar Item 1</a>
//             </li>
//             <li>
//               <a>Sidebar Item 2</a>
//             </li>
//             <li>
//               <label
//                 htmlFor={drawerId}
//                 className="btn btn-primary drawer-button w-full mt-2"
//               >
//                 Close Drawer
//               </label>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
