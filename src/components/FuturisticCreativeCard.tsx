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
        badge: isHovered ? "bg-purple-50 text-purple-600 border-purple-200" : "bg-purple-50/70 text-purple-400 border-purple-100",
        hoverBorder: "border-purple-300",
        glow: "bg-gradient-to-r from-purple-400/10 to-purple-500/10",
        shadow: isHovered ? "shadow-[0_0_10px_rgba(147,51,234,0.2),0_0_20px_rgba(147,51,234,0.1)]" : "shadow-[0_0_3px_rgba(147,51,234,0.05),0_0_6px_rgba(147,51,234,0.03)]",
        icon: <Zap className="w-3 h-3" />,
        label: "Recommended"
      };
    }
    
    switch (creative.momentum) {
      case "rising":
        return {
          badge: isHovered ? "bg-green-50 text-green-600 border-green-200" : "bg-green-50/70 text-green-400 border-green-100",
          hoverBorder: "border-green-300",
          glow: "bg-gradient-to-r from-green-400/10 to-green-500/10",
          shadow: isHovered ? "shadow-[0_0_10px_rgba(34,197,94,0.2),0_0_20px_rgba(34,197,94,0.1)]" : "shadow-[0_0_3px_rgba(34,197,94,0.05),0_0_6px_rgba(34,197,94,0.03)]",
          icon: <TrendingUp className="w-3 h-3" />,
          label: "Rising"
        };
      case "stable":
        return {
          badge: isHovered ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-50/70 text-blue-400 border-blue-100",
          hoverBorder: "border-blue-300",
          glow: "bg-gradient-to-r from-blue-400/10 to-blue-500/10",
          shadow: isHovered ? "shadow-[0_0_10px_rgba(59,130,246,0.2),0_0_20px_rgba(59,130,246,0.1)]" : "shadow-[0_0_3px_rgba(59,130,246,0.05),0_0_6px_rgba(59,130,246,0.03)]",
          icon: <Sparkles className="w-3 h-3" />,
          label: "Stable"
        };
      case "declining":
        return {
          badge: isHovered ? "bg-red-50 text-red-600 border-red-200" : "bg-red-50/70 text-red-400 border-red-100",
          hoverBorder: "border-red-300",
          glow: "bg-gradient-to-r from-red-400/10 to-red-500/10",
          shadow: isHovered ? "shadow-[0_0_10px_rgba(239,68,68,0.2),0_0_20px_rgba(239,68,68,0.1)]" : "shadow-[0_0_3px_rgba(239,68,68,0.05),0_0_6px_rgba(239,68,68,0.03)]",
          icon: <TrendingDown className="w-3 h-3" />,
          label: "Dying"
        };
      default:
        return {
          badge: isHovered ? "bg-gray-50 text-gray-600 border-gray-200" : "bg-gray-50/70 text-gray-400 border-gray-100",
          hoverBorder: "border-gray-300",
          glow: "bg-gradient-to-r from-gray-400/10 to-gray-500/10",
          shadow: isHovered ? "shadow-[0_0_10px_rgba(107,114,128,0.2),0_0_20px_rgba(107,114,128,0.1)]" : "shadow-[0_0_3px_rgba(107,114,128,0.05),0_0_6px_rgba(107,114,128,0.03)]",
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
      <div className="relative bg-white rounded-xl shadow-lg shadow-slate-100 overflow-hidden transition-all duration-300 border border-slate-200/60">
        {/* Header with trending info and badge */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {creative.name === "Magnetic Pull Me Jalo Dance" ? "Me Jalo 'Pull' Couples Dance" : 
                 creative.name === "El Otro POV" ? "Me Jalo 'Pull' Car Trend" : 
                 creative.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {creative.name === "El Otro POV" ? "Creators recreate the viral 'pull' dance but with their cars." : 
                 creative.name === "Magnetic Pull Me Jalo Dance" ? "Couples recreate the viral 'pull' dance." :
                 creative.description}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-full blur-sm transition-all duration-300 ${momentumConfig.glow} ${
                isHovered ? 'opacity-50 blur-md scale-110' : 'opacity-20'
              }`} />
              <div className={`
                  relative px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2
                  ${momentumConfig.badge} transition-all duration-300 ${momentumConfig.shadow}
                `}>
                {momentumConfig.icon}
                {momentumConfig.label}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="relative">
                <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Detected Videos</div>
                <div className="text-slate-900 text-lg font-medium">{creative.totalTrendVideos}</div>
                {/* Right border */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
              </div>
              <div className="relative">
                <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Total Views</div>
                <div className="text-slate-900 text-lg font-medium">{creative.views}</div>
                {/* Right border */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
              </div>
              <div>
                <div className="text-slate-900 text-xs mb-2 font-medium uppercase tracking-wide">Dates Active</div>
                <div className="text-slate-900 text-base font-medium">{creative.datesActive}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div className="p-6">
          <div className="text-blue-600 text-xs font-semibold mb-3 uppercase tracking-wide">Top Videos</div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((index) => {
              // Define TikTok URLs for each thumbnail
              const getTikTokUrl = () => {
                if ((creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 1) {
                  return "https://www.tiktok.com/@keziaivankaa/video/7500067705056202002";
                } else if ((creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 2) {
                  return "https://www.tiktok.com/@xqueenkalin/video/7493698734291815726";
                } else if ((creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 3) {
                  return "https://www.tiktok.com/@leslyhu22/video/7480358698553036087";
                } else if ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 1) {
                  return "https://www.tiktok.com/@fernanfloo/video/7479874076975074615";
                } else if ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 2) {
                  return "https://www.tiktok.com/@crybaby_1001/video/7482343717865557255";
                } else if ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 3) {
                  return "https://www.tiktok.com/@lagranjadelborrego/video/7477717534939319557";
                } else if (creative.name === "Me Jalo Glow Up" && index === 1) {
                  return "https://www.tiktok.com/@mirandita.leon/video/7452525438070557957";
                } else if (creative.name === "Me Jalo Glow Up" && index === 2) {
                  return "https://www.tiktok.com/@luci_leoonn/video/7454706216674282758";
                }
                return null;
              };

              const tiktokUrl = getTikTokUrl();

              return (
                <div key={index} className="relative">
                  <a
                    href={tiktokUrl || "#"}
                    target={tiktokUrl ? "_blank" : undefined}
                    rel={tiktokUrl ? "noopener noreferrer" : undefined}
                    className={`block relative aspect-[9/16] rounded-lg bg-slate-100 border border-slate-200 overflow-hidden ${tiktokUrl ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                    onClick={(e) => {
                      if (!tiktokUrl) {
                        e.preventDefault();
                      } else {
                        e.stopPropagation(); // Prevent the card's onClick from firing
                      }
                    }}
                  >
                                    {/* Show thumbnails for specific trends */}
                {(creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 1 ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/keziaivankaa_video_7500067705056202002.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : ((creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 2) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/xqueenkalin_video_7493698734291815726.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : ((creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 3) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/leslyhu22_video_7480358698553036087.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 1) ? (
                      <img 
                        src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/fernanfloo_video_7479874076975074615.png"
                        alt="Top video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 2) ? (
                      <img 
                        src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/crybaby_1001_video_7482343717865557255.png"
                        alt="Top video thumbnail"
                        className="w-full h-full object-cover"
                      />
                                    ) : ((creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 3) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/lagranjadelborrego_video_7477717534939319557.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (creative.name === "Me Jalo Glow Up" && index === 1) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/mirandita.leon_video_7452525438070557957.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (creative.name === "Me Jalo Glow Up" && index === 2) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/luci_leoonn_video_7454706216674282758.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (creative.name === "Me Jalo Glow Up" && index === 3) ? (
                  <img 
                    src="https://tiktokthumbnails.s3.us-east-2.amazonaws.com/_uknowmado__video_7458127464452132101.png"
                    alt="Top video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-slate-300 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-500 ml-0.5"></div>
                        </div>
                      </div>
                    )}
                    {/* View count */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 pointer-events-none">
                      <Eye className="w-3 h-3" />
                                        <span>{
                    (creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 1 ? '88.7M' :
                    (creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 2 ? '43.4M' :
                    (creative.name === "Magnetic Pull Me Jalo Dance" || creative.name === "Me Jalo 'Pull' Couples Dance") && index === 3 ? '72.2M' :
                    (creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 1 ? '17.2M' :
                    (creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 2 ? '19.3M' :
                    (creative.name === "El Otro POV" || creative.name === "Me Jalo 'Pull' Car Trend") && index === 3 ? '30.0M' :
                    creative.name === "Me Jalo Glow Up" && index === 1 ? '7.3M' :
                    creative.name === "Me Jalo Glow Up" && index === 2 ? '6.5M' :
                    creative.name === "Me Jalo Glow Up" && index === 3 ? '2.7M' :
                    index === 1 ? '2.1M' : index === 2 ? '1.8M' : '1.5M'
                  }</span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
            Click to view on TikTok
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FuturisticCreativeCard;