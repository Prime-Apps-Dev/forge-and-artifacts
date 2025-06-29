// src/components/ui/display/ModalDragHandle.jsx
import React from 'react';

const ModalDragHandle = () => {
    return (
        // Этот контейнер центрирует ручку и обеспечивает отступы.
        // Он виден только на мобильных устройствах (класс md:hidden).
        // mt-2 — это отступ в 8px сверху.
        // mb-4 — отступ снизу до заголовка для визуального баланса.
        <div className="w-full flex justify-center mt-0 mb-6 md:hidden">
            {/* Сама "ручка" для перетаскивания.
                w-20 (80px) — вдвое шире, чем w-10 (40px). */}
            <div className="w-20 h-1.5 bg-gray-600 rounded-full cursor-grab"></div>
        </div>
    );
};

export default ModalDragHandle;