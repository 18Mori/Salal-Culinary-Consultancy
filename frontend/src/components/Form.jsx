import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const navigate = useNavigate();
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
        payload = { email, password };
      } else {
        payload = {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          password_confirm: passwordConfirm,
        };
      }

      const res = await api.post(route, payload);

      if (method === "login") {
        // Save token
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("userType", res.data.user.user_type);


        if (res.data.user.user_type === "admin") {
          navigate("/admin_dashboard");
        } else {
          navigate("/client_dashboard");
        }
      } else {

        navigate("/login");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);

      if (error.response?.data) {
        const serverErrors = error.response.data;
        setErrors(serverErrors);
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
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
          className={`form-input ${errors.email ? "error" : ""}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
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
              className={`form-input ${errors.last_name ? "error" : ""}`}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            {errors.last_name && <span className="error-text">{errors.last_name}</span>}
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