'use client';

import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactionBar, { Reaction } from './ReactionBar';
import './MessageBubble.css';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    messageId: string;
    reactions: Reaction[];
    onReact: (messageId: string, emoji: string) => void;
}

export default function MessageBubble({ role, content, messageId, reactions, onReact }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <ReactionBar
            reactions={reactions}
            onReact={(emoji) => onReact(messageId, emoji)}
        >
            <div className={`message ${isUser ? 'message--user' : 'message--ai'}`}>
                <div className="message__avatar">
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="message__content">
                    <div className="message__role">
                        {isUser ? 'あなた' : 'AI Chatbot'}
                    </div>
                    <div className="message__body">
                        {isUser ? (
                            <p>{content}</p>
                        ) : (
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ReactionBar>
    );
}
