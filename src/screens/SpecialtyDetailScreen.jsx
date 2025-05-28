import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';

const SpecialtyDetailScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialtyDetails = async () => {
      try {
        const response = await specialtyService.getSpecialtyBySlug(slug);
        if (response.success) {
          setSpecialty(response.data);
        } else {
          setError(response.message || 'Failed to load specialty details.');
        }
      } catch (err) {
        setError('An error occurred while fetching specialty details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialtyDetails();
  }, [slug]);

	if (loading) {
		return (
		<DefaultLayout>
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2196F3" />
				<Text style={styles.loadingText}>Loading specialty...</Text>
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
      <View style={styles.specialtyHeaderContainer}>
        <View style={styles.specialtyImageContainer}>
          <Image
            source={{ 
              uri: `${API_URL}${specialty.avatar}` || 'https://via.placeholder.com/100?text=Specialty' 
            }}
            style={styles.specialtyImage}>
          </Image>
        </View>
        <View style={styles.specialtyInfo}>
          <Text style={styles.specialtyName}>
            {typeof specialty.name === 'string' ? specialty.name : 'Specialty Name'}
          </Text>
        </View>
      </View>
    </DefaultLayout>
  )
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
  specialtyHeaderContainer: {
    flexDirection: 'row',
    fontSize: 14,
    backgroundColor: '#E6F4FF',
    marginBottom: '5%',
  },
  specialtyInfo: {
    flex: 1,
  },
  specialtyImageContainer: {
    marginVertical: '4%',
    marginLeft: '5%',
    marginRight: '4%',
    padding: '1%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  specialtyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  specialtyName: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: '8%',
    fontWeight: 'bold',
    color: '#222',
  },
});

export default SpecialtyDetailScreen;