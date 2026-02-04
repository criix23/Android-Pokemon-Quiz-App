import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { LogOut } from 'lucide-react-native';
import { useResponsiveDimensions } from '@/hooks/useWindowDimensions';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { width, height, isLandscape } = useResponsiveDimensions();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

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
            marginTop: isLandscape ? height * 0.05 : 60
          }
        ]}>Profile</Text>
        
        <View style={[
          styles.profileCard,
          isLandscape && { width: '70%', alignSelf: 'center' }
        ]}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.logoutButton,
            isLandscape && { width: '50%', alignSelf: 'center' }
          ]} 
          onPress={handleLogout}>
          <LogOut color="white" size={20} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    color: '#fff',
    marginTop: 60,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});