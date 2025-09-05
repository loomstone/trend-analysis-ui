import { useState } from "react";
import SimpleTrendGraph from "@/components/SimpleTrendGraph";
import CreativeDetailsCard from "@/components/CreativeDetailsCard";
import CreativeCardsGrid from "@/components/CreativeCardsGrid";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { MaterialCircularLoader, LoadingOverlay } from "@/components/ui/material-loader";
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
import { getSongMetadata } from "@/utils/dataTransformer";

const IndexContent = () => {
  const [selectedTrendId, setSelectedTrendId] = useState<string>("1");
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  
  // Get song metadata from the generated data
  const songMetadata = getSongMetadata();
  
  const handleCreativeSelect = (creative: Creative) => {
    setIsLoadingData(true);
    setSelectedCreative(creative);
    setShowDetails(true);
    // Simulate data loading
    setTimeout(() => {
      setIsLoadingData(false);
    }, 1800);
  };
  
  const handleBackToGrid = () => {
    setShowDetails(false);
  };
  
  return (
    <div className="min-h-screen m-0 p-0 w-full flex relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-100/50" style={{ background: 'hsl(var(--alpine-white))' }}>
      
      {/* Subtle ice crystal patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/20 via-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-50/20 via-white/10 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-50/20 via-white/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-50/20 via-white/10 to-transparent" />
        
        {/* Subtle corner accents */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-100/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-4 px-8"
        >
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Breadcrumb className="mb-0">
              <BreadcrumbList className="text-base">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/artists/${songMetadata.artist.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
                    {songMetadata.artist}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/songs/${songMetadata.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
                    {songMetadata.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 font-semibold">
                    Trend Analysis
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
        </motion.div>

        {/* Compare Trends Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-4 px-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Compare trends</h1>
            <p className="text-slate-600">Trend analysis on the last 2000 posts for this sound</p>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
          {/* Top Panel - Full Width Graph */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-[56vh]"
          >
            <SimpleTrendGraph 
              selectedTrendId={selectedCreative?.id?.toString() || selectedTrendId} 
              selectedCreative={selectedCreative}
            />
          </motion.div>

          {/* Middle/Bottom Section - Cards or Details */}
          <LoadingOverlay isLoading={isLoadingData} variant="progress">
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
                      className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium rounded-xl transition-all duration-200 hover:bg-gray-100/50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to All Creatives
                    </button>
                  </div>
                  <CreativeDetailsCard selectedCreative={selectedCreative} />
                </motion.div>
              )}
            </AnimatePresence>
          </LoadingOverlay>
        </div>
      </div>

    </div>
  );
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
