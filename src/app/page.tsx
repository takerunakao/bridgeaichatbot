'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { useChatThreads } from '@/hooks/useChatThreads';

export default function Home() {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    createThread,
    deleteThread,
    updateThreadTitle,
  } = useChatThreads();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFirstMessage = useCallback(
    (title: string) => {
      updateThreadTitle(activeThreadId, title);
    },
    [activeThreadId, updateThreadTitle]
  );

  const handleSelectThread = useCallback(
    (id: string) => {
      setActiveThreadId(id);
      setSidebarOpen(false);
    },
    [setActiveThreadId]
  );

  const handleCreateThread = useCallback(() => {
    createThread();
    setSidebarOpen(false);
  }, [createThread]);

  return (
    <div className="app-container">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onCreateThread={handleCreateThread}
        onDeleteThread={deleteThread}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatWindow
        key={activeThreadId}
        threadId={activeThreadId}
        onFirstMessage={handleFirstMessage}
        onMenuClick={() => setSidebarOpen(true)}
      />
    </div>
  );
}
