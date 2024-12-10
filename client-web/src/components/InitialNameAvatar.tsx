// InitialNameAvatar.tsx

import React, { CSSProperties } from 'react';
// import './AvatarStyles.css';

const getColorFromName = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;

    const factor = 0.7;
    const darkR = Math.floor(r * factor);
    const darkG = Math.floor(g * factor);
    const darkB = Math.floor(b * factor);

    return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
};

interface InitialNameAvatarProps {
    name: string;
    size?: number;
    style?: CSSProperties;
}

const InitialNameAvatar: React.FC<InitialNameAvatarProps> = ({ name, size = 50, style }) => {
    const color = getColorFromName(name);

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div
            style={{
                backgroundColor: color,
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...style
            }}
            className="initial-avatar"
        >
            <span style={{ color: '#fff', fontSize: size / 2, fontWeight: 'bold' }}>
                {getInitials(name)}
            </span>
        </div>
    );
};

export default InitialNameAvatar;
