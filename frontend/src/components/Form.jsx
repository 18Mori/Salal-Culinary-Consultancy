import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passFeedback, setPassFeedback] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clears previous errors

    // Validations logic
    if (!username) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      setLoading(false);
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      setLoading(false);
      return;
    }

    if (method === "register") {
      if (!email) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
        setLoading(false);
        return;
      }
      if (!firstName) {
        setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
        setLoading(false);
        return;
      }
      if (!lastName) {
        setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
        setLoading(false);
        return;
      }
      if (!passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "Confirm password is required" }));
        setLoading(false);
        return;
      }
      if (password !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "Passwords do not match" }));
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        setLoading(false);
        return;
      }

      // Password strength val
      const passwordRequirements = {
        length: password.length >= 8,
        letter: /[A-Za-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%]/.test(password),
      };

      const passwordErrors = {};

      if (!passwordRequirements.length) {
        passwordErrors.password = "Password must be at least 8 characters";
      }
      if (!passwordRequirements.letter) {
        passwordErrors.password = "Password must contain at least one letter";
      }
      if (!passwordRequirements.number) {
        passwordErrors.password = "Password must contain at least one number";
      }
      if (!passwordRequirements.symbol) {
        passwordErrors.password = "Password must contain at least one symbol: !@#$%";
      }

      if (Object.keys(passwordErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...passwordErrors }));
        setLoading(false);
        return;
      }
    }

    // api call
    try {
      let payload;
      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint = method === "login"
        ? `${apiUrl}/api/auth/login/`
        : `${apiUrl}/api/auth/register/`;

      if (method === "login") {
        payload = { username, password };
      } else {
        payload = {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          password_confirm: passwordConfirm,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Handle server-side errors
      if (!res.ok) {
        if (data.username) setErrors((prev) => ({ ...prev, username: data.username[0] }));
        if (data.email) setErrors((prev) => ({ ...prev, email: data.email[0] }));
        if (data.first_name) setErrors((prev) => ({ ...prev, firstName: data.first_name[0] }));
        if (data.last_name) setErrors((prev) => ({ ...prev, lastName: data.last_name[0] }));
        if (data.password) setErrors((prev) => ({ ...prev, password: data.password[0] }));
        if (data.password_confirm) setErrors((prev) => ({ ...prev, passwordConfirm: data.password_confirm[0] }));
        if (data.non_field_errors) setErrors((prev) => ({ ...prev, general: data.non_field_errors[0] }));
        else setErrors((prev) => ({ ...prev, general: "Registration/Login failed. Please try again." }));
        return; 
      }

      // Save tokens and redirect
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      if (data.user && data.user.user_type === "admin") {
        navigate("/admin_index");
      } else {
        navigate("/client_index");
      }

    } catch (error) {
      console.error("Network error:", error);
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setPassFeedback({
      length: newPassword.length >= 8,
      letter: /[A-Za-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      symbol: /[!@#$%]/.test(newPassword),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      {errors.general && <div className="error-message">{errors.general}</div>}

      {method === "login" && (
        <>
          <div className="form-group">
            <input
              className={`form-input ${errors.username ? "error" : ""}`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              autoFocus
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
          <a href="/register">Register</a>
          <a href="/">Back</a>
        </>
      )}

      {method === "register" && (
        <>
          <div className="form-group">
            <input
              className={`form-input ${errors.firstName ? "error" : ""}`}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              autoComplete="given-name"
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.lastName ? "error" : ""}`}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              autoComplete="family-name"
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.email ? "error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (e.g., ...r@example.com)"
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

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
              onChange={handlePasswordChange}
              placeholder="Password"
              autoComplete="new-password"
            />

            {password && (
              <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#666' }}>
                <span style={{ color: passFeedback.length ? 'green' : 'red' }}>
                  ✓ At least 8 characters
                </span><br />
                <span style={{ color: passFeedback.letter ? 'green' : 'red' }}>
                  ✓ At least one letter
                </span><br />
                <span style={{ color: passFeedback.number ? 'green' : 'red' }}>
                  ✓ At least one number
                </span><br />
                <span style={{ color: passFeedback.symbol ? 'green' : 'red' }}>
                  ✓ At least one symbol: !@#$%
                </span>
              </div>
            )}

            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.passwordConfirm ? "error" : ""}`}
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
            {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
          </div>
          <a href="/login">Login</a>
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