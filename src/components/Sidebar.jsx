import React from 'react';
import { LayoutDashboard, MessageSquare, Database, FileCode2, FileText, CheckCircle2, ChevronRight, HardDrive, Copy, Cpu, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ activeTab, setActiveTab, documents, activeDoc, setActiveDoc, onClearLibrary }) => {
    const { showToast } = useToast();
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'chat', label: 'Neural Chat', icon: MessageSquare, disabled: documents.length === 0 },
        { id: 'vector_db', label: 'Vector Inspector', icon: Database, disabled: documents.length === 0 },
        { id: 'docs', label: 'Documentation', icon: FileCode2 },
    ];

    return (
        <aside className="w-[280px] bg-[#F8F9FA] flex flex-col h-screen shrink-0 select-none z-20">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center material-shadow-sm border border-[#DADCE0]">
                    <span className="text-[#1A73E8] font-bold text-lg">G</span>
                </div>
                <h1 className="font-heading font-semibold text-[20px] text-[#202124] tracking-tight">InstantRAG</h1>
            </div>

            {/* Sidebar Navigation Options */}
            <nav className="pt-4 pb-2 space-y-1 flex-1 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            disabled={item.disabled}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group rounded-full",
                                isActive
                                    ? "bg-[#E8F0FE] text-[#1967D2]"
                                    : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124]"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Icon className={cn("w-5 h-5", isActive ? "text-[#1967D2]" : "text-[#5F6368] group-hover:text-[#202124]")} />
                                <span>{item.label}</span>
                            </div>
                        </button>
                    );
                })}

                <div className="pt-6 pb-2 px-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">Documents</h3>
                        {documents.length > 0 && (
                            <button 
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete all documents?")) {
                                        onClearLibrary();
                                        showToast('Library cleared successfully.', 'success');
                                    }
                                }}
                                className="text-xs text-[#EA4335] hover:bg-[#FCE8E6] px-2 py-1 rounded-md transition-colors font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {documents.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <div className="w-10 h-10 mx-auto bg-[#F1F3F4] rounded-full flex items-center justify-center mb-3">
                                <HardDrive className="w-5 h-5 text-[#9AA0A6]" />
                            </div>
                            <p className="text-xs text-[#5F6368]">No documents uploaded</p>
                        </div>
                    ) : (
                        documents.map((doc) => {
                            const isActive = activeDoc?.namespace === doc.namespace;
                            return (
                                <div
                                    key={doc.namespace}
                                    onClick={() => {
                                        setActiveDoc(doc);
                                        if (activeTab === 'dashboard' || activeTab === 'docs') {
                                            setActiveTab('chat');
                                        }
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 transition-colors cursor-pointer group flex items-start gap-3 rounded-r-full relative border-l-4",
                                        isActive
                                            ? "bg-[#E8F0FE] border-[#1A73E8]"
                                            : "bg-transparent border-transparent hover:bg-[#F1F3F4]"
                                    )}
                                >
                                    <FileText className={cn(
                                        "w-4 h-4 mt-0.5 shrink-0 transition-colors",
                                        isActive ? "text-[#1A73E8]" : "text-[#5F6368]"
                                    )} />
                                    <div className="min-w-0 flex-1 pr-6">
                                        <p className={cn(
                                            "text-sm font-medium truncate transition-colors",
                                            isActive ? "text-[#1967D2]" : "text-[#3C4043]"
                                        )}>{doc.name}</p>
                                        <span className="text-[11px] text-[#5F6368]">{doc.size}</span>
                                    </div>
                                    
                                    {/* Copy Link overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(`http://127.0.0.1:8000/chat/${doc.namespace}`);
                                            showToast('Link copied to clipboard', 'success');
                                        }}
                                        className="absolute right-4 top-3 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#DADCE0] rounded-full text-[#5F6368] transition-all cursor-pointer"
                                        title="Copy API Link"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </nav>

            {/* Status Footer */}
            <div className="p-4 border-t border-[#DADCE0] bg-white text-xs text-[#5F6368] flex items-center justify-between">
                <span className="font-medium">System Status</span>
                <span className="flex items-center gap-1.5 text-[#34A853]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="font-medium">Online</span>
                </span>
            </div>
        </aside>
    );
};

export default Sidebar;
