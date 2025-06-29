// src/components/modals/CreditsModal.jsx
import React from 'react';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const CreditsModal = ({ isOpen, onClose }) => {
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-t-2 md:border-2 border-gray-700 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-2xl h-[85vh] md:max-h-[90vh]"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-cinzel text-2xl text-orange-400">Благодарности и Авторы</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2 text-gray-300 text-sm leading-relaxed">
                    <p className="mb-4">Мы выражаем огромную благодарность следующим авторам за их вклад в создание атмосферы Forge & Artifacts:</p>
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Музыкальные Треки (Pixabay Content License)</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li>"Cithare Medieval 1" by LioN_X</li>
                        <li>"Fantasy Medieval Ambient" by Coma-Media</li>
                        <li>"Fantasy Medieval Mystery Ambient" by Coma-Media</li>
                        <li>"Medieval Ambient" by RomanBelov</li>
                        <li>"Medieval Background" by Music_Unlimited</li>
                        <li>"Medieval Background" by Coma-Media</li>
                        <li>"Medieval City Tavern Ambient" by Music_Unlimited</li>
                        <li>"Medieval Track" by RomanBelov</li>
                        <li>"The Ballad of My Sweet Fair Maiden" by Lexin_Music</li>
                    </ul>
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Иконки и Ассеты</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li>Material Icons Outlined by Google</li>
                        <li>Изображения-заглушки (Placeholders) от Placehold.co</li>
                    </ul>
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Разработка</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li>Игра разработана: [Ваше Имя / Название Студии]</li>
                        <li>Инструменты: React, Vite, Tailwind CSS, Tone.js</li>
                        <li>Особая благодарность: Модели Gemini за помощь в разработке.</li>
                    </ul>
                </div>

                <Button onClick={onClose} className="mt-6 flex-shrink-0 hidden md:block">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default CreditsModal;