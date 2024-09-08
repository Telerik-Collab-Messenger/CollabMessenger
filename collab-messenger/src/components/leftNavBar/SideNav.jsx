import './SideNav.css';

export default function SideNav() {
  return (
    <div id="navbar" className="flex flex-col bg-emerald-200 h-full w-[6rem] border-r border-black-100 items-center">
      <div id="button-container" className="mt-5 flex flex-col">
        <button className="bg-green-500 text-white w-20 h-10 px-4 py-2 rounded flex items-center justify-center" onClick={() => window.location.href='/teams'}>
          Teams
        </button>
        <button className="bg-green-500 text-white mt-5 w-20 h-10 px-4 py-2 rounded flex items-center justify-center" onClick={() => window.location.href='/chatsmainview'}>
          Chats
        </button>
        <button className="bg-green-500 text-white mt-5 w-20 h-10 px-4 py-2 rounded flex items-center justify-center">
          Calls
        </button>
      </div>
    </div>
  );
}