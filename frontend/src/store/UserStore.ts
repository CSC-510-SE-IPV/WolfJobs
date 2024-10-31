import { create } from "zustand";

type UserState = {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
  dob: string;
  skills: string;
  phonenumber: string;
  id: string;
  availability: string;
  gender: string;
  hours: string;
  isLoggedIn: boolean;
  affiliation: string;
  resume: string;
  resumeId: string;
};

type UserAction = {
  updateUser: (user: Partial<UserState>) => void; // Single update method
  resetUser: () => void; // Optional: Reset user state
};

export const useUserStore = create<UserState & UserAction>()((set) => ({
  name: "",
  email: "",
  password: "",
  address: "",
  role: "",
  dob: "",
  skills: "",
  phonenumber: "",
  id: "",
  availability: "",
  gender: "",
  hours: "",
  affiliation: "",
  isLoggedIn: false,
  resume: "",
  resumeId: "",

  // Unified update method for any user field
  updateUser: (user: Partial<UserState>) => {
    set((state) => ({ ...state, ...user }));
  },

  // Optional: Reset method to clear all user data
  resetUser: () => {
    set(() => ({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "",
      dob: "",
      skills: "",
      phonenumber: "",
      id: "",
      availability: "",
      gender: "",
      hours: "",
      affiliation: "",
      isLoggedIn: false,
      resume: "",
      resumeId: "",
    }));
  },
}));
