import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { RedLamp } from "@/components/ui/red-lamp";
import { Calendar } from "lucide-react";
import { MaterialCircularLoader } from "@/components/ui/material-loader";
import type { Creative } from "@/components/CreativeCardsGrid";

// Import the creative trends data
const allCreatives: Creative[] = [
  {
    id: 1,
    name: "Lip Sync with TOS",
    description: "Viral lip sync trend featuring dramatic emotional performances",
    datesActive: "Dec 20 - Jan 10",
    videos: [],
    views: "287M",
    totalTrendVideos: "15.2K",
    growth: "+156%",
    viralScore: 9.2,
    momentum: "rising",
    demographics: { ageRanges: [], genderSplit: { male: 40, female: 60 }, topCountries: [] },
    keyTakeaways: [],
    spotifyData: [
      { date: "Jun 13", streams: 1.2 },
      { date: "Jun 14", streams: 1.5 },
      { date: "Jun 15", streams: 1.8 },
      { date: "Jun 16", streams: 2.1 },
      { date: "Jun 17", streams: 2.4 },
      { date: "Jun 18", streams: 2.8 },
      { date: "Jun 19", streams: 3.2 },
      { date: "Jun 20", streams: 3.5 },
      { date: "Jun 21", streams: 3.3 },
      { date: "Jun 22", streams: 3.0 },
      { date: "Jun 23", streams: 2.8 },
      { date: "Jun 24", streams: 2.6 }
    ]
  },
  {
    id: 2,
    name: "Dance Challenge",
    description: "High-energy choreography with synchronized movements",
    datesActive: "Jan 5 - Jan 25",
    videos: [],
    views: "412M",
    totalTrendVideos: "23.8K",
    growth: "+89%",
    viralScore: 8.7,
    momentum: "stable",
    demographics: { ageRanges: [], genderSplit: { male: 40, female: 60 }, topCountries: [] },
    keyTakeaways: [],
    spotifyData: [
      { date: "Jun 13", streams: 2.1 },
      { date: "Jun 14", streams: 2.3 },
      { date: "Jun 15", streams: 2.8 },
      { date: "Jun 16", streams: 2.6 },
      { date: "Jun 17", streams: 2.4 },
      { date: "Jun 18", streams: 2.9 },
      { date: "Jun 19", streams: 3.4 },
      { date: "Jun 20", streams: 3.8 },
      { date: "Jun 21", streams: 4.1 },
      { date: "Jun 22", streams: 4.3 },
      { date: "Jun 23", streams: 4.0 },
      { date: "Jun 24", streams: 3.7 }
    ]
  },
  {
    id: 3,
    name: "Transition Effect",
    description: "Creative transitions with visual effects and timing",
    datesActive: "Jan 8 - Jan 28",
    videos: [],
    views: "178M",
    totalTrendVideos: "8.7K",
    growth: "+234%",
    viralScore: 7.9,
    momentum: "declining",
    demographics: { ageRanges: [], genderSplit: { male: 40, female: 60 }, topCountries: [] },
    keyTakeaways: [],
    spotifyData: [
      { date: "Jun 13", streams: 1.8 },
      { date: "Jun 14", streams: 2.0 },
      { date: "Jun 15", streams: 2.3 },
      { date: "Jun 16", streams: 2.7 },
      { date: "Jun 17", streams: 3.1 },
      { date: "Jun 18", streams: 3.6 },
      { date: "Jun 19", streams: 4.2 },
      { date: "Jun 20", streams: 4.5 },
      { date: "Jun 21", streams: 4.1 },
      { date: "Jun 22", streams: 3.8 },
      { date: "Jun 23", streams: 3.5 },
      { date: "Jun 24", streams: 3.2 }
    ]
  }
];

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

  const [selectedTrends, setSelectedTrends] = useState<number[]>([]); // Default to no trends selected
  const [showSpotifyStreams, setShowSpotifyStreams] = useState(true); // State for showing/hiding Spotify streams
  const [showAllVideos, setShowAllVideos] = useState(true); // State for showing/hiding All Videos line
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);

  // Generate data based on selected creative
  const data = useMemo(() => {
    const generatedData = generateData(selectedCreative);
    console.log('Graph data:', generatedData);
    console.log('Active metrics:', activeMetrics);
    return generatedData;
  }, [selectedCreative]);

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
    const colors = ['#ec4899', '#f59e0b', '#8b5cf6']; // Pink, Orange, Purple for Spotify trends
    return colors[trendId - 1] || '#6b7280';
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
    const dates = ['Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24'];
    
    // Base video data (in thousands)
    const videoData = [1500, 1800, 2100, 2600, 2800, 3200, 3800, 3400, 3200, 3000, 2800, 2600];
    
    const data = dates.map((date, index) => {
      const dataPoint: any = { 
        date,
        videos: videoData[index] // Videos made data
      };
      
      // Add combined Spotify streams data from ALL trends (not just selected)
      let spotifyTotal = 0;
      
      allCreatives.forEach(creative => {
        if (creative.spotifyData) {
          const spotifyPoint = creative.spotifyData.find(d => d.date === date);
          if (spotifyPoint) {
            spotifyTotal += spotifyPoint.streams;
          }
        } else {
          // Generate mock Spotify data if not available
          const baseValue = 2.0 + (creative.id * 0.3);
          const variation = Math.sin((index + creative.id * 2) * 0.5) * 0.8;
          const spotifyValue = baseValue + variation + (index * 0.05);
          spotifyTotal += spotifyValue;
        }
      });
      
      // Add trend-specific video data for selected trends
      selectedTrends.forEach(trendId => {
        const trendVideoBase = 1200 + (trendId * 300);
        const trendVideoVariation = Math.sin((index + trendId) * 0.6) * 400;
        dataPoint[`trend${trendId}`] = trendVideoBase + trendVideoVariation + (index * 50);
      });
      
      // Store the combined Spotify total
      dataPoint.spotifyTotal = spotifyTotal;
      
      return dataPoint;
    });
    
    return data;
  }, [selectedTrends]);

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
            margin={{ top: 20, right: 60, left: 60, bottom: 60 }}
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
              domain={[0, 4500]}
              tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
              label={{ value: 'Videos', angle: -90, position: 'insideLeft', style: { fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 } }}
            />
            {/* Right Y-axis for Spotify Streams */}
            <YAxis 
              yAxisId="spotify"
              orientation="right"
              tick={{ fontSize: 11, fill: showSpotifyStreams ? '#10b981' : 'rgba(0, 0, 0, 0.3)', fontWeight: 500 }}
              stroke="rgba(0, 0, 0, 0.1)"
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={false}
              domain={[0, 'dataMax + 0.5']}
              tickFormatter={(value) => `${value}M`}
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
                  return [
                    <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}>
                      {(value/1000).toFixed(1)}k
                    </span>,
                    <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                      All Videos
                    </span>
                  ];
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
                  return [
                    <span style={{ color: getTrendColor(trendId), fontWeight: 700, fontSize: '14px' }}>
                      {(value/1000).toFixed(1)}k
                    </span>,
                    <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '12px' }}>
                      {trend?.name || 'Unknown Trend'}
                    </span>
                  ];
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