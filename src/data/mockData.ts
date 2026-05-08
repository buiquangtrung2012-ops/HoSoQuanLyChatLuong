import { WorkItem, Personnel, Material, Equipment, QualityRecord } from '../types';

export const mockWorkItems: WorkItem[] = [
  { id: '1', line: 'Tuyến Lộ 1', category: 'Phần móng', name: 'Lắp dựng móng đúc sẵn M1', code: 'MC-001', unit: 'Cái', quantity: 24, startDate: '2026-05-01', inspectionDate: '2026-05-05' },
  { id: '2', line: 'Tuyến Lộ 1', category: 'Phần cột', name: 'Lắp dựng cột đèn bát giác H=8m', code: 'CD-001', unit: 'Cột', quantity: 24, startDate: '2026-05-04', inspectionDate: '2026-05-05' },
  { id: '3', line: 'Tuyến Lộ 2', category: 'Cáp điện', name: 'Rải cáp ngầm Cu/XLPE/PVC 4x16mm2', code: 'CN-002', unit: 'm', quantity: 850, startDate: '2026-05-05', inspectionDate: '2026-05-10' },
  { id: '4', line: 'Tuyến Lộ 1', category: 'Thiết bị', name: 'Lắp đặt đèn LED 120W và cần đèn', code: 'LD-001', unit: 'Bộ', quantity: 24, startDate: '2026-05-12', inspectionDate: '2026-05-15' },
];

export const mockPersonnel: Personnel[] = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Chỉ huy trưởng', unit: 'Coteccons', role: 'Chỉ huy trưởng' },
  { id: '2', name: 'Trần Văn B', position: 'Giám sát trưởng', unit: 'CONINCO', role: 'Giám sát trưởng' },
  { id: '3', name: 'Lê Văn C', position: 'Giám sát viên', unit: 'CONINCO', role: 'Tư vấn giám sát' },
  { id: '4', name: 'Phạm Văn D', position: 'Đại diện CĐT', unit: 'Sun Group', role: 'Chủ đầu tư' },
];

export const mockMaterials: Material[] = [
  { name: "Cột đèn thép H=8m mạ kẽm", source: "Hapulico", lot: "LOT-CP-001", qty: "24 Cột" },
  { name: "Đèn LED 120W Philips", source: "Philips Việt Nam", lot: "PH-LED-88", qty: "24 Bộ" },
  { name: "Cáp ngầm 4x16mm2 Cadivi", source: "Cadivi", lot: "CDV-16-4", qty: "1000 m" },
  { name: "Tủ điện chiếu sáng ngoài trời", source: "Tụ điện Miền Nam", lot: "TD-2026", qty: "02 Tủ" },
];

export const mockEquipment: Equipment[] = [
  { name: "Cần trục tháp POTAIN", serial: "PT-2024-X", lastCheck: "01/01/2026", expiry: "01/01/2027" },
  { name: "Máy bơm bê tông PUTZMEISTER", serial: "PZ-888", lastCheck: "15/02/2026", expiry: "15/02/2027" },
  { name: "Máy toàn đạc LEICA TS06", serial: "L-99021", lastCheck: "10/03/2026", expiry: "10/03/2027" },
];
