import React from "react";
import { motion } from "framer-motion";
import FuturisticCreativeCard from "@/components/FuturisticCreativeCard";
import FuturisticCreativeHeader from "@/components/FuturisticCreativeHeader";
import { transformTrendData } from "@/utils/dataTransformer";

export interface Creative {
  id: number;
  name: string;
  description: string;
  datesActive: string;
  recommended?: boolean;
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
  creativeAnalysis: {
    description: string;
    content_strategy: string;
  };
  creativeBrief: {
    quick_steps: string[];
    key_tips: string[];
  };
  engagement_stats?: {
    total_views: number;
    avg_engagement_rate: number;
    avg_views?: number;
    median_views?: number;
    avg_likes?: number;
    avg_comments?: number;
    avg_shares?: number;
    total_engagements?: number;
  };
}

interface CreativeCardsGridProps {
  onCreativeSelect: (creative: Creative) => void;
  selectedCreativeId?: number;
}

// Use transformed data from the generated JSON
const creatives: Creative[] = transformTrendData();

// Original hardcoded data kept for reference
const hardcodedCreatives: Creative[] = [
  {
    id: 1,
    name: "Lip Sync with TOS",
    description: "Viral lip sync trend featuring dramatic emotional performances",
    datesActive: "Dec 20 - Jan 10",
    videos: [
      { thumbnail: "/placeholder.svg", views: "2.3M", creator: "@creator1", gender: "Female", archetype: "Gen Z", region: "USA" },
      { thumbnail: "/placeholder.svg", views: "1.8M", creator: "@creator2", gender: "Male", archetype: "Millennial", region: "MEX" },
      { thumbnail: "/placeholder.svg", views: "3.1M", creator: "@creator3", gender: "Female", archetype: "Creator", region: "BRA" },
      { thumbnail: "/placeholder.svg", views: "1.5M", creator: "@creator4", gender: "Male", archetype: "Influencer", region: "UK" },
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
    description: "High-energy choreography with synchronized movements",
    datesActive: "Jan 5 - Jan 25",
    videos: [
      { thumbnail: "/placeholder.svg", views: "4.2M", creator: "@dancer1" },
      { thumbnail: "/placeholder.svg", views: "3.7M", creator: "@dancer2" },
      { thumbnail: "/placeholder.svg", views: "2.9M", creator: "@dancer3" },
      { thumbnail: "/placeholder.svg", views: "3.3M", creator: "@dancer4" },
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
    description: "Creative transitions with visual effects and timing",
    datesActive: "Jan 8 - Jan 28",
    videos: [
      { thumbnail: "/placeholder.svg", views: "1.9M", creator: "@effects1" },
      { thumbnail: "/placeholder.svg", views: "2.4M", creator: "@effects2" },
      { thumbnail: "/placeholder.svg", views: "1.7M", creator: "@effects3" },
      { thumbnail: "/placeholder.svg", views: "2.1M", creator: "@effects4" },
    ],
    views: "178M",
    totalTrendVideos: "8.7K",
    growth: "+234%",
    viralScore: 7.9,
    momentum: "declining",
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
  }
];

const CreativeCardsGrid: React.FC<CreativeCardsGridProps> = ({ onCreativeSelect, selectedCreativeId }) => {
  // Show only first 3 creatives for clean layout
  const displayedCreatives = creatives.slice(0, 3);
  
  return (
    <div className="relative">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Trending Creatives</h2>
        <p className="text-gray-500 text-sm mb-6">Click a card to expand</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {displayedCreatives.map((creative, index) => (
            <FuturisticCreativeCard
              key={creative.id}
              creative={creative}
              isSelected={creative.id === selectedCreativeId}
              onSelect={onCreativeSelect}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(CreativeCardsGrid);