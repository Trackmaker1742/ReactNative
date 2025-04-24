import axios from 'axios';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';

const MainScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { id: '1', title: 'Profile', action: () => console.log('Profile selected') },
    { id: '2', title: 'Settings', action: () => console.log('Settings selected') },
    { id: '3', title: 'Help', action: () => console.log('Help selected') },
    { id: '4', title: 'Logout', action: () => navigation.navigate('Login') },
  ];

  const apiUrl = 'http://192.168.0.103:3003/admin/auth/login';
  const loginData = {
    username: 'trung282828@gmail.com',
    password: '123456',
  };

  const loginAndFetchData = async () => {
    try {
      const response = await axios.post(apiUrl, loginData);

      if (response.status === 200) {
        console.log('Login successful!');
        console.log('Response Data:', response.data);
        console.log('Response Headers:', response.headers); // Log all headers to verify the correct key
        const accessToken = response.headers['x-access-token'] || response.headers['X-Access-Token']; // Check for both cases
        const refreshToken = response.headers['x-refresh-token'];

        Alert.alert('Login Successful', `Access Token: ${accessToken}`);
        console.log(refreshToken, response.status);
      } else {
        console.log('Failed to log in. Status code:', response.status);
        Alert.alert('Login Failed', `Status Code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error occurred:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.action}>
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Main Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.buttonText}>Open Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={loginAndFetchData}
      >
        <Text style={styles.buttonText}>Login and Fetch Data</Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menuContainer}>
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF5733',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  menuItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;