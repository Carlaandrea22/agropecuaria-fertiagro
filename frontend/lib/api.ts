import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:4000", // Cambia esto por la URL de tu backend
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      //window.location.href = "/"
    }
    return Promise.reject(error)
  },
)
