import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing, ImageBackground, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams, router } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { Play, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveDimensions } from '@/hooks/useWindowDimensions';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

// Pre-define all wallpaper imports
const generationWallpapers = {
  '1': require('@/assets/images/Gen1_Wallpaper.jpg'),
  '2': require('@/assets/images/Gen2_Wallpaper.jpg'),
  '3': require('@/assets/images/Gen3_Wallpaper.jpg'),
  '4': require('@/assets/images/Gen4_Wallpaper.jpg'),
  '5': require('@/assets/images/Gen5_Wallpaper.jpg'),
  '6': require('@/assets/images/Gen6_Wallpaper.jpg'),
  '7': require('@/assets/images/Gen7_Wallpaper.jpg'),
  '8': require('@/assets/images/Gen8_Wallpaper.jpg'),
  'default': require('@/assets/images/Default_Wallpaper.jpg'),
};

// Add dimensions for responsive sizing
const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const { generation } = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound>();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Pokemon[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Pokemon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { streak, incrementStreak, resetStreak } = useGameStore();
  
  // Animation for sound wave
  const animation = useRef(new Animated.Value(0)).current;
  const soundWaveAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Add this near other hooks
  const { width: responsiveWidth, height: responsiveHeight } = useResponsiveDimensions();

  // Add preloading functionality for next question
  const [nextOptions, setNextOptions] = useState<Pokemon[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);

  // Add state for streak loss message
  const [streakLost, setStreakLost] = useState(false);
  const [streakLostScore, setStreakLostScore] = useState(0);

  // First, add a state for tracking which option to highlight as correct
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<number | null>(null);

  // Get the appropriate wallpaper
  const getWallpaper = () => {
    const genKey = generation as string;
    if (genKey in generationWallpapers) {
      return generationWallpapers[genKey as keyof typeof generationWallpapers];
    }
    return generationWallpapers.default;
  };

  const loadGame = async () => {
    try {
      // Don't show loading screen if we already have options displayed
      if (options.length === 0) {
      setLoading(true);
      }
      
      const genRanges = {
        '1': { start: 1, end: 151 },
        '2': { start: 152, end: 251 },
        '3': { start: 252, end: 386 },
        '4': { start: 387, end: 493 },
        '5': { start: 494, end: 649 },
        '6': { start: 650, end: 721 },
        '7': { start: 722, end: 809 },
        '8': { start: 810, end: 898 },
      };

      const range = genRanges[generation as keyof typeof genRanges];
      const randomIds = new Set<number>();
      
      while (randomIds.size < 4) {
        const id = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
        randomIds.add(id);
      }

      const pokemonPromises = Array.from(randomIds).map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      );

      const pokemons = await Promise.all(pokemonPromises);
      setOptions(pokemons);
      setCorrectAnswer(pokemons[Math.floor(Math.random() * pokemons.length)]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading game:', error);
      setLoading(false);
    }
  };

  // Add preloading functionality for next question
  const preloadNextQuestion = async () => {
    if (isPreloading) return;
    
    try {
      setIsPreloading(true);
      const genRanges = {
        '1': { start: 1, end: 151 },
        '2': { start: 152, end: 251 },
        '3': { start: 252, end: 386 },
        '4': { start: 387, end: 493 },
        '5': { start: 494, end: 649 },
        '6': { start: 650, end: 721 },
        '7': { start: 722, end: 809 },
        '8': { start: 810, end: 898 },
      };

      const range = genRanges[generation as keyof typeof genRanges];
      const randomIds = new Set<number>();
      
      while (randomIds.size < 4) {
        const id = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
        randomIds.add(id);
      }

      const pokemonPromises = Array.from(randomIds).map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      );

      const pokemons = await Promise.all(pokemonPromises);
      setNextOptions(pokemons);
      setIsPreloading(false);
    } catch (error) {
      console.error('Error preloading next question:', error);
      setIsPreloading(false);
    }
  };

  // Start preloading after initial load
  useEffect(() => {
    if (options.length > 0 && nextOptions.length === 0 && !isPreloading) {
      preloadNextQuestion();
    }
  }, [options, nextOptions, isPreloading]);

  // Update handleNextQuestion to use preloaded data
  const handleNextQuestion = () => {
    // Use preloaded data if available
    if (nextOptions.length > 0) {
      setOptions(nextOptions);
      setCorrectAnswer(nextOptions[Math.floor(Math.random() * nextOptions.length)]);
      setNextOptions([]); // Clear preloaded data
      setSelectedOption(null);
      setIsCorrect(null);
      // Start preloading the next set
      preloadNextQuestion();
    } else {
      // Fallback to normal loading if preloaded data isn't ready
      setSelectedOption(null);
      setIsCorrect(null);
      loadGame();
    }
  };

  useEffect(() => {
    loadGame();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (soundWaveAnimation.current) {
        soundWaveAnimation.current.stop();
      }
    };
  }, []);

  const startSoundWaveAnimation = () => {
    animation.setValue(0);
    soundWaveAnimation.current = Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    soundWaveAnimation.current.start();
  };

  const stopSoundWaveAnimation = () => {
    if (soundWaveAnimation.current) {
      soundWaveAnimation.current.stop();
    }
  };

  const playSound = async () => {
    if (correctAnswer) {
      try {
        setIsPlaying(true);
        startSoundWaveAnimation();
        
        try {
          // First try to load the sound from Pokemon Showdown
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: `https://play.pokemonshowdown.com/audio/cries/${correctAnswer.name.toLowerCase()}.mp3` },
            { shouldPlay: false }
          );
          setSound(newSound);
          
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              stopSoundWaveAnimation();
            }
          });
          
          await newSound.playAsync();
        } catch (soundError) {
          console.log(`Could not load cry for ${correctAnswer.name}, trying alternative source...`);
          
          // Try alternative source if available
          try {
            const { sound: fallbackSound } = await Audio.Sound.createAsync(
              { uri: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${correctAnswer.id}.ogg` },
              { shouldPlay: false }
            );
            
            setSound(fallbackSound);
            
            fallbackSound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
                stopSoundWaveAnimation();
              }
            });
            
            await fallbackSound.playAsync();
          } catch (fallbackError) {
            // If both sources fail, use a generic sound
            console.log(`All sources failed for ${correctAnswer.name}, using generic sound`);
            const { sound: genericSound } = await Audio.Sound.createAsync(
              require('@/assets/sounds/wrong.mp3')
            );
            
            setSound(genericSound);
            
            genericSound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
                stopSoundWaveAnimation();
              }
            });
            
            await genericSound.playAsync();
          }
        }
      } catch (error) {
        console.error('Error in sound playback system:', error);
        setIsPlaying(false);
        stopSoundWaveAnimation();
      }
    }
  };

  const handleAnswer = async (pokemon: Pokemon) => {
    setSelectedOption(pokemon.id);
    const correct = pokemon.id === correctAnswer?.id;
    setIsCorrect(correct);
    
    try {
      if (correct) {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/correct.mp3')
        );
        await sound.playAsync();
        incrementStreak();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/wrong.mp3')
        );
        await sound.playAsync();
        
        // Show the correct answer after a wrong selection
        setShowCorrectAnswer(correctAnswer?.id || null);
        
        // Show streak lost message if streak was > 0
        if (streak > 0) {
          setStreakLost(true);
          setStreakLostScore(streak);
          setTimeout(() => {
            setStreakLost(false);
          }, 3000);
        }
        
        resetStreak();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setShowCorrectAnswer(null); // Reset the correct answer highlight
      handleNextQuestion();
    }, 1500);
  };

  if (loading) {
    return (
      <ImageBackground 
        source={require('@/assets/images/Default_Wallpaper.jpg')} 
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <Image 
            source={require('@/assets/images/pokeball.png')} 
            style={styles.loadingPokeball}
          />
        <Text style={styles.loading}>Loading...</Text>
      </View>
      </ImageBackground>
    );
  }

  const wave1Opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  const wave2Opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const wave3Opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const optionSize = Math.min(responsiveWidth * 0.45, 160);
  const padding = responsiveWidth * 0.04;

  return (
    <ImageBackground 
      source={getWallpaper()} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width: '100%', height: '100%' }}
    >
      <View style={[styles.gameContainer, { padding }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.replace('/(app)/(tabs)')} 
          style={styles.backButton}
        >
          <X color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.streakContainer}>
          <Image 
            source={require('@/assets/images/fire.png')} 
            style={styles.fireIcon}
          />
          <Text style={styles.streakText}>Streak: {streak}</Text>
        </View>
      </View>
        
        <View style={styles.mainContent}>
          <View style={styles.optionsContainer}>
            <View style={styles.optionsGrid}>
              {options.slice(0, 2).map((pokemon) => (
                <TouchableOpacity
                  key={pokemon.id}
                  style={[
                    styles.optionButton,
                    selectedOption === pokemon.id && (isCorrect ? styles.correctOption : styles.wrongOption),
                    showCorrectAnswer === pokemon.id && styles.correctOption,
                    { 
                      width: responsiveWidth < 500 ? responsiveWidth * 0.38 : 170,
                      height: responsiveWidth < 500 ? responsiveWidth * 0.38 : 170,
                      margin: 5,
                      marginHorizontal: 20
                    }
                  ]}
                  onPress={() => handleAnswer(pokemon)}
                  disabled={selectedOption !== null}>
                  <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonSprite} />
                  <Text style={styles.pokemonName}>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.optionsGrid}>
              {options.slice(2, 4).map((pokemon) => (
                <TouchableOpacity
                  key={pokemon.id}
                  style={[
                    styles.optionButton,
                    selectedOption === pokemon.id && (isCorrect ? styles.correctOption : styles.wrongOption),
                    showCorrectAnswer === pokemon.id && styles.correctOption,
                    { 
                      width: responsiveWidth < 500 ? responsiveWidth * 0.38 : 170,
                      height: responsiveWidth < 500 ? responsiveWidth * 0.38 : 170,
                      margin: 5,
                      marginHorizontal: 17
                    }
                  ]}
                  onPress={() => handleAnswer(pokemon)}
                  disabled={selectedOption !== null}>
                  <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonSprite} />
                  <Text style={styles.pokemonName}>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Overlapping Circular Play Button */}
            <TouchableOpacity 
              style={styles.circlePlayButton} 
              onPress={playSound}
              disabled={isPlaying || !correctAnswer}>
              {isPlaying ? (
                <View style={styles.circleWaveContainer}>
                  <Animated.View style={[
                    styles.circleWave, 
                    { 
                      height: 10,  // Fixed base height 
                      transform: [{ 
                        scaleY: animation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1.5, 0.5]
                        }) 
                      }]
                    }
                  ]} />
                  <Animated.View style={[
                    styles.circleWave, 
                    { 
                      height: 10,  // Fixed base height
                      transform: [{ 
                        scaleY: animation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1.5, 0.5, 1.5]
                        }) 
                      }]
                    }
                  ]} />
                  <Animated.View style={[
                    styles.circleWave, 
                    { 
                      height: 10,  // Fixed base height
                      transform: [{ 
                        scaleY: animation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 2.0, 0.5]
                        }) 
                      }]
                    }
                  ]} />
                </View>
              ) : (
                <Play color="white" size={28} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.streakLostWrapper}>
            {streakLost && (
              <View style={styles.streakLostContainer}>
                <Text style={styles.streakLostText}>
                  Streak lost! You reached {streakLostScore}
                </Text>
              </View>
            )}
          </View>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5, // Negative margin to bring rows closer
  },
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    minWidth: 140,
    backgroundColor: '#4299E1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  soundWave: {
    width: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginHorizontal: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
  },
  streakText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fireIcon: {
    width: 23,
    height: 30,
    marginRight: 8,
  },
  streakLostWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    zIndex: 10,
  },
  streakLostContainer: {
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  streakLostText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  correctOption: {
    backgroundColor: 'rgba(72, 187, 120, 0.8)',
    borderColor: '#48BB78',
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
    borderColor: '#E53E3E',
    borderWidth: 2,
  },
  pokemonSprite: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    verticalAlign: 'middle',
  },
  pokemonName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    textOverflow: 'ellipsis',
  },
  optionButton: {
    backgroundColor: 'rgba(30, 30, 40, 0.85)',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  loadingPokeball: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  circlePlayButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  circleWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  circleWave: {
    width: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 3,
  },
});