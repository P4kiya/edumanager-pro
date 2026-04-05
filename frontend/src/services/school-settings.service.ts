import apiClient from "./api-client";
import type { SchoolSettingsDTO, SchoolSettingsRequest } from "@/types/api.types";

export const schoolSettingsService = {
  get: async (): Promise<SchoolSettingsDTO> => {
    const response = await apiClient.get<SchoolSettingsDTO>("/settings/school");
    return response.data;
  },

  update: async (payload: SchoolSettingsRequest): Promise<SchoolSettingsDTO> => {
    const response = await apiClient.put<SchoolSettingsDTO>("/settings/school", payload);
    return response.data;
  },
};

export default schoolSettingsService;
