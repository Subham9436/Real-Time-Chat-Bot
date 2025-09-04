import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../axiosInstance";

interface Message {
  id: number;
  sendersId: number;
  ReceiversId: number;
  Text: string | null;
  Image: string | null;
  createdAt: string;
}
interface messageData {
  text: string | null;
  image: string | null;
}

interface ChatUser {
  id: number;
  username: string;
  fname: string;
  lname: string;
  profilepic?: string;
}

type UserId = number | string;

interface ChatStore {
  messages: Message[];
  users: ChatUser[];
  selectedUser: ChatUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: UserId) => Promise<void>;
  sendMessage: ({ text, image }: messageData) => Promise<void>;
  setSelectedUser: (selectedUser: ChatUser | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<ChatUser[]>("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Error fetching Users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Error fetching Messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser.id}`,
        { text, image }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error("Error Sending Message");
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
