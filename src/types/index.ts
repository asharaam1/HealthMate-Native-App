// types/index.ts
// ============ Onboarding ============
export interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

// ============ User ============
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  dateOfBirth?: string;      // ✅ Add this
  gender?: string;            // ✅ Add this
  bloodGroup?: string;        // ✅ Add this
  createdAt?: string;
  updatedAt?: string;
}

// ============ Family Member ============
export interface FamilyMember {
  _id: string;
  userId: string;
  name: string;
  relationship: 'self' | 'spouse' | 'son' | 'daughter' | 'father' | 'mother' | 'brother' | 'sister' | 'other';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone?: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  age?: number;
}

export interface FamilyMemberContextType {
  members: FamilyMember[];
  selectedMember: FamilyMember | null;
  loading: boolean;
  error: string | null;
  fetchFamilyMembers: () => Promise<void>;
  createFamilyMember: (formData: FormData) => Promise<FamilyMember>;
  updateFamilyMember: (id: string, formData: FormData) => Promise<FamilyMember>;
  deleteFamilyMember: (id: string) => Promise<void>;
  deleteFamilyMemberImage: (id: string) => Promise<void>;
  setSelectedMember: (member: FamilyMember | null) => void;
  clearError: () => void;
}

// ============ AI Summary ============
export interface AbnormalValue {
  parameter: string;
  value: string;
  normalRange: string;
  status: string;
}

export interface AISummary {
  englishSummary: string;
  romanUrduSummary: string;
  abnormalValues: AbnormalValue[];
  doctorQuestions: string[];
  foodsToAvoid: string[];
  recommendedFoods: string[];
  homeRemedies: string[];
  disclaimer: string;
}

// ============ Report ============
export interface Report {
  _id: string;
  userId: string;
  familyMemberId: string;
  title: string;
  reportType: 'blood-test' | 'x-ray' | 'prescription' | 'ultrasound' | 'other';
  reportDate: string;        // Backend uses reportDate (not 'date')
  file: {
    url: string;
    publicId: string;
    fileType: 'image' | 'pdf';
  };
  aiSummary?: {
    englishSummary: string;
    romanUrduSummary: string;
    abnormalValues: Array<{
      parameter: string;
      value: string;
      normalRange: string;
      status: string;
    }>;
    doctorQuestions: string[];
    foodsToAvoid: string[];
    recommendedFoods: string[];
    homeRemedies: string[];
    disclaimer: string;
  };
  notes?: string;
  isProcessed: boolean;      // Backend uses isProcessed (not 'status')
  createdAt: string;
  updatedAt: string;
}

// ============ Vitals ============
export interface Vitals {
  _id: string;
  userId: string;
  familyMemberId: string;
  recordDate: string;
  recordedAt?: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    unit?: string;
  };
  bloodSugar?: {
    value: number;
    type: 'fasting' | 'random' | 'post-meal' | 'hba1c';
    unit?: string;
  };
  weight?: {
    value: number;
    unit?: 'kg' | 'lbs';
  };
  height?: {
    value: number;
    unit?: 'cm' | 'inches';
  };
  heartRate?: {
    value: number;
    unit?: string;
  };
  temperature?: {
    value: number;
    unit?: 'celsius' | 'fahrenheit';
  };
  oxygenLevel?: {
    value: number;
    unit?: string;
  };
  bmi?: number;
  notes?: string;
  symptoms?: string[];
  isAnalyzed: boolean;
  aiAnalysis?: {
    englishSummary: string;
    romanUrduSummary: string;
    abnormalValues: Array<{
      parameter: string;
      value: string;
      normalRange: string;
      status: string;
    }>;
    doctorQuestions: string[];
    foodsToAvoid: string[];
    recommendedFoods: string[];
    homeRemedies: string[];
    disclaimer: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VitalsContextType {
  vitals: Vitals[];
  currentVital: Vitals | null;
  loading: boolean;
  error: string | null;
  total: number;
  addVitals: (vitalsData: any) => Promise<Vitals>;
  getVitals: (params?: any) => Promise<void>;
  getVitalById: (id: string) => Promise<Vitals>;
  deleteVital: (id: string) => Promise<void>;
  clearError: () => void;
}

// ============ Helper function to convert isProcessed to status ============
export function getReportStatus(report: Report): 'Analyzed' | 'Pending' {
  return report.isProcessed ? 'Analyzed' : 'Pending';
}

// ============ Helper function to format report date ============
export function formatReportDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ============ Helper to get Vitale display value ============
export function getVitalDisplayValue(vital: Vitals): { type: string; value: string }[] {
  const items: { type: string; value: string }[] = [];

  if (vital.bloodPressure?.systolic) {
    items.push({
      type: 'BP',
      value: `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`,
    });
  }
  if (vital.bloodSugar?.value) {
    items.push({
      type: 'Sugar',
      value: `${vital.bloodSugar.value}`,
    });
  }
  if (vital.weight?.value) {
    items.push({
      type: 'Weight',
      value: `${vital.weight.value} ${vital.weight.unit || 'kg'}`,
    });
  }
  if (vital.heartRate?.value) {
    items.push({
      type: 'Heart',
      value: `${vital.heartRate.value} bpm`,
    });
  }
  if (vital.oxygenLevel?.value) {
    items.push({
      type: 'Oxygen',
      value: `${vital.oxygenLevel.value}%`,
    });
  }

  return items;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  pages: number;
}

export interface ReportContextType {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  uploadReport: (formData: FormData) => Promise<Report>;
  getReports: (params?: any) => Promise<void>;
  getReportById: (id: string) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentReport: () => void;
}

export interface VitalsResponse {
  vitals: Vitals[];
  total: number;
}

// ============ Navigation Types ============
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Bottom Tab ke liye
export type MainTabParamList = {
  HomeTab: undefined;
  Upload: undefined;
  Vitals: undefined;
  Timeline: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ReportDetail: { reportId: string };
  Profile: undefined;
  AddVitals: undefined;
  VitalAnalysis: { vitalId: string }; // Replace 'any' with actual vitals type
};


// Merged — RootNavigation.ts ke liye
export type RootStackParamList =
  AuthStackParamList &
  HomeStackParamList &
  MainTabParamList;