'use client';

import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { ChatThread } from '@/lib/types';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

interface SidebarProps {
    threads: ChatThread[];
    activeThreadId: string;
    onSelectThread: (id: string) => void;
    onCreateThread: () => void;
    onDeleteThread: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({
    threads,
    activeThreadId,
    onSelectThread,
    onCreateThread,
    onDeleteThread,
    isOpen,
    onClose,
}: SidebarProps) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar__header">
                    <div className="sidebar__logo">
                        <div className="sidebar__logo-icon">B</div>
                        <span className="sidebar__logo-text">AI Chatbot</span>
                    </div>
                    <button className="sidebar__close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <button className="sidebar__new-chat" onClick={onCreateThread}>
                    <Plus size={18} />
                    <span>新しいチャット</span>
                </button>

                <div className="sidebar__threads">
                    {threads.map((thread) => (
                        <div
                            key={thread.id}
                            className={`sidebar__thread ${thread.id === activeThreadId ? 'active' : ''
                                }`}
                            onClick={() => onSelectThread(thread.id)}
                        >
                            <MessageSquare size={16} />
                            <span className="sidebar__thread-title">{thread.title}</span>
                            <button
                                className="sidebar__thread-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteThread(thread.id);
                                }}
                                aria-label="チャットを削除"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="sidebar__footer">
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}
