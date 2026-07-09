import { apiRequest } from "./client";

export function getStudents(token: string) {
  return apiRequest("/students", { token });
}
