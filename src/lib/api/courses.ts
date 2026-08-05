import { apiClient } from "./client";
import type { Course, Enrollment } from "@/types/course";

export async function fetchCourses(params?: { level?: string; category?: string }) {
  const { data } = await apiClient.get<{ data: Course[] }>("/courses", { params });
  return data.data;
}

export async function fetchCourse(slug: string) {
  const { data } = await apiClient.get<{ data: Course }>(`/courses/${slug}`);
  return data.data;
}

export async function fetchMyEnrollments() {
  const { data } = await apiClient.get<{ data: Enrollment[] }>("/my/enrollments");
  return data.data;
}

export async function fetchMyEnrollment(id: number) {
  const { data } = await apiClient.get<{ data: Enrollment }>(`/my/enrollments/${id}`);
  return data.data;
}

export async function updateEnrollmentProgress(
  id: number,
  payload: { completed_lessons: number[]; progress_percent: number }
) {
  const { data } = await apiClient.patch<{ data: Enrollment }>(
    `/my/enrollments/${id}/progress`,
    payload
  );
  return data.data;
}
