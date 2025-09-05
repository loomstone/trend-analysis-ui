import json
import random
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
import numpy as np

def parse_input_file(filename: str) -> Dict[str, Any]:
    """Parse input file to extract artist, song, and context information"""
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
        gender_section = re.search(r'Gender(?:\s+Demographics)?:(.*?)(?:Region|Location|Additional|$)', content, re.IGNORECASE | re.DOTALL)
        if gender_section:
            gender_text = gender_section.group(1)
            demographics['gender'] = {}
            gender_patterns = [
                (r'^Female[:\s]+(\d+)%?', 'female'),
                (r'^Male[:\s]+(\d+)%?', 'male'),
                (r'^Other[:\s]+(\d+)%?', 'other')
            ]
            for pattern, gender in gender_patterns:
                # Search in multiline mode to match at line start
                match = re.search(pattern, gender_text, re.IGNORECASE | re.MULTILINE)
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
                            'aggressive', 'romantic', 'nostalgic', 'dark', 'happy', 'sad', 'powerful', 'vulnerable']
            mood_keywords = [mood for mood in possible_moods if mood in mood_text]
        
        # Extract trend types mentioned in context
        trend_types = []
        context_lower = context.lower()
        if any(word in context_lower for word in ['dance', 'choreography', 'moves']):
            trend_types.append('dance')
        if any(word in context_lower for word in ['transformation', 'transition', 'reveal', 'before/after']):
            trend_types.append('transformation')
        if any(word in context_lower for word in ['pov', 'story', 'scenario', 'relatable']):
            trend_types.append('storytelling')
        if any(word in context_lower for word in ['aesthetic', 'vibe', 'mood', 'lifestyle']):
            trend_types.append('lifestyle')
        if any(word in context_lower for word in ['challenge', 'trend']):
            trend_types.append('challenge')
        
        return {
            'artist': artist,
            'song_title': song_title,
            'demographics': demographics,
            'genre': genre,
            'context': context,
            'mood_keywords': mood_keywords,
            'trend_types': trend_types
        }
        
    except FileNotFoundError:
        print(f"Warning: {filename} not found. Using default values.")
        return None
    except Exception as e:
        print(f"Error parsing {filename}: {e}. Using default values.")
        return None

