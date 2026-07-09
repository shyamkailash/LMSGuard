import { apiRequest } from "./client";

export function getExams(token: string) {
  return apiRequest("/exams", { token });
}

export function getExam(token: string, id: number) {
  return apiRequest(`/exams/${id}`, { token });
}
