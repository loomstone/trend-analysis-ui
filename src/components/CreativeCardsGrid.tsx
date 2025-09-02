import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Play, Video, Eye, TrendingUp, Zap, TrendingDown, Sparkles, ArrowUpRight, Clock, Info, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Creative {
  id: number;
  name: string;
  description: string;
  summary: string;
  score: number;
  trendTag: "recommended" | "dying" | "rising" | "stagnant" | "up and coming";
  datesActive: string;
  videos: Array<{
    thumbnail: string;
    views: string;
    creator: string;
    gender?: string;
    archetype?: string;
    region?: string;
  }>;
  views: string;
  totalTrendVideos: string;
  growth: string;
  viralScore: number;
  momentum: "rising" | "stable" | "declining";
  demographics: {
    ageRanges: Array<{ range: string; percentage: number }>;
    genderSplit: { male: number; female: number };
    topCountries: Array<{ country: string; percentage: number }>;
    creatorArchetypes?: Array<{ type: string; percentage: number }>;
    ethnicity?: Array<{ type: string; percentage: number }>;
  };
  keyTakeaways: string[];
  spotifyData?: Array<{
    date: string;
    streams: number;
  }>;
}

interface CreativeCardsGridProps {
  onCreativeSelect: (creative: Creative) => void;
  selectedCreativeId?: number;
}

