// API Integration Layer for XAI-Tech Backend
// Integrated with NestJS backend running on port 4000

// Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Backend API Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  incidents: Incident[];
  createdAt: string;
  updatedAt: string;
}

export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  projectId?: string;
  project?: Project;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface CreateThreatRequest {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateIncidentRequest {
  title: string;
  projectId?: string;
}

export interface GenerateReportRequest {
  title: string;
  type: 'summary' | 'comprehensive' | 'detailed';
  projectId?: string;
}

// Base API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.xai-tech.com' 
  : 'http://localhost:4000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }
  
  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  
  // Get auth headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  // Generic request method
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  
  // Authentication methods
  async login(credentials: LoginRequest) {
    const response = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.access_token);
    return response;
  }
  
  async register(userData: RegisterRequest) {
    const response = await this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setToken(response.access_token);
    return response;
  }
  
  async refreshToken() {
    const response = await this.request<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
    });
    
    this.setToken(response.access_token);
    return response;
  }
  
  async getProfile() {
    return await this.request<User>('/auth/profile');
  }
  
  async logout() {
    this.clearToken();
    return { message: 'Logged out successfully' };
  }
  
  // User management methods
  async getUsers() {
    return await this.request<User[]>('/users');
  }
  
  async getUser(id: string) {
    return await this.request<User>(`/users/${id}`);
  }
  
  async updateUser(id: string, data: Partial<User>) {
    return await this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async deleteUser(id: string) {
    return await this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
  
  // Project management methods
  async getProjects() {
    return await this.request<Project[]>('/projects');
  }
  
  async getProject(id: string) {
    return await this.request<Project>(`/projects/${id}`);
  }
  
  async createProject(data: CreateProjectRequest) {
    return await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateProject(id: string, data: Partial<CreateProjectRequest>) {
    return await this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async deleteProject(id: string) {
    return await this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }
  
  // Threat management methods
  async getThreats() {
    return await this.request<Threat[]>('/threats');
  }
  
  async getThreat(id: string) {
    return await this.request<Threat>(`/threats/${id}`);
  }
  
  async createThreat(data: CreateThreatRequest) {
    return await this.request<Threat>('/threats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateThreat(id: string, data: Partial<CreateThreatRequest>) {
    return await this.request<Threat>(`/threats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async deleteThreat(id: string) {
    return await this.request<{ message: string }>(`/threats/${id}`, {
      method: 'DELETE',
    });
  }
  
  async getThreatAnalysis() {
    return await this.request<any>('/threats/analysis');
  }
  
  // Incident management methods
  async getIncidents() {
    return await this.request<Incident[]>('/incidents');
  }
  
  async getIncident(id: string) {
    return await this.request<Incident>(`/incidents/${id}`);
  }
  
  async createIncident(data: CreateIncidentRequest) {
    return await this.request<Incident>('/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateIncidentStatus(id: string, status: Incident['status']) {
    return await this.request<Incident>(`/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
  
  async deleteIncident(id: string) {
    return await this.request<{ message: string }>(`/incidents/${id}`, {
      method: 'DELETE',
    });
  }
  
  // Report methods
  async generateReport(data: GenerateReportRequest) {
    return await this.request<{ id: string; title: string; type: string; message: string }>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async downloadReport(id: string) {
    return await this.request<Report>(`/reports/${id}/download`);
  }
  
  // Search methods
  async globalSearch(query: string) {
    return await this.request<any>(`/search?q=${encodeURIComponent(query)}`);
  }
  
  async searchThreats(query: string) {
    return await this.request<Threat[]>(`/search/threats?q=${encodeURIComponent(query)}`);
  }
  
  async searchIncidents(query: string) {
    return await this.request<Incident[]>(`/search/incidents?q=${encodeURIComponent(query)}`);
  }
  
  // Dashboard methods
  async getDashboardStats() {
    // Combine data from multiple endpoints for dashboard
    const [threats, incidents, projects] = await Promise.all([
      this.getThreats(),
      this.getIncidents(),
      this.getProjects(),
    ]);
    
    return {
      totalThreats: threats.length,
      totalIncidents: incidents.length,
      totalProjects: projects.length,
      recentThreats: threats.slice(0, 5),
      recentIncidents: incidents.slice(0, 5),
      threatsBySeverity: threats.reduce((acc, threat) => {
        acc[threat.severity] = (acc[threat.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      incidentsByStatus: incidents.reduce((acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
  
  // AI Integration methods (placeholder for future AI service)
  async sendChatMessage(message: string) {
    // TODO: Implement when AI service is ready
    throw new Error('AI service not implemented yet');
  }
  
  async analyzeFile(file: File) {
    // TODO: Implement when AI service is ready
    throw new Error('AI service not implemented yet');
  }
}

export const apiClient = new ApiClient();

// Convenience methods
export const api = {
  auth: {
    login: apiClient.login.bind(apiClient),
    register: apiClient.register.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),
    getProfile: apiClient.getProfile.bind(apiClient),
  },
  users: {
    getAll: apiClient.getUsers.bind(apiClient),
    getById: apiClient.getUser.bind(apiClient),
    update: apiClient.updateUser.bind(apiClient),
    delete: apiClient.deleteUser.bind(apiClient),
  },
  projects: {
    getAll: apiClient.getProjects.bind(apiClient),
    getById: apiClient.getProject.bind(apiClient),
    create: apiClient.createProject.bind(apiClient),
    update: apiClient.updateProject.bind(apiClient),
    delete: apiClient.deleteProject.bind(apiClient),
  },
  threats: {
    getAll: apiClient.getThreats.bind(apiClient),
    getById: apiClient.getThreat.bind(apiClient),
    create: apiClient.createThreat.bind(apiClient),
    update: apiClient.updateThreat.bind(apiClient),
    delete: apiClient.deleteThreat.bind(apiClient),
    analyze: apiClient.getThreatAnalysis.bind(apiClient),
  },
  incidents: {
    getAll: apiClient.getIncidents.bind(apiClient),
    getById: apiClient.getIncident.bind(apiClient),
    create: apiClient.createIncident.bind(apiClient),
    updateStatus: apiClient.updateIncidentStatus.bind(apiClient),
    delete: apiClient.deleteIncident.bind(apiClient),
  },
  reports: {
    generate: apiClient.generateReport.bind(apiClient),
    download: apiClient.downloadReport.bind(apiClient),
  },
  search: {
    global: apiClient.globalSearch.bind(apiClient),
    threats: apiClient.searchThreats.bind(apiClient),
    incidents: apiClient.searchIncidents.bind(apiClient),
  },
  dashboard: {
    getStats: apiClient.getDashboardStats.bind(apiClient),
  },
  ai: {
    chat: apiClient.sendChatMessage.bind(apiClient),
    analyze: apiClient.analyzeFile.bind(apiClient),
  },
};