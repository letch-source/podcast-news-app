// Admin Dashboard JavaScript
let adminToken = '';
let currentSection = 'overview';
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
        adminToken = savedToken;
        showDashboard();
    } else {
        showLogin();
    }
    
    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('userSearch').addEventListener('input', filterUsers);
    
    // Set active nav item
    setActiveNavItem('overview');
});

// Login handling
async function handleLogin(e) {
    e.preventDefault();
    const token = document.getElementById('adminToken').value;
    
    try {
        const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminToken: token })
        });
        
        if (response.ok) {
            adminToken = token;
            localStorage.setItem('adminToken', token);
            showDashboard();
        } else {
            alert('Invalid admin token');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

// Show login modal
function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboardData();
}

// Logout
function logout() {
    adminToken = '';
    localStorage.removeItem('adminToken');
    showLogin();
}

// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    
    // Show selected section
    document.getElementById(section + 'Section').classList.remove('hidden');
    
    // Update page title
    const titles = {
        'overview': 'Dashboard Overview',
        'users': 'User Management',
        'analytics': 'Analytics',
        'subscriptions': 'Subscription Management',
        'adminHistory': 'Admin History'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Set active nav item
    setActiveNavItem(section);
    
    // Load section-specific data
    currentSection = section;
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'subscriptions':
            loadSubscriptionsData();
            break;
        case 'adminHistory':
            loadAdminHistory();
            break;
    }
}

// Set active navigation item
function setActiveNavItem(section) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-gray-700');
    });
    // Find the nav item for the current section and make it active
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(section.toLowerCase())) {
            item.classList.add('bg-gray-700');
        }
    });
}

// Load dashboard data
async function loadDashboardData() {
    updateLastUpdated();
    await loadOverviewData();
}

