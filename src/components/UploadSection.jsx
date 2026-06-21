import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Zap, BrainCircuit, AlertCircle, CloudUpload, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';

const UploadSection = ({ onUploadComplete, documentsCount }) => {
    const { showToast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingFileName, setUploadingFileName] = useState('');

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
        if (!file.name.endsWith('.pdf')) {
            showToast('Only PDF files are supported.', 'error');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadingFileName(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setUploadProgress(100);

            setTimeout(() => {
                setIsUploading(false);
                const newDoc = {
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    namespace: data.namespace
                };
                onUploadComplete(newDoc);
            }, 500);

        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
            setUploadProgress(0);
            showToast('Connection failed. Please verify the backend server.', 'error');
        }
    };

    const getProgressMessage = (progress) => {
        if (progress < 30) return 'Uploading file...';
        if (progress < 60) return 'Extracting text...';
        if (progress < 90) return 'Generating embeddings...';
        return 'Finalizing...';
    };

    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
            {/* Top Workspace Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat 1: Nodes */}
                <div className="material-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#5F6368] mb-1">Active Documents</p>
                        <h3 className="text-3xl font-semibold text-[#202124]">{documentsCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-[#1A73E8]" />
                    </div>
                </div>

                {/* Stat 2: Latency */}
                <div className="material-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#5F6368] mb-1">System Latency</p>
                        <h3 className="text-3xl font-semibold text-[#202124]">
                            145<span className="text-xl text-[#5F6368] font-medium ml-1">ms</span>
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FCE8E6] flex items-center justify-center">
                        <Zap className="w-6 h-6 text-[#EA4335]" />
                    </div>
                </div>

                {/* Stat 3: Model */}
                <div className="material-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#5F6368] mb-1">AI Model</p>
                        <h3 className="text-3xl font-semibold text-[#202124]">Gemini 2.5</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                        <BrainCircuit className="w-6 h-6 text-[#34A853]" />
                    </div>
                </div>
            </div>

            {/* Central File Dropzone Card */}
            <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden min-h-[400px] transition-all duration-200 rounded-3xl bg-white border-2 border-dashed",
                    isDragging ? "border-[#1A73E8] bg-[#E8F0FE]" : "border-[#DADCE0]"
                )}
            >
                <div className="max-w-md w-full flex flex-col items-center text-center gap-6 relative z-10">
                    
                    <AnimatePresence mode="wait">
                        {isUploading ? (
                            <motion.div 
                                key="uploading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full space-y-6"
                            >
                                <div className="flex justify-center mb-2">
                                    <div className="w-16 h-16 relative">
                                        <svg className="w-full h-full text-[#E8F0FE]" viewBox="0 0 100 100">
                                            <circle className="stroke-current border-4" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                                        </svg>
                                        <svg className="w-full h-full text-[#1A73E8] absolute top-0 left-0 animate-spin" viewBox="0 0 100 100">
                                            <circle 
                                                className="stroke-current" 
                                                strokeWidth="8" 
                                                strokeLinecap="round" 
                                                cx="50" cy="50" r="40" 
                                                fill="transparent" 
                                                strokeDasharray="250" 
                                                strokeDashoffset={250 - (250 * uploadProgress) / 100}
                                            ></circle>
                                        </svg>
                                        {uploadProgress === 100 && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6 text-[#1A73E8]" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-[#202124]">
                                        {uploadProgress === 100 ? 'Upload Complete' : 'Processing Document'}
                                    </h3>
                                    <p className="text-sm text-[#5F6368]">
                                        {uploadingFileName}
                                    </p>
                                </div>

                                <div className="w-full bg-[#F1F3F4] rounded-full h-2 mt-4 overflow-hidden">
                                    <motion.div 
                                        className="bg-[#1A73E8] h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ ease: "linear" }}
                                    />
                                </div>
                                <p className="text-sm font-medium text-[#1A73E8] mt-2">
                                    {getProgressMessage(uploadProgress)}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-[#F1F3F4] rounded-full flex items-center justify-center mb-6">
                                    <CloudUpload className="w-10 h-10 text-[#1A73E8]" />
                                </div>
                                
                                <h3 className="text-2xl font-medium text-[#202124] mb-3">
                                    Upload a document
                                </h3>
                                <p className="text-base text-[#5F6368] mb-8 max-w-sm">
                                    Drag and drop your PDF here, or click to browse files from your computer.
                                </p>

                                <Button
                                    onClick={() => document.getElementById('file-upload').click()}
                                    className="px-6 py-2.5 text-sm font-medium bg-[#1A73E8] text-white rounded-full hover:bg-[#1557B0] hover:shadow-md transition-all flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Browse Files
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        accept=".pdf"
                    />

                    {/* Info alert */}
                    {!isUploading && (
                        <div className="absolute bottom-8 flex items-center gap-2 text-sm text-[#5F6368] font-medium bg-[#F8F9FA] border border-[#DADCE0] rounded-full px-4 py-1.5 shadow-sm">
                            <AlertCircle className="w-4 h-4 text-[#5F6368]" />
                            <span>Max file size: 50MB (PDF only)</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadSection;
