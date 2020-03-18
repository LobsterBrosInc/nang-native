import Reflux from 'reflux';
import { AsyncStorage } from 'react-native';
import { UserActions } from '../stores/user-store';
import MusicControlService from '../services/music-control.service';
import _ from 'lodash';


export const PlayerActions = Reflux.createActions([
    "trackChange",
    "updateSeeker",
    "updatePlayback",
    "updateIsPlaying",
    "updateCurrentTrackIds"
]);

export class PlayerStore extends Reflux.Store {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: true,
            currentAlbum: {},
            currentTrackIds: [],
            currentTrackIndex: 0,
            currentTrackDuration: 0,
            seekerPosition: 0
        };
        this.listenables = PlayerActions;
        this.musicControlService = new MusicControlService();
    }

    onUpdateIsPlaying(isPlaying){
        UserActions.updateUser({isPlaying: isPlaying});
        this.setState({isPlaying: isPlaying})
    }

    onUpdateSeeker(seekerPosition){
        this.setState({seekerPosition: seekerPosition})
    }

    onUpdatePlayback(progressTime){
        UserActions.updateUser({currentTrack: {progress: progressTime, timePosted: Date.now()}});
        this.setState({ seekerPosition: progressTime / this.state.currentTrackDuration });
    }

    onUpdateCurrentTrackIds(currentTrackIds){
        UserActions.updateUser({currentTrackIds: currentTrackIds});
        this.setState({ currentTrackIds: currentTrackIds })
    }

    async onTrackChange(trackId){
        try {
            let accessToken = await AsyncStorage.getItem('LstnSpotifyAccessToken');
            let response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            let json = await response.json();
            let newTrackIndex = _.indexOf(this.state.currentTrackIds, trackId);
            UserActions.updateUser({currentTrackIndex: newTrackIndex});
            this.setState({
                currentTrackIndex: newTrackIndex,
                currrentTrackProgress: 0,
                currentAlbum: json.album,
                currentTrackDuration: json.duration_ms / 1000
            });
            this.musicControlService.setDrawerContent(json);
        } catch (err) {
            console.log(err);
        }
    }
}