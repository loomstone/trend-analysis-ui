import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";

const FuturisticCreativeHeader: React.FC = () => {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Trending Creatives
          </h1>
          
          {/* Animated accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Discover the most viral content patterns and creative trends shaping the digital landscape
        </motion.p>
        
        {/* Floating elements */}
        <div className="absolute top-0 left-1/4 opacity-20">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-blue-400" />
          </motion.div>
        </div>
        
        <div className="absolute top-8 right-1/4 opacity-20">
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FuturisticCreativeHeader;