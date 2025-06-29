// src/components/modals/InfoModal.jsx
import React from 'react';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const InfoModal = ({ isOpen, onClose, title, image, message, buttonText }) => {
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-t-2 md:border-2 border-orange-500 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-lg max-h-[85vh] md:h-auto"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* 2. Заменяем старый блок кода на наш новый компонент */}
                <ModalDragHandle />

                <div className="flex-grow overflow-y-auto pr-2">
                    <h2 className="font-cinzel text-3xl text-center text-orange-400 text-shadow-glow mb-4">
                        {title}
                    </h2>
                    {image && (
                        <img src={image} alt={title} className="mx-auto my-4 max-h-48 object-contain rounded-lg border border-gray-700" />
                    )}
                    <p className="text-gray-300 mb-6">{message}</p>
                </div>
                
                <Button onClick={onClose} className="mt-4 flex-shrink-0">
                    {buttonText || "Закрыть"}
                </Button>
            </div>
        </div>
    );
};

export default InfoModal;