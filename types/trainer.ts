
interface Trainer {
  id: number;
  name: string;
  age?: number | null;
  gender?: string | null;
  photo?: string | null;
  experience?: number | null;
  TrainerCertification: TrainerCertification[];
  club: Club;
  clubId: number;
  lessons: Lesson[];
  certifications: Certification[];
  schedules: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}

interface TrainerCertification {
  certification: Certification;
}
