import { X } from "lucide-react";
import { useAuthStore } from "../store/authstore";
import { useChatStore } from "../store/msgstore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  if (!selectedUser) {
    return;
  }
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilepic || "/avatar.png"}
                alt={selectedUser.fname}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              {selectedUser.fname}
              {selectedUser.lname}
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.has(String(selectedUser.id))
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          style={{ cursor: "pointer" }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
