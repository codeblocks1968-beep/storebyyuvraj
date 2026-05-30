/**
 * Auth Middleware & Utility
 * Handles user sessions and route protection
 */
const Auth = {
    // Key used for storage
    STORAGE_KEY: 'gamingHubUser',

    /**
     * Log in a user
     * @param {string} email 
     * @param {string} password 
     * @returns {boolean}
     */
    login(email, password) {
        // Admin specific login
        if (email === 'yuvrajlohiya16@gmail.com' && password === 'teddynumber09') {
            const user = {
                email: email,
                name: 'Yuvraj',
                role: 'admin',
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            return true;
        }
        
        // Mock standard user logic (if they log in as someone else, they just get a 'user' role)
        if (email && password && email !== 'yuvrajlohiya16@gmail.com') {
            const user = {
                email: email,
                name: email.split('@')[0],
                role: 'user',
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            return true;
        }
        
        return false;
    },

    /**
     * Log out the current user
     */
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isAuthenticated() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    /**
     * Get current user data
     * @returns {Object|null}
     */
    getUser() {
        const userJson = localStorage.getItem(this.STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    /**
     * Middleware function to protect routes
     * Redirects to index if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.warn('Access denied. Redirecting to login...');
            // If we're on the admin page, redirect to home and show login
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html?auth=login';
            }
        }
    },

    /**
     * Redirect if already logged in (e.g., for login page)
     */
    redirectIfAuth() {
        if (this.isAuthenticated()) {
            window.location.href = 'admin.html';
        }
    }
};

// Auto-run middleware if needed
// This acts as the "Middle-wear" trigger
if (window.location.pathname.includes('admin.html')) {
    Auth.requireAuth();
}
