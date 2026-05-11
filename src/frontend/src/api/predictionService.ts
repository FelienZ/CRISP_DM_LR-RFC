import apiClient from './apiClient';
import type { HeartDiseaseRequest, HeartDiseaseResponse } from '@/types';

export const predictionService = {
  predictRisk: async (data: HeartDiseaseRequest): Promise<HeartDiseaseResponse> => {
    const response = await apiClient.post<HeartDiseaseResponse>('/predict', data);
    return response.data;
  },
};
