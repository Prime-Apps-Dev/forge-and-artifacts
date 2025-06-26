// src/components/ui/SpecializationModal.jsx
import React from 'react';
import { definitions } from '../../../data/definitions/index.js';

const SpecializationCard = ({ spec, onSelect }) => (
    <div className="flex flex-col text-center p-4 border-2 border-gray-700 rounded-lg bg-black/20">
        <span className="material-icons-outlined text-5xl text-orange-400 mx-auto mb-3">{spec.icon}</span>
        <h3 className="font-cinzel text-xl mb-2">{spec.name}</h3>
        <p className="text-gray-400 text-sm grow mb-4">{spec.description}</p>
        <button
            onClick={() => onSelect(spec.id)}
            className="interactive-element mt-auto w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500"
        >
            Выбрать
        </button>
    </div>
);


const SpecializationModal = ({ onSelectSpecialization }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop">
            <div className="bg-gray-900 border-2 border-orange-500 rounded-lg shadow-2xl p-8 w-full max-w-4xl modal-content">
                <h2 className="font-cinzel text-3xl text-center text-orange-400 text-shadow-glow mb-2">Время Выбора</h2>
                <p className="text-center text-gray-400 mb-6">Вы изучили основы работы с медью. Теперь пора определить свой путь.<br/>Этот выбор **необратим** и определит ваши уникальные возможности в будущем.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.values(definitions.specializations).map(spec => (
                        <SpecializationCard key={spec.id} spec={spec} onSelect={onSelectSpecialization} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecializationModal;