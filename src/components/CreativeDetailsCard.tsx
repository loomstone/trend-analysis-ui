import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  TrendingUp, Rocket, 
  Lightbulb, Play,
  Zap, Flame, Clock, ChevronLeft, ChevronRight, Sparkles, TrendingDown, Video, X, Filter, Check
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
  
  // Examples Tab Filter States - Now support multiple selections
  const [genderFilter, setGenderFilter] = useState<Set<string>>(new Set());
  const [ageFilter, setAgeFilter] = useState<Set<string>>(new Set());
  const [regionFilter, setRegionFilter] = useState<Set<string>>(new Set());
  const [archetypeFilter, setArchetypeFilter] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'high-views' | 'low-views' | 'recent' | 'trending'>('high-views');
  
  // Helper functions for multi-select filters
  const toggleFilter = (filterSet: Set<string>, setFilter: (set: Set<string>) => void, value: string) => {
    const newSet = new Set(filterSet);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setFilter(newSet);
  };
  
  const clearAllFilters = () => {
    setGenderFilter(new Set());
    setAgeFilter(new Set());
    setRegionFilter(new Set());
    setArchetypeFilter(new Set());
  };
  
  const displayCreative = selectedCreative || recommendedCreative;
  
  // Enhanced video data with metadata for filtering
  const allVideos = [
    { thumbnail: "/placeholder.svg", views: "3.1M", viewCount: 3100000, creator: "@alexsmith", gender: "female", age: "18-24", region: "USA", archetype: "Influencer", trending: true },
    { thumbnail: "/placeholder.svg", views: "2.8M", viewCount: 2800000, creator: "@mariagarcia", gender: "female", age: "25-34", region: "Mexico", archetype: "Entertainer", trending: true },
    { thumbnail: "/placeholder.svg", views: "2.3M", viewCount: 2300000, creator: "@jennylee", gender: "female", age: "13-17", region: "USA", archetype: "Artist", trending: false },
    { thumbnail: "/placeholder.svg", views: "2.1M", viewCount: 2100000, creator: "@pedrosilva", gender: "male", age: "18-24", region: "Brazil", archetype: "Entertainer", trending: true },
    { thumbnail: "/placeholder.svg", views: "1.9M", viewCount: 1900000, creator: "@mikejohnson", gender: "male", age: "25-34", region: "USA", archetype: "Educator", trending: false },
    { thumbnail: "/placeholder.svg", views: "1.8M", viewCount: 1800000, creator: "@sophiachen", gender: "female", age: "18-24", region: "Canada", archetype: "Influencer", trending: true },
    { thumbnail: "/placeholder.svg", views: "1.5M", viewCount: 1500000, creator: "@putriwijaya", gender: "female", age: "13-17", region: "Indonesia", archetype: "Artist", trending: false },
    { thumbnail: "/placeholder.svg", views: "1.3M", viewCount: 1300000, creator: "@davidkim", gender: "male", age: "35+", region: "USA", archetype: "Educator", trending: false },
    { thumbnail: "/placeholder.svg", views: "1.2M", viewCount: 1200000, creator: "@lucasrodrigues", gender: "male", age: "18-24", region: "Brazil", archetype: "Entertainer", trending: true },
    { thumbnail: "/placeholder.svg", views: "980K", viewCount: 980000, creator: "@emilywang", gender: "female", age: "25-34", region: "UK", archetype: "Influencer", trending: false },
    { thumbnail: "/placeholder.svg", views: "850K", viewCount: 850000, creator: "@carlosmartinez", gender: "male", age: "13-17", region: "Mexico", archetype: "Artist", trending: true },
    { thumbnail: "/placeholder.svg", views: "720K", viewCount: 720000, creator: "@sarahthompson", gender: "female", age: "35+", region: "UK", archetype: "Educator", trending: false }
  ];
  
  // Filter and sort videos based on selected filters
  const getFilteredVideos = () => {
    let filtered = [...allVideos];
    
    // Apply gender filter (if any selections)
    if (genderFilter.size > 0) {
      filtered = filtered.filter(v => genderFilter.has(v.gender));
    }
    
    // Apply age filter (if any selections)
    if (ageFilter.size > 0) {
      filtered = filtered.filter(v => ageFilter.has(v.age));
    }
    
    // Apply region filter (if any selections)
    if (regionFilter.size > 0) {
      filtered = filtered.filter(v => regionFilter.has(v.region));
    }
    
    // Apply archetype filter (if any selections)
    if (archetypeFilter.size > 0) {
      filtered = filtered.filter(v => archetypeFilter.has(v.archetype));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'high-views':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'low-views':
        filtered.sort((a, b) => a.viewCount - b.viewCount);
        break;
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'recent':
        // For demo, just reverse the order
        filtered.reverse();
        break;
    }
    
    return filtered;
  };

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
    const color = score >= 8 ? "text-green-500" : score >= 6 ? "text-yellow-500" : "text-red-500";
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Viral Score</span>
          <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className={`h-full rounded-full ${
              score >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              score >= 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
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
    <Card className="relative bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gray-100 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{displayCreative.name}</h2>
              {displayCreative.momentum === "rising" && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                    <span className="text-xs font-semibold text-orange-600">Hot</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">Rising</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">Emerging</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "declining" && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500">Dying</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-600">{displayCreative.description}</p>
          </div>
          <Button 
            className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 rounded-full transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-700/0 group-hover:from-blue-600/20 group-hover:to-blue-700/20 transition-all duration-300" />
            <Rocket className="w-4 h-4 text-white transition-colors relative z-10" />
            <span className="font-medium text-sm text-white transition-colors relative z-10">Scale</span>
            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs for detailed information */}
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="flex gap-8 bg-transparent p-0 mb-6 h-auto">
            <TabsTrigger 
              value="demographics" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger 
              value="examples" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none"
            >
              Examples
            </TabsTrigger>
            <TabsTrigger 
              value="creative-analysis" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none"
            >
              Creative Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="mt-4">
            <div className="space-y-6">
              {/* Time Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Demographics from creators using this sound</span>
                </div>
                <div className="flex gap-2">
                  {['1 Day', '1 Week', '1 Month', '3 Months'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setDemographicsTimeFilter(period)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                        demographicsTimeFilter === period 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
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
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative">
                  <div className="absolute top-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-200 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-[10px] text-blue-600 font-medium">Sound Demographics</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 mt-8">
                    <Users className="w-4 h-4 text-blue-600" />
                    Gender
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Female</span>
                        <span className="text-sm font-bold text-pink-400">{currentDemographics.genderSplit.female}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentDemographics.genderSplit.female}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`female-${demographicsTimeFilter}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Dominant demographic • High engagement</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Male</span>
                        <span className="text-sm font-bold text-blue-400">{currentDemographics.genderSplit.male}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentDemographics.genderSplit.male}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`male-${demographicsTimeFilter}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Growing segment • Tech-savvy</p>
                    </div>
                  </div>
                </div>

                {/* Age Range */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    Age Range
                  </h4>
                  <div className="space-y-3">
                    {currentDemographics.ageRanges.map((range, index) => {
                      const colors = [
                        'from-green-500/10 to-emerald-500/10 border-green-500/20',
                        'from-blue-500/10 to-blue-600/10 border-blue-200',
                        'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
                        'from-orange-500/10 to-red-500/10 border-orange-500/20'
                      ];
                      const textColors = ['text-green-500', 'text-blue-500', 'text-blue-500', 'text-orange-500'];
                      const barColors = [
                        'from-green-500 to-emerald-500',
                        'from-blue-500 to-blue-400',
                        'from-blue-500 to-cyan-500',
                        'from-orange-500 to-red-500'
                      ];
                      
                      return (
                        <div key={range.range} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{range.range}</span>
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
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        'from-blue-500/10 to-blue-600/10 border-blue-500/20',
                        'from-yellow-500/10 to-orange-500/10 border-yellow-500/20',
                        'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
                        'from-green-500/10 to-emerald-500/10 border-green-500/20'
                      ];
                      const textColors = ['text-blue-500', 'text-yellow-500', 'text-cyan-500', 'text-green-500'];
                      const barColors = [
                        'from-blue-500 to-blue-600',
                        'from-yellow-500 to-orange-500',
                        'from-cyan-500 to-blue-500',
                        'from-green-500 to-emerald-500'
                      ];
                      
                      return (
                        <div key={archetype.type} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{archetype.type}</span>
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
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Regions (Top Countries)
                  </h4>
                  <div className="space-y-3">
                    {currentDemographics.topCountries.map((country, index) => {
                      const colors = [
                        'from-blue-500/10 to-blue-600/10 border-blue-500/20',
                        'from-green-500/10 to-emerald-500/10 border-green-500/20',
                        'from-blue-500/10 to-blue-600/10 border-blue-500/20',
                        'from-orange-500/10 to-red-500/10 border-orange-500/20'
                      ];
                      const textColors = ['text-blue-500', 'text-green-500', 'text-blue-500', 'text-orange-500'];
                      const barColors = [
                        'from-blue-500 to-cyan-500',
                        'from-green-500 to-emerald-500',
                        'from-blue-500 to-blue-600',
                        'from-orange-500 to-red-500'
                      ];
                      
                      return (
                        <div key={country.country} className={`p-3 bg-gradient-to-r ${colors[index]} rounded-lg border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{country.country}</span>
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
              {/* Best Performers Highlight Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Top Performers At A Glance</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-2 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-green-300 font-medium">Live Data</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  {/* Best Gender Performance */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <span className="text-xs font-bold text-green-400">BEST</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Top Gender</p>
                      <p className="text-2xl font-bold text-gray-900">Female</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Views</span>
                        <span className="text-sm font-bold text-pink-400">187M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">vs Average</span>
                        <span className="text-sm font-bold text-green-400">+46%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Age Group */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <span className="text-xs font-bold text-green-400">BEST</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Top Age Group</p>
                      <p className="text-2xl font-bold text-gray-900">18-24</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Views</span>
                        <span className="text-sm font-bold text-blue-600">122M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Engagement</span>
                        <span className="text-sm font-bold text-green-400">+15%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Region */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <span className="text-xs font-bold text-green-400">BEST</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Top Region</p>
                      <p className="text-2xl font-bold text-gray-900">USA</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Market Share</span>
                        <span className="text-sm font-bold text-blue-400">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Growth</span>
                        <span className="text-sm font-bold text-green-400">+52%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Creator Type */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <span className="text-xs font-bold text-green-400">BEST</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Top Creator Type</p>
                      <p className="text-2xl font-bold text-gray-900">Influencers</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Avg Views</span>
                        <span className="text-sm font-bold text-blue-600">125K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Engagement</span>
                        <span className="text-sm font-bold text-green-400">9.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Insights */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">Female creators</span> outperform others by 46%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                      <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">USA market</span> shows highest growth potential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">18-24 age group</span> drives viral momentum</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Regional Market Intelligence */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="font-bold text-2xl text-gray-900">Global Market Intelligence</h4>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-2"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span>Total Coverage:</span>
                      <span className="font-bold text-gray-900 ml-1">77 Countries</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-xs text-blue-300 font-medium">Market Analysis</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { 
                      country: "🇺🇸 USA", 
                      views: "80M", 
                      percentage: 28, 
                      growth: "+52%", 
                      rank: 1,
                      engagement: "8.9%",
                      avgViews: "45K",
                      topCreator: "@alexsmith",
                      marketInsight: "Highest purchasing power and brand partnerships",
                      primaryDemo: "25-34 years, Urban professionals",
                      bestTime: "6-9PM EST",
                      trendingContent: ["Lifestyle", "Tech Reviews", "Business"],
                      competitiveness: "Very High",
                      monetizationPotential: "Excellent",
                      languagePreference: "English (98%)"
                    },
                    { 
                      country: "🇲🇽 Mexico", 
                      views: "63M", 
                      percentage: 22, 
                      growth: "+38%", 
                      rank: 2,
                      engagement: "7.8%",
                      avgViews: "38K",
                      topCreator: "@mariagarcia",
                      marketInsight: "Rapidly growing, high engagement rates",
                      primaryDemo: "18-29 years, Entertainment focused",
                      bestTime: "7-10PM CST",
                      trendingContent: ["Music", "Comedy", "Food"],
                      competitiveness: "Moderate",
                      monetizationPotential: "Growing",
                      languagePreference: "Spanish (95%)"
                    },
                    { 
                      country: "🇧🇷 Brazil", 
                      views: "43M", 
                      percentage: 15, 
                      growth: "+25%", 
                      rank: 3,
                      engagement: "7.2%",
                      avgViews: "32K",
                      topCreator: "@pedrosilva",
                      marketInsight: "Strong community engagement, viral potential",
                      primaryDemo: "16-28 years, Social & Sports",
                      bestTime: "8-11PM BRT",
                      trendingContent: ["Sports", "Music", "Dance"],
                      competitiveness: "High",
                      monetizationPotential: "Good",
                      languagePreference: "Portuguese (92%)"
                    },
                    { 
                      country: "🇮🇩 Indonesia", 
                      views: "34M", 
                      percentage: 12, 
                      growth: "+41%", 
                      rank: 4,
                      engagement: "8.1%",
                      avgViews: "28K",
                      topCreator: "@putriwijaya",
                      marketInsight: "Emerging market with high growth potential",
                      primaryDemo: "18-32 years, Mobile-first users",
                      bestTime: "7-9PM WIB",
                      trendingContent: ["Gaming", "Education", "Lifestyle"],
                      competitiveness: "Low-Medium",
                      monetizationPotential: "High Growth",
                      languagePreference: "Indonesian (88%)"
                    }
                  ].map((region, idx) => (
                    <motion.div
                      key={region.country}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`relative overflow-hidden rounded-xl border-2 ${
                        idx === 0 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40 shadow-xl shadow-yellow-500/20' 
                          : idx === 1
                          ? 'bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-500/30 shadow-lg shadow-green-500/10'
                          : idx === 2
                          ? 'bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border-blue-500/30'
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                      }`}
                    >
                      {/* Market Leader Banner for #1 */}
                      {idx === 0 && (
                        <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-6 py-2 border-b border-yellow-500/30">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                            <span className="text-sm font-bold text-yellow-200 uppercase tracking-wide">Market Leader</span>
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Rank Badge */}
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                          idx === 0 
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30 border-yellow-300' 
                            : idx === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/30 border-gray-200'
                            : idx === 2
                            ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-600/30 border-amber-400'
                            : 'bg-gradient-to-br from-slate-500 to-slate-600 text-white border-slate-400'
                        }`}>
                          #{region.rank}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h5 className="text-2xl font-bold text-white mb-1">{region.country}</h5>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-3xl font-bold ${
                                idx === 0 ? 'text-yellow-400' :
                                idx === 1 ? 'text-green-400' :
                                idx === 2 ? 'text-blue-400' :
                                'text-blue-600'
                              }`}>{region.views}</span>
                              <div className={`px-3 py-1 rounded-full border ${
                                parseFloat(region.growth) > 50 
                                  ? 'bg-green-500/20 border-green-500/30' 
                                  : parseFloat(region.growth) > 35
                                  ? 'bg-blue-500/20 border-blue-500/30'
                                  : 'bg-yellow-500/20 border-yellow-500/30'
                              }`}>
                                <span className={`text-sm font-bold ${
                                  parseFloat(region.growth) > 50 ? 'text-green-400' :
                                  parseFloat(region.growth) > 35 ? 'text-blue-400' :
                                  'text-yellow-400'
                                }`}>{region.growth}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{region.percentage}% global market</span>
                              <div className="flex items-center gap-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span>Weekly growth</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Core KPIs */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Engagement</p>
                              <p className={`text-xl font-bold ${
                                idx === 0 ? 'text-yellow-400' :
                                idx === 1 ? 'text-green-400' :
                                idx === 2 ? 'text-blue-400' :
                                'text-blue-600'
                              }`}>{region.engagement}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">+1.2%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Views</p>
                              <p className="text-xl font-bold text-white">{region.avgViews}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">+8%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Peak Time</p>
                              <p className="text-lg font-bold text-cyan-400">{region.bestTime}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-cyan-400 text-xs font-bold">⏰</span>
                                <span className="text-xs text-cyan-400">Local</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Market Intelligence */}
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Market Insight</p>
                            <p className="text-sm text-gray-900 font-medium">{region.marketInsight}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Demographics</p>
                              <p className="text-sm text-gray-900">{region.primaryDemo}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Competition</p>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                region.competitiveness === 'Very High' ? 'bg-red-500/20 text-red-400' :
                                region.competitiveness === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                region.competitiveness === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {region.competitiveness}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Monetization</p>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                region.monetizationPotential === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                                region.monetizationPotential === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                                region.monetizationPotential === 'Growing' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {region.monetizationPotential}
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Language</p>
                              <p className="text-sm text-gray-900">{region.languagePreference}</p>
                            </div>
                          </div>
                          
                          {/* Trending Content Categories */}
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Trending Content</p>
                            <div className="flex gap-2">
                              {region.trendingContent.map((category, catIdx) => (
                                <div key={category} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                                  catIdx === 0 
                                    ? (idx === 0 ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
                                       idx === 1 ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                                       idx === 2 ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                                       'bg-blue-50 border-blue-200 text-blue-600')
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                  {category}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Top Creator and Performance Bar */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div>
                              <p className="text-xs text-gray-500">Top Creator</p>
                              <p className={`text-sm font-bold ${
                                idx === 0 ? 'text-yellow-400' :
                                idx === 1 ? 'text-green-400' :
                                idx === 2 ? 'text-blue-400' :
                                'text-blue-600'
                              }`}>{region.topCreator}</p>
                            </div>
                            <div className="text-right text-xs text-gray-600">
                              Market Penetration
                              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                <motion.div 
                                  className={`h-full rounded-full ${
                                    idx === 0 
                                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                      : idx === 1
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                      : idx === 2
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${region.percentage * 3}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Global Market Insights Summary */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="mb-4">
                    <h5 className="font-bold text-lg text-gray-900">Strategic Market Recommendations</h5>
                    <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">USA</span> - Focus on premium content and brand partnerships</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">Mexico</span> - Leverage high engagement for rapid growth</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">Brazil</span> - Community-driven content performs best</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="text-sm text-gray-600"><span className="font-bold text-gray-900">Indonesia</span> - Untapped potential, mobile-first approach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Demographics Grid - Full Width */}
              <div className="grid grid-cols-2 gap-8">
                {/* Enhanced Gender Performance Analytics */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-bold text-2xl text-gray-900">Gender Performance Deep Dive</h4>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span>Baseline:</span>
                        <span className="font-bold text-gray-900 ml-1">143.5M views</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-300 font-medium">Live Analytics</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Female Performance - TOP PERFORMER */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      {/* Champion Badge */}
                      <div className="absolute -top-3 -left-3 z-10">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg shadow-yellow-500/30">
                          <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            CHAMPION
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300 shadow-xl shadow-blue-500/20">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-gray-900">Female Creators</p>
                              <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                                <span className="text-xs font-bold text-green-400">+46% vs avg</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>65% market share</span>
                              <div className="flex items-center gap-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span>+8% this month</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-bold text-pink-400">187M</p>
                            <p className="text-sm text-gray-600">total views</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <span className="text-green-400 text-xs font-bold">↗</span>
                              <span className="text-xs text-green-400 font-medium">+15.3% WoW</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced KPI Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Views</p>
                              <p className="text-2xl font-bold text-gray-900">23.4K</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">+12%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/15 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Engagement</p>
                              <p className="text-2xl font-bold text-green-400">12.8%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">+2.1%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Retention</p>
                              <p className="text-2xl font-bold text-gray-900">68%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-blue-600 text-xs font-bold">↗</span>
                                <span className="text-xs text-blue-600">+5%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/15 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">CTR</p>
                              <p className="text-2xl font-bold text-yellow-400">4.7%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-yellow-400">+0.8%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance Visualization */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Performance Score</span>
                            <div className="flex items-center gap-2">
                              <span className="text-pink-400 font-bold">8.7/10</span>
                              <div className="px-2 py-0.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                                <span className="text-xs font-bold text-yellow-400">ELITE</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gradient-to-r from-white/5 to-white/10 rounded-full h-2.5">
                            <motion.div 
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                              initial={{ width: 0 }}
                              animate={{ width: "87%" }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Bottom 10%</span>
                            <span>Industry Average</span>
                            <span>Top 10%</span>
                          </div>
                        </div>

                        {/* Top Performing Categories */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-3">Top Categories</p>
                          <div className="flex gap-2">
                            {['Fashion', 'Lifestyle', 'Beauty', 'Wellness'].map((category, idx) => (
                              <div key={category} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                                idx === 0 ? 'bg-pink-500/20 border-blue-300 text-pink-300' :
                                'bg-gray-50 border-gray-200 text-gray-600'
                              }`}>
                                {category}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Male Performance - UNDERPERFORMING */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      {/* Underperforming Badge */}
                      <div className="absolute -top-3 -left-3 z-10">
                        <div className="px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
                          <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                            <span className="text-red-400">↘</span>
                            UNDERPERFORMING
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-slate-600/10 to-slate-500/10 rounded-xl p-6 border border-slate-500/20">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-gray-900">Male Creators</p>
                              <div className="px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                                <span className="text-xs font-bold text-red-400">-30% vs avg</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>35% market share</span>
                              <div className="flex items-center gap-1">
                                <span className="text-red-400 text-xs font-bold">↘</span>
                                <span>-2% this month</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-bold text-slate-300">100M</p>
                            <p className="text-sm text-gray-600">total views</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <span className="text-red-400 text-xs font-bold">↘</span>
                              <span className="text-xs text-red-400 font-medium">-5.2% WoW</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* KPI Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/10 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Views</p>
                              <p className="text-2xl font-bold text-gray-900">18.2K</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-red-400 text-xs font-bold">↘</span>
                                <span className="text-xs text-red-400">-8%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Engagement</p>
                              <p className="text-2xl font-bold text-yellow-400">8.1%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-gray-600 text-xs font-bold">−</span>
                                <span className="text-xs text-gray-600">0%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/10 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Retention</p>
                              <p className="text-2xl font-bold text-gray-900">62%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-red-400 text-xs font-bold">↘</span>
                                <span className="text-xs text-red-400">-3%</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative overflow-hidden rounded-lg p-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent" />
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">CTR</p>
                              <p className="text-2xl font-bold text-orange-400">3.2%</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-red-400 text-xs font-bold">↘</span>
                                <span className="text-xs text-red-400">-0.5%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance Visualization */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Performance Score</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 font-bold">6.2/10</span>
                              <div className="px-2 py-0.5 bg-red-500/20 rounded-full border border-red-500/30">
                                <span className="text-xs font-bold text-red-400">NEEDS IMPROVEMENT</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gradient-to-r from-white/5 to-white/10 rounded-full h-2.5">
                            <motion.div 
                              className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400"
                              initial={{ width: 0 }}
                              animate={{ width: "62%" }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Bottom 10%</span>
                            <span>Industry Average</span>
                            <span>Top 10%</span>
                          </div>
                        </div>

                        {/* Growth Opportunities */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-3">Growth Opportunities</p>
                          <div className="flex gap-2">
                            {['Gaming', 'Tech', 'Sports', 'Business'].map((category, idx) => (
                              <div key={category} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                                idx === 0 ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                                'bg-gray-50 border-white/10 text-gray-600'
                              }`}>
                                {category}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Advanced Age Group Analytics */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-bold text-2xl text-white">Age Demographics Deep Analysis</h4>
                      <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mt-2"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span>Industry Average:</span>
                        <span className="font-bold text-white ml-1">71.8M</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-xs text-green-300 font-medium">Real-time Data</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        range: "18-24", views: "122M", engagement: "15.2%", color: "purple", 
                        percentage: 38, rank: 1, vsAvg: "+70%", trending: "up",
                        retention: "72%", ctr: "5.1%", shareRate: "8.3%", growth: "+28%",
                        primaryContent: "Lifestyle & Fashion", peakHours: "7-11PM"
                      },
                      { 
                        range: "13-17", views: "95M", engagement: "18.4%", color: "green", 
                        percentage: 42, rank: 2, vsAvg: "+32%", trending: "up",
                        retention: "69%", ctr: "4.8%", shareRate: "12.1%", growth: "+35%",
                        primaryContent: "Entertainment & Dance", peakHours: "4-8PM"
                      },
                      { 
                        range: "25-34", views: "52M", engagement: "9.1%", color: "blue", 
                        percentage: 15, rank: 3, vsAvg: "-28%", trending: "stable",
                        retention: "64%", ctr: "3.2%", shareRate: "4.7%", growth: "+8%",
                        primaryContent: "Educational & How-to", peakHours: "12-2PM"
                      },
                      { 
                        range: "35+", views: "18M", engagement: "5.3%", color: "orange", 
                        percentage: 5, rank: 4, vsAvg: "-75%", trending: "down",
                        retention: "58%", ctr: "2.8%", shareRate: "2.9%", growth: "-12%",
                        primaryContent: "News & Commentary", peakHours: "6-9AM"
                      }
                    ].map((age, idx) => (
                      <motion.div
                        key={age.range}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
                      >
                        {/* Enhanced Rank Badge */}
                        <div className="absolute -left-4 top-6">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            age.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30' :
                            age.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/30' :
                            age.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-600/30' :
                            'bg-gradient-to-br from-slate-500 to-slate-600 text-white'
                          }`}>
                            #{age.rank}
                            {age.rank === 1 && <Crown className="w-3 h-3 absolute -top-1 -right-1" />}
                          </div>
                        </div>
                        
                        <div className={`ml-10 rounded-xl border-2 overflow-hidden ${
                          age.rank === 1 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-xl shadow-blue-500/20' 
                            : age.rank === 2
                            ? 'bg-gradient-to-r from-green-500/15 to-emerald-500/15 border-green-500/30 shadow-lg shadow-green-500/10'
                            : age.rank === 3
                            ? 'bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border-blue-500/30'
                            : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 border-gray-500/20'
                        }`}>
                          
                          {/* Champion Banner for #1 */}
                          {age.rank === 1 && (
                            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-6 py-2 border-b border-blue-200">
                              <div className="flex items-center justify-center gap-2">
                                <Flame className="w-4 h-4 text-yellow-400 animate-pulse" />
                                <span className="text-sm font-bold text-yellow-200 uppercase tracking-wide">Dominant Age Group</span>
                                <Flame className="w-4 h-4 text-yellow-400 animate-pulse" />
                              </div>
                            </div>
                          )}
                          
                          <div className="p-6">
                            {/* Header Section */}
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="text-2xl font-bold text-white">{age.range} Years</h5>
                                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    parseFloat(age.vsAvg) > 50 
                                      ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                                      : parseFloat(age.vsAvg) > 0
                                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                                      : 'bg-red-500/20 border-red-500/30 text-red-400'
                                  }`}>
                                    {age.vsAvg} vs industry
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{age.percentage}% market share</span>
                                  <div className="flex items-center gap-1">
                                    {age.trending === 'up' ? (
                                      <span className="text-green-400 text-xs font-bold">↗</span>
                                    ) : age.trending === 'down' ? (
                                      <span className="text-red-400 text-xs font-bold">↘</span>
                                    ) : (
                                      <span className="text-gray-600 text-xs font-bold">−</span>
                                    )}
                                    <span className="font-medium">{age.growth} monthly</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-4xl font-bold ${
                                  age.color === 'purple' ? 'text-blue-600' :
                                  age.color === 'green' ? 'text-green-400' :
                                  age.color === 'blue' ? 'text-blue-400' :
                                  'text-orange-400'
                                }`}>{age.views}</p>
                                <p className="text-sm text-gray-600">total views</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  {age.trending === 'up' ? (
                                    <span className="text-green-400 text-xs font-bold">↗</span>
                                  ) : age.trending === 'down' ? (
                                    <span className="text-red-400 text-xs font-bold">↘</span>
                                  ) : (
                                    <span className="text-gray-600 text-xs font-bold">−</span>
                                  )}
                                  <span className={`text-xs font-medium ${
                                    age.trending === 'up' ? 'text-green-400' :
                                    age.trending === 'down' ? 'text-red-400' :
                                    'text-gray-600'
                                  }`}>
                                    {age.engagement} engagement
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced KPI Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                              <div className="relative overflow-hidden rounded-lg p-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5" />
                                <div className={`absolute inset-0 bg-gradient-to-tr ${
                                  age.color === 'purple' ? 'from-blue-50 to-transparent' :
                                  age.color === 'green' ? 'from-green-500/15 to-transparent' :
                                  age.color === 'blue' ? 'from-blue-500/15 to-transparent' :
                                  'from-orange-500/15 to-transparent'
                                }`} />
                                <div className="relative z-10">
                                  <p className="text-xs text-gray-600 uppercase tracking-wide">Retention</p>
                                  <p className="text-xl font-bold text-white">{age.retention}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {age.trending === 'up' ? (
                                      <span className="text-green-400 text-xs font-bold">↗</span>
                                    ) : (
                                      <span className="text-red-400 text-xs font-bold">↘</span>
                                    )}
                                    <span className={`text-xs ${
                                      age.trending === 'up' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      {age.trending === 'up' ? '+2%' : '-1%'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="relative overflow-hidden rounded-lg p-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/15 to-transparent" />
                                <div className="relative z-10">
                                  <p className="text-xs text-gray-600 uppercase tracking-wide">CTR</p>
                                  <p className="text-xl font-bold text-yellow-400">{age.ctr}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {parseFloat(age.ctr) > 4 ? (
                                      <span className="text-green-400 text-xs font-bold">↗</span>
                                    ) : (
                                      <span className="text-red-400 text-xs font-bold">↘</span>
                                    )}
                                    <span className={`text-xs ${
                                      parseFloat(age.ctr) > 4 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      {parseFloat(age.ctr) > 4 ? '+0.3%' : '-0.2%'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="relative overflow-hidden rounded-lg p-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent" />
                                <div className="relative z-10">
                                  <p className="text-xs text-gray-600 uppercase tracking-wide">Share Rate</p>
                                  <p className="text-xl font-bold text-pink-400">{age.shareRate}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {parseFloat(age.shareRate) > 8 ? (
                                      <span className="text-green-400 text-xs font-bold">↗</span>
                                    ) : parseFloat(age.shareRate) > 4 ? (
                                      <span className="text-gray-600 text-xs font-bold">−</span>
                                    ) : (
                                      <span className="text-red-400 text-xs font-bold">↘</span>
                                    )}
                                    <span className={`text-xs ${
                                      parseFloat(age.shareRate) > 8 ? 'text-green-400' : 
                                      parseFloat(age.shareRate) > 4 ? 'text-gray-600' : 'text-red-400'
                                    }`}>
                                      {parseFloat(age.shareRate) > 8 ? '+1.2%' : parseFloat(age.shareRate) > 4 ? '0%' : '-0.8%'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="relative overflow-hidden rounded-lg p-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 to-transparent" />
                                <div className="relative z-10">
                                  <p className="text-xs text-gray-600 uppercase tracking-wide">Peak Hours</p>
                                  <p className="text-lg font-bold text-cyan-400">{age.peakHours}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-cyan-400 text-xs font-bold">⏰</span>
                                    <span className="text-xs text-cyan-400">Optimal</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Performance Bar and Insights */}
                            <div className="space-y-4">
                              <div className="w-full bg-gradient-to-r from-white/5 to-white/10 rounded-full h-3 overflow-hidden">
                                <motion.div 
                                  className={`h-full rounded-full ${
                                    age.color === 'purple' ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' :
                                    age.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' :
                                    age.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                    'bg-gradient-to-r from-orange-500 to-red-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${age.percentage * 2.5}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                                />
                              </div>
                              
                              {/* Content Preferences and Peak Time */}
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Primary Content</p>
                                  <div className={`px-3 py-2 rounded-lg border ${
                                    age.color === 'purple' ? 'bg-blue-50 border-blue-300 text-blue-500' :
                                    age.color === 'green' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                                    age.color === 'blue' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                                    'bg-orange-500/20 border-orange-500/40 text-orange-300'
                                  }`}>
                                    <span className="text-sm font-medium">{age.primaryContent}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Trend Status</p>
                                  <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
                                    age.trending === 'up' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                                    age.trending === 'down' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                                    'bg-gray-500/20 border-gray-500/40 text-gray-700'
                                  }`}>
                                    {age.trending === 'up' ? (
                                      <span className="text-green-400 text-xs font-bold">↗</span>
                                    ) : age.trending === 'down' ? (
                                      <span className="text-red-400 text-xs font-bold">↘</span>
                                    ) : (
                                      <span className="text-gray-600 text-xs font-bold">−</span>
                                    )}
                                    <span className="text-sm font-medium">
                                      {age.trending === 'up' ? 'Growing' : age.trending === 'down' ? 'Declining' : 'Stable'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Age Group Insights Summary */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="mb-4">
                      <h5 className="font-bold text-lg text-white">Key Age Demographics Insights</h5>
                      <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="text-sm text-gray-700"><span className="font-bold text-white">18-24</span> dominates with viral content and highest engagement</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-sm text-gray-700"><span className="font-bold text-white">13-17</span> shows strongest sharing behavior and growth potential</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-sm text-gray-700"><span className="font-bold text-white">25-34</span> prefers educational content with longer retention</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="text-sm text-gray-700"><span className="font-bold text-white">35+</span> needs different approach - focus on informational content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Advanced Creator Archetype Intelligence */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-bold text-2xl text-white flex items-center gap-3">
                    <Sparkles className="w-7 h-7 text-yellow-400" />
                    Creator Archetype Performance Intelligence
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span>Total Creators:</span>
                      <span className="font-bold text-white ml-1">15,247</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                      <BarChart3 className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-300 font-medium">Performance Analysis</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { 
                      type: "🎯 Influencers", 
                      views: "89M", 
                      avgViews: "125K", 
                      engagement: "9.2%",
                      growth: "+45%",
                      color: "purple",
                      topContent: "Lifestyle & Fashion",
                      rank: 1,
                      creatorCount: "4,892",
                      retention: "74%",
                      viralPotential: "High",
                      brandCollabs: "587/month",
                      avgEarnings: "$8.5K/month",
                      peakHours: "6-9PM",
                      topPlatforms: ["TikTok", "Instagram", "YouTube"],
                      keyTraits: ["Lifestyle focused", "Brand partnerships", "Trendsetting"],
                      successFactors: ["Authenticity", "Consistency", "Audience engagement"]
                    },
                    { 
                      type: "🎪 Entertainers", 
                      views: "76M", 
                      avgViews: "85K", 
                      engagement: "8.5%",
                      growth: "+38%",
                      color: "pink",
                      topContent: "Comedy & Dance",
                      rank: 2,
                      creatorCount: "3,654",
                      retention: "68%",
                      viralPotential: "Very High",
                      brandCollabs: "312/month",
                      avgEarnings: "$5.2K/month",
                      peakHours: "7-11PM",
                      topPlatforms: ["TikTok", "Instagram", "Snapchat"],
                      keyTraits: ["High engagement", "Viral content", "Youth appeal"],
                      successFactors: ["Humor", "Timing", "Trend adoption"]
                    },
                    { 
                      type: "📚 Educators", 
                      views: "62M", 
                      avgViews: "42K", 
                      engagement: "7.8%",
                      growth: "+22%",
                      color: "blue",
                      topContent: "Tutorials & Tips",
                      rank: 3,
                      creatorCount: "4,123",
                      retention: "82%",
                      viralPotential: "Medium",
                      brandCollabs: "256/month",
                      avgEarnings: "$4.1K/month",
                      peakHours: "12-3PM",
                      topPlatforms: ["YouTube", "LinkedIn", "TikTok"],
                      keyTraits: ["High retention", "Loyal audience", "Expertise-driven"],
                      successFactors: ["Value delivery", "Clear explanations", "Expertise"]
                    },
                    { 
                      type: "🎨 Artists", 
                      views: "60M", 
                      avgViews: "38K", 
                      engagement: "8.9%",
                      growth: "+31%",
                      color: "green",
                      topContent: "Music & Visual",
                      rank: 4,
                      creatorCount: "2,578",
                      retention: "71%",
                      viralPotential: "High",
                      brandCollabs: "189/month",
                      avgEarnings: "$6.3K/month",
                      peakHours: "8-10PM",
                      topPlatforms: ["Instagram", "TikTok", "SoundCloud"],
                      keyTraits: ["Creative content", "Strong aesthetics", "Niche audience"],
                      successFactors: ["Originality", "Visual appeal", "Artistic skill"]
                    }
                  ].map((archetype, idx) => (
                    <motion.div
                      key={archetype.type}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative overflow-hidden rounded-xl border-2 ${
                        archetype.color === 'purple' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg shadow-blue-500/10' :
                        archetype.color === 'pink' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-pink-500/30 shadow-lg shadow-pink-500/10' :
                        archetype.color === 'blue' ? 'bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border-blue-500/30 shadow-lg shadow-blue-500/10' :
                        'bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-500/30 shadow-lg shadow-green-500/10'
                      }`}
                    >
                      {/* Top Performer Banner for #1 */}
                      {idx === 0 && (
                        <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-2 border-b border-blue-200">
                          <div className="flex items-center justify-center gap-2">
                            <Crown className="w-4 h-4 text-blue-600 animate-pulse" />
                            <span className="text-sm font-bold text-blue-400 uppercase tracking-wide">Top Archetype</span>
                            <Crown className="w-4 h-4 text-blue-600 animate-pulse" />
                          </div>
                        </div>
                      )}
                      
                      {/* Rank Badge */}
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                          archetype.color === 'purple' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-300' :
                          archetype.color === 'pink' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-300' :
                          archetype.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 border-blue-300' :
                          'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 border-green-300'
                        }`}>
                          #{archetype.rank}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h5 className="text-2xl font-bold text-white mb-2">{archetype.type}</h5>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`text-3xl font-bold ${
                                archetype.color === 'purple' ? 'text-blue-600' :
                                archetype.color === 'pink' ? 'text-pink-400' :
                                archetype.color === 'blue' ? 'text-blue-400' :
                                'text-green-400'
                              }`}>{archetype.views}</span>
                              <div className={`px-3 py-1 rounded-full border ${
                                parseFloat(archetype.growth) > 40 
                                  ? 'bg-green-500/20 border-green-500/30' 
                                  : parseFloat(archetype.growth) > 30
                                  ? 'bg-blue-500/20 border-blue-500/30'
                                  : 'bg-yellow-500/20 border-yellow-500/30'
                              }`}>
                                <span className={`text-sm font-bold ${
                                  parseFloat(archetype.growth) > 40 ? 'text-green-400' :
                                  parseFloat(archetype.growth) > 30 ? 'text-blue-400' :
                                  'text-yellow-400'
                                }`}>{archetype.growth}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{archetype.creatorCount} creators</span>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-cyan-400" />
                                <span>{archetype.avgViews} avg views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Core Performance KPIs */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Engagement</p>
                              <p className={`text-xl font-bold ${
                                archetype.color === 'purple' ? 'text-blue-600' :
                                archetype.color === 'pink' ? 'text-pink-400' :
                                archetype.color === 'blue' ? 'text-blue-400' :
                                'text-green-400'
                              }`}>{archetype.engagement}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">+0.8%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Retention</p>
                              <p className="text-xl font-bold text-white">{archetype.retention}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {parseFloat(archetype.retention) > 75 ? (
                                  <span className="text-green-400 text-xs font-bold">↗</span>
                                ) : (
                                  <span className="text-blue-400 text-xs font-bold">↗</span>
                                )}
                                <span className={`text-xs ${
                                  parseFloat(archetype.retention) > 75 ? 'text-green-400' : 'text-blue-400'
                                }`}>
                                  +2%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-gray-200">
                            <div className="relative z-10">
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Earnings</p>
                              <p className="text-lg font-bold text-green-400">{archetype.avgEarnings}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-green-400 text-xs font-bold">↗</span>
                                <span className="text-xs text-green-400">Monthly</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Analytics */}
                        <div className="space-y-4">
                          {/* Viral Potential and Brand Collaborations */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Viral Potential</p>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                archetype.viralPotential === 'Very High' ? 'bg-red-500/20 text-red-400' :
                                archetype.viralPotential === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {archetype.viralPotential}
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Brand Collabs</p>
                              <p className="text-sm text-white font-bold">{archetype.brandCollabs}</p>
                            </div>
                          </div>
                          
                          {/* Top Platforms */}
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Top Platforms</p>
                            <div className="flex gap-2">
                              {archetype.topPlatforms.map((platform, pIdx) => (
                                <div key={platform} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                                  pIdx === 0 
                                    ? (archetype.color === 'purple' ? 'bg-blue-50 border-blue-300 text-blue-500' :
                                       archetype.color === 'pink' ? 'bg-pink-500/20 border-blue-300 text-pink-300' :
                                       archetype.color === 'blue' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                                       'bg-green-500/20 border-green-500/40 text-green-300')
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                  {platform}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Key Traits */}
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Key Traits</p>
                            <div className="space-y-1">
                              {archetype.keyTraits.map((trait, tIdx) => (
                                <div key={trait} className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    archetype.color === 'purple' ? 'bg-blue-600' :
                                    archetype.color === 'pink' ? 'bg-pink-400' :
                                    archetype.color === 'blue' ? 'bg-blue-400' :
                                    'bg-green-400'
                                  }`} />
                                  <span className="text-sm text-gray-700">{trait}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Success Factors */}
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Success Factors</p>
                            <div className="flex gap-2 flex-wrap">
                              {archetype.successFactors.map((factor, fIdx) => (
                                <div key={factor} className={`px-2 py-1 rounded text-xs font-medium ${
                                  fIdx === 0 
                                    ? (archetype.color === 'purple' ? 'bg-blue-50 text-blue-500' :
                                       archetype.color === 'pink' ? 'bg-pink-500/20 text-pink-300' :
                                       archetype.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                                       'bg-green-500/20 text-green-300')
                                    : 'bg-white text-gray-700'
                                }`}>
                                  {factor}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Performance Bar and Peak Hours */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div>
                              <p className="text-xs text-gray-600">Peak Hours</p>
                              <p className="text-sm font-bold text-cyan-400">{archetype.peakHours}</p>
                            </div>
                            <div className="text-right text-xs text-gray-600">
                              Market Share
                              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                <motion.div 
                                  className={`h-full rounded-full ${
                                    archetype.color === 'purple' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                    archetype.color === 'pink' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                    archetype.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                    'bg-gradient-to-r from-green-500 to-emerald-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(parseFloat(archetype.views) / 89) * 100}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Creator Archetype Strategy Summary */}
                <div className="p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-gray-200">
                  <div className="mb-4">
                    <h5 className="font-bold text-lg text-white">Creator Archetype Strategy Insights</h5>
                    <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="text-sm text-gray-700"><span className="font-bold text-white">Influencers</span> - Partner with top performers for premium campaigns</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                        <span className="text-sm text-gray-700"><span className="font-bold text-white">Entertainers</span> - Leverage viral potential for rapid brand awareness</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-sm text-gray-700"><span className="font-bold text-white">Educators</span> - Build long-term value with high-retention content</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm text-gray-700"><span className="font-bold text-white">Artists</span> - Focus on aesthetic brands and creative partnerships</span>
                      </div>
                    </div>
                  </div>
                </div>

            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-4">
            <div className="space-y-6">
              {/* Header with Filter Button */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-2xl text-white flex items-center gap-3">
                  <Play className="w-7 h-7 text-blue-600" />
                  Video Examples
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Showing</span>
                    <span className="text-sm font-bold text-white">{getFilteredVideos().length}</span>
                    <span className="text-sm text-gray-600">of {allVideos.length} videos</span>
                  </div>
                  
                  {/* Filter Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 bg-gray-50 hover:bg-white text-gray-900 border-gray-200 hover:border-blue-300"
                      >
                        <Filter className="w-4 h-4" />
                        Filter & Sort
                        {(genderFilter.size > 0 || ageFilter.size > 0 || regionFilter.size > 0 || archetypeFilter.size > 0) && (
                          <div className="ml-1 px-1.5 py-0.5 bg-blue-100 rounded-full">
                            <span className="text-xs font-bold text-blue-600">
                              {genderFilter.size + ageFilter.size + regionFilter.size + archetypeFilter.size}
                            </span>
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] bg-white border-white/10" align="end">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-white">Filter & Sort Examples</h4>
                          {(genderFilter.size > 0 || ageFilter.size > 0 || regionFilter.size > 0 || archetypeFilter.size > 0) && (
                            <button 
                              onClick={clearAllFilters}
                              className="text-xs text-gray-600 hover:text-white"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* Gender Filter */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Gender</label>
                                {genderFilter.size > 0 && (
                                  <button
                                    onClick={() => setGenderFilter(new Set())}
                                    className="text-xs text-gray-600 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {['female', 'male'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => toggleFilter(genderFilter, setGenderFilter, option)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border capitalize flex items-center justify-between ${
                                      genderFilter.has(option)
                                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                        : 'bg-gray-50 text-gray-600 border-white/10 hover:bg-white hover:text-white'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {genderFilter.has(option) && <Check className="w-3 h-3" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Age Range Filter */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Age Range</label>
                                {ageFilter.size > 0 && (
                                  <button
                                    onClick={() => setAgeFilter(new Set())}
                                    className="text-xs text-gray-600 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {['13-17', '18-24', '25-34', '35+'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => toggleFilter(ageFilter, setAgeFilter, option)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border flex items-center justify-between ${
                                      ageFilter.has(option)
                                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                        : 'bg-gray-50 text-gray-600 border-white/10 hover:bg-white hover:text-white'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {ageFilter.has(option) && <Check className="w-3 h-3" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Sort Options */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-600">Sort By</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'high-views', label: 'Most Views', icon: TrendingUp },
                                  { value: 'low-views', label: 'Least Views', icon: TrendingDown },
                                  { value: 'trending', label: 'Trending Now', icon: Flame },
                                  { value: 'recent', label: 'Most Recent', icon: Clock }
                                ].map((option) => {
                                  const Icon = option.icon;
                                  return (
                                    <button
                                      key={option.value}
                                      onClick={() => setSortBy(option.value as any)}
                                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-all border flex items-center justify-between ${
                                        sortBy === option.value 
                                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                          : 'bg-gray-50 text-gray-600 border-white/10 hover:bg-white hover:text-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-3 h-3" />
                                        <span>{option.label}</span>
                                      </div>
                                      {sortBy === option.value && <Check className="w-3 h-3" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Column */}
                          <div className="space-y-4">
                            {/* Region Filter */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Region</label>
                                {regionFilter.size > 0 && (
                                  <button
                                    onClick={() => setRegionFilter(new Set())}
                                    className="text-xs text-gray-600 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                                {['USA', 'Mexico', 'Brazil', 'Indonesia', 'UK', 'Canada'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => toggleFilter(regionFilter, setRegionFilter, option)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border flex items-center justify-between ${
                                      regionFilter.has(option)
                                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                        : 'bg-gray-50 text-gray-600 border-white/10 hover:bg-white hover:text-white'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {regionFilter.has(option) && <Check className="w-3 h-3" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Archetype Filter */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Creator Type</label>
                                {archetypeFilter.size > 0 && (
                                  <button
                                    onClick={() => setArchetypeFilter(new Set())}
                                    className="text-xs text-gray-600 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {['Influencer', 'Entertainer', 'Educator', 'Artist'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => toggleFilter(archetypeFilter, setArchetypeFilter, option)}
                                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-all border flex items-center justify-between ${
                                      archetypeFilter.has(option)
                                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                        : 'bg-gray-50 text-gray-600 border-white/10 hover:bg-white hover:text-white'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {archetypeFilter.has(option) && <Check className="w-3 h-3" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Active Filters Summary */}
                        {(genderFilter.size > 0 || ageFilter.size > 0 || regionFilter.size > 0 || archetypeFilter.size > 0) && (
                          <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-600">Active:</span>
                              {Array.from(genderFilter).map(filter => (
                                <div key={filter} className="px-2 py-1 bg-blue-50 rounded-full">
                                  <span className="text-xs font-medium text-blue-600 capitalize">{filter}</span>
                                </div>
                              ))}
                              {Array.from(ageFilter).map(filter => (
                                <div key={filter} className="px-2 py-1 bg-blue-50 rounded-full">
                                  <span className="text-xs font-medium text-blue-600">{filter}</span>
                                </div>
                              ))}
                              {Array.from(regionFilter).map(filter => (
                                <div key={filter} className="px-2 py-1 bg-blue-50 rounded-full">
                                  <span className="text-xs font-medium text-blue-600">{filter}</span>
                                </div>
                              ))}
                              {Array.from(archetypeFilter).map(filter => (
                                <div key={filter} className="px-2 py-1 bg-blue-50 rounded-full">
                                  <span className="text-xs font-medium text-blue-600">{filter}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Active Filters Display Below Header */}
              {(genderFilter.size > 0 || ageFilter.size > 0 || regionFilter.size > 0 || archetypeFilter.size > 0) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {Array.from(genderFilter).map(filter => (
                    <div key={`gender-${filter}`} className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200 flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600 capitalize">{filter}</span>
                      <button onClick={() => toggleFilter(genderFilter, setGenderFilter, filter)} className="text-blue-600 hover:text-blue-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {Array.from(ageFilter).map(filter => (
                    <div key={`age-${filter}`} className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200 flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">{filter}</span>
                      <button onClick={() => toggleFilter(ageFilter, setAgeFilter, filter)} className="text-blue-600 hover:text-blue-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {Array.from(regionFilter).map(filter => (
                    <div key={`region-${filter}`} className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200 flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">{filter}</span>
                      <button onClick={() => toggleFilter(regionFilter, setRegionFilter, filter)} className="text-blue-600 hover:text-blue-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {Array.from(archetypeFilter).map(filter => (
                    <div key={`archetype-${filter}`} className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200 flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">{filter}</span>
                      <button onClick={() => toggleFilter(archetypeFilter, setArchetypeFilter, filter)} className="text-blue-600 hover:text-blue-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="ml-2 text-xs text-gray-600 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
              )}
              
              {/* Filtered Video Grid */}
              <div>
                <div className="grid grid-cols-4 gap-4">
                  {getFilteredVideos().map((video, idx) => (
                    <motion.div
                      key={`${video.creator}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="aspect-[9/16] bg-gray-900 relative">
                          <img 
                            src={video.thumbnail} 
                            alt={`Example ${idx + 1}`} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {/* Trending Badge */}
                          {video.trending && (
                            <div className="absolute top-3 left-3">
                              <div className="px-2 py-1 bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-full">
                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  TRENDING
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                              <Play className="w-7 h-7 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-bold text-white">{video.creator}</p>
                                <p className="text-lg font-bold text-white">{video.views} views</p>
                              </div>
                              
                              {/* Metadata Tags */}
                              <div className="flex flex-wrap gap-1">
                                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  video.gender === 'female' 
                                    ? 'bg-pink-500/30 text-pink-300 border border-blue-300'
                                    : 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                                }`}>
                                  {video.gender}
                                </div>
                                <div className="px-2 py-0.5 bg-blue-100 text-blue-500 border border-blue-300 rounded-full text-xs font-medium">
                                  {video.age}
                                </div>
                                <div className="px-2 py-0.5 bg-green-500/30 text-green-300 border border-green-500/40 rounded-full text-xs font-medium">
                                  {video.region}
                                </div>
                                <div className="px-2 py-0.5 bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 rounded-full text-xs font-medium">
                                  {video.archetype}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* No Results Message */}
                {getFilteredVideos().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-gray-600 mb-4">
                      <Video className="w-16 h-16" />
                    </div>
                    <p className="text-xl font-semibold text-white mb-2">No videos match your filters</p>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your filter criteria</p>
                    <button 
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Best Practices */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  Best Practices
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-white">Do's</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
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
                    <ul className="space-y-2 text-sm text-gray-700">
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
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Key Takeaways
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {displayCreative.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creative Strategy */}
              <div className="grid grid-cols-2 gap-6">
                {/* Content Strategy */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Content Strategy
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Optimal Length</h5>
                      <p className="text-sm text-white">15-30 seconds</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Hook Timing</h5>
                      <p className="text-sm text-white">First 3 seconds critical</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Call to Action</h5>
                      <p className="text-sm text-white">End with engagement prompt</p>
                    </div>
                  </div>
                </div>

                {/* Production Tips */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    Production Tips
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Lighting</h5>
                      <p className="text-sm text-white">Natural light or ring light</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Audio Sync</h5>
                      <p className="text-sm text-white">Match beats precisely</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-600 mb-1">Transitions</h5>
                      <p className="text-sm text-white">Smooth cuts on beat drops</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Prediction */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Performance Prediction
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">High</div>
                    <p className="text-xs text-gray-600">Viral Potential</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">3-5</div>
                    <p className="text-xs text-gray-600">Weeks Trending</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">2.5x</div>
                    <p className="text-xs text-gray-600">Avg. Engagement</p>
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