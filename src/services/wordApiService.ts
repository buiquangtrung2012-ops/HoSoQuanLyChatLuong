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

// ---- Helper định dạng ngày tháng tiếng Việt ----
export const formatVietnameseDate = (dateStr: string): string => {
  if (!dateStr) return 'ngày ... tháng ... năm ...';
  // Input expected: yyyy-mm-dd or dd/mm/yyyy
  let d, m, y;
  if (dateStr.includes('-')) {
    [y, m, d] = dateStr.split('-');
  } else if (dateStr.includes('/')) {
    [d, m, y] = dateStr.split('/');
  } else {
    return dateStr;
  }
  return `ngày ${d.padStart(2, '0')} tháng ${m.padStart(2, '0')} năm ${y}`;
};

export const formatDateDMY = (dateStr: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  if (dateStr.includes('/')) return dateStr;
  return dateStr;
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
    if (!font) return;

    if (font.name) table.font.name = font.name;
    if (font.size) table.font.size = font.size;
    if (font.bold !== undefined) table.font.bold = font.bold;
    if (font.italic !== undefined) table.font.italic = font.italic;
    if (font.color) table.font.color = font.color;
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
        supervisorRep: project.supervisor || '',
        designRep: project.designer || '',
        projectLocation: project.location || '',
        workName: work.name || '',
        workCode: work.code || '',
        workLine: work.line || '',
        workCategory: work.category || '',
        workQty: work.quantity?.toString() || '',
        workUnit: work.unit || '',
        workRequestDate: formatDateDMY(work.requestDate || ''),
        workRequestDateVN: formatVietnameseDate(work.requestDate || ''),
        workInspectDate: formatDateDMY(work.inspectionDate || ''),
        workInspectDateVN: formatVietnameseDate(work.inspectionDate || ''),
        // Project dates
        projectStart: formatDateDMY(project.startDate || ''),
        projectStartVN: formatVietnameseDate(project.startDate || ''),
        projectEnd: formatDateDMY(project.endDate || ''),
        projectEndVN: formatVietnameseDate(project.endDate || ''),
        matName: mat.name || '',
        matSource: mat.source || '',
        matLot: mat.lot || '',
        matQty: mat.qty?.toString() || '',
        equipName: equip.name || '',
        equipSerial: equip.serial || '',
        equipExpiry: formatDateDMY(equip.expiry || ''),
        equipExpiryVN: formatVietnameseDate(equip.expiry || ''),
        labName: lab.name || '',
        labCode: lab.code || '',
        labExpiry: formatDateDMY(lab.expiry || ''),
        labExpiryVN: formatVietnameseDate(lab.expiry || ''),
        ...participants,
      };

      // Add all project properties directly as tags (e.g. investor, designer, etc.)
      Object.keys(project).forEach(key => {
        if (typeof project[key] === 'string' || typeof project[key] === 'number') {
          const sVal = String(project[key]);
          allData[key] = sVal;
          allData[key.toLowerCase()] = sVal;
          allData[`project_${key}`] = sVal;
        }
      });

      // Add all work properties directly as tags
      Object.keys(work).forEach(key => {
        if (typeof work[key] === 'string' || typeof work[key] === 'number') {
          const sVal = String(work[key]);
          allData[key] = sVal;
          allData[key.toLowerCase()] = sVal;
          allData[`work_${key}`] = sVal;
        }
      });

      // Add personnel by title mapping (e.g. title_Chỉ Huy Trưởng -> "Nguyễn Văn A")
      const allPersonnel = StorageService.get('hoso_personnel') || [];
      allPersonnel.forEach((p: any) => {
        if (p.position) {
          const titleTag = `title_${p.position.trim()}`;
          const sName = p.name || '';
          allData[titleTag] = sName;
          allData[titleTag.toLowerCase()] = sName;
          // Also add honorific version
          const honorific = resolveGender(sName, p.gender);
          allData[`${titleTag}_full`] = `${honorific} ${sName}`;
          allData[`${titleTag.toLowerCase()}_full`] = `${honorific} ${sName}`;
        }
      });

      console.log("WordApiService: Final allData keys count:", Object.keys(allData).length);
      (window as any).lastAllData = allData;

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
        // 1. Fill normal text controls
        for (const item of allCCs) {
          const tag = item.tag;
          if (!tag) continue;
          
          let val = allData[tag];
          // Try case-insensitive fallback
          if (val === undefined) val = allData[tag.toLowerCase()];
          
          const isTableOrSummary = tag.startsWith('table_') || tag.startsWith('summary_');
          
          if (val !== undefined && val !== null && val !== '' && !isTableOrSummary) {
            try {
              // Temporarily unlock if locked
              const originalLock = item.cannotEdit;
              if (originalLock) item.cannotEdit = false;

              item.insertText(String(val), 'Replace');
              
              if (originalLock) item.cannotEdit = true;

              // Batch sync for performance and reliability
              if (filledCount % 10 === 0) await context.sync();
              filledCount++;
            } catch (itemErr: any) {
              console.warn(`WordApiService: Error filling [${tag}]:`, itemErr);
            }
          }
        }
        await context.sync();

        console.log(`WordApiService: Finished filling ${filledCount} text controls`);

        // 2. Refresh dynamic participant tables
        const allTableCCs = allCCs.filter((cc: any) => cc.tag && cc.tag.startsWith('table_'));


        for (const wrapper of allTableCCs) {
          let currentFont: any = null;
          try {
            const wrapperRange = wrapper.getRange();
            wrapperRange.load('font/name,font/size,font/bold,font/italic,font/color');
            await context.sync();

            currentFont = {
              name: wrapperRange.font.name,
              size: wrapperRange.font.size,
              bold: wrapperRange.font.bold,
              italic: wrapperRange.font.italic,
              color: wrapperRange.font.color
            };

            // Fix: If current font size is 1 (our wrapper hack), get font from preceding paragraph
            if (!currentFont.size || currentFont.size <= 2) {
               try {
                  const prevRange = wrapper.getRange('Before').paragraphs.getFirst().getRange();
                  prevRange.load('font/name,font/size,font/bold,font/italic,font/color');
                  await context.sync();
                  currentFont = {
                      name: prevRange.font.name,
                      size: prevRange.font.size,
                      bold: prevRange.font.bold,
                      italic: prevRange.font.italic,
                      color: prevRange.font.color
                  };
               } catch (e) {}
            }
            if (!currentFont.size || currentFont.size <= 2) currentFont.size = 13;
          } catch (e) {
            console.warn('Cannot get wrapper font', e);
          }
          
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
            
            // Hide placeholder text
            wrapper.placeholderText = ' ';

            // Sequence change: Clear then insert (with explicit paragraph font fix)
            wrapper.clear();
            await context.sync();
            
            const isJV = role === 'tc' && projectData.isJointVenture && projectData.contractorMembers?.length;
            let table: Word.Table;
            
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

              // Set wrapper font size to 1pt to minimize newline space
              wrapper.font.size = 1;

              table = wrapper.insertTable(rowCount, colCount, 'Start');
              await context.sync();
              
              // Only shrink the trailing empty paragraph in the wrapper
              const paras = wrapper.paragraphs;
              paras.load('items');
              await context.sync();
              if (paras.items.length > 0) {
                paras.items[paras.items.length - 1].font.size = 1;
              }

              applyFontToTable(table, currentFont);
              hideTableBorders(table);

              for (let c = 0; c < colCount; c++) {
                const cell = table.getCell(0, c);
                cell.body.insertText(members[c], 'Replace');
                cell.body.paragraphs.getFirst().font.bold = true;
                cell.body.paragraphs.getFirst().alignment = 'Centered';
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
                  else nameCC.insertText('..............................', 'Replace');

                  const posCell = table.getCell(r * 2 + 2, c);
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
              const signersRaw = group.signers || [];
              const rowCount = Math.max(signersRaw.length, 1);
              const actualSigners = signersRaw.length > 0 ? signersRaw : [{ name: '', position: '', gender: 'auto' }];

              // Set wrapper font size to 1pt to minimize newline space
              wrapper.font.size = 1;

              table = wrapper.insertTable(rowCount, 2, 'Start');
              await context.sync();
              
              // Only shrink the trailing empty paragraph in the wrapper
              const paras = wrapper.paragraphs;
              paras.load('items');
              await context.sync();
              if (paras.items.length > 0) {
                paras.items[paras.items.length - 1].font.size = 1;
              }

              applyFontToTable(table, currentFont);
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
                else nameCC.insertText('..............................', 'Replace');

                const posCell = table.getCell(i, 1);
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

            // Restore lock if needed
            if (originalLock) wrapper.cannotEdit = true;
            
            tablesRefreshed++;
            await context.sync();
          } catch (tableErr: any) {
            console.warn(`Error refreshing table ${wrapper.tag}:`, tableErr);
          }
        }

        // 3. Refresh summary tables
        const summaryTags = allCCs.filter((cc: any) => cc.tag && cc.tag.startsWith('summary_')).map((cc: any) => cc.tag);
        const uniqueSummaryTags = Array.from(new Set(summaryTags));
        
        for (const tag of uniqueSummaryTags as string[]) {
          try {
            const fullType = tag.replace('summary_', '');
            const type = fullType.startsWith('personnel_') ? 'personnel' : fullType;
            const unitName = fullType.startsWith('personnel_') ? fullType.replace('personnel_', '') : '';
            
            if (!SUMMARY_CONFIG[type]) continue;
            const config = SUMMARY_CONFIG[type];

            const foundSummaries = allCCs.filter((cc: any) => cc.tag === tag);
            if (foundSummaries.length === 0) continue;

            if (onStatus) onStatus(`Đang đổ bảng tổng hợp: ${config.label}...`);
            
            let dataList: any[] = [];
            if (type === 'personnel') {
                let pData = StorageService.get('hoso_personnel') || [];
                if (unitName) {
                    pData = pData.filter((item: any) => item.unit === unitName);
                }
                dataList = pData;
            }
            if (type === 'materials') dataList = StorageService.get('hoso_materials') || [];
            if (type === 'equipment') dataList = StorageService.get('hoso_equipment') || [];
            if (type === 'lab') dataList = StorageService.get('hoso_labs') || [];
            if (type === 'workitems') dataList = StorageService.getWorkItems() || [];
            
            const rowCount = dataList.length + 1;
            for (const wrapper of foundSummaries) {
              let currentFont: any = null;
              try {
                const wrapperRange = wrapper.getRange();
                wrapperRange.load('font/name,font/size,font/bold,font/italic,font/color');
                await context.sync();
                currentFont = {
                  name: wrapperRange.font.name,
                  size: wrapperRange.font.size,
                  bold: wrapperRange.font.bold,
                  italic: wrapperRange.font.italic,
                  color: wrapperRange.font.color
                };

                // Fix: If font size is 1, get from preceding paragraph
                if (!currentFont.size || currentFont.size <= 2) {
                   try {
                      const prevRange = wrapper.getRange('Before').paragraphs.getFirst().getRange();
                      prevRange.load('font/name,font/size,font/bold,font/italic,font/color');
                      await context.sync();
                      currentFont = {
                          name: prevRange.font.name,
                          size: prevRange.font.size,
                          bold: prevRange.font.bold,
                          italic: prevRange.font.italic,
                          color: prevRange.font.color
                      };
                   } catch (e) {}
                }
                if (!currentFont.size || currentFont.size <= 2) currentFont.size = 13;
              } catch (e) {
                console.warn('Cannot get wrapper font', e);
              }

              wrapper.clear();
              await context.sync();

              wrapper.font.size = 1;

              const table = wrapper.insertTable(rowCount, config.columns.length, 'Start');
              try { table.style = 'Table Normal'; } catch(e){}
              await context.sync();

              const paras = wrapper.paragraphs;
              paras.load('items');
              await context.sync();
              if (paras.items.length > 0) {
                paras.items[paras.items.length - 1].font.size = 1;
              }

              // Apply formatting to existing table (if any) or new table
              applyFontToTable(table, currentFont);
              table.font.bold = false;
              
              // Apply column widths and alignments
              try {
                table.preferredWidthType = 'Percent';
                table.preferredWidth = 100;
                table.columns.load('items');
                await context.sync();
                
                table.columns.getItemAt(0).preferredWidth = 7; // STT
                if (type === 'personnel') {
                  table.columns.getItemAt(1).preferredWidth = 45;
                  table.columns.getItemAt(2).preferredWidth = 24;
                  table.columns.getItemAt(3).preferredWidth = 24;
                } else if (type === 'materials') {
                  table.columns.getItemAt(1).preferredWidth = 45;
                  table.columns.getItemAt(2).preferredWidth = 18;
                  table.columns.getItemAt(3).preferredWidth = 20;
                  table.columns.getItemAt(4).preferredWidth = 10;
                } else if (type === 'equipment') {
                  table.columns.getItemAt(1).preferredWidth = 45;
                  table.columns.getItemAt(2).preferredWidth = 18;
                  table.columns.getItemAt(3).preferredWidth = 15;
                  table.columns.getItemAt(4).preferredWidth = 15;
                } else if (type === 'lab') {
                  table.columns.getItemAt(1).preferredWidth = 45;
                  table.columns.getItemAt(2).preferredWidth = 15;
                  table.columns.getItemAt(3).preferredWidth = 15;
                  table.columns.getItemAt(4).preferredWidth = 18;
                } else if (type === 'workitems') {
                  table.columns.getItemAt(1).preferredWidth = 50;
                  table.columns.getItemAt(2).preferredWidth = 18;
                  table.columns.getItemAt(3).preferredWidth = 12;
                  table.columns.getItemAt(4).preferredWidth = 13;
                }
                
                // Force each cell in first column to be small
                for (let r = 0; r < rowCount; r++) {
                   table.getCell(r, 0).preferredWidth = 7;
                }
                
                await context.sync();
              } catch (e) {}

              config.columns.forEach((col, i) => {
                const cell = table.getCell(0, i);
                cell.body.insertText(col, 'Replace');
                cell.body.paragraphs.getFirst().font.bold = true;
                cell.body.paragraphs.getFirst().alignment = 'Centered';
                cell.shadingColor = '#F3F4F6';
              });

              dataList.forEach((item: any, rIdx: number) => {
                const row = rIdx + 1;
                const sttCell = table.getCell(row, 0);
                sttCell.body.insertText((rIdx + 1).toString(), 'Replace');
                sttCell.body.paragraphs.getFirst().alignment = 'Centered';
                
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
                  table.getCell(row, 3).body.insertText(formatDateDMY(item.lastCheck || ''), 'Replace');
                  table.getCell(row, 4).body.insertText(formatDateDMY(item.expiry || ''), 'Replace');
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
                  table.getCell(row, 3).body.insertText(formatDateDMY(item.expiry || ''), 'Replace');
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
    const baseType = type.startsWith('personnel_') ? 'personnel' : type;
    const unitName = type.startsWith('personnel_') ? type.replace('personnel_', '') : '';
    const config = SUMMARY_CONFIG[baseType];
    // @ts-ignore
    await Word.run(async (context: any) => {
      const range = context.document.getSelection();

      // Get current font for inheritance
      let currentFont: any = null;
      try {
        range.load('font/name,font/size,font/bold,font/italic,font/color');
        await context.sync();
        currentFont = {
          name: range.font.name,
          size: range.font.size,
          bold: range.font.bold,
          italic: range.font.italic,
          color: range.font.color
        };
      } catch (e) {}

      const wrapper = range.insertContentControl();
      wrapper.tag = `summary_${type}`;
      wrapper.title = unitName ? `Bảng Nhân sự - ${unitName}` : `Bảng Tổng hợp ${config.label}`;
      wrapper.appearance = 'BoundingBox';
      wrapper.placeholderText = ' '; // Hide placeholder

      // Set wrapper font size to 1pt to minimize newline space
      wrapper.font.size = 1;

      const table = wrapper.insertTable(2, config.columns.length, 'Start');
      try { table.style = 'Table Normal'; } catch(e){}
      await context.sync();
      
      const paras = wrapper.paragraphs;
      paras.load('items');
      await context.sync();
      if (paras.items.length > 0) {
        paras.items[paras.items.length - 1].font.size = 1;
      }

      applyFontToTable(table, currentFont);
      table.font.bold = false;
      
      config.columns.forEach((col, i) => {
        const cell = table.getCell(0, i);
        cell.body.insertText(col, 'Replace');
        cell.body.paragraphs.getFirst().font.bold = true;
        cell.body.paragraphs.getFirst().alignment = 'Centered';
        cell.shadingColor = '#F3F4F6';
      });

      // Apply column widths
      try {
        table.preferredWidthType = 'Percent';
        table.preferredWidth = 100;
        table.columns.load('items');
        await context.sync();
        
        table.columns.getItemAt(0).preferredWidth = 7; // STT
        if (baseType === 'personnel') {
          table.columns.getItemAt(1).preferredWidth = 45;
          table.columns.getItemAt(2).preferredWidth = 24;
          table.columns.getItemAt(3).preferredWidth = 24;
        } else if (baseType === 'materials') {
          table.columns.getItemAt(1).preferredWidth = 45;
          table.columns.getItemAt(2).preferredWidth = 18;
          table.columns.getItemAt(3).preferredWidth = 20;
          table.columns.getItemAt(4).preferredWidth = 10;
        } else if (baseType === 'equipment') {
          table.columns.getItemAt(1).preferredWidth = 45;
          table.columns.getItemAt(2).preferredWidth = 18;
          table.columns.getItemAt(3).preferredWidth = 15;
          table.columns.getItemAt(4).preferredWidth = 15;
        } else if (baseType === 'lab') {
          table.columns.getItemAt(1).preferredWidth = 45;
          table.columns.getItemAt(2).preferredWidth = 15;
          table.columns.getItemAt(3).preferredWidth = 15;
          table.columns.getItemAt(4).preferredWidth = 18;
        } else if (baseType === 'workitems') {
          table.columns.getItemAt(1).preferredWidth = 50;
          table.columns.getItemAt(2).preferredWidth = 18;
          table.columns.getItemAt(3).preferredWidth = 12;
          table.columns.getItemAt(4).preferredWidth = 13;
        }
      } catch (e) {}

      // Add one empty data row with centered STT for visual placeholder
      const dataCell = table.getCell(1, 0);
      dataCell.body.insertText('1', 'Replace');
      dataCell.body.paragraphs.getFirst().alignment = 'Centered';

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
      
      // Get current font for inheritance
      let currentFont: any = null;
      try {
        range.load(
          'font/name,font/size,font/bold,font/italic,font/color'
        );
        await context.sync();

        currentFont = {
          name: range.font.name,
          size: range.font.size,
          bold: range.font.bold,
          italic: range.font.italic,
          color: range.font.color
        };
      } catch (e) {}

      // Create a wrapper Content Control (Stable v1620 logic)
      const wrapper = range.insertContentControl();
      wrapper.tag = `table_${role}`;
      wrapper.title = `Bảng Thành phần: ${role.toUpperCase()}`;
      wrapper.appearance = 'BoundingBox';
      wrapper.placeholderText = ' '; // Hide placeholder

      // Set wrapper font size to 1pt to minimize newline space
      wrapper.font.size = 1;

      let insertedTable: any = null;
      if (isJV) {
        const members = project.contractorMembers || [];
        const colCount = members.length;
        const memberSigners = members.map((_: any, idx: number) => {
          const g = savedGroups.find((gr: any) => gr.prefix === `tc_ld${idx + 1}`);
          return (g && Array.isArray(g.signers)) ? g.signers : [];
        });
        const maxSigners = Math.max(...memberSigners.map((s: any) => s.length), 1);
        const rowCount = maxSigners * 2 + 1;

        insertedTable = wrapper.insertTable(rowCount, colCount, 'Start');
        await context.sync();
        
        // Fix font size for all paragraphs in wrapper
        const paras = wrapper.paragraphs;
        paras.load('items');
        await context.sync();
        paras.items.forEach((p: any) => { p.font.size = 1; });

        applyFontToTable(insertedTable, currentFont);
        hideTableBorders(insertedTable);

        for (let c = 0; c < colCount; c++) {
          const cell = insertedTable.getCell(0, c);
          cell.body.insertText(members[c], 'Replace');
          cell.body.paragraphs.getFirst().font.bold = true;
          cell.body.paragraphs.getFirst().alignment = 'Center';
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
        const signersCount = Math.max(signersRaw.length, (role === 'tc' || role === 'tv' ? 3 : 2));
        const rowCount = Math.max(signersCount, 1);
        const signers: any[] = signersRaw.length > 0 ? signersRaw : Array(rowCount).fill(null).map(() => ({ name: '', position: '', gender: 'auto' }));

        insertedTable = wrapper.insertTable(rowCount, 2, 'Start');
        await context.sync();
        
        // Fix font size for all paragraphs in wrapper
        const paras = wrapper.paragraphs;
        paras.load('items');
        await context.sync();
        paras.items.forEach((p: any) => { p.font.size = 1; });

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
      insertedTable.getRange('After').select();
      await context.sync();
    }).catch((err: any) => {
      console.error('WordApiService error:', err);
      alert('Lỗi chèn bảng tham gia: ' + (err.message || 'Không xác định'));
    });
  }
};

(window as any).WordApiService = WordApiService;
