import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { doctorService } from '../service/api';
import RenderHTML from 'react-native-render-html';

const { width } = Dimensions.get('window');

const mockSchedules = [
  { timeType: 'T1', time: '08:00-09:00' },
  { timeType: 'T2', time: '09:00-10:00' },
  { timeType: 'T3', time: '10:00-11:00' },
];

const DoctorDetailScreen = ({ route }) => {
  const { slug } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await doctorService.getDoctorBySlug(slug);
        if (response.success) {
          setDoctor(response.data);
        } else {
          setError(response.message || 'Failed to load doctor details.');
        }
      } catch (err) {
        setError('An error occurred while fetching doctor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [slug]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading doctor details...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    const htmlSource = {
      html: typeof doctor.description === 'string'
        ? doctor.description
        : '<p>No description available.</p>',
    };

    return (
      <ScrollView>
        <View style={styles.doctorContainer}>
          <Image
            source={{ uri: `http://10.0.2.2:3003/${doctor.avatar}` }}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {typeof doctor.fullname === 'string' ? doctor.fullname : 'Doctor Name'}
            </Text>
            <Text style={styles.doctorSpecialty}>
              {typeof doctor.specialty === 'string' ? doctor.specialty : 'Specialty not specified'}
            </Text>
            <Text style={styles.doctorCity}>Hà Nội</Text>
          </View>
        </View>

        <Text style={styles.scheduleTitle}>Lịch khám</Text>
        <View style={styles.scheduleContainer}>
          {mockSchedules.map((slot, idx) => (
            <View key={idx} style={styles.timeItem}>
              <Text style={styles.timeText}>{slot.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.hospitalAddressContainer}>
          <Text style={styles.hospitalAddressLabel}>Địa chỉ khám</Text>
          <Text style={styles.hospitalName}>Bệnh viện Chợ Rẫy</Text>
          <Text style={styles.hospitalAddress}>55 Giải Phóng, Hai Bà Trưng, Hà Nội</Text>
        </View>
      </ScrollView>
    );
  };

  return <DefaultLayout>{renderContent()}</DefaultLayout>;
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  doctorContainer: {
    flexDirection: 'row',
    fontSize: 14,
    backgroundColor: '#E6F4FF',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginVertical: 10,
    marginHorizontal: '3%',
  },
  doctorName: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingTop: 15,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: '#222',
  },
  doctorSpecialty: {
    color: '#555',
    marginBottom: 8,
  },
  doctorCity: {
    color: '#888',
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D75D6',
    marginLeft: 15,
    marginVertical: 10,
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    marginBottom: 20,
  },
  timeItem: {
    backgroundColor: '#E0F0FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    margin: 5,
  },
  timeText: {
    color: '#0D75D6',
    fontWeight: '600',
  },
  hospitalAddressContainer: {
    alignItems: 'left',
    marginLeft: 15,
    marginBottom: 20,
  },
  hospitalAddressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  hospitalName: {
    fontSize: 15,
    color: '#555',
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D75D6',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: '#D00',
    textAlign: 'center',
  },
});

export default DoctorDetailScreen;
