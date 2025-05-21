import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { doctorService, bookingService } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BookingScreen = ({ route, navigation }) => {
  const { doctorSlug, scheduleId, doctorInfo, scheduleTime, scheduleDate } = route.params;
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [inputs, setInputs] = useState({
    email: '',
    fullname: '',
    phone: '',
    address: '',
    birthyear: '',
    gender: 'male',
    reasons: '',
  });

  // Lấy thông tin người dùng đã đăng nhập
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserInfo(parsedUser);

          setInputs({
            email: parsedUser.email || '',
            fullname: parsedUser.fullname || '',
            phone: parsedUser.phone || '',
            address: parsedUser.address || '',
            birthyear: parsedUser.birthyear || '',
            gender: parsedUser.gender || 'male',
            reasons: '',
          });
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserInfo();
  }, []);

  const handleInputChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return date.toLocaleDateString('vi-VN', options);
  };
  const directFetch = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("Refresh token:", refreshToken);

    try {
      const response = await fetch("http://10.0.2.2:3003/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-refresh-token": refreshToken
        },
        body: JSON.stringify({
          info: inputs,
          doctor_slug: doctorSlug,
          schedule_id: scheduleId
        })
      });

      const data = await response.json();
      console.log("Direct fetch response:", data);

      // Kiểm tra token mới được trả về trong response header
      const newToken = response.headers.get('x-access-token');
      if (newToken) {
        console.log("Nhận được token mới từ server");
        await AsyncStorage.setItem("accessToken", newToken);
      }

      return data;
    } catch (error) {
      console.error("Direct fetch error:", error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    // Validate inputs
    if (!inputs.fullname || !inputs.phone) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin họ tên và số điện thoại');
      return;
    }

    setLoading(true);
    try {
      const result = await directFetch();

      if (result && result._id) {
        Alert.alert(
          'Thành công',
          'Đặt lịch khám thành công. Bạn có thể theo dõi lịch khám trong mục lịch khám của tôi.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Appointments')
            }
          ]
        );
      } else {
        Alert.alert('Thông báo', 'Đặt lịch không thành công, vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DefaultLayout>
      <ScrollView style={styles.container}>
        {/* Thông tin bác sĩ */}
        <View style={styles.doctorInfoContainer}>
          <Image
            source={{ uri: `http://10.0.2.2:3003/${doctorInfo.avatar}` }}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.bookingHeader}>ĐẶT LỊCH KHÁM</Text>
            <Text style={styles.doctorName}>{doctorInfo.fullname}</Text>
            <View style={styles.scheduleInfo}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.scheduleText}>
                {scheduleTime} - {formatDate(scheduleDate)}
              </Text>
            </View>
            <View style={styles.clinicInfo}>
              <Ionicons name="medkit-outline" size={18} color="#666" />
              <Text style={styles.clinicName}>
                {doctorInfo.clinic?.name || 'Bệnh viện Chợ Rẫy'}
              </Text>
            </View>
            <Text style={styles.clinicAddress}>
              {doctorInfo.clinic?.address || '55 Giải Phóng, Hai Bà Trưng, Hà Nội'}
            </Text>
          </View>
        </View>

        {/* Form đặt lịch */}
        <View style={styles.formContainer}>
          {/* Họ tên bệnh nhân */}
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Họ tên bệnh nhân (bắt buộc)"
              value={inputs.fullname}
              onChangeText={(text) => handleInputChange('fullname', text)}
            />
          </View>

          {/* Giới tính */}
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Giới tính:</Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  inputs.gender === 'male' && styles.selectedGender
                ]}
                onPress={() => handleInputChange('gender', 'male')}
              >
                <Text style={inputs.gender === 'male' ? styles.selectedGenderText : styles.genderText}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  inputs.gender === 'female' && styles.selectedGender
                ]}
                onPress={() => handleInputChange('gender', 'female')}
              >
                <Text style={inputs.gender === 'female' ? styles.selectedGenderText : styles.genderText}>Nữ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Số điện thoại */}
          <View style={styles.inputGroup}>
            <Ionicons name="call-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại (bắt buộc)"
              value={inputs.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => handleInputChange('phone', text)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Ionicons name="mail-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ email"
              value={inputs.email}
              keyboardType="email-address"
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          {/* Năm sinh */}
          <View style={styles.inputGroup}>
            <Ionicons name="calendar-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Năm sinh"
              value={inputs.birthyear}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('birthyear', text)}
            />
          </View>

          {/* Địa chỉ */}
          <View style={styles.inputGroup}>
            <Ionicons name="location-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={inputs.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          {/* Lý do khám */}
          <View style={styles.inputGroup}>
            <Ionicons name="add-circle-outline" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Lý do khám"
              value={inputs.reasons}
              onChangeText={(text) => handleInputChange('reasons', text)}
              multiline
            />
          </View>

          {/* Nút xác nhận */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Xác nhận đặt khám</Text>
            )}
          </TouchableOpacity>
        </View>



      </ScrollView>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  doctorInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6F4FF',
    padding: 15,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  bookingHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D75D6',
    marginVertical: 5,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  clinicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clinicName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  clinicAddress: {
    marginLeft: 26,
    fontSize: 13,
    color: '#666',
  },
  formContainer: {
    padding: 15,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 15,
    color: '#333',
  },
  genderOptions: {
    flexDirection: 'row',
  },
  genderOption: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedGender: {
    backgroundColor: '#0D75D6',
    borderColor: '#0D75D6',
  },
  genderText: {
    color: '#333',
  },
  selectedGenderText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#0D75D6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default BookingScreen;