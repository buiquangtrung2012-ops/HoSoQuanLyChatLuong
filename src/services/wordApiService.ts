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
    try {
      table.style = 'Table Normal';
    } catch (e) {}
    
    const borders = ['Top', 'Bottom', 'Left', 'Right', 'InsideHorizontal', 'InsideVertical'];
    borders.forEach(b => {
      try {
        const border = table.borders.getItem(b);
        if (border) border.type = 'None';
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
  fillDataToDocument: async (onStatus?: (msg: string) => void) => {
    if (onStatus) onStatus("Đang chuẩn bị dữ liệu...");
    console.log("WordApiService: Starting fillDataToDocument...");
    
    if (!isWordApiAvailable()) {
      const msg = 'Chức năng này chỉ hoạt động khi mở trong Microsoft Word.';
      console.warn("WordApiService:", msg);
      if (onStatus) onStatus(msg);
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

      if (onStatus) onStatus("Đang đồng bộ với Word...");

      console.log("WordApiService: Data prepared, starting Word.run...");
      
      const projectData = StorageService.getProject() || {};
      const savedGroupsData = StorageService.get('hoso_participants_v2');
      const savedGroups = Array.isArray(savedGroupsData) ? savedGroupsData : [];

      // @ts-ignore
      await Word.run(async (context: any) => {
        console.log("WordApiService: Inside Word.run context");
        
        // 1. Collect all Content Controls from all parts of the document
        const allCCItems: any[] = [];
        const bodyCCs = context.document.contentControls;
        bodyCCs.load('items/tag,items/title,items/cannotEdit');
        const sections = context.document.sections;
        sections.load('items');
        await context.sync();
        
        allCCItems.push(...bodyCCs.items);

        for (let i = 0; i < sections.items.length; i++) {
          try {
            const section = sections.items[i];
            const hfTypes: any[] = ['Primary', 'FirstPage', 'EvenPages'];
            for (const type of hfTypes) {
              const hccs = section.headers.getHeader(type).contentControls;
              const fccs = section.footers.getFooter(type).contentControls;
              hccs.load('items/tag,items/title,items/cannotEdit');
              fccs.load('items/tag,items/title,items/cannotEdit');
              await context.sync();
              allCCItems.push(...hccs.items, ...fccs.items);
            }
          } catch (e) {
            console.warn("WordApiService: Section skip", e);
          }
        }

        const allCCs = allCCItems;
        if (onStatus) onStatus(`Tìm thấy ${allCCs.length} vị trí dữ liệu...`);
        let filledCount = 0;
        let tablesRefreshed = 0;
        
        // 1. Fill normal text controls - Using a safer one-by-one or small-batch approach
        // for these critical fields to ensure we don't crash on the first error.
        for (const item of allCCs) {
          const val = allData[item.tag];
          const isTableOrSummary = item.tag.startsWith('table_') || item.tag.startsWith('summary_');
          
          if (val !== undefined && val !== '' && !isTableOrSummary) {
            try {
              // PROACTIVE CHECKS: Skip locked or incompatible controls
              if (item.cannotEdit) {
                console.warn(`WordApiService: Skipping locked CC: ${item.tag}`);
                continue;
              }
              if (item.type === 'Group') {
                console.warn(`WordApiService: Skipping Group CC: ${item.tag}`);
                continue;
              }

              item.insertText(String(val), 'Replace');
              
              try {
                // Formatting reset is optional and can fail separately
                item.font.bold = null;
                item.font.italic = null;
                item.font.underline = 'None';
                item.font.color = 'Auto';
              } catch (fErr) {}

              // IMPORTANT: We must sync frequently to catch errors locally.
              // For text fields, we sync every item to be 100% safe against "InvalidArgument" 
              // halting the whole loop. The overhead is acceptable for 20-50 fields.
              await context.sync();
              filledCount++;
            } catch (itemErr: any) {
              console.warn(`WordApiService: Failed to fill [${item.tag}]: ${itemErr.message}`);
              // Error is now caught here, loop WILL continue to the next item.
            }
          }
        }

        console.log(`WordApiService: Finished filling ${filledCount} text controls`);

        // 2. Refresh dynamic participant tables
        const allTableCCs = allCCs.filter((cc: any) => cc.tag && cc.tag.startsWith('table_'));

        for (const wrapper of allTableCCs) {
          try {
            const tag = wrapper.tag;
            const role = tag.replace('table_', '');
            
            // Find group data
            const group = savedGroups.find((g: any) => g.prefix === role);
            if (!group || !group.signers) {
              console.log(`WordApiService: No data for table tag ${tag}, skipping.`);
              continue;
            }

            if (onStatus) onStatus(`Đang làm mới bảng: ${role.toUpperCase()}...`);

            // Temporarily unlock if locked
            const originalLock = wrapper.cannotEdit;
            if (originalLock) wrapper.cannotEdit = false;

            // Aggressive clear: remove all content and then specifically check for tables
            wrapper.clear();
            const internalTables = wrapper.body.tables;
            internalTables.load('items');
            await context.sync();
            
            if (internalTables.items.length > 0) {
              console.log(`WordApiService: Deleting ${internalTables.items.length} residual tables in ${tag}`);
              internalTables.items.forEach((t: Word.Table) => t.delete());
              await context.sync();
            }
            
            const isJV = role === 'tc' && projectData.isJointVenture && projectData.contractorMembers?.length;
            
            if (isJV) {
              if (onStatus) onStatus(`Đang đổ bảng Liên danh (${role.toUpperCase()})...`);
              const members = projectData.contractorMembers || [];
              const colCount = members.length;
              if (colCount === 0) continue;

              const memberSigners = members.map((_: any, idx: number) => {
                const g = savedGroups.find((gr: any) => gr.prefix === `tc_ld${idx + 1}`);
                return (g && Array.isArray(g.signers)) ? g.signers : [];
              });
              const maxSigners = Math.max(...memberSigners.map((s: any) => s.length), 1);
              const rowCount = maxSigners * 2 + 1;

              const table = wrapper.insertTable(rowCount, colCount, 'Start');
              hideTableBorders(table);

              for (let c = 0; c < colCount; c++) {
                const cell = table.getCell(0, c);
                cell.body.insertText(members[c], 'Replace');
                cell.body.paragraphs.getFirst().font.bold = true;
                cell.body.paragraphs.getFirst().alignment = 'Center';
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
              const signersRaw = group.signers;
              const minRows = (role === 'tc' || role === 'tv') ? 3 : 2;
              const rowCount = Math.max(signersRaw.length, minRows);
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

            // Restore lock if needed
            if (originalLock) wrapper.cannotEdit = true;
            
            tablesRefreshed++;
            await context.sync();
          } catch (tableErr: any) {
            console.warn(`Error refreshing table ${wrapper.tag}:`, tableErr);
          }
        }

        // 3. Refresh summary tables
        const summaryTags = Object.keys(SUMMARY_CONFIG).map(k => `summary_${k}`);
        for (const tag of summaryTags) {
          try {
            const type = tag.replace('summary_', '');
            const foundSummaries = allCCs.filter((cc: any) => cc.tag === tag);
            if (foundSummaries.length === 0) continue;

            const config = SUMMARY_CONFIG[type];
            if (onStatus) onStatus(`Đang đổ bảng tổng hợp: ${config.label}...`);
            
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
              try {
                table.style = 'Table Normal';
              } catch (e) {}
              
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
          } catch (summaryErr: any) {
            console.warn(`Error refreshing summary ${tag}:`, summaryErr);
          }
        }

        await context.sync();
        let resultMsg = `Thành công! Đã cập nhật ${filledCount} trường`;
        if (tablesRefreshed > 0) resultMsg += ` và ${tablesRefreshed} bảng`;
        console.log("WordApiService: Success! " + resultMsg);
        if (onStatus) onStatus(resultMsg);
      }).catch((err: any) => {
        console.error("WordApiService error in Word.run:", err);
        if (onStatus) onStatus('Lỗi Word API: ' + err.message);
      });
    } catch (err: any) {
      console.error("WordApiService critical error:", err);
      if (onStatus) onStatus('Lỗi hệ thống: ' + err.message);
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
      try {
        table.style = 'Table Normal';
      } catch (e) {}
      
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
    }).catch((err: any) => {
      console.error('Lỗi Word API:', err);
      alert('Lỗi Word API: ' + (err.message || 'Không xác định'));
    });
  }
};

(window as any).WordApiService = WordApiService;
