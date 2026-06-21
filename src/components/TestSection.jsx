import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, Copy, Sparkles, BookOpen, Search, Code, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';

const TestSection = ({ activeDoc }) => {
    const { showToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [selectedMsgId, setSelectedMsgId] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Clear and reset chat when active document changes
    useEffect(() => {
        if (activeDoc) {
            const initialMsg = {
                id: 'init',
                type: 'bot',
                text: `I'm ready to answer questions about **${activeDoc.name}**.\n\nWhat would you like to know?`,
                snippets: [],
                latency: 0
            };
            setMessages([initialMsg]);
            setSelectedMsgId('init');
        }
    }, [activeDoc]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isSending || !activeDoc) return;

        const question = inputMessage;
        const userMsgId = `user-${Date.now()}`;
        const userMessage = {
            id: userMsgId,
            type: 'user',
            text: question,
            snippets: []
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsSending(true);

        const startTime = Date.now();

        try {
            const response = await fetch(`/api/chat/${activeDoc.namespace}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: question })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const latencyTime = Date.now() - startTime;
            const botMsgId = `bot-${Date.now()}`;

            const botMessage = {
                id: botMsgId,
                type: 'bot',
                text: data.formatted_answer || data.answer || 'Empty response received.',
                snippets: data.context_snippets || [],
                latency: latencyTime
            };

            setMessages(prev => [...prev, botMessage]);
            setSelectedMsgId(botMsgId);
            setIsSending(false);

        } catch (error) {
            console.error('Chat error:', error);
            const botMsgId = `bot-err-${Date.now()}`;
            const errorMessage = {
                id: botMsgId,
                type: 'bot',
                text: 'Connection failed. Unable to retrieve context or generate an answer.',
                snippets: [],
                latency: 0
            };

            setMessages(prev => [...prev, errorMessage]);
            setSelectedMsgId(botMsgId);
            setIsSending(false);
        }
    };

    const copyText = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const selectedMsg = messages.find(m => m.id === selectedMsgId) || null;
    const activeSnippets = selectedMsg?.snippets || [];

    return (
        <div className="w-full h-full flex overflow-hidden bg-[#F8F9FA]">
            {/* Left Column: Semantic Source Inspector */}
            <div className="w-[350px] border-r border-[#DADCE0] flex flex-col h-full bg-white select-none shrink-0">
                <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1A73E8]" />
                    <span className="text-sm font-medium text-[#202124]">Sources</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar select-text bg-[#F8F9FA]">
                    {activeSnippets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
                            <div className="w-12 h-12 bg-white rounded-full border border-[#DADCE0] flex items-center justify-center mb-3 shadow-sm">
                                <Search className="w-5 h-5 text-[#9AA0A6]" />
                            </div>
                            <h4 className="text-sm font-medium text-[#3C4043]">No Sources Selected</h4>
                            <p className="text-xs text-[#5F6368] mt-1 max-w-[200px]">
                                Click on an AI response to see its retrieved context chunks.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium text-[#5F6368] mb-2 px-1">
                                <span>Retrieved Chunks</span>
                                <span className="bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded-full">{activeSnippets.length}</span>
                            </div>

                            {activeSnippets.map((snippet, idx) => (
                                <motion.div
                                    key={snippet.id || idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 bg-white border border-[#DADCE0] rounded-xl hover:shadow-md transition-all cursor-text group"
                                >
                                    {/* Snippet Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#1A73E8]">
                                            <Code className="w-3.5 h-3.5" />
                                            <span>Chunk {idx + 1}</span>
                                        </div>
                                        <div className="text-[10px] text-[#5F6368] bg-[#F1F3F4] px-1.5 py-0.5 rounded">
                                            Score: 0.89
                                        </div>
                                    </div>

                                    {/* Snippet Text Content */}
                                    <p className="text-xs text-[#3C4043] leading-relaxed">
                                        {snippet.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: AI Chat Console */}
            <div className="flex-1 flex flex-col h-full bg-white relative">
                
                {/* Top Info Bar */}
                {activeDoc && (
                    <div className="px-6 py-4 border-b border-[#DADCE0] bg-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[#5F6368]">Chatting with</span>
                            <span className="font-medium text-[#202124]">{activeDoc.name}</span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`http://127.0.0.1:8000/chat/${activeDoc.namespace}`);
                                showToast('API Link copied to clipboard!', 'success');
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#1A73E8] bg-[#E8F0FE] hover:bg-[#D2E3FC] transition-colors"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            Copy API Endpoint
                        </button>
                    </div>
                )}

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar select-text bg-white">
                    {messages.map((msg, index) => {
                        const isSelected = selectedMsgId === msg.id;
                        return (
                            <div
                                key={msg.id}
                                onClick={() => msg.snippets.length > 0 && setSelectedMsgId(msg.id)}
                                className={cn(
                                    "flex flex-col gap-1 max-w-[85%]",
                                    msg.type === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
                                    msg.snippets.length > 0 && "cursor-pointer"
                                )}
                            >
                                {/* Chat Bubble */}
                                <div
                                    className={cn(
                                        "px-5 py-3.5 text-[15px] leading-relaxed transition-all shadow-sm",
                                        msg.type === 'user'
                                            ? "bg-[#1A73E8] text-white rounded-[24px] rounded-tr-sm"
                                            : msg.text.includes('Connection failed')
                                                ? "bg-[#FCE8E6] border border-[#FAD2CF] text-[#C5221F] rounded-[24px] rounded-tl-sm"
                                                : cn(
                                                    "bg-[#F1F3F4] border border-transparent text-[#202124] rounded-[24px] rounded-tl-sm",
                                                    isSelected && "border-[#1A73E8] bg-[#E8F0FE]"
                                                  )
                                    )}
                                >
                                    <div className="space-y-3">
                                        {msg.text.split('\n').map((line, lineIdx) => (
                                            <p key={lineIdx}>
                                                {line.split('**').map((part, i) => 
                                                    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                    
                                    {/* Action Footers for Bot replies */}
                                    {msg.type === 'bot' && msg.id !== 'init' && !msg.text.includes('Connection failed') && (
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyText(msg.text, index);
                                                }}
                                                className="flex items-center gap-1.5 text-xs text-[#5F6368] hover:text-[#1A73E8] transition-colors font-medium"
                                            >
                                                {copiedIndex === index ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-[#34A853]" />
                                                        <span className="text-[#34A853]">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>

                                            <div className="flex items-center gap-3 text-xs text-[#5F6368]">
                                                {msg.snippets.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        <span>{msg.snippets.length} sources</span>
                                                    </div>
                                                )}
                                                {msg.latency > 0 && (
                                                    <span className="text-[#9AA0A6]">{msg.latency}ms</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Chat Loading State */}
                    {isSending && (
                        <div className="flex items-start gap-3 max-w-[85%] mr-auto">
                            <div className="bg-[#F1F3F4] px-5 py-4 rounded-[24px] rounded-tl-sm flex items-center gap-3 shadow-sm">
                                <Sparkles className="w-5 h-5 text-[#1A73E8] animate-pulse" />
                                <span className="text-[15px] text-[#5F6368] font-medium">Generating response...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Query Input Box */}
                <div className="p-4 bg-white border-t border-[#DADCE0]">
                    <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                        <Input
                            placeholder={activeDoc ? `Ask a question about ${activeDoc.name}...` : "Please select a document first"}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isSending || !activeDoc}
                            className="w-full pr-14 pl-6 h-14 bg-[#F1F3F4] border-transparent focus:border-[#1A73E8] focus:bg-white text-[15px] text-[#202124] rounded-full shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 h-10 w-10 bg-[#1A73E8] text-white rounded-full flex items-center justify-center hover:bg-[#1557B0] hover:shadow-md transition-all disabled:opacity-50 disabled:hover:shadow-none"
                            disabled={isSending || !inputMessage.trim() || !activeDoc}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-xs text-[#5F6368]">Gemini may produce inaccurate information about people, places, or facts.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSection;
