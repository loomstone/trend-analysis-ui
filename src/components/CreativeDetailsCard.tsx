import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, Users, Globe, Target, Rocket, BarChart3, 
  Lightbulb, Calendar, Play, Heart, Eye, Share2,
  Zap, Flame, ArrowUpRight, Clock, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
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

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === displayCreative.videos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? displayCreative.videos.length - 1 : prev - 1
    );
  };

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
    <Card className="relative bg-gradient-to-br from-sky-400/20 via-blue-400/15 to-cyan-400/10 backdrop-blur-md border border-sky-200/30 shadow-lg shadow-sky-200/20 overflow-hidden">
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
                <Badge className="bg-white/30 backdrop-blur-sm text-white border border-white/40 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Hot
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore >= 8 && (
                <Badge className="bg-white/30 backdrop-blur-sm text-white border border-white/40 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Rising
                </Badge>
              )}
              {displayCreative.momentum === "stable" && displayCreative.viralScore < 8 && (
                <Badge className="bg-white/30 backdrop-blur-sm text-white border border-white/40 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Emerging
                </Badge>
              )}
              {displayCreative.momentum === "declining" && (
                <Badge className="bg-white/30 backdrop-blur-sm text-white border border-white/40 font-medium flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
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
            whileHover={{ scale: 1.05 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex flex-col justify-between min-h-[120px]"
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
            whileHover={{ scale: 1.05 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex flex-col justify-between min-h-[120px]"
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
            whileHover={{ scale: 1.05 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs text-gray-600">Growth</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{displayCreative.growth}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex flex-col justify-between min-h-[120px]"
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
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          {renderViralScore(displayCreative.viralScore)}
        </div>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/30 backdrop-blur-sm">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="videos">Top Videos</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Gender Distribution */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Gender
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Female</span>
                    <div className="flex items-center gap-2">
                      <Progress value={displayCreative.demographics.genderSplit.female} className="w-20 h-2" />
                      <span className="text-sm font-medium w-10 text-right">{displayCreative.demographics.genderSplit.female}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Male</span>
                    <div className="flex items-center gap-2">
                      <Progress value={displayCreative.demographics.genderSplit.male} className="w-20 h-2" />
                      <span className="text-sm font-medium w-10 text-right">{displayCreative.demographics.genderSplit.male}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Range */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age Range
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
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
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
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
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
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Key Takeaways
              </h4>
              <ul className="space-y-2">
                {displayCreative.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Top Performing Videos
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={prevVideo}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs">
                    {currentVideoIndex + 1} / {displayCreative.videos.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={nextVideo}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentVideoIndex * 100}%)`,
                  }}
                >
                  {displayCreative.videos.map((video, idx) => (
                    <div
                      key={idx}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="flex gap-4">
                        <div className="w-32 flex-shrink-0">
                          <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={video.thumbnail}
                              alt={`Video ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">{video.creator}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{video.views} views</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-gray-600">Performance highlights:</p>
                            <ul className="mt-1 space-y-1 text-xs text-gray-500">
                              <li>• Peak engagement: First 3 seconds</li>
                              <li>• Completion rate: 87%</li>
                              <li>• Share rate: 12.5%</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              <div className="flex justify-center mt-4 gap-1">
                {displayCreative.videos.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentVideoIndex
                        ? 'bg-sky-500 w-4'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentVideoIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="mt-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Recommended Strategy
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Launch campaign during peak hours (7-11 PM EST)</p>
                <p>• Partner with 5-10 micro-influencers in target demographics</p>
                <p>• Create tutorial content to boost participation</p>
                <p>• Implement hashtag strategy: #{displayCreative.name.replace(/\s+/g, '')}Challenge</p>
                <p>• Budget allocation: 60% creators, 30% paid promotion, 10% monitoring</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreativeDetailsCard;