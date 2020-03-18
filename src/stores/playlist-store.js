import Reflux from 'reflux'
import {
    ListView,
    AsyncStorage
} from 'react-native'

export const PlaylistActions = Reflux.createActions([
    "getInitialPlaylists",
    // "getMorePlaylists"
]);

export class PlaylistStore extends Reflux.Store {
    constructor(props) {
      super(props);

      this.state = {
        playlistList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      };
      this.listenables = PlaylistActions;
    }

    onGetInitialPlaylists(){
        this._fetchPlaylists();
    }

    async _fetchPlaylists(){
        this.loading = true;
        this.setState({loading: true})
        try {
            let accessToken = await AsyncStorage.getItem('LstnSpotifyAccessToken');
            let response = await fetch("https://api.spotify.com/v1/me/playlists", {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            let json = await response.json();
            this.setState({
                loading: false,
                playlistList: this.state.playlistList.cloneWithRows(json.items)
            });
        } catch (err) {
            console.log(err);
        }
    }
}