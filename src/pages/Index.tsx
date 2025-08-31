import { useState } from "react";
import SimpleTrendGraph from "@/components/SimpleTrendGraph";
import TrendVideosCard from "@/components/TrendVideosCard";
import { motion } from "framer-motion";
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

const IndexContent = () => {
  const [selectedTrendId, setSelectedTrendId] = useState<string>("1");
  const [selectedButton, setSelectedButton] = useState<string>("");
  
  return (
    <div className="min-h-screen m-0 p-0 w-full flex relative overflow-hidden">
      {/* Liquid Glass Background with Sky Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 dark:from-sky-600 dark:via-sky-700 dark:to-blue-800" />
      
      {/* Blur Effect Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      {/* Dark gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Edge Blur Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/40 via-white/20 to-transparent blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white/40 via-white/20 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white/40 via-white/20 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white/40 via-white/20 to-transparent blur-2xl" />
        
        {/* Corner blur enhancements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Main Content with Glass Effect */}
      <div className="flex-1 flex flex-col relative z-10 bg-white/10 dark:bg-white/5 backdrop-blur-md">
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
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/90 hover:text-white transition-colors font-medium drop-shadow-lg">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/70 drop-shadow-md" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/artists/fuerza-regida" className="text-white/90 hover:text-white transition-colors font-medium drop-shadow-lg">
                    Fuerza Regida
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/70 drop-shadow-md" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/songs/me-jalo" className="text-white/90 hover:text-white transition-colors font-medium drop-shadow-lg">
                    Me Jalo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/70 drop-shadow-md" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-semibold drop-shadow-lg">
                    Trend Analysis
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
          
          <div className="flex items-center justify-between">
            {/* Artist and Song */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-baseline gap-3"
            >
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Fuerza Regida</h1>
              <span className="text-white/70 drop-shadow-md">•</span>
              <p className="text-2xl text-white font-medium drop-shadow-lg">"Me Jalo"</p>
            </motion.div>

            {/* Theme Toggler */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ThemeSwitch />
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col p-6 space-y-6">
          {/* Top Half - Enhanced Analytics Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-1/2 min-h-[500px] bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl"
          >
            <SimpleTrendGraph selectedTrendId={selectedTrendId} />
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mb-6"
          >
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-b border-white/20 rounded-t-2xl p-1 h-auto">
                <TabsTrigger 
                  value="videos" 
                  className="rounded-xl border-2 border-transparent data-[state=active]:border-white/30 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg pb-3 pt-2 font-semibold text-white/70 data-[state=active]:text-white transition-all"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="creatives" 
                  className="rounded-xl border-2 border-transparent data-[state=active]:border-white/30 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg pb-3 pt-2 font-semibold text-white/70 data-[state=active]:text-white transition-all"
                >
                  Creatives
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  className="rounded-xl border-2 border-transparent data-[state=active]:border-white/30 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg pb-3 pt-2 font-semibold text-white/70 data-[state=active]:text-white transition-all"
                >
                  Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="flex-1"
                >
                  <TrendVideosCard selectedTrendId={selectedTrendId} selectedButton={selectedButton} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="creatives" className="mt-6">
                <div className="flex items-center justify-center h-96 text-white/70">
                  <p className="text-lg drop-shadow-sm">Creatives content coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-6">
                <div className="flex items-center justify-center h-96 text-white/70">
                  <p className="text-lg drop-shadow-sm">Analysis content coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>


        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
