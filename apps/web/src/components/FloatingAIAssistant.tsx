'use client';

import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function FloatingAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            if (!response.ok) {
                console.error('API Error', await response.text());
                throw new Error('API request failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
                toolInvocations: [] as any[]
            };
            setMessages(prev => [...prev, assistantMsg]);

            if (reader) {
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (!line.trim() || !line.startsWith('data:')) continue;
                        try {
                            const jsonStr = line.replace(/^data:\s*/, '');
                            if (jsonStr === '[DONE]') break;
                            const parsed = JSON.parse(jsonStr);

                            if (parsed.type === 'text-delta') {
                                assistantMsg.content += parsed.delta;
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantMsg.id ? { ...assistantMsg } : m
                                ));
                            }
                            else if (parsed.type === 'tool-call' && parsed.toolName === 'addToCart') {
                                assistantMsg.toolInvocations.push({
                                    toolCallId: parsed.toolCallId,
                                    toolName: parsed.toolName,
                                    args: parsed.args,
                                    state: 'result'
                                });
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantMsg.id ? { ...assistantMsg } : m
                                ));
                            }
                            // ✅ Khi search tìm được thuốc, tự render card luôn
                            else if (parsed.type === 'tool-output-available') {
                                if (parsed.output && parsed.output.length > 0) {
                                    const firstProduct = parsed.output[0];
                                    assistantMsg.toolInvocations.push({
                                        toolCallId: parsed.toolCallId,
                                        toolName: 'addToCart',
                                        args: {
                                            product_id: firstProduct.id,
                                            product_name: firstProduct.name,
                                        },
                                        state: 'result'
                                    });
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantMsg.id ? { ...assistantMsg } : m
                                    ));
                                }
                            }
                        } catch (e) { }
                    }
                }
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Lỗi kết nối Server AI.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = useCartStore(state => state.addToCart);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-6 z-50 bg-gradient-to-r from-teal-400 to-[#2b8cee] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white flex items-center justify-center animate-bounce duration-1000"
                title="Trợ lý Y khoa AI"
            >
                <span className="material-symbols-outlined text-[28px]">robot_2</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-28 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col items-stretch h-[500px] animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#2b8cee] to-[#1e66b3] text-white flex items-center justify-between shadow-md z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <span className="material-symbols-outlined">robot_2</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-[15px] leading-tight text-white mb-0.5">Trợ Lý AI MedPro</h3>
                        <p className="text-[11px] text-white/80 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                            Trực tuyến 24/7
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 mt-10">
                        <span className="material-symbols-outlined text-5xl mb-3 opacity-20 text-[#2b8cee]">volunteer_activism</span>
                        <p className="text-sm font-medium px-4 text-slate-500">Xin chào! Bác sĩ AI đang lắng nghe triệu chứng của bạn. Hãy nói cho tôi biết bạn đang cảm thấy thế nào?</p>
                    </div>
                )}

                {messages.map((m: any) => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`
                            max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed
                            ${m.role === 'user'
                                ? 'bg-[#2b8cee] text-white rounded-br-sm shadow-md shadow-[#2b8cee]/20 border border-[#2070c5]'
                                : 'bg-white text-slate-700 shadow-sm border border-slate-200 rounded-bl-sm'}
                        `}>
                            {m.content || (m.toolInvocations?.length > 0
                                ? null
                                : <span className="text-xs italic text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] animate-spin">search</span>
                                    Đang tìm cơ sở dữ liệu thuốc...
                                </span>
                            )}
                        </div>

                        {m.toolInvocations?.map((toolInvocation: any) => {
                            if (toolInvocation.toolName === 'addToCart' && toolInvocation.state === 'result') {
                                const { product_id, product_name } = toolInvocation.args;
                                return (
                                    <div key={toolInvocation.toolCallId} className="mt-2 bg-white border-2 border-green-100 p-3 rounded-xl shadow-sm w-[85%] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">prescriptions</span>
                                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{product_name}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart({ id: product_id, name: product_name, quantity: 1 });
                                                setIsOpen(false);
                                            }}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-md shadow-green-500/20 active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                                            Thêm vào toa thuốc
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-1 text-[#2b8cee] ml-2 mt-2 bg-white w-fit px-3 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <span className="w-1.5 h-1.5 bg-[#2b8cee] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#2b8cee] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 bg-[#2b8cee] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                    name="prompt"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="VD: Sốt cao, sổ mũi..."
                    className="flex-1 bg-slate-100 text-slate-900 px-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/30 placeholder:text-slate-400 border border-transparent transition-all"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input?.trim()}
                    className="w-10 h-10 rounded-2xl bg-[#2b8cee] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#2070c5] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#2b8cee]/20"
                >
                    <span className="material-symbols-outlined text-[20px] ml-1">send</span>
                </button>
            </form>
        </div>
    );
}