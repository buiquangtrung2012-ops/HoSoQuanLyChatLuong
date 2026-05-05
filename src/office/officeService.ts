/// <reference types="office-js" />
/* global Word, Excel, Office */

export const isOfficeInitialized = () => {
  return typeof Office !== 'undefined' && Office.context;
};

export const ExcelService = {
  async getActiveWorksheetData(tableName: string) {
    if (!isOfficeInitialized()) return null;
    
    return Excel.run(async (context: Excel.RequestContext) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const table = sheet.tables.getItem(tableName);
      const range = table.getDataBodyRange();
      range.load('values');
      await context.sync();
      return range.values;
    });
  },

  async writeToTable(tableName: string, data: any[][]) {
    if (!isOfficeInitialized()) return;

    return Excel.run(async (context: Excel.RequestContext) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const table = sheet.tables.getItem(tableName);
      const range = table.getDataBodyRange();
      range.values = data;
      await context.sync();
    });
  }
};

export const WordService = {
  async insertTextAtCursor(text: string) {
    if (!isOfficeInitialized()) return;

    return Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.insertText(text, 'End');
      await context.sync();
    });
  },

  async fillPlaceholders(data: Record<string, string>) {
    if (!isOfficeInitialized()) return;

    return Word.run(async (context: Word.RequestContext) => {
      const body = context.document.body;
      for (const [key, value] of Object.entries(data)) {
        const searchResults = body.search(`{{${key}}}`, { matchCase: false });
        searchResults.load('items');
        await context.sync();
        
        searchResults.items.forEach((item: Word.Range) => {
          item.insertText(value, 'Replace');
        });
      }
      await context.sync();
    });
  }
};
