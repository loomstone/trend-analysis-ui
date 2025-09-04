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
  ],
  creativeAnalysis: {
    description: "This trend revolves around comedic timing and relatable scenarios using trending audio. Creators act out everyday situations with exaggerated reactions that sync perfectly with the audio cues.",
    content_strategy: "The trend thrives on relatability and perfect comedic timing. Top performing content uses the audio to highlight universal experiences that viewers instantly recognize."
  },
  creativeBrief: {
    quick_steps: [
      "Set up phone at eye level with good lighting",
      "Practice audio timing (0:04, 0:08, 0:12)",
      "Build emotional intensity throughout"
    ],
    key_tips: [
      "Natural lighting works best",
      "Film in 1080p minimum",
      "Post 6-10 PM for best reach"
    ],
    avoid: ["Poor audio sync", "Overcomplicating", "Bad lighting"]
  }
};

const CreativeDetailsCard: React.FC<CreativeDetailsCardProps> = ({ selectedCreative }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [demographicsTimeFilter, setDemographicsTimeFilter] = useState('30 Days');
  const [engagementTimeFilter, setEngagementTimeFilter] = useState('30 Days');
  const [engagementMetric, setEngagementMetric] = useState('views');
  
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
    // Demographics percentages don't change with time period
    // Only the absolute values (views, engagement) change
    return displayCreative.demographics;
  };

  const currentDemographics = getDemographicsForPeriod(demographicsTimeFilter);
  
  // Function to get engagement data based on time filter and metric
  const getEngagementDataForPeriod = (period: string, metric: string = 'views') => {
    // Use actual data from selected creative
    if (!displayCreative || !displayCreative.demographics) {
        return {
        gender: { female: { value: 0, percentage: 0 }, male: { value: 0, percentage: 0 } },
        age: {},
        creators: {},
        regions: {}
      };
    }

    // Calculate multiplier based on period (30-day base)
    const periodMultiplier = {
      '1 Day': 0.033,   // ~1/30
      '7 Days': 0.233,  // ~7/30
      '14 Days': 0.467, // ~14/30
      '30 Days': 1      // Full period
    }[period] || 1;

    // Get actual demographics from selected creative
    const genderSplit = displayCreative.demographics.genderSplit || { female: 65, male: 35 };
    const ageRanges = displayCreative.demographics.ageRanges || [];
    const creatorArchetypes = displayCreative.demographics.creatorArchetypes || [];
    const topCountries = displayCreative.demographics.topCountries || [];

    // Get actual values from engagement stats
    const engagementStats = displayCreative.engagement_stats || displayCreative.engagement || {};
    const totalViews = (engagementStats.total_views || parseInt(displayCreative.views?.replace(/[^0-9]/g, '') || '0')) * periodMultiplier;
    
    // Use actual average values from the data
    const avgViews = engagementStats.avg_views || engagementStats.avgViews || (totalViews / parseInt(displayCreative.totalTrendVideos?.replace(/[^0-9]/g, '') || '1'));
    const avgComments = engagementStats.avg_comments || engagementStats.avgComments || (avgViews * 0.008);
    const avgShares = engagementStats.avg_shares || engagementStats.avgShares || (avgViews * 0.025);
    const totalEngagements = engagementStats.total_engagements || engagementStats.totalEngagements || (totalViews * 0.15);
    
    // Calculate base value based on selected metric
    let baseValue;
    switch(metric) {
      case 'views':
        baseValue = totalViews;
        break;
      case 'comments':
        baseValue = avgComments * parseInt(displayCreative.totalTrendVideos?.replace(/[^0-9]/g, '') || '1') * periodMultiplier;
        break;
      case 'shares':
        baseValue = avgShares * parseInt(displayCreative.totalTrendVideos?.replace(/[^0-9]/g, '') || '1') * periodMultiplier;
        break;
      case 'engagement':
        baseValue = totalEngagements;
        break;
      default:
        baseValue = totalViews;
    }

    // Format the data structure expected by the UI
    const formatValue = (val: number) => {
      // Keep the actual value without converting to millions/thousands
      // The formatMetricLabel function will handle the display formatting
      return Math.round(val);
    };

    // Build gender data
    const genderData = {
      female: { 
        value: formatValue(baseValue * (genderSplit.female / 100)), 
        percentage: genderSplit.female 
      },
      male: { 
        value: formatValue(baseValue * (genderSplit.male / 100)), 
        percentage: genderSplit.male 
      }
    };

    // Build age data
    const ageData: any = {};
    ageRanges.forEach((range: any) => {
      const ageKey = range.range === '35+' ? '35+' : range.range;
      ageData[ageKey] = {
        value: formatValue(baseValue * (range.percentage / 100)),
        percentage: range.percentage
      };
    });

    // Build creator data
    const creatorData: any = {};
    creatorArchetypes.forEach((archetype: any) => {
      creatorData[archetype.type] = {
        value: formatValue(baseValue * (archetype.percentage / 100)),
        percentage: archetype.percentage
      };
    });

    // Build region data
    const regionData: any = {};
    topCountries.forEach((country: any) => {
      regionData[country.country] = {
        value: formatValue(baseValue * (country.percentage / 100)),
        percentage: country.percentage
      };
    });

    const baseData = {
      views: {
        gender: genderData,
        age: ageData,
        creators: creatorData,
        regions: regionData
      },
      comments: {
        gender: genderData,
        age: ageData,
        creators: creatorData,
        regions: regionData
      },
      shares: {
        gender: genderData,
        age: ageData,
        creators: creatorData,
        regions: regionData
      },
      engagement: {
        gender: genderData,
        age: ageData,
        creators: creatorData,
        regions: regionData
      }
    };
    
    const selectedMetricData = baseData[metric as keyof typeof baseData] || baseData.views;
    
    // Adjust values based on period
    const multipliers = {
      '1 Day': 0.02,
      '1 Week': 0.14,
      '1 Month': 0.6,
      '3 Months': 1
    };
    
    const multiplier = multipliers[period] || 1;
    
    // Apply multiplier to all values
    const adjustedData = JSON.parse(JSON.stringify(selectedMetricData));
    
    Object.keys(adjustedData.gender).forEach(key => {
      adjustedData.gender[key].value = Math.round(adjustedData.gender[key].value * multiplier);
    });
    
    Object.keys(adjustedData.age).forEach(key => {
      adjustedData.age[key].value = Math.round(adjustedData.age[key].value * multiplier);
    });
    
    Object.keys(adjustedData.creators).forEach(key => {
      adjustedData.creators[key].value = Math.round(adjustedData.creators[key].value * multiplier);
    });
    
    Object.keys(adjustedData.regions).forEach(key => {
      adjustedData.regions[key].value = Math.round(adjustedData.regions[key].value * multiplier);
    });
    
    return adjustedData;
  };
  
  const currentEngagementData = getEngagementDataForPeriod(engagementTimeFilter, engagementMetric);
  
  // Calculate relative percentages for bar widths based on actual values
  const calculateRelativePercentage = (value: number, allValues: number[]) => {
    const maxValue = Math.max(...allValues);
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };
  
  // Get relative percentages for each category
  const genderValues = [
    currentEngagementData.gender.female?.value || 0,
    currentEngagementData.gender.male?.value || 0
  ];
  const genderRelativePercentages = {
    female: calculateRelativePercentage(currentEngagementData.gender.female?.value || 0, genderValues),
    male: calculateRelativePercentage(currentEngagementData.gender.male?.value || 0, genderValues)
  };
  
  // Calculate relative percentages for age groups
  const ageValues = Object.values(currentEngagementData.age || {}).map((item: any) => item.value || 0);
  const ageRelativePercentages: any = {};
  Object.keys(currentEngagementData.age || {}).forEach(ageKey => {
    ageRelativePercentages[ageKey] = calculateRelativePercentage(
      currentEngagementData.age[ageKey]?.value || 0, 
      ageValues
    );
  });
  
  // Calculate relative percentages for creator types
  const creatorValues = Object.values(currentEngagementData.creators || {}).map((item: any) => item.value || 0);
  const creatorRelativePercentages: any = {};
  Object.keys(currentEngagementData.creators || {}).forEach(creatorKey => {
    creatorRelativePercentages[creatorKey] = calculateRelativePercentage(
      currentEngagementData.creators[creatorKey]?.value || 0, 
      creatorValues
    );
  });
  
  // Calculate relative percentages for regions
  const regionValues = Object.values(currentEngagementData.regions || {}).map((item: any) => item.value || 0);
  const regionRelativePercentages: any = {};
  Object.keys(currentEngagementData.regions || {}).forEach(regionKey => {
    regionRelativePercentages[regionKey] = calculateRelativePercentage(
      currentEngagementData.regions[regionKey]?.value || 0, 
      regionValues
    );
  });
  
  // Helper function to format engagement metric labels
  const formatMetricLabel = (value: number) => {
    switch(engagementMetric) {
      case 'views':
        if (value >= 1000000000) {
          return `${(value / 1000000000).toFixed(1)}B views`;
        } else if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M views`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K views`;
        }
        return `${value} views`;
      case 'comments':
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M comments`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K comments`;
        }
        return `${value} comments`;
      case 'shares':
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M shares`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K shares`;
        }
        return `${value} shares`;
      case 'engagement':
        if (value >= 1000000000) {
          return `${(value / 1000000000).toFixed(1)}B engagements`;
        } else if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M engagements`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K engagements`;
        }
        return `${value} engagements`;
      default:
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M views`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K views`;
        }
        return `${value} views`;
    }
  };

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

      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
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

      <CardContent className="space-y-8 pt-2">
        {/* Tabs for detailed information */}
        <Tabs defaultValue="demographics" className="w-full" value={activeTab} onValueChange={handleTabChange} activationMode="manual">
          <TabsList className="flex gap-8 bg-transparent p-0 mb-8 h-auto">
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
            <TabsContent value="demographics" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            <div className="space-y-6 pb-6">
              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">Demographics of creators on this sound</h3>
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
                          <span className="text-xs text-gray-900">Female: <span className="font-bold">{currentDemographics.genderSplit.female}%</span></span>
                      </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.secondary }} />
                          <span className="text-xs text-gray-900">Male: <span className="font-bold">{currentDemographics.genderSplit.male}%</span></span>
                      </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.primary }} />
                          <span className="text-xs text-gray-900">Male: <span className="font-bold">{currentDemographics.genderSplit.male}%</span></span>
                    </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.gender.secondary }} />
                          <span className="text-xs text-gray-900">Female: <span className="font-bold">{currentDemographics.genderSplit.female}%</span></span>
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
                              <span className="text-xs font-medium text-gray-900">{range.range}</span>
                              <span className="text-xs font-semibold text-gray-900">{range.percentage}%</span>
                          </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full"
                                style={{ backgroundColor: barColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${range.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                              key={`age-${range.range}-${demographicsTimeFilter}`}
                            />
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
                              <span className="text-xs font-medium text-gray-900">{arch.type}</span>
                              <span className="text-xs font-semibold text-gray-900">{arch.percentage}%</span>
                          </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full"
                                style={{ backgroundColor: barColor }}
                              initial={{ width: 0 }}
                                animate={{ width: `${arch.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            />
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
                              <span className="text-xs font-medium text-gray-900">{country.country}</span>
                              <span className="text-xs font-semibold text-gray-900">{country.percentage}%</span>
                          </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full"
                                style={{ backgroundColor: barColor }}
                              initial={{ width: 0 }}
                                animate={{ width: `${country.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                            />
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
                <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">Best Performing Demographics</h4>
                <div className="flex gap-2">
                  {/* Metric selector buttons */}
                  {['views', 'comments', 'shares'].map(metric => (
                    <button
                      key={metric}
                      onClick={() => setEngagementMetric(metric)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all capitalize ${
                        engagementMetric === metric 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                      } border`}
                    >
                      {metric}
                    </button>
                  ))}
                  </div>
                </div>
                
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
                        <span className="text-sm text-gray-900 font-medium">Female</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.gender.female.value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                          className="bg-purple-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${genderRelativePercentages.female}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`gender-female-${engagementTimeFilter}-${engagementMetric}`}
                        />
                    </div>
                    </div>
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Male</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.gender.male.value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-blue-500 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: `${genderRelativePercentages.male}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`gender-male-${engagementTimeFilter}-${engagementMetric}`}
                                />
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
                    {currentEngagementData.age['13-17'] && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">13-17</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.age['13-17'].value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-cyan-400 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: `${ageRelativePercentages['13-17'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`age-13-17-${engagementTimeFilter}-${engagementMetric}`}
                                />
                    </div>
                    </div>
                      )}
                          {currentEngagementData.age['18-24'] && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">18-24</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.age['18-24'].value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                          className="bg-pink-500 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${ageRelativePercentages['18-24'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`age-18-24-${engagementTimeFilter}-${engagementMetric}`}
                            />
                      </div>
                    </div>
                          )}
                    {currentEngagementData.age['25-34'] && (
                  <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">25-34</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.age['25-34'].value)}</span>
                  </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                          className="bg-yellow-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${ageRelativePercentages['25-34'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          key={`age-25-34-${engagementTimeFilter}-${engagementMetric}`}
                            />
                          </div>
                        </div>
                      )}
                          {currentEngagementData.age['35-44'] && (
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">35-44</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.age['35-44'].value)}</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                          className="bg-lime-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${ageRelativePercentages['35-44'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          key={`age-35-44-${engagementTimeFilter}-${engagementMetric}`}
                        />
                            </div>
                              </div>
                          )}
                          {currentEngagementData.age['45+'] && (
                            <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">45+</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.age['45+'].value)}</span>
                            </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-purple-400 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: `${ageRelativePercentages['45+'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                          key={`age-45+-${engagementTimeFilter}-${engagementMetric}`}
                                />
                              </div>
                            </div>
                          )}
                          </div>
                </div>
                
                {/* Creator Type Performance */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,1),0_0_30px_rgba(251,146,60,0.5)]" />
                    Creator Type Performance
                  </h5>
                    <div className="space-y-3">
                    {currentEngagementData.creators['Influencer'] && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Influencer</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.creators['Influencer'].value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                          className="bg-orange-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${creatorRelativePercentages['Influencer'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`creator-influencer-${engagementTimeFilter}-${engagementMetric}`}
                            />
                      </div>
                    </div>
                    )}
                    {currentEngagementData.creators['Entertainer'] && (
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Entertainer</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.creators['Entertainer'].value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                          className="bg-pink-500 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${creatorRelativePercentages['Entertainer'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`creator-entertainer-${engagementTimeFilter}-${engagementMetric}`}
                            />
                      </div>
                    </div>
                          )}
                          {currentEngagementData.creators['Educator'] && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Educator</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.creators['Educator'].value)}</span>
                    </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                          className="bg-cyan-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${creatorRelativePercentages['Educator'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          key={`creator-educator-${engagementTimeFilter}-${engagementMetric}`}
                            />
                        </div>
                      </div>
                          )}
                    {currentEngagementData.creators['Artist'] && (
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Artist</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.creators['Artist'].value)}</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                          className="bg-lime-400 h-full rounded-full"
                                  initial={{ width: 0 }}
                          animate={{ width: `${creatorRelativePercentages['Artist'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          key={`creator-artist-${engagementTimeFilter}-${engagementMetric}`}
                                />
                            </div>
                              </div>
                    )}
                          </div>
                        </div>
                        
                {/* Region Performance */}
                              <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1),0_0_30px_rgba(74,222,128,0.5)]" />
                    Region Performance
                  </h5>
                        <div className="space-y-3">
                    {(currentEngagementData.regions['USA'] || currentEngagementData.regions['United States']) && (
                      <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">USA</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel((currentEngagementData.regions['USA'] || currentEngagementData.regions['United States']).value)}</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                          className="bg-green-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${regionRelativePercentages['USA'] || regionRelativePercentages['United States'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          key={`region-usa-${engagementTimeFilter}-${engagementMetric}`}
                            />
                          </div>
                          </div>
                      )}
                                {currentEngagementData.regions['Mexico'] && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Mexico</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.regions['Mexico'].value)}</span>
                        </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                          className="bg-violet-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${regionRelativePercentages['Mexico'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          key={`region-mexico-${engagementTimeFilter}-${engagementMetric}`}
                        />
                              </div>
                          </div>
                          )}
                          {currentEngagementData.regions['Brazil'] && (
                              <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Brazil</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.regions['Brazil'].value)}</span>
                        </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                          className="bg-rose-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${regionRelativePercentages['Brazil'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          key={`region-brazil-${engagementTimeFilter}-${engagementMetric}`}
                        />
                        </div>
                      </div>
                          )}
                            {currentEngagementData.regions['Indonesia'] && (
                          <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900 font-medium">Indonesia</span>
                        <span className="text-sm font-bold text-gray-900">{formatMetricLabel(currentEngagementData.regions['Indonesia'].value)}</span>
                              </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                          className="bg-amber-400 h-full rounded-full"
                              initial={{ width: 0 }}
                          animate={{ width: `${regionRelativePercentages['Indonesia'] || 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          key={`region-indonesia-${engagementTimeFilter}-${engagementMetric}`}
                            />
                          </div>
                          </div>
                            )}
                        </div>
                              </div>
                          </div>
                        </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-4 h-full overflow-y-auto" tabIndex={-1}>
            <div className="space-y-6 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-2xl text-gray-900">
                  Top Videos
                </h4>
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
                      className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all min-h-[400px]"
                    >
                      {/* Top Section with Profile and Carousel side by side */}
                      <div className="flex gap-6">
                        {/* Left Side - Creator Info */}
                        <div className="flex-1">
                          {/* Profile Header */}
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                              {video.creator.slice(1, 3).toUpperCase()}
                          </div>
                              <div>
                                      <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 text-lg">{video.creator}</h4>
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
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
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                              <p className="text-sm text-gray-700 font-medium">FOLLOWERS</p>
                              <p className="font-semibold text-gray-900 text-lg">{Math.floor(Math.random() * 200 + 50)}K</p>
                                  </div>
                            <div>
                              <p className="text-sm text-gray-700 font-medium">GENDER</p>
                              <p className="font-semibold text-gray-900 text-lg">{['Female', 'Male', 'Female', 'Female'][idx % 4]}</p>
                                </div>
                            <div>
                              <p className="text-sm text-gray-700 font-medium">REGION</p>
                              <p className="font-semibold text-gray-900 text-lg">{['USA', 'Europe', 'Asia', 'LATAM'][idx % 4]}</p>
                              </div>
                            <div>
                              <p className="text-sm text-gray-700 font-medium">LANGUAGE</p>
                              <p className="font-semibold text-gray-900 text-lg">English</p>
                                </div>
                              </div>
                              
                          {/* Creator Analysis */}
                          <div className="mt-6">
                            <p className="text-sm font-semibold text-gray-600 mb-2">CREATOR ANALYSIS</p>
                            <p className="text-base text-gray-700 leading-relaxed">
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
                        <div className="w-[420px]">
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-600 mb-3">RECENT CONTENT</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {/* Main Trend Video - First */}
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="w-28 h-40 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={video.thumbnail} 
                                      alt={`${video.creator} trend video`} 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600/90 text-white text-xs rounded font-medium">
                                      Trend Video
                                  </div>
                                </div>
                              </div>
                            </div>

                              {/* Other Recent Content */}
                              {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex-shrink-0">
                                  <div className="w-28 h-40 bg-gray-200 rounded-lg overflow-hidden">
                                    <img 
                                      src="/placeholder.svg" 
                                      alt={`Recent content ${item}`} 
                                      className="w-full h-full object-cover"
                                />
                              </div>
                                  </div>
                              ))}
                                </div>
                            <p className="text-[9px] text-gray-700 text-center mt-1.5 italic">Swipe to see more • Tap to view videos</p>
                                  </div>
                                </div>
                              </div>
                          
                      </motion.div>
                    ))}
                  </div>
                    </div>
                        </div>
          </TabsContent>

          <TabsContent value="creative-analysis" className="mt-6 h-full overflow-y-auto" tabIndex={-1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Creative Analysis Section */}
              <div className="space-y-8">
                <h4 className="text-2xl font-bold text-gray-900">CREATIVE ANALYSIS</h4>
                
                        <div className="space-y-8">
                  <div>
                    <h5 className="text-base font-semibold text-blue-600 mb-4">DESCRIPTION</h5>
                    <p className="text-gray-700 leading-loose text-base">
                      {displayCreative.creativeAnalysis?.description || "This trend revolves around comedic timing and relatable scenarios using trending audio."}
                    </p>
                          </div>
                          <div>
                    <h5 className="text-base font-semibold text-blue-600 mb-4">CONTENT STRATEGY</h5>
                    <p className="text-gray-700 leading-loose text-base">
                      {displayCreative.creativeAnalysis?.content_strategy || "The trend thrives on relatability and perfect comedic timing."}
                    </p>
                            </div>
                          </div>
                        </div>
                        
              {/* Creative Brief Section */}
              <div className="bg-gray-50/80 p-8 rounded-lg space-y-8">
                <h4 className="text-2xl font-bold text-gray-900">CREATIVE BRIEF</h4>

                {/* Quick Steps */}
                              <div>
                  <h5 className="text-base font-semibold text-blue-600 mb-5">QUICK STEPS</h5>
                  <ol className="space-y-4">
                    {(displayCreative.creativeBrief?.quick_steps || ["Set up phone at eye level", "Practice timing", "Build intensity"]).map((step, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">{index + 1}</span>
                        <span className="text-gray-800 text-base">{step}</span>
                      </li>
                    ))}
                  </ol>
                          </div>
                          
                {/* Key Tips */}
                            <div>
                  <h5 className="text-base font-semibold text-blue-600 mb-5">KEY TIPS</h5>
                  <ul className="space-y-4">
                    {(displayCreative.creativeBrief?.key_tips || ["Natural lighting works best", "Film in 1080p minimum", "Post 8-10 PM for best reach"]).map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-500 mt-1">&#8226;</span>
                        <span className="text-gray-800 text-base">{tip}</span>
                      </li>
                    ))}
                    </ul>
                </div>
                
                  </div>
            </div>
          </TabsContent>
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
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
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
                        <span className="text-sm text-gray-900 font-medium">%</span>
                                      </div>
                              </div>
                    {scaleBudget && (
                      <p className="text-xs text-gray-700">
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