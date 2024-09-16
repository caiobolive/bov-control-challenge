import { realm } from '@/services/realmDB';
import { createObject, updateObject, deleteObject, healthCheck } from '@/services/apiService';

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
    
    realm.write(() => {
      checklists.forEach(async (checklist) => {
        try {
          const checklistData = {
            id: checklist.id,
            items: checklist.items.map((item) => ({
              _id: item._id,
              type: item.type,
              amount_of_milk_produced: item.amount_of_milk_produced,
              farmer: {
                name: item.farmer.name,
                city: item.farmer.city,
              },
              from: {
                name: item.from.name,
              },
              to: {
                name: item.to.name,
              },
              number_of_cows_head: item.number_of_cows_head,
              had_supervision: item.had_supervision,
              location: {
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              },
              created_at: item.created_at,
              updated_at: item.updated_at,
            })),
          };

          // Sync create or update based on condition
          const existsInAPI = await checkIfChecklistExistsInAPI(checklist.id);
          if (existsInAPI) {
            await updateObject(checklist.id, checklistData);
          } else {
            await createObject(checklistData);
          }

          // Mark the checklist as synced
          checklist.syncStatus = 'synced';
          console.log(`Checklist ${checklist.id} synced successfully.`);
        } catch (error) {
          console.error(`Error syncing checklist ${checklist.id}:`, error);
        }
      });
    });

  } catch (error) {
    console.error("Error during sync operation:", error);
  }
};

// Helper function to check if the checklist exists in the API
const checkIfChecklistExistsInAPI = async (id) => {
  try {
    const response = await getObjects();
    return response.data.some((item) => item.id === id);
  } catch (error) {
    console.error(`Error checking if checklist exists in API:`, error);
    return false;
  }
};