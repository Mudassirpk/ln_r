import React, { SetStateAction } from "react";

export type TAuthContext = {
  user: TUser | null;
  setUser: React.Dispatch<SetStateAction<TUser | null>>;
  logout: () => void;
  loading: boolean;
  posts: TPost[];
  addPost: (post: { user: string; message: string }) => void;
  token: string | null;
  persist: (user: TUser, token: string) => void;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
};

export type TPost = {
  message: string;
  id: string;
  user: string;
  createdAt: Date;
};

export const authContext = React.createContext<TAuthContext | null>(null);

export function useAuth() {
  const ctx = React.useContext(authContext);
  if (!ctx) throw new Error("useAuth should only be used insided auth context");
  return ctx;
}
