import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, Users, Globe, Target, Rocket, BarChart3, 
  Lightbulb, Calendar, Play, Heart, Eye, Share2,
  Zap, Flame, ArrowUpRight, Clock, ChevronLeft, ChevronRight, Sparkles, TrendingDown, Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Creative } from "./CreativeCardsGrid";

interface CreativeDetailsCardProps {
  selectedCreative: Creative | null;
}

const recommendedCreative: Creative = {
  id: 0,
  name: "Lip Singing with TOS",
  description: "Viral lip sync trend featuring dramatic emotional performances",
  datesActive: "Dec 20 - Jan 10",
  videos: [
    { thumbnail: "/placeholder.svg", views: "2.3M", creator: "@creator1" },
    { thumbnail: "/placeholder.svg", views: "1.8M", creator: "@creator2" },
    { thumbnail: "/placeholder.svg", views: "3.1M", creator: "@creator3" },
    { thumbnail: "/placeholder.svg", views: "1.5M", creator: "@creator4" },
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
  ]
};

const CreativeDetailsCard: React.FC<CreativeDetailsCardProps> = ({ selectedCreative }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [demographicsTimeFilter, setDemographicsTimeFilter] = useState('1 Week');
  const displayCreative = selectedCreative || recommendedCreative;

  useEffect(() => {
    if (selectedCreative) {
      setIsFlashing(true);
      setCurrentVideoIndex(0); // Reset carousel when switching creatives
      const timer = setTimeout(() => setIsFlashing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedCreative]);

  const nextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => 
      prev === displayCreative.videos.length - 1 ? 0 : prev + 1
    );
  }, [displayCreative.videos.length]);

  const prevVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? displayCreative.videos.length - 1 : prev - 1
    );
  }, [displayCreative.videos.length]);

  // Get demographics based on time filter
  const getDemographicsForPeriod = (period: string) => {
    const baseDemo = displayCreative.demographics;
    
    // Simulate different data for different time periods
    switch(period) {
      case '1 Day':
        return {
          ...baseDemo,
          genderSplit: { male: 42, female: 58 },
          ageRanges: [
            { range: "13-17", percentage: 35 },
            { range: "18-24", percentage: 45 },
            { range: "25-34", percentage: 15 },
            { range: "35+", percentage: 5 }
          ]
        };
      case '1 Week':
        return baseDemo; // Default data
      case '1 Month':
        return {
          ...baseDemo,
          genderSplit: { male: 38, female: 62 },
          ageRanges: [
            { range: "13-17", percentage: 40 },
            { range: "18-24", percentage: 35 },
            { range: "25-34", percentage: 18 },
            { range: "35+", percentage: 7 }
          ]
        };
      case '3 Months':
        return {
          ...baseDemo,
          genderSplit: { male: 33, female: 67 },
          ageRanges: [
            { range: "13-17", percentage: 45 },
            { range: "18-24", percentage: 32 },
            { range: "25-34", percentage: 16 },
            { range: "35+", percentage: 7 }
          ]
        };
      default:
        return baseDemo;
    }
  };

  const currentDemographics = getDemographicsForPeriod(demographicsTimeFilter);

  const renderViralScore = (score: number) => {
    const percentage = (score / 10) * 100;
    const color = score >= 8 ? "text-green-400" : score >= 6 ? "text-yellow-400" : "text-red-400";
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Viral Score</span>
          <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-full rounded-full ${
              score >= 8 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              score >= 6 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white/10 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{displayCreative.name}</h2>
              {displayCreative.momentum === "rising" && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                    <span className="text-xs font-semibold text-orange-400">Hot</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">Rising</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400">Emerging</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "declining" && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400">Dying</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-400">{displayCreative.description}</p>
          </div>
          <Button 
            className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-400/30 backdrop-blur-md rounded-full transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
            <Rocket className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors relative z-10" />
            <span className="font-medium text-sm group-hover:text-purple-300 transition-colors relative z-10">Scale</span>
            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs for detailed information */}
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="flex gap-8 bg-transparent p-0 mb-6 h-auto">
            <TabsTrigger 
              value="demographics" 
              className="px-4 py-2 bg-transparent text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-white/5 hover:text-white rounded-lg data-[state=active]:shadow-none"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              className="px-4 py-2 bg-transparent text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-white/5 hover:text-white rounded-lg data-[state=active]:shadow-none"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger 
              value="examples" 
              className="px-4 py-2 bg-transparent text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-white/5 hover:text-white rounded-lg data-[state=active]:shadow-none"
            >
              Examples
            </TabsTrigger>
            <TabsTrigger 
              value="creative-analysis" 
              className="px-4 py-2 bg-transparent text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-white/5 hover:text-white rounded-lg data-[state=active]:shadow-none"
            >
              Creative Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="mt-4">
            <div className="space-y-6">
              {/* Time Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Demographics from creators using this sound</span>
                </div>
                <div className="flex gap-2">
                  {['1 Day', '1 Week', '1 Month', '3 Months'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setDemographicsTimeFilter(period)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                        demographicsTimeFilter === period 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Demographics Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative">
                  <div className="absolute top-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 rounded-md border border-purple-500/20 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-[10px] text-purple-300 font-medium">Sound Demographics</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2 mt-8">
                    <Users className="w-4 h-4 text-purple-400" />
                    Gender
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-lg border border-pink-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Female</span>
                        <span className="text-sm font-bold text-pink-400">{currentDemographics.genderSplit.female}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-pink-500 to-pink-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentDemographics.genderSplit.female}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`female-${demographicsTimeFilter}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Dominant demographic • High engagement</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Male</span>
                        <span className="text-sm font-bold text-blue-400">{currentDemographics.genderSplit.male}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentDemographics.genderSplit.male}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`male-${demographicsTimeFilter}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Growing segment • Tech-savvy</p>
                    </div>
                  </div>
                </div>

                {/* Age Range */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    Age Range
                  </h4>
                  <div className="space-y-3">
                    {currentDemographics.ageRanges.map((range, index) => {
                      const colors = [
                        'from-green-500/10 to-emerald-500/10 border-green-500/20',
                        'from-purple-500/10 to-purple-600/10 border-purple-500/20',
                        'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
                        'from-orange-500/10 to-red-500/10 border-orange-500/20'
                      ];
                      const textColors = ['text-green-400', 'text-purple-400', 'text-blue-400', 'text-orange-400'];
                      const barColors = [
                        'from-green-500 to-emerald-500',
                        'from-purple-500 to-purple-400',
                        'from-blue-500 to-cyan-500',
                        'from-orange-500 to-red-500'
                      ];
                      
                      return (
                        <div key={range.range} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{range.range}</span>
                            <span className={`text-sm font-bold ${textColors[index]}`}>{range.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <motion.div 
                              className={`bg-gradient-to-r ${barColors[index]} h-full rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${range.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                              key={`age-${range.range}-${demographicsTimeFilter}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>


              </div>

              {/* Second Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Creator Archetypes */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Creator Archetypes
                  </h4>
                  <div className="space-y-3">
                    {(currentDemographics.creatorArchetypes || [
                      { type: "Influencer", percentage: 35 },
                      { type: "Entertainer", percentage: 30 },
                      { type: "Educator", percentage: 20 },
                      { type: "Artist", percentage: 15 }
                    ]).map((archetype, index) => {
                      const colors = [
                        'from-purple-500/10 to-pink-500/10 border-purple-500/20',
                        'from-yellow-500/10 to-orange-500/10 border-yellow-500/20',
                        'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
                        'from-green-500/10 to-emerald-500/10 border-green-500/20'
                      ];
                      const textColors = ['text-purple-400', 'text-yellow-400', 'text-cyan-400', 'text-green-400'];
                      const barColors = [
                        'from-purple-500 to-pink-500',
                        'from-yellow-500 to-orange-500',
                        'from-cyan-500 to-blue-500',
                        'from-green-500 to-emerald-500'
                      ];
                      
                      return (
                        <div key={archetype.type} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{archetype.type}</span>
                            <span className={`text-sm font-bold ${textColors[index]}`}>{archetype.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <motion.div 
                              className={`bg-gradient-to-r ${barColors[index]} h-full rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${archetype.percentage * 2}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Regions (Top Countries) */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Regions (Top Countries)
                  </h4>
                  <div className="space-y-3">
                    {currentDemographics.topCountries.map((country, index) => {
                      const colors = [
                        'from-blue-500/10 to-blue-600/10 border-blue-500/20',
                        'from-green-500/10 to-emerald-500/10 border-green-500/20',
                        'from-purple-500/10 to-pink-500/10 border-purple-500/20',
                        'from-orange-500/10 to-red-500/10 border-orange-500/20'
                      ];
                      const textColors = ['text-blue-400', 'text-green-400', 'text-purple-400', 'text-orange-400'];
                      const barColors = [
                        'from-blue-500 to-cyan-500',
                        'from-green-500 to-emerald-500',
                        'from-purple-500 to-pink-500',
                        'from-orange-500 to-red-500'
                      ];
                      
                      return (
                        <div key={country.country} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{country.country}</span>
                            <span className={`text-sm font-bold ${textColors[index]}`}>{country.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <motion.div 
                              className={`bg-gradient-to-r ${barColors[index]} h-full rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${country.percentage * 2}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>


            </div>
          </TabsContent>

          <TabsContent value="engagement" className="mt-4">
            <div className="space-y-10">
              {/* Engagement Analysis Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-base text-gray-300">Demographic Analytics</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Viral Score</span>
                    <span className="text-2xl font-bold text-green-400">{displayCreative.viralScore}/10</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm text-purple-300 font-medium">Live Analytics</span>
                  </div>
                </div>
              </div>

              {/* Top Row with Videos Carousel on Left */}
              <div className="grid grid-cols-3 gap-10">
                {/* Top Videos Carousel - Left Side */}
                <div className="col-span-1">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                    <h4 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
                      <Video className="w-7 h-7 text-purple-400" />
                      Top Videos
                    </h4>
                    <div className="relative flex-1 min-h-[600px]">
                      <div className="flex gap-4 overflow-x-auto scrollbar-hide h-full pb-2">
                        {displayCreative.videos.map((video, idx) => (
                          <div key={idx} className="flex-shrink-0 w-52 h-full">
                            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all h-full flex flex-col">
                              <div className="flex-1 bg-gray-900 relative min-h-[550px]">
                                <img src={video.thumbnail} alt={`Video ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                  <div className="text-white">
                                    <p className="text-2xl font-bold mb-2">{video.views}</p>
                                    <p className="text-base opacity-90">@{video.creator || `creator${idx + 1}`}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gender Performance - Takes up remaining 2 columns */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                {/* Gender Performance */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10">
                  <h4 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Gender
                  </h4>
                  
                  <div className="space-y-8">
                    {/* Female Performance */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-r from-pink-500/15 to-purple-500/15 rounded-xl p-4 border border-pink-500/30 shadow-lg shadow-pink-500/10">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-base font-semibold text-white">Female Creators</p>
                            <p className="text-sm text-gray-400">65% of total creators</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-pink-400">187M</p>
                            <p className="text-sm text-gray-400">views</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Avg Views</p>
                              <p className="text-3xl font-bold text-white">23.4K</p>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/15 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Engagement</p>
                              <p className="text-3xl font-bold text-green-400">+12%</p>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Retention</p>
                              <p className="text-3xl font-bold text-white">68%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Performance Score</span>
                            <span className="text-pink-400 font-semibold">8.7/10</span>
                          </div>
                          <div className="w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-full h-2">
                            <motion.div 
                              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: "87%" }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Male Performance */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-base font-semibold text-white">Male Creators</p>
                            <p className="text-sm text-gray-400">35% of total creators</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-blue-400">100M</p>
                            <p className="text-sm text-gray-400">views</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Avg Views</p>
                              <p className="text-3xl font-bold text-white">18.2K</p>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Engagement</p>
                              <p className="text-3xl font-bold text-yellow-400">+8%</p>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xl text-gray-400">Retention</p>
                              <p className="text-3xl font-bold text-white">62%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Performance Score</span>
                            <span className="text-blue-400 font-semibold">7.2/10</span>
                          </div>
                          <div className="w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-full h-2">
                            <motion.div 
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              initial={{ width: 0 }}
                              animate={{ width: "72%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Age Group Performance */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h4 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    Age Groups
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { range: "13-17", views: "95M", engagement: "+18%", color: "green", percentage: 42 },
                      { range: "18-24", views: "122M", engagement: "+15%", color: "purple", percentage: 38 },
                      { range: "25-34", views: "52M", engagement: "+9%", color: "blue", percentage: 15 },
                      { range: "35+", views: "18M", engagement: "+5%", color: "orange", percentage: 5 }
                    ].map((age, idx) => (
                      <motion.div
                        key={age.range}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-gradient-to-r ${
                          age.color === 'green' ? 'from-green-500/10 to-emerald-500/10 border-green-500/20' :
                          age.color === 'purple' ? 'from-purple-500/10 to-pink-500/10 border-purple-500/20' :
                          age.color === 'blue' ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' :
                          'from-orange-500/10 to-red-500/10 border-orange-500/20'
                        } rounded-xl p-3 border`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">{age.range} years</p>
                            <p className="text-sm text-gray-400">{age.percentage}% of audience</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-white">{age.views}</p>
                              <p className="text-sm text-gray-400">total views</p>
                            </div>
                            <div className={`px-2 py-1 rounded-lg bg-black/20 border ${
                              age.color === 'green' ? 'border-green-500/30' :
                              age.color === 'purple' ? 'border-purple-500/30' :
                              age.color === 'blue' ? 'border-blue-500/30' :
                              'border-orange-500/30'
                            }`}>
                              <p className={`text-sm font-semibold ${
                                age.color === 'green' ? 'text-green-400' :
                                age.color === 'purple' ? 'text-purple-400' :
                                age.color === 'blue' ? 'text-blue-400' :
                                'text-orange-400'
                              }`}>{age.engagement}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                </div>
              </div>

              {/* Creator Archetype Performance */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10">
                <h4 className="font-bold text-2xl text-white mb-8 flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-yellow-400" />
                  Creator Archetypes
                </h4>
                
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { 
                      type: "Influencers", 
                      views: "89M", 
                      avgViews: "125K", 
                      engagement: "9.2%",
                      growth: "+45%",
                      color: "purple",
                      topContent: "Lifestyle & Fashion"
                    },
                    { 
                      type: "Entertainers", 
                      views: "76M", 
                      avgViews: "85K", 
                      engagement: "8.5%",
                      growth: "+38%",
                      color: "pink",
                      topContent: "Comedy & Dance"
                    },
                    { 
                      type: "Educators", 
                      views: "62M", 
                      avgViews: "42K", 
                      engagement: "7.8%",
                      growth: "+22%",
                      color: "blue",
                      topContent: "Tutorials & Tips"
                    },
                    { 
                      type: "Artists", 
                      views: "60M", 
                      avgViews: "38K", 
                      engagement: "8.9%",
                      growth: "+31%",
                      color: "green",
                      topContent: "Music & Visual"
                    }
                  ].map((archetype, idx) => (
                    <motion.div
                      key={archetype.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative bg-gradient-to-br ${
                        archetype.color === 'purple' ? 'from-purple-500/10 to-pink-500/10' :
                        archetype.color === 'pink' ? 'from-pink-500/10 to-rose-500/10' :
                        archetype.color === 'blue' ? 'from-blue-500/10 to-cyan-500/10' :
                        'from-green-500/10 to-emerald-500/10'
                      } rounded-xl p-4 border ${
                        archetype.color === 'purple' ? 'border-purple-500/20' :
                        archetype.color === 'pink' ? 'border-pink-500/20' :
                        archetype.color === 'blue' ? 'border-blue-500/20' :
                        'border-green-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                          <div className={`px-2 py-0.5 rounded-full bg-black/20 border ${
                            archetype.color === 'purple' ? 'border-purple-500/30' :
                            archetype.color === 'pink' ? 'border-pink-500/30' :
                            archetype.color === 'blue' ? 'border-blue-500/30' :
                            'border-green-500/30'
                          }`}>
                            <span className={`text-sm font-semibold ${
                              archetype.color === 'purple' ? 'text-purple-400' :
                              archetype.color === 'pink' ? 'text-pink-400' :
                              archetype.color === 'blue' ? 'text-blue-400' :
                              'text-green-400'
                            }`}>{archetype.growth}</span>
                          </div>
                        </div>
                        
                        <h5 className="font-semibold text-base text-white mb-2">{archetype.type}</h5>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Total Views</span>
                            <span className="text-base font-bold text-white">{archetype.views}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Avg/Video</span>
                            <span className="text-base font-bold text-white">{archetype.avgViews}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Engagement</span>
                            <span className={`text-base font-bold ${
                              archetype.color === 'purple' ? 'text-purple-400' :
                              archetype.color === 'pink' ? 'text-pink-400' :
                              archetype.color === 'blue' ? 'text-blue-400' :
                              'text-green-400'
                            }`}>{archetype.engagement}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-sm text-gray-400">Top Content</p>
                          <p className="text-sm font-medium text-white">{archetype.topContent}</p>
                        </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-4">
            <div className="space-y-6">
              {/* Video Examples Grid */}
              <div>
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-400" />
                  Trending Examples
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {displayCreative.videos.map((video, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all">
                        <div className="aspect-[9/16] bg-gray-900 relative">
                          <img 
                            src={video.thumbnail} 
                            alt={`Example ${idx + 1}`} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center justify-between text-white">
                              <div>
                                <p className="text-sm font-semibold">{video.creator || `@creator${idx + 1}`}</p>
                                <p className="text-xs opacity-80">{video.views} views</p>
                              </div>
                              <div className="flex gap-2">
                                <div className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1">
                                  <span className="text-xs">{video.gender || (idx % 2 === 0 ? "Female" : "Male")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  Best Practices
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-white">Do's</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <span>Use trending audio at full volume</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <span>Film in vertical format (9:16)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <span>Add captions for accessibility</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-white">Don'ts</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span>Avoid copyrighted overlays</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span>Don't crop the video format</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span>Skip excessive filters</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Creative Analysis Tab */}
          <TabsContent value="creative-analysis" className="mt-4">
            <div className="space-y-6">
              {/* Key Takeaways */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Key Takeaways
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {displayCreative.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple-400">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-300">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creative Strategy */}
              <div className="grid grid-cols-2 gap-6">
                {/* Content Strategy */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Content Strategy
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Optimal Length</h5>
                      <p className="text-sm text-white">15-30 seconds</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Hook Timing</h5>
                      <p className="text-sm text-white">First 3 seconds critical</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Call to Action</h5>
                      <p className="text-sm text-white">End with engagement prompt</p>
                    </div>
                  </div>
                </div>

                {/* Production Tips */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    Production Tips
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Lighting</h5>
                      <p className="text-sm text-white">Natural light or ring light</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Audio Sync</h5>
                      <p className="text-sm text-white">Match beats precisely</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h5 className="text-xs font-medium text-purple-400 mb-1">Transitions</h5>
                      <p className="text-sm text-white">Smooth cuts on beat drops</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Prediction */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Performance Prediction
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">High</div>
                    <p className="text-xs text-gray-400">Viral Potential</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">3-5</div>
                    <p className="text-xs text-gray-400">Weeks Trending</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">2.5x</div>
                    <p className="text-xs text-gray-400">Avg. Engagement</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(CreativeDetailsCard);