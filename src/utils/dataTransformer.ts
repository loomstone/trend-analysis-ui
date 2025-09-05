import { Creative } from '../components/CreativeCardsGrid';
import trendData from '../../trend_analysis_output.json';

interface TrendData {
  song_metadata: {
    title: string;
    artist: string;
    music_id: string;
    duration_ms: number;
    release_date: string;
    genre: string;
  };
  spotify_data: {
    spotify_id: string;
    total_streams: number;
    daily_streams: number;
    monthly_listeners: number;
    playlist_adds: number;
    save_rate: number;
    skip_rate: number;
    replay_rate: number;
    discovery_source: Record<string, number>;
  };
  trends: Array<{
    name: string;
    summary: string;
    description: string;
    virality_level: number;
    momentum_status: string;
    detected_videos: number;
    top_examples: Array<{
      id: string;
      author_uid: string;
      music_id: string;
      desc: string;
      share_url: string;
      create_time: number;
      region: string;
      thumbnail: string;
      statistics: {
        play_count: number;
        share_count: number;
        comment_count: number;
        like_count: number;
      };
    }>;
    engagement_stats: {
      avg_views: number;
      median_views: number;
      avg_likes: number;
      avg_comments: number;
      avg_shares: number;
      avg_engagement_rate: number;
      total_views: number;
      total_engagements: number;
    };
    demographics: {
      age_range: string;
      age_distribution: Record<string, number>;
      age_confidence: number;
      gender: string;
      gender_split: {
        female: number;
        male: number;
        other?: number;
      };
      gender_confidence: number;
      race_and_ethnicity: string[];
      race_ethnicity_confidence: number;
    };
    creator_archetypes: Record<string, number>;
    regional_distribution: Array<{
      code: string;
      country: string;
      percentage: number;
      video_count: number;
      avg_engagement_rate: number;
    }>;
    type_of_content: string[];
    content_type_confidence: number;
    creative_analysis: string;
    creative_brief: {
      instructions: string;
      key_elements: string[];
    };
    active_date_range: {
      start_date: string;
      end_date: string;
      days_active: number;
      current_phase: string;
    };
    count_by_date: Array<{
      date: string;
      value: number;
    }>;
    weekly_summary: Array<{
      week_start: string;
      week_end: string;
      total_videos: number;
      avg_daily_videos: number;
      peak_day_videos: number;
      growth_rate: number;
    }>;
    trending_hashtags: string[];
    audio_features: {
      bpm: number;
      key_moments: string[];
      mood: string;
    };
  }>;
  aggregate_metrics: {
    total_trends: number;
    total_videos: number;
    total_views: number;
    avg_virality: number;
    platform_reach: {
      tiktok: number;
      instagram_reels: number;
      youtube_shorts: number;
      estimated_total: number;
    };
    timeline_summary: {
      analysis_period: string;
      start_date: string;
      end_date: string;
      peak_trend: string;
      trend_phases: Array<{
        name: string;
        phase: string;
      }>;
    };
  };
  generated_at: string;
  data_version: string;
}

// Map momentum status from API to UI expectations
const mapMomentumStatus = (status: string): "rising" | "stable" | "declining" => {
  switch (status.toLowerCase()) {
    case "new":
    case "rising":
      return "rising";
    case "recommended":
      return "stable";
    case "dying":
      return "declining";
    default:
      return "stable";
  }
};

// Format large numbers for display
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format date range
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
};

// Generate mock Spotify data for the trend period
const generateSpotifyData = (startDate: string, endDate: string, baseStreams: number) => {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= daysDiff; i += 7) { // Weekly data points
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    // Add some variance to streams
    const variance = 0.2;
    const multiplier = 0.8 + Math.random() * variance * 2;
    const streams = Math.round(baseStreams * multiplier);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      streams: streams
    });
  }
  
  return data;
};

