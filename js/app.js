// PropertyPro - Core Application
class PropertyPro {
    constructor() {
      this.initApp();
      this.setupEventListeners();
      this.loadUserData();
    }
  
    initApp() {
      // Initialize core functionality
      this.currentUser = null;
      this.properties = [];
      this.tenants = [];
      this.payments = [];
      this.maintenanceRequests = [];
      
      // Check authentication status
      this.checkAuth();
      
      // Initialize UI components
      this.initSidebar();
      this.initModals();
      this.initNotifications();
    }
  
    checkAuth() {
      // Check if user is logged in (simplified for demo)
      const token = localStorage.getItem('propertyProToken');
      if (token) {
        this.fetchUserData();
      } else {
        this.redirectToLogin();
      }
    }
  
    fetchUserData() {
      // Simulate API call
      setTimeout(() => {
        this.currentUser = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@propertypro.com',
          role: 'landlord',
          avatar: 'JD'
        };
        this.updateUI();
      }, 500);
    }
  
    updateUI() {
      // Update user info in header
      document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = this.currentUser.name;
      });
      
      document.querySelectorAll('.user-avatar').forEach(el => {
        el.textContent = this.currentUser.avatar;
      });
    }
  
    setupEventListeners() {
      // Mobile menu toggle
      document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('hidden');
      });
  
      // Logout button
      document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', this.logout.bind(this));
      });
    }
  
    logout() {
      localStorage.removeItem('propertyProToken');
      this.redirectToLogin();
    }
  
    redirectToLogin() {
      window.location.href = 'login.html';
    }
  
    // Shared UI Components
    initSidebar() {
      // Highlight current page in sidebar
      const currentPage = window.location.pathname.split('/').pop();
      document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  
    initModals() {
      // Initialize all modals
      document.querySelectorAll('[data-modal-toggle]').forEach(button => {
        const modalId = button.getAttribute('data-modal-toggle');
        const modal = document.getElementById(modalId);
        
        button.addEventListener('click', () => {
          modal.classList.toggle('hidden');
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });
      });
    }
  
    initNotifications() {
      // Notification system
      this.notificationCenter = document.getElementById('notification-center');
    }
  
    showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close">&times;</button>
      `;
      
      this.notificationCenter.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        notification.remove();
      }, 5000);
      
      // Close button
      notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
      });
    }
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.propertyPro = new PropertyPro();
  });