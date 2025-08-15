import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { authService } from '../../../utils/auth';

function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resetPassword(email);
      if (result.success) {
        setEmailSent(true);
      } else {
        Alert.alert('Lỗi', result.error || 'Không thể gửi email khôi phục mật khẩu');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* Success Content */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={60} color="#10B981" />
          </View>

          <Text style={styles.successTitle}>Email đã được gửi!</Text>

          <Text style={styles.successMessage}>
            Chúng tôi đã gửi liên kết khôi phục mật khẩu đến địa chỉ email:
          </Text>

          <Text style={styles.emailText}>{email}</Text>

          <Text style={styles.instructionText}>
            Vui lòng kiểm tra hộp thư (và cả thư mục spam) để tìm email từ chúng tôi. Nhấp vào liên
            kết trong email để đặt lại mật khẩu của bạn.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={goToLogin} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setEmailSent(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Gửi lại email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Mail size={48} color="#3B82F6" />
        </View>

        <Text style={styles.title}>Đặt lại mật khẩu</Text>

        <Text style={styles.description}>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Địa chỉ email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSendEmail}
            style={styles.inputField}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, (!email || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendEmail}
          disabled={isLoading || !email}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Gửi liên kết khôi phục</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backToLoginContainer}
          onPress={goToLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.backToLoginText}>
            Nhớ mật khẩu rồi? <Text style={styles.linkText}>Quay lại đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80, // Tăng padding top để bù cho việc bỏ header
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputField: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    height: 56,
    backgroundColor: '#1E40AF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  // Success styles
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80, // Tăng padding top để bù cho việc bỏ header
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#1E40AF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});

export default ForgotPasswordScreen;
