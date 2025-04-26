import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';

const ProfileScreen = () => {
  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Trang cá nhân</Text>
        <Text style={styles.subtitle}>Quản lý thông tin cá nhân của bạn</Text>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileScreen;