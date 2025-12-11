// src/authUtils.js

// Clears token + user from localStorage
export function clearAuthToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Stores token & user if needed
export function saveAuth(token, user = null) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

// Reads token
export function getToken() {
  return localStorage.getItem("token");
}

// Reads user 
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
}
