import { create } from "zustand";
import { axiosInstance } from "../axiosInstance";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface AuthUser {
  id: number;
  username: string;
  fname: string;
  lname: string;
  password: string;
  profilepic: string;
  createdAt: string;
}
interface SignupData {
  username: string;
  fname: string;
  lname: string;
  password: string;
}
interface SigninData {
  username: string;
  password: string;
}
interface UpdatedPic {
  profilepic: string;
}
interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingin: boolean;
  isUpdatingProfile: boolean;
  isCheckingauthUser: boolean;
  onlineUsers: Set<string>;
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: SigninData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdatedPic) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isLoggingin: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  isCheckingauthUser: true,
  onlineUsers: new Set<string>(),
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("/user/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      console.log("error authenticating ", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingauthUser: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/user/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("User Already Exists");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: SigninData) => {
    set({ isLoggingin: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/user/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Invalid Credentials");
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post<AuthUser>("/user/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
    }
  },
  updateProfile: async (data: UpdatedPic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put<AuthUser>(
        "/user/updateProfilePic",
        data
      );
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error("Error Updating Profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;

    if (socket?.connected) return;

    const newSocket: Socket = io("http://localhost:5000", {
      query: {
        userId: authUser.id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: new Set(userIds) });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
