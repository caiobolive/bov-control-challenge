import { realm } from '@/services/realmDB';
import { createObject, updateObject, getObjects, healthCheck } from '@/services/apiService';

export const syncOfflineChanges = async () => {
  try {
    const isOnline = await healthCheck();
    if (!isOnline) {
      console.log("No internet connection. Skipping sync.");
      return;
    }

    console.log("Starting sync...");

    // Sync Checklist data
    const checklists = realm.objects('Checklist').filtered('syncStatus == "pending"');
    
    if (checklists.length === 0) {
      console.log("No pending checklists to sync.");
      return;
    }

    // Collect checklists before the async process
    const checklistsToSync = checklists.map((checklist) => ({
      id: checklist.id,
      items: checklist.items.map((item) => ({
        _id: item._id,
        type: item.type,
        amount_of_milk_produced: item.amount_of_milk_produced,
        farmer: {
          name: item.farmer.name,
          city: item.farmer.city,
        },
        from: { name: item.from.name },
        to: { name: item.to.name },
        number_of_cows_head: item.number_of_cows_head,
        had_supervision: item.had_supervision,
        location: {
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
      checklistRef: checklist, // Keep a reference to the Realm object
    }));

    console.log(`Found ${checklistsToSync.length} checklists to sync.`);

    // Iterate through checklists to sync
    for (const checklist of checklistsToSync) {
      console.log(`Processing checklist ${checklist.id}...`);
      try {
        const existsInAPI = await checkIfChecklistExistsInAPI(checklist.id);
        console.log(`Checklist ${checklist.id} exists in API: ${existsInAPI}`);

        // Sync to API (create or update)
        if (existsInAPI) {
          await updateObject(checklist.id, checklist);
          console.log(`Checklist ${checklist.id} updated in API.`);
        } else {
          await createObject(checklist);
          console.log(`Checklist ${checklist.id} created in API.`);
        }

        // Update sync status in Realm
        realm.write(() => {
          checklist.checklistRef.syncStatus = 'synced'; // Update sync status in Realm
        });

        console.log(`Checklist ${checklist.id} synced successfully.`);
      } catch (error) {
        console.error(`Error syncing checklist ${checklist.id}:`, error);
      }
    }

  } catch (error) {
    console.error("Error during sync operation:", error);
  }
};

// Helper function to check if the checklist exists in the API
const checkIfChecklistExistsInAPI = async (id) => {
  try {
    console.log(`Checking if checklist ${id} exists in API...`);
    const response = await getObjects();
    
    if (!response || !response.data) {
      console.error("Invalid API response when checking for checklist.");
      return false;
    }

    return response.data.some((item) => item.id === id);
  } catch (error) {
    console.error(`Error checking if checklist exists in API:`, error);
    return false;
  }
};