const creatives: Creative[] = [
  {
    id: 1,
    name: "Lip Sync with TOS",
    description: "Creators are lip-syncing to emotional audio clips with exaggerated facial expressions. Often includes dramatic hand gestures and storytelling through body language.",
    summary: "Explosive growth with Gen Z audience. Perfect timing for emotional content creators.",
    score: 9.2,
    trendTag: "recommended",
    datesActive: "Dec 20 - Jan 10",
    videos: [
      { thumbnail: "/placeholder.svg", views: "2.3M", creator: "@creator1", gender: "Female", archetype: "Gen Z", region: "USA" },
      { thumbnail: "/placeholder.svg", views: "1.8M", creator: "@creator2", gender: "Male", archetype: "Millennial", region: "MEX" },
    ],
    views: "287M",
    totalTrendVideos: "15.2K",
    growth: "+156%",
    viralScore: 9.2,
    momentum: "rising",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 42 },
        { range: "18-24", percentage: 38 },
        { range: "25-34", percentage: 15 },
        { range: "35+", percentage: 5 }
      ],
      genderSplit: { male: 35, female: 65 },
      topCountries: [
        { country: "USA", percentage: 28 },
        { country: "Mexico", percentage: 22 },
        { country: "Brazil", percentage: 15 },
        { country: "Indonesia", percentage: 12 }
      ]
    },
    keyTakeaways: [
      "Peak engagement during evening hours (7-11 PM)",
      "Strong emotional connection drives shares",
      "Audio clips under 15 seconds perform best",
      "User-generated duets increase reach by 3x"
    ],
    spotifyData: [
      { date: "Dec 20", streams: 1.2 },
      { date: "Dec 22", streams: 1.5 },
      { date: "Dec 24", streams: 1.8 },
      { date: "Dec 26", streams: 2.1 },
      { date: "Dec 28", streams: 2.4 },
      { date: "Dec 30", streams: 2.8 },
      { date: "Jan 1", streams: 3.2 },
      { date: "Jan 3", streams: 3.5 },
      { date: "Jan 5", streams: 3.3 },
      { date: "Jan 7", streams: 3.0 },
      { date: "Jan 9", streams: 2.8 },
      { date: "Jan 10", streams: 2.6 }
    ]
  },
  {
    id: 2,
    name: "Dance Challenge",
    description: "Creators perform a specific 15-second dance routine with arm swings and hip movements. Many add their own style variations to the original choreography.",
    summary: "Strong engagement in India and USA. Tutorial format drives participation.",
    score: 8.7,
    trendTag: "rising",
    datesActive: "Jan 5 - Jan 25",
    videos: [
      { thumbnail: "/placeholder.svg", views: "4.2M", creator: "@dancer1" },
      { thumbnail: "/placeholder.svg", views: "3.7M", creator: "@dancer2" },
    ],
    views: "412M",
    totalTrendVideos: "23.8K",
    growth: "+89%",
    viralScore: 8.7,
    momentum: "stable",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 38 },
        { range: "18-24", percentage: 45 },
        { range: "25-34", percentage: 12 },
        { range: "35+", percentage: 5 }
      ],
      genderSplit: { male: 40, female: 60 },
      topCountries: [
        { country: "India", percentage: 31 },
        { country: "USA", percentage: 24 },
        { country: "Philippines", percentage: 18 },
        { country: "UK", percentage: 9 }
      ]
    },
    keyTakeaways: [
      "Tutorial videos boost participation by 5x",
      "Weekend posts see 40% higher engagement",
      "Collaborations with dancers increase visibility",
      "15-30 second clips optimal for completion rate"
    ],
    spotifyData: [
      { date: "Jan 5", streams: 2.1 },
      { date: "Jan 7", streams: 2.4 },
      { date: "Jan 9", streams: 2.8 },
      { date: "Jan 11", streams: 3.2 },
      { date: "Jan 13", streams: 3.6 },
      { date: "Jan 15", streams: 3.9 },
      { date: "Jan 17", streams: 4.1 },
      { date: "Jan 19", streams: 3.8 },
      { date: "Jan 21", streams: 3.5 },
      { date: "Jan 23", streams: 3.2 },
      { date: "Jan 25", streams: 3.0 }
    ]
  },
  {
    id: 3,
    name: "Transition Effect",
    description: "Creators use quick hand movements or jumps to transition between outfits or scenes. Popular variations include beat-synced transformations and color changes.",
    summary: "Technical complexity attracts creators. Growing rapidly in Asian markets.",
    score: 7.9,
    trendTag: "up and coming",
    datesActive: "Jan 8 - Jan 28",
    videos: [
      { thumbnail: "/placeholder.svg", views: "1.9M", creator: "@effects1" },
      { thumbnail: "/placeholder.svg", views: "2.4M", creator: "@effects2" },
    ],
    views: "178M",
    totalTrendVideos: "8.7K",
    growth: "+234%",
    viralScore: 7.9,
    momentum: "rising",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 35 },
        { range: "18-24", percentage: 48 },
        { range: "25-34", percentage: 14 },
        { range: "35+", percentage: 3 }
      ],
      genderSplit: { male: 52, female: 48 },
      topCountries: [
        { country: "Japan", percentage: 26 },
        { country: "South Korea", percentage: 21 },
        { country: "USA", percentage: 19 },
        { country: "Thailand", percentage: 15 }
      ]
    },
    keyTakeaways: [
      "Technical complexity attracts creator community",
      "Behind-the-scenes content drives engagement",
      "Multiple attempts encourage repeat views",
      "Effect tutorials gain 10x more saves"
    ],
    spotifyData: [
      { date: "Jan 8", streams: 0.8 },
      { date: "Jan 10", streams: 1.1 },
      { date: "Jan 12", streams: 1.4 },
      { date: "Jan 14", streams: 1.8 },
      { date: "Jan 16", streams: 2.2 },
      { date: "Jan 18", streams: 2.5 },
      { date: "Jan 20", streams: 2.7 },
      { date: "Jan 22", streams: 2.4 },
      { date: "Jan 24", streams: 2.1 },
      { date: "Jan 26", streams: 1.9 },
      { date: "Jan 28", streams: 1.7 }
    ]
  },
  {
    id: 4,
    name: "Comedy Skit",
    description: "Creators act out relatable scenarios with exaggerated reactions and timing. Most use POV format or play multiple characters in the same video.",
    summary: "Highest shareability factor. Comments drive massive algorithm boost.",
    score: 9.5,
    trendTag: "rising",
    datesActive: "Jan 10 - Jan 30",
    videos: [
      { thumbnail: "/placeholder.svg", views: "5.1M", creator: "@comedian1" },
      { thumbnail: "/placeholder.svg", views: "3.8M", creator: "@comedian2" },
    ],
    views: "523M",
    totalTrendVideos: "31.2K",
    growth: "+178%",
    viralScore: 9.5,
    momentum: "rising",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 28 },
        { range: "18-24", percentage: 41 },
        { range: "25-34", percentage: 22 },
        { range: "35+", percentage: 9 }
      ],
      genderSplit: { male: 48, female: 52 },
      topCountries: [
        { country: "USA", percentage: 35 },
        { country: "Canada", percentage: 18 },
        { country: "Australia", percentage: 14 },
        { country: "UK", percentage: 12 }
      ]
    },
    keyTakeaways: [
      "Relatable content sees 3x more shares",
      "Quick hooks in first 3 seconds crucial",
      "Series format increases follower conversion",
      "Comments drive algorithm boost significantly"
    ],
    spotifyData: [
      { date: "Jan 10", streams: 3.2 },
      { date: "Jan 12", streams: 3.8 },
      { date: "Jan 14", streams: 4.5 },
      { date: "Jan 16", streams: 5.2 },
      { date: "Jan 18", streams: 5.8 },
      { date: "Jan 20", streams: 6.1 },
      { date: "Jan 22", streams: 5.9 },
      { date: "Jan 24", streams: 5.5 },
      { date: "Jan 26", streams: 5.1 },
      { date: "Jan 28", streams: 4.8 },
      { date: "Jan 30", streams: 4.5 }
    ]
  }
];

