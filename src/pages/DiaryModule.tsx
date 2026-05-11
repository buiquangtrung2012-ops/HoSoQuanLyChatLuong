import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, Users, Truck, Plus, Sparkles, MapPin, Wind, Save, CheckCircle, RefreshCcw } from 'lucide-react';
import { AiService } from '../services/AiService';
import { StorageService } from '../services/storageService';

export const DiaryModule: React.FC = () => {
  const [diaryContent, setDiaryContent] = useState("- Triển khai lắp dựng cột đèn tuyến Lộ 1 (24 cột).\n- Đấu nối dây lên đèn và lắp cần đèn.\n- Kiểm tra độ thẳng đứng của cột và siết bu lông móng.");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState("Nắng ráo");
  const [temp, setTemp] = useState("32°C");
  const [manpower, setManpower] = useState("12 công nhân, 1 kỹ thuật");
  const [equipment, setEquipment] = useState("1 Xe cẩu tự hành, 1 máy thủy bình");
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [workItems, setWorkItems] = useState<any[]>([]);

  useEffect(() => {
    const savedEntries = StorageService.getDiary() || [];
    setAllEntries(savedEntries);
    const savedItems = StorageService.getWorkItems() || [];
    setWorkItems(savedItems);
    
    const existing = savedEntries.find((e: any) => e.date === date);
    if (existing) {
      setWeather(existing.weather);
      setTemp(existing.temp);
      setDiaryContent(existing.content);
      setManpower(existing.manpower);
      setEquipment(existing.equipment);
      setIsSaved(true);
    } else {
      setIsSaved(false);
      setDiaryContent("");
    }
  }, [date]);

  const handleAiFill = async () => {
    setIsAiLoading(true);
    const suggestion = await AiService.generateWorkDescription("Lắp dựng cột đèn và rải cáp");
    setDiaryContent(suggestion);
    setIsAiLoading(false);
  };

  const handleFetchFromWorkItems = () => {
    const allDates = [...new Set(workItems.map((w: any) => w.inspectionDate))];
    
    if (allDates.length === 0) {
      alert('Không có dữ liệu công việc nào để gộp. Hãy thêm công việc ở Tab Công việc trước.');
      return;
    }

    if (confirm(`Hệ thống tìm thấy công việc ở ${allDates.length} ngày khác nhau. Bạn có muốn tự động gộp và tạo nhật ký cho TẤT CẢ các ngày này không?`)) {
      let createdCount = 0;
      const updatedEntries = [...allEntries];

      allDates.forEach((dStr: any) => {
        const relatedWorks = workItems.filter((work: any) => work.inspectionDate === dStr);
        if (relatedWorks.length > 0) {
          const content = relatedWorks.map(work => `- ${work.name} (${work.line} - ${work.category}): ${work.quantity} ${work.unit}`).join('\n');
          
          const existingIndex = updatedEntries.findIndex(e => e.date === dStr);
          const newEntry = {
            id: Date.now().toString() + Math.random(),
            date: dStr,
            weather: "Nắng ráo",
            temp: "32°C",
            content: content,
            manpower: "12 công nhân, 1 kỹ thuật",
            equipment: "1 Xe cẩu tự hành, 1 máy thủy bình",
            timestamp: new Date().toISOString()
          };

          if (existingIndex >= 0) {
            updatedEntries[existingIndex] = newEntry;
          } else {
            updatedEntries.push(newEntry);
          }
          createdCount++;
        }
      });

      setAllEntries(updatedEntries);
      StorageService.saveDiary(updatedEntries);
      
      // Update UI if current date was affected
      const currentAffected = updatedEntries.find(e => e.date === date);
      if (currentAffected) {
        setDiaryContent(currentAffected.content);
        setIsSaved(true);
      }

      alert(`Đã tự động tạo/cập nhật nhật ký cho ${createdCount} ngày thành công!`);
    }
  };

  const handleNew = () => {
    setDiaryContent("");
    setDate(new Date().toISOString().split('T')[0]);
    setIsSaved(false);
  };

  const handleSave = () => {
    const newEntry = {
      id: Date.now().toString(),
      date,
      weather,
      temp,
      content: diaryContent,
      manpower,
      equipment,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [...allEntries.filter(e => e.date !== date), newEntry];
    setAllEntries(updatedEntries);
    StorageService.saveDiary(updatedEntries);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    alert('Đã lưu nhật ký ngày ' + date.split('-').reverse().join('/'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nhật ký thi công</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleNew}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-accent transition-all text-sm font-medium"
          >
            <Plus size={18} className="mr-2" /> Tạo mới
          </button>
          <button 
            onClick={handleFetchFromWorkItems}
            className="flex items-center px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all text-sm font-bold"
            title="Lấy nội dung từ danh sách công việc cùng ngày"
          >
            <RefreshCcw size={18} className="mr-2" /> Lấy từ công việc
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm transition-all text-sm font-medium"
          >
            {isSaved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
            {isSaved ? "Đã lưu" : "Lưu nhật ký"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 border-b pb-6">
            {/* Mini Calendar for highlighting saved days */}
            <div className="flex-shrink-0 bg-muted/30 p-4 rounded-xl border">
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center">
                <Calendar size={14} className="mr-1" /> Trạng thái lưu nhật ký
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold py-1 opacity-50 w-8 h-8 flex items-center justify-center">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const dStr = `2026-05-${day.toString().padStart(2, '0')}`;
                  const hasEntry = allEntries.some(e => e.date === dStr);
                  const isCurrent = date === dStr;
                  return (
                    <button 
                      key={i} 
                      onClick={() => setDate(dStr)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-all text-[10px] ${
                        isCurrent ? 'bg-primary text-primary-foreground shadow-md font-bold scale-110 z-10' : 
                        hasEntry ? 'bg-red-500 text-white font-bold' : 'hover:bg-accent text-muted-foreground'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center space-x-3 text-[10px]">
                <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> Đã lưu</div>
                <div className="flex items-center"><div className="w-2 h-2 bg-primary rounded-full mr-1"></div> Đang chọn</div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                  <Calendar size={14} className="mr-1" /> Ngày tháng
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-lg text-sm bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
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
                  <option>Mưa to</option>
                  <option>Giông bão</option>
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
          </div>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">Nội dung thi công</label>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleAiFill}
                    disabled={isAiLoading}
                    className="flex items-center text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full hover:bg-purple-500/20 transition-colors font-bold disabled:opacity-50"
                  >
                    <Sparkles size={10} className="mr-1" /> {isAiLoading ? "Đang gợi ý..." : "Gợi ý AI"}
                  </button>
                </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4 text-sm">Gợi ý từ công việc</h3>
            <p className="text-[10px] text-muted-foreground mb-4 font-medium uppercase tracking-wider">Ngày nghiệm thu: {date}</p>
            <div className="space-y-3">
              {workItems.filter((w: any) => w.inspectionDate === date).length > 0 ? (
                workItems.filter((w: any) => w.inspectionDate === date).map((work: any, i: number) => (
                  <div key={i} className="flex flex-col text-xs p-2 border-l-2 border-primary bg-primary/5 rounded-r-lg">
                    <span className="font-bold">{work.name}</span>
                    <span className="text-muted-foreground">{work.line} - {work.category}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic p-2 border border-dashed rounded-lg text-center">
                  Không có công việc nào được nghiệm thu trong ngày này.
                </div>
              )}
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-6 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-purple-700 flex items-center mb-3">
              <Sparkles size={16} className="mr-2" /> AI Insights
            </h4>
            <p className="text-sm text-purple-600 leading-relaxed italic">
              "Dựa trên danh sách công việc, hôm nay có {workItems.filter((w: any) => w.inspectionDate === date).length} hạng mục cần hoàn thành hồ sơ. Hãy chú ý kiểm tra lại đầy đủ các biên bản kèm theo để đảm bảo tiến độ thanh toán."
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
