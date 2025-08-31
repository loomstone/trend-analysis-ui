import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { RedLamp } from "@/components/ui/red-lamp";

// Mock data for different metrics
const generateData = () => {
  const baseData = [
    { date: 'Jun 13', value: 1.2 },
    { date: 'Jun 14', value: 1.8 },
    { date: 'Jun 15', value: 2.1 },
    { date: 'Jun 16', value: 1.9 },
    { date: 'Jun 17', value: 1.3 },
    { date: 'Jun 18', value: 2.0 },
    { date: 'Jun 19', value: 3.1 },
    { date: 'Jun 20', value: 2.9 },
    { date: 'Jun 21', value: 5.2 },
    { date: 'Jun 22', value: 3.4 },
    { date: 'Jun 23', value: 3.2 },
    { date: 'Jun 24', value: 4.1 },
    { date: 'Jun 25', value: 2.3 },
  ];

  return {
    videos: baseData,
    engagement: baseData.map(d => ({ ...d, value: d.value * 1.5 + Math.random() * 0.5 })),
    creators: baseData.map(d => ({ ...d, value: d.value * 0.8 + Math.random() * 0.3 })),
    shares: baseData.map(d => ({ ...d, value: d.value * 0.6 + Math.random() * 0.4 })),
  };
};

const data = generateData();

interface SimpleTrendGraphProps {
  selectedTrendId: string;
}

const SimpleTrendGraph = ({ selectedTrendId }: SimpleTrendGraphProps) => {
  const [activeMetrics, setActiveMetrics] = useState({
    videos: true,
    engagement: false,
    creators: false,
    shares: false,
  });

  const toggleMetric = (metric: string) => {
    setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const metricConfig = {
    videos: { color: '#1e40af', label: 'Videos' }, // Deep blue
    engagement: { color: '#0ea5e9', label: 'Engagement' }, // Sky blue
    creators: { color: '#6366f1', label: 'Creators' }, // Indigo
    shares: { color: '#06b6d4', label: 'Shares' }, // Cyan
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.h2 
              className="text-5xl font-bold text-white drop-shadow-md tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Lip Sync
            </motion.h2>
            <div className="flex items-center gap-3 mt-8">
              <motion.span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Exploding
              </motion.span>
              <motion.span 
                className="text-sm text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                Started Last week
              </motion.span>
            </div>
          </div>
        </div>
        
        {/* Metric Toggle Buttons */}
        <div className="flex gap-3">
          {Object.entries(metricConfig).map(([key, config]) => (
            <motion.button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeMetrics[key as keyof typeof activeMetrics]
                  ? 'bg-white/30 backdrop-blur-md text-white shadow-lg border border-white/40'
                  : 'bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 border border-white/20'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2.5">
                <motion.span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                  animate={{
                    scale: activeMetrics[key as keyof typeof activeMetrics] ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {config.label}
              </span>
              {activeMetrics[key as keyof typeof activeMetrics] && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: `radial-gradient(circle at center, ${config.color}20, transparent)`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 relative bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data.videos}
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="rgba(255, 255, 255, 0.2)" 
              opacity={0.5}
              vertical={false}
              horizontal={true}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}
              stroke="transparent"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}
              stroke="transparent"
              axisLine={false}
              tickLine={false}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '12px 16px',
                backdropFilter: 'blur(16px)'
              }}
              labelStyle={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                <span style={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 700, fontSize: '14px' }}>
                  {value.toFixed(1)}M
                </span>,
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>videos</span>
              ]}
            />
            
            {activeMetrics.videos && (
              <Line 
                type="natural" 
                dataKey="value" 
                data={data.videos}
                stroke={metricConfig.videos.color}
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 0 6px rgba(30, 64, 175, 0.5))"
              />
            )}
            
            {activeMetrics.engagement && (
              <Line 
                type="natural" 
                dataKey="value" 
                data={data.engagement}
                stroke={metricConfig.engagement.color}
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 0 6px rgba(14, 165, 233, 0.5))"
              />
            )}
            
            {activeMetrics.creators && (
              <Line 
                type="natural" 
                dataKey="value" 
                data={data.creators}
                stroke={metricConfig.creators.color}
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))"
              />
            )}
            
            {activeMetrics.shares && (
              <Line 
                type="natural" 
                dataKey="value" 
                data={data.shares}
                stroke={metricConfig.shares.color}
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleTrendGraph;
