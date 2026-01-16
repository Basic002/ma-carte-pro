import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Alert, Keyboard } from 'react-native'; 
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile !== null) {
        const data = JSON.parse(savedProfile);
        setPrenom(data.prenom);
        setNom(data.nom);
        setEntreprise(data.entreprise || '');
        setTelephone(data.telephone);
        setEmail(data.email);
      }
    } catch (e) {
      console.log('Erreur de chargement');
    }
  };

  const saveData = async () => {
    Keyboard.dismiss();
    try {
      const profile = { prenom, nom, entreprise, telephone, email };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert("Succès", "Vos informations sont enregistrées !");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sauvegarder");
    }
  };

  const generateVCard = () => {
    return `BEGIN:VCARD
      VERSION:3.0
      N:${nom};${prenom};;;
      FN:${prenom} ${nom}
      ORG:${entreprise}
      TEL;TYPE=CELL:${telephone}
      EMAIL:${email}
      END:VCARD`;
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.title}>Ma Carte Pro</Text>
        <Text style={styles.subtitle}>Vos infos sont sauvegardées</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={generateVCard()}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Informations personnelles</Text>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#55555551"
            value={prenom}
            onChangeText={setPrenom}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#55555551"
            value={nom}
            onChangeText={setNom}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          
          <Text style={styles.label}>Informations professionnelles</Text>
          <TextInput
            style={styles.input}
            placeholder="Entreprise"
            placeholderTextColor="#55555551"
            value={entreprise}
            onChangeText={setEntreprise}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          
          <Text style={styles.label}>Coordonnées</Text>
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor="#55555551"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#55555551"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveData}>
            <Text style={styles.saveButtonText}>Enregistrer mes infos</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'white',
    color: 'black', 
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});