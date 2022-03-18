import React from 'react';
import { View, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Component } from 'react/cjs/react.production.min';

export default class NavigationIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageWidth: this.props.imageWidth,
            imageHeight: this.props.imageHeight,
            imageSource: this.props.imageSource,
            imageFocus: this.props.imageFocus,
        };
    }

    render() {
        return (
            <View>
                <Image
                    source={this.state.imageSource}
                    resizeMode="contain"
                    style={{
                        width: this.state.imageWidth,
                        height: this.state.imageHeight,
                        tintColor: this.state.imageFocus ? '#FF8F8F' : '#C4C4C4',
                    }}
                />
            </View>
        );
    }
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
