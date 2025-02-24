
import axios from "axios";

const API_URL = "http://localhost:8000/api"; 

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response) {
    console.error("API call failed. Response data:", error.response.data);
    console.error("API call failed. Response status:", error.response.status);
    throw new Error(error.response.data.message || "API call failed");
  } else if (error.request) {
    console.error("API call failed. No response received:", error.request);
    throw new Error("No response received from the server");
  } else {
    console.error("API call failed. Error message:", error.message);
    throw new Error("API call failed");
  }
};

// Register a new user
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    const { accessToken } = response.data;

    localStorage.setItem("token", accessToken);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};


export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    const { accessToken } = response.data;

    localStorage.setItem("token", accessToken);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const apiClient = axios.create({
  baseURL: API_URL,
});


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


export const getTasks = async () => {
  try {
    const response = await apiClient.get("/tasks/tasks");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};


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
    const response = await apiClient.put(`/tasks/update-tasks/${id}`, data);
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