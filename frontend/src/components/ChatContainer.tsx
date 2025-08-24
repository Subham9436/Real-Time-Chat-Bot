import { useChatStore } from "../store/msgstore";
import ChatHeader from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./skeletons/message";

export function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    sendMessage,
    selectedUser,
  } = useChatStore();
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
      <div className="border h-100 mt-2">Messages ......</div>
      <div className="">
        <MessageInput />
      </div>
    </div>
  );
}
