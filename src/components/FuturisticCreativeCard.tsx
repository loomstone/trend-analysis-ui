import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Eye, Users, Zap, Sparkles } from "lucide-react";
import type { Creative } from "@/components/CreativeCardsGrid";

interface FuturisticCreativeCardProps {
  creative: Creative;
  isSelected: boolean;
  onSelect: (creative: Creative) => void;
  index: number;
}

const FuturisticCreativeCard: React.FC<FuturisticCreativeCardProps> = ({
  creative,
  isSelected,
  onSelect,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMomentumConfig = () => {
    // Check if this creative is recommended first
    if (creative.recommended) {
      return {
        badge: "bg-purple-50 text-purple-600 border-purple-200",
        hoverBorder: "border-purple-300",
        glow: "bg-gradient-to-r from-purple-400/30 to-purple-500/30",
        shadow: "shadow-[0_0_15px_rgba(147,51,234,0.3),0_0_30px_rgba(147,51,234,0.15)]",
        icon: <Zap className="w-3 h-3" />,
        label: "Recommended"
      };
    }
    
    switch (creative.momentum) {
      case "rising":
        return {
          badge: "bg-green-50 text-green-600 border-green-200",
          hoverBorder: "border-green-300",
          glow: "bg-gradient-to-r from-green-400/30 to-green-500/30",
          shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3),0_0_30px_rgba(34,197,94,0.15)]",
          icon: <TrendingUp className="w-3 h-3" />,
          label: "Rising"
        };
      case "stable":
        return {
          badge: "bg-blue-50 text-blue-600 border-blue-200",
          hoverBorder: "border-blue-300",
          glow: "bg-gradient-to-r from-blue-400/30 to-blue-500/30",
          shadow: "shadow-[0_0_15px_rgba(59,130,246,0.3),0_0_30px_rgba(59,130,246,0.15)]",
          icon: <Sparkles className="w-3 h-3" />,
          label: "Stable"
        };
      case "declining":
        return {
          badge: "bg-red-50 text-red-600 border-red-200",
          hoverBorder: "border-red-300",
          glow: "bg-gradient-to-r from-red-400/30 to-red-500/30",
          shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3),0_0_30px_rgba(239,68,68,0.15)]",
          icon: <TrendingDown className="w-3 h-3" />,
          label: "Dying"
        };
      default:
        return {
          badge: "bg-gray-50 text-gray-600 border-gray-200",
          hoverBorder: "border-gray-300",
          glow: "bg-gradient-to-r from-gray-400/30 to-gray-500/30",
          shadow: "shadow-[0_0_15px_rgba(107,114,128,0.3),0_0_30px_rgba(107,114,128,0.15)]",
          icon: <Users className="w-3 h-3" />,
          label: "Stable"
        };
    }
  };

  const momentumConfig = getMomentumConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(creative)}
      className="cursor-pointer"
    >
      <div className={`relative bg-white rounded-xl shadow-lg shadow-slate-100 overflow-hidden transition-all duration-300 ${
        isHovered 
          ? `border-2 ${momentumConfig.hoverBorder}` 
          : 'border border-slate-200/60'
      }`}>
        {/* Header with trending info and badge */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {creative.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {creative.description}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity ${momentumConfig.glow}`} />
              <div className={`
                  relative px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2
                  ${momentumConfig.badge} ${momentumConfig.shadow}
                `}>
                {momentumConfig.icon}
                {momentumConfig.label}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center mt-6">
            <div>
              <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Detected Videos</div>
              <div className="text-slate-900 text-lg font-medium">{creative.totalTrendVideos}</div>
            </div>
            <div>
              <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Total Views</div>
              <div className="text-slate-900 text-lg font-medium">{creative.views}</div>
            </div>
            <div>
              <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Dates Active</div>
              <div className="text-slate-900 text-base font-medium">{creative.datesActive}</div>
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div className="p-6">
          <div className="text-blue-600 text-xs font-semibold mb-3 uppercase tracking-wide">Top Videos</div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="relative aspect-[9/16] rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded bg-slate-300 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-500 ml-0.5"></div>
                </div>
                {/* View count */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{index === 1 ? '2.1M' : index === 2 ? '1.8M' : '1.5M'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FuturisticCreativeCard;