import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const TemplateService = {
  /**
   * Generates a Word document from a template file and data.
   * @param templateBuffer The binary content of the .docx template
   * @param data The data object to fill the placeholders
   * @param fileName The output filename
   */
  async generateDocument(templateBuffer: ArrayBuffer, data: any, fileName: string) {
    try {
      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Render the document (replace placeholders {{key}} with data[key])
      doc.render(data);

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Download the file
      saveAs(out, fileName);
      return true;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  },

  /**
   * Mock function to get a template (in a real app, this would fetch from a server or local storage)
   */
  async getTemplate(type: string): Promise<ArrayBuffer> {
    // For demonstration, we'll return an empty buffer or throw
    // In production, the user would upload templates or the app would have pre-baked ones.
    console.log(`Fetching template for: ${type}`);
    return new ArrayBuffer(0);
  }
};
