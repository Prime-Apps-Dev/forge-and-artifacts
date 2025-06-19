import React from 'react';
import { definitions } from '../../data/definitions';
import SvgIcon from '../ui/SvgIcon';
import ArtifactCard from '../ui/ArtifactCard';
import Tooltip from '../ui/Tooltip';

const ArtifactsView = ({ gameState, handlers }) => {
    return (
         <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">auto_stories</span> Великие Артефакты
            </h2>
             {/* ИЗМЕНЕНИЕ: УДАЛЕНО сообщение о блокировке артефактов */}
             {/* {gameState.isFirstPlaythrough && (
                 <p className="text-red-400 mb-6 font-bold">
                    Создание Великих Артефактов доступно только после первого Переселения!
                    (Рецепты упрощены для первого прохождения, чтобы вы могли освоиться.)
                 </p>
             )} */}
             {/* ИЗМЕНЕНИЕ: Теперь это всегда общее описание */}
             <p className="text-gray-400 mb-6">Вершина кузнечного искусства. Создание этих предметов изменит вашу судьбу и принесет вечную славу.</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(gameState.artifacts).map(([id, artifact]) => (
                    <ArtifactCard
                        key={id}
                        id={id}
                        artifact={artifact}
                        onCraftArtifact={handlers.handleCraftArtifact}
                        isFirstPlaythrough={gameState.isFirstPlaythrough} // Передаем флаг, но он теперь не блокирует саму кнопку
                    />
                ))}
             </div>
        </div>
    );
};

export default ArtifactsView;