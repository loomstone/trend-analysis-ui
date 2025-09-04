import React, { useEffect, useState, useCallback } from "react";
import { LoaderOne } from "@/components/ui/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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
  Zap, Flame, Clock, ChevronLeft, ChevronRight, Sparkles, TrendingDown, Video, X, Filter, Check,
  Users, Calendar, Globe, Crown, BarChart3, Target, Eye, DollarSign
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
  const [visibleCards, setVisibleCards] = useState(2);
  const [activeTab, setActiveTab] = useState('demographics');
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [scaleBudget, setScaleBudget] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [regionBudgets, setRegionBudgets] = useState<{ [key: string]: number }>({});
  
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

  // Get color scheme based on creative - using same color family with different shades
  const getColorScheme = (creativeName: string) => {
    switch(creativeName) {
      case 'Lip Sync with TOS':
        return {
          gender: { primary: '#ec4899', secondary: '#f9a8d4' }, // Pink shades
          age: { colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] }, // Green shades (dark to light)
          archetypes: { colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'] }, // Purple shades (dark to light)
          regions: { colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'] } // Orange shades (dark to light)
        };
      case 'Dance Challenge':
        return {
          gender: { primary: '#3b82f6', secondary: '#93c5fd' }, // Blue shades
          age: { colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'] }, // Pink shades (dark to light)
          archetypes: { colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] }, // Green shades (dark to light)
          regions: { colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'] } // Indigo shades (dark to light)
        };
      case 'Transition Effect':
        return {
          gender: { primary: '#8b5cf6', secondary: '#c4b5fd' }, // Purple shades
          age: { colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'] }, // Cyan shades (dark to light)
          archetypes: { colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'] }, // Orange shades (dark to light)
          regions: { colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'] } // Pink shades (dark to light)
        };
      default:
        return {
          gender: { primary: '#6366f1', secondary: '#a5b4fc' }, // Indigo shades
          age: { colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] }, // Green shades (dark to light)
          archetypes: { colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'] }, // Orange shades (dark to light)
          regions: { colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'] } // Cyan shades (dark to light)
        };
    }
  };
  
  const displayCreative = selectedCreative || recommendedCreative;
  
  const colorScheme = getColorScheme(displayCreative.name);

  // Handle tab change with loading state
  const handleTabChange = (value: string) => {
    // Don't show loading if switching to the same tab
    if (value === activeTab) return;
    
    // Store current scroll position
    const currentScrollY = window.scrollY;
    
    setIsLoadingTab(true);
    
    // Delay the actual tab change slightly for smoother transition
    requestAnimationFrame(() => {
      setActiveTab(value);
      
      // Restore scroll position immediately
      window.scrollTo(0, currentScrollY);
      
      // Shorter loading time for smoother experience
      setTimeout(() => {
        setIsLoadingTab(false);
        // Ensure scroll position is maintained after content loads
        window.scrollTo(0, currentScrollY);
      }, 200);
    });
  };
  
  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
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
    
    // Limit to maximum of 2 examples
    return filtered.slice(0, 2);
  };

  useEffect(() => {
    if (selectedCreative) {
      setIsFlashing(true);
      setCurrentVideoIndex(0); // Reset carousel when switching creatives
      const timer = setTimeout(() => setIsFlashing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedCreative]);

  // No infinite scroll needed since we only show 2 videos max

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
    <>
    <Card className="relative bg-white rounded-3xl border border-gray-200 shadow-sm">
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-green-500/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3),0_0_30px_rgba(34,197,94,0.15)]">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">Rising</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-purple-500/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3),0_0_30px_rgba(147,51,234,0.15)]">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">Recommended</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-blue-500/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3),0_0_30px_rgba(59,130,246,0.15)]">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">New</span>
                  </div>
                </div>
              )}
              {displayCreative.momentum === "declining" && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-red-500/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3),0_0_30px_rgba(239,68,68,0.15)]">
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs font-semibold text-red-600">Dying</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-600">{displayCreative.description}</p>
          </div>
          <Button 
            onClick={() => setShowScaleModal(true)}
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
        <Tabs defaultValue="demographics" className="w-full" value={activeTab} onValueChange={handleTabChange} activationMode="manual">
          <TabsList className="flex gap-8 bg-transparent p-0 mb-6 h-auto">
            <TabsTrigger 
              value="demographics" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger 
              value="examples" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Examples
            </TabsTrigger>
            <TabsTrigger 
              value="creative-analysis" 
              className="px-4 py-2 bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium data-[state=active]:font-bold transition-all duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 rounded-lg data-[state=active]:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Creative Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Content Wrapper with Loading */}
          <div className="relative h-[600px] overflow-hidden">
            {/* Smooth blur overlay when loading */}
            <AnimatePresence>
              {isLoadingTab && (
                <motion.div 
                  className="absolute inset-0 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ 
                    backdropFilter: isLoadingTab ? 'blur(8px)' : 'blur(0px)',
                    WebkitBackdropFilter: isLoadingTab ? 'blur(8px)' : 'blur(0px)',
                    transition: 'backdrop-filter 0.3s ease-in-out, -webkit-backdrop-filter 0.3s ease-in-out'
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Tab Content with smooth fade transition */}
            <motion.div 
              className="relative h-full"
              animate={{ 
                opacity: isLoadingTab ? 0.7 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
          <TabsContent value="demographics" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            <div className="space-y-6 pb-6">
              {/* Time Filter */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">Demographics from creators using this sound</span>
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
              <div className="grid grid-cols-2 gap-8">
                {/* Gender Distribution - Purple Theme */}
                <div className="relative">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: colorScheme.gender.primary,
                      boxShadow: `0 0 15px ${colorScheme.gender.primary}, 0 0 30px ${colorScheme.gender.primary}80`
                    }} />
                    Gender
                  </h4>
                  
                  {/* Pie Chart - Smaller */}
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Female', value: currentDemographics.genderSplit.female, description: 'High engagement' },
                            { name: 'Male', value: currentDemographics.genderSplit.male, description: 'Tech-savvy' }
                          ].sort((a, b) => b.value - a.value)} // Sort to ensure largest is first
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={2}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                          labelLine={false}
                        >
                          <Cell fill={colorScheme.gender.primary} />
                          <Cell fill={colorScheme.gender.secondary} />
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `${value}%`}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: `1px solid ${colorScheme.gender.primary}`,
                            borderRadius: '6px',
                            padding: '6px 10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    </div>
                    
                  {/* Minimal stats below */}
                  <div className="flex justify-center gap-6 mt-2">
                    {currentDemographics.genderSplit.female >= currentDemographics.genderSplit.male ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.primary }} />
                          <span className="text-xs text-gray-600">Female: <span className="font-semibold" style={{ color: colorScheme.gender.primary }}>{currentDemographics.genderSplit.female}%</span></span>
                      </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.secondary }} />
                          <span className="text-xs text-gray-600">Male: <span className="font-semibold" style={{ color: colorScheme.gender.secondary }}>{currentDemographics.genderSplit.male}%</span></span>
                      </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.primary }} />
                          <span className="text-xs text-gray-600">Male: <span className="font-semibold" style={{ color: colorScheme.gender.primary }}>{currentDemographics.genderSplit.male}%</span></span>
                    </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.secondary }} />
                          <span className="text-xs text-gray-600">Female: <span className="font-semibold" style={{ color: colorScheme.gender.secondary }}>{currentDemographics.genderSplit.female}%</span></span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Age Range - Dynamic Theme */}
                <div className="relative">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: colorScheme.age.colors[0],
                      boxShadow: `0 0 15px ${colorScheme.age.colors[0]}, 0 0 30px ${colorScheme.age.colors[0]}80`
                    }} />
                    Age Range
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      // Sort to find the dominant age range
                      const sortedRanges = [...currentDemographics.ageRanges].sort((a, b) => b.percentage - a.percentage);
                      const maxPercentage = sortedRanges[0].percentage;
                      
                      return currentDemographics.ageRanges.map((range, index) => {
                        const barColor = colorScheme.age.colors[index] || colorScheme.age.colors[0];
                        const isDominant = range.percentage === maxPercentage;
                      
                      return (
                          <div key={range.range} className="relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">{range.range}</span>
                              <span className="text-xs font-semibold" style={{ color: barColor }}>{range.percentage}%</span>
                          </div>
                            <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                              }}
                            >
                            <motion.div 
                                className="h-full rounded-full relative"
                                style={{ 
                                  background: `linear-gradient(90deg, ${barColor}dd, ${barColor}99)`,
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px ${barColor}40`
                                }}
                              initial={{ width: 0 }}
                              animate={{ width: `${range.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                              key={`age-${range.range}-${demographicsTimeFilter}`}
                            >
                              <div 
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      );
                      });
                    })()}
                  </div>
                </div>


              </div>

              {/* Second Row */}
              <div className="grid grid-cols-2 gap-8 mt-8">
                {/* Creator Archetypes - Dynamic Theme - Bar Graph */}
                <div className="relative">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: colorScheme.archetypes.colors[0],
                      boxShadow: `0 0 15px ${colorScheme.archetypes.colors[0]}, 0 0 30px ${colorScheme.archetypes.colors[0]}80`
                    }} />
                    Creator Archetypes
                  </h4>
                  
                  {/* Bar Graph - Clean, no background */}
                  <div className="space-y-2">
                    {(() => {
                      const archetypes = currentDemographics.creatorArchetypes || [
                      { type: "Influencer", percentage: 35 },
                      { type: "Entertainer", percentage: 30 },
                      { type: "Educator", percentage: 20 },
                      { type: "Artist", percentage: 15 }
                      ];
                      const sortedArchetypes = [...archetypes].sort((a, b) => b.percentage - a.percentage);
                      const maxPercentage = sortedArchetypes[0].percentage;
                      
                      return archetypes.map((arch, index) => {
                        const barColor = colorScheme.archetypes.colors[index] || colorScheme.archetypes.colors[0];
                        const isDominant = arch.percentage === maxPercentage;
                      
                      return (
                          <div key={arch.type} className="relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">{arch.type}</span>
                              <span className="text-xs font-semibold" style={{ color: barColor }}>{arch.percentage}%</span>
                          </div>
                            <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                              }}
                            >
                            <motion.div 
                                className="h-full rounded-full relative"
                                style={{ 
                                  background: `linear-gradient(90deg, ${barColor}dd, ${barColor}99)`,
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px ${barColor}40`
                                }}
                              initial={{ width: 0 }}
                              animate={{ width: `${arch.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            >
                              <div 
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      );
                      });
                    })()}
                  </div>
                </div>

                {/* Regions - Dynamic Theme */}
                <div className="relative">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: colorScheme.regions.colors[0],
                      boxShadow: `0 0 15px ${colorScheme.regions.colors[0]}, 0 0 30px ${colorScheme.regions.colors[0]}80`
                    }} />
                    Regions (Top Countries)
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      // Sort to find the dominant country
                      const sortedCountries = [...currentDemographics.topCountries].sort((a, b) => b.percentage - a.percentage);
                      const maxPercentage = sortedCountries[0].percentage;
                      
                      return currentDemographics.topCountries.map((country, index) => {
                        const barColor = colorScheme.regions.colors[index] || colorScheme.regions.colors[0];
                        const isDominant = country.percentage === maxPercentage;
                      
                      return (
                          <div key={country.country} className="relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">{country.country}</span>
                              <span className="text-xs font-semibold" style={{ color: barColor }}>{country.percentage}%</span>
                          </div>
                            <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                              }}
                            >
                            <motion.div 
                                className="h-full rounded-full relative"
                                style={{ 
                                  background: `linear-gradient(90deg, ${barColor}dd, ${barColor}99)`,
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px ${barColor}40`
                                }}
                              initial={{ width: 0 }}
                              animate={{ width: `${country.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            >
                              <div 
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      );
                      });
                    })()}
                  </div>
                </div>
              </div>


            </div>
          </TabsContent>

          <TabsContent value="engagement" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            {/* Simplified Engagement - Best Performing Demographics */}
            <div className="space-y-6 pb-6">
              <h4 className="text-xl font-bold text-gray-900">Best Performing Demographics</h4>
              
              {/* Clean bar graphs showing views for each demographic category */}
              <div className="grid grid-cols-2 gap-8">
                {/* Gender Performance */}
                  <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1),0_0_30px_rgba(168,85,247,0.5)]" />
                    Gender Performance
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Female</span>
                        <span className="text-sm font-bold text-gray-900">187M views</span>
                  </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                    <motion.div
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #a855f6dd, #a855f699)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #a855f640'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                          </div>
                        </div>
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Male</span>
                        <span className="text-sm font-bold text-gray-900">98M views</span>
                              </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                                <motion.div 
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #0ea5e9dd, #0ea5e999)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #0ea5e940'
                          }}
                                  initial={{ width: 0 }}
                          animate={{ width: "35%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                              </div>
                            </div>
                          </div>
                </div>
                
                {/* Age Group Performance */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1),0_0_30px_rgba(34,211,238,0.5)]" />
                    Age Group Performance
                  </h5>
                    <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">13-17</span>
                        <span className="text-sm font-bold text-gray-900">122M views</span>
                    </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                    <motion.div 
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #22d3eedd, #22d3ee99)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #22d3ee40'
                          }}
                          initial={{ width: 0 }}
                                                    animate={{ width: "42%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                        </div>
                      </div>
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">18-24</span>
                        <span className="text-sm font-bold text-gray-900">110M views</span>
                              </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                            <motion.div 
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #ec4899dd, #ec489999)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #ec489940'
                          }}
                              initial={{ width: 0 }}
                                                    animate={{ width: "38%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                          </div>
                          </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">25-34</span>
                        <span className="text-sm font-bold text-gray-900">43M views</span>
                        </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                    <motion.div 
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #facc15dd, #facc1599)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #facc1540'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: "15%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                        </div>
                      </div>
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">35+</span>
                        <span className="text-sm font-bold text-gray-900">14M views</span>
                              </div>
                      <div className="relative w-full h-2.5 rounded-full overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <motion.div 
                          className="h-full rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #a3e635dd, #a3e63599)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 8px #a3e63540'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: "5%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                            }}
                          />
                        </motion.div>
                            </div>
                            </div>
                          </div>
                        </div>
                        
                {/* Creator Type Performance */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,1),0_0_30px_rgba(251,146,60,0.5)]" />
                    Creator Type Performance
                  </h5>
                        <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Influencer</span>
                        <span className="text-sm font-bold text-gray-900">101M views</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                          className="bg-orange-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: "35%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Entertainer</span>
                        <span className="text-sm font-bold text-gray-900">87M views</span>
                    </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                          className="bg-pink-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "30%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        />
                          </div>
                        </div>
                              <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Educator</span>
                        <span className="text-sm font-bold text-gray-900">58M views</span>
                                  </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-cyan-400 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                                  </div>
                                </div>
                                <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Artist</span>
                        <span className="text-sm font-bold text-gray-900">43M views</span>
                                  </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-lime-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "15%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        />
                                </div>
                              </div>
                            </div>
                  </div>
                  
                {/* Region Performance */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1),0_0_30px_rgba(74,222,128,0.5)]" />
                    Region Performance
                  </h5>
                      <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">USA</span>
                        <span className="text-sm font-bold text-gray-900">80M views</span>
                        </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-green-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "28%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        </div>
                      </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Mexico</span>
                        <span className="text-sm font-bold text-gray-900">63M views</span>
                        </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                          className="bg-violet-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "22%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        />
                          </div>
                        </div>
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Brazil</span>
                        <span className="text-sm font-bold text-gray-900">43M views</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-rose-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "15%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                            </div>
                              </div>
                            <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Indonesia</span>
                        <span className="text-sm font-bold text-gray-900">34M views</span>
                            </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-amber-400 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: "12%" }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            <div className="space-y-6 pb-6">
              {/* Header with Filter Button */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-2xl text-gray-900">
                  Top Videos
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Showing</span>
                    <span className="text-sm font-bold text-gray-900">{getFilteredVideos().length}</span>
                    <span className="text-sm text-gray-600">of 2 videos</span>
                  </div>
                  
                  {/* Filter Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 bg-white hover:bg-blue-50 text-gray-700 border-blue-200 hover:border-blue-400"
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
                    <PopoverContent className="w-[600px] bg-white border-blue-100" align="end">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-gray-900">Filter & Sort Examples</h4>
                          {(genderFilter.size > 0 || ageFilter.size > 0 || regionFilter.size > 0 || archetypeFilter.size > 0) && (
                            <button 
                              onClick={clearAllFilters}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Filter content will go here */}
                              </div>
                              </div>
                    </PopoverContent>
                  </Popover>
                              </div>
                            </div>
                            
              {/* Creator Cards Grid */}
              <div>
                <div className="grid grid-cols-2 gap-6">
                  {getFilteredVideos().slice(0, visibleCards).map((video, idx) => (
                    <motion.div
                      key={`${video.creator}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                      {/* Top Section with Profile and Carousel side by side */}
                      <div className="flex gap-6">
                        {/* Left Side - Creator Info */}
                        <div className="flex-1">
                          {/* Profile Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {video.creator.slice(1, 3).toUpperCase()}
                              </div>
                            <div>
                                      <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{video.creator}</h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                  idx % 4 === 0 ? 'bg-purple-100 text-purple-700' :
                                  idx % 4 === 1 ? 'bg-pink-100 text-pink-700' :
                                  idx % 4 === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {['Lifestyle Influencer', 'Fashion Creator', 'Beauty Guru', 'Content Creator'][idx % 4]}
                                </span>
                              </div>
                              </div>
                            </div>
                            
                          {/* Stats Row */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">FOLLOWERS</p>
                              <p className="font-semibold text-gray-900">{Math.floor(Math.random() * 200 + 50)}K</p>
                                      </div>
                            <div>
                              <p className="text-xs text-gray-500">GENDER</p>
                              <p className="font-semibold text-gray-900">{['Female', 'Male', 'Female', 'Female'][idx % 4]}</p>
                              </div>
                            <div>
                              <p className="text-xs text-gray-500">REGION</p>
                              <p className="font-semibold text-gray-900">{['USA', 'Europe', 'Asia', 'LATAM'][idx % 4]}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">LANGUAGE</p>
                              <p className="font-semibold text-gray-900">English</p>
                            </div>
                          </div>
                          
                          {/* Creator Analysis */}
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">CREATOR ANALYSIS</p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {idx === 0 ? 
                                "Lifestyle creator with strong beauty/fashion engagement. Posts 3-4x weekly with peak evening performance. Authentic style and engaged audience make them perfect for this trend." :
                              idx === 1 ? 
                                "Fashion specialist in trend adoption. Strong European presence with high OOTD completion rates. Content consistently performs above average with strong viewer retention." :
                              idx === 2 ?
                                "Beauty influencer focused on skincare/makeup. Engaged 16-24 demographic with authentic reviews. Proven track record with similar campaigns indicates high potential." :
                                "Versatile lifestyle creator with 8% comment rate. Excels at storytelling for Gen Z audiences. Strong aesthetic alignment with brand values and campaign goals."
                              }
                            </p>
                              </div>
                            </div>
                            
                        {/* Right Side - Recent Content Carousel */}
                        <div className="w-[380px]">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">RECENT CONTENT</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {/* Main Trend Video - First */}
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="w-24 h-36 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={video.thumbnail} 
                                      alt={`${video.creator} trend video`} 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-1 left-1 px-1 py-0.5 bg-blue-600/90 text-white text-[9px] rounded font-medium">
                                      Trend Video
                              </div>
                            </div>
                          </div>
                        </div>
                        
                              {/* Other Recent Content */}
                              {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex-shrink-0">
                                  <div className="w-24 h-36 bg-gray-200 rounded-lg overflow-hidden">
                                    <img 
                                      src="/placeholder.svg" 
                                      alt={`Recent content ${item}`} 
                                      className="w-full h-full object-cover"
                                    />
                                </div>
                                </div>
                              ))}
                                </div>
                            <p className="text-[9px] text-gray-500 text-center mt-1.5 italic">Swipe to see more • Tap to view videos</p>
                                </div>
                </div>
              </div>
              
                    </motion.div>
                  ))}
                    </div>
                
                              </div>
                            </div>
          </TabsContent>

                    {/* Creative Analysis Tab */}
          <TabsContent value="creative-analysis" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            <div className="grid grid-cols-2 gap-6 pb-6 h-full">
              {/* Left side - Creative Analysis Text */}
              <div className="bg-gray-50 rounded-lg p-8 h-full overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">CREATIVE ANALYSIS</h2>
                
                <div className="space-y-12">
                              <div>
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">Description</h3>
                    <p className="text-base text-gray-600 leading-loose">
                      {displayCreative.name === 'Lip Sync with TOS' ? 
                        "This trend centers on lip-syncing to dramatic emotional moments in popular audio clips, often with on-screen text to add context. Creators express a wide range of emotions, from relationship frustration to moments of self-realization. To recreate, film a close-up shot of yourself lip-syncing with genuine emotion that connects to the audio's emotional peaks at 0:04, 0:08, and 0:12." :
                      displayCreative.name === 'Dance Challenge X' ?
                        "This trend features a high-energy dance routine set to an upbeat track with distinct beat drops. Creators perform synchronized moves often in groups or with creative transitions between solo and group shots. To recreate, master the core 8-count routine, film in a well-lit space with room for movement, and add your personal flair during the freestyle sections." :
                        "This trend revolves around comedic timing and relatable scenarios using trending audio. Creators act out everyday situations with exaggerated reactions that sync perfectly with the audio cues. To recreate, focus on facial expressions and body language that amplify the comedic moments, using quick cuts or transitions to enhance the punchline."
                      }
                    </p>
                              </div>
                              
                  <div className="mt-12">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">Content Strategy</h3>
                    <p className="text-base text-gray-600 leading-loose">
                      {displayCreative.name === 'Lip Sync with TOS' ?
                        "The trend's hook is the audio's relatable and emotional moments, which creators use to build a narrative. The most common format is a direct-to-camera lip-sync, often enhanced with text prompts like 'POV:...' or contextual captions. For best performance, creators should focus on authentic facial expressions and convey vulnerability to build a strong connection with the audience." :
                      displayCreative.name === 'Dance Challenge X' ?
                        "The trend's viral factor lies in its catchy choreography and room for creative interpretation. Successful creators add unique elements like costume changes, location switches, or collaborative performances. The key is maintaining energy throughout while hitting the signature moves precisely on beat." :
                        "The trend thrives on relatability and perfect comedic timing. Top performing content uses the audio to highlight universal experiences that viewers instantly recognize. The format works best with a clear setup and payoff structure, using visual storytelling to complement the audio."
                      }
                    </p>
                                </div>
                                </div>
                                </div>
                
              {/* Right side - Visual Recreation Guide */}
              <div className="bg-white border border-blue-100 rounded-lg p-8 h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6">CREATIVE BRIEF</h2>
                
            <div className="space-y-6">
                  {/* Quick Steps */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">QUICK STEPS</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">1</span>
                                </div>
                        <p className="text-sm text-gray-700">Set up phone at eye level with good lighting</p>
                              </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">2</span>
                            </div>
                        <p className="text-sm text-gray-700">Practice audio timing (0:04, 0:08, 0:12)</p>
                          </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <p className="text-sm text-gray-700">Build emotional intensity throughout</p>
                      </div>
                  </div>
                </div>
                
                  {/* Pro Tips */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">KEY TIPS</h3>
                    <div className="bg-blue-50 rounded-lg p-3 space-y-1.5">
                      <p className="text-sm text-gray-700">• Natural lighting works best</p>
                      <p className="text-sm text-gray-700">• Film in 1080p minimum</p>
                      <p className="text-sm text-gray-700">• Post 6-10 PM for best reach</p>
                    </div>
              </div>

                  {/* Common Mistakes */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">AVOID</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">✗ Poor audio sync</p>
                      <p className="text-sm text-gray-600">✗ Overcomplicating</p>
                      <p className="text-sm text-gray-600">✗ Bad lighting</p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
            </motion.div>
          </div>
        </Tabs>
      </CardContent>
    </Card>

    {/* Scale Modal */}
    <Dialog open={showScaleModal} onOpenChange={setShowScaleModal}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Scale Campaign</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Budget Input */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium text-blue-600">
              Total Budget
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="budget"
                type="number"
                placeholder="Enter amount"
                value={scaleBudget}
                onChange={(e) => setScaleBudget(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
                      </div>
                    </div>

          {/* Region Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-600">
              Select Regions
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {['USA', 'Europe', 'Asia', 'LATAM', 'Middle East', 'Africa'].map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    const newRegions = selectedRegions.includes(region)
                      ? selectedRegions.filter(r => r !== region)
                      : [...selectedRegions, region];
                    setSelectedRegions(newRegions);
                    
                    // Initialize budget split equally
                    if (newRegions.length > 0) {
                      const equalSplit = 100 / newRegions.length;
                      const newBudgets: { [key: string]: number } = {};
                      newRegions.forEach(r => {
                        newBudgets[r] = Math.round(equalSplit);
                      });
                      setRegionBudgets(newBudgets);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedRegions.includes(region)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {region}
                </button>
                  ))}
                </div>
              </div>

          {/* Budget Allocation */}
          {selectedRegions.length > 0 && (
                  <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-600">
                Budget Allocation
              </Label>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {selectedRegions.map((region) => (
                  <div key={region} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{region}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={regionBudgets[region] || 0}
                          onChange={(e) => {
                            const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                            setRegionBudgets({
                              ...regionBudgets,
                              [region]: value
                            });
                          }}
                          className="w-16 text-center text-sm border-gray-300"
                        />
                        <span className="text-sm text-gray-600">%</span>
                    </div>
                    </div>
                    {scaleBudget && (
                      <p className="text-xs text-gray-500">
                        ${((parseFloat(scaleBudget) * (regionBudgets[region] || 0)) / 100).toFixed(2)}
                      </p>
                    )}
                    </div>
                ))}
                
                {/* Total Percentage Check */}
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className={`text-sm font-medium ${
                      Object.values(regionBudgets).reduce((sum, val) => sum + val, 0) === 100
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {Object.values(regionBudgets).reduce((sum, val) => sum + val, 0)}%
                    </span>
                    </div>
                    </div>
                    </div>
                  </div>
          )}
              </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowScaleModal(false)}
            className="px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle scale action here
              console.log('Scaling with:', { budget: scaleBudget, regions: selectedRegions, allocation: regionBudgets });
              setShowScaleModal(false);
            }}
            disabled={
              !scaleBudget || 
              selectedRegions.length === 0 || 
              Object.values(regionBudgets).reduce((sum, val) => sum + val, 0) !== 100
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
          >
            Launch Campaign
          </Button>
                  </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default React.memo(CreativeDetailsCard);