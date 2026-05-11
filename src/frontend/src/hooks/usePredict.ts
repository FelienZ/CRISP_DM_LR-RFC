import { useMutation } from '@tanstack/react-query';
import { predictionService } from '../api/predictionService';
import type { HeartDiseaseRequest, HeartDiseaseResponse } from '../types';
import { AxiosError } from 'axios';

export const usePredict = () => {
  return useMutation<HeartDiseaseResponse, AxiosError, HeartDiseaseRequest>({
    mutationFn: (data: HeartDiseaseRequest) => predictionService.predictRisk(data),
  });
};
