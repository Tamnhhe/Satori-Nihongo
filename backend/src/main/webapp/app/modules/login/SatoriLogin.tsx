import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import axios from 'axios';
import './SatoriLogin.css';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const SatoriLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const loading = useAppSelector(state => state.authentication.loading);

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  const { from } = location.state || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Email hoặc tên đăng nhập là bắt buộc';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      dispatch(login(formData.username, formData.password, formData.rememberMe));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('/api/oauth2/authorize/google');
      const { authorizationUrl } = response.data;
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="satori-login">
      {/* Background Pattern */}
      <div className="satori-login__background">
        <div className="satori-login__pattern" />
      </div>

      {/* Main Content */}
      <div className="satori-login__container">
        {/* Brand Header */}
        <div className="satori-login__header">
          <div className="satori-login__logo">
            <h1 className="satori-login__brand">Satori Nihongo</h1>
            <p className="satori-login__tagline">Japanese Learning Management Portal</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="satori-login__card">
          <div className="satori-login__card-header">
            <h2 className="satori-login__title">Đăng nhập</h2>
            <p className="satori-login__subtitle">Chỉ dành cho giáo viên và quản trị viên</p>
          </div>

          <div className="satori-login__card-body">
            {/* Error Alert */}
            {loginError && (
              <div className="satori-login__error" role="alert">
                <span className="satori-login__error-icon">⚠️</span>
                <span>Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập.</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="satori-login__form" noValidate>
              {/* Username/Email Field */}
              <div className="satori-login__field">
                <label htmlFor="username" className="satori-login__label">
                  Email hoặc tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`satori-login__input ${errors.username ? 'satori-login__input--error' : ''}`}
                  placeholder="Nhập email hoặc tên đăng nhập"
                  autoComplete="username"
                  autoFocus
                />
                {errors.username && <span className="satori-login__field-error">{errors.username}</span>}
              </div>

              {/* Password Field */}
              <div className="satori-login__field">
                <label htmlFor="password" className="satori-login__label">
                  Mật khẩu
                </label>
                <div className="satori-login__password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`satori-login__input ${errors.password ? 'satori-login__input--error' : ''}`}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="satori-login__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="satori-login__field-error">{errors.password}</span>}
              </div>

              {/* Remember Me */}
              <div className="satori-login__checkbox">
                <label className="satori-login__checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="satori-login__checkbox-input"
                  />
                  <span className="satori-login__checkbox-custom" />
                  <span className="satori-login__checkbox-text">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              {/* Primary Login Button */}
              <button type="submit" className="satori-login__button satori-login__button--primary" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? (
                  <>
                    <span className="satori-login__spinner" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            {/* OAuth Divider */}
            <div className="satori-login__divider">
              <span className="satori-login__divider-text">hoặc</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="satori-login__button satori-login__button--google"
              disabled={isSubmitting || loading}
            >
              <svg className="satori-login__google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </button>

            {/* Links */}
            <div className="satori-login__links">
              <button type="button" onClick={() => navigate('/account/reset/request')} className="satori-login__link">
                Quên mật khẩu?
              </button>
              <button type="button" onClick={handleBackToHome} className="satori-login__link">
                Trở lại trang chủ Satori
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="satori-login__footer">
          <p className="satori-login__footer-text">© 2025 Satori Nihongo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SatoriLogin;
