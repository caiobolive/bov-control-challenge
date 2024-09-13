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

export const ObjectSchema = {
  name: 'Object',
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
    __v: 'int',
  },
};

export const realm = new Realm({
  schema: [ObjectSchema, FarmerSchema, PersonSchema, LocationSchema],
  schemaVersion: 13,
  migration: (oldRealm, newRealm) => {
    const oldVersion = oldRealm.schemaVersion;
  
    if (oldVersion < 13) {
      const oldObjects = oldRealm.objects('Object');
      const newObjects = newRealm.objects('Object');
  
      // Ensure no duplicate _id values
      const idsSet = new Set();
  
      for (let i = 0; i < oldObjects.length; i++) {
        const oldId = oldObjects[i]._id.toString();
        if (!idsSet.has(oldId)) {
          newObjects[i]._id = oldId;
          idsSet.add(oldId); // Track unique _id
        } else {
          console.warn(`Duplicate _id found during migration: ${oldId}`);
        }
      }
    }
  }
});