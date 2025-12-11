// src/Pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { IoMdHome } from "react-icons/io";
import { AiOutlineUserAdd } from "react-icons/ai";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:2000";

  const goHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      return setError("Please fill all fields.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return setError(data.message || "Registration failed.");
      }

      // Token may come via body or cookie — handle both.
      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleRegister}>
        <button className="home-button" onClick={goHome}>
          <IoMdHome /> Home
        </button>

        <h2>Create an account</h2>

        {error && <div className="form-error">{error}</div>}

        <label>Full name</label>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm password</label>
        <input
          type="password"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"} <AiOutlineUserAdd />
        </button>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

