import { useEffect } from "react";
import { useAuthStore } from "../store/authstore";
import { useChatStore } from "../store/msgstore";
import ChatHeader from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./skeletons/message";

export function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    getMessages(selectedUser.id);
  }, [selectedUser?.id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div>
      <div>
        <ChatHeader />
      </div>
      <div className=" h-128 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.sendersId === authUser?.id ? "chat-end" : "chat-start"
            }`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sendersId === authUser?.id
                      ? authUser?.profilepic || "/avatar.png"
                      : selectedUser?.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.Image && (
                <img
                  src={message.Image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.Text && <p>{message.Text}</p>}
            </div>
          </div>
        ))}
      </div>
      <div>
        <MessageInput />
      </div>
    </div>
  );
}
