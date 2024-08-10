import { Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InitialNameAvatar from './InitialNameAvatar';

const defaultImageUri = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com"

const SingleAvatar = ({ uri, name, size = 50, style }: any) => {
    const [img, setImg] = useState(uri);

    useEffect(() => {
        setImg(uri);
    }, [uri]);

    if (!img && !name) {
        return (
            <Image
                source={{ uri: defaultImageUri }}
                style={[{ width: size, height: size, borderRadius: size }, style]}
            />
        )
    }

    return (
        img ?
            <Image
                source={{ uri: img }}
                style={[{ width: size, height: size, borderRadius: size }, style]}
                onError={() => setImg('')}
            />
            :
            <InitialNameAvatar size={size} name={name} style={style} />
    )
}

const DoubleAvatar = ({ uri1, name1, uri2, name2, size = 50, style }: any) => {
    const [img1, setImg1] = useState(uri1);
    const [img2, setImg2] = useState(uri2);

    useEffect(() => {
        setImg1(uri1);
    }, [uri1]);

    useEffect(() => {
        setImg2(uri2);
    }, [uri2]);

    const outerSize = size;
    const innerSize = outerSize * 2 / 3;
    return (

        <View style={[{
            // borderRadius: outerSize,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: outerSize, height: outerSize,
        }, style]}>
            <SingleAvatar
                uri={img2}
                name={name2}
                size={innerSize}
                style={{
                    position: 'absolute', top: 0, left: 0
                }}
            />
            <SingleAvatar
                uri={img1}
                name={name1}
                size={innerSize}
                style={{
                    borderColor: 'white',
                    borderWidth: 2,
                    position: 'absolute', bottom: 0, right: 0
                }}
            />

            {/* <Image
                source={{ uri: img2 || defaultImageUri }}
                style={{
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize,
                    position: 'absolute', top: 0, left: 0
                }}
                onError={() => setImg2(defaultImageUri)}
            />
            <Image
                source={{ uri: img1 || defaultImageUri }}
                style={{
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize / 2,
                    borderColor: 'white',
                    borderWidth: 2,
                    position: 'absolute', bottom: 0, right: 0
                }}
                onError={() => setImg1(defaultImageUri)}
            /> */}
        </View>
    );
};

const Avatar = ({ img = '', size = 50, name = '', style }: any) => {
    img = img || '';
    name = name || '';

    let groupImg;
    let imgArray = img.split(',').map((e: string) => e.trim());
    let nameArray = name.split(',').map((e: string) => e.trim());

    if (imgArray.length <= 1) {
        groupImg = <SingleAvatar uri={imgArray[0]} name={nameArray[0]} size={size} style={style} />;
    }
    else {
        const imgNameArr = imgArray.map((e: string, i: number) => [e, nameArray[i] || '']);
        let res = [];
        for (let i = 0; i < imgNameArr.length; i++) {
            if (imgNameArr[i][0])
                res.push(imgNameArr[i])
        }
        for (let i = 0; i < imgNameArr.length && res.length < 2; i++) {
            if (!imgNameArr[i][0] && imgNameArr[i][1])
                res.push(imgNameArr[i])
        }
        while (res.length < 2) {
            res.push(['', '']);
        }

        groupImg = <DoubleAvatar
            uri1={res[0][0]} name1={res[0][1]}
            uri2={res[1][0]} name2={res[1][1]}
            size={size} style={style} />;
    }
    return groupImg;
}

export {
    SingleAvatar,
    DoubleAvatar,
    Avatar
}

