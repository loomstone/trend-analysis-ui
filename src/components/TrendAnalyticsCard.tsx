import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { trendData } from "./TrendDiscoveryCard";

const chartDataByTrend = {
  "1": [
    { name: 'Day 1', value: 15 },
    { name: 'Day 2', value: 35 },
    { name: 'Day 3', value: 65 },
    { name: 'Day 4', value: 125 },
    { name: 'Day 5', value: 185 },
    { name: 'Day 6', value: 245 },
    { name: 'Day 7', value: 342 }
  ],
  "2": [
    { name: 'Day 1', value: 8 },
    { name: 'Day 2', value: 22 },
    { name: 'Day 3', value: 45 },
    { name: 'Day 4', value: 78 },
    { name: 'Day 5', value: 125 },
    { name: 'Day 6', value: 156 },
    { name: 'Day 7', value: 189 }
  ],
  "3": [
    { name: 'Day 1', value: 5 },
    { name: 'Day 2', value: 18 },
    { name: 'Day 3', value: 38 },
    { name: 'Day 4', value: 65 },
    { name: 'Day 5', value: 95 },
    { name: 'Day 6', value: 112 },
    { name: 'Day 7', value: 127 }
  ]
};

const geoDataByTrend = {
  "1": [
    { country: "US", percentage: 55 },
    { country: "CA", percentage: 25 },
    { country: "UK", percentage: 15 },
    { country: "AU", percentage: 5 }
  ],
  "2": [
    { country: "US", percentage: 40 },
    { country: "UK", percentage: 30 },
    { country: "CA", percentage: 20 },
    { country: "AU", percentage: 10 }
  ],
  "3": [
    { country: "US", percentage: 35 },
    { country: "CA", percentage: 30 },
    { country: "UK", percentage: 25 },
    { country: "AU", percentage: 10 }
  ]
};

interface TrendAnalyticsCardProps {
  selectedTrendId: string;
}

const TrendAnalyticsCard = ({ selectedTrendId }: TrendAnalyticsCardProps) => {
  const selectedTrend = trendData.find(trend => trend.id === selectedTrendId);
  const chartData = chartDataByTrend[selectedTrendId as keyof typeof chartDataByTrend];
  const geoData = geoDataByTrend[selectedTrendId as keyof typeof geoDataByTrend];

  return (
    <div className="liquid-glass-sky-blue rounded-2xl p-8 h-full flex flex-col">
      <h3 className="text-dashboard-text-primary font-semibold text-xl mb-8">
        {selectedTrend ? `${selectedTrend.title} - Analytics` : 'Trend Analytics'}
      </h3>
      
      <div className="flex-1 flex flex-col space-y-8">
        {/* Growth Trajectory - Clean and minimal inside glass */}
        <div className="flex-1">
          <h4 className="text-dashboard-text-secondary text-sm mb-4 font-medium">Growth Trajectory</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }}
                />
                <YAxis hide />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(142 71% 45%)" 
                  strokeWidth={3}
                  fill="url(#colorGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-dashboard-text-secondary text-sm">Spotify Streams</span>
            <span className="text-dashboard-accent-green font-semibold">+89K/day</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-dashboard-text-secondary text-sm">Stream Movement</span>
            <span className="text-dashboard-text-primary font-semibold">↑ 156% this week</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-dashboard-text-secondary text-sm">Correlation Score</span>
            <span className="text-dashboard-text-primary font-semibold">94% match</span>
          </div>
        </div>

        {/* Geographic Breakdown */}
        <div>
          <h4 className="text-dashboard-text-secondary text-sm mb-4 font-medium">Geographic Breakdown</h4>
          <div className="space-y-3">
            {geoData.map((item) => (
              <div key={item.country} className="flex items-center justify-between">
                <span className="text-dashboard-text-primary text-sm font-medium">{item.country}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-dashboard-accent-blue h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-dashboard-text-secondary text-sm w-10 text-right font-medium">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalyticsCard;