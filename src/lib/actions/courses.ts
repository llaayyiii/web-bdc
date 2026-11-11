"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";

export async function toggleCourseTopicAction(courseId: string, topicIndex: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Harap masuk terlebih dahulu." };
  }

  const enrollment = bdcStore.toggleCourseTopic(user.id, courseId, topicIndex);
  if (!enrollment) {
    return { success: false, error: "Gagal memperbarui progres materi." };
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return { success: true, enrollment };
}
