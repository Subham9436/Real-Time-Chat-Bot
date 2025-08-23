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
    return <MessageSkeleton />;
  }

  return (
    <div>
      <div>
        <ChatHeader />
      </div>
      <div className=" h-104 mt-2">
        Messages ......
        
      </div>
      <div>
        <MessageInput />
      </div>
    </div>
  );
}
