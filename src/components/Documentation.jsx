import React, { useState } from 'react';
import { Code2, Copy, Check, Info } from 'lucide-react';
import { Card } from './ui/Card';

const Documentation = () => {
    const [activeLang, setActiveLang] = useState('javascript');
    const [copied, setCopied] = useState(false);

    const codeSnippets = {
        javascript: `// Interrogate knowledge base using Fetch API
async function askQuestion(namespaceId, query) {
  const response = await fetch(
    \`http://127.0.0.1:8000/chat/\${namespaceId}\`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query })
    }
  );
  
  const data = await response.json();
  console.log("AI Answer:", data.formatted_answer);
  return data;
}`,
        python: `# Interrogate knowledge base using Python Requests
import requests

def ask_question(namespace_id, query):
    url = f"http://127.0.0.1:8000/chat/{namespace_id}"
    payload = {"query": query}
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    print("AI Answer:", data.get("formatted_answer"))
    return data`,
        curl: `# Interrogate knowledge base using cURL
curl -X POST \\
  http://127.0.0.1:8000/chat/YOUR_NAMESPACE_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    "query": "What is the summary of this document?"
  }'`
    };

    const copyCode = () => {
        navigator.clipboard.writeText(codeSnippets[activeLang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar bg-[#F8F9FA]">
            {/* Header info */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#DADCE0] shadow-sm">
                    <Code2 className="w-6 h-6 text-[#1A73E8]" />
                </div>
                <div>
                    <h3 className="text-xl font-medium text-[#202124]">Developer API Integration</h3>
                    <p className="text-sm text-[#5F6368]">Connect your applications to InstantRAG semantic capabilities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Integration Details Left */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 border border-[#DADCE0] rounded-2xl shadow-sm">
                        <h4 className="text-sm font-medium text-[#202124] mb-3">Endpoint Details</h4>
                        <p className="text-sm text-[#5F6368] leading-relaxed mb-5">
                            You can easily integrate InstantRAG's semantic search bridges directly into your own frontend or application without building any backends.
                        </p>
                        
                        <div className="space-y-3">
                            <div className="p-3 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl flex items-center gap-3">
                                <span className="bg-[#E6F4EA] text-[#137333] px-2 py-0.5 rounded text-xs font-bold">POST</span>
                                <span className="font-mono text-sm text-[#3C4043]">/chat/{"{namespace}"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick guidelines */}
                    <div className="bg-white p-6 border border-[#DADCE0] text-sm text-[#5F6368] space-y-4 rounded-2xl shadow-sm">
                        <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
                            <p>All endpoints accept a JSON body containing a <code className="bg-[#F1F3F4] text-[#202124] px-1.5 py-0.5 rounded">query</code> string parameter.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
                            <p>Responses return parsed semantic text snippets retrieved from Pinecone alongside the Gemini response.</p>
                        </div>
                    </div>
                </div>

                {/* Code editor previewer right */}
                <div className="lg:col-span-2">
                    <div className="border border-[#DADCE0] flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Tab selectors */}
                        <div className="flex items-center justify-between px-2 bg-[#F8F9FA] border-b border-[#DADCE0]">
                            <div className="flex">
                                {['javascript', 'python', 'curl'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setActiveLang(lang);
                                            setCopied(false);
                                        }}
                                        className={`px-6 py-3.5 text-sm font-medium transition-all border-b-2 ${
                                            activeLang === lang
                                                ? 'border-[#1A73E8] text-[#1A73E8] bg-white'
                                                : 'border-transparent text-[#5F6368] hover:bg-black/5 hover:text-[#202124]'
                                        }`}
                                    >
                                        {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={copyCode}
                                className="mr-4 px-4 py-1.5 flex items-center gap-2 border border-[#DADCE0] hover:bg-[#F1F3F4] rounded-md text-[#5F6368] hover:text-[#202124] transition-colors text-sm font-medium"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-[#34A853]" />
                                        <span className="text-[#34A853]">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy Code</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Code snippet display */}
                        <div className="p-6 overflow-x-auto max-h-[400px] custom-scrollbar bg-white">
                            <pre className="text-[13px] font-mono text-[#3C4043] leading-[1.6]">
                                <code>{codeSnippets[activeLang]}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
