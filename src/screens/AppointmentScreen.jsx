import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import DefaultLayout from '../layouts/DefaultLayout';
import { bookingService } from '../service/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import images from '../assets/images';
const AppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      if (response.success) {
        setAppointments(response.data);
      } else {
        console.error('Lỗi khi tải lịch khám:', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch khám:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 'S1': return 'Đang chờ xác nhận';
      case 'S2': return 'Đã xác nhận';
      case 'S3': return 'Đã khám';
      case 'S4': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusStyle = (statusId) => {
    switch (statusId) {
      case 'S1': return styles.pendingButton;
      case 'S2': return styles.confirmedButton;
      case 'S3': return styles.completedButton;
      case 'S4': return styles.cancelledButton;
      default: return styles.pendingButton;
    }
  };

  const getStatusTextStyle = (statusId) => {
    switch (statusId) {
      case 'S1': return styles.pendingText;
      case 'S2': return styles.confirmedText;
      case 'S3': return styles.completedText;
      case 'S4': return styles.cancelledText;
      default: return styles.pendingText;
    }
  };

  if (loading && !refreshing) {
    return (
      <DefaultLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D75D6" />
          <Text style={styles.loadingText}>Đang tải lịch khám...</Text>
        </View>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Lịch hẹn đã đặt</Text>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Bạn chưa có lịch khám nào</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => navigation.navigate('DoctorListScreen')}
              >
                <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            appointments.map((appointment, index) => (
              <TouchableOpacity
                key={appointment._id || index}
                style={styles.appointmentCard}
                onPress={() => navigation.navigate('AppointmentDetailScreen', { id: appointment._id })}
              >
                <View style={styles.cardContent}>
                  <View style={styles.mainContentRow}>
                    {/* Avatar column */}
                    <Image
                      source={require('../assets/images/doctor-avatar.png')}
                      style={styles.avatar}
                    />

                    {/* Info column */}
                    <View style={styles.infoContainer}>
                      <View style={styles.patientRow}>
                        <Text style={styles.labelText}>Bệnh nhân: </Text>
                        <Text style={styles.patientName}>{appointment.info?.fullname || "Trần Văn Hùng"}</Text>
                      </View>

                      <View style={styles.doctorRow}>
                        <Text style={styles.labelText}>Bác sĩ: </Text>
                        <Text style={styles.doctorName}>
                          {appointment.doctorId?.userId?.fullname || "Phó giáo sư Trần Văn Tuấn"}
                        </Text>
                      </View>

                      <View style={styles.locationRow}>
                        <Text style={styles.labelText}>Nơi khám: </Text>
                        <Text style={styles.locationText}>
                          {appointment.doctorId?.clinics?.[0]?.name || "Bệnh Viện Chợ Rẫy"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Time and status row */}
                  <View style={styles.timeAndStatusRow}>
                    <View style={styles.timeColumn}>
                      <Text style={styles.timeText}>
                        {appointment.scheduleId?.time || "08:00 - 09:00"}
                      </Text>
                      <Text style={styles.dateText}>
                        {formatDate(appointment.createdAt) || "02/01/2026"}
                      </Text>
                    </View>

                    <View style={[styles.statusButton, getStatusStyle(appointment.statusId)]}>
                      <Text style={[styles.statusText, getStatusTextStyle(appointment.statusId)]}>
                        {getStatusText(appointment.statusId)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
  mainContentRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#555',
  },
  patientName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 12,
    color: '#4EB5E5',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  timeAndStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  timeColumn: {
    flexDirection: 'column',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4EB5E5',
    marginBottom: 3,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  pendingButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmedButton: {
    backgroundColor: '#65CEFA',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  cancelledButton: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pendingText: {
    color: '#555',
  },
  confirmedText: {
    color: '#fff',
  },
  completedText: {
    color: '#fff',
  },
  cancelledText: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#0D75D6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentScreen;