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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{displayCreative.name}</h2>
              {displayCreative.momentum === "rising" && (
                <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Hot
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  Rising
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  Emerging
                </Badge>
              )}
              {displayCreative.momentum === "declining" && (
                <Badge className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border border-gray-500/30 font-medium flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
                  Dying
                </Badge>
              )}
            </div>
            <p className="text-gray-400">{displayCreative.description}</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border border-purple-400/30 backdrop-blur-md shadow-lg rounded-full px-6"
          >
            <Rocket className="w-4 h-4" />
            Scale
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
            <div className="space-y-6">
              {/* Engagement Analysis Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Engagement analysis across different creator segments</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between min-h-[120px] transform-gpu"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 leading-tight">Total</p>
                      <p className="text-xs text-gray-400 leading-tight">Views</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{displayCreative.views}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between min-h-[120px] transform-gpu"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 leading-tight">Detected</p>
                      <p className="text-xs text-gray-400 leading-tight">Videos</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{displayCreative.totalTrendVideos || "12.4K"}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between min-h-[120px] transform-gpu"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-xs text-gray-400">Growth</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{displayCreative.growth}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between min-h-[120px] transform-gpu"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 leading-tight">Dates</p>
                      <p className="text-xs text-gray-400 leading-tight">Active</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-white leading-tight">{displayCreative.datesActive}</p>
                </motion.div>
              </div>

              {/* Viral Score */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                {renderViralScore(displayCreative.viralScore)}
              </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Engagement Stats & Videos */}
              <div className="space-y-4">
                {/* Engagement Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Eye className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{displayCreative.views}</p>
                        <p className="text-sm text-gray-400">Total Views</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/20 rounded-xl">
                        <Video className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{displayCreative.totalTrendVideos}</p>
                        <p className="text-sm text-gray-400">Detected Videos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Videos Carousel */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                  <h4 className="font-medium text-white mb-4">Top Performing Videos</h4>
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {displayCreative.videos.slice(0, 3).map((video, idx) => (
                        <div key={idx} className="flex-shrink-0 w-48">
                          <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all">
                            <div className="aspect-[9/16] bg-gray-900 relative">
                              <img src={video.thumbnail} alt={`Video ${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                <div className="text-white">
                                  <p className="text-sm font-semibold">{video.views}</p>
                                  <p className="text-xs opacity-80">by @{video.creator || `creator${idx + 1}`}</p>
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

              {/* Right Side - Engagement Insights */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  Engagement Analysis
                </h4>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="font-medium text-white mb-2">Content Performance</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        <span>Videos using this trend achieve an average of {Math.floor(parseInt(displayCreative.views.replace(/[^\d]/g, '')) / parseInt(displayCreative.totalTrendVideos.replace(/[^\d]/g, ''))).toLocaleString()} views per post</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                        <span>Peak engagement occurs during {displayCreative.momentum === 'rising' ? 'evening hours (7-11 PM)' : 'afternoon hours (2-6 PM)'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        <span>Tutorial-style content sees {displayCreative.momentum === 'rising' ? '5x' : '3x'} higher completion rates</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="font-medium text-white mb-2">Growth Trajectory</h5>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      This trend is currently {displayCreative.momentum} with a {displayCreative.growth} growth rate. 
                      {displayCreative.momentum === 'rising' 
                        ? ' Optimal time to launch campaigns and maximize reach before market saturation.'
                        : displayCreative.momentum === 'stable'
                        ? ' Consistent performance indicates reliable engagement for long-term campaigns.'
                        : ' Consider refreshing creative approach or pivoting to emerging trends.'}
                    </p>
                  </div>
                </div>
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