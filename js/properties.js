class PropertiesManager {
    constructor(app) {
      this.app = app;
      this.properties = [];
      this.initPropertyModal();
      this.loadProperties();
      this.setupSearch();
    }
  
    initPropertyModal() {
      this.propertyModal = document.getElementById('propertyModal');
      this.propertyForm = document.getElementById('propertyForm');
      
      this.propertyForm.addEventListener('submit', this.handlePropertySubmit.bind(this));
    }
  
    async loadProperties() {
      try {
        this.properties = await this.fetchProperties();
        this.renderProperties();
      } catch (error) {
        this.app.showNotification('Failed to load properties', 'error');
      }
    }
  
    renderProperties(filteredProperties = null) {
      const propertiesToRender = filteredProperties || this.properties;
      const container = document.getElementById('propertiesContainer');
      container.innerHTML = '';
      
      if (propertiesToRender.length === 0) {
        container.innerHTML = '<div class="empty-state">No properties found</div>';
        return;
      }
      
      propertiesToRender.forEach(property => {
        const card = this.createPropertyCard(property);
        container.appendChild(card);
      });
    }
  
    createPropertyCard(property) {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <div class="property-image">
          <img src="${property.image || 'default-property.jpg'}" alt="${property.name}">
          <span class="property-status ${property.occupied ? 'occupied' : 'vacant'}">
            ${property.occupied ? 'Occupied' : 'Vacant'}
          </span>
        </div>
        <div class="property-details">
          <h3>${property.name}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${property.address}</p>
          <div class="property-meta">
            <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
            <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
            <span><i class="fas fa-ruler-combined"></i> ${property.squareFeet} sqft</span>
          </div>
          <div class="property-rent">
            <span>$${property.rent}/mo</span>
          </div>
          <div class="property-actions">
            <button class="btn-view" data-id="${property.id}">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn-edit" data-id="${property.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" data-id="${property.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
      
      // Add event listeners to buttons
      card.querySelector('.btn-view').addEventListener('click', () => this.viewProperty(property.id));
      card.querySelector('.btn-edit').addEventListener('click', () => this.editProperty(property.id));
      card.querySelector('.btn-delete').addEventListener('click', () => this.deleteProperty(property.id));
      
      return card;
    }
  
    viewProperty(id) {
      const property = this.properties.find(p => p.id === id);
      // In a real app, this would open a detailed view or modal
      this.app.showNotification(`Viewing ${property.name}`, 'info');
    }
  
    editProperty(id) {
      const property = this.properties.find(p => p.id === id);
      this.openPropertyModal(property);
    }
  
    deleteProperty(id) {
      if (confirm('Are you sure you want to delete this property?')) {
        // In a real app, this would call an API
        this.properties = this.properties.filter(p => p.id !== id);
        this.renderProperties();
        this.app.showNotification('Property deleted', 'success');
      }
    }
  
    openPropertyModal(property = null) {
      this.currentProperty = property;
      
      if (property) {
        // Edit mode
        document.getElementById('propertyModalTitle').textContent = 'Edit Property';
        document.getElementById('propertyId').value = property.id;
        document.getElementById('propertyName').value = property.name;
        document.getElementById('propertyAddress').value = property.address;
        document.getElementById('propertyBedrooms').value = property.bedrooms;
        document.getElementById('propertyBathrooms').value = property.bathrooms;
        document.getElementById('propertySquareFeet').value = property.squareFeet;
        document.getElementById('propertyRent').value = property.rent;
      } else {
        // Add mode
        document.getElementById('propertyModalTitle').textContent = 'Add New Property';
        this.propertyForm.reset();
      }
      
      this.propertyModal.classList.remove('hidden');
    }
  
    handlePropertySubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.propertyForm);
      const propertyData = {
        id: formData.get('id') || Date.now(), // Use timestamp as ID for new properties
        name: formData.get('name'),
        address: formData.get('address'),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        squareFeet: parseInt(formData.get('squareFeet')),
        rent: parseFloat(formData.get('rent')),
        occupied: false,
        image: 'default-property.jpg'
      };
      
      if (this.currentProperty) {
        // Update existing property
        const index = this.properties.findIndex(p => p.id === this.currentProperty.id);
        this.properties[index] = propertyData;
        this.app.showNotification('Property updated', 'success');
      } else {
        // Add new property
        this.properties.push(propertyData);
        this.app.showNotification('Property added', 'success');
      }
      
      this.propertyModal.classList.add('hidden');
      this.renderProperties();
    }
  
    setupSearch() {
      const searchInput = document.getElementById('propertySearch');
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = this.properties.filter(property => 
          property.name.toLowerCase().includes(searchTerm) ||
          property.address.toLowerCase().includes(searchTerm)
        );
        this.renderProperties(filtered);
      });
    }
  
    // Mock API method
    async fetchProperties() {
      return [
        {
          id: 1,
          name: 'Downtown Apartment',
          address: '123 Main St, City',
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1200,
          rent: 2400,
          occupied: true,
          image: 'downtown-apartment.jpg'
        },
        {
          id: 2,
          name: 'Suburban House',
          address: '456 Oak Ave, Suburb',
          bedrooms: 4,
          bathrooms: 2.5,
          squareFeet: 1800,
          rent: 1800,
          occupied: true,
          image: 'suburban-house.jpg'
        }
      ];
    }
  }
  
  // Initialize properties manager if on properties page
  if (window.location.pathname.includes('properties.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      new PropertiesManager(window.propertyPro);
    });
  }