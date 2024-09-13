import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, FlatList, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { healthCheck, getObjects } from '@/services/apiService';
import { realm } from '@/services/realmDB';

export default function HomeScreen() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchDataFromAPI = async () => {
    try {
      const response = await getObjects();
      const checklistData = response.data;

      if (Array.isArray(checklistData)) {
        // Convert all `_id` fields to string for Realm compatibility
        realm.write(() => {
          checklistData.forEach((item: ChecklistItem) => {
            const parsedItem = {
              ...item,
              _id: item._id.toString(), // Convert numeric _id to string
            };
            realm.create('Object', parsedItem, true); // Upsert to avoid duplicates
          });
        });

        setChecklists(checklistData);
      } else {
        console.error('Data from API is not an array', checklistData);
      }
    } catch (error: unknown) {
      console.log('Error fetching data from API', (error as any).message);
    }
  };

  // Function to fetch data from RealmDB
  const fetchDataFromRealm = () => {
    const realmData = realm.objects('Object');
    const realmDataArray = Array.from(realmData);
    setChecklists(realmDataArray as unknown as ChecklistItem[]);
  };

  // Main function to handle the flow
  const loadData = async () => {
    setLoading(true);
    const isApiHealthy = await healthCheck();

    if (isApiHealthy) {
      await fetchDataFromAPI();
    } else {
      fetchDataFromRealm();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => (
    <ThemedView style={styles.itemContainer}>
      <ThemedText>{"Id: " + item._id}</ThemedText>
      <ThemedText>{"Type: " + item.type}</ThemedText>
      <ThemedText>{"Milk produced: " + item.amount_of_milk_produced}</ThemedText>
      <ThemedView style={styles.itemContainer}>
        <ThemedText>{"Farmer:"}</ThemedText>
        <ThemedText>{"Name: " + item.farmer.name}</ThemedText>
        <ThemedText>{"City: " + item.farmer.city}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemContainer}>
        <ThemedText>{"From: " + item.from.name}</ThemedText>
        <ThemedText>{"To: " + item.to.name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemContainer}>
        <ThemedText>{"Number of cows: " + item.number_of_cows_head}</ThemedText>
        <ThemedText>{"Supervision: " + item.had_supervision}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemContainer}>
        <ThemedText>{"Location:"}</ThemedText>
        <ThemedText>{"Latitude: " + item.location.latitude}</ThemedText>
        <ThemedText>{"Longitude: " + item.location.longitude}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemContainer}>
        <ThemedText>{"Created at: " + new Date(item.created_at).toLocaleString()}</ThemedText>
        <ThemedText>{"Updated at: " + new Date(item.updated_at).toLocaleString()}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <FlatList
          data={checklists}
          scrollEnabled={false}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderChecklistItem}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  itemContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});