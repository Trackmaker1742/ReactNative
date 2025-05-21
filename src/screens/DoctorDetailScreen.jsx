import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { doctorService } from '../service/api';
import RenderHTML from 'react-native-render-html';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const DoctorDetailScreen = ({ route }) => {
  const { slug } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateOptions, setDateOptions] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const navigation = useNavigation();
  // Tạo mảng ngày trong 7 ngày tới
  // Sửa đoạn code lấy ngày hiện tại
  useEffect(() => {
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);

      // Sử dụng cách này để đảm bảo ngày không bị lệch múi giờ
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const day = String(futureDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`; // format YYYY-MM-DD

      next7Days.push({
        value: formattedDate,
        label: formatDate(futureDate),
      });
    }
    setDateOptions(next7Days);

    // Cài đặt ngày mặc định đúng
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  // Format ngày theo định dạng Việt Nam
  const formatDate = (date) => {
    const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${weekdays[date.getDay()]}, ${day}/${month}`;
  };
  const handleSchedulePress = (scheduleItem) => {
    navigation.navigate('BookingScreen', {
      doctorSlug: slug,
      scheduleId: scheduleItem._id,
      doctorInfo: doctor,
      scheduleTime: scheduleItem.timeType,
      scheduleDate: scheduleItem.date
    });
  };
  // Lấy thông tin bác sĩ và lịch khám
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

  // Lọc lịch khám theo ngày được chọn
  useEffect(() => {
    if (doctor && doctor.schedule && doctor.schedule.length > 0) {
      const now = new Date();
      const filtered = doctor.schedule.filter((item) => {
        const scheduleDate = item.date.split('T')[0];

        if (scheduleDate !== selectedDate) return false;

        // Nếu là ngày hiện tại, chỉ hiển thị lịch khám trong tương lai
        if (scheduleDate === new Date().toISOString().split('T')[0]) {
          const scheduleTime = item.timeType.split(' - ')[0];
          const [scheduleHour, scheduleMinute] = scheduleTime.split(':').map(Number);

          const scheduleTotalMinutes = scheduleHour * 60 + scheduleMinute;
          const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

          return scheduleTotalMinutes > currentTotalMinutes;
        }

        return true; // Nếu là ngày khác thì lấy hết
      });

      setFilteredSchedule(filtered);
    }
  }, [doctor, selectedDate]);

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
            <Text style={styles.doctorCity}>{doctor.address || 'Hà Nội'}</Text>
          </View>
        </View>

        <Text style={styles.scheduleTitle}>Lịch khám</Text>

        {/* DatePicker tương tự SDatePicker trong ReactJS */}
        <View style={styles.customPickerContainer}>
          <Text style={styles.selectedDateDisplay}>
            {dateOptions.find(option => option.value === selectedDate)?.label.replace(', ', ' - ') || 'Chọn ngày'}
            <Ionicons name="chevron-down" size={12} color="#6AC1E5" style={styles.chevronDownIcon} />
          </Text>
          <View style={styles.datePickerUnderline} />
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={styles.hiddenPicker}
          >
            {dateOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>

        {/* Hiển thị lịch khám được lọc */}
        <View style={styles.scheduleContainer}>
          {filteredSchedule.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scheduleScrollContainer}
            >
              {filteredSchedule.map((slot, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.timeItem}
                  onPress={() => handleSchedulePress(slot)}
                >
                  <Text style={styles.timeText}>{slot.timeType}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySchedule}>
              <Text style={styles.emptyText}>Lịch khám trống!</Text>
              <Text style={styles.emptyText}>Vui lòng chọn ngày khác!</Text>
            </View>
          )}
        </View>

        <View style={styles.hospitalAddressContainer}>
          <Text style={styles.hospitalAddressLabel}>Địa chỉ khám</Text>
          <Text style={styles.hospitalName}>{doctor.clinic?.name || 'Bệnh viện Chợ Rẫy'}</Text>
          <Text style={styles.hospitalAddress}>{doctor.clinic?.address || '55 Giải Phóng, Hai Bà Trưng, Hà Nội'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <RenderHTML
          contentWidth={width}
          source={htmlSource}
          tagsStyles={{
            p: {
              fontSize: 16,
              color: '#333',
              lineHeight: 24,
              paddingVertical: 8,
              paddingHorizontal: 15,
            },
          }}
        />
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
  customPickerContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    position: 'relative',
    borderRadius: 20,
  },
  pickerItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6AC1E5',
    color: '#6AC1E5',
    fontSize: 14,
  },
  selectedDateDisplay: {
    color: '#6AC1E5',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  datePickerUnderline: {
    height: 1,
    backgroundColor: '#CCCCCC',
    width: 125,
    marginTop: 2,
  },
  hiddenPicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    height: 50,
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    marginBottom: 20,
  },
  scheduleScrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },

  timeItem: {
    backgroundColor: '#E0F0FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: '#0D75D6',
    fontWeight: '600',
  },
  emptySchedule: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 12,
  },
  hospitalAddressContainer: {
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
    marginLeft: 15,
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