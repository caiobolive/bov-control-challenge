import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Realm from 'realm';
import { realm } from '../../services/realmDB';
import { Button, Input, IconButton } from '@/components';
import { Container, Header, Title, Form } from '../../components/styles';
import { useFocusEffect } from '@react-navigation/native';

export default function ExploreScreen() {
  const { checklistData } = useLocalSearchParams(); // Get checklist data if passed
  const router = useRouter();

  // Parse the checklist data if provided (for update mode), or set to null (for create mode)
  const checklist = Array.isArray(checklistData)
    ? JSON.parse(checklistData[0])
    : checklistData
    ? JSON.parse(checklistData)
    : null;

  // State for form fields
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

  // Function to reset the form (clear all inputs)
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

  const exitScreen = () => {
    resetForm();
    router.back();
  }

  // useEffect or useFocusEffect to handle form resetting when navigating
  useFocusEffect(
    React.useCallback(() => {
      // On screen focus, populate or reset the form
      if (!checklist) {
        resetForm(); // In create mode, reset the form
      } else {
        // If checklist exists, populate the form with existing data (update mode)
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
      }

      return () => {
        resetForm(); // Reset the form when leaving the screen
      };
    }, [checklist])
  );

  const handleCreateChecklist = async () => {
    try {
      realm.write(() => {
        realm.create('ChecklistItem', {
          _id: new Realm.BSON.ObjectId(),
          type,
          amount_of_milk_produced: amountOfMilkProduced,
          farmer: { name: farmerName, city: farmerCity },
          from: { name: fromName },
          to: { name: toName },
          number_of_cows_head: numberOfCowsHead,
          had_supervision: hadSupervision,
          location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          created_at: new Date(),
          updated_at: new Date(),
          __v: 0,
        });
      });
      Alert.alert('Success', 'Checklist created successfully');
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
          checklistToUpdate.amount_of_milk_produced = amountOfMilkProduced;
          checklistToUpdate.farmer.name = farmerName;
          checklistToUpdate.farmer.city = farmerCity;
          checklistToUpdate.from.name = fromName;
          checklistToUpdate.to.name = toName;
          checklistToUpdate.number_of_cows_head = numberOfCowsHead;
          checklistToUpdate.had_supervision = hadSupervision;
          checklistToUpdate.location.latitude = parseFloat(latitude);
          checklistToUpdate.location.longitude = parseFloat(longitude);
          checklistToUpdate.updated_at = new Date();
        }
      });
      Alert.alert('Success', 'Checklist updated successfully');
      exitScreen();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update checklist');
    }
  };

  const handleSubmit = checklist ? handleUpdateChecklist : handleCreateChecklist;

  return (
    <Container>
      <Header>
      <Title>
        {checklist ? `Update Checklist ${checklist._id}` : 'Create Checklist'}
      </Title>
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
  );
}