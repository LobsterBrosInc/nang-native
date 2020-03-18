import {
    ListView,
    AsyncStorage
} from 'react-native'

import Reflux from 'reflux'
import _ from 'lodash'

export const SearchActions = Reflux.createActions([
    "getMoreTracks",
    "getSearchResults",
    "saveTrack"
]);

export class SearchStore extends  Reflux.Store {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          trackList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
          currentTrackIds: [],
          trackData: [],
      }

      this.listenables = SearchActions;
      this._fetchQueryDebounce = _.debounce(this._fetchQuery, 250);
    }

    onGetSearchResults(query){
        if (query.length) {
            this._fetchQueryDebounce(query);
        } else {
            // clear list
            this.setState({trackList: this.state.trackList.cloneWithRows([])});
        }
    }

    onGetMoreTracks(){
        if(!this.state.loading && this.state.nextTracksURL){
            this._fetchTracks();
        }
    }

    async onSaveTrack (trackId) {
        try {
            let accessToken = await AsyncStorage.getItem('LstnSpotifyAccessToken');
            let response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    _fetchQuery (query) {
        this.setState({
            nextTracksURL: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
            trackList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            currentTrackIds: [],
            trackData: []
        });
        this._fetchTracks();
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
        let tracks = json.tracks;
        let newTrackData = this.state.trackData.concat(tracks.items);
        this.setState({
            loading: false,
            nextTracksURL: tracks.next,
            trackData: newTrackData,
            trackList: this.state.trackList.cloneWithRows(newTrackData),
            currentTrackIds: this.state.currentTrackIds.concat(tracks.items.map(item => item.id))
        });
    }
};