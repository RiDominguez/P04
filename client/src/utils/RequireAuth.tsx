// src/components/RequireAuth.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return children;
};
