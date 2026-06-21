import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none font-sans">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="pointer-events-auto w-full glass-card p-4 rounded-2xl flex items-start gap-3 border border-white/[0.08] shadow-2xl relative overflow-hidden bg-[#131314]/90 backdrop-blur-xl"
                        >
                            {/* Accent Glow line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                toast.type === 'success' ? 'bg-[#34a853]' :
                                toast.type === 'error' ? 'bg-[#ea4335]' : 'bg-[#1a73e8]'
                            }`} />
                            
                            {/* Icon */}
                            <div className="shrink-0 mt-0.5">
                                {toast.type === 'success' && <CheckCircle2 className="w-4.5 h-4.5 text-[#34a853]" />}
                                {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-[#ea4335]" />}
                                {toast.type === 'info' && <Info className="w-4.5 h-4.5 text-[#1a73e8]" />}
                            </div>

                            {/* Text */}
                            <div className="flex-1 text-xs text-slate-200 font-semibold tracking-wide pr-4">
                                {toast.message}
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 text-slate-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
