// Odoo Logout Handler
// This script detects when user logs out from Odoo interface and redirects to website

(function() {
  'use strict';
  
  // Check if we're on the Odoo login page (indicating logout)
  function isOnOdooLoginPage() {
    return window.location.pathname.includes('/web/login') || 
           document.title.includes('Login') ||
           document.querySelector('.oe_login_form') !== null;
  }
  
  // Check if user came from our website
  function cameFromWebsite() {
    return document.referrer.includes('localhost:5173') || 
           sessionStorage.getItem('nucleus_odoo_access') === 'true';
  }
  
  // Redirect to website homepage
  function redirectToWebsite() {
    console.log('Odoo logout detected, redirecting to website homepage...');
    window.location.href = 'http://localhost:5173/';
  }
  
  // Main logic
  function handleOdooLogout() {
    if (isOnOdooLoginPage() && cameFromWebsite()) {
      // Clear the access flag
      sessionStorage.removeItem('nucleus_odoo_access');
      
      // Redirect after a short delay to allow the page to load
      setTimeout(redirectToWebsite, 1000);
    }
  }
  
  // Set access flag when accessing Odoo from website
  function setOdooAccessFlag() {
    if (window.location.pathname.includes('/odoo') || 
        window.location.pathname.includes('/web')) {
      sessionStorage.setItem('nucleus_odoo_access', 'true');
    }
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    setOdooAccessFlag();
    
    // Check immediately
    handleOdooLogout();
    
    // Also check after a short delay (in case of dynamic loading)
    setTimeout(handleOdooLogout, 500);
    
    // Monitor for navigation changes (SPA behavior)
    let lastPathname = window.location.pathname;
    setInterval(function() {
      if (window.location.pathname !== lastPathname) {
        lastPathname = window.location.pathname;
        handleOdooLogout();
      }
    }, 1000);
  });
  
  // Also run immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleOdooLogout);
  } else {
    handleOdooLogout();
  }
})();
