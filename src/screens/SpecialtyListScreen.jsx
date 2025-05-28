import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { Dimensions } from 'react-native';

const API_URL = "http://10.0.2.2:3003/";
const ITEM_MARGIN = 18;
const ITEM_WIDTH = (Dimensions.get('window').width - ITEM_MARGIN * 2) / 2;

const SpecialtyListScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await specialtyService.getAllSpecialties();
        if (response.success) {
          setSpecialties(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch specialties.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const renderSpecialtyItem =  ({ item, index }) => (
    <TouchableOpacity
      style={[styles.specialtyContainer,
        index % 2 === 0
        ? { marginRight: 6, marginLeft: 12 } // First column
        : { marginLeft: 6, marginRight: 12 } // Second column
      ]}
      onPress={() => navigation.navigate('specialtyDetail', { id: item._id, slug: item.slug })}
    >
      <View style={styles.specialtyCard}>
        <Image
          source={{ 
            uri: `${API_URL}${item.avatar}` || 'https://via.placeholder.com/100?text=Specialty' 
          }} 
          style={styles.specialtyImage}>
        </Image>
        <Text style={styles.specialtyName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

	if (loading) {
		return (
		<DefaultLayout>
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2196F3" />
				<Text style={styles.loadingText}>Loading specialties...</Text>
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
      <FlatList
        data={specialties}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
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
  specialtyContainer: {
		width: ITEM_WIDTH,
		marginVertical: 5,
		backgroundColor: '#fff',
		borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
	},
	specialtyCard: {
		fontSize: 14,
	},
	specialtyImage: {
		marginHorizontal: '5%',
		width: '90%',
		height: 160,
		resizeMode: 'contain', 
	},
	specialtyName: {
		margin: '5%',
		color: '#333',
	},
  listContainer: {
    flexDirection: 'column',
  },
});

export default SpecialtyListScreen;