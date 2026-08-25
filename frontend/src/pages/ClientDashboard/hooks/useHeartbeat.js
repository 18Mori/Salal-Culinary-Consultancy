import { useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';

export const useHeartbeat = () => {
  useEffect(() => {
    const sendHeartbeat = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

      try {
        await fetch(`${apiUrl}/api/user/heartbeat/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.error('Heartbeat ping error:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000); // 60s ping

    return () => clearInterval(interval);
  }, []);
};