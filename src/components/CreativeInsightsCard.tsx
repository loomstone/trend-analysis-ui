import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/glass/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  TrendingUp, 
  TrendingDown, 
  Flame,
  Zap,
  Globe,
  Target,
  Music,
  ChevronDown,
  Check,
  ChevronsUpDown
} from "lucide-react";

interface CreativeInsightsCardProps {
  selectedTrendId: string;
}

const CreativeInsightsCard = ({ selectedTrendId }: CreativeInsightsCardProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("usa");
  const [regionOpen, setRegionOpen] = useState<boolean>(false);
  const [selectedTrend, setSelectedTrend] = useState<string>("Lip Sync");

  // Region-specific data
  const regionData = {
    usa: {
      status: "exploding",
      growthRate: "+342%",
      peakTime: "2 days ago",
      estimatedDuration: "3-5 weeks",
      creativeAnalysis: "This lip sync trend is gaining massive traction in the USA, particularly with the catchy hook and easy-to-follow dance moves. The song's bilingual lyrics are resonating across cultures, making it highly shareable. Peak engagement occurs during evening hours (7-10 PM local time).",
      demographics: {
        gender: { male: 42, female: 58 },
        ageGroups: [
          { range: "13-17", percentage: 35 },
          { range: "18-24", percentage: 45 },
          { range: "25-34", percentage: 20 },
        ],
        archetypes: ["Music Lovers", "Dance Enthusiasts", "Content Creators"],
      },
    },
    mexico: {
      status: "exploding",
      growthRate: "+385%",
      peakTime: "3 days ago",
      estimatedDuration: "3-4 weeks",
      creativeAnalysis: "Mexican creators are embracing the cultural elements, adding traditional dance moves and local slang. The trend is spreading through schools and universities. Family-friendly versions are gaining traction on weekends.",
      demographics: {
        gender: { male: 45, female: 55 },
        ageGroups: [
          { range: "13-17", percentage: 42 },
          { range: "18-24", percentage: 38 },
          { range: "25-34", percentage: 20 },
        ],
        archetypes: ["Students", "Family Content", "Music Enthusiasts"],
      },
    },
    brazil: {
      status: "rising",
      growthRate: "+298%",
      peakTime: "2 days ago",
      estimatedDuration: "2-3 weeks",
      creativeAnalysis: "Brazil's vibrant creator community is putting their own spin with samba and funk influences. Beach and carnival-themed versions are particularly popular. The trend is spreading rapidly through major cities.",
      demographics: {
        gender: { male: 48, female: 52 },
        ageGroups: [
          { range: "13-17", percentage: 30 },
          { range: "18-24", percentage: 48 },
          { range: "25-34", percentage: 22 },
        ],
        archetypes: ["Beach Lifestyle", "Latin Music Fans", "Party Content"],
      },
    },
    uk: {
      status: "rising",
      growthRate: "+215%",
      peakTime: "1 day ago",
      estimatedDuration: "2-4 weeks",
      creativeAnalysis: "UK creators are adding their unique humor and style to the trend. University students and young professionals are driving adoption. The trend performs well during commute hours and lunch breaks.",
      demographics: {
        gender: { male: 40, female: 60 },
        ageGroups: [
          { range: "13-17", percentage: 25 },
          { range: "18-24", percentage: 50 },
          { range: "25-34", percentage: 25 },
        ],
        archetypes: ["Comedy Creators", "Fashion Enthusiasts", "Students"],
      },
    },
  };

  const countries = [
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "canada", label: "Canada" },
    { value: "mexico", label: "Mexico" },
    { value: "brazil", label: "Brazil" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "spain", label: "Spain" },
    { value: "italy", label: "Italy" },
    { value: "japan", label: "Japan" },
    { value: "south-korea", label: "South Korea" },
    { value: "india", label: "India" },
    { value: "australia", label: "Australia" },
    { value: "argentina", label: "Argentina" },
    { value: "colombia", label: "Colombia" },
  ];

  const currentData = regionData[selectedRegion as keyof typeof regionData] || regionData.usa;

  // Available trends
  const trends = [
    { id: "lip-sync", name: "Lip Sync", status: "exploding" },
    { id: "dance-challenge", name: "Dance Challenge", status: "rising" },
    { id: "comedy-skit", name: "Comedy Skit", status: "exploding" },
    { id: "transition", name: "Transition", status: "declining" },
    { id: "duet", name: "Duet", status: "rising" },
  ];

  const currentTrend = trends.find(t => t.name === selectedTrend) || trends[0];

  const getStatusIcon = () => {
    switch (currentTrend.status) {
      case "exploding":
        return (
          <div className="relative">
            <Flame className="w-5 h-5 text-orange-500" />
            <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-md animate-pulse" />
          </div>
        );
      case "rising":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Zap className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (currentTrend.status) {
      case "exploding":
        return "text-orange-600";
      case "rising":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full flex flex-col min-h-0">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between mb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-normal hover:bg-transparent group"
                >
                  <CardTitle className="text-lg flex items-center gap-2 group-hover:text-purple-600 transition-colors cursor-pointer">
                    {selectedTrend}
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </CardTitle>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {trends.map((trend) => (
                  <DropdownMenuItem
                    key={trend.id}
                    onClick={() => setSelectedTrend(trend.name)}
                    className={`cursor-pointer ${
                      selectedTrend === trend.name ? "bg-purple-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={selectedTrend === trend.name ? "font-semibold" : ""}>
                        {trend.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {trend.status === "exploding" && <Flame className="w-4 h-4 text-orange-500" />}
                        {trend.status === "rising" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {trend.status === "declining" && <TrendingDown className="w-4 h-4 text-red-500" />}
                        <span className={`text-xs ${
                          trend.status === "exploding" ? "text-orange-600" :
                          trend.status === "rising" ? "text-green-600" :
                          "text-red-600"
                        }`}>
                          {trend.status}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`text-sm font-semibold ${getStatusColor()}`}>
                {currentTrend.status.charAt(0).toUpperCase() + currentTrend.status.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Region Selector - Using Combobox */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-500">Country:</Label>
            <Popover open={regionOpen} onOpenChange={setRegionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={regionOpen}
                  className="h-7 w-[150px] justify-between text-xs px-2 bg-gray-50 border-gray-200 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-gray-500" />
                    {selectedRegion
                      ? countries.find((country) => country.value === selectedRegion)?.label
                      : "Select country..."}
                  </div>
                  <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.value}
                          onSelect={(currentValue) => {
                            setSelectedRegion(currentValue === selectedRegion ? "" : currentValue);
                            setRegionOpen(false);
                          }}
                        >
                          {country.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedRegion === country.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 pb-3 overflow-hidden">
          <div className="flex-1 space-y-3">
            {/* Creative Analysis */}
            <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-500" />
              Creative Analysis
            </h4>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200/50">
              <p className="text-sm leading-relaxed">
                {currentData.creativeAnalysis}
              </p>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Demographics
            </h4>
            <div className="bg-pink-50 rounded-xl p-3 space-y-2 border border-pink-200/50">
              {/* Gender Split */}
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Gender Split</span>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">Male: {currentData.demographics.gender.male}%</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">Female: {currentData.demographics.gender.female}%</span>
                </div>
              </div>

              {/* Age Groups */}
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Top Age Groups</span>
                <div className="flex flex-wrap gap-2">
                  {currentData.demographics.ageGroups.map((group, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 rounded-lg text-xs font-medium border border-blue-200"
                    >
                      {group.range}: {group.percentage}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Archetypes */}
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Audience Archetypes</span>
                <div className="flex flex-wrap gap-2">
                  {currentData.demographics.archetypes.map((archetype, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-xs font-medium border border-purple-300"
                    >
                      {archetype}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </CardContent>

        
      </Card>
    </motion.div>
  );
};

export default CreativeInsightsCard;