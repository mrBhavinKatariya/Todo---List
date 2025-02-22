// api.jsx (unchanged but with added verification)
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Ensure this matches your backend port

const handleResponse = (response) => response.data;
const handleError = (error) => {
  if (error.response) {
    console.error("API call failed. Response data:", error.response.data);
    console.error("API call failed. Response status:", error.response.status);
  } else if (error.request) {
    console.error("API call failed. No response received:", error.request);
  } else {
    console.error("API call failed. Error message:", error.message);
  }
  throw error;
};

export const registerUser = (data) => 
  axios.post(`${API_URL}/auth/register`, data)
    .then(handleResponse)
    .catch(handleError);

export const loginUser = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, data);
            const { accessToken } = response.data;
    
            localStorage.setItem("token", accessToken);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // export const apiClient = axios.create({
    //     baseURL: API_URL,
    // });
    

    // export const getCurrentUser = async () => {
    //   try {
    //     const response = await apiClient.get("/auth/current-user");
    //     return handleResponse(response);
    //   } catch (error) {
    //     handleError(error);
    //   }
    // };
    // Create an Axios instance with a base URL
export const apiClient = axios.create({
  baseURL: API_URL,
});

// Auto-attach token in API requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error("No token found in localStorage");
  }

  return config;
});

// Fetch the current logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/current-user");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Fetch tasks for the logged-in user
export const getTasks = async () => {
  try {
    const response = await apiClient.get("/tasks/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (data) => {
  try {
    const response = await apiClient.post("/tasks/create-tasks", data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Update an existing task
export const updateTask = async (id, data) => {
  try {
    const response = await apiClient.put(`tasks/update-tasks/${id}`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await apiClient.delete(`/tasks/delete-tasks/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

//     // Auto attach token in API requests
//     apiClient.interceptors.request.use((config) => {
//         const token = localStorage.getItem("token");
    
//         if (token && typeof token === "string") {
//             config.headers.Authorization = `Bearer ${token}`;
//         } else {
//             console.error("Invalid Token:", token);
//         }
    
//         return config;
//     });
    

// export const getTasks = (token) => {
//   console.log("Token in getTasks:", token);
//   return axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
//     .then(handleResponse)
//     .catch(handleError);
// };

// export const createTask = (data, token) => {
//   console.log("Token in createTask:", token);
//   return axios.post(`${API_URL}/tasks`, data, { headers: { Authorization: `Bearer ${token}` } })
//     .then(handleResponse)
//     .catch(handleError);
// };

// export const updateTask = (id, data, token) => {
//   console.log("Token in updateTask:", token);
//   return axios.put(`${API_URL}/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
//     .then(handleResponse)
//     .catch(handleError);
// };

// export const deleteTask = (id, token) => {
//   console.log("Token in deleteTask:", token);
//   return axios.delete(`${API_URL}/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
//     .then(handleResponse)
//     .catch(handleError);
// };

// -------------------------------------------------------

// ---------------------


// import axios from "axios";

// const API_URL = "http://localhost:8000/api"; // Ensure this matches your backend port

// const handleResponse = (response) => response.data;
// const handleError = (error) => {
//   if (error.response) {
//     console.error("API call failed. Response data:", error.response.data);
//     console.error("API call failed. Response status:", error.response.status);
//     throw new Error(error.response.data.message || "API call failed");
//   } else if (error.request) {
//     console.error("API call failed. No response received:", error.request);
//     throw new Error("No response received from the server");
//   } else {
//     console.error("API call failed. Error message:", error.message);
//     throw new Error("API call failed");
//   }
// };

// export const registerUser = async (data) => {
//   try {
//     const response = await axios.post(`${API_URL}/auth/register`, data);
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };

// // Login a user and store the token in localStorage
// // export const loginUser = async (data) => {
// //   try {
// //     const response = await axios.post(`${API_URL}/auth/login`, data);
// //     const { token } = response.data; // Ensure the backend returns `token` and not `accessToken`

// //     localStorage.setItem("token", token); // Store the token in localStorage
// //     return response.data;
// //   } catch (error) {
// //     handleError(error);
// //   }
// // };

// export const loginUser = async (credentials) => {
//   try {
//       const response = await axios.post(`${API_URL}/auth/login`, credentials);
//       return response.data;
//   } catch (error) {
//       if (error.response) {
//           // Handle server errors
//           throw new Error(`API call failed. Response status: ${error.response.status}`);
//       } else if (error.request) {
//           // Handle network errors
//           throw new Error("Network error. Please check your connection.");
//       } else {
//           // Handle other errors
//           throw new Error("An unexpected error occurred.");
//       }
//   }
// };
// // Create an Axios instance with a base URL
// export const apiClient = axios.create({
//   baseURL: API_URL,
// });

// // Auto-attach token in API requests
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     console.error("No token found in localStorage");
//   }

//   return config;
// });

// // Fetch the current logged-in user
// export const getCurrentUser = async () => {
//   try {
//     const response = await apiClient.get("/auth/current-user");
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };

// // Fetch tasks for the logged-in user
// export const getTasks = async () => {
//   try {
//     const response = await apiClient.get("/tasks/tasks");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     throw error;
//   }
// };

// // Create a new task
// export const createTask = async (data) => {
//   try {
//     const response = await apiClient.post("/tasks/create-tasks", data);
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };

// // Update an existing task
// export const updateTask = async (id, data) => {
//   try {
//     const response = await apiClient.put(`tasks/update-tasks/${id}`, data);
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };

// // Delete a task
// export const deleteTask = async (id) => {
//   try {
//     const response = await apiClient.delete(`/tasks/delete-tasks/${id}`);
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };