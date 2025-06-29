// src/components/ui/modals/SpecializationModal.jsx
import React from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { useDraggableModal } from '../../../hooks/useDraggableModal.js';
import ModalDragHandle from '../display/ModalDragHandle.jsx';

const SpecializationCard = ({ spec, onSelect }) => (
    <div className="flex flex-col text-center p-4 border-2 border-gray-700 rounded-lg bg-black/20 h-full">
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


const SpecializationModal = ({ onSelectSpecialization, onClose }) => {
    const { touchHandlers } = useDraggableModal(onClose);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-t-2 md:border-2 border-orange-500 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-4xl h-[85vh] md:h-auto"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="text-center flex-shrink-0">
                    <h2 className="font-cinzel text-3xl text-orange-400 text-shadow-glow mb-2">Время Выбора</h2>
                    <p className="text-gray-400 mb-6">Вы изучили основы работы с медью. Теперь пора определить свой путь.<br/>Этот выбор **необратим** и определит ваши уникальные возможности в будущем.</p>
                </div>
                <div className="grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                        {Object.values(definitions.specializations).map(spec => (
                            <SpecializationCard key={spec.id} spec={spec} onSelect={onSelectSpecialization} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecializationModal;