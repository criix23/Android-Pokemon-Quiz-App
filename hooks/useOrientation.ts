import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [orientation, setOrientation] = useState('portrait');
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width < window.height ? 'portrait' : 'landscape');
    });
    
    // Set initial orientation
    const { width, height } = Dimensions.get('window');
    setOrientation(width < height ? 'portrait' : 'landscape');
    
    return () => subscription.remove();
  }, []);
  
  return orientation;
} 