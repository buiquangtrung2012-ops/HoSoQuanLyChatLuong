import React, { useState } from 'react';
import { Calendar, Cloud, Users, Truck, Plus, Sparkles, MapPin, Wind, Save, CheckCircle } from 'lucide-react';
import { AiService } from '../services/AiService';

export const DiaryModule: React.FC = () => {
  const [diaryContent, setDiaryContent] = useState("- Triển khai lắp dựng cột đèn tuyến Lộ 1 (24 cột).\n- Đấu nối dây lên đèn và lắp cần đèn.\n- Kiểm tra độ thẳng đứng của cột và siết bu lông móng.");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState("Nắng ráo");
  const [temp, setTemp] = useState("32°C");
  const [manpower, setManpower] = useState("12 công nhân, 1 kỹ thuật");
  const [equipment, setEquipment] = useState("1 Xe cẩu tự hành, 1 máy thủy bình");

  const handleAiFill = async () => {
    setIsAiLoading(true);
    // Suggest content based on current mock tasks
    const suggestion = await AiService.generateWorkDescription("Lắp dựng cột đèn và rải cáp");
    setDiaryContent(suggestion);
    setIsAiLoading(false);
  };

  const handleNew = () => {
    setDiaryContent("");
    setDate(new Date().toISOString().split('T')[0]);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nhật ký thi công</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleNew}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-accent transition-all"
          >
            <Plus size={18} className="mr-2" /> Tạo nhật ký mới
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm transition-all"
          >
            {isSaved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
            {isSaved ? "Đã lưu" : "Lưu nhật ký"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                  <Calendar size={14} className="mr-1" /> Ngày tháng
                </label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg text-sm bg-background" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                  <Cloud size={14} className="mr-1" /> Thời tiết
                </label>
                <select 
                  className="w-full p-2 border rounded-lg text-sm bg-background"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option>Nắng ráo</option>
                  <option>Có mưa</option>
                  <option>Nhiều mây</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                  <Thermometer size={14} className="mr-1" /> Nhiệt độ
                </label>
                <input 
                  className="w-full p-2 border rounded-lg text-sm bg-background" 
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Nội dung thi công</label>
                  <button 
                    onClick={handleAiFill}
                    disabled={isAiLoading}
                    className="flex items-center text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full hover:bg-purple-500/20 transition-colors font-bold disabled:opacity-50"
                  >
                    <Sparkles size={10} className="mr-1" /> {isAiLoading ? "Đang gợi ý..." : "Gợi ý AI"}
                  </button>
                </div>
                <textarea 
                  className="w-full mt-1 p-3 border rounded-lg bg-background min-h-[150px] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  placeholder="Nhập nội dung công việc trong ngày..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                    <Users size={14} className="mr-1" /> Nhân lực
                  </label>
                  <input 
                    className="w-full mt-1 p-2 border rounded-lg text-sm bg-background" 
                    value={manpower}
                    onChange={(e) => setManpower(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                    <Truck size={14} className="mr-1" /> Máy móc
                  </label>
                  <input 
                    className="w-full mt-1 p-2 border rounded-lg text-sm bg-background" 
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Gợi ý từ công việc</h3>
            <p className="text-xs text-muted-foreground mb-4">Dựa trên các công việc đã thực hiện trong ngày:</p>
            <div className="space-y-3">
              {[
                "Lắp dựng cột đèn H=8m (Tuyến 1)",
                "Rải cáp ngầm 4x16mm2 (Tuyến 2)",
              ].map((work, i) => (
                <div key={i} className="flex items-center text-sm p-2 border-l-2 border-primary bg-primary/5">
                  {work}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4">
            <h4 className="text-sm font-bold text-purple-700 flex items-center mb-2">
              <Sparkles size={14} className="mr-1" /> AI Insights
            </h4>
            <p className="text-xs text-purple-600 leading-relaxed">
              Dữ liệu từ các module khác cho thấy tiến độ lắp dựng đang ổn định. Bạn nên tập trung hoàn thiện hồ sơ nghiệm thu cho các cột đã lắp xong.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Thermometer = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
);
