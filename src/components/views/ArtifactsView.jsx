import React from 'react';
import { definitions } from '../../data/definitions';
import SvgIcon from '../ui/display/SvgIcon'; // Обновленный путь
import ArtifactCard from '../ui/cards/ArtifactCard'; // Обновленный путь
import Tooltip from '../ui/display/Tooltip'; // Обновленный путь

const ArtifactsView = ({ gameState, handlers }) => {
    return (
         <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">auto_stories</span> Великие Артефакты
            </h2>
             <p className="text-gray-400 mb-6">Вершина кузнечного искусства. Создание этих предметов изменит вашу судьбу и принесет вечную славу.</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(gameState.artifacts).map(([id, artifact]) => (
                    <ArtifactCard
                        key={id}
                        id={id}
                        artifact={artifact}
                        onCraftArtifact={handlers.handleCraftArtifact}
                        isFirstPlaythrough={gameState.isFirstPlaythrough}
                    />
                ))}
             </div>
        </div>
    );
};

export default ArtifactsView;