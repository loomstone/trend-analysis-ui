import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { RedLamp } from "@/components/ui/red-lamp";
import type { Creative } from "@/components/CreativeCardsGrid";

// Generate data based on selected creative
const generateData = (creative?: Creative | null) => {
  // Default data if no creative selected
  const defaultDates = [
    'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19',
    'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25'
  ];
  
  // Trend Videos data (in thousands, not millions)
  const trendVideos = [1.2, 1.8, 2.1, 1.9, 1.3, 2.0, 3.1, 2.9, 5.2, 3.4, 3.2, 4.1, 2.3];
  
  // All Videos data (higher than trend videos)
  const allVideos = [2.5, 3.2, 3.8, 3.5, 2.8, 3.9, 5.2, 4.9, 7.8, 5.9, 5.6, 6.5, 4.1];

  // Use creative's Spotify data if available
  if (creative?.spotifyData && creative.spotifyData.length > 0) {
    return creative.spotifyData.map((item, i) => ({
      date: item.date,
      trendVideos: trendVideos[i] || 0,
      spotifyStreams: item.streams * 1000, // Convert to thousands
      allVideos: allVideos[i] || 0,
    }));
  }

  // Default Spotify data (in thousands)
  const spotifyStreams = [850, 1100, 1400, 1200, 900, 1500, 2300, 2100, 3800, 2500, 2400, 3000, 1700];

  const combinedData = defaultDates.map((date, i) => ({
    date,
    trendVideos: trendVideos[i],
    spotifyStreams: spotifyStreams[i],
    allVideos: allVideos[i],
  }));

  return combinedData;
};

interface SimpleTrendGraphProps {
  selectedTrendId: string;
  selectedCreative?: Creative | null;
}

const SimpleTrendGraph = ({ selectedTrendId, selectedCreative }: SimpleTrendGraphProps) => {
  const [activeMetrics, setActiveMetrics] = useState({
    trendVideos: false,
    spotifyStreams: true,
    allVideos: true,
  });

  // Generate data based on selected creative
  const data = useMemo(() => generateData(selectedCreative), [selectedCreative]);

  // Auto-enable trend videos when a creative is selected
  useEffect(() => {
    if (selectedCreative) {
      setActiveMetrics(prev => ({ ...prev, trendVideos: true }));
    } else {
      setActiveMetrics(prev => ({ ...prev, trendVideos: false }));
    }
  }, [selectedCreative]);

  const toggleMetric = (metric: string) => {
    setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const metricConfig = {
    trendVideos: { 
      color: '#0ea5e9', 
      label: selectedCreative ? selectedCreative.name : 'Trend Videos' 
    }, // Bright blue
    spotifyStreams: { color: '#10b981', label: 'Spotify Streams' }, // Green
    allVideos: { color: '#a855f7', label: 'All Videos' }, // Bright purple
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Growth
            </motion.h2>
            <motion.span 
              className="text-sm text-gray-500 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              Started Last week
            </motion.span>
          </div>
        </div>
        
        {/* Metric Toggle Buttons */}
        <div className="flex gap-3">
          <AnimatePresence>
            {Object.entries(metricConfig).map(([key, config]) => {
              // Only show Trend Videos button when a creative is selected
              if (key === 'trendVideos' && !selectedCreative) {
                return null;
              }
              
              return (
                <motion.button
                key={key}
                onClick={() => toggleMetric(key)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm ${
                  activeMetrics[key as keyof typeof activeMetrics]
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex items-center gap-2">
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
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Graph - Clean Light Design */}
      <div className="flex-1 relative bg-gray-50 rounded-xl p-6 border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
          >
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="rgba(0, 0, 0, 0.1)" 
              opacity={1}
              vertical={false}
              horizontal={true}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: 'rgba(0, 0, 0, 0.6)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="videos"
              tick={{ fontSize: 11, fill: 'rgba(0, 0, 0, 0.6)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
              domain={[0, 'dataMax']}
              tickFormatter={(value) => `${value}K`}
              label={{ value: 'Videos (K)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 } }}
            />
            <YAxis 
              yAxisId="streams"
              orientation="right"
              tick={{ fontSize: 11, fill: 'rgba(0, 0, 0, 0.6)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
              domain={[0, 'dataMax']}
              tickFormatter={(value) => `${value}K`}
              label={{ value: 'Spotify Streams (K)', angle: 90, position: 'insideRight', style: { fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px'
              }}
              labelStyle={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                const metricLabels: { [key: string]: string } = {
                  trendVideos: 'Trend Videos',
                  spotifyStreams: 'Spotify Streams',
                  allVideos: 'All Videos'
                };
                const formattedValue = name === 'spotifyStreams' 
                  ? `${value.toFixed(0)}K`
                  : `${value.toFixed(1)}K`;
                return [
                  <span style={{ color: 'rgba(0, 0, 0, 1)', fontWeight: 700, fontSize: '14px' }}>
                    {formattedValue}
                  </span>,
                  <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                    {metricLabels[name] || name}
                  </span>
                ];
              }}
            />
            
            {activeMetrics.trendVideos && (
              <Line 
                yAxisId="videos"
                type="natural" 
                dataKey="trendVideos" 
                stroke={metricConfig.trendVideos.color}
                strokeWidth={4}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 2px 8px rgba(14, 165, 233, 0.4))"
              />
            )}
            
            {activeMetrics.spotifyStreams && (
              <Line 
                yAxisId="streams"
                type="natural" 
                dataKey="spotifyStreams" 
                stroke={metricConfig.spotifyStreams.color}
                strokeWidth={4}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 2px 8px rgba(16, 185, 129, 0.4))"
              />
            )}
            
            {activeMetrics.allVideos && (
              <Line 
                yAxisId="videos"
                type="natural" 
                dataKey="allVideos" 
                stroke={metricConfig.allVideos.color}
                strokeWidth={4}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 2px 8px rgba(168, 85, 247, 0.4))"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(SimpleTrendGraph);
