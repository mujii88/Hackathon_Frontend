import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Cpu, Compass, Server, Check, Layers } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const VectorExplorer = ({ activeDoc }) => {
    const [selectedVecId, setSelectedVecId] = useState('vec1');
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Mock vector dimensions to show a visual look of the high-dimensional vector space
    const mockVectors = [
        { id: 'vec1', score: 0.9412, text: 'FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints.', coords: [0.0125, -0.0482, 0.1293, -0.3184, 0.0921, 0.1482, -0.0094, 0.0831] },
        { id: 'vec2', score: 0.8876, text: 'The LangChain framework is designed to help developers build applications that combine large language models (LLMs) with external data sources.', coords: [-0.0894, 0.1042, -0.0381, 0.2291, -0.1194, 0.0381, 0.0841, -0.1294] },
        { id: 'vec3', score: 0.8129, text: 'Pinecone is a fully managed cloud vector database that makes it easy to add semantic search, recommendation engines, and security applications to LLM pipelines.', coords: [0.1024, -0.0094, 0.2038, -0.0841, 0.0381, 0.1839, -0.0482, 0.0911] },
        { id: 'vec4', score: 0.7645, text: 'Document chunking splits large articles into smaller segments (e.g. chunk size 800 with overlap 150) so that embeddings represent precise, localized contexts.', coords: [-0.0129, 0.0841, -0.1092, 0.0931, -0.0482, 0.1294, 0.0319, -0.0821] }
    ];

    const copyCoords = (coords, index) => {
        navigator.clipboard.writeText(JSON.stringify(coords));
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!activeDoc) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none bg-[#F8F9FA]">
                <div className="w-16 h-16 bg-white rounded-full border border-[#DADCE0] flex items-center justify-center mb-4 shadow-sm">
                    <Database className="w-8 h-8 text-[#9AA0A6]" />
                </div>
                <h3 className="text-lg font-medium text-[#202124] mb-2">No Active Namespace</h3>
                <p className="text-sm text-[#5F6368] max-w-[300px] leading-relaxed">
                    Please select or upload a document to inspect its vector embeddings.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar bg-[#F8F9FA]">
            {/* Index Meta Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Panel */}
                <div className="bg-white rounded-2xl border border-[#DADCE0] p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center">
                            <Server className="w-5 h-5 text-[#1A73E8]" />
                        </div>
                        <h3 className="text-base font-medium text-[#202124]">Namespace Configuration</h3>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center border-b border-[#F1F3F4] pb-3">
                            <span className="text-[#5F6368]">Index Name</span>
                            <span className="font-medium text-[#202124]">instantrag-index</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#F1F3F4] pb-3">
                            <span className="text-[#5F6368]">Namespace ID</span>
                            <span className="font-mono text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded">{activeDoc.namespace}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#F1F3F4] pb-3">
                            <span className="text-[#5F6368]">Dimensions</span>
                            <span className="font-medium text-[#202124]">768</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-[#5F6368]">Metric Type</span>
                            <span className="font-medium text-[#34A853] bg-[#E6F4EA] px-2 py-0.5 rounded-full text-xs">Cosine Similarity</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Visualization */}
                <div className="bg-white rounded-2xl border border-[#DADCE0] p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#F3E8FD] flex items-center justify-center">
                            <Layers className="w-5 h-5 text-[#A142F4]" />
                        </div>
                        <h3 className="text-base font-medium text-[#202124]">Vector Projection Space</h3>
                    </div>

                    <div className="flex-1 flex gap-6">
                        {/* Stats left */}
                        <div className="space-y-4 text-sm text-[#5F6368] shrink-0 min-w-[120px]">
                            <div>
                                <p className="text-xs mb-1">Total Vectors</p>
                                <p className="font-medium text-[#202124]">{mockVectors.length}</p>
                            </div>
                            <div>
                                <p className="text-xs mb-1">Index Latency</p>
                                <p className="font-medium text-[#34A853]">1.2 ms</p>
                            </div>
                        </div>

                        {/* Interactive Grid */}
                        <div className="flex-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-full h-full opacity-[0.03]">
                                    <defs>
                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="1"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                                
                                {/* Crosshair */}
                                <div className="absolute w-full h-px bg-[#DADCE0] top-1/2 -translate-y-1/2"></div>
                                <div className="absolute h-full w-px bg-[#DADCE0] left-1/2 -translate-x-1/2"></div>

                                {/* Nodes */}
                                {[
                                    { id: 'vec1', x: '30%', y: '35%', color: '#1A73E8' },
                                    { id: 'vec2', x: '65%', y: '40%', color: '#A142F4' },
                                    { id: 'vec3', x: '45%', y: '70%', color: '#EA4335' },
                                    { id: 'vec4', x: '75%', y: '60%', color: '#FBBC04' }
                                ].map((node) => {
                                    const isSel = selectedVecId === node.id;
                                    return (
                                        <button
                                            key={node.id}
                                            onClick={() => setSelectedVecId(node.id)}
                                            className="absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer focus:outline-none -translate-x-1/2 -translate-y-1/2 group z-10"
                                            style={{ left: node.x, top: node.y }}
                                        >
                                            <div 
                                                className={cn(
                                                    "w-3 h-3 rounded-full transition-all duration-200 group-hover:scale-125",
                                                    isSel && "ring-4 ring-opacity-30 scale-125"
                                                )}
                                                style={{ 
                                                    backgroundColor: node.color,
                                                    '--tw-ring-color': node.color
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vector DB Records Grid */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-base font-medium text-[#202124]">Indexed Segments</h3>
                    <span className="text-xs font-medium text-[#5F6368] bg-white px-3 py-1 rounded-full border border-[#DADCE0]">Pinecone Database Feed</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-text">
                    {mockVectors.map((vec, idx) => {
                        const isSelCard = selectedVecId === vec.id;
                        return (
                            <div 
                                key={vec.id} 
                                onClick={() => setSelectedVecId(vec.id)}
                                className={cn(
                                    "p-5 flex flex-col justify-between min-h-[180px] cursor-pointer transition-all duration-200 rounded-2xl border",
                                    isSelCard 
                                        ? "border-[#1A73E8] bg-[#E8F0FE] shadow-sm" 
                                        : "border-[#DADCE0] bg-white hover:border-[#1A73E8] hover:shadow-sm"
                                )}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between text-xs font-medium mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full transition-all", 
                                            isSelCard ? "bg-[#1A73E8]" : "bg-[#DADCE0]"
                                        )} />
                                        <span className="text-[#5F6368]">ID: {activeDoc.namespace.substring(0, 8)}_{vec.id}</span>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[11px]", 
                                        isSelCard ? "bg-[#1A73E8] text-white" : "bg-[#F1F3F4] text-[#5F6368]"
                                    )}>
                                        Score: {vec.score}
                                    </span>
                                </div>

                                {/* Text Metadata */}
                                <p className="text-sm text-[#3C4043] leading-relaxed mb-4 flex-1">
                                    {vec.text}
                                </p>

                                {/* Coordinates block */}
                                <div className="p-3 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl flex items-center justify-between group-hover:border-[#1A73E8]/30">
                                    <code className="text-[11px] text-[#5F6368] truncate font-mono mr-4 bg-transparent">
                                        [{vec.coords.join(', ')}]
                                    </code>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyCoords(vec.coords, idx);
                                        }}
                                        className="text-xs font-medium text-[#1A73E8] hover:text-[#1557B0] shrink-0"
                                    >
                                        {copiedIndex === idx ? (
                                            <span className="flex items-center gap-1 text-[#34A853]">
                                                <Check className="w-3.5 h-3.5" />
                                                Copied
                                            </span>
                                        ) : (
                                            'Copy Values'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VectorExplorer;
