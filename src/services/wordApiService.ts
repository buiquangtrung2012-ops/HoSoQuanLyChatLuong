import { StorageService } from './storageService';

// ---- Nhận diện giới tính từ tên tiếng Việt ----
const FEMALE_GIVEN_NAMES = new Set([
  'lan','hoa','thu','mai','linh','thảo','trang','nhung','yến','uyên','phương',
  'hằng','dung','hiền','liên','quyên','thủy','thúy','hồng','ngọc','vân','chi',
  'loan','tuyết','xuân','hạnh','lệ','ly','nga','nhi','oanh','trinh','trúc',
  'huệ','diệp','thoa','nhàn','châu','diễm','giang','quỳnh','kim','bích','lam',
  'my','mỹ','nha','nhi','thương','thắm','vi','vy','huyền','thanh','thị',
]);
const FEMALE_MIDDLE = new Set(['thị']);

export const detectGender = (fullName: string): 'Ông' | 'Bà' | 'Ông (Bà)' => {
  if (!fullName.trim()) return 'Ông (Bà)';
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  if (parts.some(p => FEMALE_MIDDLE.has(p))) return 'Bà';
  const given = parts[parts.length - 1];
  return FEMALE_GIVEN_NAMES.has(given) ? 'Bà' : 'Ông';
};

export const resolveGender = (name: string, gender?: string): string => {
  if (gender === 'male') return 'Ông';
  if (gender === 'female') return 'Bà';
  if (!name.trim()) return 'Ông (Bà)';
  return detectGender(name);
};

export const isWordApiAvailable = () => {
  try {
    // @ts-ignore
    return typeof Word !== 'undefined';
  } catch {
    return false;
  }
};

const hideTableBorders = (table: any) => {
  try {
    table.style = 'Table Normal';
    const borders = ['Top', 'Bottom', 'Left', 'Right', 'InsideHorizontal', 'InsideVertical'];
    borders.forEach(b => {
      try {
        table.borders.getItem(b).type = 'None';
      } catch (e) {}
    });
  } catch (e) {
    console.warn("Could not hide table borders", e);
  }
};

const applyFontToTable = (table: any, font: any) => {
  try {
    if (font && font.name) table.font.name = font.name;
    if (font && font.size) table.font.size = font.size;
  } catch (e) {
    console.warn("Could not apply font to table", e);
  }
};

export const SUMMARY_CONFIG: Record<string, { label: string, columns: string[] }> = {
  personnel: { label: 'Nhân sự', columns: ['STT', 'Họ tên', 'Chức vụ', 'Đơn vị'] },
  materials: { label: 'Vật liệu', columns: ['STT', 'Tên vật tư', 'Xuất xứ', 'Nhà cung cấp', 'Khối lượng'] },
  equipment: { label: 'Máy móc', columns: ['STT', 'Tên thiết bị', 'Số hiệu', 'Ngày KĐ', 'Hạn KĐ'] },
  lab: { label: 'PTN', columns: ['STT', 'Tên PTN', 'Mã số', 'Hạn CC', 'Thiết bị'] },
  workitems: { label: 'Công việc', columns: ['STT', 'Nội dung công việc', 'Mã hiệu', 'Khối lượng', 'Đơn vị'] },
};

