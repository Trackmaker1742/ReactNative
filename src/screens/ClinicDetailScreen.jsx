import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { clinicService } from '../service/api';
import { useNavigation } from '@react-navigation/native';

const API_URL = "http://10.0.2.2:3003/";

const ClinicDetailScreen = ({ route }) => {
  const { slug } = route.params;
  const [clinic, setClinic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const response = await clinicService.getClinicBySlug(slug);
        if (response.success) {
          setClinic(response.data);
        } else {
          setError(response.message || 'Failed to load clinic details.');
        }
      } catch (err) {
        setError('An error occurred while fetching clinic details.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
  }, [slug]);
	if (loading) {
		return (
		<DefaultLayout>
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2196F3" />
				<Text style={styles.loadingText}>Loading clinic...</Text>
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
      {/* Clinic info card */}
      <View style={styles.clinicHeaderContainer}>
        <View style={styles.clinicImageContainer}>
          <Image
            source={{ 
              uri: `${API_URL}${clinic.avatar}` || 'https://via.placeholder.com/100?text=Clinic' 
            }}
            style={styles.clinicImage}>
          </Image>
        </View>
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>
            {typeof clinic.name === 'string' ? clinic.name : 'Clinic Name'}
          </Text>
          <Text style={styles.clinicAddress}>
            {typeof clinic.address === 'string' ? clinic.address : 'Address not specified'}
          </Text>
        </View>
      </View>
      {/* Clinic map location */}
      <View style={styles.clinicMapContainer}>
            {/* Insert google map here */}
      </View>
      <View style={styles.doctorListContainer}>
        <Text style={styles.doctorListTitle}>Bác sĩ</Text>
        <FlatList/>
      </View>
		</DefaultLayout>
	);
};

const styles = StyleSheet.create({
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
  clinicHeaderContainer: {
    flexDirection: 'row',
    fontSize: 14,
    backgroundColor: '#E6F4FF',
    marginBottom: '5%',
  },
  clinicInfo: {
    flex: 1,
  },
  clinicImageContainer: {
    marginVertical: '4%',
    marginLeft: '5%',
    marginRight: '4%',
    padding: '1%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  clinicImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  clinicName: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: '8%',
    fontWeight: 'bold',
    color: '#222',
  },
  clinicAddress: {
    color: '#555',
    position: 'absolute',
    bottom: '17%',
  },
  clinicMapContainer: {
    height: 400,
    marginHorizontal: '5%',
    marginBottom: '5%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
  },
  doctorListContainer: {
  },
  doctorListTitle: {
    marginLeft: '5%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ClinicDetailScreen;