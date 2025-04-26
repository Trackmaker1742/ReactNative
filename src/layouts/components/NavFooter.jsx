import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const isRouteActive = (routeName) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={isRouteActive('Home') ? '#2196F3' : '#888'} 
        />
        <Text style={[
          styles.tabText, 
          isRouteActive('Home') && styles.activeTabText
        ]}>
          Trang chủ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('Appointments')}
      >
        <Ionicons 
          name="calendar" 
          size={24} 
          color={isRouteActive('Appointments') ? '#2196F3' : '#888'} 
        />
        <Text style={[
          styles.tabText, 
          isRouteActive('Appointments') && styles.activeTabText
        ]}>
          Lịch khám
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={isRouteActive('Profile') ? '#2196F3' : '#888'} 
        />
        <Text style={[
          styles.tabText, 
          isRouteActive('Profile') && styles.activeTabText
        ]}>
          Trang cá nhân
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  activeTabText: {
    color: '#2196F3',
  }
});

export default NavFooter;