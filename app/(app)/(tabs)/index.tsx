import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Play, RefreshCw } from 'lucide-react-native';
import { useResponsiveDimensions } from '@/hooks/useWindowDimensions';

const generations = [
  { id: 1, name: 'Gen 1', range: '#1-151', minId: 1, maxId: 151, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 25 }, // Pikachu
  { id: 2, name: 'Gen 2', range: '#152-251', minId: 152, maxId: 251, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 250 }, // Ho-Oh
  { id: 3, name: 'Gen 3', range: '#252-386', minId: 252, maxId: 386, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 384 }, // Rayquaza
  { id: 4, name: 'Gen 4', range: '#387-493', minId: 387, maxId: 493, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 445 }, // Garchomp
  { id: 5, name: 'Gen 5', range: '#494-649', minId: 494, maxId: 649, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 643 }, // Reshiram
  { id: 6, name: 'Gen 6', range: '#650-721', minId: 650, maxId: 721, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 658 }, // Greninja
  { id: 7, name: 'Gen 7', range: '#722-809', minId: 722, maxId: 809, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 791 }, // Solgaleo
  { id: 8, name: 'Gen 8', range: '#810-898', minId: 810, maxId: 898, color: 'rgba(0, 0, 0, 0.5)', featuredPokemon: 890 }, // Eternatus
];

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
}

export default function GenerationSelect() {
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  const [genPokemon, setGenPokemon] = useState<{ [key: number]: Pokemon }>({});
  const [loading, setLoading] = useState(true);
  const { width, height } = useResponsiveDimensions();

  const handleStartGame = () => {
    if (selectedGen) {
      router.push({
        pathname: '/(app)/game',
        params: { generation: selectedGen },
      });
    }
  };

  const fetchPokemonForGenerations = async (useRandom: boolean = false) => {
    setLoading(true);
    const pokemonByGen: { [key: number]: Pokemon } = {};
    
    try {
      await Promise.all(generations.map(async (gen) => {
        const pokemonId = useRandom 
          ? Math.floor(Math.random() * (gen.maxId - gen.minId + 1)) + gen.minId
          : gen.featuredPokemon;
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (response.ok) {
          const data = await response.json();
          pokemonByGen[gen.id] = data;
        }
      }));
      
      setGenPokemon(pokemonByGen);
    } catch (error) {
      console.error("Failed to fetch Pokemon:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load Pokemon on component mount
  useEffect(() => {
    fetchPokemonForGenerations(false);
  }, []);

  // Replace with fixed values
  const padding = width * 0.04;
  
  // Function to get the pokemon artwork or fallback to sprite
  const getPokemonImage = (gen: number) => {
    const pokemon = genPokemon[gen];
    if (!pokemon) return null;
    
    const artwork = pokemon.sprites.other?.['official-artwork']?.front_default;
    return artwork || pokemon.sprites.front_default;
  };
  
  return (
    <ImageBackground 
      source={require('@/assets/images/AnimatedLeaderboard_Wallpaper.gif')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width: '100%', height: '100%' }}
    >
      <View style={[styles.overlay, { padding }]}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/Pokemon_Logo.png')}
            style={[
              styles.logo,
              { width: Math.min(width * 0.5, 300), height: Math.min(width * 0.5 * 0.37, 300 * 0.37) }
            ]}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sound Quiz</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Loading Pokémon...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.grid}>
              {generations.map((gen) => (
                <TouchableOpacity
                  key={gen.id}
                  style={[
                    styles.genButton,
                    {
                      backgroundColor: gen.color
                    },
                    selectedGen === gen.id && styles.selectedGen
                  ]}
                  onPress={() => setSelectedGen(gen.id)}
                >
                  <View style={styles.genContent}>
                    <View style={styles.genInfo}>
                      <Text style={styles.genName}>
                        {gen.name}
                      </Text>
                      <Text style={styles.genRange}>
                        {gen.range}
                      </Text>
                    </View>
                    
                    <View style={styles.pokemonContainer}>
                      {getPokemonImage(gen.id) ? (
                        <Image 
                          source={{ uri: getPokemonImage(gen.id) || undefined }}
                          style={styles.pokemonImage}
                          resizeMode="contain"
                        />
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={() => fetchPokemonForGenerations(true)}
              disabled={loading}
            >
              <RefreshCw color="#fff" size={16} style={styles.refreshIcon} />
              <Text style={styles.refreshText}>Random Pokémon</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.startButton,
                !selectedGen && styles.startButtonDisabled
              ]}
              onPress={handleStartGame}
              disabled={!selectedGen}>
              <Play color="white" fill="white" size={24} style={styles.startIcon} />
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 30, 0.7)',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 8,
  },
  genButton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(30, 30, 40, 0.8)',
    marginBottom: 12,
    overflow: 'hidden',
    width: '48%',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  genContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  genInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  selectedGen: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  genName: {
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  genRange: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  pokemonContainer: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 60,
    height: 60,
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,1)',
    height: 56,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
  startButtonDisabled: {
    visibility: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: 'rgba(0,0,0,0)',
  },
  startIcon: {
    marginRight: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  refreshText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  refreshIcon: {
    marginRight: 8,
  },
});