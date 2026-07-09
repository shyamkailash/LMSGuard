import { apiRequest } from "./client";

export function getAdminDashboard(token: string) {
  return apiRequest("/dashboard/admin", { token });
}

export function getFacultyDashboard(token: string) {
  return apiRequest("/dashboard/faculty", { token });
}

export function getStudentDashboard(token: string) {
  return apiRequest("/dashboard/student", { token });
}
