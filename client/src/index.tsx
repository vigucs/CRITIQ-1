import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// For development, we can disable Google OAuth if it's causing issues
const DISABLE_GOOGLE_OAUTH = false; // Setting to false to enable Google OAuth

// Use a development-specific client ID that has localhost configured as an allowed origin
// Note: You'll need to configure this client ID in the Google Cloud Console to allow localhost
const isDevelopment = process.env.NODE_ENV === 'development';
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 
  (isDevelopment 
    ? '64073786957-6vdvf5mt3ps1gthf0jgpdd17tb9i7rla.apps.googleusercontent.com' // Development ID
    : '64073786957-6vdvf5mt3ps1gthf0jgpdd17tb9i7rla.apps.googleusercontent.com'); // Production ID

// Add debug logging for Google OAuth
console.log('Google OAuth Client ID:', googleClientId);
console.log('Environment:', process.env.NODE_ENV);
console.log('Google OAuth Disabled:', DISABLE_GOOGLE_OAUTH);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

// If Google OAuth is causing issues, we can wrap the app without it
const renderApp = () => {
  if (DISABLE_GOOGLE_OAUTH) {
    // Set a flag in localStorage that Google Auth is disabled
    localStorage.setItem('google_auth_failed', 'true');
    return <App />;
  }
  
  return (
    <GoogleOAuthProvider 
      clientId={googleClientId}
      onScriptLoadError={() => {
        console.error('Google OAuth script failed to load - falling back to regular login');
        // Set a flag in localStorage so components can know Google Auth failed
        localStorage.setItem('google_auth_failed', 'true');
      }}
      onScriptLoadSuccess={() => {
        console.log('Google OAuth script loaded successfully');
        localStorage.removeItem('google_auth_failed');
      }}
    >
      <App />
    </GoogleOAuthProvider>
  );
};

root.render(
  <React.StrictMode>
    {renderApp()}
  </React.StrictMode>
); 