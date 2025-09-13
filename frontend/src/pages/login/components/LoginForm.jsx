import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberme: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT tokens and user info
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userType', data.user.user_type);
        localStorage.setItem('isAuthenticated', 'true');

        if (data.user.user_type === 'admin') {
          navigate('/admin_dashboard');
        } else {
          navigate('/client_dashboard');
        }
      } else {
        // Handle auth errors from Django
        if (data.non_field_errors) {
          setErrors({ general: data.non_field_errors[0] });
        } else if (data.email) {
          setErrors({ email: data.email[0] });
        } else if (data.password) {
          setErrors({ password: data.password[0] });
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot_password');
  };
};

export default LoginForm;