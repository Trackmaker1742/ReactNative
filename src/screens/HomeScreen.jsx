import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from '@react-navigation/native';
import DefaultLayout from '../layouts/DefaultLayout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { specialtyService, doctorService, clinicService, postService } from '../service/api';
import images from '../assets/images';
const API_URL = "http://10.0.2.2:3003/";
const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Data states
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // Services for display in grid
  const services = [
    { id: '1', title: 'Khám chuyên khoa', icon: 'medical', route: 'SpecialtyList' },
    { id: '2', title: 'Cơ sở y tế', icon: 'business', route: 'ClinicList' },
    { id: '3', title: 'Khám tổng quát', icon: 'clipboard', route: 'GeneralCheckup' },
    { id: '4', title: 'Xét nghiệm', icon: 'flask', route: 'LabTests' },
    { id: '5', title: 'Nha Khoa', icon: 'medkit', route: 'DentalCare' },
    { id: '6', title: 'Khám từ xa', icon: 'videocam', route: 'TeleHealth' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await AsyncStorage.getItem("accessToken");
      // Parallel API calls for better performance - SỬA LẠI CÁC PHƯƠNG THỨC API
      const [specialtiesRes, doctorsRes, clinicsRes, postsRes] = await Promise.all([
        specialtyService.getAllSpecialties(),
        doctorService.getAllDoctors(),  
        clinicService.getAllClinics(),
        postService.getAllPosts()
      ]);
      // Lưu ý: api trả về dạng { success: true, data: [] }
      setSpecialties(specialtiesRes.success ? specialtiesRes.data : []);
      setDoctors(doctorsRes.success ? doctorsRes.data : []);
      setClinics(clinicsRes.success ? clinicsRes.data : []);
      setPosts(postsRes.success ? postsRes.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau!');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Render a service grid item
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceItem} 
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.serviceIconContainer}>
        <Ionicons name={item.icon} size={24} color="#2196F3" />
      </View>
      <Text style={styles.serviceTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render a specialty item
  const renderSpecialtyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.specialtyItem} 
      onPress={() => navigation.navigate('SpecialtyDetail', { id: item._id, slug: item.slug })}
    >
      <Image 
        source={{ 
          uri: `${API_URL}${item.avatar}` || 'https://via.placeholder.com/100?text=No+Image'
        }} 
        style={styles.specialtyImage} 
      />
      <Text style={styles.specialtyName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render a doctor item
  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.doctorItem} 
      onPress={() => navigation.navigate('DoctorDetail', { id: item._id, slug: item.userId?.slug })}
    >
      <Image 
        source={{ 
          uri: `${API_URL}${item.userId?.avatar}` || 'https://via.placeholder.com/100?text=Doctor' 
        }} 
        style={styles.doctorImage} 
      />
      <Text style={styles.doctorName} numberOfLines={2}>{item.userId?.fullname}</Text>
      <Text style={styles.doctorSpecialty} numberOfLines={1}>
        {item.specialties && item.specialties.length > 0 ? item.specialties[0]?.name : 'Bác sĩ'}
      </Text>
    </TouchableOpacity>
  );

  // Render a clinic item
  const renderClinicItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.clinicItem} 
      onPress={() => navigation.navigate('ClinicDetail', { id: item._id, slug: item.slug })}
    >
      <Image 
        source={{ 
          uri: `${API_URL}${item.avatar}` || 'https://via.placeholder.com/300x150?text=Clinic'
        }} 
        style={styles.clinicImage} 
        resizeMode="contain"
      />
      <View style={styles.clinicInfo}>
        <Text style={styles.clinicName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.clinicAddress} numberOfLines={2}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render a post item
  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleItem} 
      onPress={() => navigation.navigate('PostDetail', { id: item._id, slug: item.slug })}
    >
      <Image 
        source={{ 
          uri: `${API_URL}${item.poster}` || 'https://via.placeholder.com/300x200?text=Post'
        }} 
        style={styles.articleImage} 
      />
      <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <DefaultLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bác sĩ, phòng khám..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => navigation.navigate('Search', { searchText })}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Banner */}
          <Image
            source={images.posterHome}
            style={styles.banner}
            resizeMode="cover"
          />

          {/* Services Grid */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Dịch vụ toàn diện</Text>
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity 
                  key={service.id} 
                  style={styles.serviceItem}
                  onPress={() => navigation.navigate(service.route)}
                >
                  <View style={styles.serviceIconContainer}>
                    <Ionicons name={service.icon} size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Chuyên Khoa</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SpecialtyList')}>
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {specialties.length > 0 ? (
              <FlatList
                data={specialties}
                renderItem={renderSpecialtyItem}
                keyExtractor={item => item._id ||`specialty-${item.id || Math.random().toString()}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.specialtiesList}
              />
            ) : (
              <Text style={styles.noDataText}>Không có chuyên khoa nào</Text>
            )}
          </View>

          {/* Outstanding Doctors */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Bác sĩ nổi bật</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DoctorList')}>
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {doctors.length > 0 ? (
              <FlatList
                data={doctors}
                renderItem={renderDoctorItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.doctorsList}
              />
            ) : (
              <Text style={styles.noDataText}>Không có bác sĩ nào</Text>
            )}
          </View>

          {/* Outstanding Clinics */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Cơ sở y tế nổi bật</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ClinicList')}>
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {clinics.length > 0 ? (
              <FlatList
                data={clinics}
                renderItem={renderClinicItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.clinicsList}

              />
            ) : (
              <Text style={styles.noDataText}>Không có cơ sở y tế nào</Text>
            )}
          </View>

          {/* Health Articles */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Bài viết y tế</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PostList')}>
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            {posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.articlesList}
              />
            ) : (
              <Text style={styles.noDataText}>Không có bài viết nào</Text>
            )}
          </View>

          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
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
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 180,
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 15,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  serviceItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  specialtiesList: {
    paddingVertical: 10,
  },
  specialtyItem: {
    width: 110,
    alignItems: 'center',
    marginRight: 15,
  },
  specialtyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F4FF',
  },
  specialtyName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  doctorsList: {
    paddingVertical: 10,
  },
  doctorItem: {
    width: 120,
    alignItems: 'center',
    marginRight: 15,
  },
  doctorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6F4FF',
  },
  doctorName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  clinicsList: {
    paddingVertical: 10,
  },
  clinicItem: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    overflow: 'hidden',
  },
  clinicImage: {
   
    height: 100,
    
  },
  clinicInfo: {
    padding: 10,
  },
  clinicName: {
    fontSize: 14,
    fontWeight: '500',
  },
  clinicAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  articlesList: {
    paddingVertical: 10,
  },
  articleItem: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  articleImage: {
    width: '100%',
    height: 100,
  },
  articleTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;