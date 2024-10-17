import React, { useEffect } from "react";
import { useState } from "react";
import { authContext, TAuthContext, TPost, TUser } from "../context/auth";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);

  function logout() {
    setUser(null);
  }

  function persist(user: TUser, token: string) {
    setToken(token);
    setUser(user);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  function addPost(post: { user: string; message: string }) {
    setPosts((prev: TPost[]) => [
      ...prev,
      {
        user: post.user,
        message: post.message,
        createdAt: new Date(),
        id: Math.random().toString(),
      },
    ]);
  }

  const values = {
    user,
    setUser,
    logout,
    loading,
    posts,
    addPost,
    token,
    persist,
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}
