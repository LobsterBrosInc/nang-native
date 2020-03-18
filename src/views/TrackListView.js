import React from 'react';
import Reflux from 'reflux';

import {
  View,
  FlatList,
  StyleSheet,
  NativeModules,
  TouchableOpacity
} from 'react-native';

const { NangController } = NativeModules;

import { BurgerButton, LstnText } from '@components'

import { PlayerActions } from '@stores/player.store'
import { TrackListStore, TrackListActions } from '@stores/trackList.store';


export default class TrackListView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = TrackListStore;
    }

    componentDidMount() {
        const playlistTracksHref = this.props.route['params'] && this.props.route.params['playlistTracksHref'];
        TrackListActions.getInitialTracks(playlistTracksHref || `https://api.spotify.com/v1/me/tracks?limit=50`);
    }

    _lstnToTrack(index){
        PlayerActions.updateCurrentTrackIds(this.state.currentTrackIds);
        NangController.playTracksById(this.state.currentTrackIds, index.toString(), 0);
        this.props.navigation.navigate('player');
    }

    render() {
        return (
            <View style={styles.view}>
                <BurgerButton openDrawer={()=>this.props.navigation.openDrawer()}/>
                <FlatList
                    style={styles.listView}
                    data={this.state.trackList}
                    enableEmptySections={true}
                    onEndReached={TrackListActions.getMoreTracks}
                    renderItem={(item, sectionId, index) => {
                        return (
                            <TouchableOpacity  onPress={()=>this._lstnToTrack(index)}>
                                <View style={styles.listItem}>
                                    <LstnText text={item.track.name} style={{fontSize: 15, textAlign: 'center'}}/>
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
        marginTop: 50,
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'purple',
        borderBottomWidth: 1,
        borderColor: 'yellow'
    }
});