const STORAGE_KEYS = {
  PROJECT: 'hoso_project',
  DIARY: 'hoso_diary',
  WORK_ITEMS: 'hoso_work_items',
  PERSONNEL: 'hoso_personnel',
  MATERIALS: 'hoso_materials',
  EQUIPMENT: 'hoso_equipment',
  LABS: 'hoso_labs',
  CUSTOM_RECORDS: 'hoso_custom_records',
};

export const StorageService = {
  saveProject: (data: any) => localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(data)),
  getProject: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECT);
    return data ? JSON.parse(data) : null;
  },

  saveDiary: (entries: any[]) => localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries)),
  getDiary: (): any[] | null => {
    const data = localStorage.getItem(STORAGE_KEYS.DIARY);
    return data ? JSON.parse(data) : null;
  },

  saveWorkItems: (items: any[]) => localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(items)),
  getWorkItems: (): any[] | null => {
    const data = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
    return data ? JSON.parse(data) : null;
  },

  saveRecordTypes: (records: string[]) => localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(records)),
  getRecordTypes: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECORDS);
    if (data) return JSON.parse(data);
    
    // Initial default records
    const defaults = [
      "Biên bản bàn giao mặt bằng",
      "Biên bản kiểm tra điều kiện khởi công",
      "Biên bản nghiệm thu vật liệu: Cột đèn, cần đèn",
      "Biên bản nghiệm thu vật liệu: Đèn chiếu sáng, tủ điện",
      "Biên bản nghiệm thu vật liệu: Cáp điện, vật tư phụ",
      "Biên bản nghiệm thu công việc: Đào móng, lắp dựng móng cột",
      "Biên bản nghiệm thu công việc: Lắp dựng cột đèn",
      "Biên bản nghiệm thu công việc: Rải cáp ngầm/kéo dây",
      "Biên bản nghiệm thu công việc: Lắp đặt tủ điện, đèn",
      "Biên bản thử nghiệm: Đo điện trở tiếp địa, cách điện",
      "Biên bản nghiệm thu hoàn thành công trình"
    ];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(defaults));
    return defaults;
  },
  
  // Generic helpers
  save: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};
