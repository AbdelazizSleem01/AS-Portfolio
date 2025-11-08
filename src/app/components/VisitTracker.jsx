'use client';

import { useEffect } from 'react';

const VisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('sessionId', sessionId);
        }

        const userAgent = navigator.userAgent;
        const referrer = document.referrer;
        const url = window.location.href;

        // Get IP address using multiple services for better reliability
        let ip = 'unknown';
        try {
          const services = [
            'https://api.ipify.org?format=json',
            'https://ipapi.co/json/',
            'https://api.ip.sb/jsonip'
          ];

          for (const service of services) {
            try {
              const response = await fetch(service);
              const data = await response.json();
              ip = data.ip || data.query || 'unknown';
              if (ip !== 'unknown') break;
            } catch (e) {
              continue;
            }
          }
        } catch (error) {
          console.error('Error fetching IP:', error);
        }

        await fetch('/api/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            url,
            referrer,
            userAgent,
            ip,
          }),
        });

        // Track session duration with multiple strategies
        const startTime = Date.now();
        let lastActivity = Date.now();
        let durationUpdateInterval;

        const updateDuration = async () => {
          try {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            await fetch('/api/visits/session-end', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId,
                duration,
              }),
              keepalive: true, // This helps with page unload
            });
          } catch (error) {
            console.error('Error updating duration:', error);
          }
        };

        // Update duration every 30 seconds
        durationUpdateInterval = setInterval(updateDuration, 30000);

        // Track user activity
        const updateActivity = () => {
          lastActivity = Date.now();
        };

        // Activity events
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
          document.addEventListener(event, updateActivity, { passive: true });
        });

        const handleBeforeUnload = () => {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          // Use sendBeacon for reliable delivery on page unload
          navigator.sendBeacon('/api/visits/session-end', JSON.stringify({
            sessionId,
            duration,
          }));
        };

        const handleVisibilityChange = () => {
          if (document.hidden) {
            // Page is hidden, update duration
            updateDuration();
          } else {
            // Page is visible again, reset activity
            lastActivity = Date.now();
          }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          clearInterval(durationUpdateInterval);
          window.removeEventListener('beforeunload', handleBeforeUnload);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          events.forEach(event => {
            document.removeEventListener(event, updateActivity);
          });
        };
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []);

  return null; 
};

export default VisitTracker;
