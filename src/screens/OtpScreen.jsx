import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { HeaderLogin } from "../layouts/components/Header";

import { authService } from '../service/api';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const countdownRef = useRef(null);

  // Start countdown when component mounts
  useEffect(() => {
    startCountdown();
    
    // Clear the timer when component unmounts
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    setTimer(60);
    
    countdownRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (timer > 0) return; // Prevent resend if timer is active
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.requestOtp(email);
      
      if (response.success) {
        startCountdown(); // Restart the countdown
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Đã có lỗi xảy ra khi gửi lại mã OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setError('Vui lòng nhập đủ mã OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.verifyOtp(email, otp);
      
      if (response.success) {
        // Navigation to home screen or main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Đã có lỗi xảy ra khi xác thực mã OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderLogin />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Nhập mã OTP được gửi về email của bạn
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resendButton} 
            onPress={handleResendOTP}
            disabled={timer > 0 || loading}
          >
            <Text style={[
              styles.resendButtonText, 
              timer > 0 && styles.disabledText
            ]}>
              {timer > 0 ? `Gửi lại mã (${timer}s)` : 'Gửi lại mã'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#50C2C9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    padding: 10,
  },
  resendButtonText: {
    color: '#50C2C9',
    fontSize: 14,
  },
  disabledText: {
    color: '#999',
  },
});

export default OTPVerificationScreen;