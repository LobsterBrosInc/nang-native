import React from 'react';
import Reflux from 'reflux';
import {
    View,
    Dimensions,
    StyleSheet,
    NativeModules,
    NativeEventEmitter
} from 'react-native';

import BurgerButton from './BurgerButton'
import AlbumArt from './AlbumArt'

import { PlayerStore, PlayerActions } from '../stores/player-store'
import _ from 'lodash'

let { NangController } = NativeModules;
let LstnEventEmitter = new NativeEventEmitter(NangController);

export default class LstnPlayer extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = PlayerStore;
    }

    componentDidMount() {
        this.eventListeners = {
            trackChangeListener:     LstnEventEmitter.addListener('trackChange', PlayerActions.trackChange),
            isPlayingChangeListener: LstnEventEmitter.addListener('isPlayingChange', PlayerActions.updateIsPlaying),
            trackProgressChangeListener: LstnEventEmitter.addListener('trackProgressChange', PlayerActions.updatePlayback),
        };
    }

    componentWillUnmount(){
        _.each(this.eventListeners, eventListener => eventListener.remove());
        super.componentWillUnmount();
    }

    // _seekTrack(event){
    //     let percentPlayed = event.nativeEvent.pageX/Dimensions.get('window').width;
    //     let progressTime = this.state.playerData.currentTrackDuration * percentPlayed;
    //     NangController.seekTrackToOffest(progressTime, (error) => {
    //         this.setState({seekerPosition: percentPlayed })
    //         this.user.update({currentTrackProgress: progressTime})
    //     });
    // },

    render() {
        return (
            <View style={styles.lstnContainer}>
                <AlbumArt playbackControls={true}/>
                <BurgerButton openDrawer={()=>this.props.navigation.openDrawer()}/>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    lstnContainer: {
        flex: 1
    }
});