const CreativeCardsGrid: React.FC<CreativeCardsGridProps> = ({ onCreativeSelect, selectedCreativeId }) => {
  const displayedCreatives = creatives.slice(0, 4);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {displayedCreatives.map((creative, index) => {
        const isSelected = creative.id === selectedCreativeId;
        
        return (
          <motion.div
            key={creative.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            onClick={() => onCreativeSelect(creative)}
            className="cursor-pointer"
          >
            <Card 
              className={`
                relative overflow-hidden transition-all duration-300 backdrop-blur-xl h-[500px]
                ${isSelected 
                  ? 'bg-white/10 border border-purple-500/40' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20'
                }
              `}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header with Title and Tag */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-xl text-white leading-tight">
                    {creative.name}
                  </h3>
                  
                  {creative.trendTag === "recommended" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-400/30">
                      <Sparkles className="w-3 h-3" />
                      Recommended
                    </span>
                  )}
                  {creative.trendTag === "rising" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-400/30">
                      <TrendingUp className="w-3 h-3" />
                      Rising
                    </span>
                  )}
                  {creative.trendTag === "up and coming" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-400/30">
                      <ArrowUpRight className="w-3 h-3" />
                      Up & Coming
                    </span>
                  )}
                  {creative.trendTag === "stagnant" && (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30">
                      Stagnant
                    </span>
                  )}
                  {creative.trendTag === "dying" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 text-xs font-semibold rounded-full border border-gray-400/30">
                      <TrendingDown className="w-3 h-3" />
                      Dying
                    </span>
                  )}
                </div>
                
                {/* Creative Description */}
                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                  {creative.description}
                </p>
                
                {/* Summary */}
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {creative.summary}
                </p>
                
                {/* Stats Bar with Colored Icons */}
                <div className="flex items-center gap-4 text-sm mb-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-semibold text-gray-300">{creative.score}/10</span>
                          <Info className="w-3 h-3 text-gray-500 hover:text-gray-400 transition-colors cursor-help" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black/90 text-white border-white/20">
                        <p className="text-xs">This is calculated using Spencer's Algorithm</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-semibold text-gray-300">{creative.views}</span>
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-gray-300">{creative.totalTrendVideos}</span>
                  </span>
                </div>

                {/* Video Thumbnails - Fill the entire remaining space */}
                <div className="flex gap-3 flex-1 justify-center items-stretch">
                  {creative.videos.slice(0, 2).map((video, idx) => (
                    <div key={idx} className="relative group flex-1 max-w-[200px]">
                      <div className="h-full min-h-[320px] bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20">
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-700" />
                        </div>
                        <img 
                          src={video.thumbnail} 
                          alt={`Video ${idx + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* View count */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs font-semibold">{video.views}</span>
                        </div>
                        
                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Date Only */}
                <div className="flex items-center justify-end pt-2 border-t border-white/5 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {creative.datesActive}
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="relative">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <div className="absolute inset-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default React.memo(CreativeCardsGrid);