import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { clinicService } from '../service/api';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
const { width } = Dimensions.get('window');
import { doctorService } from '../service/api';

const API_URL = "http://10.0.2.2:3003/";

const ClinicDetailScreen = ({ route }) => {
  const { slug } = route.params;
  const [clinic, setClinic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);

  const htmlSource = {
  html: typeof clinic.description === 'string'
    ? clinic.description
    : '<p>No description available.</p>',
  };

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
      <View style={styles.clinicDetailContainer}>
        <ScrollView style={styles.clinicDetailScroll} showsVerticalScrollIndicator={true}>
          <RenderHTML
            contentWidth={width}
            source={htmlSource}
            tagsStyles={{
              p: {
                fontSize: 16,
                color: '#333',
                lineHeight: 24,
                marginHorizontal: '3%',
              },
              h2: {
                fontWeight: 'bold',
                color: '#333',
                marginLeft: '1%',
              },
              h3: {
                fontWeight: 'bold',
                color: '#333',
              },
            }}
          />
        </ScrollView>
      </View>
      <Text style={styles.doctorListTitle}>Bác sĩ</Text>
      <ScrollView>
        <FlatList
          data={doctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
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
  clinicDetailContainer: {
    height: 350,
    marginHorizontal: '5%',
    marginBottom: '5%',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    backgroundColor: '#fff',
    overflow: 'hidden', // Ensures content stays inside
  },
  clinicDetailScroll: {
    flex: 1,
    margin: '2%',
  },
  doctorListTitle: {
    marginLeft: '5%',
    marginBottom: '1%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    marginTop: 25,
    marginLeft: 15,
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

export default ClinicDetailScreen;