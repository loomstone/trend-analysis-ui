import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { RedLamp } from "@/components/ui/red-lamp";
import { Calendar } from "lucide-react";
import { MaterialCircularLoader } from "@/components/ui/material-loader";
import type { Creative } from "@/components/CreativeCardsGrid";
import { transformTrendData } from "@/utils/dataTransformer";

// Import the creative trends data from the mock data
const allCreatives: Creative[] = transformTrendData();


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

  const [selectedTrends, setSelectedTrends] = useState<number[]>([]); // Default to no trends selected
  const [showSpotifyStreams, setShowSpotifyStreams] = useState(true); // State for showing/hiding Spotify streams
  const [showAllVideos, setShowAllVideos] = useState(true); // State for showing/hiding All Videos line
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);
  const [dataMode, setDataMode] = useState<'videos' | 'views'>('videos'); // Toggle between videos and views

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

  const toggleTrend = (trendId: number) => {
    setIsLoadingTrend(true);
    setSelectedTrends(prev => {
      if (prev.includes(trendId)) {
        return prev.filter(id => id !== trendId);
      } else {
        return [...prev, trendId];
      }
    });
    // Simulate loading
    setTimeout(() => {
      setIsLoadingTrend(false);
    }, 500);
  };

  const getTrendColor = (trendId: number) => {
    // Dynamic color palette that can handle any number of trends
    const colors = [
      '#ec4899', // Pink
      '#f59e0b', // Orange
      '#8b5cf6', // Purple
      '#10b981', // Emerald
      '#ef4444', // Red
      '#6366f1', // Indigo
      '#f97316', // Orange
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#a855f7', // Purple
    ];
    // Use modulo to cycle through colors if there are more trends than colors
    return colors[(trendId - 1) % colors.length] || '#6b7280';
  };

  const metricConfig = {
    trendVideos: { 
      color: '#0ea5e9', 
      label: selectedCreative ? selectedCreative.name : 'Trend Videos' 
    }, // Bright blue
    spotifyStreams: { color: '#10b981', label: 'Spotify Streams' }, // Green
    allVideos: { color: '#a855f7', label: 'All Videos' }, // Bright purple
  };

  // Generate combined data for all selected trends with both videos and streams
  const combinedTrendData = useMemo(() => {
    // Get all unique dates from all creatives' countByDate data
    const allDates = new Set<string>();
    const dateDataMap = new Map<string, any>();
    
    console.log('Graph data:', allCreatives);
    console.log('Active metrics:', activeMetrics);
    console.log('Total videos per creative:', allCreatives.map(c => ({
      name: c.name,
      totalTrendVideos: c.totalTrendVideos,
      countByDateSum: c.countByDate?.reduce((sum, d) => sum + d.value, 0) || 0
    })));
    
    allCreatives.forEach(creative => {
      // Use countByDate if available from the mock data
      if ((creative as any).countByDate) {
        (creative as any).countByDate.forEach((item: any) => {
          allDates.add(item.date);
          if (!dateDataMap.has(item.date)) {
            dateDataMap.set(item.date, {});
          }
          dateDataMap.get(item.date)[`trend${creative.id}`] = item.value;
        });
      }
    });
    
    // Convert dates to sorted array and format them
    const sortedDates = Array.from(allDates).sort();
    
    // If no real data, return empty array
    if (sortedDates.length === 0) {
      return [];
    }
    
    // Build data array with real data
    const data = sortedDates.map(date => {
      const dataPoint: any = { 
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        videos: 0 // Total videos across all trends
      };
      
      // Add data for each trend
      const dateData = dateDataMap.get(date) || {};
      let totalVideos = 0;
      let totalViews = 0;
      
      allCreatives.forEach(creative => {
        const trendKey = `trend${creative.id}`;
        if (dateData[trendKey]) {
          const videoCount = dateData[trendKey];
          totalVideos += videoCount;
          
          // Calculate views based on average views per video for this creative
          const avgViewsPerVideo = creative.engagement?.avgViews || 
            (parseInt(creative.views.replace(/[^0-9]/g, '')) * 1000000 / parseInt(creative.totalTrendVideos.replace(/[^0-9]/g, '')));
          const dailyViews = videoCount * avgViewsPerVideo;
          
          // Only add trend-specific data if it's selected
          if (selectedTrends.includes(creative.id)) {
            dataPoint[trendKey] = dataMode === 'videos' ? videoCount : Math.round(dailyViews / 1000); // Convert views to thousands
          }
          
          totalViews += dailyViews;
        }
      });
      
      dataPoint.videos = dataMode === 'videos' ? totalVideos : Math.round(totalViews / 1000); // Convert views to thousands
      
      // Add combined Spotify streams data
      let spotifyTotal = 0;
      allCreatives.forEach(creative => {
        if (creative.spotifyData) {
          const spotifyPoint = creative.spotifyData.find(d => 
            d.date === dataPoint.date || 
            new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dataPoint.date
          );
          if (spotifyPoint) {
            spotifyTotal += spotifyPoint.streams;
          }
        }
      });
      
      // Scale Spotify data to be in reasonable range (in millions)
      dataPoint.spotifyTotal = spotifyTotal > 0 ? spotifyTotal / 1000000 : Math.random() * 2 + 1; // Convert to millions
      
      return dataPoint;
    });
    
    // Limit to last 30 days if too many data points
    return data.slice(-30);
  }, [selectedTrends, dataMode]);

  return (
    <div className="ice-glass-card rounded-3xl p-6 h-full flex flex-col ice-sparkle" style={{ minHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.h2 
              className="text-4xl font-bold text-slate-900 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Trend Growth
            </motion.h2>
            <motion.p 
              className="text-sm text-slate-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              30-day view of trend performance
            </motion.p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Videos/Views Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 mr-4">
            <motion.button
              onClick={() => setDataMode('videos')}
              className={`relative px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                dataMode === 'videos' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Videos
            </motion.button>
            <motion.button
              onClick={() => setDataMode('views')}
              className={`relative px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                dataMode === 'views' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Views
            </motion.button>
          </div>
          
          {/* All Videos Toggle Button */}
          <motion.button
            onClick={() => setShowAllVideos(!showAllVideos)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 
              ${showAllVideos 
                ? 'bg-transparent' 
                : 'bg-transparent hover:bg-black/10'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="relative z-10 flex items-center gap-2 transition-all duration-300 font-semibold"
              style={{
                color: showAllVideos ? '#3b82f6' : '#64748b',
              }}
            >
              <span 
                className={`w-2 h-2 rounded-full transition-all duration-500`}
                style={{ 
                  backgroundColor: showAllVideos ? '#3b82f6' : '#64748b',
                  boxShadow: showAllVideos ? `0 0 10px #3b82f6, 0 0 20px #3b82f680` : 'none',
                }}
              />
              All Videos
            </span>
            {/* Lamp glow effect when selected */}
            {showAllVideos && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, #3b82f615 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
              />
            )}
          </motion.button>

          {/* Spotify Streams Toggle Button */}
          <motion.button
            onClick={() => setShowSpotifyStreams(!showSpotifyStreams)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 
              ${showSpotifyStreams 
                ? 'bg-transparent' 
                : 'bg-transparent hover:bg-black/10'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="relative z-10 flex items-center gap-2 transition-all duration-300 font-semibold"
              style={{
                color: showSpotifyStreams ? '#10b981' : '#64748b',
              }}
            >
              <span 
                className={`w-2 h-2 rounded-full transition-all duration-500`}
                style={{ 
                  backgroundColor: showSpotifyStreams ? '#10b981' : '#64748b',
                  boxShadow: showSpotifyStreams ? `0 0 10px #10b981, 0 0 20px #10b98180` : 'none',
                }}
              />
              Spotify Streams
            </span>
            {/* Lamp glow effect when selected */}
            {showSpotifyStreams && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, #10b98115 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Graph - Ice Glass Design */}
      <div className="flex-1 relative ice-glass rounded-xl p-6">
        {/* Loading indicator */}
        <AnimatePresence>
          {isLoadingTrend && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-20"
            >
              <MaterialCircularLoader size={36} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={combinedTrendData}
            margin={{ top: 20, right: 60, left: 100, bottom: 60 }}
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
            {/* Left Y-axis for Videos */}
            <YAxis 
              yAxisId="videos"
              tick={{ fontSize: 11, fill: 'rgba(0, 0, 0, 0.6)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
              domain={[0, 'dataMax + 50']}
              tickFormatter={(value) => {
                if (dataMode === 'views') {
                  // Views are already in thousands
                  if (value >= 1000) {
                    return `${(value/1000).toFixed(1)}M`;
                  }
                  return `${value}K`;
                } else {
                  // Videos count
                  return value >= 1000 ? `${(value/1000).toFixed(1)}k` : value;
                }
              }}
              label={{ 
                value: dataMode === 'videos' ? 'Videos' : 'Views', 
                angle: -90, 
                position: 'insideLeft',
                offset: -40,
                style: { fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12, textAnchor: 'middle' } 
              }}
            />
            {/* Right Y-axis for Spotify Streams */}
            <YAxis 
              yAxisId="spotify"
              orientation="right"
              tick={{ fontSize: 11, fill: showSpotifyStreams ? '#10b981' : 'rgba(0, 0, 0, 0.3)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
              domain={[0, 15]}
              tickFormatter={(value) => `${value.toFixed(0)}M`}
              label={{ value: 'Spotify Streams', angle: 90, position: 'insideRight', style: { fill: showSpotifyStreams ? '#10b981' : 'rgba(0, 0, 0, 0.3)', fontSize: 12 } }}
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
                if (name === 'videos') {
                  if (dataMode === 'views') {
                    return [
                      <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}>
                        {value >= 1000 ? `${(value/1000).toFixed(1)}M` : `${value}K`}
                      </span>,
                      <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                        All Views
                      </span>
                    ];
                  } else {
                    return [
                      <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}>
                        {value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                      </span>,
                      <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                        All Videos
                      </span>
                    ];
                  }
                }
                if (name === 'spotifyTotal') {
                  return [
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>
                      {value.toFixed(1)}M
                    </span>,
                    <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                      Spotify Streams
                    </span>
                  ];
                }
                const trendMatch = name.match(/trend(\d+)/);
                if (trendMatch) {
                  const trendId = parseInt(trendMatch[1]);
                  const trend = allCreatives.find(c => c.id === trendId);
                  if (dataMode === 'views') {
                    return [
                      <span style={{ color: getTrendColor(trendId), fontWeight: 700, fontSize: '14px' }}>
                        {value >= 1000 ? `${(value/1000).toFixed(1)}M` : `${value}K`}
                      </span>,
                      <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                        {trend?.name || 'Unknown Trend'}
                      </span>
                    ];
                  } else {
                    return [
                      <span style={{ color: getTrendColor(trendId), fontWeight: 700, fontSize: '14px' }}>
                        {value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                      </span>,
                      <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                        {trend?.name || 'Unknown Trend'}
                      </span>
                    ];
                  }
                }
                return [value, name];
              }}
            />
            
            {/* Videos Made line - conditionally visible based on showAllVideos */}
            {showAllVideos && (
              <Line 
                yAxisId="videos"
                type="natural" 
                dataKey="videos"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 2px 8px rgba(59, 130, 246, 0.25))"
              />
            )}
            
            {/* Render individual trend lines for each selected trend */}
            {selectedTrends.map((trendId) => {
              return (
                <Line 
                  key={`trend-${trendId}`}
                  yAxisId="videos"
                  type="natural" 
                  dataKey={`trend${trendId}`}
                  stroke={getTrendColor(trendId)}
                  strokeWidth={2.5}
                  dot={false}
                  animationDuration={800}
                  filter={`drop-shadow(0 2px 6px ${getTrendColor(trendId)}30)`}
                />
              );
            })}
            
            {/* Single Spotify streams line - only show if Spotify streams are enabled */}
            {showSpotifyStreams && (
              <Line 
                yAxisId="spotify"
                type="natural" 
                dataKey="spotifyTotal"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                animationDuration={800}
                filter="drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Selector - Bottom of the card */}
      <div className="mt-4 flex items-center gap-3">
        {allCreatives.map((creative) => {
          const isSelected = selectedTrends.includes(creative.id);
          const trendColor = getTrendColor(creative.id);
          
          return (
            <motion.button
              key={creative.id}
              onClick={() => toggleTrend(creative.id)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 
                ${isSelected 
                  ? 'bg-transparent' 
                  : 'bg-transparent hover:bg-black/10'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span 
                className="relative z-10 flex items-center gap-1.5 transition-all duration-300 font-semibold"
                style={{
                  color: isSelected ? trendColor : '#64748b',
                  filter: isSelected ? 'brightness(1.1)' : 'brightness(1)',
                }}
              >
                <span 
                  className={`w-2 h-2 rounded-full transition-all duration-500`}
                  style={{ 
                    backgroundColor: isSelected ? trendColor : '#6b7280',
                    boxShadow: isSelected ? `0 0 10px ${trendColor}, 0 0 20px ${trendColor}80` : 'none',
                  }}
                />
                {creative.name}
              </span>
              {/* Lamp glow effect when selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${trendColor}15 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SimpleTrendGraph);