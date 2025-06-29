// src/components/panels/PersonnelView.jsx
import React from 'react';
import HiredPersonnelCard from '../ui/cards/HiredPersonnelCard';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';

const PersonnelView = () => {
    const { displayedGameState: gameState, handlers } = useGame();

    const hiredUniquePersonnel = gameState.hiredPersonnel;
    const now = Date.now();
    const availableSlots = gameState.personnelSlots.total - gameState.personnelSlots.used;

    return (
        <div className="panel-section">
             <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Персонал</h3>
             <p className="text-gray-400 text-sm mb-4">Нанимайте и управляйте сотрудниками, чтобы автоматизировать и оптимизировать работу вашей мастерской.
             <br/>
             Свободных слотов: <span className="font-bold text-white">{availableSlots}</span> / {gameState.personnelSlots.total}
             </p>

             <Button
                onClick={handlers.handleOpenHirePersonnelModal}
                variant="success"
                className="mb-6"
             >
                Нанять нового сотрудника
             </Button>

             {hiredUniquePersonnel.length > 0 ? (
                 <div>
                    <h4 className="font-cinzel text-orange-400 text-lg mb-3">Ваш штат</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {hiredUniquePersonnel.map(personnel => (
                            <HiredPersonnelCard
                                key={personnel.uniqueId}
                                personnel={personnel}
                            />
                        ))}
                    </div>
                 </div>
             ) : (
                 <p className="text-gray-500 italic text-center py-8">В вашем штате пока нет сотрудников. Нажмите "Нанять нового сотрудника"!</p>
             )}

             {Object.keys(gameState.personnelRestCooldowns).length > 0 && (
                 <div className="mt-6 pt-4 border-t border-gray-700/50">
                     <h4 className="font-cinzel text-red-400 text-lg mb-3">Заблокированные слоты</h4>
                     {Object.entries(gameState.personnelRestCooldowns).map(([uniqueId, endTime]) => {
                         const timeLeft = Math.ceil((endTime - now) / 1000);
                         if (timeLeft <= 0) return null;

                         return (
                             <div key={uniqueId} className="bg-red-900/20 border border-red-700 p-3 rounded-md text-sm text-red-300 flex justify-between items-center mb-2">
                                 <span>Слот заблокирован после увольнения</span>
                                 <span>Осталось: {timeLeft} сек.</span>
                             </div>
                         );
                     })}
                 </div>
             )}
        </div>
    );
};

export default PersonnelView;