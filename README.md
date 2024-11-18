# 🎵 App Player de Música

Este projeto é um app de player de música desenvolvido em **React Native** com funcionalidades de reprodução de músicas, gerenciamento de favoritos e filtragem por gênero. Ele utiliza bibliotecas como `expo-av` para reprodução de áudio e `AsyncStorage` para persistência de dados localmente, proporcionando uma experiência de uso fluida e personalizável.

## 📱 Funcionalidades

1. **Lista de Músicas**
   - Exibe uma lista de músicas disponíveis para reprodução.
   - Cada música possui um botão para reprodução e um ícone de estrela para adicionar aos favoritos.

2. **Reprodução de Música**
   - Utiliza o módulo `expo-av` para reproduzir e parar o som das músicas selecionadas.
   - Controle básico de "Tocar" e "Parar".

3. **Favoritar Músicas**
   - O usuário pode adicionar ou remover músicas da lista de favoritos.
   - Os favoritos são armazenados localmente usando `AsyncStorage`.

4. **Tela de Favoritos**
   - Exibe uma lista de todas as músicas marcadas como favoritas.

5. **Filtragem por Gênero**
   - O usuário pode filtrar as músicas disponíveis por gênero (Pagode ou Hip Hop).

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de apps móveis.
- **Expo**: Ferramenta para desenvolvimento e teste de apps React Native.
- **expo-av**: Biblioteca para manipulação e reprodução de áudio.
- **AsyncStorage**: Armazenamento local para persistência de dados.
- **React Navigation**: Navegação entre telas.
- **FontAwesome**: Ícones para a interface do usuário.

## 📂 Estrutura do Projeto

- **HomeScreen**: Exibe a lista de músicas e permite navegar para a tela de detalhes, favoritos ou filtro de gênero.
- **DetailsScreen**: Tela de reprodução de uma música específica com controles de áudio.
- **FavoritesScreen**: Tela que lista todas as músicas favoritas do usuário.
- **FilterGenreScreen**: Tela para filtrar músicas por gênero e exibir as correspondentes.
