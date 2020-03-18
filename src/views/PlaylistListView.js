import Reflux from 'reflux';
import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { BurgerButton, LstnText } from '@components'

import { PlaylistStore, PlaylistActions } from '@stores/playlist.store';

export default class PlaylistListView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = PlaylistStore;
    }

    componentDidMount() {
        PlaylistActions.getInitialPlaylists();
    }

    _goToPlaylist(playlistTracksHref){
        this.props.navigation.navigate('trackList', {
            playlistTracksHref: playlistTracksHref
        });
    }

    render() {
        return (
            <View style={styles.view}>
                <BurgerButton openDrawer={()=>this.props.navigation.openDrawer()}/>
                <FlatList
                    style={styles.listView}
                    data={this.state.playlistList}
                    enableEmptySections={true}
                    renderItem={(item, sectionId, index) => {
                        return (
                            <TouchableOpacity onPress={()=>this._goToPlaylist(item.tracks.href)}>
                                <View style={styles.listItem}>
                                    <LstnText text={item.name} style={{fontSize: 15, textAlign: 'center'}}/>
                                </View>
                            </TouchableOpacity>
                        )}
                    }
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    listView: {
        marginTop: 50
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'blue',
        borderBottomWidth: 1,
        borderColor: 'yellow'
    }
});