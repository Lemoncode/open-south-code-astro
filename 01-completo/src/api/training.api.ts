import { mapContentToModel } from "@content-island/api-client";
import client from "@/lib/client";
import type { Training, TrainingWithLessons, Lesson } from "./model";

export async function getLessons(ids: string[]): Promise<Lesson[]> {
  const response = await client.getContentList({
    contentType: "Lesson",
    id: { in: ids },
  });

  const lessons = response.map((content) => mapContentToModel<Lesson>(content));

  return lessons;
}

// We could implement a simpler solution but it would just make a fetch per
// each training, which is not efficient.
export async function getTrainings(): Promise<TrainingWithLessons[]> {
  // Fetch the list of trainings from the API
  const response = await client.getContentList({ contentType: "training" });

  // Map raw content data into typed Training models
  const trainings = response.map((content) =>
    mapContentToModel<Training>(content),
  );

  // For each training, fetch its lessons and return the enriched object
  const trainingsWithLessons = await Promise.all(
    trainings.map(async (training) => {
      // Fetch the lesson objects using the stored lesson IDs
      const lessons = await getLessons(training.lessons);

      // Return a new object that includes full lesson data
      return {
        ...training,
        lessons,
      };
    }),
  );

  // Return the final list of trainings with full lessons
  return trainingsWithLessons;
}
