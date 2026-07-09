import { apiRequest } from "./client";

export function getFaculty(token: string) {
  return apiRequest("/faculty", { token });
}
