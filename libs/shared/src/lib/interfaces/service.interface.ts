export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
  masterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}
