import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { Link } from 'react-router-dom';


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
    <div className="min-h-screen flex items-center justify-center bg-charcoal py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-cream rounded-xl shadow-lg border border-sage-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4-5 15 5 15L4 21l8 4 8-4 5-15-5-15Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              {method === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-muted-foreground">
              {method === 'login'
                ? 'Sign in to access your culinary consultancy portal'
                : 'Join Salal Culinary Consultancy to access expert guidance and resources'}
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-charcoal/10 border border-charcoal/20 text-charcoal/20 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {method === 'register' && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.firstName ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-charcoal">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.lastName ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-charcoal">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.email ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-charcoal">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-charcoal mb-1">
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
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.username ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-charcoal">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.password ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-charcoal">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-charcoal mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.passwordConfirm ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.passwordConfirm && (
                    <p className="mt-1 text-sm text-charcoal">{errors.passwordConfirm}</p>
                  )}
                </div>
              </>
            )}



            {method === 'login' && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-charcoal mb-1">
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
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.username ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-charcoal">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent transition ${
                      errors.password ? 'border-charcoal' : 'focus:ring-charcoal'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-charcoal">{errors.password}</p>
                  )}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brass text-charcoal py-3 px-4 rounded-lg font-medium hover:bg-sage-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
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
              <p className="text-sm text-sage-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-brass hover:text-terracotta">
                  Register
                </Link>
              </p>
            ) : (
              <p className="text-sm text-sage-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-brass hover:text-terracotta">
                      Login
                    </Link>
              </p>
            )}
            <p className="mt-2 text-sm text-sage-400">
              <Link to="/" className="hover:text-charcoal">← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;