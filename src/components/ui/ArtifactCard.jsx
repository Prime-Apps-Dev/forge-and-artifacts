import React from 'react';
import SvgIcon from './SvgIcon';
import { definitions } from '../../data/definitions';
import Tooltip from './Tooltip';

const ArtifactCard = React.memo(({ artifact, id, onCraftArtifact, isFirstPlaythrough }) => { // isFirstPlaythrough больше не используется для блокировки
    const checkCanCraft = (currentArtifact) => {
        return Object.values(currentArtifact.components).every(c => c.obtained);
    };

    const canCraft = checkCanCraft(artifact) && artifact.status === 'available';

    // ИЗМЕНЕНИЕ: isLockedByFirstPlaythrough больше не используется для блокировки кнопки
    // const isLockedByFirstPlaythrough = isFirstPlaythrough && artifact.firstPlaythroughLocked;

    return (
        // ИЗМЕНЕНИЕ: Удалены классы, связанные с firstPlaythroughLocked
        <div key={id} className={`bg-black/20 p-4 rounded-lg border-2 flex flex-col text-center transition-all ${artifact.status === 'completed' ? 'border-orange-500' : 'border-gray-700'}`}>
            <SvgIcon iconId={artifact.icon} className={`icon-sprite-lg mx-auto mb-2 ${artifact.status === 'completed' ? 'text-orange-400' : 'text-gray-500'}`}/>
            <h3 className="font-cinzel text-lg font-bold">{artifact.name}</h3>
            <p className="text-sm text-gray-400 grow my-2">{artifact.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-700 text-left space-y-2">
                <h4 className="font-bold text-base text-center mb-2">Компоненты</h4>
                {Object.entries(artifact.components).map(([compId, comp]) => (
                    <div key={compId} className="flex items-center gap-2 text-sm">
                        <span className={`material-icons-outlined ${comp.obtained ? 'text-green-500' : 'text-gray-600'}`}>
                            {comp.obtained ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>{comp.name}</span>
                    </div>
                ))}
            </div>
            {/* ИЗМЕНЕНИЕ: Кнопка всегда отображается и блокируется только по canCraft/status */}
            <button 
                onClick={() => onCraftArtifact(id)}
                disabled={!canCraft || artifact.status !== 'available'}
                className="mt-4 w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-orange-500"
            >
                {artifact.status === 'completed' && 'Создан'}
                {artifact.status === 'available' && 'Создать Артефакт'}
                {artifact.status === 'locked' && 'Компоненты не найдены'}
            </button>
        </div>
    );
});

export default ArtifactCard;