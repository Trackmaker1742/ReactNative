import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../service/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserInfoScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    fullname: '',
    phone: '',
    address: '',
    birthyear: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData({
          fullname: data.fullname || '',
          phone: data.phone || '',
          address: data.address || '',
          birthyear: data.birthyear || '',
          gender: data.gender || 'male',
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!userData.fullname) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    setLoading(true);
    try {
      const result = await userService.updateProfile(userData);
      if (result.success) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        setHasChanges(false);
      } else {
        Alert.alert('Lỗi', result.message || 'Cập nhật thông tin thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Thông tin cá nhân</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={userData.fullname}
              onChangeText={(text) => handleInputChange('fullname', text)}
              placeholder="Nhập họ và tên"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={userData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Nhập địa chỉ"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Năm sinh</Text>
            <TextInput
              style={styles.input}
              value={userData.birthyear}
              onChangeText={(text) => handleInputChange('birthyear', text)}
              keyboardType="numeric"
              placeholder="Nhập năm sinh"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  userData.gender === 'male' && styles.genderSelected
                ]}
                onPress={() => handleInputChange('gender', 'male')}
              >
                <Text style={userData.gender === 'male' ? styles.genderSelectedText : styles.genderText}>Nam</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  userData.gender === 'female' && styles.genderSelected
                ]}
                onPress={() => handleInputChange('gender', 'female')}
              >
                <Text style={userData.gender === 'female' ? styles.genderSelectedText : styles.genderText}>Nữ</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !hasChanges && styles.disabledButton]}
            onPress={handleSave}
            disabled={!hasChanges || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Lưu thông tin</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  genderSelected: {
    backgroundColor: '#0D75D6',
    borderColor: '#0D75D6',
  },
  genderText: {
    color: '#333',
    fontSize: 16,
  },
  genderSelectedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#0D75D6',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#90CAF9',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default UserInfoScreen;