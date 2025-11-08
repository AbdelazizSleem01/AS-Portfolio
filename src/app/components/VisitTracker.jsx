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

        const ip = await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => 'unknown');

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

        const startTime = Date.now();
        const handleBeforeUnload = () => {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          navigator.sendBeacon('/api/visits/session-end', JSON.stringify({
            sessionId,
            duration,
          }));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
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
