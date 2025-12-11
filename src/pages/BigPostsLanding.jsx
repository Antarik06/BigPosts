import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart,  Send, CheckCheck, Bookmark } from 'lucide-react';


const COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-600',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  purple: 'bg-purple-600',
  pink: 'bg-pink-500',
};

const TEXT_COLORS = {
  red: 'text-red-500',
  blue: 'text-blue-600',
  green: 'text-green-500',
  yellow: 'text-yellow-600',
  orange: 'text-orange-500',
  purple: 'text-purple-600',
  pink: 'text-pink-500',
};

const BIGPOST_TITLES = [
  "Why I quit my job to travel 🌍", "The future of AI is colorful 🎨", "Top 10 Ramen Spots 🍜", 
  "My Morning Routine ☀️", "Coding late at night 💻", "Design Trends 2025 🚀", 
  "How to bake the perfect bread 🥖", "Fitness Journey Day 1 💪", "Reviewing the new Tech 📱"
];

const SHORT_MESSAGES = [
  "Hey!", "Call me?", "On my way", "Did you see this?", "Lol", "Okay cool"
];

// --- Sub-Components ---

const BigPostCard = ({ title, color }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-[260px] md:w-[280px]">
    <div className={`h-24 w-full ${COLORS[color]} relative flex items-center justify-center`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
    </div>
    <div className="p-4">
      <h3 className={`font-bold text-lg leading-tight mb-3 text-gray-800`}>{title}</h3>
      <div className="space-y-2 mb-3">
        <div className="h-2 w-full bg-gray-100 rounded-full"></div>
        <div className="h-2 w-4/6 bg-gray-100 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div className="flex space-x-2 items-center">
           <div className={`w-5 h-5 rounded-full ${COLORS[color]}`}></div>
        </div>
        <Bookmark size={16} className={`${TEXT_COLORS[color]}`} />
      </div>
    </div>
  </div>
);

const WhatsappBubble = ({ text, align }) => (
  <div className={`flex w-full ${align === 'right' ? 'justify-end' : 'justify-start'} mb-2`}>
    <div className={`px-4 py-3 rounded-2xl text-sm shadow-md max-w-[220px] relative border border-gray-100
      ${align === 'right' ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
      {text}
      <div className="flex justify-end items-center mt-1 space-x-1">
        <span className="text-[10px] text-gray-400">10:42 AM</span>
        {align === 'right' && <CheckCheck size={14} className="text-blue-500" />}
      </div>
    </div>
  </div>
);

const IphoneBubble = ({ text, align }) => {
  const isMe = align === 'right';
  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[220px] px-5 py-3 rounded-2xl text-sm font-medium shadow-md
        ${isMe ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
        {text}
      </div>
    </div>
  );
};

const TwitterCard = ({ text, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100 max-w-[250px]">
    <div className="flex items-center space-x-3 mb-2">
      <div className={`w-8 h-8 rounded-full ${COLORS[color]} flex items-center justify-center text-white font-bold`}>T</div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-800">User_{color}</span>
        <span className="text-[10px] text-blue-400">@handle</span>
      </div>
    </div>
    <p className="text-sm mb-3 text-gray-600 leading-snug">{text}</p>
  </div>
);

const InstaCard = ({ color }) => (
  <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 max-w-[180px]">
    <div className="flex items-center space-x-2 mb-2">
      <div className={`w-6 h-6 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600`}>
         <div className="bg-white rounded-full w-full h-full p-[1px]">
            <div className={`w-full h-full rounded-full ${COLORS[color]}`}></div>
         </div>
      </div>
      <span className="text-xs font-semibold text-gray-700">insta_fan</span>
    </div>
    <div className={`w-full aspect-square rounded-lg ${COLORS[color]} opacity-90 mb-2 flex items-center justify-center shadow-inner`}>
      <Heart className="text-white/80 fill-white" size={28} />
    </div>
  </div>
);

// --- Main Component ---

const BigPostsLanding = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Increased to 15 for better coverage without overcrowding
    const TOTAL_BUBBLES = 15; 
    // Divide screen into 5 lanes (20% width each) to prevent horizontal overlap
    const LANE_COUNT = 5; 
    const colorKeys = Object.keys(COLORS);
    
    const newBubbles = Array.from({ length: TOTAL_BUBBLES }).map((_, i) => {
      const isBigPost = Math.random() < 0.70;
      
      // LOGIC FIX: Assign a specific lane based on index
      // i % LANE_COUNT ensures 0, 1, 2, 3, 4, 0, 1... distribution
      const lane = i % LANE_COUNT; 
      // Calculate base X position for that lane (e.g., 5%, 25%, 45%...)
      const laneWidth = 100 / LANE_COUNT;
      const baseX = (lane * laneWidth) + (laneWidth / 4); 
      // Add a small random jitter (+/- 5%) so they aren't in a perfect straight line
      const jitter = (Math.random() * 10) - 5;
      
      return {
        id: i,
        type: isBigPost ? 'bigpost' : ['iphone', 'twitter', 'insta', 'whatsapp'][Math.floor(Math.random() * 4)],
        text: isBigPost ? BIGPOST_TITLES[Math.floor(Math.random() * BIGPOST_TITLES.length)] 
                        : SHORT_MESSAGES[Math.floor(Math.random() * SHORT_MESSAGES.length)],
        color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
        align: Math.random() > 0.5 ? 'right' : 'left',
        
        // Use the calculated X position
        x: Math.max(5, Math.min(90, baseX + jitter)), 
        
        // Scale logic
        scale: isBigPost ? 0.85 + Math.random() * 0.15 : 0.7 + Math.random() * 0.2, 
        
        // LOGIC FIX: Staggered Delay
        // Instead of random delay, we multiply index by a constant (e.g. 3 seconds)
        // This ensures they appear one-by-one and never clump vertically
        delay: i * 2.5, 
        
        // Consistent slow speed
        duration: 25 + Math.random() * 5, 
      };
    });
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden font-sans selection:bg-purple-200">
      
      {/* --- Animated Background Layer --- */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ y: "110vh", x: `${bubble.x}vw`, opacity: 0, scale: bubble.scale }}
            animate={{ 
              y: "-60vh", // Move higher up to fully clear screen
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ 
              duration: bubble.duration, 
              repeat: Infinity, 
              delay: bubble.delay,
              ease: "linear"
            }}
            className="absolute top-0 left-0"
            style={{ 
                // Randomize Z-index slightly so small items can sometimes be in front
                zIndex: bubble.type === 'bigpost' ? 1 : 2 
            }} 
          >
            {bubble.type === 'bigpost' && <BigPostCard title={bubble.text} color={bubble.color} />}
            {bubble.type === 'whatsapp' && <WhatsappBubble text={bubble.text} align={bubble.align} />}
            {bubble.type === 'iphone' && <IphoneBubble text={bubble.text} align={bubble.align} />}
            {bubble.type === 'twitter' && <TwitterCard text={bubble.text} color={bubble.color} />}
            {bubble.type === 'insta' && <InstaCard color={bubble.color} />}
          </motion.div>
        ))}
      </div>

      {/* --- Main Content Layer --- */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Navbar */}
        <nav className="absolute top-0 w-full max-w-7xl p-6 flex justify-between items-center ">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer select-none"
          >
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-600">
              BigPosts
            </h1>
          </motion.div>
          
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-7 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
            Log In
          </button>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto text-center space-y-6 p-4 backdrop-blur-sm bg-white/60 shadow-sm ">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-8xl font-black tracking-tight leading-none text-slate-800 drop-shadow-sm">
              For <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-600">
                 Big ideas and moments
              </span> 
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-semibold text-slate-600 max-w-2xl mx-auto  py-2 px-4 "
          >
             A not so Big social media platform (as of now :)
          </motion.p>

          <motion.div 
            className="pt-8 pb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Single Gradient Button */}
            <button className="relative group px-12 py-6 rounded-full font-black text-xl md:text-2xl text-white shadow-2xl overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-600 "></div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="relative flex items-center gap-3">
                JOIN BIGPOSTS <Send strokeWidth={3} />
              </span>
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BigPostsLanding;