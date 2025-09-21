// API configuration and client setup
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  usuarios: '/usuarios',
  departamentos: '/departamentos',
  sistemas: '/sistemas',
  contratos: '/contratos',
  dashboard: '/dashboard',
} as const;

// Specific API functions
export const usuariosApi = {
  getAll: () => apiClient.get(API_ENDPOINTS.usuarios),
  getById: (id: string) => apiClient.get(`${API_ENDPOINTS.usuarios}/${id}`),
  create: (data: any) => apiClient.post(API_ENDPOINTS.usuarios, data),
  update: (id: string, data: any) => apiClient.put(`${API_ENDPOINTS.usuarios}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${API_ENDPOINTS.usuarios}/${id}`),
};

export const departamentosApi = {
  getAll: () => apiClient.get(API_ENDPOINTS.departamentos),
  getById: (id: string) => apiClient.get(`${API_ENDPOINTS.departamentos}/${id}`),
  create: (data: any) => apiClient.post(API_ENDPOINTS.departamentos, data),
  update: (id: string, data: any) => apiClient.put(`${API_ENDPOINTS.departamentos}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${API_ENDPOINTS.departamentos}/${id}`),
};

export const sistemasApi = {
  getAll: () => apiClient.get(API_ENDPOINTS.sistemas),
  getById: (id: string) => apiClient.get(`${API_ENDPOINTS.sistemas}/${id}`),
  create: (data: any) => apiClient.post(API_ENDPOINTS.sistemas, data),
  update: (id: string, data: any) => apiClient.put(`${API_ENDPOINTS.sistemas}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${API_ENDPOINTS.sistemas}/${id}`),
};

export const contratosApi = {
  getAll: () => apiClient.get(API_ENDPOINTS.contratos),
  getById: (id: string) => apiClient.get(`${API_ENDPOINTS.contratos}/${id}`),
  create: (data: any) => apiClient.post(API_ENDPOINTS.contratos, data),
  update: (id: string, data: any) => apiClient.put(`${API_ENDPOINTS.contratos}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${API_ENDPOINTS.contratos}/${id}`),
};

export const dashboardApi = {
  getStats: () => apiClient.get(`${API_ENDPOINTS.dashboard}/stats`),
  getChartData: () => apiClient.get(`${API_ENDPOINTS.dashboard}/charts`),
};