import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
const regions = [{
  name: "North America",
  color: "bg-dashboard-accent-blue",
  enabled: true
}, {
  name: "Europe",
  color: "bg-dashboard-text-secondary",
  enabled: true
}, {
  name: "LATAM",
  color: "bg-dashboard-text-muted",
  enabled: false
}];
const CampaignScalingCard = () => {
  const [budget, setBudget] = useState("15,000");
  return <div className="h-full">
      <h3 className="text-dashboard-text-primary font-medium mb-6 text-lg">Campaign Scaling</h3>
      
      <div className="space-y-6">
        {/* Scale Trend Button */}
        <Button className="w-full bg-dashboard-action-orange hover:bg-orange-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg">
          Scale Trend <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Budget Allocation */}
        <div>
          <h4 className="text-dashboard-text-secondary text-sm mb-3">Budget Allocation</h4>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-primary font-semibold">$</span>
            <Input 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="text-2xl font-semibold text-dashboard-text-primary bg-transparent border-dashboard-border pl-8 h-12"
              placeholder="15,000"
            />
          </div>
          <p className="text-sm text-dashboard-text-secondary">Recommended for this trend</p>
        </div>

        {/* Target Regions */}
        <div>
          <h4 className="text-dashboard-text-secondary text-sm mb-4">Target Regions</h4>
          <div className="space-y-3">
            {regions.map(region => <div key={region.name} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-sm ${region.color} ${!region.enabled ? 'opacity-50' : ''}`}></div>
                <span className={`text-sm ${region.enabled ? 'text-dashboard-text-primary' : 'text-dashboard-text-muted'}`}>
                  {region.name}
                </span>
              </div>)}
          </div>
        </div>

        {/* AI Analysis */}
        <div>
          <h4 className="text-dashboard-text-secondary text-sm mb-3">AI Analysis</h4>
          <div className="bg-dashboard-success bg-opacity-20 border border-dashboard-success border-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
              <span className="text-dashboard-success font-medium text-sm">High Confidence</span>
            </div>
            <p className="text-dashboard-text-primary text-sm leading-relaxed text-slate-50">
              92% success probability based on similar trends
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default CampaignScalingCard;