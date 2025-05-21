import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DefaultLayout from '../layouts/DefaultLayout';
import { authService } from '../service/api';
import images from '../assets/images';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            const result = await authService.logout();
            if (result.success) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } else {
              Alert.alert('Lỗi', result.message || 'Không thể đăng xuất');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={userInfo?.avatar
                ? { uri: `http://10.0.2.2:3003/${userInfo.avatar}` }
                : images.defaultAvatar}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{userInfo?.fullname || 'Người dùng'}</Text>
          <Text style={styles.userEmail}>{userInfo?.email || 'Email chưa cập nhật'}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('UserInfo')}
          >
            <Ionicons name="person-outline" size={24} color="#0D75D6" />
            <Text style={styles.menuItemText}>Thông tin cá nhân</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Ionicons name="calendar-outline" size={24} color="#0D75D6" />
            <Text style={styles.menuItemText}>Lịch khám bệnh</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Đăng xuất</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6F4FF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  }
});

export default ProfileScreen;