import apiClient from "./api-client";
import { TeacherDTO } from "@/types/api.types";

export const teacherService = {
  getAll: async (): Promise<TeacherDTO[]> => {
    const response = await apiClient.get<TeacherDTO[]>("/teachers");
    return response.data;
  },
};

export default teacherService;
