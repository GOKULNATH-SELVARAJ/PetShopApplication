import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  image: string;
}

interface PetStore {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  removePet: (id: string) => void;
  updatePet: (id: string, pet: Partial<Pet>) => void;
  clearAllPets: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      pets: [],
      
      addPet: (pet) =>
        set((state) => ({
          pets: [...state.pets, pet],
        })),
      
      removePet: (id) =>
        set((state) => ({
          pets: state.pets.filter((pet) => pet.id !== id),
        })),
      
      updatePet: (id, updatedPet) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id ? { ...pet, ...updatedPet } : pet
          ),
        })),
      
      clearAllPets: () =>
        set({ pets: [] }),
    }),
    {
      name: 'pet-storage', // unique name for storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);