export interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export type User = {
  _id: string;  // MongoDB _id — AuthContext bhi yahi use karega
  name: string;
  email: string;
};

export type Report = {
  _id: string;
  title: string;
  date: string;
  type: 'Lab Report' | 'X-Ray' | 'Prescription' | 'Ultrasound' | 'Other';
  status: 'Analyzed' | 'Pending';
  fileUrl?: string;
  aiSummary?: AiSummary;
};

export type AiSummary = {
  en: string;
  ur: string;
  questions: string[];
  foods: string[];
};

export type Vital = {
  _id: string;
  type: 'BP' | 'Sugar' | 'Weight' | 'Oxygen' | 'Other';
  value: string;
  date: string;
  note?: string;
};