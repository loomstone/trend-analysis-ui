import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Video, Layers, TrendingUp, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Creative {
  id: string;
  name: string;
  type: "image" | "video" | "carousel";
  thumbnail: string;
  metrics: {
    views: string;
    engagement: string;
    performance: number;
  };
  status: "active" | "paused" | "draft";
  createdAt: string;
}

const mockCreatives: Creative[] = [
  {
    id: "1",
    name: "Summer Vibes Campaign",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    metrics: {
      views: "2.4M",
      engagement: "8.5%",
      performance: 92,
    },
    status: "active",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    name: "Product Launch Teaser",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    metrics: {
      views: "1.8M",
      engagement: "6.2%",
      performance: 78,
    },
    status: "active",
    createdAt: "5 days ago",
  },
  {
    id: "3",
    name: "Behind The Scenes",
    type: "carousel",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    metrics: {
      views: "956K",
      engagement: "12.3%",
      performance: 85,
    },
    status: "paused",
    createdAt: "1 week ago",
  },
  {
    id: "4",
    name: "User Testimonials",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    metrics: {
      views: "3.1M",
      engagement: "9.8%",
      performance: 95,
    },
    status: "active",
    createdAt: "3 days ago",
  },
];

interface CreativesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreativeSelect: (creative: Creative) => void;
  selectedCreativeId?: string;
}

export const CreativesSidebar: React.FC<CreativesSidebarProps> = ({
  isOpen,
  onClose,
  onCreativeSelect,
  selectedCreativeId,
}) => {
  const getTypeIcon = (type: Creative["type"]) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "carousel":
        return <Layers className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Creative["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Creatives Library
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a creative to view details
              </p>
            </div>

            {/* Creatives List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {mockCreatives.map((creative) => (
                  <motion.div
                    key={creative.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCreativeSelect(creative)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                      selectedCreativeId === creative.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={creative.thumbnail}
                          alt={creative.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded p-1">
                          {getTypeIcon(creative.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">
                            {creative.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(creative.status)}
                          >
                            {creative.status}
                          </Badge>
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{creative.metrics.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{creative.metrics.engagement}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{creative.createdAt}</span>
                          </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${creative.metrics.performance}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                Create New Creative
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreativesSidebar;


