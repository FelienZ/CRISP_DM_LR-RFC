export interface HeartDiseaseRequest {
  Age: number;
  Gender: 'Male' | 'Female';
  ChestPain: 'Typical' | 'Atypical' | 'Non-anginal' | 'Asymptomatic';
  RestingBP: number;
  Cholesterol: number;
  FastingBS: 0 | 1;
  MaxHR: number;
  ExerciseAngina: 'Yes' | 'No';
  Smoking: 'Yes' | 'No';
  BMI: number;
  FamilyHistory: 'Yes' | 'No';
  StressLevel: number;
  PhysicalActivity: 'Rendah' | 'Sedang' | 'Tinggi';
  model_type: 'lr' | 'rf';
}

export interface HeartDiseaseResponse {
  status: string;
  prediction: number;
  risk_level: string;
  probability: number;
  model_used: string;
}
