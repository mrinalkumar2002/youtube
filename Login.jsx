// src/Pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdHome, IoMdLogIn } from "react-icons/io";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // If user was redirected to login from a protected route
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:2000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // include cookies if server sets them
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || `Login failed (status ${res.status})`);
        setLoading(false);
        return;
      }

      if (!data?.token) {
        setError("Login failed: no token returned from server.");
        setLoading(false);
        return;
      }

      // Save token (you may also use cookies; adjust to your auth strategy)
      localStorage.setItem("token", data.token);

      const userId = data?.user?.id || data?.user?._id;
      if (from && from !== "/") {
        navigate(from, { replace: true });
      } else if (userId) {
        navigate(`/channel/${userId}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin} aria-label="Login form">
        <div className="login-top">
          <h2>Sign in</h2>
          <button className="home-button" onClick={goHome} aria-label="Go home">
            <IoMdHome /> Home
          </button>
        </div>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your registered email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && <div className="login-error" role="alert">{error}</div>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Signing in..." : <>Login <IoMdLogIn /></>}
        </button>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;



