import { useState, useEffect } from "react";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUserId(null);
      setToken(null);
      return;
    }
    try {
      const base64Url = storedToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      if (!payload.id) throw new Error("Token inválido: sin ID");
      setUserId(payload.id.toString());
      setToken(storedToken);
    } catch {
      setUserId(null);
      setToken(null);
    }
  }, []);

  return { userId, token };
}