// Load overview data
async function loadOverviewData() {
    try {
        const response = await fetch('/api/admin/overview', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateOverviewStats(data);
            createOverviewCharts(data);
        }
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

// Update overview statistics
function updateOverviewStats(data) {
    document.getElementById('totalUsers').textContent = data.totalUsers || 0;
    document.getElementById('premiumUsers').textContent = data.premiumUsers || 0;
    document.getElementById('dailySummaries').textContent = data.dailySummaries || 0;
    document.getElementById('revenue').textContent = `$${data.revenue || 0}`;
}

// Create overview charts
function createOverviewCharts(data) {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    if (charts.userGrowth) charts.userGrowth.destroy();
    charts.userGrowth = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: data.userGrowth?.labels || [],
            datasets: [{
                label: 'New Users',
                data: data.userGrowth?.data || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Daily Usage Chart
    const dailyUsageCtx = document.getElementById('dailyUsageChart').getContext('2d');
    if (charts.dailyUsage) charts.dailyUsage.destroy();
    charts.dailyUsage = new Chart(dailyUsageCtx, {
        type: 'bar',
        data: {
            labels: data.dailyUsage?.labels || [],
            datasets: [{
                label: 'Summaries Generated',
                data: data.dailyUsage?.data || [],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load users data
async function loadUsersData() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">${user.email.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${user.email}</div>
                        <div class="text-sm text-gray-500">ID: ${user.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${user.isPremium ? 'Premium' : 'Free'}
                </span>
                ${user.isPremium && user.premiumSource ? 
                    `<div class="text-xs text-gray-500 mt-1">${user.premiumSource === 'paid' ? '💰 Paid' : '👑 Admin Granted'}</div>` : 
                    ''
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${user.dailyUsageCount || 0}/10
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="toggleUserPremium('${user.email}', ${!user.isPremium})" class="text-blue-600 hover:text-blue-900 mr-3">
                    ${user.isPremium ? 'Remove Premium' : 'Make Premium'}
                </button>
                <button onclick="deleteUser('${user.email}')" class="text-red-600 hover:text-red-900">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Toggle user premium status
async function toggleUserPremium(email, isPremium) {
    if (!confirm(`Are you sure you want to ${isPremium ? 'grant' : 'remove'} premium access for ${email}?`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/set-premium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                email: email,
                isPremium: isPremium,
                adminToken: adminToken
            })
        });
        
        if (response.ok) {
            alert(`User ${isPremium ? 'upgraded to' : 'downgraded from'} premium successfully`);
            loadUsersData();
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Admin API error:', errorData);
            alert(`Failed to update user status: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user status');
    }
}

// Delete user
async function deleteUser(email) {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                email: email,
                adminToken: adminToken
            })
        });
        
        if (response.ok) {
            alert('User deleted successfully');
            loadUsersData();
        } else {
            alert('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const email = row.querySelector('td:first-child .text-sm.font-medium').textContent.toLowerCase();
        if (email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Refresh users
function refreshUsers() {
    loadUsersData();
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        const response = await fetch('/api/admin/analytics', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            createAnalyticsCharts(data);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Create analytics charts
function createAnalyticsCharts(data) {
    // Popular Topics Chart
    const topicsCtx = document.getElementById('topicsChart').getContext('2d');
    if (charts.topics) charts.topics.destroy();
    charts.topics = new Chart(topicsCtx, {
        type: 'doughnut',
        data: {
            labels: data.popularTopics?.labels || [],
            datasets: [{
                data: data.popularTopics?.data || [],
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#06B6D4', '#84CC16', '#F97316'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Summary Lengths Chart
    const lengthsCtx = document.getElementById('lengthsChart').getContext('2d');
    if (charts.lengths) charts.lengths.destroy();
    charts.lengths = new Chart(lengthsCtx, {
        type: 'pie',
        data: {
            labels: data.summaryLengths?.labels || [],
            datasets: [{
                data: data.summaryLengths?.data || [],
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Daily Summaries Chart
    const dailyCtx = document.getElementById('dailySummariesChart').getContext('2d');
    if (charts.dailySummaries) charts.dailySummaries.destroy();
    charts.dailySummaries = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: data.dailySummaries?.labels || [],
            datasets: [{
                label: 'Daily Summaries',
                data: data.dailySummaries?.data || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load subscriptions data
async function loadSubscriptionsData() {
    try {
        const response = await fetch('/api/admin/subscriptions', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateSubscriptionStats(data);
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

// Update subscription statistics
function updateSubscriptionStats(data) {
    document.getElementById('activeSubscriptions').textContent = data.activeSubscriptions || 0;
    document.getElementById('monthlyRevenue').textContent = `$${data.monthlyRevenue || 0}`;
    document.getElementById('conversionRate').textContent = `${data.conversionRate || 0}%`;
}

// Update last updated timestamp
function updateLastUpdated() {
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
}

// Load admin history
async function loadAdminHistory() {
    try {
        const response = await fetch('/api/admin/admin-history', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.ok) {
            const history = await response.json();
            displayAdminHistory(history);
        } else {
            console.error('Failed to load admin history');
        }
    } catch (error) {
        console.error('Error loading admin history:', error);
    }
}

// Display admin history in table
function displayAdminHistory(history) {
    const tbody = document.getElementById('adminHistoryTableBody');
    tbody.innerHTML = '';
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No admin actions found</td></tr>';
        return;
    }
    
    history.forEach(action => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${action.adminEmail}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${action.targetEmail}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(action.action)}">
                    ${formatAction(action.action)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${action.details || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(action.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Get color for action type
function getActionColor(action) {
    switch (action) {
        case 'set_premium': return 'bg-green-100 text-green-800';
        case 'set_free': return 'bg-yellow-100 text-yellow-800';
        case 'reset_password': return 'bg-blue-100 text-blue-800';
        case 'delete_user': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Format action for display
function formatAction(action) {
    switch (action) {
        case 'set_premium': return 'Grant Premium';
        case 'set_free': return 'Remove Premium';
        case 'reset_password': return 'Reset Password';
        case 'delete_user': return 'Delete User';
        default: return action;
    }
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    if (adminToken && currentSection === 'overview') {
        loadOverviewData();
        updateLastUpdated();
    }
}, 30000);
