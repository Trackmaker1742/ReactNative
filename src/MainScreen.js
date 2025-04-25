import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MainScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);

  const menuItems = [
    {
      id: "1",
      title: "Profile",
      icon: "person-outline",
      action: () => navigation.navigate("Profile"),
    },
    {
      id: "2",
      title: "Settings",
      icon: "settings-outline",
      action: () => console.log("Settings selected"),
    },
    {
      id: "3",
      title: "Help",
      icon: "help-circle-outline",
      action: () => console.log("Help selected"),
    },
    {
      id: "4",
      title: "Logout",
      icon: "log-out-outline",
      action: () => navigation.navigate("Login"),
    },
  ];

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

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.action}>
      <Ionicons
        name={item.icon}
        size={24}
        color="#FF5733"
        style={styles.menuIcon}
      />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderSpecialtyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.specialtyItem}
      onPress={() => Alert.alert("Selected", `You selected ${item.name}`)}
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
        <Text style={styles.headerTitle}>Bookings</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
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
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.specialtyList}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>Dr. John Smith</Text>
                <Text style={styles.appointmentSpecialty}>Dentist</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentDetail}>
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <Text style={styles.detailText}>Monday, May 10</Text>
                </View>
                <View style={styles.appointmentDetail}>
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text style={styles.detailText}>10:00 AM</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              style={styles.menuList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    marginLeft: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 20,
  },
});

export default MainScreen;
