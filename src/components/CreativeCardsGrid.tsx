import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Play, Music, Dance, Palette, User, Hash, Sparkles, Video, Gamepad2, Heart, Camera, Eye, Flame, TrendingUp, Zap, TrendingDown } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface Creative {
  id: number;
  name: string;
  description: string;
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
    description: "Relatable humor with quick punchlines and reactions",
    datesActive: "Jan 10 - Jan 30",
    videos: [
      { thumbnail: "/placeholder.svg", views: "5.1M", creator: "@comedian1" },
      { thumbnail: "/placeholder.svg", views: "3.8M", creator: "@comedian2" },
      { thumbnail: "/placeholder.svg", views: "4.3M", creator: "@comedian3" },
      { thumbnail: "/placeholder.svg", views: "2.7M", creator: "@comedian4" },
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
  },
  {
    id: 5,
    name: "Gaming Moments",
    description: "Epic gameplay highlights and funny gaming reactions",
    datesActive: "Jan 12 - Feb 1",
    videos: [
      { thumbnail: "/placeholder.svg", views: "3.4M", creator: "@gamer1" },
      { thumbnail: "/placeholder.svg", views: "2.8M", creator: "@gamer2" },
      { thumbnail: "/placeholder.svg", views: "4.1M", creator: "@gamer3" },
      { thumbnail: "/placeholder.svg", views: "2.2M", creator: "@gamer4" },
    ],
    views: "289M",
    totalTrendVideos: "17.5K",
    growth: "+112%",
    viralScore: 8.3,
    momentum: "stable",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 48 },
        { range: "18-24", percentage: 36 },
        { range: "25-34", percentage: 12 },
        { range: "35+", percentage: 4 }
      ],
      genderSplit: { male: 72, female: 28 },
      topCountries: [
        { country: "USA", percentage: 29 },
        { country: "Germany", percentage: 16 },
        { country: "Brazil", percentage: 14 },
        { country: "France", percentage: 11 }
      ]
    },
    keyTakeaways: [
      "Rage moments get 2x more engagement",
      "Cross-game content broadens audience",
      "Live reaction overlays boost retention",
      "Clips under 30 seconds perform best"
    ],
    spotifyData: [
      { date: "Jan 12", streams: 1.8 },
      { date: "Jan 14", streams: 2.2 },
      { date: "Jan 16", streams: 2.6 },
      { date: "Jan 18", streams: 3.0 },
      { date: "Jan 20", streams: 3.3 },
      { date: "Jan 22", streams: 3.5 },
      { date: "Jan 24", streams: 3.4 },
      { date: "Jan 26", streams: 3.2 },
      { date: "Jan 28", streams: 2.9 },
      { date: "Jan 30", streams: 2.7 },
      { date: "Feb 1", streams: 2.5 }
    ]
  },
  {
    id: 6,
    name: "Fashion Showcase",
    description: "Outfit transformations and style inspiration content",
    datesActive: "Jan 15 - Feb 5",
    videos: [
      { thumbnail: "/placeholder.svg", views: "2.6M", creator: "@fashion1" },
      { thumbnail: "/placeholder.svg", views: "3.2M", creator: "@fashion2" },
      { thumbnail: "/placeholder.svg", views: "2.1M", creator: "@fashion3" },
      { thumbnail: "/placeholder.svg", views: "2.9M", creator: "@fashion4" },
    ],
    views: "198M",
    totalTrendVideos: "11.3K",
    growth: "+145%",
    viralScore: 8.1,
    momentum: "rising",
    demographics: {
      ageRanges: [
        { range: "13-17", percentage: 31 },
        { range: "18-24", percentage: 46 },
        { range: "25-34", percentage: 18 },
        { range: "35+", percentage: 5 }
      ],
      genderSplit: { male: 25, female: 75 },
      topCountries: [
        { country: "USA", percentage: 26 },
        { country: "Italy", percentage: 19 },
        { country: "France", percentage: 17 },
        { country: "Spain", percentage: 13 }
      ]
    },
    keyTakeaways: [
      "Before/after format drives saves",
      "Affordable alternatives increase shares",
      "Seasonal content sees 3x engagement",
      "Styling tips in captions boost interaction"
    ],
    spotifyData: [
      { date: "Jan 15", streams: 1.4 },
      { date: "Jan 17", streams: 1.7 },
      { date: "Jan 19", streams: 2.0 },
      { date: "Jan 21", streams: 2.3 },
      { date: "Jan 23", streams: 2.6 },
      { date: "Jan 25", streams: 2.8 },
      { date: "Jan 27", streams: 2.9 },
      { date: "Jan 29", streams: 2.7 },
      { date: "Jan 31", streams: 2.5 },
      { date: "Feb 2", streams: 2.3 },
      { date: "Feb 5", streams: 2.1 }
    ]
  }
];

