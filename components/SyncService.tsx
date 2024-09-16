import { useEffect } from 'react';
import { syncOfflineChanges } from '@/services/syncService'; 
import { healthCheck } from '@/services/apiService'; 

const SyncService = () => {
  useEffect(() => {
    const startSync = async () => {
      const isOnline = await healthCheck();
      if (isOnline) {
        console.log('Device is online. Starting sync...');
        await syncOfflineChanges();
      } else {
        console.log('Device is offline. Sync postponed.');
      }
    };

    // Initial sync when the app starts
    startSync();

    // Periodic sync every 5 minutes (300000 milliseconds)
    const syncInterval = setInterval(() => {
      startSync();
    }, 300000);

    // Clear the interval when the component unmounts
    return () => clearInterval(syncInterval);
  }, []);

  return null;
};

export default SyncService;