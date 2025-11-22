import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, Copy, Sparkles, Zap, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

const UploadSection = ({ onUploadComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };



    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate progress animation
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Make actual API call
            const response = await fetch('https://backend-q71m.onrender.com/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Complete progress
            setUploadProgress(100);

            setTimeout(() => {
                setIsUploading(false);
                setUploadedFile({
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    namespace: data.namespace,
                    link: `https://backend-q71m.onrender.com/chat/${data.namespace}`
                });
                onUploadComplete(true);
            }, 500);

        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
            setUploadProgress(0);
            alert('Upload failed. Please try again.');
        }
    };

    const copyToClipboard = () => {
        if (uploadedFile) {
            navigator.clipboard.writeText(uploadedFile.link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const resetUpload = () => {
        setUploadedFile(null);
        setIsCopied(false);
        setUploadProgress(0);
    };

    return (
        <div className="h-full flex flex-col justify-center max-w-xl mx-auto w-full p-8 animate-slide-right">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-6 h-6 text-primary" />
                        <h2 className="text-4xl font-heading font-bold text-gradient-animate">
                            Upload & Deploy
                        </h2>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Transform your documents into an intelligent chat interface instantly.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!uploadedFile ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        >
                            <Card
                                className={cn(
                                    "relative overflow-hidden border-2 border-dashed transition-all duration-500 group cursor-pointer",
                                    isDragging
                                        ? "border-primary/60 bg-primary/5 scale-[1.02] glow-primary"
                                        : "border-border hover:border-primary/40 hover:bg-white/[0.02]",
                                    "h-[420px] flex flex-col items-center justify-center gap-6"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isUploading && document.getElementById('file-upload').click()}
                            >
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Animated Border Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary blur-xl opacity-20" />
                                </div>

                                {/* Upload Icon */}
                                <div className="relative z-10 w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:glow-primary transition-all duration-500">
                                    <AnimatePresence mode="wait">
                                        {isUploading ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, rotate: -180 }}
                                                animate={{ opacity: 1, rotate: 0 }}
                                                exit={{ opacity: 0, rotate: 180 }}
                                                className="relative"
                                            >
                                                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="upload"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <Upload className="w-12 h-12 text-primary group-hover:text-white transition-colors" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Text Content */}
                                <div className="text-center relative z-10 space-y-3 px-6">
                                    <h3 className="text-2xl font-semibold text-white">
                                        {isUploading ? "Processing Your File" : "Drop your file here"}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {isUploading ? "Analyzing and indexing content..." : "or click to browse • PDF"}
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                {isUploading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative z-10 w-64"
                                    >
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center mt-2">
                                            {uploadProgress}% Complete
                                        </p>
                                    </motion.div>
                                )}

                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    disabled={isUploading}
                                    accept=".pdf,.docx,.txt"
                                />
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
                        >
                            <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-xl relative overflow-hidden glow-primary">
                                {/* Top Gradient Bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                                    className="flex items-start gap-4 mb-8"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border border-success/30 glow-primary">
                                        <Check className="w-7 h-7 text-success" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-white mb-1">Ready to Chat!</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> {uploadedFile.name} • {uploadedFile.size}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Link Display */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div className="p-4 rounded-xl bg-black/40 border border-primary/20 flex items-center justify-between group hover:border-primary/40 transition-all">
                                        <code className="text-sm text-primary font-mono truncate flex-1 mr-4">
                                            {uploadedFile.link}
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={copyToClipboard}
                                            className="hover:bg-primary/10 shrink-0"
                                        >
                                            <motion.div
                                                animate={isCopied ? { scale: [1, 1.2, 1] } : {}}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {isCopied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                            </motion.div>
                                        </Button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity glow-primary"
                                            onClick={copyToClipboard}
                                        >
                                            <motion.div
                                                className="flex items-center gap-2"
                                                animate={isCopied ? { scale: [1, 1.05, 1] } : {}}
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check className="w-4 h-4" /> Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" /> Copy Link
                                                    </>
                                                )}
                                            </motion.div>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
                                            onClick={resetUpload}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" /> New Upload
                                        </Button>
                                    </div>
                                </motion.div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default UploadSection;
