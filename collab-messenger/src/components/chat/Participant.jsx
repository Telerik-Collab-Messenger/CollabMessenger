export default function Participant( {participantHandle}) {
  return (
    <div className="relative bg-base-300 rounded-lg p-6 max-w-md h-[340px] overflow-hidden">
      {/* Container to hold the drawer */}
      <div className="drawer h-full">
        {/* Drawer Toggle */}
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        {/* Content of the container */}
        <div className="flex flex-col h-full justify-between drawer-content">
          {/* Top Section with Avatar */}
          <div className="flex items-start">
            {/* Avatar */}
            <div className="avatar flex-shrink-0">
              <div className="ring-primary ring-offset-base-100 w-48 h-48 rounded-full ring ring-offset-2">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Profile"
                />
              </div>
            </div>
            <div className="ml-4 mt-4">
              <div className="text-lg font-semibold">Chat with {participantHandle}</div>
            </div>
          </div>

          {/* Buttons Section at the Bottom Right */}
          <div className="flex flex-col items-end space-y-2 mb-2">
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button w-24 h-8 text-sm"
            >
              Open Drawer
            </label>
            <label
              htmlFor="my-drawer"
              className="btn btn-secondary drawer-button w-24 h-8 text-sm"
            >
              Leave Chat
            </label>
          </div>
        </div>

        {/* Drawer Side */}
        <div className="drawer-side absolute inset-0 overflow-hidden">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
            <li>
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button w-full mt-4"
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