// Transform the API data to UI format
export const transformTrendData = (): Creative[] => {
  const data = trendData as TrendData;
  
  return data.trends.map((trend, index) => {
    // Calculate growth based on weekly summaries
    const lastWeek = trend.weekly_summary[trend.weekly_summary.length - 1];
    const previousWeek = trend.weekly_summary[trend.weekly_summary.length - 2];
    const growth = lastWeek && previousWeek ? lastWeek.growth_rate : 0;
    
    // Map creator archetypes to the format expected by UI
    const creatorArchetypes = Object.entries(trend.creator_archetypes).map(([type, percentage]) => ({
      type,
      percentage: Math.round(percentage * 100)
    }));
    
    // Map regional distribution to top countries
    const topCountries = trend.regional_distribution.slice(0, 5).map(region => ({
      country: region.country,
      percentage: Math.round(region.percentage * 100)
    }));
    
    // Map age distribution
    const ageRanges = Object.entries(trend.demographics.age_distribution).map(([range, percentage]) => ({
      range,
      percentage: Math.round(percentage * 100)
    }));
    
    // Map gender split
    const genderSplit = {
      male: Math.round(trend.demographics.gender_split.male * 100),
      female: Math.round(trend.demographics.gender_split.female * 100)
    };
    
    // Map video examples
    const videos = trend.top_examples.map((example, idx) => ({
      thumbnail: example.thumbnail,
      views: formatNumber(example.statistics.play_count),
      creator: `@creator${idx + 1}`, // Mock creator name
      gender: idx % 2 === 0 ? "Female" : "Male",
      archetype: creatorArchetypes[idx % creatorArchetypes.length]?.type || "Influencer",
      region: example.region
    }));
    
    // Add more videos if needed
    while (videos.length < 4) {
      videos.push({
        thumbnail: "/placeholder.svg",
        views: formatNumber(Math.round(trend.engagement_stats.avg_views)),
        creator: `@creator${videos.length + 1}`,
        gender: videos.length % 2 === 0 ? "Female" : "Male",
        archetype: creatorArchetypes[videos.length % creatorArchetypes.length]?.type || "Influencer",
        region: trend.regional_distribution[videos.length % trend.regional_distribution.length]?.code || "US"
      });
    }
    
    return {
      id: index + 1,
      name: trend.name,
      description: trend.summary,
      datesActive: formatDateRange(trend.active_date_range.start_date, trend.active_date_range.end_date),
      recommended: trend.recommended || false,
      videos: videos,
      views: formatNumber(trend.engagement_stats.total_views),
      totalTrendVideos: formatNumber(trend.detected_videos),
      growth: growth >= 0 ? `+${Math.round(growth)}%` : `${Math.round(growth)}%`,
      viralScore: trend.virality_level * 2, // Convert 1-5 to 2-10 scale
      momentum: mapMomentumStatus(trend.momentum_status),
      demographics: {
        ageRanges,
        genderSplit,
        topCountries,
        creatorArchetypes,
        ethnicity: [] // Not provided in the generated data
      },
      keyTakeaways: trend.creative_brief.key_tips, // Keep for now
      spotifyData: generateSpotifyData(
        trend.active_date_range.start_date,
        trend.active_date_range.end_date,
        data.spotify_data.daily_streams
      ),
      // Pass the new structured data
      creativeAnalysis: trend.creative_analysis,
      creativeBrief: trend.creative_brief,
      engagement_stats: trend.engagement_stats,

      // Additional fields from the API that might be useful
      engagementStats: trend.engagement_stats,
      trendingHashtags: trend.trending_hashtags,
      audioFeatures: trend.audio_features,
      countByDate: trend.count_by_date,
      weeklyData: trend.weekly_summary
    } as Creative & { [key: string]: any };
  });
};

// Export song metadata for use in other components
export const getSongMetadata = () => {
  const data = trendData as TrendData;
  return data.song_metadata;
};

// Export Spotify data for use in other components
export const getSpotifyData = () => {
  const data = trendData as TrendData;
  return data.spotify_data;
};

// Export aggregate metrics
export const getAggregateMetrics = () => {
  const data = trendData as TrendData;
  return data.aggregate_metrics;
};
