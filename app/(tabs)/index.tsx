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

  const fetchDataFromAPI = async () => {
    try {
      const response = await getObjects();
      const checklistData = response.data;
  
      if (Array.isArray(checklistData)) {
        const checklistId = 'checklist_1';
        const parsedItems: ChecklistItem[] = checklistData.map((item: any) => ({
          _id: item._id.toString(),
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
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
          __v: item.__v,
        }));
  
        realm.write(() => {
          realm.create(
            'Checklist',
            {
              id: checklistId,
              items: parsedItems,
            },
            true
          );
        });
  
        setChecklists(parsedItems);
      } else {
        console.error('Data from API is not an array', checklistData);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  // Fetch data from RealmDB
  const fetchDataFromRealm = () => {
    const realmData = realm.objects('Checklist').filtered('id == "checklist_1"');
    if (realmData.length > 0) {
      const checklist = realmData[0];
      
      const realmDataArray = Array.from(checklist.items as Realm.List<ChecklistItem>);
      
      if (JSON.stringify(realmDataArray) !== JSON.stringify(checklists)) {
        setChecklists(realmDataArray as ChecklistItem[]);
      }
    }
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
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
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