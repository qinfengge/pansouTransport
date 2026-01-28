/**
 * PWA Service Worker Registration
 * This module handles the registration and management of the Service Worker
 * for offline support and caching capabilities.
 */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Listen for messages from the Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message from Service Worker:', event.data);
  });
}

export function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

export async function checkServiceWorkerUpdates() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.update();
  }
}

