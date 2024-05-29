interface Certification {
  id: number;
  name: string;
  description?: string | null;
  trainer?: Trainer | null;
  trainerId: number;
  createdAt: Date;
  updatedAt: Date;
}
