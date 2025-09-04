import json
import random
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
import numpy as np

def parse_input_file(filename: str) -> Dict[str, Any]:
    """Parse input.txt file to extract artist, song, and context information"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract artist name
        artist_match = re.search(r'Artist(?:\s+Name)?:\s*(.+?)(?:\n|$)', content, re.IGNORECASE)
        artist = artist_match.group(1).strip() if artist_match else "Unknown Artist"
        
        # Extract song title
        song_match = re.search(r'Song(?:\s+(?:Title|Name))?:\s*(.+?)(?:\n|$)', content, re.IGNORECASE)
        song_title = song_match.group(1).strip() if song_match else "Unknown Song"
        
        # Extract demographics if present
        demographics = {}
        
        # Age demographics
        age_section = re.search(r'Age(?:\s+Demographics)?:(.*?)(?:Gender|$)', content, re.IGNORECASE | re.DOTALL)
        if age_section:
            age_text = age_section.group(1)
            demographics['age'] = {}
            # Look for age ranges and percentages
            age_patterns = [
                (r'13-17[:\s]+(\d+)%?', '13-17'),
                (r'18-24[:\s]+(\d+)%?', '18-24'),
                (r'25-34[:\s]+(\d+)%?', '25-34'),
                (r'35-44[:\s]+(\d+)%?', '35-44'),
                (r'45\+[:\s]+(\d+)%?', '45+')
            ]
            for pattern, age_range in age_patterns:
                match = re.search(pattern, age_text)
                if match:
                    demographics['age'][age_range] = float(match.group(1)) / 100
        
        # Gender demographics
        gender_section = re.search(r'Gender(?:\s+Demographics)?:(.*?)(?:Region|Location|$)', content, re.IGNORECASE | re.DOTALL)
        if gender_section:
            gender_text = gender_section.group(1)
            demographics['gender'] = {}
            gender_patterns = [
                (r'(?:Female|Women)[:\s]+(\d+)%?', 'female'),
                (r'(?:Male|Men)[:\s]+(\d+)%?', 'male'),
                (r'Other[:\s]+(\d+)%?', 'other')
            ]
            for pattern, gender in gender_patterns:
                match = re.search(pattern, gender_text, re.IGNORECASE)
                if match:
                    demographics['gender'][gender] = float(match.group(1)) / 100
        
        # Extract genre if present
        genre_match = re.search(r'Genre:\s*(.+?)(?:\n|$)', content, re.IGNORECASE)
        genre = genre_match.group(1).strip() if genre_match else None
        
        # Extract any additional context
        context_section = re.search(r'Context:(.*?)(?:Demographics|$)', content, re.IGNORECASE | re.DOTALL)
        context = context_section.group(1).strip() if context_section else ""
        
        # Extract mood/vibe keywords
        mood_keywords = []
        mood_section = re.search(r'(?:Mood|Vibe|Style):(.*?)(?:\n\n|$)', content, re.IGNORECASE | re.DOTALL)
        if mood_section:
            mood_text = mood_section.group(1).lower()
            # Common mood keywords
            possible_moods = ['energetic', 'emotional', 'upbeat', 'chill', 'dramatic', 'melancholic', 
                            'aggressive', 'romantic', 'nostalgic', 'dark', 'happy', 'sad']
            mood_keywords = [mood for mood in possible_moods if mood in mood_text]
        
        return {
            'artist': artist,
            'song_title': song_title,
            'demographics': demographics,
            'genre': genre,
            'context': context,
            'mood_keywords': mood_keywords
        }
        
    except FileNotFoundError:
        print(f"Error: {filename} not found. Using default values.")
        return {
            'artist': 'Unknown Artist',
            'song_title': 'Unknown Song',
            'demographics': {},
            'genre': None,
            'context': '',
            'mood_keywords': []
        }
    except Exception as e:
        print(f"Error parsing input file: {e}. Using default values.")
        return {
            'artist': 'Unknown Artist',
            'song_title': 'Unknown Song',
            'demographics': {},
            'genre': None,
            'context': '',
            'mood_keywords': []
        }

class TikTokTrendMockDataGenerator:
    def __init__(self, song_title: str, artist: str, real_creative_example: str = None, 
                 parsed_data: Dict = None):
        self.song_title = song_title
        self.artist = artist
        self.real_creative_example = real_creative_example
        self.music_id = self._generate_id()
        
        # Store parsed data for use in generation
        self.parsed_data = parsed_data or {}
        self.input_demographics = self.parsed_data.get('demographics', {})
        self.input_genre = self.parsed_data.get('genre', None)
        self.input_context = self.parsed_data.get('context', '')
        self.mood_keywords = self.parsed_data.get('mood_keywords', [])
        
        # Configuration for trend generation
        self.config = {
            "num_trends": 3,
            "date_range_days": 90,  # 3-month analysis period
            "start_date": datetime.now() - timedelta(days=90),  # Start 3 months ago
            "end_date": datetime.now(),
            "regions": ["US", "UK", "CA", "AU", "BR", "MX", "FR", "DE", "JP", "KR"],
            "trend_templates": [
                {
                    "type": "dance",
                    "keywords": ["dance", "choreography", "moves", "sync", "routine"],
                    "content_types": ["dance", "lip sync", "music", "choreography"]
                },
                {
                    "type": "transformation",
                    "keywords": ["transition", "transformation", "reveal", "before/after", "glow up"],
                    "content_types": ["transformation", "fashion", "transition effects", "outfit change"]
                },
                {
                    "type": "storytelling",
                    "keywords": ["POV", "story", "scenario", "relatable", "comedy"],
                    "content_types": ["POV", "comedy", "storytelling", "acting", "skit"]
                },
                {
                    "type": "lifestyle",
                    "keywords": ["aesthetic", "vibe", "mood", "daily", "routine"],
                    "content_types": ["lifestyle", "aesthetic", "vlog", "daily routine"]
                },
                {
                    "type": "challenge",
                    "keywords": ["challenge", "try", "attempt", "fail", "success"],
                    "content_types": ["challenge", "competition", "reaction", "attempt"]
                }
            ]
        }
    
    def _generate_id(self) -> str:
        """Generate a TikTok-style ID"""
        return str(random.randint(7400000000000000000, 7599999999999999999))
    
    def _generate_spotify_data(self) -> Dict:
        """Generate Spotify streaming data"""
        base_streams = random.randint(10000000, 500000000)
        daily_streams = random.randint(500000, 5000000)
        
        return {
            "spotify_id": ''.join(random.choices('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', k=22)),
            "total_streams": base_streams,
            "daily_streams": daily_streams,
            "monthly_listeners": random.randint(1000000, 20000000),
            "playlist_adds": random.randint(10000, 500000),
            "save_rate": round(random.uniform(0.15, 0.45), 3),
            "skip_rate": round(random.uniform(0.20, 0.40), 3),
            "replay_rate": round(random.uniform(0.25, 0.55), 3),
            "discovery_source": {
                "algorithmic_playlists": round(random.uniform(0.30, 0.50), 2),
                "user_playlists": round(random.uniform(0.15, 0.25), 2),
                "search": round(random.uniform(0.10, 0.20), 2),
                "artist_profile": round(random.uniform(0.05, 0.15), 2),
                "other": round(random.uniform(0.10, 0.20), 2)
            }
        }
    
    def _generate_time_series(self, virality_level: int, start_date: datetime, days: int, trend_type: str) -> List[Dict]:
        """Generate realistic time series data for trend growth over 3 months"""
        dates = []
        
        # Define trend phases for a 3-month period
        discovery_phase = int(days * 0.15)  # ~2 weeks
        growth_phase = int(days * 0.25)     # ~3 weeks
        peak_phase = int(days * 0.20)       # ~2.5 weeks
        decline_phase = int(days * 0.40)    # ~5 weeks
        
        # Adjust phases based on virality level
        if virality_level >= 4:  # Viral trend - faster growth, shorter peak
            discovery_phase = int(days * 0.10)  # ~1 week
            growth_phase = int(days * 0.20)     # ~2.5 weeks
            peak_phase = int(days * 0.25)       # ~3 weeks
            decline_phase = int(days * 0.45)    # ~5.5 weeks
            
            # Base values for viral trends
            discovery_base = random.randint(100, 500)
            peak_multiplier = random.uniform(15, 25)
            
        elif virality_level == 3:  # Moderate trend
            discovery_base = random.randint(50, 200)
            peak_multiplier = random.uniform(8, 12)
            
        else:  # Slow burn trend - longer discovery, sustained plateau
            discovery_phase = int(days * 0.25)  # ~3 weeks
            growth_phase = int(days * 0.30)     # ~4 weeks
            peak_phase = int(days * 0.30)       # ~4 weeks
            decline_phase = int(days * 0.15)    # ~2 weeks
            
            discovery_base = random.randint(10, 50)
            peak_multiplier = random.uniform(3, 6)
        
        peak_value = discovery_base * peak_multiplier
        
        # Generate daily values
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            
            # Determine which phase we're in
            if i < discovery_phase:
                # Discovery phase - slow initial growth
                phase_progress = i / discovery_phase
                base_value = discovery_base * (0.5 + 0.5 * phase_progress)
                
            elif i < discovery_phase + growth_phase:
                # Growth phase - exponential growth
                phase_progress = (i - discovery_phase) / growth_phase
                base_value = discovery_base + (peak_value - discovery_base) * (phase_progress ** 2)
                
            elif i < discovery_phase + growth_phase + peak_phase:
                # Peak phase - high but variable
                phase_progress = (i - discovery_phase - growth_phase) / peak_phase
                # Add slight decline during peak phase
                base_value = peak_value * (1 - 0.2 * phase_progress)
                
            else:
                # Decline phase - gradual decrease
                phase_progress = (i - discovery_phase - growth_phase - peak_phase) / decline_phase
                # Different decline patterns based on trend type
                if "dance" in trend_type:
                    # Dance trends decline more gradually
                    decline_factor = 1 - (0.7 * phase_progress)
                elif "challenge" in trend_type:
                    # Challenges drop off more quickly
                    decline_factor = 1 - (0.85 * phase_progress ** 0.5)
                else:
                    # Standard decline
                    decline_factor = 1 - (0.8 * phase_progress)
                
                base_value = peak_value * 0.8 * decline_factor
            
            # Weekly patterns - weekends see 20-40% more activity
            day_of_week = current_date.weekday()
            if day_of_week == 4:  # Friday
                day_multiplier = random.uniform(1.15, 1.25)
            elif day_of_week >= 5:  # Weekend
                day_multiplier = random.uniform(1.2, 1.4)
            else:  # Weekday
                day_multiplier = random.uniform(0.85, 1.0)
            
            # Add daily variance
            daily_noise = random.uniform(0.8, 1.2)
            
            # Calculate final value
            value = int(base_value * day_multiplier * daily_noise)
            
            # Ensure minimum value
            value = max(1, value)
            
            dates.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "value": value
            })
        
        return dates
    
    def _generate_momentum_status(self, virality_level: int, days_since_start: int, total_days: int) -> str:
        """Calculate momentum status based on trend phase in 3-month timeline"""
        # Calculate what phase we're in based on days since trend started
        phase_percentage = days_since_start / total_days
        
        if phase_percentage < 0.15:  # First ~2 weeks
            return "Emerging"
        elif phase_percentage < 0.40 and virality_level >= 4:  # Weeks 3-5 for viral
            return "Rising Fast"
        elif phase_percentage < 0.40:  # Weeks 3-5 for non-viral
            return "Growing"
        elif phase_percentage < 0.60:  # Weeks 6-8 (peak period)
            return "Peak"
        elif phase_percentage < 0.80:  # Weeks 9-11
            return "Declining"
        else:  # Final weeks
            return "Fading"
    
    def _get_trend_phase(self, days_since_start: int, total_days: int) -> str:
        """Determine the current phase of the trend"""
        phase_percentage = days_since_start / total_days
        
        if phase_percentage < 0.15:
            return "Discovery"
        elif phase_percentage < 0.40:
            return "Growth"
        elif phase_percentage < 0.60:
            return "Peak"
        elif phase_percentage < 0.80:
            return "Decline"
        else:
            return "Fade-out"
    
    def _generate_weekly_summary(self, time_series: List[Dict]) -> List[Dict]:
        """Generate weekly aggregated data from daily time series"""
        weekly_data = []
        current_week = []
        week_start = None
        
        for day_data in time_series:
            date = datetime.strptime(day_data["date"], "%Y-%m-%d")
            
            if week_start is None:
                week_start = date
            
            # Check if we've moved to a new week
            if (date - week_start).days >= 7:
                if current_week:
                    # Calculate weekly metrics
                    weekly_data.append({
                        "week_start": week_start.strftime("%Y-%m-%d"),
                        "week_end": (week_start + timedelta(days=6)).strftime("%Y-%m-%d"),
                        "total_videos": sum(d["value"] for d in current_week),
                        "avg_daily_videos": round(sum(d["value"] for d in current_week) / len(current_week), 1),
                        "peak_day_videos": max(d["value"] for d in current_week),
                        "growth_rate": self._calculate_weekly_growth(weekly_data, current_week)
                    })
                
                # Start new week
                current_week = [day_data]
                week_start = date
            else:
                current_week.append(day_data)
        
        # Add final week if there's data
        if current_week:
            weekly_data.append({
                "week_start": week_start.strftime("%Y-%m-%d"),
                "week_end": (datetime.strptime(current_week[-1]["date"], "%Y-%m-%d")).strftime("%Y-%m-%d"),
                "total_videos": sum(d["value"] for d in current_week),
                "avg_daily_videos": round(sum(d["value"] for d in current_week) / len(current_week), 1),
                "peak_day_videos": max(d["value"] for d in current_week),
                "growth_rate": self._calculate_weekly_growth(weekly_data, current_week)
            })
        
        return weekly_data
    
    def _calculate_weekly_growth(self, previous_weeks: List[Dict], current_week: List[Dict]) -> float:
        """Calculate week-over-week growth rate"""
        if not previous_weeks:
            return 0.0
        
        current_total = sum(d["value"] for d in current_week)
        previous_total = previous_weeks[-1]["total_videos"]
        
        if previous_total == 0:
            return 100.0 if current_total > 0 else 0.0
        
        growth_rate = ((current_total - previous_total) / previous_total) * 100
        return round(growth_rate, 1)
    
    def _generate_demographics(self, trend_type: str) -> Dict:
        """Generate detailed demographic distributions"""
        # Use input demographics if available, otherwise generate based on trend type
        if self.input_demographics.get('age'):
            # Use provided age demographics with some variation
            age_distribution = {}
            total = 0
            for age_range, percentage in self.input_demographics['age'].items():
                # Add some random variation (±10% of the original value)
                variation = random.uniform(-0.1, 0.1) * percentage
                age_distribution[age_range] = round(max(0.01, percentage + variation), 3)
                total += age_distribution[age_range]
            
            # Normalize to ensure sum is 1
            if total > 0:
                for age_range in age_distribution:
                    age_distribution[age_range] = round(age_distribution[age_range] / total, 3)
            
            # Find primary age group
            primary_age = max(age_distribution.items(), key=lambda x: x[1])[0] if age_distribution else "18-24"
        else:
            # Default age distribution based on trend type
            if "dance" in trend_type or "challenge" in trend_type:
                age_distribution = {
                    "13-17": round(random.uniform(0.25, 0.35), 3),
                    "18-24": round(random.uniform(0.35, 0.45), 3),
                    "25-34": round(random.uniform(0.15, 0.25), 3),
                    "35-44": round(random.uniform(0.05, 0.10), 3),
                    "45+": round(random.uniform(0.02, 0.05), 3)
                }
                primary_age = "18-24"
            else:
                age_distribution = {
                    "13-17": round(random.uniform(0.10, 0.20), 3),
                    "18-24": round(random.uniform(0.30, 0.40), 3),
                    "25-34": round(random.uniform(0.25, 0.35), 3),
                    "35-44": round(random.uniform(0.10, 0.20), 3),
                    "45+": round(random.uniform(0.05, 0.10), 3)
                }
                primary_age = "25-34"
        
        # Gender distribution
        if self.input_demographics.get('gender'):
            # Use provided gender demographics with some variation
            gender_split = {}
            total = 0
            for gender, percentage in self.input_demographics['gender'].items():
                # Add some random variation (±10% of the original value)
                variation = random.uniform(-0.1, 0.1) * percentage
                gender_split[gender] = round(max(0.01, percentage + variation), 3)
                total += gender_split[gender]
            
            # Normalize to ensure sum is close to 1
            if total > 0:
                for gender in gender_split:
                    gender_split[gender] = round(gender_split[gender] / total, 3)
            
            # Determine dominant gender
            if gender_split.get('female', 0) > 0.6:
                dominant_gender = "Female"
            elif gender_split.get('male', 0) > 0.6:
                dominant_gender = "Male"
            else:
                dominant_gender = "Mixed"
        else:
            # Default gender distribution based on trend type
            if "fashion" in trend_type or "transformation" in trend_type:
                gender_split = {
                    "female": round(random.uniform(0.70, 0.85), 3),
                    "male": round(random.uniform(0.10, 0.25), 3),
                    "other": round(random.uniform(0.03, 0.08), 3)
                }
                dominant_gender = "Female"
            else:
                gender_split = {
                    "female": round(random.uniform(0.45, 0.55), 3),
                    "male": round(random.uniform(0.40, 0.50), 3),
                    "other": round(random.uniform(0.03, 0.08), 3)
                }
                dominant_gender = "Mixed"
        
        return {
            "age_range": primary_age,
            "age_distribution": age_distribution,
            "age_confidence": round(random.uniform(0.65, 0.85), 3),
            "gender": dominant_gender,
            "gender_split": gender_split,
            "gender_confidence": round(random.uniform(0.70, 0.90), 3),
            "race_and_ethnicity": ["White", "Hispanic/Latino", "Asian", "Black", "Other"],
            "race_ethnicity_confidence": round(random.uniform(0.75, 0.95), 3)
        }
    
    def _generate_creator_archetypes(self, trend_type: str) -> Dict:
        """Generate creator archetype distribution"""
        if "dance" in trend_type:
            return {
                "Entertainer": round(random.uniform(0.40, 0.50), 3),
                "Influencer": round(random.uniform(0.25, 0.35), 3),
                "Artist": round(random.uniform(0.15, 0.25), 3),
                "Educator": round(random.uniform(0.05, 0.10), 3)
            }
        elif "storytelling" in trend_type or "POV" in trend_type:
            return {
                "Entertainer": round(random.uniform(0.50, 0.60), 3),
                "Influencer": round(random.uniform(0.20, 0.30), 3),
                "Artist": round(random.uniform(0.10, 0.15), 3),
                "Educator": round(random.uniform(0.05, 0.10), 3)
            }
        else:
            return {
                "Influencer": round(random.uniform(0.35, 0.45), 3),
                "Entertainer": round(random.uniform(0.25, 0.35), 3),
                "Artist": round(random.uniform(0.15, 0.25), 3),
                "Educator": round(random.uniform(0.10, 0.20), 3)
            }
    
    def _generate_regional_distribution(self, num_regions: int = 5) -> List[Dict]:
        """Generate regional distribution with percentages"""
        regions = random.sample(self.config["regions"], min(num_regions, len(self.config["regions"])))
        distributions = []
        remaining = 1.0
        
        for i, region in enumerate(regions):
            if i == len(regions) - 1:
                percentage = round(remaining, 3)
            else:
                percentage = round(random.uniform(0.1, min(0.5, remaining - 0.1 * (len(regions) - i - 1))), 3)
                remaining -= percentage
            
            distributions.append({
                "code": region,
                "country": self._get_country_name(region),
                "percentage": percentage,
                "video_count": random.randint(20, 200),
                "avg_engagement_rate": round(random.uniform(0.08, 0.15), 3)
            })
        
        return sorted(distributions, key=lambda x: x["percentage"], reverse=True)
    
    def _get_country_name(self, code: str) -> str:
        """Map country codes to names"""
        mapping = {
            "US": "United States",
            "UK": "United Kingdom",
            "CA": "Canada",
            "AU": "Australia",
            "BR": "Brazil",
            "MX": "Mexico",
            "FR": "France",
            "DE": "Germany",
            "JP": "Japan",
            "KR": "South Korea"
        }
        return mapping.get(code, code)
    
    def _generate_trend(self, trend_index: int) -> Dict:
        """Generate a complete trend object"""
        # Select trend template
        template = self.config["trend_templates"][trend_index % len(self.config["trend_templates"])]
        trend_type = template["type"]
        
        # Generate trend names and descriptions
        trend_names = {
            "dance": f"Synchronized {self.song_title} Dance",
            "transformation": f"{self.song_title} Transformation Challenge",
            "storytelling": f"POV {self.song_title} Stories",
            "lifestyle": f"{self.song_title} Aesthetic Vibes",
            "challenge": f"{self.song_title} Challenge"
        }
        
        trend_summaries = {
            "dance": f"Creators perform energetic choreography to {self.song_title}, featuring signature moves and formations.",
            "transformation": f"Dramatic transformations and reveals synchronized to the beat drops in {self.song_title}.",
            "storytelling": f"Creative POV scenarios and relatable stories set to {self.song_title}'s emotional moments.",
            "lifestyle": f"Aesthetic content capturing moods and vibes that match {self.song_title}'s energy.",
            "challenge": f"Viral challenge incorporating {self.song_title}'s catchy elements into creative tasks."
        }
        
        # Base metrics for 3-month period
        virality_level = random.randint(2, 5)
        
        # Realistic video counts for 3-month period based on virality
        if virality_level >= 4:  # Viral trend
            detected_videos = random.randint(5000, 50000)  # High volume
        elif virality_level == 3:  # Moderate trend
            detected_videos = random.randint(1000, 5000)   # Medium volume
        else:  # Niche trend
            detected_videos = random.randint(100, 1000)    # Lower volume
        
        # Generate time series for full 3-month period
        # Trends can start at different times within the analysis window
        trend_start_offset = random.randint(0, 30)  # Can start up to 30 days into the period
        days_active = min(90 - trend_start_offset, random.randint(60, 90))  # Active for 2-3 months
        start_date = self.config["start_date"] + timedelta(days=trend_start_offset)
        time_series = self._generate_time_series(virality_level, start_date, days_active, trend_type)
        
        # Calculate engagement stats based on 3-month totals
        if virality_level >= 4:
            base_views = random.randint(50000000, 500000000)  # 50M-500M for viral
        elif virality_level == 3:
            base_views = random.randint(5000000, 50000000)    # 5M-50M for moderate
        else:
            base_views = random.randint(500000, 5000000)      # 500K-5M for niche
        
        trend = {
            "name": trend_names.get(trend_type, f"{self.song_title} Trend"),
            "summary": trend_summaries.get(trend_type, f"Viral trend using {self.song_title}"),
            "description": self._generate_detailed_description(trend_type),
            "virality_level": virality_level,
            "momentum_status": self._generate_momentum_status(virality_level, trend_start_offset + days_active, 90),
            "detected_videos": detected_videos,
            "top_examples": self._generate_video_examples(3),
            "engagement_stats": {
                "avg_views": round(base_views / detected_videos, 2),
                "median_views": round(base_views / detected_videos * 0.7, 2),
                "avg_likes": round(base_views / detected_videos * 0.12, 2),
                "avg_comments": round(base_views / detected_videos * 0.008, 2),
                "avg_shares": round(base_views / detected_videos * 0.025, 2),
                "avg_engagement_rate": round(random.uniform(0.08, 0.15), 4),
                "total_views": base_views,
                "total_engagements": round(base_views * 0.153, 0)
            },
            "demographics": self._generate_demographics(trend_type),
            "creator_archetypes": self._generate_creator_archetypes(trend_type),
            "regional_distribution": self._generate_regional_distribution(),
            "type_of_content": template["content_types"],
            "content_type_confidence": round(random.uniform(0.85, 0.98), 3),
            "creative_analysis": self._generate_creative_analysis(trend_type),
            "creative_brief": self._generate_creative_brief(trend_type),
            "active_date_range": {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": (start_date + timedelta(days=days_active)).strftime("%Y-%m-%d"),
                "days_active": days_active,
                "current_phase": self._get_trend_phase(trend_start_offset + days_active, 90)
            },
            "count_by_date": time_series,
            "weekly_summary": self._generate_weekly_summary(time_series),
            "trending_hashtags": self._generate_hashtags(trend_type),
            "audio_features": {
                "bpm": random.randint(100, 180),
                "key_moments": ["0:15", "0:32", "0:45", "1:02"],
                "mood": self.mood_keywords[0] if self.mood_keywords else random.choice(["energetic", "emotional", "upbeat", "chill", "dramatic"])
            }
        }
        
        # Add real creative example if provided
        if self.real_creative_example and trend_index == 0:
            trend["real_creative_example"] = self.real_creative_example
        
        return trend
    
    def _generate_detailed_description(self, trend_type: str) -> str:
        """Generate detailed trend description"""
        descriptions = {
            "dance": f"This trend features creators performing synchronized choreography to {self.song_title}. The dance includes signature moves that match the song's rhythm and energy. Groups and solo performers alike showcase their interpretation, often adding personal flair while maintaining core choreographic elements.",
            "transformation": f"Creators use {self.song_title} to showcase dramatic transformations, typically synced to beat drops or emotional peaks in the music. Common themes include outfit changes, makeup transformations, room reveals, and before/after scenarios that surprise and delight viewers.",
            "storytelling": f"This narrative-driven trend uses {self.song_title} as a backdrop for relatable POV scenarios. Creators act out situations ranging from everyday experiences to fantastical scenarios, using facial expressions and gestures to bring stories to life.",
            "lifestyle": f"Content creators capture aesthetic moments and vibes that complement {self.song_title}'s mood. This includes morning routines, study sessions, travel montages, and slice-of-life content that resonates with the song's emotional tone.",
            "challenge": f"A viral challenge format where creators interpret {self.song_title} through specific tasks or creative constraints. Participants put their own spin on the challenge while maintaining recognizable elements that tie back to the original concept."
        }
        return descriptions.get(trend_type, f"A creative trend utilizing {self.song_title} by {self.artist}.")
    
    def _generate_creative_analysis(self, trend_type: str) -> str:
        """Generate creative analysis text"""
        analyses = {
            "dance": "Success factors include clean synchronization, creative formations, and engaging facial expressions. Videos filmed in interesting locations with good lighting consistently outperform. The hook is the opening move sequence that immediately captures attention.",
            "transformation": "The key to virality is the surprise element and smooth transitions. High contrast between before/after states drives engagement. Timing transitions to musical cues and maintaining viewer anticipation through pacing are crucial.",
            "storytelling": "Relatability and comedic timing are paramount. The most successful videos feature universally understood scenarios with unexpected twists. Exaggerated expressions and well-timed gestures enhance narrative impact.",
            "lifestyle": "Aesthetic consistency and mood matching drive performance. Natural lighting, cohesive color grading, and authentic moments resonate most. The song should complement rather than dominate the visual narrative.",
            "challenge": "Clear rules, achievable difficulty, and room for creativity are essential. Successful videos balance following the format while adding unique personal touches. Encouraging viewer participation through easy entry points boosts virality."
        }
        return analyses.get(trend_type, "Creative execution and timing are key to this trend's success.")
    
    def _generate_creative_brief(self, trend_type: str) -> str:
        """Generate creative brief for content creators"""
        briefs = {
            "dance": f"Learn the core choreography for {self.song_title}, focusing on the signature moves at key moments. Film in good lighting with a clean background. Add your own style while maintaining recognizable elements. Consider collaborating with others for group performances.",
            "transformation": f"Plan your transformation to align with {self.song_title}'s dramatic moments. Keep the 'before' brief (2-3 seconds) to maintain attention. Use smooth transitions (spin, hand swipe, jump cut) and ensure dramatic contrast. Add text overlays for context.",
            "storytelling": f"Choose a relatable scenario that fits {self.song_title}'s vibe. Start normal and escalate gradually. Use close-up shots for facial expressions. Add text to set up the scenario. Make it universally relatable while adding your unique perspective.",
            "lifestyle": f"Capture authentic moments that match {self.song_title}'s mood. Focus on visual aesthetics - lighting, composition, color grading. Keep clips short and dynamic. Show rather than tell your story through visuals.",
            "challenge": f"Understand the challenge rules for {self.song_title}. Practice before filming for smooth execution. Add your creative twist while keeping core elements. Engage with viewers through captions and encourage participation."
        }
        return briefs.get(trend_type, f"Create engaging content that captures the essence of {self.song_title}.")
    
    def _generate_video_examples(self, count: int) -> List[Dict]:
        """Generate example video data"""
        examples = []
        for i in range(count):
            examples.append({
                "id": self._generate_id(),
                "author_uid": self._generate_id(),
                "music_id": self.music_id,
                "desc": self._generate_video_description(),
                "share_url": f"https://www.tiktok.com/@creator{i}/video/{self._generate_id()}",
                "create_time": int((datetime.now() - timedelta(days=random.randint(1, 30))).timestamp()),
                "region": random.choice(["US", "UK", "CA"]),
                "thumbnail": f"https://tiktokthumbnails.s3.us-east-2.amazonaws.com/thumb_{self._generate_id()}.png",
                "statistics": {
                    "play_count": random.randint(100000, 10000000),
                    "share_count": random.randint(1000, 100000),
                    "comment_count": random.randint(100, 50000),
                    "like_count": random.randint(10000, 2000000)
                }
            })
        return sorted(examples, key=lambda x: x["statistics"]["play_count"], reverse=True)
    
    def _generate_video_description(self) -> str:
        """Generate realistic video description"""
        templates = [
            f"Wait for it... 😱 #{self.song_title.replace(' ', '')} #viral #fyp",
            f"POV: {random.choice(['you finally get it', 'its 3am and', 'your friend says'])} ✨ #relatable",
            f"{self.song_title} hits different 🔥 #trend #foryou",
            f"Nobody: ... Me: *does this* 💀 #{self.artist.replace(' ', '')}",
            f"Which one are you? 👀 #challenge #viral"
        ]
        return random.choice(templates)
    
    def _generate_hashtags(self, trend_type: str) -> List[str]:
        """Generate trending hashtags"""
        base_tags = [
            f"#{self.song_title.replace(' ', '')}",
            f"#{self.artist.replace(' ', '')}",
            "#fyp",
            "#foryoupage",
            "#viral"
        ]
        
        type_tags = {
            "dance": ["#dance", "#choreography", "#dancechallenge"],
            "transformation": ["#transformation", "#transition", "#beforeandafter"],
            "storytelling": ["#pov", "#storytime", "#relatable"],
            "lifestyle": ["#aesthetic", "#vibes", "#lifestyle"],
            "challenge": ["#challenge", "#trend", "#attempt"]
        }
        
        return base_tags + type_tags.get(trend_type, [])
    
    def generate_complete_dataset(self) -> Dict:
        """Generate the complete mock dataset"""
        trends = []
        for i in range(self.config["num_trends"]):
            trends.append(self._generate_trend(i))
        
        # Calculate aggregate metrics
        total_videos = sum(t["detected_videos"] for t in trends)
        total_views = sum(t["engagement_stats"]["total_views"] for t in trends)
        
        return {
            "song_metadata": {
                "title": self.song_title,
                "artist": self.artist,
                "music_id": self.music_id,
                "duration_ms": random.randint(150000, 240000),
                "release_date": (datetime.now() - timedelta(days=random.randint(30, 365))).strftime("%Y-%m-%d"),
                "genre": self.input_genre or random.choice(["Pop", "Hip-Hop", "Electronic", "Indie", "R&B"])
            },
            "spotify_data": self._generate_spotify_data(),
            "trends": trends,
            "aggregate_metrics": {
                "total_trends": len(trends),
                "total_videos": total_videos,
                "total_views": total_views,
                "avg_virality": round(sum(t["virality_level"] for t in trends) / len(trends), 1),
                "platform_reach": {
                    "tiktok": total_views,
                    "instagram_reels": round(total_views * 0.4),
                    "youtube_shorts": round(total_views * 0.25),
                    "estimated_total": round(total_views * 1.65)
                },
                "timeline_summary": {
                    "analysis_period": "3 months",
                    "start_date": self.config["start_date"].strftime("%Y-%m-%d"),
                    "end_date": self.config["end_date"].strftime("%Y-%m-%d"),
                    "peak_trend": max(trends, key=lambda t: t["engagement_stats"]["total_views"])["name"],
                    "trend_phases": [{"name": t["name"], "phase": t["active_date_range"]["current_phase"]} for t in trends]
                }
            },
            "generated_at": datetime.now().isoformat(),
            "data_version": "2.0"
        }

# Example usage
def main():
    # Parse input file
    input_file = "input.txt"
    parsed_data = parse_input_file(input_file)
    
    # Extract song and artist info
    song_title = parsed_data['song_title']
    artist = parsed_data['artist']
    
    print(f"📖 Read input file: {input_file}")
    print(f"🎵 Song: '{song_title}' by {artist}")
    if parsed_data['genre']:
        print(f"🎼 Genre: {parsed_data['genre']}")
    if parsed_data['demographics']:
        print(f"👥 Found demographic data in input file")
    if parsed_data['mood_keywords']:
        print(f"🎭 Mood keywords: {', '.join(parsed_data['mood_keywords'])}")
    
    # Optional: Add a real creative example
    real_creative = {
        "description": "Original dance created by @originalcreator",
        "video_url": "https://www.tiktok.com/@originalcreator/video/123456",
        "engagement": {
            "views": 5000000,
            "likes": 750000,
            "shares": 100000
        }
    }
    
    # Generate the data
    generator = TikTokTrendMockDataGenerator(
        song_title=song_title,
        artist=artist,
        real_creative_example=real_creative,  # Optional
        parsed_data=parsed_data  # Pass the parsed data
    )
    
    mock_data = generator.generate_complete_dataset()
    
    # Save to file
    output_filename = f"tiktok_trends_{song_title.replace(' ', '_').lower()}.json"
    with open(output_filename, "w") as f:
        json.dump(mock_data, f, indent=2)
    
    print(f"\n✅ Generated mock data for '{song_title}' by {artist}")
    print(f"📊 Created {len(mock_data['trends'])} trends with {mock_data['aggregate_metrics']['total_videos']} total videos")
    print(f"📈 Total views: {mock_data['aggregate_metrics']['total_views']:,}")
    print(f"💾 Saved to: {output_filename}")

if __name__ == "__main__":
    main()