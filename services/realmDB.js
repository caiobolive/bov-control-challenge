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
  primaryKey: '_id',
};

export const realm = new Realm({
  schema: [ObjectSchema, FarmerSchema, PersonSchema, LocationSchema],
  schemaVersion: 3,
  migration: (oldRealm, newRealm) => {
    const oldVersion = oldRealm.schemaVersion;

    if (oldVersion < 3) {
      const oldObjects = oldRealm.objects('Object');
      const newObjects = newRealm.objects('Object');

      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i]._id = oldObjects[i]._id.toString();
      }
    }
  }
});