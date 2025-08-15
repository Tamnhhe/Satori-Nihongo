import AppConfig from '../app/config/app-config';

// Real auth service that integrates with the backend API
class AuthService {
  private apiUrl = AppConfig.apiUrl;

  async signIn(
    username: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    if (!username || !password) {
      throw new Error('Email và mật khẩu không được để trống');
    }

    if (password.length < 4) {
      throw new Error('Mật khẩu phải có ít nhất 4 ký tự');
    }

    try {
      const response = await fetch(`${this.apiUrl}api/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          rememberMe: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, token: data.id_token };
      } else {
        const errorMessage = data?.detail || data?.message || 'Thông tin đăng nhập không chính xác';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Không thể kết nối đến server' };
    }
  }

  async signUp(email: string, password: string, name: string, level: string): Promise<void> {
    // Simple validation
    if (!email || !password || !name) {
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    if (password.length < 4) {
      throw new Error('Mật khẩu phải có ít nhất 4 ký tự');
    }

    try {
      const response = await fetch(`${this.apiUrl}api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email,
          email: email,
          password: password,
          firstName: name,
          lastName: '',
          langKey: 'vi',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data?.detail || data?.message || 'Đăng ký thất bại';
        throw new Error(errorMessage);
      }

      console.log('Registration successful for:', { email, name, level });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    // Handle sign out logic - clear any stored tokens
    console.log('User signed out');
  }

  // Backwards compatibility with previous method names
  async login(username: string, password: string) {
    return this.signIn(username, password);
  }

  async loginWithGoogle(): Promise<boolean> {
    // TODO: Implement Google OAuth login
    console.log('Google login not yet implemented');
    return false;
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email) {
      throw new Error('Email không được để trống');
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email không hợp lệ');
    }

    try {
      const response = await fetch(`${this.apiUrl}api/account/reset-password/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json, text/plain, */*',
        },
        body: email,
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        let errorMessage = 'Không thể gửi email khôi phục mật khẩu';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.detail || errorData?.message || errorMessage;
        } catch (e) {
          // If not JSON, use default message
        }

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Không thể kết nối đến server' };
    }
  }
}
export const authService = new AuthService();
