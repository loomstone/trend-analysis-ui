import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Heart, MessageCircle, Share2, Clock, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const creatorData = [
  {
    id: 1,
    username: "@trendsetter",
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
    views: "4.2M",
    likes: "892K",
    comments: "45.2K",
    shares: "12.3K",
    engagement: 21.2,
    trending: true,
    videoTitle: "Perfect lip sync timing ✨",
    duration: "0:15",
    soundUsed: "Original Sound - No Na",
    postedTime: "2 hours ago",
    tiktokUrl: "https://www.tiktok.com/@trendsetter/video/7123456789"
  },
  {
    id: 2,
    username: "@viralqueen",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    views: "3.8M",
    likes: "756K",
    comments: "38.9K",
    shares: "9.8K",
    engagement: 19.9,
    trending: true,
    videoTitle: "This trend is everything 🔥",
    duration: "0:18",
    soundUsed: "Remix - DJ Nova",
    postedTime: "4 hours ago",
    tiktokUrl: "https://www.tiktok.com/@viralqueen/video/7123456790"
  },
  {
    id: 3,
    username: "@danceking",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    views: "2.9M",
    likes: "623K",
    comments: "29.8K",
    shares: "7.2K",
    engagement: 21.5,
    trending: false,
    videoTitle: "Dance challenge accepted! 💃",
    duration: "0:22",
    soundUsed: "Original Sound - No Na",
    postedTime: "6 hours ago",
    tiktokUrl: "https://www.tiktok.com/@danceking/video/7123456791"
  },
  {
    id: 4,
    username: "@musicvibes",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    views: "2.1M",
    likes: "445K",
    comments: "22.1K",
    shares: "5.6K",
    engagement: 21.2,
    trending: true,
    videoTitle: "Emotional moment with this sound 🎵",
    duration: "0:16",
    soundUsed: "Acoustic Version - No Na",
    postedTime: "8 hours ago",
    tiktokUrl: "https://www.tiktok.com/@musicvibes/video/7123456792"
  },
  {
    id: 5,
    username: "@comedycentral",
    thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
    views: "1.8M",
    likes: "389K",
    comments: "19.5K",
    shares: "4.3K",
    engagement: 21.6,
    trending: false,
    videoTitle: "Wait for it... 😂",
    duration: "0:20",
    soundUsed: "Original Sound - No Na",
    postedTime: "12 hours ago",
    tiktokUrl: "https://www.tiktok.com/@comedycentral/video/7123456793"
  },
  {
    id: 6,
    username: "@fashionista",
    thumbnail: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
    views: "1.5M",
    likes: "312K",
    comments: "15.8K",
    shares: "3.9K",
    engagement: 20.8,
    trending: true,
    videoTitle: "Outfit transition magic ✨",
    duration: "0:12",
    soundUsed: "Speed Up Version - No Na",
    postedTime: "1 day ago",
    tiktokUrl: "https://www.tiktok.com/@fashionista/video/7123456794"
  }
];

interface CreatorVideosGridProps {
  selectedTrendId: string;
}

const CreatorVideosGrid = ({ selectedTrendId }: CreatorVideosGridProps) => {
  const [hoveredCreator, setHoveredCreator] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "trending" | "top">("all");

  const filteredCreators = creatorData.filter(creator => {
    if (selectedFilter === "trending") return creator.trending;
    if (selectedFilter === "top") return parseFloat(creator.views) > 3;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Creator Videos</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Top performing content using this trend</p>
        </div>
        
        <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)}>
          <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Filter videos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter by</SelectLabel>
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  All Videos
                </span>
              </SelectItem>
              <SelectItem value="trending">
                <span className="flex items-center gap-2">
                  <span>🔥</span> Trending
                </span>
              </SelectItem>
              <SelectItem value="top">
                <span className="flex items-center gap-2">
                  <span>👑</span> Top Performers
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.05 
              }}
              onHoverStart={() => setHoveredCreator(creator.id)}
              onHoverEnd={() => setHoveredCreator(null)}
              onClick={() => window.open(creator.tiktokUrl, '_blank')}
              className="relative group cursor-pointer"
            >
              <div className="aspect-[9/16] relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img 
                  src={creator.thumbnail} 
                  alt={creator.username}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {creator.duration}
                </div>
                
                {/* Trending Badge */}
                {creator.trending && (
                  <motion.div 
                    className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    TRENDING
                  </motion.div>
                )}

                {/* Play Button Overlay */}
                <AnimatePresence>
                  {hoveredCreator === creator.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="bg-white rounded-full p-4 shadow-lg">
                          <Play className="w-8 h-8 text-gray-900 dark:text-gray-100 fill-current" />
                        </div>
                        <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                          View on TikTok
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Creator Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-semibold text-white text-sm mb-1">{creator.username}</h4>
                  <p className="text-white/90 text-xs mb-2 line-clamp-1">{creator.videoTitle}</p>
                  
                  {/* Sound Used */}
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-3">
                    <Music className="w-3 h-3" />
                    <span className="truncate">{creator.soundUsed}</span>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-white/80 text-xs mb-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {creator.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {creator.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {creator.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {creator.shares}
                    </span>
                  </div>
                  
                  {/* Engagement Rate Bar */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                    <motion.div 
                      className="h-1.5 bg-gradient-to-r from-purple-400 to-pink-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${creator.engagement * 4}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  
                  {/* Posted Time */}
                  <p className="text-white/60 text-xs mt-2">{creator.postedTime}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


    </div>
  );
};

export default CreatorVideosGrid;
