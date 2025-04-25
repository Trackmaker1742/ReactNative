import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";

const MainScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);

  const apiUrl = "http://10.0.2.2:3003/api/specialties";

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setSpecialties(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load specialties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderSpecialtyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.specialtyItem}
      onPress={() => alert(`You selected ${item.name}`)}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.specialtyImage}
      />
      <Text style={styles.specialtyName}>{item.name}</Text>
      <Text style={styles.specialtyDescription} numberOfLines={2}>
        {item.description || "No description available"}
      </Text>
    </TouchableOpacity>
  );

  const renderAppointmentItem = () => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>Dr. John Smith</Text>
        <Text style={styles.appointmentSpecialty}>Dentist</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <View style={styles.appointmentDetail}>
          <Text style={styles.detailText}>Monday, May 10</Text>
        </View>
        <View style={styles.appointmentDetail}>
          <Text style={styles.detailText}>10:00 AM</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.rescheduleButton}>
        <Text style={styles.rescheduleText}>Reschedule</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text style={styles.loadingText}>Loading specialties...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.svg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchSpecialties}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Specialties</Text>

            {specialties.length === 0 ? (
              <Text style={styles.noDataText}>No specialties available</Text>
            ) : (
              <FlatList
                data={specialties}
                renderItem={renderSpecialtyItem}
                keyExtractor={(item) => item.id?.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.specialtyList}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {renderAppointmentItem()}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logo: {
    width: 150,
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  specialtyList: {
    marginHorizontal: -10,
  },
  specialtyItem: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  specialtyImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  specialtyName: {
    fontWeight: "bold",
    marginTop: 8,
  },
  specialtyDescription: {
    color: "#666",
    marginTop: 4,
    fontSize: 12,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  appointmentHeader: {
    marginBottom: 10,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  appointmentSpecialty: {
    color: "#666",
  },
  appointmentDetails: {
    marginBottom: 10,
  },
  appointmentDetail: {
    marginVertical: 5,
  },
  detailText: {
    color: "#666",
  },
  rescheduleButton: {
    backgroundColor: "#e6f7ff",
    borderRadius: 5,
    padding: 8,
    alignItems: "center",
    marginTop: 10,
  },
  rescheduleText: {
    color: "#0099ff",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF5733",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF5733",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MainScreen;
