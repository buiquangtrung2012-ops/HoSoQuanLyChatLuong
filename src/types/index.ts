export interface Project {
  id: string;
  name: string;
  investor: string;
  contractor: string;
  isJointVenture?: boolean;
  contractorMembers?: string[];
  supervisor: string;
  designer: string;
  contractNumber: string;
  packageName: string;
  location: string;
  startDate: string;
  endDate: string;
}

export type PersonnelRole = 'Chỉ huy trưởng' | 'Giám sát trưởng' | 'Chủ đầu tư' | 'Tư vấn giám sát' | 'Tư vấn thiết kế';

export interface Personnel {
  id: string;
  name: string;
  position: string;
  unit: string;
  signature?: string;
  gender?: 'male' | 'female' | 'auto';
  role: PersonnelRole;
}


export interface WorkItem {
  id: string;
  line: string; // Tuyến
  category: string; // Hạng mục
  name: string;
  code: string;
  unit: string;
  quantity: number;
  requestDate: string;
  inspectionDate: string;
}

export interface Material {
  id: string;
  name: string;
  origin: string;
  supplier: string;
  lotNumber: string;
  cocq: string;
  quantity: string;
  testResult: string;
}

export interface Equipment {
  id: string;
  name: string;
  serial: string;
  inspectionDate: string;
  expiryDate: string;
}

export interface Lab {
  id: string;
  name: string;
  lasxd: string;
  expiryDate: string;
  equipment: string;
}

export interface QualityRecord {
  id: string;
  type: string;
  number: string;
  title: string;
  date: string;
  workItemId?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  weather: string;
  manpower: string;
  equipment: string;
  content: string;
  notes: string;
}
