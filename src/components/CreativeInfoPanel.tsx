import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Edit, BarChart3, Eye, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CreativeInfoPanelProps {
  creative: any;
  isOpen: boolean;
  onClose: () => void;
}

export const CreativeInfoPanel: React.FC<CreativeInfoPanelProps> = ({
  creative,
  isOpen,
  onClose,
}) => {
  if (!creative) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {creative.name}
                </h2>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={creative.status === "active" ? "default" : "secondary"}
                    className={
                      creative.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }
                  >
                    {creative.status}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created {creative.createdAt}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" variant="default">
                <Edit className="w-4 h-4 mr-2" />
                Edit Creative
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Preview */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Preview
              </h3>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={creative.thumbnail}
                  alt={creative.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="mt-6 space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {creative.metrics.views}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        +12.5% from last week
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Engagement
                        </span>
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {creative.metrics.engagement}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        +3.2% from last week
                      </p>
                    </div>
                  </div>

                  {/* Performance Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Performance Score
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {creative.metrics.performance}/100
                      </span>
                    </div>
                    <Progress value={creative.metrics.performance} className="h-2" />
                  </div>

                  {/* Engagement Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Engagement Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Likes
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          423K
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Comments
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          12.3K
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Shares
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          8.9K
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This creative showcases our latest product line with a focus on lifestyle
                      and aspirational content. The campaign targets millennials and Gen Z
                      audiences through authentic storytelling.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["summer", "lifestyle", "product", "campaign", "viral"].map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Technical Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Format</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {creative.type === "video" ? "MP4" : "JPEG"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="text-gray-900 dark:text-gray-100">0:15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Resolution</span>
                        <span className="text-gray-900 dark:text-gray-100">1080x1920</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-6 space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      AI Insights
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• Peak engagement occurs between 6-8 PM EST</li>
                      <li>• 73% of viewers watch the full video</li>
                      <li>• Strong performance with 18-24 age group</li>
                      <li>• Consider creating similar content for higher engagement</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreativeInfoPanel;


