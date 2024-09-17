import { realm } from '@/services/realmDB';
import { createObject, updateObject, checkIfChecklistExists, healthCheck } from '@/services/apiService';

let isSyncing = false; // Global flag

export const syncOfflineChanges = async () => {
  if (isSyncing) {
    console.log("Sync already in progress. Skipping sync.");
    return;
  }
  
  isSyncing = true; // Set syncing flag to true
  
  try {
    const isOnline = await healthCheck();
    if (!isOnline) {
      console.log("No internet connection. Skipping sync.");
      return;
    }

    console.log("Starting sync...");
    const checklists = realm.objects('ChecklistItem').filtered('syncStatus == "pending"');

    if (!checklists || checklists.length === 0) {
      console.log("No pending checklists to sync.");
      return;
    }

    const checklistsToCreate = [];
    const checklistsToUpdate = [];

    for (const checklist of checklists) {
      const checklistData = { /* Checklist data extraction logic */ };

      const existsInAPI = await checkIfChecklistExists(checklist._id);
      if (existsInAPI) {
        checklistsToUpdate.push({ ...checklistData, _id: checklist._id });
      } else {
        checklistsToCreate.push(checklistData);
      }
    }

    if (checklistsToCreate.length > 0) {
      try {
        await createObject({ checklists: checklistsToCreate });
        console.log(`${checklistsToCreate.length} checklists created in API.`);
      } catch (createError) {
        console.error(`Error creating checklists:`, createError);
      }
    }

    for (const checklist of checklistsToUpdate) {
      try {
        await updateObject(checklist._id, checklist);
        console.log(`Checklist ${checklist._id} updated in API.`);
      } catch (updateError) {
        console.error(`Error updating checklist ${checklist._id}:`, updateError);
      }
    }

    // Mark checklists as synced in Realm
    try {
      realm.write(() => {
        checklists.forEach((checklist) => {
          const checklistToUpdate = realm.objectForPrimaryKey('ChecklistItem', checklist._id);
          if (checklistToUpdate) {
            checklistToUpdate.syncStatus = 'synced';
          } else {
            console.error(`ChecklistItem with ID ${checklist._id} not found in Realm.`);
          }
        });
      });
    } catch (realmError) {
      console.error("Error marking checklists as synced in Realm:", realmError);
    }

    console.log("Sync completed successfully.");
  } catch (error) {
    console.error("Error during sync operation:", error);
  } finally {
    isSyncing = false; // Release the lock
  }
};