import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <motion.div
            className="flex items-center gap-4 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="relative w-14 h-14 flex items-center justify-center">
                <svg
                    width="56"
                    height="56"
                    viewBox="0 0 100 100"
                    className="w-14 h-14 drop-shadow-[0_0_12px_rgba(0,243,255,0.5)]"
                >
                    {/* External Hexagon Bracket Ring */}
                    <motion.polygon
                        points="50,5 90,27 90,73 50,95 10,73 10,27"
                        fill="none"
                        stroke="#00f3ff"
                        strokeWidth="2.5"
                        strokeDasharray="25 10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                    />
                    {/* Inner Hexagon Pulsing Fill */}
                    <motion.polygon
                        points="50,15 82,32 82,68 50,85 18,68 18,32"
                        fill="rgba(0, 243, 255, 0.05)"
                        stroke="#ff007f"
                        strokeWidth="1.5"
                        animate={{
                            scale: [0.93, 1.05, 0.93],
                            opacity: [0.5, 0.9, 0.5]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ originX: "50px", originY: "50px" }}
                    />
                    {/* Center Core Circle with crosshair */}
                    <circle cx="50" cy="50" r="10" fill="none" stroke="#00f3ff" strokeWidth="2" />
                    <circle cx="50" cy="50" r="4" fill="#00f3ff" className="animate-pulse" />
                    
                    {/* Crosshairs */}
                    <line x1="50" y1="32" x2="50" y2="40" stroke="#00f3ff" strokeWidth="1.5" />
                    <line x1="50" y1="60" x2="50" y2="68" stroke="#00f3ff" strokeWidth="1.5" />
                    <line x1="32" y1="50" x2="40" y2="50" stroke="#00f3ff" strokeWidth="1.5" />
                    <line x1="60" y1="50" x2="68" y2="50" stroke="#00f3ff" strokeWidth="1.5" />
                </svg>
            </div>
            <div>
                <motion.h1
                    className="text-2xl font-heading font-black tracking-widest text-gradient"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    INSTANT_RAG
                </motion.h1>
                <p className="text-[10px] text-primary font-mono tracking-widest uppercase">// NEURAL_INDEX_CORE</p>
            </div>
        </motion.div>
    );
};

export default Logo;
