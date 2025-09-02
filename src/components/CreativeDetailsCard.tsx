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

  const renderViralScore = (score: number) => {
    const percentage = (score / 10) * 100;
    const color = score >= 8 ? "text-green-600" : score >= 6 ? "text-yellow-600" : "text-red-600";
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Viral Score</span>
          <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  return (
    <Card className="relative bg-gray-50 rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white/30 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{displayCreative.name}</h2>
              {displayCreative.momentum === "rising" && (
                <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  Hot
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  Rising
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Emerging
                </Badge>
              )}
              {displayCreative.momentum === "declining" && (
                <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 font-medium flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-gray-600" />
                  Dying
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{displayCreative.description}</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg rounded-full px-6"
          >
            <Rocket className="w-4 h-4" />
            Scale
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex flex-col justify-between min-h-[120px] transform-gpu"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 leading-tight">Total</p>
                <p className="text-xs text-gray-600 leading-tight">Views</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{displayCreative.views}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex flex-col justify-between min-h-[120px] transform-gpu"
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 leading-tight">Detected</p>
                <p className="text-xs text-gray-600 leading-tight">Videos</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{displayCreative.totalTrendVideos || "12.4K"}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex flex-col justify-between min-h-[120px] transform-gpu"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs text-gray-600">Growth</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{displayCreative.growth}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex flex-col justify-between min-h-[120px] transform-gpu"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 leading-tight">Dates</p>
                <p className="text-xs text-gray-600 leading-tight">Active</p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-900 leading-tight">{displayCreative.datesActive}</p>
          </motion.div>
        </div>

        {/* Viral Score */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          {renderViralScore(displayCreative.viralScore)}
        </div>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-full p-1 mb-6">
            <TabsTrigger value="demographics" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Demographics</TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Demographics Data */}
              <div className="space-y-4">
                {/* Gender Distribution */}
                <div className="bg-gray-100 rounded-2xl p-5">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    Gender Distribution
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Female</span>
                        <span className="text-sm font-semibold text-gray-900">{displayCreative.demographics.genderSplit.female}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-pink-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${displayCreative.demographics.genderSplit.female}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Male</span>
                        <span className="text-sm font-semibold text-gray-900">{displayCreative.demographics.genderSplit.male}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-blue-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${displayCreative.demographics.genderSplit.male}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Age Range */}
                <div className="bg-gray-50 rounded-2xl p-5 mt-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    Age Distribution
                  </h4>
                <div className="space-y-2">
                  {displayCreative.demographics.ageRanges.map((range) => (
                    <div key={range.range} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{range.range}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={range.percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium w-10 text-right">{range.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Region
                </h4>
                <div className="space-y-2">
                  {displayCreative.demographics.topCountries.slice(0, 4).map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{country.country}</span>
                      <span className="text-sm font-medium">{country.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Archetype */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Creator Archetype
                </h4>
                <div className="space-y-2">
                  {(displayCreative.demographics.creatorArchetypes || [
                    { type: "Influencer", percentage: 35 },
                    { type: "Entertainer", percentage: 30 },
                    { type: "Educator", percentage: 20 },
                    { type: "Artist", percentage: 15 }
                  ]).map((archetype) => (
                    <div key={archetype.type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{archetype.type}</span>
                      <span className="text-sm font-medium">{archetype.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ethnicity - Full Width */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 col-span-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ethnicity
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {(displayCreative.demographics.ethnicity || [
                    { type: "Hispanic/Latino", percentage: 32 },
                    { type: "White", percentage: 28 },
                    { type: "Black/African American", percentage: 18 },
                    { type: "Asian", percentage: 15 },
                    { type: "Other", percentage: 7 }
                  ]).map((ethnic) => (
                    <div key={ethnic.type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{ethnic.type}</span>
                      <span className="text-sm font-medium">{ethnic.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              {/* Right Side - Demographics Insights */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  Demographics Insights
                </h4>
                <div className="space-y-4">
                  <div className="bg-white/80 rounded-xl p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Key Findings</h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>This trend resonates strongly with {displayCreative.demographics.genderSplit.female > displayCreative.demographics.genderSplit.male ? 'female' : 'male'} audiences, showing {Math.abs(displayCreative.demographics.genderSplit.female - displayCreative.demographics.genderSplit.male)}% higher engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <span>Primary age group ({displayCreative.demographics.ageRanges[0].range}) represents {displayCreative.demographics.ageRanges[0].percentage}% of total engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span>Geographic concentration in {displayCreative.demographics.topCountries[0].country} indicates strong regional appeal</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/80 rounded-xl p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Recommendations</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Focus content creation on {displayCreative.demographics.genderSplit.female > 60 ? 'female-oriented themes' : displayCreative.demographics.genderSplit.male > 60 ? 'male-oriented themes' : 'gender-neutral content'} with messaging that appeals to {displayCreative.demographics.ageRanges[0].range} demographics. Consider partnering with creators from {displayCreative.demographics.topCountries[0].country} to maximize authentic reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Engagement Stats & Videos */}
              <div className="space-y-4">
                {/* Engagement Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500 rounded-xl">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{displayCreative.views}</p>
                        <p className="text-sm text-gray-600">Total Views</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500 rounded-xl">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{displayCreative.totalTrendVideos}</p>
                        <p className="text-sm text-gray-600">Detected Videos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Videos Carousel */}
                <div className="bg-gray-100 rounded-2xl p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Top Performing Videos</h4>
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {displayCreative.videos.slice(0, 3).map((video, idx) => (
                        <div key={idx} className="flex-shrink-0 w-48">
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-[9/16] bg-gray-100 relative">
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Engagement Analysis
                </h4>
                <div className="space-y-4">
                  <div className="bg-white/80 rounded-xl p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Content Performance</h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <span>Videos using this trend achieve an average of {Math.floor(parseInt(displayCreative.views.replace(/[^\d]/g, '')) / parseInt(displayCreative.totalTrendVideos.replace(/[^\d]/g, ''))).toLocaleString()} views per post</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                        <span>Peak engagement occurs during {displayCreative.momentum === 'rising' ? 'evening hours (7-11 PM)' : 'afternoon hours (2-6 PM)'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>Tutorial-style content sees {displayCreative.momentum === 'rising' ? '5x' : '3x'} higher completion rates</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/80 rounded-xl p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Growth Trajectory</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(CreativeDetailsCard);