import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const songs = [
  { id: '1', title: 'Fulminante', file: require('./assets/song1.mp3'), genre: 'Pagode' },
  { id: '2', title: 'Cheia de Manias', file: require('./assets/song2.mp3'), genre: 'Pagode' },
  { id: '3', title: 'Insegurança', file: require('./assets/song3.mp3'), genre: 'Pagode' },
  { id: '4', title: 'Artigo 157', file: require('./assets/song4.mp3'), genre: 'Hip Hop' },
  { id: '5', title: 'Jesus Chorou', file: require('./assets/song5.mp3'), genre: 'Hip Hop' },
];

// Função para salvar ou remover uma música dos favoritos
const toggleFavorite = async (songId) => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    if (favoritesArray.includes(songId)) {
      const updatedFavorites = favoritesArray.filter(id => id !== songId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Info', 'Música removida dos favoritos.');
    } else {
      favoritesArray.push(songId);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      Alert.alert('Sucesso', 'Música adicionada aos favoritos!');
    }
  } catch (error) {
    console.error('Erro ao atualizar favoritos', error);
  }
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Músicas</Text>
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Button
              title={item.title}
              onPress={() => navigation.navigate('Detalhes', { song: item })}
              color="#841584"
            />
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <FontAwesome name="star" size={24} color="gold" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Ir para Favoritos"
        onPress={() => navigation.navigate('Favoritos')}
        color="#841584"
      />
      <Button
        title="Filtrar por Gênero"
        onPress={() => navigation.navigate('FiltroGenero')}
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
      console.error('Erro ao reproduzir som', error);
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
      <Button title="Tocar" onPress={playSound} color="#841584" />
      <Button title="Parar" onPress={stopSound} color="#841584" />
    </View>
  );
};

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const favoritesList = await AsyncStorage.getItem('favorites');
      const favoritesArray = favoritesList ? JSON.parse(favoritesList) : [];
      const favoriteSongs = songs.filter((song) => favoritesArray.includes(song.id));
      setFavorites(favoriteSongs);
    } catch (error) {
      console.error('Erro ao carregar favoritos', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      {favorites.length > 0 ? (
        favorites.map((song) => (
          <Text key={song.id} style={styles.favoriteItem}>
            {song.title}
          </Text>
        ))
      ) : (
        <Text>Sem favoritos ainda!</Text>
      )}
    </View>
  );
};

const FilterGenreScreen = () => {
  const [selectedGenre, setSelectedGenre] = useState('Pagode');
  const filteredSongs = songs.filter((song) => song.genre === selectedGenre);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar por Gênero</Text>
      <Button title="Pagode" onPress={() => setSelectedGenre('Pagode')} color="#841584" />
      <Button title="Hip Hop" onPress={() => setSelectedGenre('Hip Hop')} color="#841584" />
      <FlatList
        data={filteredSongs}
        renderItem={({ item }) => (
          <Text key={item.id} style={styles.favoriteItem}>
            {item.title} - {item.genre}
          </Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={DetailsScreen} />
        <Stack.Screen name="Favoritos" component={FavoritesScreen} />
        <Stack.Screen name="FiltroGenero" component={FilterGenreScreen} />
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
