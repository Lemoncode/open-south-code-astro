import type { Media } from "@content-island/api-client";

export interface Training {
  id: string;
  title: string;
  overview: string;
  slug: string;
  thumbnail: Media;
  lessons: string[];
}

export interface Lesson {
  id: string;
  language: string;
  title: string;
  slug: string;
  content: string;
  video: string;
}

export interface TrainingWithLessons extends Omit<Training, "lessons"> {
  lessons: Lesson[];
}
