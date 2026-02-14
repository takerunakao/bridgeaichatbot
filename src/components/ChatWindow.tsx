'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from 'ai/react';
import { Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import StampMessage from './StampMessage';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { Reaction } from './ReactionBar';
import './ChatWindow.css';

interface ChatWindowProps {
    threadId: string;
    onFirstMessage: (title: string) => void;
    onMenuClick: () => void;
}

// Stamp messages stored locally (not sent to AI)
interface StampItem {
    id: string;
    stamp: string;
    role: 'user' | 'assistant';
    afterMessageIndex: number; // insert after this message index
}

export default function ChatWindow({
    threadId,
    onFirstMessage,
    onMenuClick,
}: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasSetTitle = useRef(false);
    const [selectedModel, setSelectedModel] = useState('gpt-5.2');
    const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
    const [stamps, setStamps] = useState<StampItem[]>([]);

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append } =
        useChat({
            id: threadId,
            api: '/api/chat',
            body: { model: selectedModel },
        });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, stamps]);

    // Set thread title from first user message
    useEffect(() => {
        if (
            messages.length === 1 &&
            messages[0].role === 'user' &&
            !hasSetTitle.current
        ) {
            hasSetTitle.current = true;
            const title =
                messages[0].content.length > 30
                    ? messages[0].content.slice(0, 30) + '...'
                    : messages[0].content;
            onFirstMessage(title);
        }
    }, [messages, onFirstMessage]);

    // Reset state when thread changes
    useEffect(() => {
        hasSetTitle.current = false;
        setReactions({});
        setStamps([]);
    }, [threadId]);

    // Handle reaction toggle
    const handleReact = useCallback((messageId: string, emoji: string) => {
        setReactions((prev) => {
            const msgReactions = [...(prev[messageId] || [])];
            const existing = msgReactions.findIndex((r) => r.emoji === emoji);
            if (existing >= 0) {
                if (msgReactions[existing].count <= 1) {
                    msgReactions.splice(existing, 1);
                } else {
                    msgReactions[existing] = {
                        ...msgReactions[existing],
                        count: msgReactions[existing].count - 1,
                    };
                }
            } else {
                msgReactions.push({ emoji, count: 1 });
            }
            return { ...prev, [messageId]: msgReactions };
        });
    }, []);

    // Handle stamp send
    const handleStampSend = useCallback((stamp: string) => {
        const stampItem: StampItem = {
            id: `stamp-${Date.now()}`,
            stamp,
            role: 'user',
            afterMessageIndex: messages.length - 1,
        };
        setStamps((prev) => [...prev, stampItem]);

        // Send as a text message to AI so it can react
        append({
            role: 'user',
            content: `[スタンプ: ${stamp}]`,
        });
    }, [messages.length, append]);

    // Build render list: interleave messages and stamps
    const renderItems: Array<
        { type: 'message'; message: typeof messages[0] } |
        { type: 'stamp'; stamp: StampItem }
    > = [];

    let stampIdx = 0;
    messages.forEach((msg, i) => {
        renderItems.push({ type: 'message', message: msg });
        // Insert any stamps that belong after this message
        while (stampIdx < stamps.length && stamps[stampIdx].afterMessageIndex === i) {
            renderItems.push({ type: 'stamp', stamp: stamps[stampIdx] });
            stampIdx++;
        }
    });
    // Remaining stamps
    while (stampIdx < stamps.length) {
        renderItems.push({ type: 'stamp', stamp: stamps[stampIdx] });
        stampIdx++;
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <header className="chat-window__header">
                <button className="chat-window__menu-btn" onClick={onMenuClick}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div className="chat-window__header-title">
                    <Sparkles size={18} />
                    <span>AI Chatbot -Bridge to Practice Challenge-</span>
                </div>
                <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </header>

            {/* Messages */}
            <div className="chat-window__messages" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="chat-window__empty">
                        <div className="chat-window__empty-icon">
                            <Sparkles size={48} />
                        </div>
                        <h2>AI Chatbot へようこそ</h2>
                        <p>何でも聞いてください。コーディング、文章作成、アイデア出しなど、お手伝いします。</p>
                        <div className="chat-window__suggestions">
                            {[
                                '🚀 プログラミングの質問をする',
                                '📝 文章の作成・添削を頼む',
                                '💡 新しいアイデアを一緒に考える',
                                '🔍 複雑なトピックを解説してもらう',
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    className="chat-window__suggestion"
                                    onClick={() => {
                                        const text = suggestion.replace(/^[^\s]+\s/, '');
                                        handleInputChange({
                                            target: { value: text },
                                        } as React.ChangeEvent<HTMLTextAreaElement>);
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="chat-window__message-list">
                        {renderItems.map((item) => {
                            if (item.type === 'stamp') {
                                return (
                                    <StampMessage
                                        key={item.stamp.id}
                                        stamp={item.stamp.stamp}
                                        role={item.stamp.role}
                                    />
                                );
                            }
                            const msg = item.message;
                            // Skip stamp text messages from display (show the visual stamp instead)
                            if (msg.role === 'user' && msg.content.startsWith('[スタンプ:')) {
                                return null;
                            }
                            return (
                                <MessageBubble
                                    key={msg.id}
                                    messageId={msg.id}
                                    role={msg.role as 'user' | 'assistant'}
                                    content={msg.content}
                                    reactions={reactions[msg.id] || []}
                                    onReact={handleReact}
                                />
                            );
                        })}
                        {isLoading &&
                            messages[messages.length - 1]?.role !== 'assistant' && (
                                <div className="message message--ai">
                                    <div className="message__avatar">
                                        <Sparkles size={18} />
                                    </div>
                                    <div className="message__content">
                                        <div className="message__role">AI Chatbot</div>
                                        <div className="message__loading">
                                            <span className="message__loading-dot" />
                                            <span className="message__loading-dot" />
                                            <span className="message__loading-dot" />
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput
                input={input}
                onInputChange={(v) =>
                    handleInputChange({
                        target: { value: v },
                    } as React.ChangeEvent<HTMLTextAreaElement>)
                }
                onSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                onStampSend={handleStampSend}
            />
        </div>
    );
}
