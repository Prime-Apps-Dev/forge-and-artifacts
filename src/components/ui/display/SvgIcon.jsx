import React from 'react';

const SvgIcon = ({ iconId, className }) => (
            <svg className={className}><use href={`#${iconId}`} /></svg>
        );
export default SvgIcon;