'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { SmilePlus } from 'lucide-react';
import './ReactionBar.css';

const QUICK_REACTIONS = ['👍', '😊', '🎉', '❤️', '😂', '🔥'];

const MORE_REACTIONS = ['💯', '👏', '🤔', '😮', '😢', '✨', '🙏', '💪', '⭐', '🚀', '🎯', '💡'];

export interface Reaction {
    emoji: string;
    count: number;
}

interface ReactionBarProps {
    reactions: Reaction[];
    onReact: (emoji: string) => void;
    children: ReactNode;
}

export default function ReactionBar({ reactions, onReact, children }: ReactionBarProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showBar, setShowBar] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPicker]);

    return (
        <div
            className="reaction-zone"
            onMouseEnter={() => setShowBar(true)}
            onMouseLeave={() => {
                if (!showPicker) setShowBar(false);
            }}
        >
            {/* Message content */}
            {children}

            {/* Hover reaction bar */}
            {showBar && (
                <div className="reaction-bar">
                    {QUICK_REACTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            className="reaction-bar__btn"
                            onClick={() => onReact(emoji)}
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    ))}
                    <div className="reaction-bar__divider" />
                    <button
                        className="reaction-bar__btn reaction-bar__btn--more"
                        onClick={() => setShowPicker(!showPicker)}
                        title="その他のリアクション"
                    >
                        <SmilePlus size={16} />
                    </button>
                </div>
            )}

            {/* Extended picker */}
            {showPicker && (
                <div className="reaction-picker" ref={pickerRef}>
                    {MORE_REACTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            className="reaction-picker__btn"
                            onClick={() => {
                                onReact(emoji);
                                setShowPicker(false);
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Displayed reactions */}
            {reactions.length > 0 && (
                <div className="reaction-badges">
                    {reactions.map((r) => (
                        <button
                            key={r.emoji}
                            className="reaction-badge"
                            onClick={() => onReact(r.emoji)}
                            title={`${r.emoji} ${r.count}`}
                        >
                            <span className="reaction-badge__emoji">{r.emoji}</span>
                            <span className="reaction-badge__count">{r.count}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
