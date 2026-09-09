import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import MobileDrawer from "./MobileDrawer";

function Form({ route, method }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => localStorage.getItem('remember_me') === 'true' ? (localStorage.getItem('remembered_username') || '') : '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('remember_me') === 'true');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [setPassFeedback] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === 'login' ? 'Login' : 'Register';

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.email || data.detail || 'Email verification failed.');
        setForgotLoading(false);
        return;
      }
      setForgotStep('reset');
    } catch {
      setForgotError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      setForgotLoading(false);
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          new_password: forgotNewPassword,
          confirm_password: forgotConfirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errKey = Object.keys(data)[0];
        const errMsg = Array.isArray(data[errKey]) ? data[errKey][0] : (data[errKey] || data.detail || 'Password reset failed.');
        setForgotError(errMsg);
        setForgotLoading(false);
        return;
      }
      setForgotSuccessMsg(data.message || 'Password recreated successfully!');
      setForgotStep('success');
    } catch {
      setForgotError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clears previous errors

    // Validations logic
    if (!username) {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
      setLoading(false);
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      setLoading(false);
      return;
    }

    if (method === 'register') {
      if (!email) {
        setErrors((prev) => ({ ...prev, email: 'Email is required' }));
        setLoading(false);
        return;
      }
      if (!firstName) {
        setErrors((prev) => ({ ...prev, firstName: 'First name is required' }));
        setLoading(false);
        return;
      }
      if (!lastName) {
        setErrors((prev) => ({ ...prev, lastName: 'Last name is required' }));
        setLoading(false);
        return;
      }
      if (!passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: 'Confirm password is required' }));
        setLoading(false);
        return;
      }
      if (password !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: 'Passwords do not match' }));
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
        setLoading(false);
        return;
      }

      // Password strength validation
      const passwordRequirements = {
        length: password.length >= 8,
        letter: /[A-Za-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
      };

      const passwordErrors = {};

      if (!passwordRequirements.length) {
        passwordErrors.password = 'Password must be at least 8 characters';
      }
      if (!passwordRequirements.letter) {
        passwordErrors.password = 'Password must contain at least one letter';
      }
      if (!passwordRequirements.number) {
        passwordErrors.password = 'Password must contain at least one number';
      }
      if (!passwordRequirements.symbol) {
        passwordErrors.password = 'Password must contain at least one symbol: !@#$%';
      }

      if (Object.keys(passwordErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...passwordErrors }));
        setLoading(false);
        return;
      }
    }

    // API call
    try {
      let payload;
      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint = method === 'login'
        ? `${apiUrl}/api/auth/login/`
        : `${apiUrl}/api/auth/register/`;

      if (method === 'login') {
        payload = { username, password };
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
          localStorage.setItem('remembered_username', username);
        } else {
          localStorage.removeItem('remember_me');
          localStorage.removeItem('remembered_username');
        }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Handle serverside errors
      if (!res.ok) {
        const newErrors = {};
        if (data.username) newErrors.username = Array.isArray(data.username) ? data.username[0] : data.username;
        if (data.email) newErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
        if (data.first_name) newErrors.firstName = Array.isArray(data.first_name) ? data.first_name[0] : data.first_name;
        if (data.last_name) newErrors.lastName = Array.isArray(data.last_name) ? data.last_name[0] : data.last_name;
        if (data.password) newErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
        if (data.password_confirm) newErrors.passwordConfirm = Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm;
        if (data.non_field_errors) newErrors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        if (data.detail) newErrors.general = data.detail;

        if (Object.keys(newErrors).length === 0) {
          const firstKey = Object.keys(data)[0];
          if (firstKey && data[firstKey]) {
            const errVal = data[firstKey];
            newErrors.general = Array.isArray(errVal) ? errVal[0] : errVal;
          } else {
            newErrors.general = 'Registration/Login failed. Please try again.';
          }
        }
        setErrors(newErrors);
        return;
      }

      // Save tokens and redirect
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      const userObj = data.user || data;
      const isAdmin = userObj.role === 'admin' && userObj.is_superuser === true;

      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/client_dashboard');
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:hidden">
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-amber-400 transition-all lg:hidden"
            aria-label="Open mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {drawerOpen && <MobileDrawer isOpen={drawerOpen} onToggle={() => setDrawerOpen(false)}/>}
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 p-3 shadow-lg shadow-amber-400/5">
              <img className="w-full h-full object-contain filter invert opacity-90" src="chef-hat.png" alt="Chef Hat" />
            </div>
            <h1 className="text-2xl font-light text-white tracking-wide mb-2">
              {method === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-slate-400 font-light">
              {method === 'login'
                ? 'Sign in to access your culinary consultancy portal'
                : 'Join Salal Culinary Consultancy to access expert guidance and resources'}
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-center">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {method === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      autoComplete="given-name"
                      className={`w-full px-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.firstName ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-rose-400">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      autoComplete="family-name"
                      className={`w-full px-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.lastName ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-rose-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full px-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.email ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                    autoComplete="username"
                    autoFocus
                    className={`w-full px-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.username ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-rose-400">{errors.username}</p>
                  )}
                </div>

                {/* Registration Password Input */}
                <div>
                  <label htmlFor="password" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full pl-4 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.password ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9-9m-6-6l-6 6" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="passwordConfirm" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="passwordConfirm"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full pl-4 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.passwordConfirm ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                      aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showPasswordConfirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9-9m-6-6l-6 6" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.passwordConfirm && (
                    <p className="mt-1 text-xs text-rose-400">{errors.passwordConfirm}</p>
                  )}
                </div>
              </>
            )}

            {method === 'login' && (
              <>
                <div>
                  <label htmlFor="username" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    autoFocus
                    className={`w-full px-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.username ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-rose-400">{errors.username}</p>
                  )}
                </div>

                {/* Login Password Input */}
                <div>
                  <label htmlFor="password" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full pl-4 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.password ? 'border-rose-500/60 focus:ring-rose-500' : 'border-slate-800/80 focus:border-amber-400/60 focus:ring-amber-400/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9-9m-6-6l-6 6" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me Radio & Forgot Password */}
                <div className="flex items-center justify-between text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="rememberMe"
                      checked={rememberMe}
                      onClick={() => {
                        const newState = !rememberMe;
                        setRememberMe(newState);
                        if (!newState) {
                          localStorage.removeItem('remember_me');
                          localStorage.removeItem('remembered_username');
                        }
                      }}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-full border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/30"
                    />
                    <span className="font-light text-xs uppercase tracking-wider">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotStep('email');
                      setForgotEmail('');
                      setForgotNewPassword('');
                      setForgotConfirmPassword('');
                      setForgotError('');
                      setForgotSuccessMsg('');
                    }}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 px-4 rounded-xl font-medium tracking-wide transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{name}...</span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                  </svg>
                  <span>{name}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            {method === 'login' ? (
              <p className="text-sm text-slate-400 font-light">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Register
                </Link>
              </p>
            ) : (
              <p className="text-sm text-slate-400 font-light">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Login
                </Link>
              </p>
            )}
            <p className="mt-3 text-sm">
              <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">
                ← Back to Home
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal Popup */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-slate-100">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-4l5.257-5.257A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white tracking-wide">
                {forgotStep === 'email' && 'Reset Password'}
                {forgotStep === 'reset' && 'Recreate Password'}
                {forgotStep === 'success' && 'Success'}
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                {forgotStep === 'email' && 'Enter your registered email address to verify your account.'}
                {forgotStep === 'reset' && 'Enter your new secure password below.'}
                {forgotStep === 'success' && 'Your password has been successfully recreated.'}
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center">
                {forgotError}
              </div>
            )}

            {forgotSuccessMsg && forgotStep !== 'success' && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs text-center">
                {forgotSuccessMsg}
              </div>
            )}

            {forgotStep === 'email' && (
              <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgotEmail" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 px-4 rounded-xl font-medium text-sm transition-all shadow-lg shadow-amber-400/10 disabled:opacity-50"
                >
                  {forgotLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleForgotResetSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgotNewPassword" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="forgotNewPassword"
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoFocus
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      {showForgotNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="forgotConfirmPassword" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="forgotConfirmPassword"
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      {showForgotConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 px-4 rounded-xl font-medium text-sm transition-all shadow-lg shadow-amber-400/10 disabled:opacity-50"
                >
                  {forgotLoading ? 'Updating...' : 'Recreate Password'}
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
                  {forgotSuccessMsg}
                </div>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 px-4 rounded-xl font-medium text-sm transition-all shadow-lg shadow-amber-400/10"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;