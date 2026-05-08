import type { QualityRecord, WorkItem, Material } from '../types';

export const WorkflowService = {
  /**
   * Checks if a record of a certain type can be created based on existing documents and statuses.
   */
  canCreateRecord(type: string, context: {
    workItems: WorkItem[],
    materials: Material[],
    existingRecords: QualityRecord[]
  }): { canCreate: boolean, reason?: string } {
    
    // Rule: Cannot create "Biên bản nghiệm thu công việc" unless:
    // - BBBG mặt bằng exists
    // - Điều kiện khởi công exists
    if (type === 'Biên bản nghiệm thu công việc') {
      const hasGroundHandover = context.existingRecords.some(r => r.type === 'Biên bản bàn giao mặt bằng');
      const hasCommencementCheck = context.existingRecords.some(r => r.type === 'Biên bản kiểm tra điều kiện khởi công');

      if (!hasGroundHandover) return { canCreate: false, reason: 'Chưa có Biên bản bàn giao mặt bằng.' };
      if (!hasCommencementCheck) return { canCreate: false, reason: 'Chưa có Biên bản kiểm tra điều kiện khởi công.' };
    }

    // Rule: Cannot create nghiệm thu hoàn thành unless all NTCV completed

    return { canCreate: true };
  },

  /**
   * Generates a new record number based on type.
   */
  generateNextNumber(type: string, existingRecords: QualityRecord[]): string {
    const prefixes: Record<string, string> = {
      'Biên bản bàn giao mặt bằng': 'BBBG',
      'Biên bản kiểm tra điều kiện khởi công': 'KKKC',
      'Biên bản nghiệm thu công việc': 'NTCV',
      'Biên bản nghiệm thu hoàn thành': 'NHT',
      'Nhật ký thi công': 'NKTC'
    };

    const prefix = prefixes[type] || 'HS';
    const typeRecords = existingRecords.filter(r => r.type === type);
    const nextId = (typeRecords.length + 1).toString().padStart(3, '0');
    
    return `${prefix}-${nextId}`;
  }
};
