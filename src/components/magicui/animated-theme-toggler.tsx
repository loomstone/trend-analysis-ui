import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function AnimatedThemeToggler() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden transition-all shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >

      
      <motion.div
        className="relative z-10"
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === "light" ? (
          <motion.div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -inset-2 bg-yellow-300 opacity-50 blur-xl rounded-full" />
            <Moon className="w-8 h-8 relative z-10 fill-yellow-400 text-yellow-400" style={{ 
              filter: 'drop-shadow(0 0 15px #facc15) drop-shadow(0 0 25px #facc15)',
            }} />
          </motion.div>
        ) : (
          <motion.div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -inset-2 bg-yellow-300 opacity-50 blur-xl rounded-full" />
            <Sun className="w-8 h-8 relative z-10 fill-yellow-400 text-yellow-400" style={{ 
              filter: 'drop-shadow(0 0 15px #facc15) drop-shadow(0 0 25px #facc15)',
            }} />
          </motion.div>
        )}
      </motion.div>

      {/* Animated particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: theme === "dark" ? [0, 1, 0] : 0,
            scale: theme === "dark" ? [0, 1.5, 0] : 0,
            x: theme === "dark" ? [0, (i % 2 ? 1 : -1) * 20] : 0,
            y: theme === "dark" ? [0, (i < 2 ? -1 : 1) * 20] : 0,
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            repeat: theme === "dark" ? Infinity : 0,
            repeatDelay: 2,
          }}
        />
      ))}
    </motion.button>
  );
}