export const WordApiService = {
  fillDataToDocument: async () => {
    alert("Hệ thống đang chuẩn bị dữ liệu...");
    console.log("WordApiService: Starting fillDataToDocument...");
    
    if (!isWordApiAvailable()) {
      const msg = 'Chức năng này chỉ hoạt động khi mở trong Microsoft Word.';
      console.warn("WordApiService:", msg);
      alert(msg);
      return;
    }

    try {
      console.log("WordApiService: Fetching data from StorageService...");
      const participants = StorageService.get('hoso_participants') || {};
      const project = StorageService.getProject() || {};
      const materials = StorageService.get('hoso_materials') || [];
      const equipment = StorageService.get('hoso_equipment') || [];
      const labs = StorageService.get('hoso_labs') || [];
      const workItems = StorageService.getWorkItems() || [];

      const mat = materials[0] || {};
      const equip = equipment[0] || {};
      const lab = labs[0] || {};
      const work = workItems[0] || {};

      const allData: Record<string, string> = {
        projectName: project.name || '',
        contractNumber: project.contractNumber || '',
        packageName: project.packageName || '',
        contractor: project.contractor || '',
        investorRep: project.investor || '',
        designRep: project.designer || '',
        projectLocation: project.location || '',
        workName: work.name || '',
        workCode: work.code || '',
        workLine: work.line || '',
        workCategory: work.category || '',
        workQty: work.quantity?.toString() || '',
        workUnit: work.unit || '',
        workInspectDate: work.inspectionDate?.split('-').reverse().join('/') || '',
        matName: mat.name || '',
        matSource: mat.source || '',
        matLot: mat.lot || '',
        matQty: mat.qty?.toString() || '',
        equipName: equip.name || '',
        equipSerial: equip.serial || '',
        equipExpiry: equip.expiry || '',
        labName: lab.name || '',
        labCode: lab.code || '',
        labExpiry: lab.expiry || '',
        ...participants,
      };

      console.log("WordApiService: Data prepared, starting Word.run...");
      
      const projectData = StorageService.getProject() || {};
      const savedGroupsData = StorageService.get('hoso_participants_v2');
      const savedGroups = Array.isArray(savedGroupsData) ? savedGroupsData : [];

      // @ts-ignore
      await Word.run(async (context: any) => {
        console.log("WordApiService: Inside Word.run context");
        const ccs = context.document.contentControls;
        ccs.load('items/tag');
        await context.sync();
        
        let filledCount = 0;
        // 1. Fill normal text controls
        for (const item of ccs.items) {
          const val = allData[item.tag];
          if (val !== undefined && val !== '' && !item.tag.startsWith('table_') && !item.tag.startsWith('summary_')) {
            item.insertText(String(val), 'Replace');
            try {
              item.font.bold = null;
              item.font.italic = null;
              item.font.underline = 'None';
              item.font.color = 'Auto';
              item.font.size = null;
              item.font.name = null;
            } catch (e) {}
            filledCount++;
          }
        }

        console.log(`WordApiService: Filled ${filledCount} text controls`);

      // 2. Refresh dynamic participant tables
      const roleTags = ['table_cdt', 'table_tc', 'table_tv'];
      let tablesRefreshed = 0;

      for (const tag of roleTags) {
        const role = tag.replace('table_', '') as 'cdt' | 'tc' | 'tv';
        const foundTables = ccs.items.filter((cc: any) => cc.tag === tag);
        if (foundTables.length === 0) continue;

        const isJV = role === 'tc' && projectData.isJointVenture && projectData.contractorMembers?.length;
        
        for (const wrapper of foundTables) {
          wrapper.clear();
          // FIX: Sync after clear to ensure DOM is ready for new table
          await context.sync();
          
          if (isJV) {
            const members = projectData.contractorMembers || [];
            const colCount = members.length;
            const memberSigners = members.map((_: any, idx: number) => {
              const group = savedGroups.find((g: any) => g.prefix === `tc_ld${idx + 1}`);
              return (group && Array.isArray(group.signers)) ? group.signers : [];
            });
            const maxSigners = Math.max(...memberSigners.map((s: any) => s.length), 1);
            const rowCount = maxSigners * 2 + 1;

            const table = wrapper.insertTable(rowCount, colCount, 'Start');
            hideTableBorders(table);

            for (let c = 0; c < colCount; c++) {
              const cell = table.getCell(0, c);
              cell.body.insertText(members[c], 'Replace');
              cell.body.paragraphs.getFirst().font.bold = true;
            }

            for (let r = 0; r < maxSigners; r++) {
              for (let c = 0; c < colCount; c++) {
                const signersOfMember = memberSigners[c];
                const s: any = (signersOfMember && signersOfMember[r]) ? signersOfMember[r] : { name: '', position: '', gender: 'auto' };
                const prefix = `tc_ld${c + 1}`;
                
                const nameCell = table.getCell(r * 2 + 1, c);
                const honorific = resolveGender(s?.name || '', s?.gender) + ': ';
                nameCell.body.insertText(honorific, 'Replace');
                const nameCC = nameCell.body.getRange('End').insertContentControl();
                nameCC.title = `${members[c]} - Người ${r + 1} - Tên`;
                nameCC.tag = `${prefix}_s${r + 1}_name`;
                nameCC.placeholderText = '[Họ tên]';
                nameCC.appearance = 'BoundingBox';
                if (s?.name) nameCC.insertText(s.name, 'Replace');

                const posCell = table.getCell(r * 2 + 2, c);
                posCell.body.insertText('Chức vụ: ', 'Replace');
                const posCC = posCell.body.getRange('End').insertContentControl();
                posCC.title = `${members[c]} - Người ${r + 1} - Chức vụ`;
                posCC.tag = `${prefix}_s${r + 1}_pos`;
                posCC.placeholderText = '[Chức vụ]';
                posCC.appearance = 'BoundingBox';
                if (s?.position) posCC.insertText(s.position, 'Replace');
              }
            }
          } else {
            const group = savedGroups.find((g: any) => g.prefix === role);
            const signersRaw = (group && Array.isArray(group.signers)) ? group.signers : [];
            const rowCount = Math.max(signersRaw.length, (role === 'tc' ? 3 : 2));
            const actualSigners = signersRaw.length > 0 ? signersRaw : Array(rowCount).fill(null).map(() => ({ name: '', position: '', gender: 'auto' }));

            const table = wrapper.insertTable(rowCount, 2, 'Start');
            hideTableBorders(table);

            for (let i = 0; i < rowCount; i++) {
              const s = actualSigners[i] || { name: '', position: '', gender: 'auto' };
              const honorific = resolveGender(s.name || '', s.gender) + ': ';
              const nameCell = table.getCell(i, 0);
              nameCell.body.insertText(honorific, 'Replace');
              const nameCC = nameCell.body.getRange('End').insertContentControl();
              nameCC.title = `${role.toUpperCase()} ${i + 1} - Tên`;
              nameCC.tag = `${role}${i + 1}_name`;
              nameCC.placeholderText = '[Họ tên]';
              nameCC.appearance = 'BoundingBox';
              if (s.name) nameCC.insertText(s.name, 'Replace');

              const posCell = table.getCell(i, 1);
              posCell.body.insertText('Chức vụ: ', 'Replace');
              const posCC = posCell.body.getRange('End').insertContentControl();
              posCC.title = `${role.toUpperCase()} ${i + 1} - Chức vụ`;
              posCC.tag = `${role}${i + 1}_pos`;
              posCC.placeholderText = '[Chức vụ]';
              posCC.appearance = 'BoundingBox';
              if (s.position) posCC.insertText(s.position, 'Replace');
            }
          }
          tablesRefreshed++;
        }
      }

      // 3. Refresh summary tables
      const summaryTags = Object.keys(SUMMARY_CONFIG).map(k => `summary_${k}`);
      for (const tag of summaryTags) {
        const type = tag.replace('summary_', '');
        const foundSummaries = ccs.items.filter((cc: any) => cc.tag === tag);
        if (foundSummaries.length === 0) continue;

        const config = SUMMARY_CONFIG[type];
        let dataList: any[] = [];
        if (type === 'personnel') dataList = StorageService.get('hoso_personnel') || [];
        if (type === 'materials') dataList = StorageService.get('hoso_materials') || [];
        if (type === 'equipment') dataList = StorageService.get('hoso_equipment') || [];
        if (type === 'lab') dataList = StorageService.get('hoso_labs') || [];
        if (type === 'workitems') dataList = StorageService.getWorkItems() || [];
        
        const rowCount = dataList.length + 1;
        for (const wrapper of foundSummaries) {
          wrapper.clear();
          await context.sync();
          const table = wrapper.insertTable(rowCount, config.columns.length, 'Start');
          table.style = 'Table Normal';
          config.columns.forEach((col, i) => {
            const cell = table.getCell(0, i);
            cell.body.insertText(col, 'Replace');
            cell.body.paragraphs.getFirst().font.bold = true;
            cell.shadingColor = '#F3F4F6';
          });
          dataList.forEach((item, rIdx) => {
            const row = rIdx + 1;
            table.getCell(row, 0).body.insertText((rIdx + 1).toString(), 'Replace');
            if (type === 'personnel') {
              table.getCell(row, 1).body.insertText(item.name || '', 'Replace');
              table.getCell(row, 2).body.insertText(item.position || '', 'Replace');
              table.getCell(row, 3).body.insertText(item.unit || '', 'Replace');
            }
            if (type === 'materials') {
              table.getCell(row, 1).body.insertText(item.name || '', 'Replace');
              table.getCell(row, 2).body.insertText(item.origin || '', 'Replace');
              table.getCell(row, 3).body.insertText(item.supplier || '', 'Replace');
              table.getCell(row, 4).body.insertText(item.qty?.toString() || '', 'Replace');
            }
            if (type === 'equipment') {
              table.getCell(row, 1).body.insertText(item.name || '', 'Replace');
              table.getCell(row, 2).body.insertText(item.serial || '', 'Replace');
              table.getCell(row, 3).body.insertText(item.inspectionDate?.split('-').reverse().join('/') || '', 'Replace');
              table.getCell(row, 4).body.insertText(item.expiryDate?.split('-').reverse().join('/') || '', 'Replace');
            }
            if (type === 'workitems') {
              table.getCell(row, 1).body.insertText(item.name || '', 'Replace');
              table.getCell(row, 2).body.insertText(item.code || '', 'Replace');
              table.getCell(row, 3).body.insertText(item.quantity?.toString() || '', 'Replace');
              table.getCell(row, 4).body.insertText(item.unit || '', 'Replace');
            }
            if (type === 'lab') {
              table.getCell(row, 1).body.insertText(item.name || '', 'Replace');
              table.getCell(row, 2).body.insertText(item.code || '', 'Replace');
              table.getCell(row, 3).body.insertText(item.expiry || '', 'Replace');
              table.getCell(row, 4).body.insertText(item.equipment || '', 'Replace');
            }
          });
          tablesRefreshed++;
        }
      }

      await context.sync();
      let resultMsg = `Đã cập nhật ${filledCount} trường dữ liệu`;
      if (tablesRefreshed > 0) resultMsg += ` và làm mới ${tablesRefreshed} bảng dữ liệu`;
      console.log("WordApiService: Success! " + resultMsg);
      alert(resultMsg + '!');
    }).catch((err: any) => {
      console.error("WordApiService error in Word.run:", err);
      alert('Lỗi Word API: ' + err.message);
    });
    } catch (err: any) {
      console.error("WordApiService critical error:", err);
      alert('Lỗi hệ thống: ' + err.message);
    }
  },

  insertContentControl: async (id: string, label: string) => {
    if (!isWordApiAvailable()) {
      alert(`Chức năng này chỉ hoạt động khi mở trong Microsoft Word.\n\nTag sẽ chèn: ${id}`);
      return;
    }
    // @ts-ignore
    await Word.run(async (context: any) => {
      const range = context.document.getSelection();
      const cc = range.insertContentControl();
      cc.title = label;
      cc.tag = id;
      cc.placeholderText = `[${label}]`;
      cc.appearance = 'BoundingBox';
      await context.sync();
      cc.getRange('After').select();
      await context.sync();
    }).catch((err: any) => {
      console.error(err);
      alert('Lỗi khi chèn Content Control vào Word: ' + err.message);
    });
  },

  insertSummaryTable: async (type: string) => {
    if (!isWordApiAvailable()) {
      alert('Chức năng này chỉ hoạt động trong Word.');
      return;
    }
    const config = SUMMARY_CONFIG[type];
    // @ts-ignore
    await Word.run(async (context: any) => {
      const range = context.document.getSelection();
      const wrapper = range.insertContentControl();
      wrapper.tag = `summary_${type}`;
      wrapper.title = `Bảng Tổng hợp ${config.label}`;
      wrapper.appearance = 'BoundingBox';

      const table = wrapper.insertTable(2, config.columns.length, 'Start');
      table.style = 'Table Normal';
      
      config.columns.forEach((col, i) => {
        const cell = table.getCell(0, i);
        cell.body.insertText(col, 'Replace');
        cell.body.paragraphs.getFirst().font.bold = true;
        cell.shadingColor = '#F3F4F6';
      });

      await context.sync();
      wrapper.getRange('After').select();
      await context.sync();
      alert(`Đã chèn khung Bảng ${config.label}. Nhấn nút "Cập nhật dữ liệu" để đổ dữ liệu vào bảng.`);
    }).catch((err: any) => alert('Lỗi chèn bảng tổng hợp: ' + err.message));
  },

  insertParticipantTable: async (role: string) => {
    if (!isWordApiAvailable()) {
      alert('Chức năng này chỉ hoạt động khi mở trong Microsoft Word.');
      return;
    }
    
    const project = StorageService.getProject() || {};
    const savedGroupsData = StorageService.get('hoso_participants_v2');
    const savedGroups = Array.isArray(savedGroupsData) ? savedGroupsData : [];
    const isJV = role === 'tc' && project.isJointVenture && project.contractorMembers?.length;

    // @ts-ignore
    await Word.run(async (context: any) => {
      const range = context.document.getSelection();
      
      let currentFont: any = null;
      try {
        range.load('font/name,font/size');
        await context.sync();
        currentFont = range.font;
      } catch (e) {}

      let insertedTable: any = null;
      if (isJV) {
        const members = project.contractorMembers || [];
        const colCount = members.length;
        const memberSigners = members.map((_: any, idx: number) => {
          const group = savedGroups.find((g: any) => g.prefix === `tc_ld${idx + 1}`);
          return (group && Array.isArray(group.signers)) ? group.signers : [];
        });
        const maxSigners = Math.max(...memberSigners.map((s: any) => s.length), 1);
        const rowCount = maxSigners * 2 + 1;

        insertedTable = range.insertTable(rowCount, colCount, 'After');
        applyFontToTable(insertedTable, currentFont);
        hideTableBorders(insertedTable);

        for (let c = 0; c < colCount; c++) {
          const cell = insertedTable.getCell(0, c);
          cell.body.insertText(members[c], 'Replace');
          cell.body.paragraphs.getFirst().font.bold = true;
        }

        for (let r = 0; r < maxSigners; r++) {
          for (let c = 0; c < colCount; c++) {
            const signersOfMember = memberSigners[c];
            const s: any = (signersOfMember && signersOfMember[r]) ? signersOfMember[r] : { name: '', position: '', gender: 'auto' };
            const prefix = `tc_ld${c + 1}`;
            
            const nameCell = insertedTable.getCell(r * 2 + 1, c);
            const honorific = resolveGender(s?.name || '', s?.gender) + ': ';
            nameCell.body.insertText(honorific, 'Replace');
            const nameCC = nameCell.body.getRange('End').insertContentControl();
            nameCC.title = `${members[c]} - Người ${r + 1} - Tên`;
            nameCC.tag = `${prefix}_s${r + 1}_name`;
            nameCC.placeholderText = '[Họ tên]';
            nameCC.appearance = 'BoundingBox';
            if (s?.name) nameCC.insertText(s.name, 'Replace');
            else nameCC.insertText('..............................', 'Replace');

            const posCell = insertedTable.getCell(r * 2 + 2, c);
            posCell.body.insertText('Chức vụ: ', 'Replace');
            const posCC = posCell.body.getRange('End').insertContentControl();
            posCC.title = `${members[c]} - Người ${r + 1} - Chức vụ`;
            posCC.tag = `${prefix}_s${r + 1}_pos`;
            posCC.placeholderText = '[Chức vụ]';
            posCC.appearance = 'BoundingBox';
            if (s?.position) posCC.insertText(s.position, 'Replace');
            else posCC.insertText('..............................', 'Replace');
          }
        }
      } else {
        const group = savedGroups.find((g: any) => g.prefix === role);
        const signersRaw = (group && Array.isArray(group.signers)) ? group.signers : [];
        const signersCount = Math.max(signersRaw.length, (role === 'tc' ? 3 : 2));
        const rowCount = Math.max(signersCount, 1);
        const signers: any[] = signersRaw.length > 0 ? signersRaw : Array(rowCount).fill(null).map(() => ({ name: '', position: '', gender: 'auto' }));

        insertedTable = range.insertTable(rowCount, 2, 'After');
        applyFontToTable(insertedTable, currentFont);
        hideTableBorders(insertedTable);
        
        for (let i = 0; i < rowCount; i++) {
          const s = signers[i] || { name: '', position: '', gender: 'auto' };
          const honorific = resolveGender(s.name || '', s.gender) + ': ';
          const nameCell = insertedTable.getCell(i, 0);
          nameCell.body.insertText(honorific, 'Replace');
          const nameCC = nameCell.body.getRange('End').insertContentControl();
          nameCC.title = `${role.toUpperCase()} ${i + 1} - Tên`;
          nameCC.tag = `${role}${i + 1}_name`;
          nameCC.placeholderText = '[Họ tên]';
          nameCC.appearance = 'BoundingBox';
          if (s.name) nameCC.insertText(s.name, 'Replace');
          else nameCC.insertText('..............................', 'Replace');

          const posCell = insertedTable.getCell(i, 1);
          posCell.body.insertText('Chức vụ: ', 'Replace');
          const posCC = posCell.body.getRange('End').insertContentControl();
          posCC.title = `${role.toUpperCase()} ${i + 1} - Chức vụ`;
          posCC.tag = `${role}${i + 1}_pos`;
          posCC.placeholderText = '[Chức vụ]';
          posCC.appearance = 'BoundingBox';
          if (s.position) posCC.insertText(s.position, 'Replace');
          else posCC.insertText('..............................', 'Replace');
        }
      }

      await context.sync();
      if (insertedTable) {
        insertedTable.getRange('After').select();
        await context.sync();
      }
      alert(`Đã chèn Bảng ${role.toUpperCase()} thành công!`);
    }).catch((err: any) => {
      console.error('Lỗi Word API:', err);
      alert('Lỗi Word API: ' + (err.message || 'Không xác định'));
    });
  }
};
