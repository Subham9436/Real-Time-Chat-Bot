import { create } from "zustand";
import { axiosInstance } from "../axiosInstance";

interface AuthUser {
  id: number;
  username: string;
  fname: string;
  lname: string;
}
interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingin: boolean;
  isUpdatingProfile: boolean;
  isCheckingauthUser: boolean;

  checkAuth: () => Promise<void>;
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
}));
