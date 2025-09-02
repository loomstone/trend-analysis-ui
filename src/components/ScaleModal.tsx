import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Rocket, DollarSign, Globe, Target, TrendingUp, 
  Settings, Info, ChevronDown, Plus, Minus, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  creativeName?: string;
}

interface RegionBudget {
  region: string;
  percentage: number;
  amount: number;
  selected: boolean;
}

const AVAILABLE_REGIONS = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
];

const ScaleModal: React.FC<ScaleModalProps> = ({ isOpen, onClose, creativeName }) => {
  const [totalBudget, setTotalBudget] = useState(50000);
  const [duration, setDuration] = useState("14");
  const [platform, setPlatform] = useState("all");
  const [targetReach, setTargetReach] = useState([50]);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [regionBudgets, setRegionBudgets] = useState<RegionBudget[]>([
    { region: "United States", percentage: 40, amount: 20000, selected: true },
    { region: "Mexico", percentage: 30, amount: 15000, selected: true },
    { region: "Brazil", percentage: 20, amount: 10000, selected: true },
    { region: "United Kingdom", percentage: 10, amount: 5000, selected: false },
  ]);

  // Update amounts when total budget changes
  useEffect(() => {
    const selectedRegions = regionBudgets.filter(r => r.selected);
    const totalPercentage = selectedRegions.reduce((sum, r) => sum + r.percentage, 0);
    
    setRegionBudgets(prev => prev.map(region => ({
      ...region,
      amount: region.selected 
        ? Math.round((region.percentage / totalPercentage) * totalBudget)
        : 0
    })));
  }, [totalBudget]);

  const handleRegionToggle = (index: number) => {
    setRegionBudgets(prev => {
      const updated = [...prev];
      updated[index].selected = !updated[index].selected;
      
      // Redistribute percentages among selected regions
      const selectedRegions = updated.filter(r => r.selected);
      if (selectedRegions.length > 0) {
        const equalPercentage = Math.floor(100 / selectedRegions.length);
        const remainder = 100 - (equalPercentage * selectedRegions.length);
        
        let remainderDistributed = 0;
        updated.forEach((region, idx) => {
          if (region.selected) {
            region.percentage = equalPercentage + (remainderDistributed < remainder ? 1 : 0);
            region.amount = Math.round((region.percentage / 100) * totalBudget);
            if (remainderDistributed < remainder) remainderDistributed++;
          } else {
            region.percentage = 0;
            region.amount = 0;
          }
        });
      }
      
      return updated;
    });
  };

  const handlePercentageChange = (index: number, newPercentage: number) => {
    setRegionBudgets(prev => {
      const updated = [...prev];
      const selectedRegions = updated.filter(r => r.selected);
      const otherSelectedRegions = selectedRegions.filter((_, idx) => 
        updated.findIndex(r => r === selectedRegions[idx]) !== index
      );
      
      // Update the changed region
      updated[index].percentage = newPercentage;
      
      // Redistribute remaining percentage among other selected regions
      const remainingPercentage = 100 - newPercentage;
      if (otherSelectedRegions.length > 0) {
        const equalShare = remainingPercentage / otherSelectedRegions.length;
        otherSelectedRegions.forEach(region => {
          const regionIndex = updated.findIndex(r => r === region);
          updated[regionIndex].percentage = Math.round(equalShare);
        });
      }
      
      // Update amounts
      updated.forEach(region => {
        if (region.selected) {
          region.amount = Math.round((region.percentage / 100) * totalBudget);
        }
      });
      
      return updated;
    });
  };

  const addRegion = () => {
    const availableRegions = AVAILABLE_REGIONS.filter(
      r => !regionBudgets.some(rb => rb.region === r.name)
    );
    
    if (availableRegions.length > 0) {
      const newRegion = availableRegions[0];
      setRegionBudgets(prev => [
        ...prev,
        { region: newRegion.name, percentage: 0, amount: 0, selected: false }
      ]);
    }
  };

  const removeRegion = (index: number) => {
    setRegionBudgets(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      // Redistribute percentages if the removed region was selected
      if (prev[index].selected) {
        const selectedRegions = updated.filter(r => r.selected);
        if (selectedRegions.length > 0) {
          const equalPercentage = Math.floor(100 / selectedRegions.length);
          selectedRegions.forEach(region => {
            region.percentage = equalPercentage;
            region.amount = Math.round((region.percentage / 100) * totalBudget);
          });
        }
      }
      return updated;
    });
  };

  const handleLaunch = () => {
    const campaignData = {
      totalBudget,
      duration,
      platform,
      targetReach: targetReach[0],
      autoOptimize,
      regions: regionBudgets.filter(r => r.selected),
      creativeName
    };
    console.log("Launching campaign with:", campaignData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 w-full max-w-4xl max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <Rocket className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Scale Campaign</h2>
                      {creativeName && (
                        <p className="text-sm text-gray-400 mt-0.5">for "{creativeName}"</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column - Budget & Settings */}
                  <div className="space-y-6">
                    {/* Total Budget */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        Total Campaign Budget
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(Number(e.target.value))}
                          className="bg-white/5 border-white/10 text-white pl-8 h-12 text-xl font-bold"
                          min={1000}
                          max={1000000}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: $1,000</span>
                        <span>Max: $1,000,000</span>
                      </div>
                    </div>

                    {/* Campaign Duration */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Campaign Duration
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="3">3 Days - Quick Burst</SelectItem>
                          <SelectItem value="7">7 Days - Standard</SelectItem>
                          <SelectItem value="14">14 Days - Extended</SelectItem>
                          <SelectItem value="30">30 Days - Long Term</SelectItem>
                          <SelectItem value="60">60 Days - Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-purple-400" />
                        Target Platforms
                      </Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="tiktok">TikTok Only</SelectItem>
                          <SelectItem value="instagram">Instagram Reels</SelectItem>
                          <SelectItem value="youtube">YouTube Shorts</SelectItem>
                          <SelectItem value="multi">TikTok + Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Reach */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-400" />
                        Campaign Aggressiveness
                      </Label>
                      <div className="px-3">
                        <Slider
                          value={targetReach}
                          onValueChange={setTargetReach}
                          min={0}
                          max={100}
                          step={10}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Conservative</span>
                        <span className="text-lg font-bold text-orange-400">{targetReach[0]}%</span>
                        <span className="text-xs text-gray-500">Aggressive</span>
                      </div>
                    </div>

                    {/* Auto-Optimize Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Settings className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white cursor-pointer">
                            Auto-Optimize Budget
                          </Label>
                          <p className="text-xs text-gray-400 mt-0.5">
                            AI adjusts budget based on performance
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={autoOptimize}
                        onCheckedChange={setAutoOptimize}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>
                  </div>

                  {/* Right Column - Region Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Target Regions
                      </Label>
                      <Button
                        onClick={addRegion}
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Region
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {regionBudgets.map((region, index) => {
                        const regionData = AVAILABLE_REGIONS.find(r => r.name === region.region);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl border transition-all ${
                              region.selected 
                                ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30' 
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={region.selected}
                                onCheckedChange={() => handleRegionToggle(index)}
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{regionData?.flag}</span>
                                    <span className="font-medium text-white">{region.region}</span>
                                  </div>
                                  {regionBudgets.length > 3 && (
                                    <button
                                      onClick={() => removeRegion(index)}
                                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                  )}
                                </div>
                                
                                {region.selected && (
                                  <>
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs text-gray-400">Budget Share</span>
                                          <span className="text-sm font-bold text-purple-400">
                                            {region.percentage}%
                                          </span>
                                        </div>
                                        <Slider
                                          value={[region.percentage]}
                                          onValueChange={([value]) => handlePercentageChange(index, value)}
                                          min={5}
                                          max={80}
                                          step={5}
                                          className="w-full"
                                          disabled={!region.selected}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                      <span className="text-xs text-gray-400">Allocated Budget</span>
                                      <span className="text-lg font-bold text-green-400">
                                        ${region.amount.toLocaleString()}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Budget Summary */}
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                      <h4 className="text-sm font-semibold text-purple-300 mb-3">Campaign Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Total Budget</span>
                          <span className="text-sm font-bold text-white">${totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Active Regions</span>
                          <span className="text-sm font-bold text-white">
                            {regionBudgets.filter(r => r.selected).length} regions
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Daily Spend</span>
                          <span className="text-sm font-bold text-white">
                            ${Math.round(totalBudget / parseInt(duration)).toLocaleString()}/day
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Est. Reach</span>
                          <span className="text-sm font-bold text-green-400">
                            ~{((totalBudget / 1000) * 150 * (targetReach[0] / 50)).toFixed(1)}K views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Campaign will start immediately after launch
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="bg-white/5 hover:bg-white/10 text-white border-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLaunch}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ScaleModal;