const CreativeCardsGrid: React.FC<CreativeCardsGridProps> = ({ onCreativeSelect, selectedCreativeId }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {creatives.map((creative, index) => {
        const isSelected = creative.id === selectedCreativeId;
        
        return (
          <motion.div
            key={creative.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => onCreativeSelect(creative)}
            className="cursor-pointer"
          >
            <Card 
              className={`
                relative overflow-hidden transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-sky-500/30 via-blue-500/25 to-cyan-500/20 border-2 border-sky-400/50 shadow-2xl shadow-sky-400/40 scale-[1.05]' 
                  : 'bg-gradient-to-br from-sky-400/20 via-blue-400/15 to-cyan-400/10 backdrop-blur-md border border-sky-200/30 shadow-lg shadow-sky-200/20 hover:shadow-xl hover:shadow-sky-300/30'
                }
              `}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-sky-500/20 backdrop-blur-sm">
                      <Music className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{creative.name}</h3>
                      <p className="text-sm text-gray-600">{creative.description}</p>
                    </div>
                  </div>
                  {/* Trend Status Tag */}
                  <div className="flex items-center gap-2">
                    {creative.momentum === "rising" && (
                      <span className="px-3 py-1.5 bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/40 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        Hot
                      </span>
                    )}
                    {creative.momentum === "stable" && creative.viralScore >= 8 && (
                      <span className="px-3 py-1.5 bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/40 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Rising
                      </span>
                    )}
                    {creative.momentum === "stable" && creative.viralScore < 8 && (
                      <span className="px-3 py-1.5 bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/40 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Emerging
                      </span>
                    )}
                    {creative.momentum === "declining" && (
                      <span className="px-3 py-1.5 bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/40 flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        Dying
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {creative.views} views • {creative.totalTrendVideos} videos
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Active Period</span>
                    <span className="font-medium">{creative.datesActive}</span>
                  </div>
                </div>

                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                    {creative.videos.map((video, idx) => (
                      <CarouselItem key={idx} className="pl-2 basis-1/2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20">
                          <div className="aspect-[3/4] rounded-t-lg overflow-hidden bg-gray-100 relative group">
                            <img 
                              src={video.thumbnail} 
                              alt={`Video ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Tags at the top */}
                            <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
                              <span className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm border ${
                                video.gender === "Female" || (idx % 2 === 0) 
                                  ? "bg-white/50 text-pink-700 border-white/60" 
                                  : "bg-white/50 text-blue-700 border-white/60"
                              }`}>
                                {video.gender || (idx % 2 === 0 ? "Female" : "Male")}
                              </span>
                              <span className="px-3 py-1.5 bg-white/50 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/60">
                                {video.archetype || ["Gen Z", "Millennial", "Creator", "Influencer"][idx]}
                              </span>
                              <span className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm border ${
                                ["USA", "UK"].includes(video.region || ["USA", "MEX", "BRA", "UK"][idx])
                                  ? "bg-white/50 text-blue-700 border-white/60"
                                  : "bg-white/50 text-green-700 border-white/60"
                              }`}>
                                {video.region || ["USA", "MEX", "BRA", "UK"][idx]}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{video.views}</span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white/90" />
                  <CarouselNext className="right-0 bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white/90" />
                </Carousel>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
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

export default CreativeCardsGrid;