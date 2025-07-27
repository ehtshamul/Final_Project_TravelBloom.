// TravelBloom - Interactive Travel Platform JavaScript

// Global variables
let searchTimeout;
let currentSearchResults = [];
let allDestinations = [];

// Destination data with categories, tags, and descriptions
const destinationsData = [
    {
        id: 'maldives',
        name: 'Maldives Paradise',
        category: 'beach',
        tags: ['Luxury', 'Romance', 'Relaxation'],
        description: 'Crystal clear waters and pristine white sands',
        image: 'beach 1.webp',
        price: '$2,500',
        duration: '7 days',
        rating: 4.9,
        location: 'Maldives',
        activities: ['Snorkeling', 'Spa', 'Sunset Cruises']
    },
    {
        id: 'bali',
        name: 'Bali Tropical Escape',
        category: 'beach',
        tags: ['Culture', 'Adventure', 'Wellness'],
        description: 'Tropical beaches surrounded by lush greenery and culture',
        image: 'beach2.webp',
        price: '$1,800',
        duration: '10 days',
        rating: 4.7,
        location: 'Indonesia',
        activities: ['Temple Visits', 'Surfing', 'Yoga Retreats']
    },
    {
        id: 'angkor-wat',
        name: 'Angkor Wat, Cambodia',
        category: 'temple',
        tags: ['History', 'Spiritual', 'Archaeology'],
        description: 'Ancient beauty and spiritual significance',
        image: 'temple1.jpeg',
        price: '$1,200',
        duration: '5 days',
        rating: 4.8,
        location: 'Cambodia',
        activities: ['Temple Tours', 'Cultural Workshops', 'Photography']
    },
    {
        id: 'meiji-shrine',
        name: 'Meiji Shrine, Tokyo',
        category: 'temple',
        tags: ['Peaceful', 'Traditional', 'Zen'],
        description: 'Peace and tranquility at Japan\'s iconic shrine',
        image: 'temple2.jpeg',
        price: '$1,500',
        duration: '6 days',
        rating: 4.6,
        location: 'Japan',
        activities: ['Shrine Visits', 'Tea Ceremonies', 'Garden Tours']
    },
    {
        id: 'japan',
        name: 'Japan - Land of Contrasts',
        category: 'country',
        tags: ['Modern', 'Traditional', 'Technology'],
        description: 'Tokyo\'s energy and Mt. Fuji\'s serene beauty',
        image: 'country1.jpeg',
        price: '$2,200',
        duration: '12 days',
        rating: 4.9,
        location: 'Japan',
        activities: ['City Tours', 'Mountain Hiking', 'Hot Springs']
    },
    {
        id: 'italy',
        name: 'Italy - Historic Beauty',
        category: 'country',
        tags: ['History', 'Art', 'Cuisine'],
        description: 'Historic cities — Venice, Rome, and beyond',
        image: 'country2.jpeg',
        price: '$2,800',
        duration: '14 days',
        rating: 4.8,
        location: 'Italy',
        activities: ['Museum Visits', 'Wine Tasting', 'Architecture Tours']
    }
];

// Search suggestions data
const searchSuggestions = [
    { text: 'Beach destinations', icon: 'fas fa-umbrella-beach', category: 'beach' },
    { text: 'Temple experiences', icon: 'fas fa-pray', category: 'temple' },
    { text: 'Cultural tours', icon: 'fas fa-landmark', category: 'culture' },
    { text: 'Adventure trips', icon: 'fas fa-mountain', category: 'adventure' },
    { text: 'Luxury resorts', icon: 'fas fa-crown', category: 'luxury' },
    { text: 'Budget travel', icon: 'fas fa-dollar-sign', category: 'budget' },
    { text: 'Family vacations', icon: 'fas fa-users', category: 'family' },
    { text: 'Solo travel', icon: 'fas fa-user', category: 'solo' },
    { text: 'Honeymoon packages', icon: 'fas fa-heart', category: 'romance' },
    { text: 'Photography tours', icon: 'fas fa-camera', category: 'photography' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize destination data
    allDestinations = destinationsData;
    
    // Set up event listeners
    setupSearchFunctionality();
    setupCardInteractions();
    setupButtonInteractions();
    setupSmoothScrolling();
    setupAnimations();
    
    // Initialize search suggestions
    displaySearchSuggestions();
    
    console.log('TravelBloom platform initialized successfully!');
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Search input event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);
    
    // Search button click
    searchBtn.addEventListener('click', performSearch);
    
    // Enter key press
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search suggestions
    searchTimeout = setTimeout(() => {
        if (query.length > 0) {
            showSearchSuggestions();
            filterSearchSuggestions(query);
        } else {
            displaySearchSuggestions();
        }
    }, 300);
}

