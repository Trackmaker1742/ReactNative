import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:3003/api";
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (token) {
      // Thêm tiền tố 'Bearer' cho đúng định dạng
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (refreshToken) {
      // Thêm refresh token vào mỗi request
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");
          return Promise.reject(error);
        }

        api.defaults.headers.common["x-refresh-token"] = refreshToken;

        const response = await api.get("/auth/me");

        const newAccessToken = response.headers["x-access-token"];

        if (newAccessToken) {
          await AsyncStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  requestOtp: async (email) => {
    try {
      const response = await api.post("/auth/mobile-login", { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Đã xảy ra lỗi khi gửi OTP",
      };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post("/auth/mobile-verify-otp", {
        email,
        otp,
      });

      const accessToken =
        response.headers["x-access-token"] || response.data.tokens?.accessToken;
      const refreshToken =
        response.headers["x-refresh-token"] ||
        response.data.tokens?.refreshToken;

      if (accessToken && refreshToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
      }

      if (response.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Xác thực OTP thất bại",
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin người dùng",
      };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Đăng xuất thất bại",
      };
    }
  },
};

export const bookingService = {
  getAllBookings: async () => {
    try {
      const response = await api.get("/bookings");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy danh sách đặt lịch",
      };
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin đặt lịch",
      };
    }
  },

  createBooking: async (bookingData) => {
    try {
      // Log trước khi gửi request
      console.log("Gửi request booking:", bookingData);
      const token = await AsyncStorage.getItem("accessToken");
      console.log("Token sử dụng:", token);

      const response = await api.post("/bookings/create", bookingData);
      console.log("Response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Đặt lịch thất bại",
      };
    }
  },
};

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get("/doctors");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy danh sách bác sĩ",
      };
    }
  },

  getDoctorBySlug: async (slug) => {
    try {
      const response = await api.get(`/doctors/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin bác sĩ",
      };
    }
  },

  getDoctorSchedule: async (slug, scheduleId) => {
    try {
      const response = await api.get(`/doctors/${slug}/schedule/${scheduleId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể lấy lịch bác sĩ",
      };
    }
  },
};

export const clinicService = {
  getAllClinics: async () => {
    try {
      const response = await api.get("/clinics");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy danh sách phòng khám",
      };
    }
  },

  getClinicBySlug: async (slug) => {
    try {
      const response = await api.get(`/clinics/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin phòng khám",
      };
    }
  },
};

export const specialtyService = {
  getAllSpecialties: async () => {
    try {
      const response = await api.get("/specialties");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách chuyên khoa",
      };
    }
  },

  getSpecialtyBySlug: async (slug) => {
    try {
      const response = await api.get(`/specialties/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin chuyên khoa",
      };
    }
  },
};

export const postService = {
  getAllPosts: async () => {
    try {
      const response = await api.get("/posts");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy danh sách bài viết",
      };
    }
  },

  getPostBySlug: async (slug) => {
    try {
      const response = await api.get(`/posts/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin bài viết",
      };
    }
  },
};

export const userService = {
  updateProfile: async (userData) => {
    try {
      const response = await api.patch("/users/update", userData);
      if (response.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Cập nhật thông tin thất bại",
      };
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.patch("/users/change-password", passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Thay đổi mật khẩu thất bại",
      };
    }
  },
};

export default {
  auth: authService,
  booking: bookingService,
  doctor: doctorService,
  clinic: clinicService,
  specialty: specialtyService,
  post: postService,
  user: userService,
};
