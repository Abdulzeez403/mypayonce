// import axios from "axios";

// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Flag to prevent multiple refresh requests
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// if (typeof window !== "undefined") {
//   axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("userToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       // Handle expired access token
//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry &&
//         typeof window !== "undefined"
//       ) {
//         originalRequest._retry = true;

//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               const accessToken = token as string;
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         isRefreshing = true;

//         try {
//           const response = await axios.get(`${API_URL}/auth/refresh-token`, {
//             withCredentials: true, // Needed to send HttpOnly cookie
//           });

//           const newToken = response.data.accessToken;
//           localStorage.setItem("userToken", newToken);

//           processQueue(null, newToken);
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;

//           return axiosInstance(originalRequest);
//         } catch (err) {
//           processQueue(err, null);
//           localStorage.removeItem("userToken"); // Clear token on failure
//           window.location.href = "/auth/login"; // Optionally redirect to login
//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// }

// export default axiosInstance;

// // lib/api/axiosInstance.ts
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Only add interceptors on client side
if (typeof window !== "undefined") {
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle errors
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