function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    suggestions.style.display = 'block';
}

function hideSearchSuggestions() {
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
        const suggestions = document.getElementById('searchSuggestions');
        suggestions.style.display = 'none';
    }, 200);
}

function displaySearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = '';
    
    searchSuggestions.forEach(suggestion => {
        const suggestionItem = createSuggestionElement(suggestion);
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function filterSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = '';
    
    const filteredSuggestions = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach(suggestion => {
            const suggestionItem = createSuggestionElement(suggestion);
            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        // Show "no results" message
        const noResults = document.createElement('div');
        noResults.className = 'suggestion-item';
        noResults.innerHTML = '<i class="fas fa-search"></i> No suggestions found';
        suggestionsContainer.appendChild(noResults);
    }
}

function createSuggestionElement(suggestion) {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
        <i class="${suggestion.icon}"></i>
        <span>${suggestion.text}</span>
    `;
    
    suggestionItem.addEventListener('click', () => {
        document.getElementById('searchInput').value = suggestion.text;
        performSearch();
    });
    
    return suggestionItem;
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (query.length === 0) {
        hideSearchResults();
        return;
    }
    
    // Search through destinations
    const results = searchDestinations(query);
    displaySearchResults(results, query);
    
    // Hide suggestions
    hideSearchSuggestions();
    
    // Scroll to results
    document.querySelector('.search-results').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function searchDestinations(query) {
    const searchTerm = query.toLowerCase();
    
    return allDestinations.filter(destination => {
        return (
            destination.name.toLowerCase().includes(searchTerm) ||
            destination.description.toLowerCase().includes(searchTerm) ||
            destination.location.toLowerCase().includes(searchTerm) ||
            destination.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            destination.activities.some(activity => activity.toLowerCase().includes(searchTerm))
        );
    });
}

function displaySearchResults(results, query) {
    const searchResultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <h3><i class="fas fa-search"></i> No destinations found for "${query}"</h3>
                <p>Try searching for different keywords or browse our categories below.</p>
            </div>
        `;
    } else {
        searchResultsContainer.innerHTML = `
            <h3><i class="fas fa-search"></i> Search Results for "${query}" (${results.length} found)</h3>
            <div class="search-results-grid">
                ${results.map(destination => createSearchResultCard(destination)).join('')}
            </div>
        `;
    }
    
    searchResultsContainer.classList.add('active');
    currentSearchResults = results;
}

function createSearchResultCard(destination) {
    return `
        <div class="search-result-card" data-destination="${destination.id}">
            <div class="result-card-img" style="background-image: url('${destination.image}');">
                <div class="result-card-overlay">
                    <button class="book-result-btn">Book Now</button>
                </div>
            </div>
            <div class="result-card-content">
                <h4>${destination.name}</h4>
                <p class="result-location"><i class="fas fa-map-marker-alt"></i> ${destination.location}</p>
                <p>${destination.description}</p>
                <div class="result-details">
                    <span class="result-price"><i class="fas fa-dollar-sign"></i> ${destination.price}</span>
                    <span class="result-duration"><i class="fas fa-calendar"></i> ${destination.duration}</span>
                    <span class="result-rating"><i class="fas fa-star"></i> ${destination.rating}</span>
                </div>
                <div class="result-tags">
                    ${destination.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function hideSearchResults() {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.classList.remove('active');
    currentSearchResults = [];
}

// Card interactions
function setupCardInteractions() {
    // Add click event listeners to all cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            const destinationId = card.dataset.destination;
            handleCardClick(destinationId);
        }
        
        if (e.target.closest('.search-result-card')) {
            const card = e.target.closest('.search-result-card');
            const destinationId = card.dataset.destination;
            handleCardClick(destinationId);
        }
        
        if (e.target.closest('.book-card-btn') || e.target.closest('.book-result-btn')) {
            e.stopPropagation();
            handleBookingClick(e.target.closest('button'));
        }
    });
}

function handleCardClick(destinationId) {
    const destination = allDestinations.find(d => d.id === destinationId);
    if (destination) {
        showDestinationModal(destination);
    }
}

function handleBookingClick(button) {
    const card = button.closest('.card, .search-result-card');
    const destinationId = card.dataset.destination;
    const destination = allDestinations.find(d => d.id === destinationId);
    
    if (destination) {
        showBookingModal(destination);
    }
}

// Button interactions
function setupButtonInteractions() {
    // Book Now button in hero section
    const bookNowBtn = document.querySelector('.book-now-btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', () => {
            showBookingModal();
        });
    }
    
    // Explore Destinations button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.querySelector('.recommendations').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Modal functions
function showDestinationModal(destination) {
    const modal = createModal('destination', destination);
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function showBookingModal(destination = null) {
    const modal = createModal('booking', destination);
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createModal(type, destination) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    if (type === 'destination') {
        modal.innerHTML = createDestinationModalContent(destination);
    } else if (type === 'booking') {
        modal.innerHTML = createBookingModalContent(destination);
    } else if (type === 'contact') {
        modal.innerHTML = createContactModalContent(destination);
    }
    
    // Close modal functionality
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) {
            closeModal(modal);
        }
    });
    
    return modal;
}

function createDestinationModalContent(destination) {
    return `
        <div class="modal-content destination-modal">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-header">
                <h2>${destination.name}</h2>
                <p class="modal-location"><i class="fas fa-map-marker-alt"></i> ${destination.location}</p>
            </div>
            <div class="modal-body">
                <div class="modal-image" style="background-image: url('${destination.image}');"></div>
                <div class="modal-info">
                    <p class="modal-description">${destination.description}</p>
                    <div class="modal-details">
                        <div class="detail-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>Price: ${destination.price}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>Duration: ${destination.duration}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <span>Rating: ${destination.rating}/5</span>
                        </div>
                    </div>
                    <div class="modal-activities">
                        <h4>Activities Included:</h4>
                        <ul>
                            ${destination.activities.map(activity => `<li><i class="fas fa-check"></i> ${activity}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-tags">
                        ${destination.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="book-modal-btn">Book This Trip</button>
            </div>
        </div>
    `;
}

function createBookingModalContent(destination) {
    const destinationName = destination ? destination.name : 'your dream destination';
    
    return `
        <div class="modal-content booking-modal">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-header">
                <h2>Book Your Trip</h2>
                <p>${destinationName}</p>
            </div>
            <div class="modal-body">
                <form id="bookingForm" class="booking-form">
                    <div class="form-group">
                        <label for="bookingName">Full Name</label>
                        <input type="text" id="bookingName" required>
                    </div>
                    <div class="form-group">
                        <label for="bookingEmail">Email</label>
                        <input type="email" id="bookingEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="bookingPhone">Phone</label>
                        <input type="tel" id="bookingPhone" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookingDate">Travel Date</label>
                            <input type="date" id="bookingDate" required>
                        </div>
                        <div class="form-group">
                            <label for="bookingGuests">Number of Guests</label>
                            <select id="bookingGuests" required>
                                <option value="">Select</option>
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5+">5+ Guests</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="bookingMessage">Special Requirements</label>
                        <textarea id="bookingMessage" rows="3" placeholder="Any special requests or requirements..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" form="bookingForm" class="submit-booking-btn">Submit Booking Request</button>
            </div>
        </div>
    `;
}

function createContactModalContent(contactData) {
    return `
        <div class="modal-content contact-modal">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-header">
                <h2><i class="fas fa-check-circle"></i> Message Sent Successfully!</h2>
            </div>
            <div class="modal-body">
                <p>Thank you for reaching out to us, ${contactData.name}!</p>
                <p>We've received your message about "${contactData.subject}" and our team will get back to you at ${contactData.email} within 24 hours.</p>
                <div class="confirmation-details">
                    <h4>Message Summary:</h4>
                    <ul>
                        <li><strong>Name:</strong> ${contactData.name}</li>
                        <li><strong>Email:</strong> ${contactData.email}</li>
                        <li><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</li>
                        <li><strong>Subject:</strong> ${contactData.subject}</li>
                        <li><strong>Message:</strong> ${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}</li>
                    </ul>
                </div>
                <p>In the meantime, feel free to explore our destinations or check out our social media for travel inspiration!</p>
            </div>
            <div class="modal-footer">
                <button class="close-confirmation-btn" onclick="closeModal(this.closest('.modal-overlay'))">Close</button>
            </div>
        </div>
    `;
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Form handling
document.addEventListener('submit', function(e) {
    if (e.target.id === 'bookingForm') {
        e.preventDefault();
        handleBookingSubmission(e.target);
    }
    
    if (e.target.id === 'contactForm') {
        e.preventDefault();
        handleContactSubmission(e.target);
    }
});

function handleBookingSubmission(form) {
    const formData = new FormData(form);
    const bookingData = {
        name: formData.get('bookingName') || document.getElementById('bookingName').value,
        email: formData.get('bookingEmail') || document.getElementById('bookingEmail').value,
        phone: formData.get('bookingPhone') || document.getElementById('bookingPhone').value,
        date: formData.get('bookingDate') || document.getElementById('bookingDate').value,
        guests: formData.get('bookingGuests') || document.getElementById('bookingGuests').value,
        message: formData.get('bookingMessage') || document.getElementById('bookingMessage').value
    };
    
    // Simulate booking submission
    showBookingConfirmation(bookingData);
}

function showBookingConfirmation(bookingData) {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.innerHTML = `
            <div class="modal-content confirmation-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-check-circle"></i> Booking Request Submitted!</h2>
                </div>
                <div class="modal-body">
                    <p>Thank you for your booking request, ${bookingData.name}!</p>
                    <p>We've received your request for ${bookingData.guests} guest(s) on ${bookingData.date}.</p>
                    <p>Our travel experts will review your request and contact you at ${bookingData.email} within 24 hours to confirm your booking and discuss the details.</p>
                    <div class="confirmation-details">
                        <h4>Booking Summary:</h4>
                        <ul>
                            <li><strong>Name:</strong> ${bookingData.name}</li>
                            <li><strong>Email:</strong> ${bookingData.email}</li>
                            <li><strong>Phone:</strong> ${bookingData.phone}</li>
                            <li><strong>Travel Date:</strong> ${bookingData.date}</li>
                            <li><strong>Guests:</strong> ${bookingData.guests}</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="close-confirmation-btn" onclick="closeModal(this.closest('.modal-overlay'))">Close</button>
                </div>
            </div>
        `;
    }
}

function handleContactSubmission(form) {
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name') || document.getElementById('name').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        subject: formData.get('subject') || document.getElementById('subject').value,
        message: formData.get('message') || document.getElementById('message').value
    };
    
    // Simulate contact form submission
    showContactConfirmation(contactData);
}

function showContactConfirmation(contactData) {
    const modal = createModal('contact', contactData);
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for modals and additional styling
const additionalStyles = `
<style>
/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-overlay.active {
    opacity: 1;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.modal-overlay.active .modal-content {
    transform: scale(1);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    z-index: 1;
}

.modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    color: #1b3a4b;
    margin-bottom: 0.5rem;
}

.modal-location {
    color: #666;
    font-size: 1.1rem;
}

.modal-body {
    padding: 2rem;
}

.modal-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    margin-bottom: 1.5rem;
}

.modal-info {
    display: grid;
    gap: 1.5rem;
}

.modal-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
}

.modal-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
}

.detail-item i {
    color: #4ecdc4;
    width: 20px;
}

.modal-activities h4 {
    color: #1b3a4b;
    margin-bottom: 0.5rem;
}

.modal-activities ul {
    list-style: none;
    padding: 0;
}

.modal-activities li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #666;
}

.modal-activities i {
    color: #4ecdc4;
    width: 20px;
}

.modal-footer {
    padding: 1rem 2rem 2rem;
    text-align: center;
}

.book-modal-btn,
.submit-booking-btn,
.close-confirmation-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.book-modal-btn:hover,
.submit-booking-btn:hover,
.close-confirmation-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

/* Booking Form Styles */
.booking-form {
    display: grid;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    font-weight: 600;
    color: #1b3a4b;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.8rem;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #4ecdc4;
}

/* Search Results Styles */
.search-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.search-result-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    cursor: pointer;
}

.search-result-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(78, 205, 196, 0.3);
}

.result-card-img {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}

.result-card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.search-result-card:hover .result-card-overlay {
    opacity: 1;
}

.book-result-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.book-result-btn:hover {
    transform: scale(1.05);
}

.result-card-content {
    padding: 1.5rem;
}

.result-card-content h4 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #4ecdc4;
}

.result-location {
    color: #e2e8f0;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.result-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.result-price,
.result-duration,
.result-rating {
    color: #4ecdc4;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.no-results {
    text-align: center;
    padding: 3rem;
}

.no-results h3 {
    color: #4ecdc4;
    margin-bottom: 1rem;
}

.no-results p {
    color: #e2e8f0;
    font-size: 1.1rem;
}

/* Confirmation Modal */
.confirmation-modal .modal-header h2 {
    color: #4ecdc4;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.confirmation-details {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-top: 1.5rem;
}

.confirmation-details h4 {
    color: #1b3a4b;
    margin-bottom: 1rem;
}

.confirmation-details ul {
    list-style: none;
    padding: 0;
}

.confirmation-details li {
    margin-bottom: 0.5rem;
    color: #666;
}

/* Animation Classes */
.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Responsive Design for Modals */
@media (max-width: 768px) {
    .modal-content {
        margin: 1rem;
        max-width: calc(100vw - 2rem);
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .modal-details {
        grid-template-columns: 1fr;
    }
    
    .search-results-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles); 