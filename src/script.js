// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const connectButtons = document.querySelectorAll('.connect-button');
const notificationButton = document.querySelector('button[aria-label="Notifications"]');

// Tab switching functionality
function switchTab(event) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    const clickedTab = event.currentTarget;
    const tabName = clickedTab.dataset.tab;
    clickedTab.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Save active tab to localStorage
    localStorage.setItem('activeTab', tabName);
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const discussionItems = document.querySelectorAll('.discussion-list li');

    discussionItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const info = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || info.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Connect button functionality
function handleConnect(event) {
    const button = event.currentTarget;
    const mentorName = button.parentElement.querySelector('h3').textContent;
    
    if (button.textContent === 'Connect') {
        button.textContent = 'Pending';
        button.style.backgroundColor = '#666';
        showNotification(`Connection request sent to ${mentorName}`);
    } else if (button.textContent === 'Pending') {
        button.textContent = 'Connect';
        button.style.backgroundColor = '#0066cc';
        showNotification(`Connection request cancelled for ${mentorName}`);
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add styles dynamically
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#333',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Event Listeners
tabButtons.forEach(button => {
    button.addEventListener('click', switchTab);
});

searchInput.addEventListener('input', handleSearch);
searchButton.addEventListener('click', handleSearch);

connectButtons.forEach(button => {
    button.addEventListener('click', handleConnect);
});

notificationButton.addEventListener('click', () => {
    showNotification('No new notifications');
});

// Restore active tab from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        const tabToActivate = document.querySelector(`[data-tab="${activeTab}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        }
    }
});

// Optional: Add keyboard navigation for accessibility
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement.classList.contains('tab-button')) {
        event.currentTarget.click();
    }
});