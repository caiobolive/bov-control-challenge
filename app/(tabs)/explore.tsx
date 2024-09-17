import React, { useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Realm from 'realm';
import { realm, addChecklistItem  } from '../../services/realmDB';
import { Button, Input, IconButton } from '@/components';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Header, Title, Form, Container } from '../../components/styles';
import { createObject, updateObject, healthCheck } from '@/services/apiService';
import emitter, { events } from '@/services/eventEmitter';

export default function ExploreScreen() {
  const { checklistData } = useLocalSearchParams();
  const router = useRouter();

  const checklist = Array.isArray(checklistData)
    ? JSON.parse(checklistData[0])
    : checklistData
    ? JSON.parse(checklistData)
    : null;

  // Form state variables
  const [type, setType] = useState('');
  const [amountOfMilkProduced, setAmountOfMilkProduced] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerCity, setFarmerCity] = useState('');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [numberOfCowsHead, setNumberOfCowsHead] = useState('');
  const [hadSupervision, setHadSupervision] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const isFormInitialized = useRef(false);

  const resetForm = () => {
    setType('');
    setAmountOfMilkProduced('');
    setFarmerName('');
    setFarmerCity('');
    setFromName('');
    setToName('');
    setNumberOfCowsHead('');
    setHadSupervision(false);
    setLatitude('');
    setLongitude('');
  };

  // Populate the form when the checklist data changes
  useEffect(() => {
    isFormInitialized.current = false; // Reset the flag when new checklist data comes in
  }, [checklistData]);

  useEffect(() => {
    if (!isFormInitialized.current && checklist) {
      setType(checklist?.type || '');
      setAmountOfMilkProduced(checklist?.amount_of_milk_produced || '');
      setFarmerName(checklist?.farmer?.name || '');
      setFarmerCity(checklist?.farmer?.city || '');
      setFromName(checklist?.from?.name || '');
      setToName(checklist?.to?.name || '');
      setNumberOfCowsHead(checklist?.number_of_cows_head || '');
      setHadSupervision(checklist?.had_supervision || false);
      setLatitude(checklist?.location?.latitude?.toString() || '');
      setLongitude(checklist?.location?.longitude?.toString() || '');

      isFormInitialized.current = true; // Mark the form as initialized
    }
  }, [checklist]);

  const exitScreen = () => {
    resetForm();
    router.back();
  };

  const handleCreateChecklist = async () => {
    const generateNumericId = () => {
      return Date.now();
    };
  
    const checklistData = {
      _id: generateNumericId().toString(),
      type: type,
      amount_of_milk_produced: parseInt(amountOfMilkProduced, 10), // Convert to number for API
      number_of_cows_head: parseInt(numberOfCowsHead, 10), // Convert to number for API
      had_supervision: hadSupervision,
      farmer: { name: farmerName, city: farmerCity },
      from: { name: fromName },
      to: { name: toName },
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      created_at: new Date(),
      updated_at: new Date(),
      syncStatus: 'synced', // Default is synced
    };
  
    try {
      const isHealthy = await healthCheck(); // Check if online
      if (!isHealthy) {
        checklistData.syncStatus = 'pending'; // Mark as pending if offline
      }
  
      if (isHealthy) {
        const { syncStatus, ...checklistDataWithoutSyncStatus } = checklistData;
        const response = await createObject({ checklists: [checklistDataWithoutSyncStatus] });
        console.log('API Response: ', response.data);
        Alert.alert('Success', 'Checklist created successfully and synced');
      } else {
        addChecklistItem(checklistData);
        Alert.alert('Success', 'Checklist created offline and marked as pending');
      }
  
      emitter.emit(events.CHECKLIST_CREATED);
      exitScreen();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create checklist');
    }
  };

  const handleUpdateChecklist = async () => {
    try {
      realm.write(() => {
        const checklistToUpdate = realm.objectForPrimaryKey('ChecklistItem', checklist._id) as ChecklistItem;
        if (checklistToUpdate) {
          checklistToUpdate.type = type;
          checklistToUpdate.amount_of_milk_produced = amountOfMilkProduced.toString(); // Convert back to string for Realm
          checklistToUpdate.farmer.name = farmerName;
          checklistToUpdate.farmer.city = farmerCity;
          checklistToUpdate.from.name = fromName;
          checklistToUpdate.to.name = toName;
          checklistToUpdate.number_of_cows_head = numberOfCowsHead.toString(); // Convert back to string for Realm
          checklistToUpdate.had_supervision = hadSupervision;
          checklistToUpdate.location.latitude = parseFloat(latitude);
          checklistToUpdate.location.longitude = parseFloat(longitude);
          checklistToUpdate.updated_at = new Date();
        }
      });
  
      const isHealthy = await healthCheck();
      if (!isHealthy) {
        realm.write(() => {
          checklist.syncStatus = 'pending'; // Mark as pending if offline
        });
        Alert.alert('Success', 'Checklist updated offline and marked as pending');
      } else {
        await updateObject(checklist._id, {
          type,
          amount_of_milk_produced: parseInt(amountOfMilkProduced, 10), // Convert to number for API
          farmer: { name: farmerName, city: farmerCity },
          from: { name: fromName },
          to: { name: toName },
          number_of_cows_head: parseInt(numberOfCowsHead, 10), // Convert to number for API
          had_supervision: hadSupervision,
          location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        });
        Alert.alert('Success', 'Checklist updated and synced successfully');
      }
  
      emitter.emit(events.CHECKLIST_CREATED);
      exitScreen();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update checklist');
    }
  };

  const handleSubmit = checklist ? handleUpdateChecklist : handleCreateChecklist;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D5EBF2', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/BovControlLogo2024.png')}
          style={styles.imageLogo}
        />
      }>
      <Container>        
        <Header>
          <Title>{checklist ? `Update Checklist ${checklist._id}` : 'Create Checklist'}</Title>
          <IconButton icon="arrow-back-outline" onPress={() => exitScreen()} />
        </Header>

        <Form>
          <Input placeholder="Type" onChangeText={setType} value={type} />
          <Input placeholder="Amount of Milk Produced" onChangeText={setAmountOfMilkProduced} value={amountOfMilkProduced} />
          <Input placeholder="Farmer Name" onChangeText={setFarmerName} value={farmerName} />
          <Input placeholder="Farmer City" onChangeText={setFarmerCity} value={farmerCity} />
          <Input placeholder="From" onChangeText={setFromName} value={fromName} />
          <Input placeholder="To" onChangeText={setToName} value={toName} />
          <Input placeholder="Number of Cows Head" onChangeText={setNumberOfCowsHead} value={numberOfCowsHead} />
          <Input placeholder="Latitude" onChangeText={setLatitude} value={latitude} keyboardType="numeric" />
          <Input placeholder="Longitude" onChangeText={setLongitude} value={longitude} keyboardType="numeric" />
        </Form>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title={checklist ? 'Update Checklist' : 'Create Checklist'} onPress={handleSubmit} />
          <Button title="Cancel" onPress={exitScreen} />
        </View>
      </Container>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  imageLogo: {
    width: 350,
    height: 120,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});