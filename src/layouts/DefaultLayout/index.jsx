import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { HeaderLogin } from '../components/Header';
import NavFooter from '../components/NavFooter';

const DefaultLayout = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {!hideHeader && <HeaderLogin showBackButton={false} />}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {!hideFooter && <NavFooter />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default DefaultLayout;