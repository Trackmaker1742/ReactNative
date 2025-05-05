import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { doctorService } from '../service/api';
import RenderHTML from 'react-native-render-html';

const API_URL = "http://10.0.2.2:3003/";

const { width } = Dimensions.get('window');

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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={{
            uri: `${API_URL}${doctor.avatar}` || 'https://via.placeholder.com/100?text=Doctor'
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {typeof doctor.fullname === 'string' ? doctor.fullname : 'Doctor Name'}
        </Text>
        <Text style={styles.specialty}>
          {typeof doctor.specialty === 'string' ? doctor.specialty : 'Specialty not specified'}
        </Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <RenderHTML
            contentWidth={width * 0.9}
            source={htmlSource}
          />
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
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
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
