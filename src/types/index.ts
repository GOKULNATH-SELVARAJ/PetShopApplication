export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  image: string;
}

export interface CartItem extends Pet {
  quantity: number;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: string;
  price: string;
  // image: string | null;
}
