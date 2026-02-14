'use client';

import { useState, useCallback } from 'react';
import { ChatThread } from '@/lib/types';

export function useChatThreads() {
    const [threads, setThreads] = useState<ChatThread[]>([
        {
            id: 'default',
            title: '新しいチャット',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]);
    const [activeThreadId, setActiveThreadId] = useState('default');

    const createThread = useCallback(() => {
        const newThread: ChatThread = {
            id: Date.now().toString(),
            title: '新しいチャット',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(newThread.id);
        return newThread.id;
    }, []);

    const deleteThread = useCallback(
        (threadId: string) => {
            setThreads((prev) => {
                const filtered = prev.filter((t) => t.id !== threadId);
                if (filtered.length === 0) {
                    const newThread: ChatThread = {
                        id: Date.now().toString(),
                        title: '新しいチャット',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    setActiveThreadId(newThread.id);
                    return [newThread];
                }
                if (activeThreadId === threadId) {
                    setActiveThreadId(filtered[0].id);
                }
                return filtered;
            });
        },
        [activeThreadId]
    );

    const updateThreadTitle = useCallback((threadId: string, title: string) => {
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId ? { ...t, title, updatedAt: new Date() } : t
            )
        );
    }, []);

    return {
        threads,
        activeThreadId,
        setActiveThreadId,
        createThread,
        deleteThread,
        updateThreadTitle,
    };
}
