import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useResponsiveDimensions() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription.remove();
  }, []);
  
  return {
    width: dimensions.width,
    height: dimensions.height,
    isLandscape: dimensions.width > dimensions.height
  };
} 