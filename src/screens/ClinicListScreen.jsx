import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { clinicService } from '../service/api';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const ITEM_MARGIN = 18; // sum of left+right margin for one item
const ITEM_WIDTH = (Dimensions.get('window').width - ITEM_MARGIN * 2) / 2;

const ClinicListScreen = () => {
	const navigation = useNavigation();
	const [clinics, setClinics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchClinics = async () => {
			try {
				const response = await clinicService.getAllClinics();
				if (response.success) {
					setClinics(response.data);
				} else {
					setError(response.message);
				}
			} catch (err) {
				setError('Failed to fetch clinics.');
			} finally {
				setLoading(false);
			}
		};

		fetchClinics();
	}, []);

	const renderClinicItem = ({ item, index }) => (
		<TouchableOpacity
			style={[styles.clinicContainer,
				index % 2 === 0
        ? { marginRight: 6, marginLeft: 12 } // First column
        : { marginLeft: 6, marginRight: 12 } // Second column
			]}
			onPress={() => navigation.navigate('ClinicDetail', { id: item._id, slug: item.slug })}
		>
			<View style={styles.clinicCard}>
				{/* Hiện chưa có ảnh */}
				<Image style={styles.clinicImage}></Image>
				<Text style={styles.clinicName}>{item.name}</Text>
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
		<DefaultLayout>
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2196F3" />
				<Text style={styles.loadingText}>Loading clinics...</Text>
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
				<Text style={styles.sectionTitle}>Cơ sở y tế</Text>
			</View>
			<View style={styles.searchContainer}>
				<Text style={styles.searchIcon}>🔍</Text>
				<TextInput
					style={styles.searchText}
					placeholder="Tìm kiếm cơ sở y tế..."
					returnKeyType="search"
				/>
			</View>
		</View>
		<FlatList
				data={clinics}
				renderItem={renderClinicItem}
				keyExtractor={(item) => item._id}
				contentContainerStyle={styles.listContainer}
				numColumns={2}
		/>
		</DefaultLayout>
	);
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'column',
  },
  sectionContainer: {
    marginHorizontal: 15,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    marginVertical: 10,
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
	clinicContainer: {
		width: ITEM_WIDTH,
		marginVertical: 5,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	clinicCard: {
		fontSize: 14,
	},
	clinicImage: {
		width: '100%',
		height: 100,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	clinicName: {
		padding: 7,
		color: '#333',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#aaa',
		borderRadius: 8,
		paddingHorizontal: 10,
		height: 40,
		marginBottom: 20,
	},
	searchIcon: { 
		fontSize: 18, 
		color: '#888', 
		marginRight: 8 
	},
	searchText: { 
		flex: 1, 
		fontSize: 16 
	},
});

export default ClinicListScreen;