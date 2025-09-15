import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

     // Validate required fields
    if (!username || !password) {
      if (!username) setErrors((prev) => ({ ...prev, username: "Username is required" }));
      if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
      setLoading(false);
      return;
    }

    // Validation for registration
    if (method === "register") {
      if (!email || !password || !passwordConfirm) {
        if (!email) setErrors((prev) => ({ ...prev, email: "Email is required" }));
        if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
        if (!passwordConfirm) setErrors((prev) => ({ ...prev, passwordConfirm: "Confirm password is required" }));
        setLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "Passwords do not match" }));
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }));
        setLoading(false);
        return;
      }
    }

    try {
      let payload;

      if (method === "login") {
        payload = { username, password };
      } else {
        payload = {
          username,
          email,
          full_name: fullName,
          password,
          password_confirm: passwordConfirm,
        };
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiUrl}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("userType", res.data.user.user_type);

        if (data.user.user_type === 'admin') {
          navigate("/admin_dashboard");
        } else {
          navigate("/client_dashboard");
        }
      } else {
        if (data.username) setErrors((prev) => ({ ...prev, username: data.username[0] }));
        if (data.email) setErrors((prev) => ({ ...prev, email: data.email[0] }));
        if (data.password) setErrors((prev) => ({ ...prev, password: data.password[0] }));
        if (data.password_confirm) setErrors((prev) => ({ ...prev, passwordConfirm: data.password_confirm[0] }));
        if (data.non_field_errors) setErrors((prev) => ({ ...prev, general: data.non_field_errors[0] }));
        else setErrors((prev) => ({ ...prev, general: "Registration/Login failed. Please try again." }));
      }

    } catch (error) {
      console.error("Network error:", error);
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <div className="form-group">
            <input
              className={`form-input ${errors.username ? "error" : ""}`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

      <div className="form-group">
        <input
          className={`form-input ${errors.password ? "error" : ""}`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

{method === "register" && (
        <>
          <div className="form-group">
            <input
              className={`form-input ${errors.full_name ? "error" : ""}`}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.username ? "error" : ""}`}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="...@gmail.com"
              autoComplete="email"
            />
            {errors.username && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.password_confirm ? "error" : ""}`}
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
            {errors.password_confirm && <span className="error-text">{errors.password_confirm}</span>}
          </div>
        </>
      )}

      {loading && <LoadingIndicator />}

      <button className="form-button" type="submit" disabled={loading}>
        {name}
      </button>
    </form>
  );
}

export default Form;