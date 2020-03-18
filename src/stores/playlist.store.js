import Reflux from 'reflux'
import {
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
        playlistList: []
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
            let { items } = await response.json();
            this.setState({
                loading: false,
                playlistList: items
            });
        } catch (err) {
            console.log(err);
        }
    }
}