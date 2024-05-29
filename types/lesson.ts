interface Lesson {
  id: number;
  title: string;
  description?: string | null;
  duration?: number | null;
  videoLink: string;
  trainer: Trainer;
  trainerId: number;
  category: LessonCategory;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LessonCategory {
  id: number;
  categoryName: string;
  iconName: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}
