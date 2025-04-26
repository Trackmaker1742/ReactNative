import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';

const AppointmentScreen = () => {
  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Lịch khám</Text>
        <Text style={styles.subtitle}>Hiển thị các lịch hẹn khám của bạn</Text>
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

export default AppointmentScreen;