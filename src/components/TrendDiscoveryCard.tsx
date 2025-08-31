import { useState } from "react";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { TrendingUp, TrendingDown, Zap, ChevronLeft, ChevronRight } from "lucide-react";

interface TrendItem {
  id: string;
  status: "exploding" | "rising" | "emerging";
  title: string;
  subtitle: string;
  startedDate: string;
  videos: string;
  growth: string;
  icon: "fire" | "trending" | "zap";
}

const trendData: TrendItem[] = [
  {
    id: "1",
    status: "exploding",
    title: "Lip Sync",
    subtitle: "Trending lip sync content",
    startedDate: "Last week",
    videos: "12.3K",
    growth: "+342%",
    icon: "fire"
  },
  {
    id: "2", 
    status: "rising",
    title: "Dance Trend",
    subtitle: "Popular dance movements",
    startedDate: "3 days ago",
    videos: "8.7K", 
    growth: "+189%",
    icon: "trending"
  },
  {
    id: "3",
    status: "emerging", 
    title: "Slo Mo Transition",
    subtitle: "Slow motion effects",
    startedDate: "Yesterday",
    videos: "5.2K",
    growth: "+127%",
    icon: "zap"
  }
];

interface TrendDiscoveryCardProps {
  selectedTrendId?: string;
  onTrendSelect: (trendId: string) => void;
  selectedButton?: string;
  onButtonSelect: (buttonName: string) => void;
}

const TrendDiscoveryCard = ({ selectedTrendId, onTrendSelect, selectedButton, onButtonSelect }: TrendDiscoveryCardProps) => {
  const [selectedButtons, setSelectedButtons] = useState<Record<string, string>>({});
  const { open, setOpen } = useSidebar();

  if (!open) {
    return null;
  }
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "fire":
        return <span className="text-dashboard-warning">🔥</span>;
      case "trending": 
        return <TrendingUp className="w-4 h-4 text-dashboard-accent-green" />;
      case "zap":
        return <Zap className="w-4 h-4 text-dashboard-accent-blue" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exploding":
        return "text-dashboard-warning";
      case "rising":
        return "text-dashboard-accent-green"; 
      case "emerging":
        return "text-dashboard-accent-blue";
      default:
        return "text-dashboard-text-secondary";
    }
  };

  const handleButtonClick = (trendId: string, buttonName: string) => {
    setSelectedButtons(prev => ({
      ...prev,
      [`${trendId}-${buttonName}`]: prev[`${trendId}-${buttonName}`] ? '' : buttonName
    }));
    onButtonSelect(buttonName);
  };

  const isButtonSelected = (trendId: string, buttonName: string) => {
    return selectedButtons[`${trendId}-${buttonName}`] === buttonName;
  };

  return (
    <Sidebar className="border-r border-gray-200 w-[350px]" collapsible="offcanvas">
      <SidebarContent className="liquid-glass-light p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-dashboard-text-primary font-semibold text-lg">Trend Discovery Dashboard</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dashboard-accent-green rounded-full animate-pulse"></div>
            <span className="text-sm text-dashboard-text-secondary font-medium">3 New Trends</span>
            <button
              onClick={() => setOpen(!open)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors ml-4"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? (
                <ChevronLeft className="w-6 h-6 text-dashboard-text-secondary" />
              ) : (
                <ChevronRight className="w-6 h-6 text-dashboard-text-secondary" />
              )}
            </button>
          </div>
        </div>
      
      <div className="space-y-4">
        {trendData.map((trend) => (
          <div 
            key={trend.id} 
            className={`liquid-glass rounded-xl p-4 cursor-pointer transition-all ${
              selectedTrendId === trend.id 
                ? 'border-dashboard-accent-blue shadow-lg scale-[1.02]' 
                : 'hover:shadow-md hover:scale-[1.01]'
            }`}
            onClick={() => onTrendSelect(trend.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getIcon(trend.icon)}
                <div>
                  <span className={`text-sm font-medium capitalize ${getStatusColor(trend.status)}`}>
                    {trend.status}
                  </span>
                </div>
              </div>
              <span className="text-dashboard-accent-green font-semibold text-right">
                {trend.growth}
              </span>
            </div>
            
            <h4 className="text-dashboard-text-primary font-medium mb-1">
              {trend.title}
            </h4>
            <p className="text-dashboard-text-secondary text-sm mb-3">
              {trend.subtitle}
            </p>
            
            <div className="flex items-center justify-between text-sm text-dashboard-text-muted mb-3">
              <span>Started: {trend.startedDate}</span>
              <span>Videos: {trend.videos}</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {/* Buttons removed - showing all videos for each trend */}
            </div>
          </div>
        ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default TrendDiscoveryCard;
export { trendData };