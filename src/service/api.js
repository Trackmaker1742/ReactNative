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

// Interceptors giữ nguyên
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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

// Auth service - cập nhật theo đúng endpoints
export const authService = {
  requestOtp: async (email) => {
    try {
      // Đúng endpoint: /auth/mobile-login
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
      // Đúng endpoint: /auth/mobile-verify-otp
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
      // Đúng endpoint: /auth/me
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
      // Đúng endpoint: /auth/logout
      await api.get("/auth/logout"); // Thay đổi từ POST sang GET theo routes
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

// Booking service - cập nhật theo đúng endpoints
export const bookingService = {
  getAllBookings: async () => {
    try {
      // Đúng endpoint: /bookings (GET)
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
      // Đúng endpoint: /bookings/:id (GET)
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
      // Đúng endpoint: /bookings/create (POST)
      const response = await api.post("/bookings/create", bookingData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Đặt lịch thất bại",
      };
    }
  },
};

// Doctor service - cập nhật theo đúng endpoints và params
export const doctorService = {
  getAllDoctors: async () => {
    try {
      // Đúng endpoint: /doctors (GET)
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
      // Đúng endpoint: /doctors/:slug (GET)
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
      // Đúng endpoint: /doctors/:slug/schedule/:schedule_id (GET)
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

// Clinic service - cập nhật theo đúng endpoints
export const clinicService = {
  getAllClinics: async () => {
    try {
      // Đúng endpoint: /clinics (GET)
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
      // Đúng endpoint: /clinics/:slug (GET)
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

// Specialty service - cập nhật theo đúng endpoints
export const specialtyService = {
  getAllSpecialties: async () => {
    try {
      // Đúng endpoint: /specialties (GET)
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
      // Đúng endpoint: /specialties/:slug (GET)
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

// Post service - cập nhật theo đúng endpoints
export const postService = {
  getAllPosts: async () => {
    try {
      // Đúng endpoint: /posts (GET)
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
      // Giả định endpoint: /posts/:slug (GET)
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

// User service - cập nhật theo đúng endpoints
export const userService = {
  updateProfile: async (userData) => {
    try {
      // Đúng endpoint: /users/update (PATCH)
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
      // Đúng endpoint: /users/change-password (PATCH)
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

// Export default cho tương thích với code cũ
export default {
  auth: authService,
  booking: bookingService,
  doctor: doctorService,
  clinic: clinicService,
  specialty: specialtyService,
  post: postService,
  user: userService,
};
