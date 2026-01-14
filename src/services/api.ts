import axios from 'axios';
import { PetFormData } from '../types';

const API_BASE_URL = 'https://reqres.in/api';
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';

export interface ApiResponse {
  id: string;
  createdAt: string;
}

export const submitPetDetails = async (formData: PetFormData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name: formData.name,
      breed: formData.breed,
      age: formData.age,
      price: formData.price,
      image: formData.image,
    });
    
    return {
      id: response.data.id || Date.now().toString(),
      createdAt: response.data.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to submit pet details');
    }
    throw new Error('Failed to submit pet details');
  }
};

export const fetchRandomPetImage = async (): Promise<string> => {
  try {
    const response = await axios.get(DOG_API_URL);
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch random pet image');
    }
    throw new Error('Failed to fetch random pet image');
  }
};
