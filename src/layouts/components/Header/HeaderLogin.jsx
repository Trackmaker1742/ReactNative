import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../../assets/logo.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderLogin = ({ showBackButton = true, home = false }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {!home && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{showBackButton ? <Ionicons name="close" size={24} color="#000" /> : <Ionicons name="arrow-back" size={24} color="#000" />}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.logoContainer}>
        <Logo height={30} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderLogin;