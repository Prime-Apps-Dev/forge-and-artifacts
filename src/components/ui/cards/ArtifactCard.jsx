// src/components/ui/cards/ArtifactCard.jsx
import React from 'react';
import { getArtifactImageSrc } from '../../../utils/helpers';
import { useGame } from '../../../context/GameContext.jsx';
import Button from '../buttons/Button.jsx';

const ArtifactCard = React.memo(({ artifact, id }) => {
    const { handlers } = useGame();

    const canCraft = Object.values(artifact.components).every(c => c.obtained) && artifact.status === 'available';
    const artifactImgSrc = getArtifactImageSrc(id, 64);

    return (
        <div key={id} className={`bg-black/20 p-4 rounded-lg border-2 flex flex-col text-center transition-all ${artifact.status === 'completed' ? 'border-orange-500' : 'border-gray-700'}`}>
            <img src={artifactImgSrc} alt={artifact.name} className={`mx-auto mb-2 w-16 h-16 object-contain img-rounded-corners ${artifact.status === 'completed' ? 'grayscale-0' : 'grayscale'}`} />
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
            <Button
                onClick={() => handlers.handleCraftArtifact(id)}
                disabled={!canCraft}
                className="mt-4"
            >
                {artifact.status === 'completed' && 'Создан'}
                {artifact.status === 'available' && 'Создать Артефакт'}
                {artifact.status === 'locked' && 'Компоненты не найдены'}
            </Button>
        </div>
    );
});

export default ArtifactCard;