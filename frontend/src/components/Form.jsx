import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import LoadingIndicator from './LoadingIndicator';

function Form({ route, method }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passFeedback, setPassFeedback] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === 'login' ? 'Login' : 'Register';

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
        symbol: /[!@#$%]/.test(password),
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

      // Handle server-side errors
      if (!res.ok) {
        if (data.username) setErrors((prev) => ({ ...prev, username: data.username[0] }));
        if (data.email) setErrors((prev) => ({ ...prev, email: data.email[0] }));
        if (data.first_name) setErrors((prev) => ({ ...prev, firstName: data.first_name[0] }));
        if (data.last_name) setErrors((prev) => ({ ...prev, lastName: data.last_name[0] }));
        if (data.password) setErrors((prev) => ({ ...prev, password: data.password[0] }));
        if (data.password_confirm) setErrors((prev) => ({ ...prev, passwordConfirm: data.password_confirm[0] }));
        if (data.non_field_errors) setErrors((prev) => ({ ...prev, general: data.non_field_errors[0] }));
        else setErrors((prev) => ({ ...prev, general: 'Registration/Login failed. Please try again.' }));
        return;
      }

      // Save tokens and redirect
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user) {
        navigate('/client_index');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="chef-hat.png" alt="Chef Hat" className="w-14 h-14" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {method === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600">
              {method === 'login'
                ? 'Sign in to access your culinary consultancy portal'
                : 'Join Salal Culinary Consultancy to access expert guidance and resources'}
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {method === 'register' && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="username"
                autoFocus
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {method === 'register' && (
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    errors.passwordConfirm ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 " fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
                  {name}...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                  </svg>
                  {name}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {method === 'login' ? (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Register
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Login
                </a>
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700">← Back to Home</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;