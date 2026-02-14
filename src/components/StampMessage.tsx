'use client';

import './StampMessage.css';

interface StampMessageProps {
    stamp: string;
    role: 'user' | 'assistant';
}

export default function StampMessage({ stamp, role }: StampMessageProps) {
    return (
        <div className={`stamp-msg ${role === 'user' ? 'stamp-msg--user' : 'stamp-msg--ai'}`}>
            <div className="stamp-msg__emoji">{stamp}</div>
        </div>
    );
}
