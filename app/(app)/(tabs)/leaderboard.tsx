import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import { useResponsiveDimensions } from '@/hooks/useWindowDimensions';

export default function LeaderboardScreen() {
  const { width, height, isLandscape } = useResponsiveDimensions();
  const { highStreak } = useGameStore();

  return (
    <ImageBackground 
      source={require('@/assets/images/AnimatedLeaderboard_Wallpaper.gif')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width: '100%', height: '100%' }}
    >
      <View style={[
        styles.overlay,
        { padding: width * 0.05 }
      ]}>
        <Text style={[
          styles.title,
          { 
            fontSize: Math.min(28, width * 0.07),
            marginTop: isLandscape ? height * 0.05 : 60,
            color: '#fff'
          }
        ]}>Highscore</Text>
        
        <ScrollView style={styles.scrollView}>
          <View style={[
            styles.scoreCard,
            isLandscape && { width: '70%', alignSelf: 'center' }
          ]}>
            <Text style={styles.scoreValue}>{highStreak}</Text>
            <Text style={styles.scoreTitle}>Your Highest Streak</Text>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(20, 20, 30, 0.7)', // Dark overlay
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 60,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scoreCard: {
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scoreTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 36,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
});