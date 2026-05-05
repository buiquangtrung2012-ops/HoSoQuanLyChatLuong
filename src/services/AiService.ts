/**
 * AI Service for Construction Quality Management
 * Provides suggestions for technical standards and content verification.
 */

export const AiService = {
  /**
   * Suggests technical standards based on the work item name.
   */
  async suggestStandards(workItemName: string): Promise<string[]> {
    const input = workItemName.toLowerCase();
    const suggestions: string[] = [];

    // Street Lighting Specific Standards
    if (input.includes('đèn') || input.includes('chiếu sáng')) {
      suggestions.push('TCVN 259:2001 (Thiết kế chiếu sáng nhân tạo đường phố, công viên)');
      suggestions.push('QCVN 07-7:2016/BXD (Quy chuẩn kỹ thuật quốc gia - Công trình chiếu sáng)');
      suggestions.push('TCVN 5828:1994 (Đèn chiếu sáng đường phố - Yêu cầu kỹ thuật)');
    }
    
    if (input.includes('cáp') || input.includes('điện')) {
      suggestions.push('TCVN 9206:2012 (Đặt thiết bị điện trong nhà ở và công trình công cộng)');
      suggestions.push('TCVN 11:2006 (Quy phạm trang bị điện)');
      suggestions.push('TCVN 5935-1:2013 (Cáp điện lực cách điện đúc bằng chất điện môi rắn)');
    }

    if (input.includes('cột') || input.includes('móng')) {
      suggestions.push('TCVN 4453:1995 (Kết cấu bê tông cốt thép toàn khối - Quy phạm thi công và nghiệm thu)');
      suggestions.push('TCVN 9358:2012 (Lắp đặt hệ thống nối đất)');
    }

    if (input.includes('tiếp địa') || input.includes('chống sét')) {
      suggestions.push('TCVN 9385:2012 (Chống sét cho công trình xây dựng)');
      suggestions.push('TCVN 9358:2012 (Lắp đặt hệ thống nối đất thiết bị)');
    }

    // Default general standards
    if (suggestions.length === 0) {
      suggestions.push('TCVN 4055:2012 (Tổ chức thi công)');
      suggestions.push('QCVN 06:2021/BXD (An toàn cháy cho nhà và công trình)');
    }

    return new Promise(resolve => setTimeout(() => resolve(suggestions), 800));
  },

  /**
   * Generates a description of construction content based on a task name.
   */
  async generateWorkDescription(taskName: string): Promise<string> {
    const input = taskName.toLowerCase();
    if (input.includes('lắp dựng cột')) {
      return "- Kiểm tra vị trí móng, tim cốt theo bản vẽ.\n- Vận chuyển cột bằng xe cẩu tự hành chuyên dụng.\n- Lắp dựng cột, căn chỉnh độ thẳng đứng bằng máy kinh vĩ/thủy bình.\n- Siết chặt bu lông móng, lắp bảng điện cửa cột và đấu nối dây.";
    }
    if (input.includes('rải cáp')) {
      return "- Đào rãnh cáp, kiểm tra kích thước rãnh.\n- Trải lớp cát đệm mịn dày 10cm.\n- Rải cáp ngầm, đặt gạch bảo vệ hoặc băng báo hiệu.\n- Lấp đất và đầm nén hoàn trả mặt bằng.";
    }
    if (input.includes('đèn') || input.includes('cần đèn')) {
      return "- Lắp cần đèn vào đầu cột, định vị hướng chiếu sáng.\n- Lắp đặt bộ đèn LED, đấu nối dây nguồn vào chấn lưu/driver.\n- Kiểm tra độ kín khít và thử sáng cục bộ từng trụ.";
    }
    return "- Thực hiện thi công theo hồ sơ thiết kế và các quy chuẩn kỹ thuật chuyên ngành hiện hành.";
  }
};
