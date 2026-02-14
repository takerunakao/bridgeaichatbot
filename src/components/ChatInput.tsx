'use client';

import { useRef, useEffect, useState, FormEvent, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import StampPicker, { StampTrigger } from './StampPicker';
import './ChatInput.css';

interface ChatInputProps {
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    stop: () => void;
    onStampSend: (stamp: string) => void;
}

export default function ChatInput({
    input,
    onInputChange,
    onSubmit,
    isLoading,
    stop,
    onStampSend,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [stampPickerOpen, setStampPickerOpen] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200
            )}px`;
        }
    }, [input]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                const form = e.currentTarget.closest('form');
                if (form) {
                    form.requestSubmit();
                }
            }
        }
    };

    return (
        <div className="chat-input__wrapper">
            <div className="chat-input__relative">
                <StampPicker
                    isOpen={stampPickerOpen}
                    onClose={() => setStampPickerOpen(false)}
                    onStampSelect={onStampSend}
                />
                <form className="chat-input" onSubmit={onSubmit}>
                    <div className="chat-input__container">
                        <StampTrigger onClick={() => setStampPickerOpen(!stampPickerOpen)} />
                        <textarea
                            ref={textareaRef}
                            className="chat-input__textarea"
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="メッセージを入力..."
                            rows={1}
                            disabled={isLoading}
                        />
                        {isLoading ? (
                            <button
                                type="button"
                                className="chat-input__btn chat-input__btn--stop"
                                onClick={stop}
                                aria-label="生成を停止"
                            >
                                <Loader2 size={20} className="spin" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="chat-input__btn chat-input__btn--send"
                                disabled={!input.trim()}
                                aria-label="送信"
                            >
                                <Send size={18} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <p className="chat-input__hint">
                Shift + Enter で改行 · Enter で送信 · 😊 でスタンプ
            </p>
        </div>
    );
}
