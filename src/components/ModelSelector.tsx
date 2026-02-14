'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import './ModelSelector.css';

export interface ModelOption {
    id: string;
    label: string;
    description: string;
    tag?: 'latest' | 'legacy';
}

const MODELS: ModelOption[] = [
    {
        id: 'gpt-5.2',
        label: 'GPT-5.2',
        description: '最新フラッグシップ・コーディング特化',
        tag: 'latest',
    },
    {
        id: 'gpt-5.1',
        label: 'GPT-5.1',
        description: '高性能・安定版',
        tag: 'latest',
    },
    {
        id: 'gpt-5',
        label: 'GPT-5',
        description: 'マルチモーダル・256Kコンテキスト',
    },
    {
        id: 'gpt-4.1',
        label: 'GPT-4.1',
        description: 'ロングコンテキスト・開発向け',
    },
    {
        id: 'gpt-4o',
        label: 'GPT-4o',
        description: 'マルチモーダル（2026年2月廃止予定）',
        tag: 'legacy',
    },
    {
        id: 'o4-mini',
        label: 'o4-mini',
        description: 'STEM推論・コスト効率',
    },
    {
        id: 'o3-mini',
        label: 'o3-mini',
        description: '推論特化・軽量',
        tag: 'legacy',
    },
];

interface ModelSelectorProps {
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
    selectedModel,
    onModelChange,
}: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="model-selector" ref={dropdownRef}>
            <button
                className={`model-selector__trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="モデルを選択"
            >
                <Cpu size={14} />
                <span>{currentModel.label}</span>
                <ChevronDown size={14} className={`model-selector__chevron ${isOpen ? 'rotated' : ''}`} />
            </button>

            {isOpen && (
                <div className="model-selector__dropdown">
                    <div className="model-selector__dropdown-header">モデルを選択</div>
                    {MODELS.map((model) => (
                        <button
                            key={model.id}
                            className={`model-selector__option ${model.id === selectedModel ? 'selected' : ''
                                }`}
                            onClick={() => {
                                onModelChange(model.id);
                                setIsOpen(false);
                            }}
                        >
                            <div className="model-selector__option-info">
                                <div className="model-selector__option-name">
                                    {model.label}
                                    {model.tag && (
                                        <span className={`model-selector__tag model-selector__tag--${model.tag}`}>
                                            {model.tag === 'latest' ? '最新' : 'レガシー'}
                                        </span>
                                    )}
                                </div>
                                <div className="model-selector__option-desc">{model.description}</div>
                            </div>
                            {model.id === selectedModel && (
                                <div className="model-selector__check">✓</div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
