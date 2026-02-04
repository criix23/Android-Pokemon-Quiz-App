import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameState {
  streak: number;
  highStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  resetGame: () => void;
  loadHighStreak: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  streak: 0,
  highStreak: 0,
  incrementStreak: () => {
    const newStreak = get().streak + 1;
    set({ streak: newStreak });
    if (newStreak > get().highStreak) {
      set({ highStreak: newStreak });
      AsyncStorage.setItem('highStreak', newStreak.toString());
    }
  },
  resetStreak: () => {
    const currentStreak = get().streak;
    if (currentStreak > get().highStreak) {
      set({ highStreak: currentStreak });
      AsyncStorage.setItem('highStreak', currentStreak.toString());
    }
    set({ streak: 0 });
  },
  resetGame: () => set({ streak: 0 }),
  loadHighStreak: async () => {
    const savedStreak = await AsyncStorage.getItem('highStreak');
    if (savedStreak) {
      set({ highStreak: parseInt(savedStreak, 10) });
    }
  },
}));