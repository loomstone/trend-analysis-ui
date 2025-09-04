import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";
import { trendData } from "./TrendDiscoveryCard";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Flame, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Enhanced data with multiple trend lines
const enhancedChartData = {
  "1": [
    { 
      name: 'Day 1', 
      organic: 15, 
      paid: 8, 
      viral: 5,
      engagement: 28,
      creators: 12 
    },
    { 
      name: 'Day 2', 
      organic: 35, 
      paid: 22, 
      viral: 18,
      engagement: 75,
      creators: 34 
    },
    { 
      name: 'Day 3', 
      organic: 65, 
      paid: 45, 
      viral: 42,
      engagement: 152,
      creators: 78 
    },
    { 
      name: 'Day 4', 
      organic: 125, 
      paid: 78, 
      viral: 95,
      engagement: 298,
      creators: 156 
    },
    { 
      name: 'Day 5', 
      organic: 185, 
      paid: 112, 
      viral: 178,
      engagement: 475,
      creators: 289 
    },
    { 
      name: 'Day 6', 
      organic: 245, 
      paid: 156, 
      viral: 267,
      engagement: 668,
      creators: 412 
    },
    { 
      name: 'Day 7', 
      organic: 342, 
      paid: 189, 
      viral: 389,
      engagement: 920,
      creators: 578 
    }
  ]
};



interface EnhancedTrendAnalyticsProps {
  selectedTrendId: string;
}

const EnhancedTrendAnalytics = ({ selectedTrendId }: EnhancedTrendAnalyticsProps) => {
  const [activeLines, setActiveLines] = useState({
    organic: true,
    paid: true,
    viral: true,
    engagement: false,
    creators: false
  });



  const chartData = enhancedChartData[selectedTrendId as keyof typeof enhancedChartData] || enhancedChartData["1"];
  const selectedTrend = trendData.find(trend => trend.id === selectedTrendId);

  const toggleLine = (line: string) => {
    setActiveLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const getTrendStatus = (status: string) => {
    switch (status) {
      case "exploding":
        return { icon: Flame, color: "text-orange-500", bg: "bg-orange-50", label: "Exploding" };
      case "rising":
        return { icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", label: "Rising Fast" };
      case "emerging":
        return { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", label: "Emerging" };
      default:
        return { icon: AlertCircle, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800", label: "Unknown" };
    }
  };

  const status = getTrendStatus(selectedTrend?.status || "");
  const StatusIcon = status.icon;

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 flex flex-col space-y-6">
          {/* Trend Status Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className={`p-3 rounded-xl ${status.bg} ${status.color}`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <StatusIcon className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedTrend?.title || 'Trend Analytics'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{status.label} • Started {selectedTrend?.startedDate}</p>
              </div>
            </div>
          </motion.div>

          {/* Multi-Line Chart with Controls */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(activeLines).map(([key, active]) => (
                <motion.button
                  key={key}
                  onClick={() => toggleLine(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </motion.button>
              ))}
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="organicGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="viralGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  
                  <AnimatePresence>
                    {activeLines.organic && (
                      <Area 
                        type="monotone" 
                        dataKey="organic" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        fill="url(#organicGradient)"
                        animationDuration={800}
                      />
                    )}
                    {activeLines.paid && (
                      <Area 
                        type="monotone" 
                        dataKey="paid" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#paidGradient)"
                        animationDuration={800}
                      />
                    )}
                    {activeLines.viral && (
                      <Area 
                        type="monotone" 
                        dataKey="viral" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        fill="url(#viralGradient)"
                        animationDuration={800}
                      />
                    )}
                  </AnimatePresence>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Reach", value: "12.3M", change: "+342%", positive: true },
              { label: "Engagement Rate", value: "21.5%", change: "+5.2%", positive: true },
              { label: "Creator Count", value: "578", change: "+89", positive: true },
              { label: "Avg. Views", value: "3.2M", change: "+1.2M", positive: true }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 font-semibold ${metric.positive ? 'text-dashboard-success' : 'text-dashboard-critical-red'}`}>
                  {metric.change}
                </p>
              </motion.div>
            ))}
          </div>
        </TabsContent>



        <TabsContent value="insights" className="flex-1">
          <div className="space-y-4">
            {[
              {
                type: "success",
                icon: CheckCircle,
                title: "High Growth Potential",
                description: "This trend is showing exponential growth with 342% increase in the last week. Peak performance expected in 3-5 days."
              },
              {
                type: "warning",
                icon: AlertCircle,
                title: "Competition Analysis",
                description: "4 major brands are already leveraging this trend. Quick action recommended to maintain competitive advantage."
              },
              {
                type: "info",
                icon: TrendingUp,
                title: "Optimal Posting Time",
                description: "Based on engagement patterns, posting between 6-8 PM EST yields 45% higher engagement rates."
              }
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${
                  insight.type === 'success' ? 'bg-green-50 border-green-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <insight.icon className={`w-6 h-6 mt-1 ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTrendAnalytics;
