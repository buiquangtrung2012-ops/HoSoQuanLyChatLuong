import type { WorkItem, Personnel, Material, Equipment } from '../types';

export const mockWorkItems: WorkItem[] = [
  { id: '1', line: 'Tuyến Lộ 1', category: 'Phần móng', name: 'Lắp dựng móng đúc sẵn M1', code: 'MC-001', unit: 'Cái', quantity: 24, requestDate: '2026-05-01', inspectionDate: '2026-05-05' },
  { id: '2', line: 'Tuyến Lộ 1', category: 'Phần cột', name: 'Lắp dựng cột đèn bát giác H=8m', code: 'CD-001', unit: 'Cột', quantity: 24, requestDate: '2026-05-04', inspectionDate: '2026-05-05' },
  { id: '3', line: 'Tuyến Lộ 2', category: 'Cáp điện', name: 'Rải cáp ngầm Cu/XLPE/PVC 4x16mm2', code: 'CN-002', unit: 'm', quantity: 850, requestDate: '2026-05-05', inspectionDate: '2026-05-10' },
  { id: '4', line: 'Tuyến Lộ 1', category: 'Thiết bị', name: 'Lắp đặt đèn LED 120W và cần đèn', code: 'LD-001', unit: 'Bộ', quantity: 24, requestDate: '2026-05-12', inspectionDate: '2026-05-15' },
];

export const mockPersonnel: Personnel[] = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Chỉ huy trưởng', unit: 'Coteccons', role: 'Chỉ huy trưởng' },
  { id: '2', name: 'Trần Văn B', position: 'Giám sát trưởng', unit: 'CONINCO', role: 'Giám sát trưởng' },
  { id: '3', name: 'Lê Văn C', position: 'Giám sát viên', unit: 'CONINCO', role: 'Tư vấn giám sát' },
  { id: '4', name: 'Phạm Văn D', position: 'Đại diện CĐT', unit: 'Sun Group', role: 'Chủ đầu tư' },
];

export const mockMaterials: Material[] = [
  { id: '1', name: "Cột đèn thép H=8m mạ kẽm", origin: "Việt Nam", supplier: "Hapulico", lotNumber: "LOT-CP-001", quantity: "24 Cột", cocq: "Có", testResult: "Đạt" },
  { id: '2', name: "Đèn LED 120W Philips", origin: "Hà Lan", supplier: "Philips Việt Nam", lotNumber: "PH-LED-88", quantity: "24 Bộ", cocq: "Có", testResult: "Đạt" },
  { id: '3', name: "Cáp ngầm 4x16mm2 Cadivi", origin: "Việt Nam", supplier: "Cadivi", lotNumber: "CDV-16-4", quantity: "1000 m", cocq: "Có", testResult: "Đạt" },
  { id: '4', name: "Tủ điện chiếu sáng ngoài trời", origin: "Việt Nam", supplier: "Tụ điện Miền Nam", lotNumber: "TD-2026", quantity: "02 Tủ", cocq: "Có", testResult: "Đạt" },
];

export const mockEquipment: Equipment[] = [
  { id: '1', name: "Cần trục tháp POTAIN", serial: "PT-2024-X", inspectionDate: "2026-01-01", expiryDate: "2027-01-01" },
  { id: '2', name: "Máy bơm bê tông PUTZMEISTER", serial: "PZ-888", inspectionDate: "2026-02-15", expiryDate: "2027-02-15" },
  { id: '3', name: "Máy toàn đạc LEICA TS06", serial: "L-99021", inspectionDate: "2026-03-10", expiryDate: "2027-03-10" },
];
