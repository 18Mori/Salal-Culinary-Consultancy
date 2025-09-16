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
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

     // Validate required fields
    if (!username || !password || !email || !firstName || !lastName) {
      if (!username) setErrors((prev) => ({ ...prev, username: "Username is required" }));
      if (!email) setErrors((prev) => ({ ...prev, email: "Email is required" }));
      if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
      if (!firstName) setErrors((prev) => ({ ...prev, first_name: "First name is required" }));
      if (!lastName) setErrors((prev) => ({ ...prev, last_name: "Last name is required" }));
      setLoading(false);
      return;
    }

    // Validation for registration
    if (method === "register") {
      if (!email || !password || !passwordConfirm) {
        if (!passwordConfirm) setErrors((prev) => ({ ...prev, passwordConfirm: "Confirm password is required" }));
        setLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "Passwords do not match" }));
        setLoading(false);
        return;
      }

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

      if (object.keys(passwordErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...passwordErrors }));
  setLoading(false);
  return;
      }

      const confirmPassword = passwordConfirm;
      if (password !== confirmPassword) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "Passwords do not match" }));
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        setLoading(false);
        return;
      }

      if (!firstName) setErrors((prev) => ({ ...prev, first_name: "First name is required" }));
      if (!lastName) setErrors((prev) => ({ ...prev, last_name: "Last name is required" }));

      if (!firstName || !lastName) {
        setLoading(false);
        return;
      }
    }

    try {
      let payload;
      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint = method === "login"
        ? `${apiUrl}/api/auth/login/`
        : `${apiUrl}/api/auth/register/`;

      if (method === "login") {
        payload = { username, password };
      } else if (method === "register") {
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

      console.log("Response data:", data);
      // console.log("Response ok:", res.ok);

      if (method === "login") {

        if (res.ok) {
        // Save token
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);

        } else {
        if (data.username) setErrors((prev) => ({ ...prev, username: data.username[0] }));
        if (data.first_name) setErrors((prev) => ({ ...prev, first_name: data.first_name[0] }));
        if (data.last_name) setErrors((prev) => ({ ...prev, last_name: data.last_name[0] }));
        if (data.email) setErrors((prev) => ({ ...prev, email: data.email[0] }));
        if (data.password) setErrors((prev) => ({ ...prev, password: data.password[0] }));
        if (data.password_confirm) setErrors((prev) => ({ ...prev, passwordConfirm: data.password_confirm[0] }));
        if (data.non_field_errors) setErrors((prev) => ({ ...prev, general: data.non_field_errors[0] }));
        else setErrors((prev) => ({ ...prev, general: "Registration/Login failed. Please try again." }));
      }

        if (!data.access || !data.refresh) {
          setErrors({ general: "Login failed. Please try again." });
          setLoading(false);
          return;
        } else if (method === "register") {
        if (!data.user || !data.access || !data.refresh) {
          setErrors({ general: "Registration failed. Please try again." });
          setLoading(false);
          return;
        }
      }

      } else {
        // navigate('/login')
      }

        // if (data.user.user_type === 'admin') {
        //   navigate("/admin_dashboard");
        // } else {
        //   navigate("/client_dashboard");
        // }

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
        </>
      )}

        {method === "register" && (
        <>
          <div className="form-group">
            <input
              className={`form-input ${errors.first_name ? "error" : ""}`}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            {errors.first_name && <span className="error-text">{errors.first_name}</span>}
          </div>

          <div className="form-group">
            <input
              className={`form-input ${errors.first_name ? "error" : ""}`}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            {errors.last_name && <span className="error-text">{errors.last_name}</span>}
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