import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { LogIn } from 'lucide-react-native';
import { useResponsiveDimensions } from '@/hooks/useWindowDimensions';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { width, height } = useResponsiveDimensions();
  
  // Calculate responsive logo size - width is 30% of screen width but max 280px
  const logoWidth = Math.min(width * 0.6, 500);
  // Height calculated to maintain aspect ratio of the Pokemon logo (roughly 1:0.37)
  const logoHeight = logoWidth * 0.37;

  const handleLogin = async () => {
    try {
      // Reset any previous errors
      setError('');
      
      // Enhanced email validation with regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!email || !emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Additional check for suspicious/fake emails
      const suspiciousPatterns = [
        /^[a-z]{1,5}@[a-z]{1,5}\.[a-z]{2,3}$/,  // Like assas@asas.xyz
        /^test@.*$/,                            // Starts with test@
        /^.*@example\.com$/,                    // Ends with @example.com
        /^[a-z]+@[a-z]+\.[a-z]{2,3}$/           // Simple repeating patterns
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(email.toLowerCase()))) {
        setError('Please enter a real email address');
        return;
      }
      
      // Validate password length
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      // If validation passes, attempt login
      await login(email, password);
      router.replace({ pathname: '/(app)/(tabs)' });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/AnimatedLeaderboard_Wallpaper.gif')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width: '100%', height: '100%' }}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/Pokemon_Logo.png')}
            style={[
              styles.logo,
              { width: logoWidth, height: logoHeight }
            ]}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sound Quiz</Text>
        </View>
        
        <View style={styles.formContainer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <LogIn color="white" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {
              router.push("../signup");
            }}>
              <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 30, 0.7)',
    padding: '5%',
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  form: {
    borderRadius: 20,
    padding: 20,
    width: '100%'
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#F7FAFC',
  },
  button: {
    height: 50,
    backgroundColor: '#4299E1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  error: {
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signupText: {
    color: '#4299E1',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Inter_600SemiBold',
  },
});