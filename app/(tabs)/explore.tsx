import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Realm from 'realm';
import { realm } from '../../services/realmDB';
import 'react-native-get-random-values';
import { Button, Input, IconButton } from '@/components';
import { Container, Header, Title, Form } from '../../components/styles';

export default function TabTwoScreen() {
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

  const navigation = useNavigation();

  async function handleCreateChecklist() {
    try {
      realm.write(() => {
        realm.create('ChecklistItem', {
          _id: new Realm.BSON.ObjectId(), // Unique ID
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
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to create checklist');
    }
  }

  return (
    <Container>
      <Header>
        <Title>Create Checklist</Title>
        <IconButton icon="arrow-back-outline" onPress={() => navigation.goBack()} />
      </Header>

      <Form>
        <Input
          placeholder="Type"
          onChangeText={setType}
          value={type}
        />
        <Input
          placeholder="Amount of Milk Produced"
          onChangeText={setAmountOfMilkProduced}
          value={amountOfMilkProduced}
        />
        <Input
          placeholder="Farmer Name"
          onChangeText={setFarmerName}
          value={farmerName}
        />
        <Input
          placeholder="Farmer City"
          onChangeText={setFarmerCity}
          value={farmerCity}
        />
        <Input
          placeholder="From"
          onChangeText={setFromName}
          value={fromName}
        />
        <Input
          placeholder="To"
          onChangeText={setToName}
          value={toName}
        />
        <Input
          placeholder="Number of Cows Head"
          onChangeText={setNumberOfCowsHead}
          value={numberOfCowsHead}
        />
        <Input
          placeholder="Latitude"
          onChangeText={setLatitude}
          value={latitude}
          keyboardType="numeric"
        />
        <Input
          placeholder="Longitude"
          onChangeText={setLongitude}
          value={longitude}
          keyboardType="numeric"
        />
      </Form>

      <Button title="Create Checklist" onPress={handleCreateChecklist} />
    </Container>
  );
}