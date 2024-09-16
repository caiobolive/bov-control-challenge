import Realm from 'realm';

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
  },
};

export const ChecklistSchema = {
  name: 'Checklist',
  properties: {
    id: 'string',
    items: 'ChecklistItem[]',
    syncStatus: { type: 'string', default: 'pending' },
  },
  primaryKey: 'id',
};

export const realm = new Realm({
  schema: [ChecklistSchema, ChecklistItemSchema, FarmerSchema, PersonSchema, LocationSchema],
  schemaVersion: 17,
  migration: (oldRealm, newRealm) => {
    const oldVersion = oldRealm.schemaVersion;

    if (oldVersion < 17) {
      const oldChecklists = oldRealm.objects('Checklist');
      const newChecklists = newRealm.objects('Checklist');
      const uniqueChecklistIds = new Set();

      for (let i = 0; i < oldChecklists.length; i++) {
        const checklist = oldChecklists[i];
        const checklistId = checklist.id;

        if (!uniqueChecklistIds.has(checklistId)) {
          newChecklists[i].id = checklistId;
          uniqueChecklistIds.add(checklistId);
        } else {
          console.warn(`Duplicate checklist ID found during migration: ${checklistId}`);
          newRealm.delete(newChecklists[i]);
        }
      }
    }
  }
});