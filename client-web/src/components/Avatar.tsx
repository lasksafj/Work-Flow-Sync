// Avatar.tsx

import React, { useEffect, useState, CSSProperties } from 'react';
// import './AvatarStyles.css';
import InitialNameAvatar from './InitialNameAvatar';

const defaultImageUri = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com";

interface SingleAvatarProps {
    uri?: string;
    name?: string;
    size?: number;
    style?: CSSProperties;
}

const SingleAvatar: React.FC<SingleAvatarProps> = ({ uri, name, size = 50, style }) => {
    const [img, setImg] = useState<string | undefined>(uri);

    useEffect(() => {
        setImg(uri);
    }, [uri]);

    if (!img && !name) {
        return (
            <img
                src={defaultImageUri}
                alt="avatar"
                style={{ width: size, height: size, borderRadius: '50%', ...style }}
            />
        );
    }

    return img ? (
        <img
            src={img}
            alt="avatar"
            style={{ width: size, height: size, borderRadius: '50%', ...style }}
            onError={() => setImg(undefined)}
        />
    ) : (
        <InitialNameAvatar size={size} name={name || ''} style={style} />
    );
};

interface DoubleAvatarProps {
    uri1?: string;
    name1?: string;
    uri2?: string;
    name2?: string;
    size?: number;
    style?: CSSProperties;
}

const DoubleAvatar: React.FC<DoubleAvatarProps> = ({ uri1, name1, uri2, name2, size = 50, style }) => {
    const [img1, setImg1] = useState<string | undefined>(uri1);
    const [img2, setImg2] = useState<string | undefined>(uri2);

    useEffect(() => {
        setImg1(uri1);
    }, [uri1]);

    useEffect(() => {
        setImg2(uri2);
    }, [uri2]);

    const outerSize = size;
    const innerSize = outerSize * 2 / 3;

    return (
        <div
            style={{
                width: outerSize,
                height: outerSize,
                position: 'relative',
                ...style
            }}
            className="avatar-container"
        >
            <SingleAvatar
                uri={img2}
                name={name2}
                size={innerSize}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />
            <SingleAvatar
                uri={img1}
                name={name1}
                size={innerSize}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    border: '2px solid white',
                }}
            />
        </div>
    );
};

interface AvatarProps {
    img?: string;
    size?: number;
    name?: string;
    style?: CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({ img = '', size = 50, name = '', style }) => {
    img = img || '';

    const imgArray = img.split(',').map(e => e.trim());
    const nameArray = name.split(',').map(e => e.trim());

    let groupImg;
    if (imgArray.length <= 1) {
        groupImg = <SingleAvatar uri={imgArray[0]} name={nameArray[0]} size={size} style={style} />;
    } else {
        const imgNameArr = imgArray.map((e, i) => [e, nameArray[i] || '']);
        let res = imgNameArr.filter(e => e[0] || e[1]).slice(0, 2);
        while (res.length < 2) res.push(['', '']);

        groupImg = (
            <DoubleAvatar
                uri1={res[0][0]} name1={res[0][1]}
                uri2={res[1][0]} name2={res[1][1]}
                size={size} style={style}
            />
        );
    }
    return groupImg;
};

export { SingleAvatar, DoubleAvatar, Avatar };
