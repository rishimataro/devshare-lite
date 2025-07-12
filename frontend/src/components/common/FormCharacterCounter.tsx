'use client';

import React from 'react';

interface FormCharacterCounterProps {
    current: number;
    max?: number;
    min?: number;
    showMax?: boolean;
    showMin?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const FormCharacterCounter: React.FC<FormCharacterCounterProps> = ({
    current,
    max,
    min,
    showMax = true,
    showMin = false,
    style = {},
    className = ''
}) => {
    const getColor = () => {
        if (max && current > max) return '#ff4d4f';
        if (min && current < min) return '#ff4d4f';
        if (max && current > max * 0.9) return '#faad14';
        return '#999';
    };

    const getCounterText = () => {
        if (showMax && showMin && max && min) {
            return `${current} kí tự (ít nhất: ${min}, tối đa: ${max})`;
        }
        if (showMax && max) {
            return `${current}/${max}`;
        }
        if (showMin && min) {
            return `${current} kí tự (ít nhất: ${min})`;
        }
        return `${current} kí tự`;
    };

    return (
        <span 
            style={{ 
                fontSize: '12px', 
                color: getColor(),
                fontWeight: 'normal',
                ...style
            }}
            className={className}
        >
            {getCounterText()}
        </span>
    );
};

export default FormCharacterCounter;
