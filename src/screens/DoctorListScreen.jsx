import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { doctorService } from '../service/api';
import { useNavigation } from '@react-navigation/native';

const API_URL = "http://10.0.2.2:3003/";

const DoctorListScreen = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getAllDoctors();
        if (response.success) {
          setDoctors(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.doctorContainer} 
      onPress={() => navigation.navigate('DoctorDetail', { id: item._id, slug: item.userId?.slug })}
    >
      <View style={styles.doctorCard}>
        <Image
          source={{ 
            uri: `${API_URL}${item.userId?.avatar}` || 'https://via.placeholder.com/100?text=Doctor' 
          }} 
          style={styles.doctorAvatar} 
        />
        <Text style={styles.doctorName}>{item.userId?.fullname}</Text>
        <Text style={styles.doctorSpecialty} numberOfLines={1}>
          {item.specialties && item.specialties.length > 0 ? item.specialties[0]?.name : 'Bác sĩ'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <DefaultLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Bác sĩ</Text>
        </View>
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'column',
  },
  sectionContainer: {
    paddingHorizontal: 15,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    paddingTop: 10,
    paddingLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  doctorContainer: {
    marginVertical: 10,
  },
  doctorCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderColor: '#000',
    borderBottomWidth: 1,
    fontSize: 14,
  },
  doctorName: {
    fontWeight: '500',
    flex: 1,
    paddingTop: 25,
    paddingLeft: 15,
  },
  doctorSpecialty: {
    color: '#666',
    marginTop: 4,
  },
  doctorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#BFBFBF',
    flexShrink: 0,
    marginLeft: 15,
    marginVertical: 15,
  },
});

export default DoctorListScreen;
