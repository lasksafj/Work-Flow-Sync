import { Image, View } from 'react-native'
import React, { useState } from 'react'

const defaultImageUri = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com"

const SingleAvatar = ({ uri, size = 50, style }: any) => {
    const [img, setImg] = useState(uri);

    return (
        <Image
            source={{ uri: img || defaultImageUri }}
            style={[{ width: size, height: size, borderRadius: size }, style]}
            onError={() => setImg(defaultImageUri)}

        />
    )
}

const DoubleAvatar = ({ uri1, uri2, size = 50, style }: any) => {
    const [img1, setImg1] = useState(uri1);
    const [img2, setImg2] = useState(uri2);

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
            <Image
                source={{ uri: img2 || defaultImageUri }}
                style={{
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize,
                    position: 'absolute', top: innerSize / 20, left: innerSize / 20
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
                    position: 'absolute', bottom: innerSize / 20, right: innerSize / 20
                }}
                onError={() => setImg1(defaultImageUri)}
            />
        </View>
    );
};

const Avatar = ({ img = '', size = 50, style }: any) => {
    img = img || '';
    let groupImg;
    let imgArray = img.split(', ');
    if (imgArray.length <= 1) {
        groupImg = <SingleAvatar uri={imgArray[0]} size={size} style={style} />;
    }
    else {
        imgArray = imgArray.filter((i: string) => i.trim() !== '').slice(0, 2);
        while (imgArray.length < 2) {
            imgArray.push('');
        }
        groupImg = <DoubleAvatar uri1={imgArray[0]} uri2={imgArray[1]} size={size} style={style} />;
    }
    return groupImg;
}

export {
    SingleAvatar,
    DoubleAvatar,
    Avatar
}

