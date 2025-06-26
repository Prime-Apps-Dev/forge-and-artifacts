// src/components/modals/InfoModal.jsx
import React from 'react';
import Button from '../ui/buttons/Button.jsx';

const InfoModal = ({ isOpen, onClose, title, image, message, buttonText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-orange-500 rounded-lg shadow-2xl p-8 w-full max-w-lg text-center modal-content"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-cinzel text-3xl text-center text-orange-400 text-shadow-glow mb-4">
                    {title}
                </h2>
                {image && (
                    <img src={image} alt={title} className="mx-auto my-4 max-h-48 object-contain rounded-lg border border-gray-700" />
                )}
                <p className="text-gray-300 mb-6">{message}</p>

                <Button onClick={onClose} className="mt-4">
                    {buttonText || "Закрыть"}
                </Button>
            </div>
        </div>
    );
};

export default InfoModal;