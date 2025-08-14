import { create } from "zustand";
import { axiosInstance } from "../axiosInstance";
import toast from "react-hot-toast";

interface AuthUser {
  id: number;
  username: string;
  fname: string;
  lname: string;
  password: string;
  profilePic: string;
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
  profilePic: string;
}
interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingin: boolean;
  isUpdatingProfile: boolean;
  isCheckingauthUser: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: SigninData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdatedPic) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoggingin: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  isCheckingauthUser: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("/user/check");
      set({ authUser: res.data });
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
      const res = await axiosInstance.post("/user/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("User Already Exists");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: SigninData) => {
    set({ isLoggingin: true });
    try {
      const res = await axiosInstance.post("/user/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Error Logging-In");
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  },
  updateProfile: async (data: UpdatedPic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/updateProfilePic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error("Error Updating Profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
