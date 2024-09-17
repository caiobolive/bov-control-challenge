import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid';

export const FarmerSchema = {
  name: 'Farmer',
  properties: {
    name: 'string',
    city: 'string',
  },
};

export const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
  },
};

export const LocationSchema = {
  name: 'Location',
  properties: {
    latitude: 'float',
    longitude: 'float',
  },
};

export const ChecklistItemSchema = {
  name: 'ChecklistItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type: 'string',
    amount_of_milk_produced: 'string',
    farmer: 'Farmer',
    from: 'Person',
    to: 'Person',
    number_of_cows_head: 'string',
    had_supervision: 'bool',
    location: 'Location',
    created_at: 'date',
    updated_at: 'date',
    syncStatus: { type: 'string', default: 'synced' },
  },
};

export const ChecklistSchema = {
  name: 'Checklist',
  properties: {
    id: 'string',
    items: 'ChecklistItem[]',
  },
  primaryKey: 'id',
};

export const addChecklistItem = (item) => {
  if (!realm.isInTransaction) {
    realm.write(() => {
      createChecklistItem(item);
    });
  } else {
    createChecklistItem(item);
  }
};

const createChecklistItem = (item) => {
  const existingItem = realm.objectForPrimaryKey('ChecklistItem', item._id);
  if (existingItem) {
    console.warn(`Duplicate ChecklistItem detected with ID: ${item._id}. Skipping insert.`);
    return; 
  }
  realm.create('ChecklistItem', item);
};

// Realm.deleteFile({ schema: [ChecklistSchema, ChecklistItemSchema, FarmerSchema, PersonSchema, LocationSchema] });

export const realm = new Realm({
  schema: [ChecklistSchema, ChecklistItemSchema, FarmerSchema, PersonSchema, LocationSchema],
  schemaVersion: 27,
  migration: (oldRealm, newRealm) => {
    const oldVersion = oldRealm.schemaVersion;
  
    if (oldVersion < 27) {
      const oldChecklists = oldRealm.objects('Checklist');
      const newChecklists = newRealm.objects('Checklist');
      const uniqueChecklistIds = new Set();
      const uniqueChecklistItemIds = new Set();
  
      for (let i = 0; i < oldChecklists.length; i++) {
        const checklist = oldChecklists[i];
        const checklistId = checklist.id;
  
        if (uniqueChecklistIds.has(checklistId)) {
          console.warn(`Duplicate checklist ID found during migration: ${checklistId}. Ignoring duplicate.`);
          newRealm.delete(newChecklists[i]);
          continue;
        }
        uniqueChecklistIds.add(checklistId);
  
        checklist.items.forEach((item) => {
          if (uniqueChecklistItemIds.has(item._id)) {
            console.warn(`Duplicate ChecklistItem _id found during migration: ${item._id}. Ignoring duplicate.`);
            newRealm.delete(item);
          } else {
            uniqueChecklistItemIds.add(item._id);
          }
        });
      }
    }
  }
});