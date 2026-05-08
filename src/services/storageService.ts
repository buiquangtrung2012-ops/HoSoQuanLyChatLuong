const STORAGE_KEYS = {
  PROJECT: 'hoso_project',
  DIARY: 'hoso_diary',
  WORK_ITEMS: 'hoso_work_items',
  PERSONNEL: 'hoso_personnel',
  MATERIALS: 'hoso_materials',
  EQUIPMENT: 'hoso_equipment',
  LABS: 'hoso_labs',
};

export const StorageService = {
  saveProject: (data: any) => localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(data)),
  getProject: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECT);
    return data ? JSON.parse(data) : null;
  },

  saveDiary: (entries: any[]) => localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries)),
  getDiary: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DIARY);
    return data ? JSON.parse(data) : [];
  },

  saveWorkItems: (items: any[]) => localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(items)),
  getWorkItems: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
    return data ? JSON.parse(data) : [];
  },
  
  // Generic helpers
  save: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};
