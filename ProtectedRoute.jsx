import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, apiBase = "http://localhost:2000" }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        const res = await fetch(`${apiBase}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(res.ok);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase]);

  if (loading) return <div>Loading...</div>;
  return authorized ? children : <Navigate to="/login" replace />;
}



