// src/components/ui/display/ImageWithFallback.jsx
import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({ src, fallbackSrc, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src); // Обновляем src, если пропсы изменились
    }, [src]);

    const handleError = () => {
        if (imgSrc !== fallbackSrc) { // Предотвращаем бесконечный цикл, если и заглушка не загрузится
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc || fallbackSrc}
            onError={handleError}
            {...props}
        />
    );
};

export default ImageWithFallback;