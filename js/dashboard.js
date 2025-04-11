class Dashboard {
    constructor(app) {
      this.app = app;
      this.initCharts();
      this.loadDashboardData();
    }
  
    initCharts() {
      // Initialize dashboard charts
      this.incomeChart = new Chart(
        document.getElementById('incomeChart'),
        {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Monthly Income',
              data: [22000, 23500, 21000, 24000, 24500, 23000],
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              borderColor: '#4f46e5',
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: value => '$' + value.toLocaleString()
                }
              }
            }
          }
        }
      );
    }
  
    async loadDashboardData() {
      try {
        // Simulate API calls
        const [properties, tenants, payments, requests] = await Promise.all([
          this.fetchProperties(),
          this.fetchTenants(),
          this.fetchPayments(),
          this.fetchMaintenanceRequests()
        ]);
        
        this.updateStats(properties, tenants, payments, requests);
        this.updateRecentActivity(payments, requests);
      } catch (error) {
        this.app.showNotification('Failed to load dashboard data', 'error');
      }
    }
  
    updateStats(properties, tenants, payments, requests) {
      // Update stat cards
      document.getElementById('totalProperties').textContent = properties.length;
      document.getElementById('totalTenants').textContent = tenants.length;
      
      const totalRent = payments.reduce((sum, payment) => sum + payment.amount, 0);
      document.getElementById('totalRent').textContent = '$' + totalRent.toLocaleString();
      
      const pendingRequests = requests.filter(req => req.status === 'pending').length;
      document.getElementById('pendingRequests').textContent = pendingRequests;
    }
  
    updateRecentActivity(payments, requests) {
      const activityList = document.getElementById('recentActivity');
      activityList.innerHTML = '';
      
      // Combine and sort activities
      const activities = [
        ...payments.map(p => ({ ...p, type: 'payment' })),
        ...requests.map(r => ({ ...r, type: 'request' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
       .slice(0, 5);
      
      activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        
        if (activity.type === 'payment') {
          li.innerHTML = `
            <i class="fas fa-dollar-sign text-green-500"></i>
            <span>${activity.tenant} paid $${activity.amount} for ${activity.month}</span>
            <span class="activity-time">${this.formatTime(activity.date)}</span>
          `;
        } else {
          li.innerHTML = `
            <i class="fas fa-tools text-blue-500"></i>
            <span>New ${activity.category} request from ${activity.tenant}</span>
            <span class="activity-time">${this.formatTime(activity.date)}</span>
          `;
        }
        
        activityList.appendChild(li);
      });
    }
  
    formatTime(dateString) {
      // Format time as "2 hours ago", "1 day ago", etc.
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `${minutes} min ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  
    // Mock API methods
    async fetchProperties() {
      return [
        { id: 1, name: 'Downtown Apartment', units: 12, occupied: 10 },
        { id: 2, name: 'Suburban House', units: 1, occupied: 1 }
      ];
    }
  
    async fetchTenants() {
      return [
        { id: 1, name: 'Michael Smith', propertyId: 1 },
        { id: 2, name: 'Emily Johnson', propertyId: 2 }
      ];
    }
  
    async fetchPayments() {
      return [
        { id: 1, tenant: 'Michael Smith', amount: 2400, month: 'May', date: '2023-05-01' },
        { id: 2, tenant: 'Emily Johnson', amount: 1800, month: 'May', date: '2023-05-03' }
      ];
    }
  
    async fetchMaintenanceRequests() {
      return [
        { id: 1, tenant: 'Michael Smith', category: 'plumbing', status: 'pending', date: '2023-05-15' },
        { id: 2, tenant: 'Emily Johnson', category: 'electrical', status: 'completed', date: '2023-05-10' }
      ];
    }
  }
  
  // Initialize dashboard if on dashboard page
  if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      new Dashboard(window.propertyPro);
    });
  }