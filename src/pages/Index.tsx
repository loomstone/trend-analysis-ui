import { useState } from "react";
import SimpleTrendGraph from "@/components/SimpleTrendGraph";
import CreativeDetailsCard from "@/components/CreativeDetailsCard";
import CreativeCardsGrid from "@/components/CreativeCardsGrid";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Creative } from "@/components/CreativeCardsGrid";

const IndexContent = () => {
  const [selectedTrendId, setSelectedTrendId] = useState<string>("1");
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  const handleCreativeSelect = (creative: Creative) => {
    setSelectedCreative(creative);
    setShowDetails(true);
  };
  
  const handleBackToGrid = () => {
    setShowDetails(false);
  };
  
  return (
    <div className="min-h-screen m-0 p-0 w-full flex relative overflow-hidden">
      {/* Light Background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-6 px-8"
        >
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Breadcrumb className="mb-6">
              <BreadcrumbList className="text-base">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/artists/fuerza-regida" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    Fuerza Regida
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/songs/me-jalo" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    Me Jalo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-semibold">
                    Trend Analysis
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col p-6 space-y-6">
          {/* Top Panel - Full Width Graph */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-[550px]"
          >
            <SimpleTrendGraph 
              selectedTrendId={selectedCreative?.id?.toString() || selectedTrendId} 
              selectedCreative={selectedCreative}
            />
          </motion.div>

          {/* Middle/Bottom Section - Cards or Details */}
          <AnimatePresence mode="wait">
            {!showDetails ? (
              // Grid View - Trending Creative Cards
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Trending Creatives</h2>
                  <span className="text-blue-600 font-semibold">• Click any card to analyze</span>
                </div>
                <CreativeCardsGrid 
                  onCreativeSelect={handleCreativeSelect}
                  selectedCreativeId={selectedCreative?.id}
                />
              </motion.div>
            ) : (
              // Detail View - Selected Creative Details
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={handleBackToGrid}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl transition-all duration-200 border border-blue-200 shadow-sm hover:shadow-md hover:shadow-blue-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to All Creatives
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">Creative Insights</h2>
                </div>
                <CreativeDetailsCard selectedCreative={selectedCreative} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
