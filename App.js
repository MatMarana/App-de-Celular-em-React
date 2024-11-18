import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, AsyncStorage, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const songs = [
  { id: '1', title: 'Song 1', file: require('./assets/song1.mp3') },
  { id: '2', title: 'Song 2', file: require('./assets/song2.mp3') },
  { id: '3', title: 'Song 3', file: require('./assets/song3.mp3') },
];

const saveFavorite = async (songId) => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    if (!favoritesArray.includes(songId)) {
      favoritesArray.push(songId);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      Alert.alert('Success', 'Song added to favorites!');
    } else {
      Alert.alert('Info', 'Song is already in favorites.');
    }
  } catch (error) {
    console.error('Error saving favorite', error);
  }
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Song List</Text>
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Button
              title={item.title}
              onPress={() => navigation.navigate('Details', { song: item })}
              color="#841584"
            />
            <TouchableOpacity onPress={() => saveFavorite(item.id)}>
              <FontAwesome name="star" size={24} color="gold" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        title="Go to Favorites"
        onPress={() => navigation.navigate('Favorites')}
        color="#841584"
      />
    </View>
  );
};

const DetailsScreen = ({ route }) => {
  const { song } = route.params;
  const sound = useRef(new Audio.Sound());

  const playSound = async () => {
    try {
      await sound.current.loadAsync(song.file);
      await sound.current.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const stopSound = async () => {
    await sound.current.stopAsync();
  };

  useEffect(() => {
    return () => {
      sound.current.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Button title="Play" onPress={playSound} color="#841584" />
      <Button title="Stop" onPress={stopSound} color="#841584" />
    </View>
  );
};

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const favoritesList = await AsyncStorage.getItem('favorites');
    setFavorites(favoritesList ? JSON.parse(favoritesList) : []);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {favorites.length > 0 ? (
        favorites.map((favId) => (
          <Text key={favId} style={styles.favoriteItem}>
            {`Song ID: ${favId}`}
          </Text>
        ))
      ) : (
        <Text>No favorites yet!</Text>
      )}
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement login functionality here
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#841584" />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Implement registration functionality here
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} color="#841584" />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  favoriteItem: {
    fontSize: 18,
    marginVertical: 5,
  },
  link: {
    marginTop: 20,
    color: '#841584',
  },
});

export default App;
