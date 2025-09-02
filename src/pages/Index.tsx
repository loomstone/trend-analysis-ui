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
      {/* Dark Background */}
      <div className="absolute inset-0 bg-[#121212]" />
      

      
      {/* Edge Blur Effects - Icy Glass */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/5 via-white/2 to-transparent blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white/5 via-white/2 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white/5 via-white/2 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white/5 via-white/2 to-transparent blur-2xl" />
        
        {/* Corner blur enhancements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Main Content with Glass Effect */}
      <div className="flex-1 flex flex-col relative z-10 bg-white/5 backdrop-blur-xl">
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
                  <BreadcrumbLink href="/" className="text-gray-400 hover:text-white transition-colors font-medium">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/artists/fuerza-regida" className="text-gray-400 hover:text-white transition-colors font-medium">
                    Fuerza Regida
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/songs/me-jalo" className="text-gray-400 hover:text-white transition-colors font-medium">
                    Me Jalo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-semibold">
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
                  <h2 className="text-2xl font-bold text-white">Trending Creatives</h2>
                  <span className="text-sky-400 font-semibold">• Click any card to analyze</span>
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white font-medium rounded-xl transition-all duration-200 border border-purple-400/30 backdrop-blur-md shadow-lg hover:shadow-purple-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to All Creatives
                  </button>
                  <h2 className="text-2xl font-bold text-white">Creative Insights</h2>
                </div>
                <CreativeDetailsCard creative={selectedCreative} />
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
