import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const songs = [
  { id: '1', title: 'Música 1', file: require('./assets/song1.mp3') },
  { id: '2', title: 'Música 2', file: require('./assets/song2.mp3') },
  { id: '3', title: 'Música 3', file: require('./assets/song3.mp3') },
];

// Função para salvar uma música nos favoritos usando AsyncStorage
const saveFavorite = async (songId) => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    if (!favoritesArray.includes(songId)) {
      favoritesArray.push(songId);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      Alert.alert('Sucesso', 'Música adicionada aos favoritos!');
    } else {
      Alert.alert('Info', 'A música já está nos favoritos.');
    }
  } catch (error) {
    console.error('Erro ao salvar favorito', error);
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
            <TouchableOpacity onPress={() => saveFavorite(item.id)}>
              <FontAwesome name="star" size={24} color="gold" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        title="Ir para Favoritos"
        onPress={() => navigation.navigate('Favoritos')}
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
      setFavorites(favoritesList ? JSON.parse(favoritesList) : []);
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
        favorites.map((favId) => (
          <Text key={favId} style={styles.favoriteItem}>
            {`ID da Música: ${favId}`}
          </Text>
        ))
      ) : (
        <Text>Sem favoritos ainda!</Text>
      )}
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const userExists = users.find(
        (user) => user.username === username && user.password === password
      );

      if (userExists) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Erro', 'Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#841584" />
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Erro', 'Usuário e senha não podem estar vazios');
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const userExists = users.find((user) => user.username === username);
      if (userExists) {
        Alert.alert('Erro', 'Usuário já existe');
        return;
      }

      users.push({ username, password });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao cadastrar', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleRegister} color="#841584" />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={DetailsScreen} />
        <Stack.Screen name="Favoritos" component={FavoritesScreen} />
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
