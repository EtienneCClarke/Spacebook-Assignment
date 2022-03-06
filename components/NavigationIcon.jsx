import React from 'react';
import { View, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';

export default function NavigationIcon({
    imageWidth,
    imageHeight,
    imageSource,
    imageFocus,
}) {
    return (
        <View>
            <Image
                source={imageSource}
                resizeMode="contain"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    tintColor: imageFocus ? '#FF8F8F' : '#C4C4C4',
                }}
            />
        </View>
    );
}

NavigationIcon.defaultProps = {
    imageWidth: 20,
    imageHeight: 20,
    imageSource: 'Unable to load image',
};

NavigationIcon.propTypes = {
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    imageSource: Platform.OS === 'web' ? PropTypes.string : PropTypes.number,
    imageFocus: PropTypes.bool.isRequired,
};
