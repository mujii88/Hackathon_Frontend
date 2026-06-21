import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Cpu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import UploadSection from './components/UploadSection';
import TestSection from './components/TestSection';
import VectorExplorer from './components/VectorExplorer';
import Documentation from './components/Documentation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);

  // Load documents from localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('instantrag_docs_v3');
    if (savedDocs) {
      const parsed = JSON.parse(savedDocs);
      setDocuments(parsed);
      if (parsed.length > 0) {
        setActiveDoc(parsed[0]);
      }
    } else {
      setDocuments([]);
      setActiveDoc(null);
      localStorage.setItem('instantrag_docs_v3', JSON.stringify([]));
    }
  }, []);

  const handleUploadComplete = (newDoc) => {
    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    setActiveDoc(newDoc);
    localStorage.setItem('instantrag_docs_v3', JSON.stringify(updatedDocs));
    setActiveTab('chat');
  };

  // Clear library
  const handleClearLibrary = () => {
    setDocuments([]);
    setActiveDoc(null);
    localStorage.setItem('instantrag_docs_v3', JSON.stringify([]));
  };

  const handleActiveDocChange = (doc) => {
    setActiveDoc(doc);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'chat': return 'Neural Chat';
      case 'vector_db': return 'Vector Inspector';
      case 'docs': return 'Documentation';
      default: return 'Overview';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] text-[#202124] font-sans overflow-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documents={documents}
        activeDoc={activeDoc}
        setActiveDoc={handleActiveDocChange}
        onClearLibrary={handleClearLibrary}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        {/* Top Header - Material UI */}
        <header className="h-16 border-b border-[#DADCE0] flex items-center justify-between px-8 bg-white select-none shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-heading text-lg font-medium text-[#202124] tracking-tight">
              {getPageTitle()}
            </h2>

            {/* Document Active Breadcrumb */}
            {activeDoc && activeTab !== 'dashboard' && activeTab !== 'docs' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#F1F3F4] rounded-full text-xs font-medium text-[#5F6368] border border-[#DADCE0]">
                <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                <span className="text-[#202124] truncate max-w-[200px]">{activeDoc.name}</span>
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="flex items-center gap-6 text-xs text-[#5F6368] font-medium">
            <div className="hidden sm:flex items-center gap-1.5">
              <Network className="w-4 h-4 text-[#1A73E8]" />
              <span>127.0.0.1:8000</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#34A853]" />
              <span>Pinecone Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#EA4335]" />
              <span>Gemini 2.5 Pro</span>
            </div>
          </div>
        </header>

        {/* View switcher container */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full h-full"
            >
              {activeTab === 'dashboard' && (
                <UploadSection
                  onUploadComplete={handleUploadComplete}
                  documentsCount={documents.length}
                />
              )}

              {activeTab === 'chat' && (
                <TestSection activeDoc={activeDoc} />
              )}

              {activeTab === 'vector_db' && (
                <VectorExplorer activeDoc={activeDoc} />
              )}

              {activeTab === 'docs' && (
                <Documentation />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