def merge_parsed_data(data1: Optional[Dict], data2: Optional[Dict]) -> Dict[str, Any]:
    """Merge data from two input files, averaging demographics and combining other fields"""
    # If one is missing, return the other
    if not data1:
        return data2 or {
            'artist': 'Unknown Artist',
            'song_title': 'Unknown Song',
            'demographics': {},
            'genre': None,
            'context': '',
            'mood_keywords': [],
            'trend_types': []
        }
    if not data2:
        return data1
    
    # Start with basic info from first file
    merged = {
        'artist': data1['artist'],
        'song_title': data1['song_title'],
        'genre': data1['genre'] or data2['genre'],
            'context': '',
        'mood_keywords': [],
        'trend_types': [],
        'demographics': {}
    }
    
    # Combine contexts
    contexts = []
    if data1['context']:
        contexts.append(f"[Research 1]: {data1['context']}")
    if data2['context']:
        contexts.append(f"[Research 2]: {data2['context']}")
    merged['context'] = '\n\n'.join(contexts)
    
    # Combine mood keywords (unique)
    merged['mood_keywords'] = list(set(data1['mood_keywords'] + data2['mood_keywords']))
    
    # Combine trend types (unique)
    merged['trend_types'] = list(set(data1.get('trend_types', []) + data2.get('trend_types', [])))
    
    # Merge demographics by averaging
    # Age demographics
    if data1['demographics'].get('age') and data2['demographics'].get('age'):
        merged_age = {}
        all_age_ranges = set(list(data1['demographics']['age'].keys()) + list(data2['demographics']['age'].keys()))
        for age_range in all_age_ranges:
            val1 = data1['demographics']['age'].get(age_range, 0)
            val2 = data2['demographics']['age'].get(age_range, 0)
            # Average the two values
            merged_age[age_range] = (val1 + val2) / 2
        
        # Normalize to ensure sum is 1
        total = sum(merged_age.values())
        if total > 0:
            merged['demographics']['age'] = {k: v/total for k, v in merged_age.items()}
    elif data1['demographics'].get('age'):
        merged['demographics']['age'] = data1['demographics']['age']
    elif data2['demographics'].get('age'):
        merged['demographics']['age'] = data2['demographics']['age']
    
    # Gender demographics
    if data1['demographics'].get('gender') and data2['demographics'].get('gender'):
        merged_gender = {}
        all_genders = set(list(data1['demographics']['gender'].keys()) + list(data2['demographics']['gender'].keys()))
        
        # Count how many files have each gender
        for gender in all_genders:
            val1 = data1['demographics']['gender'].get(gender, 0)
            val2 = data2['demographics']['gender'].get(gender, 0)
            count = (1 if val1 > 0 else 0) + (1 if val2 > 0 else 0)
            # Average only the values that exist
            if count > 0:
                merged_gender[gender] = (val1 + val2) / count
        
        # Normalize to ensure sum is 1
        total = sum(merged_gender.values())
        if total > 0:
            merged['demographics']['gender'] = {k: round(v/total, 3) for k, v in merged_gender.items()}
    elif data1['demographics'].get('gender'):
        merged['demographics']['gender'] = data1['demographics']['gender']
    elif data2['demographics'].get('gender'):
        merged['demographics']['gender'] = data2['demographics']['gender']
    
    return merged

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
        self.suggested_trend_types = self.parsed_data.get('trend_types', [])
        
        # Configuration for trend generation
        self.config = {
            "num_trends": 3,
            "date_range_days": 30,  # 30-day analysis period
            "start_date": datetime.now() - timedelta(days=30),  # Start 30 days ago
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
        """Generate realistic time series data for trend growth over 30 days"""
        dates = []
        
        # Define trend phases for a 30-day period
        discovery_phase = int(days * 0.15)  # ~4-5 days
        growth_phase = int(days * 0.25)     # ~7-8 days
        peak_phase = int(days * 0.20)       # ~6 days
        decline_phase = int(days * 0.40)    # ~12 days
        
        # Adjust phases based on virality level - scaled for 2000 total videos
        if virality_level >= 4:  # Viral trend - faster growth, shorter peak
            discovery_phase = int(days * 0.10)  # ~3 days
            growth_phase = int(days * 0.20)     # ~6 days
            peak_phase = int(days * 0.25)       # ~7-8 days
            decline_phase = int(days * 0.45)    # ~13-14 days
            
            # Base values for viral trends (scaled down for 2000 video analysis)
            discovery_base = random.randint(5, 15)  # Start with 5-15 videos per day
            peak_multiplier = random.uniform(8, 12)  # Peak at 40-180 videos per day
            
        elif virality_level == 3:  # Moderate trend
            discovery_base = random.randint(3, 10)  # Start with 3-10 videos per day
            peak_multiplier = random.uniform(5, 8)   # Peak at 15-80 videos per day
            
        else:  # Slow burn trend - longer discovery, sustained plateau
            discovery_phase = int(days * 0.25)  # ~7-8 days
            growth_phase = int(days * 0.30)     # ~9 days
            peak_phase = int(days * 0.30)       # ~9 days
            decline_phase = int(days * 0.15)    # ~4-5 days
            
            discovery_base = random.randint(2, 5)   # Start with 2-5 videos per day
            peak_multiplier = random.uniform(3, 5)  # Peak at 6-25 videos per day
        
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
            
            # Weekly patterns - weekends see 10-20% more activity (reduced variance)
            day_of_week = current_date.weekday()
            if day_of_week == 4:  # Friday
                day_multiplier = random.uniform(1.05, 1.10)
            elif day_of_week >= 5:  # Weekend
                day_multiplier = random.uniform(1.10, 1.20)
            else:  # Weekday
                day_multiplier = random.uniform(0.95, 1.05)
            
            # Add minimal daily variance for smoother curves
            daily_noise = random.uniform(0.95, 1.05)
            
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
        """Calculate momentum status based on trend phase in 30-day timeline"""
        # Calculate what phase we're in based on days since trend started
        phase_percentage = days_since_start / total_days
        
        # Match UI expectations: "Recommended", "Rising", "Dying", "New"
        if phase_percentage < 0.10:  # First ~3 days
            return "New"
        elif phase_percentage < 0.40 and virality_level >= 4:  # Days 4-12 for viral
            return "Rising"
        elif phase_percentage < 0.50 and virality_level >= 3:  # Days 4-15 for moderate
            return "Recommended"
        elif phase_percentage < 0.60:  # Peak period
            return "Recommended"
        elif phase_percentage < 0.80:  # Declining phase
            return "Dying"
        else:  # Final phase
            return "Dying"
    
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
    
    def _generate_creator_archetypes(self, trend_type: str, trend_index: int = 0) -> Dict:
        """Generate creator archetype distribution"""
        # Different archetypes based on specific trend
        if self.input_context and "magnetic pull" in self.input_context.lower() and trend_index == 0:
            # Couples Dance - Relationship creators dominate
            return {
                "Relationship": round(random.uniform(0.40, 0.45), 3),
                "Dancer": round(random.uniform(0.25, 0.30), 3),
                "Lifestyle": round(random.uniform(0.15, 0.20), 3),
                "Beauty": round(random.uniform(0.08, 0.12), 3)
            }
        elif self.input_context and "magnetic pull" in self.input_context.lower() and trend_index == 1:
            # Car Trend - Lifestyle creators dominate
            return {
                "Lifestyle": round(random.uniform(0.38, 0.43), 3),
                "Relationship": round(random.uniform(0.25, 0.30), 3),
                "Dancer": round(random.uniform(0.15, 0.20), 3),
                "Beauty": round(random.uniform(0.10, 0.15), 3)
            }
        elif trend_index == 2:
            # Glow Up - Beauty creators dominate
            return {
                "Beauty": round(random.uniform(0.45, 0.50), 3),
                "Lifestyle": round(random.uniform(0.25, 0.30), 3),
                "Dancer": round(random.uniform(0.12, 0.17), 3),
                "Relationship": round(random.uniform(0.08, 0.12), 3)
            }
        else:
            # Default distribution with new archetypes
            return {
                "Lifestyle": round(random.uniform(0.30, 0.35), 3),
                "Beauty": round(random.uniform(0.25, 0.30), 3),
                "Dancer": round(random.uniform(0.20, 0.25), 3),
                "Relationship": round(random.uniform(0.15, 0.20), 3)
            }
    
    def _generate_regional_distribution(self, num_regions: int = 5) -> List[Dict]:
        """Generate regional distribution with percentages based on song genre and context"""
        # For Regional Mexican songs, prioritize Latin American countries
        if self.input_genre and "mexican" in self.input_genre.lower():
            # Prioritize Mexico, US (large Mexican diaspora), and other Latin American countries
            priority_regions = ["MX", "US", "BR", "CA", "FR"]
            # Set realistic percentages for Regional Mexican content
            base_percentages = {
                "MX": random.uniform(0.35, 0.45),  # Mexico should dominate
                "US": random.uniform(0.25, 0.35),  # Large Mexican-American population
                "BR": random.uniform(0.08, 0.12),  # Brazil
                "CA": random.uniform(0.03, 0.05),  # Canada
                "FR": random.uniform(0.02, 0.04),  # France
            }
        else:
            # Default distribution for other genres
            regions = random.sample(self.config["regions"], min(num_regions, len(self.config["regions"])))
            priority_regions = regions
            base_percentages = {}
        
        distributions = []
        total_percentage = 0
        
        for region in priority_regions[:num_regions]:
            if region in base_percentages:
                percentage = base_percentages[region]
            else:
                # Random for non-prioritized regions
                percentage = random.uniform(0.05, 0.15)
            
            total_percentage += percentage
            
            # Higher engagement rates for primary markets
            if region in ["MX", "US"] and self.input_genre and "mexican" in self.input_genre.lower():
                engagement_rate = round(random.uniform(0.12, 0.18), 3)
                video_count = random.randint(100, 500)
            else:
                engagement_rate = round(random.uniform(0.08, 0.12), 3)
                video_count = random.randint(20, 100)
            
            distributions.append({
                "code": region,
                "country": self._get_country_name(region),
                "percentage": percentage,
                "video_count": video_count,
                "avg_engagement_rate": engagement_rate
            })
        
        # Normalize percentages to sum to 1
        if total_percentage > 0:
            for dist in distributions:
                dist["percentage"] = round(dist["percentage"] / total_percentage, 3)
        
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
        # Force first trend to be dance (Me Jalo "Pull" Couples Dance)
        if trend_index == 0:
            trend_type = "dance"
            template = next((t for t in self.config["trend_templates"] if t["type"] == "dance"), 
                          self.config["trend_templates"][0])
        elif self.suggested_trend_types and trend_index < len(self.suggested_trend_types):
            # Use suggested trend type
            trend_type = self.suggested_trend_types[trend_index]
            # Find matching template
            template = next((t for t in self.config["trend_templates"] if t["type"] == trend_type), 
                          self.config["trend_templates"][0])
        else:
            # Select trend template normally
            template = self.config["trend_templates"][trend_index % len(self.config["trend_templates"])]
            trend_type = template["type"]
        
        # Generate trend names based on context
        if self.input_context and "magnetic pull" in self.input_context.lower():
            # Ensure specific order: Couples Dance first, Car Trend second, Glow Up third
            if trend_index == 0:
                trend_names = {"dance": f"Me Jalo 'Pull' Couples Dance"}
                trend_type = "dance"
                template = next((t for t in self.config["trend_templates"] if t["type"] == "dance"), 
                              self.config["trend_templates"][0])
            elif trend_index == 1:
                trend_names = {"storytelling": f"Me Jalo 'Pull' Car Trend"}
                trend_type = "storytelling"
                template = next((t for t in self.config["trend_templates"] if t["type"] == "storytelling"), 
                              self.config["trend_templates"][0])
            elif trend_index == 2:
                trend_names = {"transformation": f"Me Jalo Glow Up"}
                trend_type = "transformation"
                template = next((t for t in self.config["trend_templates"] if t["type"] == "transformation"), 
                              self.config["trend_templates"][0])
            else:
                trend_names = {
                    "dance": f"Me Jalo 'Pull' Couples Dance",
                    "transformation": f"Me Jalo Glow Up",
                    "storytelling": f"Me Jalo 'Pull' Car Trend",
                    "lifestyle": f"Me Jalo Golden Hour Aesthetic",
                    "challenge": f"Me Jalo Challenge"
                }
            trend_summaries = {
                "dance": f"Couples recreate the iconic 'magnetic pull' gesture.",
                "transformation": f"Dramatic outfit reveals synced to chorus drops.",
                "storytelling": f"Creators recreate the viral 'pull' dance but with their cars.",
                "lifestyle": f"Golden hour couple content showcasing romantic aesthetics.",
                "challenge": f"The viral magnetic pull dance move challenge."
            }
        else:
            trend_names = {
                "dance": f"Synchronized {self.song_title} Dance",
                "transformation": f"{self.song_title} Transformation Challenge",
                "storytelling": f"POV {self.song_title} Stories",
                "lifestyle": f"{self.song_title} Aesthetic Vibes",
                "challenge": f"{self.song_title} Challenge"
            }
            trend_summaries = {
                "dance": f"Dance moves synced to {self.song_title}.",
                "transformation": f"Quick outfit changes timed to beat drops.",
                "storytelling": f"POV scenarios with {self.song_title}.",
                "lifestyle": f"Aesthetic vibes matching the song mood.",
                "challenge": f"Viral challenge using {self.song_title}."
            }
        
        # Base metrics for 30-day period with 2000 total videos target
        virality_level = random.randint(2, 5)
        
        # Distribute 2000 videos across 3 trends proportionally based on virality
        # Make the first trend (based on real data) perform best
        if trend_index == 0:  # First trend - best performer (real data based)
            virality_level = 5  # Force viral for the real data trend
            detected_videos = random.randint(900, 1100)  # ~45-55% of total
        elif trend_index == 1:  # Second trend - moderate performer
            virality_level = 3
            detected_videos = random.randint(500, 700)   # ~25-35% of total
        else:  # Third trend - lowest performer
            virality_level = 2
            detected_videos = random.randint(200, 400)   # ~10-20% of total
        
        # Generate time series for full 30-day period
        # Trends can start at different times within the analysis window
        trend_start_offset = random.randint(0, 10)  # Can start up to 10 days into the period
        days_active = min(30 - trend_start_offset, random.randint(20, 30))  # Active for 20-30 days
        start_date = self.config["start_date"] + timedelta(days=trend_start_offset)
        time_series = self._generate_time_series(virality_level, start_date, days_active, trend_type)
        
        # Adjust time series to match detected_videos total
        actual_total = sum(day["value"] for day in time_series)
        if actual_total > 0:
            scale_factor = detected_videos / actual_total
            for day in time_series:
                day["value"] = max(1, int(day["value"] * scale_factor))
        
        # Calculate engagement stats proportional to video count
        # Special handling for specific trends based on real thumbnail data
        if self.input_context and "magnetic pull" in self.input_context.lower() and trend_index == 0:
            # Me Jalo 'Pull' Couples Dance - most viral with actual high views
            base_views = 850000000  # 850M total views - biggest trend
        elif self.input_context and "magnetic pull" in self.input_context.lower() and trend_index == 1:
            # Me Jalo 'Pull' Car Trend - moderate viral
            base_views = 425000000  # 425M total views - second biggest
        elif trend_index == 2:
            # Me Jalo Glow Up - smaller trend but still significant
            base_views = 212000000  # 212M total views - third biggest
        elif virality_level >= 4:
            avg_views_per_video = random.randint(30000, 50000)  # 30-50K per video for viral
            base_views = detected_videos * avg_views_per_video
        elif virality_level == 3:
            avg_views_per_video = random.randint(10000, 25000)  # 10-25K per video for moderate
            base_views = detected_videos * avg_views_per_video
        else:
            avg_views_per_video = random.randint(2000, 8000)    # 2-8K per video for niche
            base_views = detected_videos * avg_views_per_video
        
        trend = {
            "name": trend_names.get(trend_type, f"{self.song_title} Trend"),
            "summary": trend_summaries.get(trend_type, f"Viral trend using {self.song_title}"),
            "description": self._generate_detailed_description(trend_type),
            "virality_level": virality_level,
            "momentum_status": self._generate_momentum_status(virality_level, trend_start_offset + days_active, 30),
            "recommended": trend_index == 0,  # First trend (real data based) is recommended
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
            "creator_archetypes": self._generate_creator_archetypes(trend_type, trend_index),
            "regional_distribution": self._generate_regional_distribution(),
            "type_of_content": template["content_types"],
            "content_type_confidence": round(random.uniform(0.85, 0.98), 3),
            "creative_analysis": self._generate_creative_analysis(trend_type),
            "creative_brief": self._generate_creative_brief(trend_type),
            "active_date_range": {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": (start_date + timedelta(days=days_active)).strftime("%Y-%m-%d"),
                "days_active": days_active,
                "current_phase": self._get_trend_phase(trend_start_offset + days_active, 30)
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
    
    def _generate_creative_analysis(self, trend_type: str) -> Dict[str, str]:
        """Generate structured creative analysis text based on actual context from research"""
        # Use context from the research files
        if self.input_context:
            context_lower = self.input_context.lower()
            
            # Context-aware descriptions
            descriptions = {
                "dance": "This trend revolves around the iconic 'magnetic pull' gesture, where partners create a drawn-forward effect. It's a duo/couple format that dominates the trend, relying on synchronized movements and dramatic flair.",
                "storytelling": "The trend thrives on the forbidden romance narrative of 'el otro' (the other man). Creators use the song's lyrics to act out scenarios of dropping everything for a secret lover, making it highly relatable.",
                "transformation": "Creators leverage the song's dramatic build from the accordion intro to the chorus drop for high-impact reveals. The theme of romantic rebellion inspires 'becoming who you really are' transformations.",
                "challenge": "The #mejalo dance challenge is centered on the signature 'magnetic pull' move. Its accessibility and room for personal flair have driven widespread participation, especially among families.",
                "lifestyle": "This trend captures the song's romantic yearning through aesthetics. Golden hour filming, couple activities, and a blend of Mexican culture with modern visuals are key to its success."
            }
            
            # Context-aware strategies
            strategies = {
                "dance": "Peak performance comes from precise timing with the music: accordion intro (0:00-0:20) for setup, main chorus (0:45-1:15) for choreography, and the bridge (1:20-1:40) for spins/dips. Facial expressions conveying passion are crucial.",
                "storytelling": "The most successful videos use the 'Que yo me voy pa' allá' refrain (1:20-1:40) for the climax. The narrative arc should build with the song's intensity, using text overlays to clarify the secret relationship.",
                "transformation": "High contrast between 'before' and 'after' states is essential. The reveal must be perfectly synced to the chorus drop at 0:45. A second transformation can be added at the 2:15 chorus for a multi-stage reveal.",
                "challenge": "Success requires hitting key timestamps for the moves (0:20, 0:45, 1:20). While the base moves are simple, adding unique personal touches or including multiple generations of family members increases engagement.",
                "lifestyle": "The bicultural appeal is a major factor. Mixing English captions with the Spanish audio performs well. The content should feel authentic, using the main chorus (0:45-1:15) for the most visually appealing moments."
            }
            
            return {
                "description": descriptions.get(trend_type, "A creative trend using the song's key audio moments."),
                "content_strategy": strategies.get(trend_type, "Success depends on syncing actions to the music's emotional peaks.")
            }

        # Fallback to generic analyses if no context
        return {
            "description": "This trend revolves around comedic timing and relatable scenarios using trending audio. Creators act out everyday situations with exaggerated reactions that sync perfectly with the audio cues.",
            "content_strategy": "The trend thrives on relatability and perfect comedic timing. Top performing content uses the audio to highlight universal experiences that viewers instantly recognize."
        }
    
    def _generate_creative_brief(self, trend_type: str) -> Dict:
        """Generate creative brief for content creators in structured format based on research context"""
        
        # Default values
        quick_steps = []
        key_tips = []
        avoid = ["Poor audio sync", "Overcomplicating", "Bad lighting"]

        if self.input_context:
            context_lower = self.input_context.lower()
            
            if trend_type == "dance":
                quick_steps = [
                    "Set up phone at eye level with good lighting",
                    "Practice the 'magnetic pull' at the chorus drop (0:45)",
                    "Sync backward steps and shoulder shimmies with partner"
                ]
                key_tips = [
                    "Duo/couple format works best",
                    "Use dramatic spins and dips at the bridge (1:20)",
                    "Express passion through facial expressions"
                ]
                avoid = ["Stiff movements", "Looking at feet instead of partner", "Poor framing"]
            elif trend_type == "storytelling":
                 quick_steps = [
                    "Set up a 'forbidden romance' scenario",
                    "Act out dropping everything at 'me voy pa' allá' (1:20)",
                    "Use intense, emotional facial expressions"
                ]
                 key_tips = [
                    "Use text overlays to explain the secret relationship",
                    "Build the story's intensity with the music",
                    "Focus on relatability and the 'el otro' theme"
                ]
                 avoid = ["Vague storytelling", "Weak emotional acting", "Poor lip-syncing"]
            elif trend_type == "transformation":
                quick_steps = [
                    "Show 'before' state during accordion intro (0:00-0:20)",
                    "Time the reveal to the main chorus drop (0:45)",
                    "Ensure a high-contrast, impactful 'after' look"
                ]
                key_tips = [
                    "Use a smooth transition technique (e.g., spin, swipe)",
                    "Consider a second reveal at the 2:15 chorus",
                    "Embody a confident, rebellious attitude"
                ]
                avoid = ["Messy transitions", "Low-impact 'after' state", "Reveal doesn't match the beat"]
            # Fallback for other types
            else:
                quick_steps = [
                    "Set up phone at eye level with good lighting",
                    "Practice audio timing (0:04, 0:08, 0:12)",
                    "Build emotional intensity throughout"
                ]
                key_tips = [
                    "Natural lighting works best",
                    "Film in 1080p minimum",
                    "Post 8-10 PM for best reach"
                ]
        else:
            quick_steps = [
                "Set up phone at eye level with good lighting",
                "Practice audio timing (0:04, 0:08, 0:12)",
                "Build emotional intensity throughout"
            ]
            key_tips = [
                "Natural lighting works best",
                "Film in 1080p minimum",
                "Post 8-10 PM for best reach"
            ]

        return {
            "quick_steps": quick_steps,
            "key_tips": key_tips
        }
    
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
        """Generate trending hashtags based on research context"""
        # Extract hashtags from context if available
        if self.input_context:
            context_lower = self.input_context.lower()
            
            # Base tags from research
            base_tags = []
            
            # Check for specific hashtags mentioned in research
            if "#mejalo" in context_lower:
                base_tags.extend(["#mejalo", "#mejalotrend", "#mejalodance", "#mejalocouple"])
            else:
                base_tags.append(f"#{self.song_title.replace(' ', '').lower()}")
            
            # Add artist tags
            if "fuerzaregida" in context_lower:
                base_tags.append("#fuerzaregida")
            if "grupofrontera" in context_lower:
                base_tags.append("#grupofrontera")
            
            # Always include these
            base_tags.extend(["#parati", "#fyp", "#viral"])
            
            # Add genre-specific tags for Regional Mexican
            if self.input_genre and "mexican" in self.input_genre.lower():
                base_tags.extend(["#corridos", "#mexicanmusic", "#regionalmusic"])
            
            # Type-specific tags based on trend
            type_tags = {
                "dance": ["#dance", "#duo", "#couples"] if "couple" in context_lower else ["#dance", "#choreography"],
                "transformation": ["#transformation", "#glowup", "#beforeandafter"],
                "storytelling": ["#pov", "#elotro", "#romance"] if "el otro" in context_lower else ["#pov", "#storytime"],
                "lifestyle": ["#aesthetic", "#goldenhour", "#mexicanculture"] if "golden hour" in context_lower else ["#aesthetic", "#vibes"],
                "challenge": ["#challenge", f"#{self.song_title.replace(' ', '').lower()}challenge"]
            }
        else:
            # Fallback to generic tags
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
                    "analysis_period": "30 days",
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
    import sys
    import os
    
    # Check for command line arguments or use default files
    if len(sys.argv) > 2:
        perplexity_file = sys.argv[1]
        openai_file = sys.argv[2]
    else:
        # Default filenames
        perplexity_file = "perplexity_research.txt"
        openai_file = "openai_research.txt"
        
        # Fall back to input.txt if neither research file exists
        if not os.path.exists(perplexity_file) and not os.path.exists(openai_file):
            if os.path.exists("input.txt"):
                print("📝 Research files not found. Using input.txt as fallback.")
                perplexity_file = "input.txt"
                openai_file = "input.txt"
    
    # Parse both input files
    print(f"📖 Reading research files...")
    perplexity_data = parse_input_file(perplexity_file)
    openai_data = parse_input_file(openai_file)
    
    # Merge the data
    merged_data = merge_parsed_data(perplexity_data, openai_data)
    
    # Extract song and artist info
    song_title = merged_data['song_title']
    artist = merged_data['artist']
    
    print(f"🎵 Song: '{song_title}' by {artist}")
    if merged_data['genre']:
        print(f"🎼 Genre: {merged_data['genre']}")
    if merged_data['demographics']:
        print(f"👥 Found demographic data from research")
        if merged_data['demographics'].get('age'):
            print(f"   Age ranges: {', '.join(merged_data['demographics']['age'].keys())}")
        if merged_data['demographics'].get('gender'):
            print(f"   Gender split: {', '.join(f'{k}: {v:.1%}' for k, v in merged_data['demographics']['gender'].items())}")
    if merged_data['mood_keywords']:
        print(f"🎭 Mood keywords: {', '.join(merged_data['mood_keywords'])}")
    if merged_data['trend_types']:
        print(f"📱 Suggested trend types: {', '.join(merged_data['trend_types'])}")
    
    # Show which files were used
    if perplexity_data and openai_data and perplexity_file != openai_file:
        print(f"🔄 Merged data from: {perplexity_file} + {openai_file}")
    elif perplexity_data:
        print(f"📄 Using data from: {perplexity_file}")
    elif openai_data:
        print(f"📄 Using data from: {openai_file}")
    
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
        parsed_data=merged_data  # Pass the merged data
    )
    
    mock_data = generator.generate_complete_dataset()
    
    # Save to file with standard name
    output_filename = "trend_analysis_output.json"
    with open(output_filename, "w") as f:
        json.dump(mock_data, f, indent=2)
    
    print(f"\n✅ Generated mock data for '{song_title}' by {artist}")
    print(f"📊 Created {len(mock_data['trends'])} trends with {mock_data['aggregate_metrics']['total_videos']} total videos")
    print(f"📈 Total views: {mock_data['aggregate_metrics']['total_views']:,}")
    print(f"💾 Saved to: {output_filename}")

if __name__ == "__main__":
    main()