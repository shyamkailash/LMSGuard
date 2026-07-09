import { apiRequest } from "./client";

export function getUsers(token: string) {
  return apiRequest("/users", { token });
}

export function getUser(token: string, id: number) {
  return apiRequest(`/users/${id}`, { token });
}
