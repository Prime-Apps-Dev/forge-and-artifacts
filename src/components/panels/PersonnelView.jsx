import React from 'react';
import { definitions } from '../../data/definitions';
import PersonnelUpgradeButton from '../ui/buttons/PersonnelUpgradeButton';

const PersonnelView = ({ gameState, handlers }) => {
    return (
        <div className="panel-section">
             <p className="text-gray-400 text-sm mb-4">Нанимайте и улучшайте подмастерьев, чтобы автоматизировать рутинную работу.</p>
             <div className="flex flex-col gap-4">
                 {Object.keys(definitions.personnel).map(id => <PersonnelUpgradeButton key={id} upgradeId={id} gameState={gameState} onBuyUpgrade={handlers.handleBuyUpgrade} />)}
             </div>
        </div>
    );
};

export default PersonnelView;