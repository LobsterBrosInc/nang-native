import Reflux from 'reflux'
import {
    ListView,
    AsyncStorage
} from 'react-native'

export const TrackListActions = Reflux.createActions([
    "getMoreTracks",
    "getInitialTracks"
]);

export class TrackListStore extends Reflux.Store {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            trackList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            currentTrackIds: [],
            trackData: [],
        }

        this.listenables = TrackListActions;
    }

    onGetInitialTracks(tracksURL){
        this.setState({
            nextTracksURL: tracksURL,
            trackList: this.state.trackList.cloneWithRows([]),
            trackData: []
        });
        this._fetchTracks();
    }

    onGetMoreTracks(){
        if(!this.state.loading && this.state.nextTracksURL){
            this._fetchTracks();
        }
    }

    async _fetchTracks(){
        try {
            this.setState({loading: true});
            let accessToken  = await AsyncStorage.getItem('LstnSpotifyAccessToken');
            let response = await fetch(this.state.nextTracksURL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            let json = await response.json();
            this._handleResponse(json);
        } catch (err) {
            console.log(err);
        }
    }

    _handleResponse (json) {
        let newTrackData = this.state.trackData.concat(json.items);
        this.setState({
            loading: false,
            nextTracksURL: json.next,
            trackData: newTrackData,
            trackList: this.state.trackList.cloneWithRows(newTrackData),
            currentTrackIds: this.state.currentTrackIds.concat(json.items.map(item => item.track.id))
        });
    }
}