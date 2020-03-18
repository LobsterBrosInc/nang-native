import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    PanResponder,
    NativeModules,
    Image
} from 'react-native'
import _ from 'lodash';

//BEWARE: this does not yet install from npm install react-native-gpuimage --save.
//        had to import manually into node_modules from https://github.com/lvbingru/react-native-gpuimage
// import GPUImageView from 'react-native-gpuimage'
import { PlayerStore } from '@stores/player.store'

const { NangController } = NativeModules;

export default class AlbumArt extends Reflux.Component {
    static propTypes = {
        playbackControls: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            pixelRatio: 0.01,
            lastPress: 0
        };
        this.store = PlayerStore;
    }

    componentDidMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                if(Math.abs(gestureState.dy) > Math.abs(gestureState.dx)){
                    let newRatio = this.state.pixelRatio + 0.05 * (gestureState.dy/Dimensions.get('window').height);
                    if(newRatio > 0 && newRatio < 0.05) this.setState({pixelRatio: newRatio});
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if(this.props.playbackControls){
                    const trackChangeThreshold = 100;
                    let currentTrackIndex = this.state.currentTrackIndex;
                    if(gestureState.dx > trackChangeThreshold && currentTrackIndex > 0){
                        NangController.playPreviousTrack();
                    } else if (gestureState.dx < -trackChangeThreshold && currentTrackIndex < _.size(this.state.currentTrackIds) - 1){
                        NangController.playNextTrack();
                    }

                    this._detectDoubleTap();
                }
            }
        });
        super.componentDidMount();
    }

    _detectDoubleTap(){
        let delta = new Date().getTime() - this.state.lastPress;
        if(delta < 200) NangController.playPauseTrack();
        this.setState({lastPress: new Date().getTime()});
    }

    render() {
        return (
            <Image
                {...this._panResponder.panHandlers}
                style={styles.albumArt}
                source={{uri: _.get(this.state.currentAlbum, 'images[0].url')}}
                resizeMode="cover"
                filters={
                    [
                        {
                            name: 'GPUImagePixellateFilter',
                            params: {
                                // fractionalWidthOfAPixel: this.state.pixelRatio * (1 - this.props.seekerPosition)
                                fractionalWidthOfAPixel: this.state.pixelRatio
                            }
                        }
                    ]
                }
            />
        );
    }
}

let styles = StyleSheet.create({
    albumArt: {
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});