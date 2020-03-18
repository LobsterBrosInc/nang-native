import React from 'react';
import {
    View,
    StyleSheet,
    NativeModules,
    NativeEventEmitter,
    ActivityIndicator
} from 'react-native'

import BurgerButton from './BurgerButton'
import AlbumArt from './AlbumArt'
import { PlayerActions } from '../stores/player-store'

import firebase from 'firebase'
import _ from 'lodash'

const { NangController } = NativeModules;
const LstnEventEmitter = new NativeEventEmitter(NangController);

export default class LstnToHomie extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTrackProgress: 0,
            //should these be done in the PlayerStore?
            synced: false,
            isPlaying: true
        };
    }

    async componentDidMount() {
        NangController.setVolume(0.0);
        const lstnToHomie = this.props.navigation.getParam('lstnToHomie');
        this.homie = firebase.database().ref(`users/${lstnToHomie.id}`);
        try {
            let snapshot = await this.homie.once("value");
            this.playbackData = snapshot.val();
            this._setupListening();
            this._playTracksById();
        } catch (err) {
            console.log(err);
        }

        this.eventListeners = {
            trackChangeListener: LstnEventEmitter.addListener('trackChange', (trackId) => {
                NangController.setVolume(0.0);
                this.setState({synced: false});
                PlayerActions.trackChange(trackId);
            }),
            isPlayingChangeListener: LstnEventEmitter.addListener('isPlayingChange',(isPlaying) => {
                NangController.setVolume(0.0);
                this.setState({synced: false, isPlaying: isPlaying});
                PlayerActions.updateIsPlaying(isPlaying);
            }),
            trackProgressChangeListener: LstnEventEmitter.addListener('trackProgressChange',(progressTime) => {
                this.setState({currentTrackProgress: progressTime});
                PlayerActions.updatePlayback(progressTime);
            })
        };
    }

    componentWillUnmount(){
        _.each(this.eventListeners, (eventListener) => eventListener.remove());
        this.homie.off('child_changed');
    }

    _playTracksById(){
        let trackProgress = this.playbackData.currentTrack.progress + (Date.now() - this.playbackData.currentTrack.timePosted) / 1000;
        PlayerActions.updateCurrentTrackIds(this.playbackData.currentTrackIds);
        NangController.playTracksById(this.playbackData.currentTrackIds, this.playbackData.currentTrackIndex.toString(), this.playbackData.currentTrack.progress);
    }

    _setupListening(){
        this.homie.on('child_changed', childSnapshot => {
            switch (childSnapshot.key) {
                case "currentTrack":
                    if(Math.abs(this.state.currentTrackProgress - childSnapshot.val().progress) > 0.005 && !this.state.synced) {
                        console.log("ADJUST", Math.abs(this.state.currentTrackProgress - childSnapshot.val().progress));
                        let latency = (Date.now() - childSnapshot.val().timePosted) / 1000;
                        NangController.seekTrackToOffest(childSnapshot.val().progress + latency, thing => console.log(thing));
                    } else {
                        NangController.setVolume(1.0);
                        this.setState({synced: true});
                    }
                    break;
                case "currentTrackIndex":
                    this.playbackData.currentTrackIndex = childSnapshot.val();
                    this.playbackData.currentTrack.progress = 0;
                    this._playTracksById();
                    break;
                case "isPlaying":
                    NangController.playPauseTrack();
                    break;
                default:
                    console.log(childSnapshot.key, childSnapshot.val());
            }
        }, err => {
            console.log(err)
        });
    }

    render() {
        return (
            <View style={styles.lstnContainer}>
                <AlbumArt playbackControls={false}/>
                <BurgerButton openDrawer={()=>this.props.navigation.openDrawer()}/>
                <ActivityIndicator color="#F95300" animating={!this.state.synced && this.state.isPlaying}/>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    albumArt: {
        height: 350,
        justifyContent: "space-around",
        resizeMode: "contain"
    }
});