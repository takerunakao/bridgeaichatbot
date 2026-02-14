'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import './StampPicker.css';

const STAMP_CATEGORIES = [
    {
        id: 'popular',
        label: '人気',
        icon: '⭐',
        stamps: ['👍', '❤️', '😂', '🎉', '🔥', '✨', '💯', '🙏', '😊', '🥰', '👏', '💪'],
    },
    {
        id: 'faces',
        label: '顔',
        icon: '😀',
        stamps: ['😀', '😃', '😄', '😁', '😆', '🤣', '😂', '🙂', '😉', '😍', '🥳', '😎', '🤔', '😴', '😱', '🥺', '😤', '🤯', '😇', '🤩'],
    },
    {
        id: 'hands',
        label: '手',
        icon: '👋',
        stamps: ['👋', '👍', '👎', '👏', '🤝', '✌️', '🤞', '🤟', '🤘', '💪', '🙌', '🙏', '✍️', '🫶', '👊', '✊'],
    },
    {
        id: 'animals',
        label: '動物',
        icon: '🐱',
        stamps: ['🐱', '🐶', '🐻', '🐼', '🦊', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦄', '🐝', '🦋'],
    },
    {
        id: 'food',
        label: '食べ物',
        icon: '🍔',
        stamps: ['🍔', '🍕', '🍣', '🍜', '🍩', '🍰', '🍎', '☕', '🍺', '🥂', '🍙', '🍱', '🍪', '🍫', '🧁', '🍓'],
    },
    {
        id: 'activity',
        label: '活動',
        icon: '⚽',
        stamps: ['⚽', '🏀', '🎾', '🎯', '🎮', '🎸', '🎨', '📸', '✈️', '🚀', '💻', '📱', '📚', '🎬', '🏆', '🎵'],
    },
    {
        id: 'symbols',
        label: '記号',
        icon: '💡',
        stamps: ['💡', '⚡', '🌟', '💫', '🌈', '☀️', '🌙', '❄️', '💝', '💖', '🏁', '🚩', '✅', '❌', '⭕', '❓'],
    },
];

interface StampPickerProps {
    onStampSelect: (stamp: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function StampPicker({ onStampSelect, isOpen, onClose }: StampPickerProps) {
    const [activeCategory, setActiveCategory] = useState('popular');
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const currentCategory = STAMP_CATEGORIES.find((c) => c.id === activeCategory) || STAMP_CATEGORIES[0];

    return (
        <div className="stamp-picker" ref={pickerRef}>
            <div className="stamp-picker__header">
                <span className="stamp-picker__title">スタンプ</span>
            </div>
            <div className="stamp-picker__grid">
                {currentCategory.stamps.map((stamp, i) => (
                    <button
                        key={`${stamp}-${i}`}
                        className="stamp-picker__stamp"
                        onClick={() => {
                            onStampSelect(stamp);
                            onClose();
                        }}
                        aria-label={stamp}
                    >
                        {stamp}
                    </button>
                ))}
            </div>
            <div className="stamp-picker__categories">
                {STAMP_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`stamp-picker__cat-btn ${cat.id === activeCategory ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                        title={cat.label}
                    >
                        {cat.icon}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* Trigger button for external use */
export function StampTrigger({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="stamp-trigger"
            onClick={onClick}
            aria-label="スタンプを選択"
            title="スタンプ"
        >
            <Smile size={20} />
        </button>
    );
}
