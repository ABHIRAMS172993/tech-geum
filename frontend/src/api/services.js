import { apiClient } from "./client"; 

export const AuthService = {
    login: (credentials) => apiClient.post('/auth/login/', credentials),
    register: (userData) => apiClient.post('/auth/register/', userData)
}

export const ProductService = {
    getAll: (params) => apiClient.get('/products/', { params }),
    getById: (id) => apiClient.get('/products/${id}/'),
    create: (data) => apiClient.post('/products/',data),
    update: (id,data) => apiClient.put('/product/${id}/', data),
    delete: (id) => apiClient.delete('/products/${id}/'),
};

export const CustomerService = {
  getAll: () => apiClient.get('/customers/'),
  create: (data) => apiClient.post('/customers/', data),
};

export const OrderService = {
  getAll: () => apiClient.get('/orders/'),
  getById: (id) => apiClient.get(`/orders/${id}/`),
  create: (orderData) => apiClient.post('/orders/', orderData),
  cancel: (id) => apiClient.post(`/orders/${id}/cancel/`),
};

export const ReportService = {
  getSalesReport: (params) => apiClient.get('/reports/sales/', { params }),
};