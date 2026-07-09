import { apiRequest } from "./client";

export function getReports(token: string) {
  return apiRequest("/reports", { token });
}
