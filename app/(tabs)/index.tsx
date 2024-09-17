import React, { useEffect, useState } from 'react';
import { Image, FlatList, TextInput } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { healthCheck, getObjects, deleteObject } from '@/services/apiService';
import { realm } from '@/services/realmDB';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { ButtonView, TitleContainer, ItemContainer, SearchInput, shadowStyles, Container } from '@/components/styles';
import emitter, { events } from '@/services/eventEmitter';

export default function HomeScreen() {
  const router = useRouter();
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        setFilteredChecklists(parsedItems); // Initialize filtered checklists
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
        setFilteredChecklists(realmDataArray as ChecklistItem[]); // Initialize filtered checklists
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

  const handleCreate = () => {
    router.push({
      pathname: '/explore',
      params: {},
    })
  };

  const handleDelete = async (checklistId: string) => {
    try {
      const isApiHealthy = await healthCheck();
  
      realm.write(() => {
        const checklist = realm.objects('ChecklistItem').filtered('_id == $0', checklistId);
        if (checklist.length > 0) {
          realm.delete(checklist);
        }
      });
  
      if (isApiHealthy) {
        await deleteObject(checklistId);
      }
  
      const updatedChecklists = checklists.filter(item => String(item._id) !== String(checklistId));
      setChecklists(updatedChecklists);
      setFilteredChecklists(updatedChecklists);
  
    } catch (error) {
      console.error('Error deleting checklist:', error);
    }
  };

  useEffect(() => {
    loadData(); 

    const subscription = emitter.addListener(events.CHECKLIST_CREATED, () => {
      loadData();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Search filter logic
  useEffect(() => {
    if (searchTerm) {
      const filtered = checklists.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.to.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChecklists(filtered);
    } else {
      setFilteredChecklists(checklists);
    }
  }, [searchTerm, checklists]);

  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => {
  
    const handleUpdate = () => {
      router.push({
        pathname: '/explore',
        params: {
          checklistData: JSON.stringify(item),
        },
      });
    };

    const handleDeleteItem = () => handleDelete(item._id.toString());
  
    return (
      <ItemContainer style={shadowStyles.shadow}>
        <ThemedText>{"Id: " + item._id}</ThemedText>
        <ThemedText>{"Type: " + item.type}</ThemedText>
        <ThemedText>{"Milk produced: " + item.amount_of_milk_produced}</ThemedText>
        <ThemedText>{"Farmer:"}</ThemedText>
        <ThemedText>{"Farmer name: " + item.farmer.name}</ThemedText>
        <ThemedText>{"Farmer city: " + item.farmer.city}</ThemedText>
        <ThemedText>{"From: " + item.from.name}</ThemedText>
        <ThemedText>{"To: " + item.to.name}</ThemedText>
        <ThemedText>{"Number of cows: " + item.number_of_cows_head}</ThemedText>
        <ThemedText>{"Supervision: " + item.had_supervision}</ThemedText>
        <ThemedText>{"Location:"}</ThemedText>
        <ThemedText>{"Latitude: " + item.location.latitude}</ThemedText>
        <ThemedText>{"Longitude: " + item.location.longitude}</ThemedText>
        <ThemedText>{"Created at: " + new Date(item.created_at).toLocaleString()}</ThemedText>
        <ThemedText>{"Updated at: " + new Date(item.updated_at).toLocaleString()}</ThemedText>

        <ButtonView>
          <Button title="Update" onPress={handleUpdate} />
          <Button title="Delete" onPress={handleDeleteItem} />
        </ButtonView>
      </ItemContainer>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D5EBF2', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/BovControlLogo2024.png')}
          style={{ width: 350, height: 120, position: 'absolute', bottom: 0, left: 0 }}
        />
      }>
      <TitleContainer>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </TitleContainer>

      <Container>
        <Button title="Create New Checklist" onPress={handleCreate} />

        <SearchInput
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </Container>

      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <FlatList
          data={filteredChecklists}
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