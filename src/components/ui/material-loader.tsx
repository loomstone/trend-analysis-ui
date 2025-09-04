import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MaterialCircularLoaderProps {
  size?: number;
  className?: string;
}

// Material Design 3 Circular Progress Indicator
export const MaterialCircularLoader: React.FC<MaterialCircularLoaderProps> = ({ 
  size = 56,
  className 
}) => {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Background track circle */}
      <svg 
        className="absolute inset-0" 
        viewBox="0 0 56 56"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="28"
          cy="28"
          r="25"
          stroke="#E8E3F0"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      
      {/* Animated progress circle */}
      <motion.svg 
        className="absolute inset-0" 
        viewBox="0 0 56 56"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transformOrigin: 'center' }}
      >
        <motion.circle
          cx="28"
          cy="28"
          r="25"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="157"
          initial={{ strokeDashoffset: 157 }}
          animate={{
            strokeDashoffset: [157, 40, 157],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1],
            times: [0, 0.5, 1]
          }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="25%" stopColor="#9575FF" />
            <stop offset="50%" stopColor="#7C4DFF" />
            <stop offset="75%" stopColor="#5E35B1" />
            <stop offset="100%" stopColor="#7C4DFF" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      {/* Inner pulsing effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="rounded-full"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            background: 'radial-gradient(circle, rgba(124, 77, 255, 0.2) 0%, transparent 70%)'
          }}
        />
      </motion.div>
    </div>
  );
};

// Material Design 3 Linear Progress Bar
export const MaterialLinearLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative w-full h-1 overflow-hidden rounded-full bg-purple-100/50", className)}>
      {/* Primary bar */}
      <motion.div
        className="absolute inset-y-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #7C4DFF 0%, #9575FF 50%, #7C4DFF 100%)',
        }}
        initial={{ x: '-100%', width: '40%' }}
        animate={{
          x: ['-100%', '100%', '100%'],
          width: ['40%', '100%', '40%'],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
          times: [0, 0.6, 1]
        }}
      />
      
      {/* Secondary bar for depth */}
      <motion.div
        className="absolute inset-y-0 rounded-full opacity-70"
        style={{
          background: 'linear-gradient(90deg, #5E35B1 0%, #7C4DFF 50%, #5E35B1 100%)',
        }}
        initial={{ x: '-100%', width: '30%' }}
        animate={{
          x: ['-100%', '100%', '100%'],
          width: ['30%', '80%', '30%'],
        }}
        transition={{
          duration: 2.1,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
          times: [0, 0.65, 1],
          delay: 0.2
        }}
      />
    </div>
  );
};

// Loading overlay container
export const LoadingOverlay: React.FC<{ 
  isLoading: boolean;
  children: React.ReactNode;
  variant?: 'circular' | 'linear';
}> = ({ isLoading, children, variant = 'circular' }) => {
  return (
    <div className="relative">
      {/* Content with reduced opacity when loading */}
      <motion.div
        animate={{ 
          opacity: isLoading ? 0.4 : 1,
          filter: isLoading ? 'blur(1px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      {/* Centered loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ minHeight: '300px' }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            {variant === 'circular' ? (
              <MaterialCircularLoader size={56} />
            ) : (
              <div className="w-48">
                <MaterialLinearLoader />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
