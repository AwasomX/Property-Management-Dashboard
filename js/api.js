class PropertyProAPI {
    constructor() {
      this.baseUrl = 'https://api.propertypro.com/v1';
      this.token = localStorage.getItem('propertyProToken');
    }
  
    async request(endpoint, method = 'GET', data = null) {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      };
      
      const config = {
        method,
        headers
      };
      
      if (data) {
        config.body = JSON.stringify(data);
      }
      
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'API request failed');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    // Auth endpoints
    async login(email, password) {
      return this.request('/auth/login', 'POST', { email, password });
    }
  
    // Property endpoints
    async getProperties() {
      return this.request('/properties');
    }
  
    async getProperty(id) {
      return this.request(`/properties/${id}`);
    }
  
    async createProperty(propertyData) {
      return this.request('/properties', 'POST', propertyData);
    }
  
    async updateProperty(id, propertyData) {
      return this.request(`/properties/${id}`, 'PUT', propertyData);
    }
  
    async deleteProperty(id) {
      return this.request(`/properties/${id}`, 'DELETE');
    }
  
    // Tenant endpoints
    async getTenants() {
      return this.request('/tenants');
    }
  
    // Payment endpoints
    async getPayments() {
      return this.request('/payments');
    }
  
    // Maintenance endpoints
    async getMaintenanceRequests() {
      return this.request('/maintenance');
    }
  }
  
  // Initialize API service
  window.propertyProAPI = new PropertyProAPI();