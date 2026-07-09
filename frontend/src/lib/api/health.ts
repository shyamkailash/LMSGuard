import { apiRequest } from "./client";

export type HealthResponse = {
  success: boolean;
  status: string;
  backend: string;
  database: string;
  version: string;
};

export function getHealth() {
  return apiRequest<HealthResponse>("/health");
}
