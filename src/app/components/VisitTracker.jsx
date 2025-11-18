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
          }),
        });

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
              keepalive: true, 
            });
          } catch (error) {
            console.error('Error updating duration:', error);
          }
        };

        durationUpdateInterval = setInterval(updateDuration, 30000);

        const updateActivity = () => {
          lastActivity = Date.now();
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
          document.addEventListener(event, updateActivity, { passive: true });
        });

        const handleBeforeUnload = () => {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          navigator.sendBeacon('/api/visits/session-end', JSON.stringify({
            sessionId,
            duration,
          }));
        };

        const handleVisibilityChange = () => {
          if (document.hidden) {
            updateDuration();
          } else {
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
