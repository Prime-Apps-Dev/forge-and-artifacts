// src/components/ui/display/NetworkStatusIndicator.jsx
import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

const NetworkStatusIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const tooltipText = isOnline ? "Соединение с сетью установлено" : "Оффлайн-режим";
    const icon = isOnline ? 'wifi' : 'wifi_off';
    const colorClass = isOnline ? 'text-green-400' : 'text-gray-500';

    return (
        <div className="network-status-indicator">
            <Tooltip text={tooltipText}>
                <span className={`material-icons-outlined transition-colors duration-500 ${colorClass}`}>
                    {icon}
                </span>
            </Tooltip>
        </div>
    );
};

export default NetworkStatusIndicator;