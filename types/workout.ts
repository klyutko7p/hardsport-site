interface WorkoutCategory {
  id: number;
  name: string;
  workouts: Workout[];
  createdAt: Date;
  updatedAt: Date;
}

interface Workout {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  category: WorkoutCategory;
  categoryId: number;
  club: Club;
  clubId: number;
  schedules: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}
