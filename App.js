import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, AsyncStorage, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';

const Stack = createNativeStackNavigator();

const songs = [
  { id: '1', title: 'Song 1', file: require('./assets/song1.mp3') },
  { id: '2', title: 'Song 2', file: require('./assets/song2.mp3') },
  { id: '3', title: 'Song 3', file: require('./assets/song3.mp3') },
];

// Função para salvar músicas favoritas
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

// Tela Inicial
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
            />
            <Button title="Add to Favorites" onPress={() => saveFavorite(item.id)} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Tela de Detalhes da Música
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
      sound.current.unloadAsync(); // Limpa o som quando sai da tela
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Button title="Play" onPress={playSound} />
      <Button title="Stop" onPress={stopSound} />
    </View>
  );
};

// Tela de Favoritos
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
            {`Song ID: ${favId}`} {/* Você pode mudar para buscar o título correspondente */}
          </Text>
        ))
      ) : (
        <Text>No favorites yet!</Text>
      )}
    </View>
  );
};

// Configuração da Navegação
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default App;
