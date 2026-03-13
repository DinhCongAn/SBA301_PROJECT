import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/aiApi';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Chào bạn! Mình là AI của MiniMart. Bạn muốn mua nguyên liệu nấu món gì hôm nay?' }
    ]);
    
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Hiện tin nhắn của user
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // 2. Gọi API thật xuống Spring Boot
        const aiReply = await sendChatMessage(userMsg);

        // 3. Hiện câu trả lời của AI
        setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            
            {/* Cửa sổ Chat */}
            <div className={`absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white flex justify-between items-center shadow-md">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <i className="fas fa-robot text-emerald-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-wide">MiniMart AI</h3>
                            <div className="flex items-center text-[10px] text-emerald-100">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> Online
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Khu vực tin nhắn */}
                <div className="h-96 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    
                    {/* Hiệu ứng gõ chữ */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-2 items-center">
                                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Ô nhập liệu */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder="VD: Mình muốn nấu canh chua..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-full px-4 py-2.5 text-sm outline-none transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600"
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {/* Nút bấm nổi (Floating Button) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-emerald-600 hover:scale-110 transition-transform duration-300 relative group"
            >
                {/* Gợi ý bay lơ lửng */}
                {!isOpen && (
                    <span className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        Cần tư vấn mua sắm?
                        <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                    </span>
                )}
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
            </button>

        </div>
    );
};

export default AIChatbot;