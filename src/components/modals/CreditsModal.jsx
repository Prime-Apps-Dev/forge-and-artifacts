// src/components/modals/CreditsModal.jsx

import React from 'react';

const CreditsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">Благодарности и Авторы</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2 text-gray-300 text-sm leading-relaxed">
                    <p className="mb-4">Мы выражаем огромную благодарность следующим авторам за их вклад в создание атмосферы Forge & Artifacts:</p>

                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Музыкальные Треки (Pixabay Content License)</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li>
                            <strong>"Cithare Medieval 1"</strong> by LioN_X (<a href="https://pixabay.com/music/acoustic-guitars-cithare-medieval-1-307558/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Fantasy Medieval Ambient"</strong> by Coma-Media (<a href="https://pixabay.com/music/ambient-fantasy-medieval-ambient-237371/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Fantasy Medieval Mystery Ambient"</strong> by Coma-Media (<a href="https://pixabay.com/music/ambient-fantasy-medieval-mystery-ambient-292418/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Medieval Ambient"</strong> by RomanBelov (<a href="https://pixabay.com/music/ambient-medieval-ambient-236809/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Medieval Background"</strong> by Music_Unlimited (<a href="https://pixabay.com/music/medieval-background-196571/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Medieval Background"</strong> by Coma-Media (<a href="https://pixabay.com/music/meditation-medieval-background-351307/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Medieval City Tavern Ambient"</strong> by Music_Unlimited (<a href="https://pixabay.com/music/city-medieval-citytavern-ambient-235876/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"Medieval Track"</strong> by RomanBelov (<a href="https://pixabay.com/music/classical-medieval-track-161051/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>"The Ballad of My Sweet Fair Maiden (Medieval style music)"</strong> by Lexin_Music (<a href="https://pixabay.com/music/country-folk-the-ballad-of-my-sweet-fair-maiden-medieval-style-music-358306/" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                    </ul>

                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Иконки и Ассеты</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li>
                            <strong>Material Icons Outlined</strong> by Google (<a href="https://fonts.google.com/icons" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                        <li>
                            <strong>Изображения-заглушки (Placeholders)</strong> от Placehold.co (<a href="https://placehold.co" className="text-blue-400 hover:underline">Перейти к источнику</a>)
                        </li>
                    </ul>

                    <h3 className="font-cinzel text-xl text-yellow-400 mb-2">Разработка</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                        <li><strong>Игра разработана:</strong> Prime Games</li>
                        <li><strong>Инструменты:</strong> React, Vite, Tailwind CSS, Tone.js</li>
                        <li><strong>Изображения:</strong> Recraft.ai</li>
                        <li><strong>Особая благодарность:</strong> Модели Gemini за помощь в разработке.</li>
                    </ul>

                    <p className="text-gray-400 italic mt-6">
                        Вся музыка, используемая в игре, лицензирована под Pixabay Content License. <br/>
                        Полную информацию о лицензировании ищите на сайте Pixabay.
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="interactive-element mt-6 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default CreditsModal;