import { useState } from "react";
import { useChatStore } from "../store/msgstore";

export function MessageInput() {
  const [message,setMessage]=useState("")
  const {sendMessage}=useChatStore()
  
  const handleclick = () => {
    console.log("Send Message Clicked");
  };

  return (
    <div className="flex-center w-full gap-2 px-4">
      <div>
        <input
          type="text"
          placeholder="Message"
          className="border rounded-lg px-4 py-3 w-full sm:w-80 md:w-96 lg:w-[56rem] focus:outline-none focus:ring-2"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />
      </div>
      <div className="">
        <button
          onClick={handleclick}
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
            style={{ cursor: "pointer" }}
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
