import React from 'react';
import { Layers, FileCheck, AlertCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-card p-6 rounded-xl border shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      {trend && (
        <p className="text-xs text-green-500 mt-1 flex items-center">
          <TrendingUp size={12} className="mr-1" /> {trend}
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan dự án</h1>
        <div className="text-sm text-muted-foreground">Cập nhật lúc: 05/05/2026 16:00</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng công việc" 
          value="124" 
          icon={Layers} 
          color="bg-blue-500/10 text-blue-500"
          trend="+12% so với tuần trước"
        />
        <StatCard 
          title="Hồ sơ đã ký" 
          value="86" 
          icon={FileCheck} 
          color="bg-green-500/10 text-green-500"
          trend="+5 hồ sơ mới"
        />
        <StatCard 
          title="Chờ nghiệm thu" 
          value="18" 
          icon={AlertCircle} 
          color="bg-amber-500/10 text-amber-500"
        />
        <StatCard 
          title="Tiến độ tổng thể" 
          value="68%" 
          icon={TrendingUp} 
          color="bg-purple-500/10 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[
              { text: "Đã tạo Biên bản nghiệm thu công việc: Đổ bê tông dầm sàn tầng 5", time: "2 giờ trước", type: "record" },
              { text: "Nhập vật liệu: Thép Hòa Phát (20 tấn)", time: "5 giờ trước", type: "material" },
              { text: "Cập nhật nhật ký thi công ngày 04/05/2026", time: "1 ngày trước", type: "diary" },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <div>
                  <p>{item.text}</p>
                  <p className="text-muted-foreground text-xs">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Trạng thái nhân sự</h3>
          <div className="space-y-4">
            {[
              { name: "Nguyễn Văn A", role: "Chỉ huy trưởng", status: "Online" },
              { name: "Trần Văn B", role: "Giám sát trưởng", status: "Away" },
              { name: "Lê Văn C", role: "Tư vấn giám sát", status: "Online" },
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  person.status === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
