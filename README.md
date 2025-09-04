# TikTok Trend Analytics Dashboard

A modern, data-driven dashboard for analyzing TikTok trends and creative performance. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Trend Analysis**: Real-time visualization of trending TikTok sounds and creatives
- **Interactive Graphs**: Dynamic line charts showing video/view counts over time with Spotify streams correlation
- **Creative Insights**: Detailed analytics for each trend including:
  - Demographics breakdown (age, gender, regions, creator types)
  - Engagement metrics (views, comments, shares)
  - Creative briefs and content strategies
  - Top performing videos
- **Mock Data Generation**: Python script to generate realistic trend data for demonstration
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.x (for mock data generation)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd import-my-git-buddy-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Generate mock data:
```bash
python3 mock_data.py
```

This will create a `trend_analysis_output.json` file with sample data.

## 🚀 Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:8082`

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CreativeCardsGrid.tsx    # Grid of trend cards
│   │   ├── CreativeDetailsCard.tsx  # Detailed view for selected trend
│   │   ├── SimpleTrendGraph.tsx     # Main trend visualization graph
│   │   ├── FuturisticCreativeCard.tsx # Individual trend card
│   │   └── ui/                      # Reusable UI components
│   ├── pages/
│   │   └── Index.tsx               # Main page
│   ├── utils/
│   │   └── dataTransformer.ts      # Transforms mock data to app format
│   └── App.tsx                     # Root component
├── mock_data.py                    # Python script for generating sample data
├── trend_analysis_output.json      # Generated mock data
└── package.json
```

## 🎯 Key Features Explained

### Trend Cards
- Display key metrics: detected videos, total views, dates active
- Show momentum status (Viral, Trending, Growing, Dying)
- "Recommended" tag for best performing trends
- Click to view detailed insights

### Trend Graph
- Toggle between Videos and Views mode
- Shows daily counts for up to 30 days
- Includes Spotify streams correlation
- Dynamic Y-axis scaling
- Interactive tooltips

### Creative Insights
Four main tabs:
1. **Demographics**: Creator demographics who use the sound
2. **Engagement**: Performance metrics with dynamic bar charts
3. **Examples**: Top performing videos (limited to 2 for clarity)
4. **Creative Analysis**: Content strategy and creative brief

### Mock Data
The `mock_data.py` script generates:
- Realistic trend names and descriptions
- Time series data for video/view counts
- Demographics distributions
- Engagement statistics
- Creative briefs and strategies

## 🎨 Customization

### Generating New Data
Edit `mock_data.py` to customize:
- Number of trends
- Date ranges
- Virality levels
- Demographics distributions

### Styling
- Uses Tailwind CSS for styling
- SF Pro font family throughout
- Blue (#3B82F6) as primary theme color
- Responsive design with mobile support

## 🔧 Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Data Generation**: Python 3

## 📝 Notes

- The dashboard uses mock data for demonstration purposes
- All trend data is generated randomly but follows realistic patterns
- The "Magnetic Pull Me Jalo Dance" trend uses real context from input files
- Data represents analysis of the last 2000 posts for each sound

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

[Your License Here]